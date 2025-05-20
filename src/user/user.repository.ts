import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { InternalServerErrorException } from "@nestjs/common";
import { Admin } from "src/admin/entities/admin.entity";

@CustomRepository(User)
export class UserRepository extends Repository <User> {

    async createUser(
        admin: Admin,
        createUserDto:CreateUserDto){
        const user = this.create({admin,...createUserDto})
        try {
            await this.save(user)
            return user
        } catch (error) {
            throw new InternalServerErrorException("User already exists")
            
        }
    }
} 