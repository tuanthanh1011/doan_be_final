import { Products } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Cart {
  @PrimaryColumn()
  id: string;

  @Column()
  @ManyToOne((type) => Products, (products) => products.cart)
  product: string;

  @Column()
  quantity: number;

  @Column()
  @ManyToOne((type) => User, (user) => user.cart)
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
