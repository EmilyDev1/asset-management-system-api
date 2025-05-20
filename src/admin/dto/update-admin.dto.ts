import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:'Firstname'})
    firstname:string;

    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:'Middlename'})
    middlename:string;

    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:'Lastname'})
    lastname:string;

    @IsString()
    @IsEmail()
    @IsOptional()
    @ApiProperty({type: String, description: 'Emailaddress'})
    emailaddress:string
}