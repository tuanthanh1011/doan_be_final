import { Injectable } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product_review.dto';
import { UpdateProductReviewDto } from './dto/update-product_review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from './entities/product_review.entity';
import { Repository } from 'typeorm';
import { OrderService } from '../order/order.service';
import { OrderDetailService } from '../order_detail/order_detail.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private productReviewRepository: Repository<ProductReview>,
    private readonly orderService: OrderService,
    private readonly orderDetailService: OrderDetailService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createProductReviewDto: CreateProductReviewDto, userId: string) {
    const { orderId, productId, rate, content } = createProductReviewDto;
    await this.orderService.isOrderSuccessed(orderId);
    await this.orderDetailService.isProductBelongOrder(productId, orderId);

    const create: ProductReview = this.productReviewRepository.create({
      order: orderId,
      product: productId,
      user: userId,
      content: content,
      rate: rate,
    });
    const result = await this.productReviewRepository.save(create);

    await this.calculateRateAvg(productId);

    return result;
  }

  async isReviewed(orderId, productId, userId) {
    const product_review = await this.productReviewRepository
      .createQueryBuilder('product_review')
      .where('product_review.product = :productId', { productId })
      .andWhere('product_review.order = :orderId', { orderId })
      .andWhere('product_review.user = :userId', { userId })
      .getOne();

    return product_review;
  }

  async findByProduct(productId: string) {
    const query = this.productReviewRepository
      .createQueryBuilder('product_review')
      .where('product_review.product = :id', {
        id: productId,
      });

    return query.getMany();
  }

  async calculateRateAvg(productId: string) {
    const reviews = await this.findByProduct(productId);

    if (reviews.length === 0) {
      return 0;
    }

    const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);
    const averageRate = totalRate / reviews.length;

    await this.productsService.updateRateAvg(
      productId,
      averageRate,
      reviews.length,
    );

    return averageRate;
  }

  findAll() {
    return `This action returns all productReview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productReview`;
  }

  update(id: number, updateProductReviewDto: UpdateProductReviewDto) {
    return `This action updates a #${id} productReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReview`;
  }
}
