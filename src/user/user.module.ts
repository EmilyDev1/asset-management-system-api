import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { UserRepository } from './user.repository';
import { AdminService } from 'src/admin/admin.service';
import { AdminRepository } from 'src/admin/admin.repository';
import { DepartmentRepository } from 'src/department/department.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      UserRepository,
      AdminRepository,
      DepartmentRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AdminService, JwtService, MailService],
})
export class UserModule {}
 