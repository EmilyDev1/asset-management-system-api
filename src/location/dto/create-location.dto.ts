import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    address?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    city?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    country?: string;
}
