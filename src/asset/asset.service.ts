import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetRepository) private assetRepo: AssetRepository,
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  async create(createAssetDto: CreateAssetDto, userId: string) {
    console.log(userId);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if(!user) throw new NotFoundException("User does not exist");

    console.log('My User', user);

    const asset = this.assetRepo.create({ ...createAssetDto, user });

    this.assetRepo.save(asset);
    return asset;
  }

  findAll() {
    return this.assetRepo.find();
  }

  findOne(id: string) {
    return this.assetRepo.findOne({ where: { id } });
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.assetRepo.update(id, updateAssetDto);
  }

  
} 
