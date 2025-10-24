import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { JobOrderService } from './job-order.service';
import { plainToInstance } from 'class-transformer';
import { JobOrderResponseDto } from './dto/job-order-response.dto';
import { JobOrderDistanceService } from './job-order-distance.service';

@Controller('job-orders')
export class JobOrderController {
    constructor(
        private readonly jobOrderService: JobOrderService,
        private readonly jobOrderDistanceService: JobOrderDistanceService,
    ) { }

    @Get()
    async getAll() {
        const result = await this.jobOrderService.getAllJobOrders();
        return plainToInstance(JobOrderResponseDto, result, { excludeExtraneousValues: true });
    }

    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number) {
        const result = await this.jobOrderService.getJobOrderDetail(id);
        return plainToInstance(JobOrderResponseDto, result, { excludeExtraneousValues: true });
    }

    @Get(':id/distance')
    async getDistance(@Param('id', ParseIntPipe) id: number) {
        return await this.jobOrderDistanceService.calculateDistance(id);
    }
}
