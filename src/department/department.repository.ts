import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Department)
export class DepartmentRepository extends Repository<Department>{
async createDepartment(CreateDepartmentDto:CreateDepartmentDto){
    const department = this.create(CreateDepartmentDto)
    try {
        await this.save(department)
        return department
    } catch (error) {
        throw new InternalServerErrorException ("Error saving department")
    }
}
}