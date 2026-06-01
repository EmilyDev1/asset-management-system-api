import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ListAssetsDto } from './dto/list-assets.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { AssetRepository } from './asset.repository';
import { AssetStatus } from './entities/asset.entity';
import { UserRepository } from 'src/user/user.repository';
import { AdminService } from 'src/admin/admin.service';

const UNASSIGNED_STATUSES: AssetStatus[] = [
  AssetStatus.PENDING,
  AssetStatus.IN_STORAGE,
];

function statusForcesUnassigned(status?: AssetStatus | null): boolean {
  return !!status && UNASSIGNED_STATUSES.includes(status);
}

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetRepository) private assetRepo: AssetRepository,
    @InjectRepository(UserRepository) private userRepo: UserRepository,
    private adminService: AdminService,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const { userId, locationId, ...rest } = createAssetDto;

    if (userId && statusForcesUnassigned(rest.status)) {
      throw new BadRequestException(
        'A pending or in-storage asset cannot have an assignee.',
      );
    }

    let user = null;
    if (userId && !statusForcesUnassigned(rest.status)) {
      user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Assigned user does not exist');
    }

    const asset = this.assetRepo.create({
      ...rest,
      user,
      ...(locationId ? { location: { id: locationId } as any } : {}),
    });
    await this.assetRepo.save(asset);
    return asset;
  }

  async findAll(query: ListAssetsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const q = query.q?.trim();

    const baseFilters: Record<string, unknown> = {};
    if (query.status) baseFilters.status = query.status;

    const where = q
      ? [
          { ...baseFilters, deviceName: ILike(`%${q}%`) },
          { ...baseFilters, brand: ILike(`%${q}%`) },
          { ...baseFilters, model: ILike(`%${q}%`) },
          { ...baseFilters, serialnumber: ILike(`%${q}%`) },
        ]
      : baseFilters;

    const [data, total] = await this.assetRepo.findAndCount({
      where,
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  findOne(id: string) {
    return this.assetRepo.findOne({
      where: { id },
      relations: { user: true, location: true },
    });
  }

  async update(
    id: string,
    updateAssetDto: UpdateAssetDto & { password?: string },
    adminId: string,
  ) {
    const existing = await this.assetRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!existing) throw new NotFoundException('Asset not found');

    const { password, userId, locationId, ...rest } = updateAssetDto;

    const currentUserId = existing.user?.id ?? null;
    const targetStatus = (rest.status ?? existing.status) as AssetStatus;
    const mustBeUnassigned = statusForcesUnassigned(targetStatus);

    // Reject explicit assignment that conflicts with the target status
    if (userId && mustBeUnassigned) {
      throw new BadRequestException(
        'A pending or in-storage asset cannot have an assignee.',
      );
    }

    // Compute the next assignee:
    //   - If target status forces unassigned, set to null (system-driven)
    //   - Otherwise honour an explicit userId, or fall back to the current
    let nextUserId: string | null;
    if (mustBeUnassigned) {
      nextUserId = null;
    } else if (userId !== undefined) {
      nextUserId = userId || null;
    } else {
      nextUserId = currentUserId;
    }

    // Password is required ONLY for explicit reassignments — not for the
    // automatic unassign that comes from moving to pending/in_storage.
    const explicitlyReassigned =
      userId !== undefined && (userId || null) !== currentUserId;

    if (explicitlyReassigned) {
      if (!password) {
        throw new UnauthorizedException(
          'Password is required to reassign an asset.',
        );
      }
      const ok = await this.adminService.verifyAdminPassword(adminId, password);
      if (!ok) {
        throw new UnauthorizedException('Incorrect password.');
      }

      if (nextUserId) {
        const user = await this.userRepo.findOne({ where: { id: nextUserId } });
        if (!user) throw new NotFoundException('Assigned user does not exist');
      }
    }

    const update: Record<string, unknown> = { ...rest };
    if (nextUserId !== currentUserId) {
      update.user = nextUserId ? ({ id: nextUserId } as any) : null;
    }
    if (locationId !== undefined) {
      update.location = locationId ? ({ id: locationId } as any) : null;
    }

    await this.assetRepo.save({ id, ...update });
    return this.findOne(id);
  }

  async remove(id: string, adminId: string, password: string) {
    if (!password) {
      throw new UnauthorizedException('Password is required to delete an asset.');
    }
    const ok = await this.adminService.verifyAdminPassword(adminId, password);
    if (!ok) {
      throw new UnauthorizedException('Incorrect password.');
    }

    const asset = await this.assetRepo.findOne({ where: { id } });
    if (!asset) throw new NotFoundException('Asset not found');
    await this.assetRepo.delete(id);
    return { id };
  }
}

