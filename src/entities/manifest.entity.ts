import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { JobOrder } from './job-order.entity';

@Entity('manifests')
export class Manifest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => JobOrder, (jobOrder) => jobOrder.manifests)
    @JoinColumn({ name: 'job_order_id' })
    jobOrder: JobOrder;

    @Column()
    item_name: string;

    @Column('int')
    quantity: number;

    @Column({ type: 'float', nullable: true })
    weight: number;

    @Column({ type: 'float', nullable: true })
    volume: number;

    @Column({ type: 'text', nullable: true })
    notes: string;
}
