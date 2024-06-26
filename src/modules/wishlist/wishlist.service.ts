import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/delete-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository, W } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: string) {
    const { product } = createWishlistDto;
    await this.productsService.findProductById(product);
    const create: Wishlist = this.wishlistRepository.create({
      product,
      user: userId,
    });

    return this.wishlistRepository.save(create);
  }

  async findWishlistByUser(userId: string) {
    const productWishList = await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .innerJoinAndSelect('wishlist.product', 'products')
      .where('wishlist.user = :id', { id: userId })
      .getManyAndCount();

    const [items, total] = productWishList;

    return {
      rows: items,
      total: total,
    };
  }

  remove(productId: string, userId: string) {
    const query = this.wishlistRepository
      .createQueryBuilder('wishlist')
      .delete()
      .where('wishlist.userId = :id', { id: userId })
      .andWhere('wishlist.productId = :productId', { productId });

    return query.execute();
  }
}
