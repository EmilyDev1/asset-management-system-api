import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import {Status } from 'src/admin/entities/admin.entity';
import { CreateAuthDto } from './dto/create-auth.dto';


const argon2 =require("argon2");
 
@Injectable()
export class AuthService {

  constructor(private adminService:AdminService, private jwtService:JwtService, private readonly configService: ConfigService){}

  
 public async login(createAuthDto:CreateAuthDto){
  try{
    const admin= await this.adminService.findByEmail(createAuthDto.email);
    await this.verifyPassword(createAuthDto.password, admin.password);
    
    admin.password=undefined;
    const payload={
      adminId:admin.id,
      emailaddress:admin.emailaddress,
      firstname:admin.firstname,
      username:admin.firstname+" "+admin.middlename+" "+admin.lastname,
    };

    const refresh=await this.adminService.generateRefreshToken(admin.id);

    return {access_token: this.jwtService.sign(payload),
      refreshToken:refresh,
    }
  }
  catch(error){
    console.error(error)
    throw new HttpException(
      "Wrong credentials", HttpStatus.BAD_REQUEST
    );
  }
 }



 public async refreshToken(adminId: string, token: string){
  const admin=await this.adminService.findByEmail(adminId);
  if(admin.refreshToken!=token){
    throw new HttpException("Invalid refesh token", HttpStatus.UNAUTHORIZED);
  }
    const payload={
      adminId:admin.id,
      emailaddress:admin.emailaddress,
      username:admin.firstname+" "+admin.middlename+" "+admin.lastname,
    };

    const refresh=await this.adminService.generateRefreshToken(admin.id);

    return {access_token: this.jwtService.sign(payload),
      refreshToken:refresh,
    }
  
 }


  public async verifyPassword(plainTextPassword:string, hashedPassword:string){

    const isPasswordMatching=await argon2.verify(hashedPassword,plainTextPassword);

    if(!isPasswordMatching){
      throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST);
    }
  }
  
  };

