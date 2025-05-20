import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { AssetModule } from './asset/asset.module';
import { AddressModule } from './address/address.module';
import { Address } from './address/entities/address.entity';
import { Asset } from './asset/entities/asset.entity';
import { DepartmentModule } from './department/department.module';
import { Department } from './department/entities/department.entity';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { join } from 'path';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule.forRoot({isGlobal:true})],
      inject:[ConfigService],
      useFactory:async(configService:ConfigService)=>({
        type:"postgres",
        host:configService.get("DB_HOST"),
        port:configService.get("DB_PORT"),
        username:configService.get("DB_USER"),
        password:configService.get("DB_PASSWORD"),
        database:configService.get("DATABASE_NAME"),
        entities:[join(__dirname, '**', '*.entity.{ts,js}')],
        autoLoadEntities:true,
        synchronize:true,
        logging:true
      })
    }),
    UserModule,
    AssetModule,
    AddressModule,
    DepartmentModule,
    AuthModule,
    AdminModule,
    MailModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
