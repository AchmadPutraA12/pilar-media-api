import * as typeorm from 'typeorm';
import { JobOrder } from './job-order.entity';

@typeorm.Entity('locations')
export class Location {
    @typeorm.PrimaryGeneratedColumn()
    id: number;

    @typeorm.ManyToOne(() => JobOrder, (jobOrder) => jobOrder.locations, {
        onDelete: 'CASCADE',
    })
    @typeorm.JoinColumn({ name: 'job_order_id' })
    jobOrder: typeorm.Relation<JobOrder>;

    @typeorm.Column()
    type: string;

    @typeorm.Column('text')
    address: string;

    @typeorm.Column('decimal', { precision: 10, scale: 6, nullable: true })
    lat: string;

    @typeorm.Column('decimal', { precision: 10, scale: 6, nullable: true })
    lng: string;

    @typeorm.Column({ nullable: true })
    province: string;

    @typeorm.Column({ nullable: true })
    city: string;

    @typeorm.Column({ nullable: true })
    district: string;

    @typeorm.Column({ nullable: true })
    province_id: number;

    @typeorm.Column({ nullable: true })
    city_id: number;

    @typeorm.Column({ nullable: true })
    district_id: number;

    @typeorm.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @typeorm.Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
}
