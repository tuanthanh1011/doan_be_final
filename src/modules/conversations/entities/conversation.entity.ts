import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { ProductReview } from 'src/modules/product_review/entities/product_review.entity';
import { UserAddress } from 'src/modules/user_address/entities/user_address.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Wishlist } from 'src/modules/wishlist/entities/wishlist.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Conversation {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.customerIds)
  @JoinColumn({ name: 'customerId' })
  customerId: User;

  @ManyToOne(() => User, (user) => user.staffIds, {
    nullable: true,
  })
  @JoinColumn({ name: 'staffId' })
  staffId: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
