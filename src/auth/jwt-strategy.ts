import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AdminService } from "src/admin/admin.service";
import { Admin } from "src/admin/entities/admin.entity";
import { JwtPayload } from "./jwt-payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor (private adminService:AdminService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:process.env.JWT_SECRET,
        });
    }
    
    // async validate (payload:{adminId:string}){
    //     return{
    //         adminId:payload.adminId,
    //     };
    // }

    
    async validate(payload:JwtPayload):Promise<Admin>{
        const {emailaddress}=payload;

        if (!emailaddress || typeof emailaddress != "string") {
            throw new UnauthorizedException("Invalid token: Missing 'iss' field");
          }

        const admin=await this.adminService.findByEmail(emailaddress);
        if(!admin){
            throw new UnauthorizedException("Invalid token:Admin not found");
        }
        return admin;
    }
}