import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { StatusJobOrder } from './status-job-order.entity';
import { Vehicle } from './vehicle.entity';
import { User } from './user.entity';
import { Manifest } from './manifest.entity';
import { Location } from './location.entity';

@Entity('job_orders')
export class JobOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    transaction_number: string;

    @Column()
    customer_name: string;

    @Column('text')
    pickup_address: string;

    @Column('text')
    destination_address: string;

    @ManyToOne(() => StatusJobOrder, (status) => status.jobOrders)
    @JoinColumn({ name: 'status_job_order_id' })
    status: StatusJobOrder;

    @ManyToOne(() => User, (user) => user.jobOrders)
    @JoinColumn({ name: 'driver_id' })
    driver: User;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.jobOrders, { nullable: true })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @Column({ type: 'float', nullable: true })
    total_weight: number;

    @Column({ type: 'float', nullable: true })
    total_volume: number;

    @OneToMany(() => Manifest, (manifest) => manifest.jobOrder)
    manifests: Manifest[];

    @OneToMany(() => Location, (location) => location.jobOrder)
    locations: Location[];
}
