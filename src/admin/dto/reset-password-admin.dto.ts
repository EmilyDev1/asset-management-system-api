import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordAdminDto{
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @ApiProperty({type:String, description:'email'})
    readonly email: string;
}