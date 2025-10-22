import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Token } from '../../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { email }, relations: ['role'] });
        if (!user || !user.password) throw new UnauthorizedException('Email tidak ditemukan');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Password salah');

        return user;
    }

    async generateToken(user: User) {
        const payload = {
            sub: user.id_user,
            email: user.email,
            role: user.role?.role_name,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    }

    async saveToken(user: User, token: string, deviceName: string) {
        const tokenEntity = this.tokenRepo.create({
            user_id: user.id_user,
            token,
            device_name: deviceName,
            last_used_at: new Date(),
            expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        await this.tokenRepo.save(tokenEntity);
    }

    async logout(token: string) {
        const existingToken = await this.tokenRepo.findOne({ where: { token } });
        if (!existingToken) {
            throw new UnauthorizedException('Token tidak valid atau sudah logout');
        }
        await this.tokenRepo.delete(existingToken.id_token);
    }
}
