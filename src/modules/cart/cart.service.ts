import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
  ) {}
  async create(createCartDto: CreateCartDto, id: string) {
    try {
      const { product, quantity } = createCartDto;
      await this.productsService.findProductById(product);
      const resultFindCart: any = await this.checkProductExistsCart(
        id,
        product,
      );
      if (resultFindCart) {
        resultFindCart.quantity += quantity;
        return await this.cartsRepository.save(resultFindCart);
      }
      const create: Cart = this.cartsRepository.create({
        user: id,
        quantity,
        product,
      });
      return this.cartsRepository.save(create);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProductOfCart(userId: string, productId: string) {
    const resultFindCart = await this.checkProductExistsCart(userId, productId);

    if (!resultFindCart) {
      throw new NotFoundException('Không tìm thấy sản phẩm phù hợp');
    }

    await this.cartsRepository
      .createQueryBuilder('cart')
      .delete()
      .where('cart.user = :id', { id: userId })
      .andWhere('cart.product = :product', { product: productId })
      .execute();
  }

  async checkProductExistsCart(userId, productId): Promise<Cart | Boolean> {
    const query = this.cartsRepository
      .createQueryBuilder('cart')
      .where('cart.user = :id', { id: userId })
      .andWhere('cart.product = :product', { product: productId });

    const item = await query.getOne();
    if (item) return item;
    return false;
  }

  async clearCartAfterPayment(userId: string) {
    await this.cartsRepository
      .createQueryBuilder('cart')
      .delete()
      .where('cart.user = :id', { id: userId })
      .execute();
  }

  async findCartByUser(id: string) {
    const query = this.cartsRepository
      .createQueryBuilder('cart')
      .innerJoinAndSelect('cart.user', 'user')
      .innerJoinAndSelect('cart.product', 'products')
      .where('user.id = :id', { id });

    const [items, total] = await query.getManyAndCount();
    return {
      rows: items,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(cartId: string, updateCartDto: UpdateCartDto, userId: string) {
    const { quantity } = updateCartDto;
    const cart = await this.cartsRepository.findOneBy({
      id: cartId,
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng tương ứng');
    }

    cart.quantity = quantity;

    await this.cartsRepository.save(cart);

    return cart;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
