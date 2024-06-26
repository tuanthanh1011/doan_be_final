import { Module } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entities/user_address.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress]), ConfigModule],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
