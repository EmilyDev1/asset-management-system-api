import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentRepository } from './department.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class DepartmentService {

  constructor(@InjectRepository(DepartmentRepository) private departmentRepo:DepartmentRepository,
  @InjectRepository(UserRepository) private userRepo:UserRepository,
){}

  async create(createDepartmentDto: CreateDepartmentDto, userId:string) {
    console.log(userId)
    
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
        console.log('My User', user);
    
        const department = this.departmentRepo.create({ ...createDepartmentDto, user });
    
        this.departmentRepo.save(department);
        return department;
  }

  findAll() {
    return this.departmentRepo.find();
  }

  findOne(id: string) {
    return this.departmentRepo.findOne ({where:{id}});
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentRepo.update(id,updateDepartmentDto)
  }

  
}
