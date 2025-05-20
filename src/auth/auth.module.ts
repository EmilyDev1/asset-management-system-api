import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from 'src/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports:[
    AdminModule,
    JwtModule.registerAsync({
      imports:[ConfigModule,AdminModule],
      useFactory:async(configService:ConfigService)=>({
        secret:configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers:[AuthController]
})
export class AuthModule {}
