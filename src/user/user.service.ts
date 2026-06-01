import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { UserRepository } from './user.repository';
import { DepartmentRepository } from 'src/department/department.repository';
import { AdminService } from 'src/admin/admin.service';
import { Asset } from 'src/asset/entities/asset.entity';
import { Address } from 'src/address/entities/address.entity';
import { Department } from 'src/department/entities/department.entity';
import { User as UserEntity } from './entities/user.entity';

export type User = any;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
    @InjectRepository(DepartmentRepository) private departmentRepo: DepartmentRepository,
    private adminservice: AdminService,
  ) {}

  async create(adminId: string, createUserDto: CreateUserDto) {
    const admin = await this.adminservice.findOne(adminId);
    const user = await this.userRepo.createUser(admin, createUserDto);

    if (createUserDto.department?.trim()) {
      const dept = this.departmentRepo.create({
        department: createUserDto.department.trim(),
        user,
      });
      await this.departmentRepo.save(dept);
    }

    return this.userRepo.findOne({
      where: { id: user.id },
      relations: { department: true },
    });
  }

  async findAll(query: ListUsersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const q = query.q?.trim();
    const department = query.department?.trim();

    const qb = this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.department', 'd')
      .leftJoin('u.asset', 'asset')
      .addSelect('COUNT(asset.id)::int', 'assetCount')
      .groupBy('u.id')
      .addGroupBy('d.id')
      .orderBy('u.lastname', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (q) {
      qb.andWhere(
        '(LOWER(u.firstname) LIKE :q OR LOWER(u.lastname) LIKE :q OR LOWER(u.emailaddress) LIKE :q)',
        { q: `%${q.toLowerCase()}%` },
      );
    }

    if (department && department !== 'all') {
      qb.andWhere('d.department = :department', { department });
    }

    const { entities, raw } = await qb.getRawAndEntities();
    const total = await this.countUsers(q, department);

    const data = entities.map((u, i) => ({
      id: u.id,
      firstname: u.firstname,
      middlename: u.middlename,
      lastname: u.lastname,
      gender: u.gender,
      emailaddress: u.emailaddress,
      phonenumber: u.phonenumber,
      department: u.department ? { id: u.department.id, department: u.department.department } : null,
      assetCount: Number(raw[i]?.assetCount ?? 0),
      createdAt: u.createdAt,
    }));

    return { data, total, page, limit };
  }

  private async countUsers(q?: string, department?: string) {
    const qb = this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.department', 'd');

    if (q) {
      qb.andWhere(
        '(LOWER(u.firstname) LIKE :q OR LOWER(u.lastname) LIKE :q OR LOWER(u.emailaddress) LIKE :q)',
        { q: `%${q.toLowerCase()}%` },
      );
    }

    if (department && department !== 'all') {
      qb.andWhere('d.department = :department', { department });
    }

    return qb.getCount();
  }

  async listDepartments() {
    const rows = await this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.department', 'd')
      .select('DISTINCT d.department', 'department')
      .where('d.department IS NOT NULL')
      .getRawMany<{ department: string }>();
    return rows.map((r) => r.department).filter(Boolean);
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { department: true, asset: { location: true } },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { department, ...rest } = updateUserDto as UpdateUserDto & {
      department?: string;
    };

    const existing = await this.userRepo.findOne({
      where: { id },
      relations: { department: true },
    });
    if (!existing) throw new NotFoundException('User not found');

    if (Object.keys(rest).length > 0) {
      await this.userRepo.update(id, rest as DeepPartial<User>);
    }

    if (department !== undefined) {
      const trimmed = department.trim();
      if (trimmed) {
        if (existing.department) {
          await this.departmentRepo.update(existing.department.id, {
            department: trimmed,
          });
        } else {
          const dept = this.departmentRepo.create({
            department: trimmed,
            user: { id } as any,
          });
          await this.departmentRepo.save(dept);
        }
      } else if (existing.department) {
        await this.departmentRepo.delete(existing.department.id);
      }
    }

    return this.userRepo.findOne({
      where: { id },
      relations: { department: true, asset: { location: true } },
    });
  }

  async remove(id: string, adminId: string, password: string) {
    if (!password) {
      throw new UnauthorizedException(
        'Password is required to delete an employee.',
      );
    }
    const ok = await this.adminservice.verifyAdminPassword(adminId, password);
    if (!ok) {
      throw new UnauthorizedException('Incorrect password.');
    }

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Employee not found');

    // Unassign their devices, drop personal address/department rows, then delete
    // the user. Wrapped in a transaction so a partial failure leaves no orphans.
    await this.userRepo.manager.transaction(async (tx) => {
      await tx
        .createQueryBuilder()
        .update(Asset)
        .set({ user: null })
        .where('"userId" = :id', { id })
        .execute();

      await tx
        .createQueryBuilder()
        .delete()
        .from(Address)
        .where('"userId" = :id', { id })
        .execute();

      await tx
        .createQueryBuilder()
        .delete()
        .from(Department)
        .where('"userId" = :id', { id })
        .execute();

      await tx.delete(UserEntity, id);
    });

    return { id };
  }
}
