import { Order } from 'src/modules/order/entities/order.entity';
import { Products } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class ProductReview {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Products, (product) => product.productReview)
  product: string;

  @Column()
  rate: number;

  @ManyToOne(() => Order, (order) => order.productReview)
  order: string;

  @Column({
    default: '',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.productReview)
  user: string;

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
