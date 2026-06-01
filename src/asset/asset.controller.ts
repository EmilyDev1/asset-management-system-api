import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ListAssetsDto } from './dto/list-assets.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Asset } from './entities/asset.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentAdminId } from 'src/decorators/get-current-admin-id.decorator';

@ApiBearerAuth()
@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: ListAssetsDto) {
    return this.assetService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto & { password?: string },
    @GetCurrentAdminId() adminId: string,
  ) {
    return this.assetService.update(id, updateAssetDto, adminId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @GetCurrentAdminId() adminId: string,
    @Body('password') password: string,
  ) {
    return this.assetService.remove(id, adminId, password);
  }
}