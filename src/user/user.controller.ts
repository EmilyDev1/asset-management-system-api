import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentAdminId } from 'src/decorators/get-current-admin-id.decorator';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@GetCurrentAdminId() adminId: string, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(adminId, createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: ListUsersDto) {
    return this.userService.findAll(query);
  }

  @Get('departments')
  @UseGuards(JwtAuthGuard)
  listDepartments() {
    return this.userService.listDepartments();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @GetCurrentAdminId() adminId: string,
    @Body('password') password: string,
  ) {
    return this.userService.remove(id, adminId, password);
  }
}
