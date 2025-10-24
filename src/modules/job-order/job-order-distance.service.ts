import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { JobOrder } from '../../entities/job-order.entity';
import { Location } from '../../entities/location.entity';

@Injectable()
export class JobOrderDistanceService {
    constructor(
        @InjectRepository(JobOrder)
        private jobOrderRepo: Repository<JobOrder>,

        @InjectRepository(Location)
        private locationRepo: Repository<Location>,
    ) { }

    async calculateDistance(jobOrderId: number) {
        const ORS_API_KEY = process.env.ORS_API_KEY;
        const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
        const RAJAONGKIR_BASE_URL =
            process.env.RAJAONGKIR_BASE_URL ||
            'https://api.rajaongkir.com/starter';

        if (!ORS_API_KEY) {
            throw new HttpException(
                'Missing ORS_API_KEY in environment',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const jobOrder = await this.jobOrderRepo.findOne({
            where: { id: jobOrderId },
            relations: ['locations'],
        });

        if (!jobOrder) {
            throw new HttpException('Job Order not found', HttpStatus.NOT_FOUND);
        }

        const pickup = jobOrder.locations.find((loc) => loc.type === 'pickup');
        const destination = jobOrder.locations.find(
            (loc) => loc.type === 'destination',
        );

        if (!pickup || !destination) {
            throw new HttpException(
                'Pickup or destination location not found',
                HttpStatus.BAD_REQUEST,
            );
        }

        const latLngValid = (lat: any, lng: any) =>
            lat !== null &&
            lng !== null &&
            !isNaN(Number(lat)) &&
            !isNaN(Number(lng)) &&
            Math.abs(Number(lat)) <= 90 &&
            Math.abs(Number(lng)) <= 180;

        if (
            !latLngValid(pickup.lat, pickup.lng) ||
            !latLngValid(destination.lat, destination.lng)
        ) {
            throw new HttpException('Invalid coordinates', HttpStatus.BAD_REQUEST);
        }

        console.log('🛰️ ORS Request Coordinates:', {
            pickup: { lat: pickup.lat, lng: pickup.lng },
            destination: { lat: destination.lat, lng: destination.lng },
        });

        let distance_km = 0;
        let duration_minutes = 0;

        try {
            const payload = {
                coordinates: [
                    [Number(pickup.lng), Number(pickup.lat)],
                    [Number(destination.lng), Number(destination.lat)],
                ],
                radiuses: [5000, 5000],
            };

            const isJWT = ORS_API_KEY.startsWith('ey');

            const orsRes = await axios.post(
                'https://api.openrouteservice.org/v2/directions/driving-car',
                payload,
                {
                    headers: {
                        Authorization: isJWT ? `Bearer ${ORS_API_KEY}` : ORS_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                },
            );

            const summary = orsRes.data?.features?.[0]?.properties?.summary;
            if (summary) {
                distance_km = summary.distance / 1000;
                duration_minutes = summary.duration / 60;
            }
        } catch (error: any) {
            console.error('❌ ORS Error:', error.response?.data || error.message);
            console.warn('⚠️ ORS fallback activated.');
            distance_km = 10;
            duration_minutes = 30;
        }

        let shippingCosts: any[] = [];

        if (RAJAONGKIR_API_KEY) {
            try {
                const formData = new URLSearchParams({
                    origin: String(pickup.city_id || 501),
                    destination: String(destination.city_id || 114),
                    weight: String(Math.round((jobOrder.total_weight ?? 1) * 1000)),
                    courier: 'jne:sicepat:jnt:anteraja:tiki:pos',
                    price: 'lowest',
                });

                const response = await axios.post(
                    `${RAJAONGKIR_BASE_URL}/calculate/district/domestic-cost`,
                    formData,
                    {
                        headers: {
                            Key: RAJAONGKIR_API_KEY,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        timeout: 10000,
                    },
                );

                const data = response.data;

                if (data?.meta?.status === 'success' && Array.isArray(data.data)) {
                    shippingCosts = data.data.map((item: any) => ({
                        name: item.name || item.courier,
                        service: item.service,
                        description: item.description,
                        cost: item.cost,
                        etd: item.etd,
                    }));
                } else if (data?.rajaongkir?.results) {
                    shippingCosts = data.rajaongkir.results.flatMap((courier: any) =>
                        courier.costs.map((cost: any) => ({
                            name: courier.name,
                            service: cost.service,
                            description: cost.description,
                            cost: cost.cost[0].value,
                            etd: cost.cost[0].etd,
                        })),
                    );
                } else {
                    console.warn('⚠️ Unexpected RajaOngkir response:', data);
                }
            } catch (error: any) {
                console.error('⚠️ RajaOngkir Error:', error.response?.data || error.message);
            }
        }

        return {
            distance: {
                distance_km: Number(distance_km.toFixed(2)),
                duration_minutes: Number(duration_minutes.toFixed(2)),
            },
            cost: shippingCosts,
        };
    }
}
