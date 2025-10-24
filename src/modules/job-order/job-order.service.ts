import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOrder } from '../../entities/job-order.entity';
import { Manifest } from '../../entities/manifest.entity';
import { Location } from '../../entities/location.entity';
import { StatusJobOrder } from '../../entities/status-job-order.entity';

@Injectable()
export class JobOrderService {
    constructor(
        @InjectRepository(JobOrder) private jobRepo: Repository<JobOrder>,
        @InjectRepository(Manifest) private manifestRepo: Repository<Manifest>,
        @InjectRepository(Location) private locationRepo: Repository<Location>,
        private readonly httpService: HttpService,
    ) { }

    async getAllJobOrders() {
        return await this.jobRepo.find({
            relations: ['driver', 'vehicle', 'status', 'locations', 'manifests'],
            order: { id: 'DESC' },
        });
    }

    async getJobOrderDetail(id: number) {
        const jobOrder = await this.jobRepo.findOne({
            where: { id },
            relations: ['driver', 'vehicle', 'status', 'locations', 'manifests'],
        });

        if (!jobOrder) throw new NotFoundException('Job Order not found');

        const pickup = jobOrder.locations.find(loc => loc.type === 'pickup');
        const destination = jobOrder.locations.find(loc => loc.type === 'destination');

        const distanceInfo = await this.calculateDistance(
            pickup.lat,
            pickup.lng,
            destination.lat,
            destination.lng
        );

        return { ...jobOrder, distanceInfo };
    }

    private async calculateDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
        const apiKey = process.env.ORS_API_KEY;
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`;
        try {
            const response = await this.httpService.axiosRef.get(url);
            const summary = response.data.features[0].properties.summary;
            return {
                distance_km: (summary.distance / 1000).toFixed(2),
                duration_minutes: (summary.duration / 60).toFixed(1),
            };
        } catch (error) {
            console.error('ORS API error:', error.message);
            return null;
        }
    }

    async getRajaOngkirCost(originCityId: number, destinationCityId: number, weight: number) {
        const baseUrl = process.env.RAJAONGKIR_BASE_URL;
        const apiKey = process.env.RAJAONGKIR_API_KEY;

        try {
            const response = await this.httpService.axiosRef.post(
                `${baseUrl}/cost`,
                {
                    origin: originCityId,
                    destination: destinationCityId,
                    weight,
                    courier: 'jne',
                },
                { headers: { key: apiKey } }
            );
            return response.data.rajaongkir.results;
        } catch (err) {
            console.error('RajaOngkir API error:', err.message);
            return null;
        }
    }
}
