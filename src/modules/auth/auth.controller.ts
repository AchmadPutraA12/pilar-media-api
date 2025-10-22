import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;

        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const token = await this.authService.generateToken(user);
        return {
            message: 'Login berhasil',
            user,
            token,
        };
    }

    @Post('logout')
    async logout(@Req() req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Token tidak ditemukan');
        }

        const token = authHeader.split(' ')[1];
        await this.authService.logout(token);
        return { message: 'Logout berhasil' };
    }
}
