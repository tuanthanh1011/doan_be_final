import { Injectable } from '@nestjs/common';
import { CreateDetailProductDto } from './dto/create-detail-product.dto';
import { UpdateDetailProductDto } from './dto/update-detail-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailProduct } from './entities/detail-product.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class DetailProductService {
  constructor(
    @InjectRepository(DetailProduct)
    private detailProductRepository: Repository<DetailProduct>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createDetailProductDto: CreateDetailProductDto) {
    const { product } = createDetailProductDto;
    await this.productsService.findProductById(product);
    const create: DetailProduct = this.detailProductRepository.create(
      createDetailProductDto,
    );

    return await this.detailProductRepository.save(create);
  }

  // findAll() {
  //   return `This action returns all detailProduct`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} detailProduct`;
  // }

  // update(id: number, updateDetailProductDto: UpdateDetailProductDto) {
  //   return `This action updates a #${id} detailProduct`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} detailProduct`;
  // }
}
