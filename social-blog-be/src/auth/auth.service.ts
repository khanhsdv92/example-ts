import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;

    const match = await bcrypt.compare(pass, user.password);
    return match ? user : null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: { tokenHash, userId: user.id },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded: any = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const userId = decoded.sub;
      const tokens = await this.prisma.refreshToken.findMany({ where: { userId } });

      for (const t of tokens) {
        const match = await bcrypt.compare(refreshToken, t.tokenHash);
        if (match) {
          const user = await this.prisma.user.findUnique({ where: { id: userId } });
          return this.login(user);
        }
      }
      throw new UnauthorizedException('Invalid refresh token');
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
