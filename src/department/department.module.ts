import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { DepartmentRepository } from './department.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forCustomRepository ([DepartmentRepository,UserRepository])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
