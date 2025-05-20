import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description:'Firstname'})
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description:'Middlename'})
    middlename: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description:'Lastname'})
    lastname: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({type: String, description:'Emailaddress'})
    emailaddress: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description:'Username'})
    username: string;

}
