import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn({ name: 'id_role' })
    id_role: number;

    @Column()
    role_name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
