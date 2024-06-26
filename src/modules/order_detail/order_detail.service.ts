import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetail } from './order_detail.interface';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}

  create(createOrderDetailDto: CreateOrderDetail) {
    const create: OrderDetail =
      this.orderDetailRepository.create(createOrderDetailDto);

    return this.orderDetailRepository.save(create);
  }

  findAll() {
    return `This action returns all orderDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  async findOneByOrderId(orderId: string) {
    const query = this.orderDetailRepository
      .createQueryBuilder('order_detail')
      .innerJoinAndSelect('order_detail.product', 'products')
      .where('order_detail.orderId = :orderId', { orderId });

    return query.getMany();
  }

  async isProductBelongOrder(productId, orderId) {
    const products = await this.orderDetailRepository
      .createQueryBuilder('order_detail')
      .where('order_detail.order = :orderId', { orderId })
      .andWhere('order_detail.product = :productId', { productId })
      .getMany();

    if (products.length == 0) {
      throw new BadRequestException('Sản phẩm không thuộc đơn hàng');
    }

    return products;
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }
}
