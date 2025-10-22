import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Token } from './token.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    id_user: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    email_verified_at: Date;

    @Column()
    password: string;

    @Column()
    role_id: number;

    @Column({ nullable: true })
    remember_token: string;

    @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];
}
