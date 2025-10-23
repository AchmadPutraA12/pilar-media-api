import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobOrder } from './job-order.entity';

@Entity('vehicles')
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nama_kendaraan: string;

    @Column({ unique: true })
    plate_number: string;

    @Column()
    warna: string;

    @Column()
    type: string;

    @Column({ type: 'float', nullable: true })
    capacity: number;

    @OneToMany(() => JobOrder, (jobOrder) => jobOrder.vehicle)
    jobOrders: JobOrder[];
}
