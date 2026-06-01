import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { AssetCategory, AssetStatus } from "../entities/asset.entity";

export class CreateAssetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    deviceName: string;

    @IsOptional()
    @IsEnum(AssetStatus)
    @ApiPropertyOptional({ enum: AssetStatus, default: AssetStatus.PENDING })
    status?: AssetStatus;

    @IsOptional()
    @IsEnum(AssetCategory)
    @ApiPropertyOptional({ enum: AssetCategory, default: AssetCategory.OTHER })
    category?: AssetCategory;

    @IsOptional()
    @ApiPropertyOptional({ description: 'Next maintenance date (ISO)' })
    nextMaintenance?: string;

    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({ description: 'Location ID' })
    locationId?: string;

    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({ description: 'Assigned user ID' })
    userId?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    color?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    brand?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    model?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    serialnumber?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    processor?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    hdd_ssd_size?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    ramsize?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    condition?: string;
}
