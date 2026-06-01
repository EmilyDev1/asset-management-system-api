import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Admin } from "src/admin/entities/admin.entity";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(admin: Admin, createUserDto: CreateUserDto) {
        const { department, ...userFields } = createUserDto;
        const user = this.create({ admin, ...userFields });
        try {
            await this.save(user);
            return user;
        } catch (error: any) {
            if (error?.code === '23505') {
                throw new ConflictException('A user with this email already exists.');
            }
            throw new InternalServerErrorException('Could not create user');
        }
    }
}
