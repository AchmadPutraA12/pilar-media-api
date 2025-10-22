import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('token')
export class Token {
    @PrimaryGeneratedColumn({ name: 'id_token' })
    id_token: number;

    @Column()
    user_id: number;

    @Column({ unique: true, length: 80 })
    token: string;

    @Column({ nullable: true })
    device_name: string;

    @Column({ nullable: true })
    last_used_at: Date;

    @Column({ nullable: true })
    expired_at: Date;

    @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
