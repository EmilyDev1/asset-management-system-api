import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { AssetStatus } from "../entities/asset.entity";

export class ListAssetsDto {
    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Free-text search across device name, brand, model, serial number' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    q?: string;

    @ApiPropertyOptional({ enum: AssetStatus })
    @IsOptional()
    @IsEnum(AssetStatus)
    status?: AssetStatus;
}

export class PaginatedAssetsDto<T = unknown> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
