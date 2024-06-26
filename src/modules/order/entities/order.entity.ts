import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { ProductReview } from 'src/modules/product_review/entities/product_review.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  @ManyToOne((type) => User, (user) => user.order)
  user: string;

  @OneToMany((type) => OrderDetail, (order_detail) => order_detail.order)
  orderDeatail: OrderDetail[];

  @OneToMany((type) => ProductReview, (product_review) => product_review.order)
  productReview: ProductReview[];

  @Column()
  username: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  note: string;

  @Column()
  paymentMethod: string;

  @Column({
    default: 'Chờ xác nhận',
  })
  status: string;

  @Column()
  totalPrice: number;

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
