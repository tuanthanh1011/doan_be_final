import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, getConnection } from 'typeorm';
import { OrderDetailService } from '../order_detail/order_detail.service';
import { IUser } from '../users/users.interface';
import { FindOrderDto } from './dto/list-order.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private readonly orderDetailService: OrderDetailService,
    private readonly cartService: CartService,
  ) {}

  async create(createOrderDto: any, userId: string) {
    const {
      phone,
      address,
      paymentMethod,
      status,
      listProduct,
      totalPrice,
      note,
      username,
    } = createOrderDto;
    const create: Order = this.ordersRepository.create({
      username,
      phone,
      address,
      paymentMethod,
      status,
      totalPrice,
      note,
      user: userId,
    });

    await this.ordersRepository.save(create);

    listProduct.forEach(async (product: any) => {
      await this.orderDetailService.create({
        order: create.id,
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      });
    });

    this.cartService.clearCartAfterPayment(userId);
  }

  async findOrderByUser(userId: string, queryData: FindOrderDto) {
    const {
      page,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryData;
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .where('user.id = :id', { id: userId });

    if (sortBy) {
      query.orderBy(
        `order.${sortBy}`,
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

  async findAll(queryData: FindOrderDto) {
    const {
      page,
      perPage,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryData;
    console.log(search);
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user');

    if (search) {
      query.where('user.username LIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      query.orderBy(
        `order.${sortBy}`,
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

  async findOne(orderId: string, userId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (!item) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp');
    }

    const orderDetail = await this.orderDetailService.findOneByOrderId(orderId);

    item['listProduct'] = orderDetail;

    return item;
  }

  async findOneIgnoreUserId(orderId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .andWhere('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (!item) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp');
    }

    const orderDetail = await this.orderDetailService.findOneByOrderId(orderId);

    item['listProduct'] = orderDetail;

    return item;
  }

  async isOrderSuccessed(orderId: string) {
    const order = await this.ordersRepository.findOneBy({
      id: orderId,
      status: 'Giao hàng thành công',
    });

    if (!order) {
      throw new BadRequestException('Đơn hàng chưa được giao thành công');
    }

    return order;
  }

  async update(id: string, status: string) {
    const order = await this.ordersRepository.findOneBy({
      id: id,
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp');
    }

    order.status = status;

    await this.ordersRepository.save(order);

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async getTotalOrder() {
    const result = await this.ordersRepository.findBy({
      status: 'Giao hàng thành công',
    });

    return {
      total: result.length,
    };
  }

  async getTotalSale() {
    const currentDate = new Date();

    const formattedData = [];

    for (let i = 0; i < 6; i++) {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0,
      );

      const ordersTotal = await this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.totalPrice)', 'totalPrice')
        .addSelect('MONTH(order.createdAt)', 'month')
        .where('order.status = :status', { status: 'Giao hàng thành công' })
        .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .groupBy('MONTH(order.createdAt)')
        .getRawMany();

      const totalPrice =
        ordersTotal.length > 0 ? ordersTotal[0].totalPrice : '0';
      const month =
        ordersTotal.length > 0
          ? ordersTotal[0].month
          : currentDate.getMonth() - i + 1;

      formattedData.push({ totalPrice, month });
    }

    return formattedData;
  }

  async handleCancelOrder(orderId: string, userId: string) {
    console.log(userId, orderId);
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId });
    const item = await query.getOne();

    console.log(item);

    if (item.status == 'Chờ xác nhận') {
      item.status = 'Đã hủy';
      await this.ordersRepository.save(item);
      return item;
    } else if (item.status == 'Đã hủy') {
      throw new BadRequestException('Đơn hàng đã được hủy');
    } else {
      throw new BadRequestException(
        'Đơn hàng đã được chấp nhận. Vui lòng liên hệ quản trị viên',
      );
    }
  }

  async handleCancelOrder1(orderId: string, userId: string) {
    console.log(userId, orderId);
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId });
    const item = await query.getOne();

    console.log(item);

    if (item.status == 'Chờ xác nhận') {
      item.status = 'Đã hủy';
      await this.ordersRepository.save(item);
      return item;
    } else if (item.status == 'Đã hủy') {
      throw new BadRequestException('Đơn hàng đã được hủy');
    } else {
      throw new BadRequestException(
        'Đơn hàng đã được chấp nhận. Vui lòng liên hệ quản trị viên',
      );
    }
  }

  async handleCancelOrder2(orderId: string, userId: string) {
    console.log(userId, orderId);
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId });
    const item = await query.getOne();

    console.log(item);

    if (item.status == 'Chờ xác nhận') {
      item.status = 'Đã hủy';
      await this.ordersRepository.save(item);
      return item;
    } else if (item.status == 'Đã hủy') {
      throw new BadRequestException('Đơn hàng đã được hủy');
    } else {
      throw new BadRequestException(
        'Đơn hàng đã được chấp nhận. Vui lòng liên hệ quản trị viên',
      );
    }
  }
}
