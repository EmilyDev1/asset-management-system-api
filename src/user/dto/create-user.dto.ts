import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    emailaddress: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Department name (a Department row will be created)' })
    department?: string;
}
