import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto {
@IsNotEmpty()
@IsString()
@ApiProperty()
firstname: string

@IsNotEmpty()
@IsString() 
@ApiProperty()
middlename: string

@IsNotEmpty()
@IsString()
@ApiProperty()
lastname: string

@IsNotEmpty()
@IsString()
@ApiProperty()
gender: string

@IsNotEmpty()
@IsEmail()
@ApiProperty() 
emailaddress: string

@IsNotEmpty()
@IsString()
@ApiProperty()
phonenumber: string

@IsNotEmpty()
@IsString()
@ApiProperty()
password: string

}