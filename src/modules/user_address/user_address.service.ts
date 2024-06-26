import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './entities/user_address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  create(createUserAddressDto: CreateUserAddressDto, userId: string) {
    const { username, phone, address } = createUserAddressDto;
    const create: UserAddress = this.userAddressRepository.create({
      username,
      phone,
      address,
      user: userId,
    });

    return this.userAddressRepository.save(create);
  }

  async findUserAddressByUser(userId: string) {
    const query = this.userAddressRepository
      .createQueryBuilder('user-address')
      .where('user-address.user = :id', { id: userId });

    const [items] = await query.getManyAndCount();
    return {
      rows: items,
    };
  }

  findAll() {
    return `This action returns all userAddress`;
  }

  async findUserAddressById(id: string) {
    const query = this.userAddressRepository
      .createQueryBuilder('user-address')
      .where('user-address.id = :id', { id });

    const item = await query.getOne();
    if (!item) {
      throw new NotFoundException('Không tìm thấy địa chỉ phù hợp');
    }
    return item;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAddress`;
  }

  async update(id: string, updateUserAddressDto: UpdateUserAddressDto) {
    const { phone, username, address } = updateUserAddressDto;

    const userAddress = await this.userAddressRepository.findOneBy({
      id,
    });

    if (!userAddress) {
      throw new NotFoundException('Không tìm thấy địa chỉ phù hợp');
    }

    if (username) {
      userAddress.username = username;
    }

    if (phone) {
      userAddress.phone = phone;
    }

    if (address) {
      userAddress.address = address;
    }

    await this.userAddressRepository.save(userAddress);

    return userAddress;
  }

  async remove(userAddressId: string, userId: string) {
    const result = await this.findUserAddressById(userAddressId);

    const query = this.userAddressRepository
      .createQueryBuilder('user_address')
      .delete()
      .where('user_address.id = :id', { id: userAddressId });

    await query.execute();
  }
}
