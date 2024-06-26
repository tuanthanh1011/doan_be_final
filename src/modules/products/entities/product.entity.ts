import { Cart } from 'src/modules/cart/entities/cart.entity';
import { DetailProduct } from 'src/modules/detail-product/entities/detail-product.entity';
import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { ProductReview } from 'src/modules/product_review/entities/product_review.entity';
import { Subcategory } from 'src/modules/subcategory/entities/subcategory.entity';
import { Wishlist } from 'src/modules/wishlist/entities/wishlist.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Products {
  @PrimaryColumn()
  id: string;

  @Column()
  productName: string;

  @Column()
  image: string;

  @ManyToOne((type) => Subcategory, (subcategory) => subcategory.products)
  subcategory: Subcategory;

  @Column({
    default: 0,
  })
  price: number;

  @Column({
    default: 0,
  })
  rateAvg: number;

  @Column({
    default: 0,
  })
  rateTotal: number;

  @Column({
    default: true,
  })
  isActive: boolean;

  // @OneToMany((type) => DetailProduct, (detailProduct) => detailProduct.product)
  // detailProducts: DetailProduct[];

  @OneToMany((type) => Cart, (cart) => cart.product)
  cart: Cart[];

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.product)
  wishList: Wishlist[];

  @OneToMany(
    (type) => ProductReview,
    (product_review) => product_review.product,
  )
  productReview: ProductReview[];

  @OneToMany((type) => OrderDetail, (order_detail) => order_detail.product)
  orderDetail: OrderDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
