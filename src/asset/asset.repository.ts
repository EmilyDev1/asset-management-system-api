import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Asset } from "./entities/asset.entity";
import { Repository } from "typeorm";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Asset)
export class AssetRepository extends Repository<Asset>{
    
    async createAsset(createAssetDto:CreateAssetDto){
                const asset = this.create(createAssetDto)
                try {
                    await this.save(asset)
                    return asset
                } catch (error) {
                    throw new InternalServerErrorException("Error saving asset")
                    
                }
            }
}