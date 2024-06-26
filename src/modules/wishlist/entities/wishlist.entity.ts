import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Products } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Products, (product) => product.wishList)
  product: string;

  @ManyToOne(() => User, (user) => user.wishList)
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
