import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAssetDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    deviceName:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    color:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    brand:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    model:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    serialnumber:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    processor:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hdd_ssd_size:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ramsize:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    condition:string
}
