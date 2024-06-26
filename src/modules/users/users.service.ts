import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { Hash } from 'src/utils/util.hash';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserOauth } from '../auth/auth.interface';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BucketName } from 'src/constans/enum';
import { RegisterUserAdminDto } from './dto/register-user-admin.dto';
import { UpdateUserAdminDto } from './dto/update-user.dto copy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private minioClientService: MinioClientService,
  ) {}

  // Register a new user
  async register(registerUserDto: RegisterUserDto) {
    const { email, password, username } = registerUserDto;

    // Check if user already exists
    const user = await this.findUserByEmailNotOauth(email);

    if (user) {
      throw new BadRequestException(`Email đã tồn tại trong hệ thống`);
    }

    const hashPassword = Hash.getHashPassword(password);

    const userWithOauth = await this.findUserByEmailWithOauth(email);

    if (userWithOauth) {
      userWithOauth.password = hashPassword;
      userWithOauth.isRegisteredWithGoogle = false;
      await this.usersRepository.save(userWithOauth);

      return userWithOauth;
    }

    // Create a new user
    const newUser = this.usersRepository.create({
      email,
      username,
      password: hashPassword,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  // Register a new user
  async post(registerUserAdminDto: RegisterUserAdminDto) {
    const { email, password, username, role } = registerUserAdminDto;

    console.log(email);

    // Check if user already exists
    const user = await this.findUserByEmailNotOauth(email);

    console.log(user);

    if (user) {
      throw new BadRequestException(`Email đã tồn tại trong hệ thống`);
    }

    const hashPassword = Hash.getHashPassword(password);

    const userWithOauth = await this.findUserByEmailWithOauth(email);

    if (userWithOauth) {
      userWithOauth.password = hashPassword;
      userWithOauth.isRegisteredWithGoogle = false;
      await this.usersRepository.save(userWithOauth);

      return userWithOauth;
    }

    // Create a new user
    const newUser = this.usersRepository.create({
      email,
      username,
      password: hashPassword,
      role: role,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async registerWithGoogle(userInfo: IUserOauth) {
    const { email, fullname } = userInfo;

    const user = await this.usersRepository.findOneBy({
      email,
      isRegisteredWithGoogle: false,
    });

    if (user)
      throw new BadRequestException(
        'Email đã được đăng ký. Vui lòng chọn hình thức đăng nhập với mật khẩu',
      );

    const userLoginOauth = await this.usersRepository.findOneBy({
      email,
      isRegisteredWithGoogle: true,
    });

    if (userLoginOauth) {
      return userLoginOauth;
    }

    const newUser = this.usersRepository.create({
      email,
      username: fullname,
      isRegisteredWithGoogle: true,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findUserByEmailNotOauth(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      email,
      isRegisteredWithGoogle: false,
    });
  }

  async findUserByEmailWithOauth(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      email,
      isRegisteredWithGoogle: true,
    });
  }

  async findAll(findAllUserDto: FindAllUserDto) {
    const {
      search,
      page,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findAllUserDto;

    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.role IN (:...roles)', { roles: ['USER', 'EMPLOYEE'] });

    if (search) {
      query.andWhere('user.username LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      query.orderBy(
        `user.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [items, total] = await query.getManyAndCount();
    const totalPage = perPage ? Math.ceil(total / perPage) : 1;

    return {
      page: +page || 1,
      perPage: +perPage || total,
      rows: items,
      total,
      totalPage,
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    });
    if (!user) {
      throw new NotFoundException(`Không tồn tại khách hàng phù hợp`);
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto, userId: string) {
    const { username, password, avatar } = updateUserDto;

    // Find the user by id
    const user = await this.findOne(userId);

    // If user not found, throw an error
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update user's information
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = Hash.getHashPassword(password);
    }
    if (avatar) {
      user.avatar = avatar;
    }

    // Save the updated user
    await this.usersRepository.save(user);

    return user;
  }

  async updateByAdmin(updateUserAdminDto: UpdateUserAdminDto) {
    const { username, email, role, userId } = updateUserAdminDto;

    // Find the user by id
    const user = await this.findOne(userId);

    // If user not found, throw an error
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update user's information
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (role) {
      user.role = role;
    }

    // Save the updated user
    await this.usersRepository.save(user);

    return user;
  }

  async updateStatusUser(status: boolean, userId: string) {
    const user = await this.findOne(userId);
    if (status === true) {
      user.isOnline = true;
    } else {
      (user.isOnline = false), (user.lastActive = new Date());
    }
    await this.usersRepository.save(user);
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const urlImage = await this.minioClientService.uploadFile(
        file,
        BucketName.AVATAR_BUCKET,
      );
      return urlImage;
    } catch (err) {
      console.log(err);
    }
  }

  async getTotalAccountUser() {
    const result = await this.usersRepository.findBy({
      isActive: true,
      role: 'USER',
    });

    return {
      total: result.length,
    };
  }
}
