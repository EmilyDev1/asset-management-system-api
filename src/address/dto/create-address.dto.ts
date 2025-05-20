import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address1:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address2:string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    town:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    province:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    country:string

    
}
