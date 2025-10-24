import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOrder } from '../../entities/job-order.entity';
import { Manifest } from '../../entities/manifest.entity';
import { Location } from '../../entities/location.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { User } from '../../entities/user.entity';
import { StatusJobOrder } from '../../entities/status-job-order.entity';
import { JobOrderService } from './job-order.service';
import { JobOrderController } from './job-order.controller';
import { JobOrderDistanceService } from './job-order-distance.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobOrder, Manifest, Location, Vehicle, User, StatusJobOrder]),
        HttpModule,
    ],
    controllers: [JobOrderController],
    providers: [JobOrderService, JobOrderDistanceService],
})
export class JobOrderModule { }
