import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Asset } from './entities/asset.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  create( @Body() createAssetDto: CreateAssetDto, @Param('userId')  userId:string) {
    return this.assetService.create(createAssetDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.assetService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetService.update(id, updateAssetDto);
  }

}