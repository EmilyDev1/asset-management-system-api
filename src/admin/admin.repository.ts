import { InternalServerErrorException } from "@nestjs/common";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from "./dto/create-admin.dto";

const argon2 = require('argon2');

@CustomRepository(Admin)
export class AdminRepository extends Repository<Admin> {
    async createAdmin (adminDto: CreateAdminDto, randompassword) : Promise<Admin> {

        const password = await argon2.hash(randompassword, 10);
        const admin = this.create({...adminDto, password});
        try {
            await this.save(admin);

            return admin;
        } catch (error){
            throw new InternalServerErrorException('Admin already created');
        }
    }
}