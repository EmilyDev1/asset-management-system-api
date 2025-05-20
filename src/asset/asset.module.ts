import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { UserRepository } from 'src/user/user.repository';
import { AssetRepository } from './asset.repository';

@Module({
  imports:[TypeOrmModule.forCustomRepository([AssetRepository,UserRepository])],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {} 