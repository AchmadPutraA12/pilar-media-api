import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobOrder } from './job-order.entity';

@Entity('status_job_orders')
export class StatusJobOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nama: string;

    @OneToMany(() => JobOrder, (jobOrder) => jobOrder.status)
    jobOrders: JobOrder[];
}
