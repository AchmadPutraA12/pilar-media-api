import { Expose, Type } from 'class-transformer';

export class LocationDto {
    @Expose() id: number;
    @Expose() type: string;
    @Expose() address: string;
    @Expose() lat: string;
    @Expose() lng: string;
    @Expose() province: string;
    @Expose() city: string;
    @Expose() district: string;
}

export class ManifestDto {
    @Expose() id: number;
    @Expose() item_name: string;
    @Expose() quantity: number;
    @Expose() weight: number;
    @Expose() volume: number;
    @Expose() notes: string;
}

export class VehicleDto {
    @Expose() id: number;
    @Expose() nama_kendaraan: string;
    @Expose() plate_number: string;
    @Expose() type: string;
}

export class DriverDto {
    @Expose() id_user: number;
    @Expose() name: string;
    @Expose() email: string;
}

export class StatusJobOrderDto {
    @Expose() id: number;
    @Expose() nama: string;
}

export class JobOrderResponseDto {
    @Expose() id: number;
    @Expose() transaction_number: string;
    @Expose() customer_name: string;
    @Expose() pickup_address: string;
    @Expose() destination_address: string;
    @Expose() total_weight: number;
    @Expose() total_volume: number;

    @Type(() => StatusJobOrderDto)
    @Expose() status: StatusJobOrderDto;

    @Type(() => DriverDto)
    @Expose() driver: DriverDto;

    @Type(() => VehicleDto)
    @Expose() vehicle: VehicleDto;

    @Type(() => LocationDto)
    @Expose() locations: LocationDto[];

    @Type(() => ManifestDto)
    @Expose() manifests: ManifestDto[];
}
