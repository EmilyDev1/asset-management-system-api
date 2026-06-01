import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateStatusAdminDto } from './dto/update-admin-status.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { ChangePasswordAdminDto } from './dto/change-password-admin.dto';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

const randtoken = require('rand-token');
const generator = require('generate-password');
const argon2 = require('argon2');

@Injectable()
export class AdminService {
  constructor (
    @InjectRepository(AdminRepository) private adminRepo: AdminRepository,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const password = await this.genPassword();
    const admin = await this. adminRepo.createAdmin(createAdminDto, password);
    await this.mailService.sendadminConfirmation(admin, password);
    return admin;
  }

  public async login(authLoginDto: CreateAuthDto) {
    try {
      const user = await this.adminRepo.findOneOrFail({
        where: { emailaddress: authLoginDto.email },
      });

      if (!user) {
        throw new HttpException(
          "Incorrect email address or password",
          HttpStatus.BAD_REQUEST
        );
      }

      await this.verifyPassword(authLoginDto.password, user.password);
      user.password = undefined;
      const payload = {
        userId: user.id,
        email: user.emailaddress,
        // role: user.firstname+ " "+user.lastname,
      };

      const refresh = await this.generateRefreshToken(user.id);

      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: refresh,
      };
    } catch (error) {
      throw new HttpException(
        "Incorrect email address or password",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(page, perPage) {
    const limit = perPage || 10;
    let skip = 0;
    if (page > 1) {
      skip = limit * page - limit;
    }
    const [result, total] = await this.adminRepo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: skip,
    });
    return {
      data: result,
      activePage: Number(page),
      itemsCountPerPage: Number(limit),
      totalItemsCount: Number(total),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByEmail(emailaddress: string): Promise<any> {
    return this.adminRepo.findOne({ where: { emailaddress } });
  }
  async findOne(id: string): Promise<any> {
    return this.adminRepo.findOne({ where: { id } });
  }
  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
    }
    await this.adminRepo.update(id, updateAdminDto);
    throw new HttpException("Update Successfull", HttpStatus.ACCEPTED);
  }

  async status(id: string, updateAdminDto: UpdateStatusAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
    }

    await this.adminRepo.update(id, updateAdminDto);
    throw new HttpException("Update Successfull", HttpStatus.ACCEPTED);
  }

  async genPassword() {
    const password = await generator.generate({
      length: 10,
      numbers: true,
    });
    return password;
  }

  // async hashPassword(plainTextPassword:string): Promise<string> {
  //   return await argon2.hash(plainTextPassword)
  // }

  async refreshToken(userId, token) {
    const user = await this.adminRepo.findOne(userId);
    if (user.refreshToken !== token) {
      throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }
    const payload = {
      userId: user.id,
      email: user.emailaddress,
    };
    const refresh = this.generateRefreshToken(userId);
    return {
      access_token: this.jwtService.sign(payload),
      refreshToken: refresh,
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    try {
      const isPasswordMatching = await argon2.verify(
        hashedPassword,
        plainTextPassword
      );
      if (!isPasswordMatching) {
        throw new HttpException(
          "Incorrect email address or password",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(
        "Incorrect email address or password",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async verifyAdminPassword(adminId: string, plainTextPassword: string): Promise<boolean> {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin?.password) return false;
    try {
      return await argon2.verify(admin.password, plainTextPassword);
    } catch {
      return false;
    }
  }

  async resetPassword(resetPassDto: ResetPasswordAdminDto) {
    const genericResponse = {
      message:
        'If an account exists for that email, a new password has been sent.',
    };

    const user = await this.adminRepo.findOne({
      where: { emailaddress: resetPassDto.email },
    });

    if (!user) {
      // Do not leak whether the email is registered.
      return genericResponse;
    }

    const password = await this.genPassword();
    const hashed = await argon2.hash(password);
    await this.adminRepo.update(user.id, { password: hashed });

    try {
      await this.mailService.sendresetPassword(user, password);
    } catch (err) {
      console.error('Password reset email failed to send:', err);
      throw new HttpException(
        'Could not send reset email. Please contact support.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return genericResponse;
  }

  async saveorupdateRefreshToke(
    refreshToken: string,
    id: string,
    refreshtokenexpires
  ) {
    const user = await this.adminRepo.findOne({ where: { id } });
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = refreshtokenexpires;
    await this.adminRepo.save(user);
    return user;
  }

  async generateRefreshToken(userId): Promise<string> {
    const refreshToken = randtoken.generate(16);
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 6);
    await this.saveorupdateRefreshToke(refreshToken, userId, expirydate);
    return refreshToken;
  }

  async changepassword(userId, changepassDto: ChangePasswordAdminDto) {
    const user = await this.adminRepo.findOne(userId);
    const isPasswordMatching = await argon2.compareSync(
      changepassDto.currentPassword,
      user.password
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong current password provided",
        HttpStatus.BAD_REQUEST
      );
    }
    user.password = await argon2.hash(changepassDto.newPassword, 10);
    await this.adminRepo.save({ ...user });
    return new HttpException(
      "Password change successfull",
      HttpStatus.ACCEPTED
    );
  }
}
