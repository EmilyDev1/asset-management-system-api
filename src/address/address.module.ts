import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forCustomRepository ([AddressRepository,UserRepository])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
 