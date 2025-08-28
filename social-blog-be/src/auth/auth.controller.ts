  import { Controller, Post, Body, Req, UseGuards, Get, Res } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import type { Request, Response } from 'express'; // Changed to import type
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { GoogleAuthGuard } from './guards/google.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
      const user = await this.authService.validateUser(body.email, body.password);
      if (!user) throw new Error('Invalid credentials');
      return this.authService.login(user);
    }
  
    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
      return this.authService.refresh(refreshToken);
    }
  
    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async googleAuth() {
      // initiates Google OAuth2 flow
    }
  
    @UseGuards(GoogleAuthGuard)
    @Get('google/redirect')
    async googleAuthRedirect(@Req() req: Request) {
      const user = (req as any).user;
      return this.authService.login(user);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request) {
      const user = (req as any).user;
      await this.authService.logout(user.sub);
      return { success: true };
    }

   
  }