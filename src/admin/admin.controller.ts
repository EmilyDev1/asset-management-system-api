import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { UpdateStatusAdminDto } from './dto/update-admin-status.dto';
import { ChangePasswordAdminDto } from './dto/change-password-admin.dto';
import { GetCurrentAdminId } from 'src/decorators/get-current-admin-id.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SetPasswordDto } from './dto/set-password.dto';

//@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  // @Post('auth')
  // @UseGuards(JwtAuthGuard)
  // login(@Body() authLoginDto: CreateAuthDto) {
  //   return this.adminService.login(authLoginDto);
  // }

  // @UseGuards(JwtAuthGuard)
  @Get('findall')
  findAll(@Query("page") page:string, @Query("perPage") perPage:string) {
    return  this.adminService.findAll(+page,+perPage);
  }

  @Get(':email')
  //@UseGuards(JwtAuthGuard)
  findByEmail(@Param('email') email: string) {
    return this.adminService.findByEmail(email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  status(@Param('id') id: string, @Body() updateStatusAdminDto: UpdateStatusAdminDto) {
    return this.adminService.status(id, updateStatusAdminDto);
  }
  // @Patch('set-password')
  // async setPassword(@Body() setDto: SetPasswordDto) {
  //   const admin = await this.adminRepository.findOne({ where: {id: setDto.id} });

  //   if (!admin || !admin.firstTimeLogin) {
  //     throw new BadRequestException('Invalid ');
  //   }
  // }

  @Patch('reset/password')
  resetpassword(@Body() resetDto: ResetPasswordAdminDto) {
    return this.adminService.resetPassword(resetDto);
  }

  @Patch('change/password')
  @UseGuards(JwtAuthGuard)
  changepassword( @GetCurrentAdminId() adminId: string, @Body() changepassDto: ChangePasswordAdminDto){
    return this.adminService.changepassword(adminId, changepassDto);
  }
}
