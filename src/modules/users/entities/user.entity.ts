import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Conversation } from 'src/modules/conversations/entities/conversation.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { ProductReview } from 'src/modules/product_review/entities/product_review.entity';
import { UserAddress } from 'src/modules/user_address/entities/user_address.entity';
import { Wishlist } from 'src/modules/wishlist/entities/wishlist.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    default: 'avatar/avatar_default.png',
  })
  avatar: string;

  @Column({
    default: '',
  })
  password: string;

  @Column({
    default: 'USER',
  })
  role: string;

  @Column({
    default: false,
  })
  isRegisteredWithGoogle: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany((type) => UserAddress, (user_address) => user_address.id)
  userAddress: UserAddress[];

  @OneToMany((type) => Order, (order) => order.user)
  order: Order[];

  @OneToMany((type) => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany((type) => Wishlist, (wishList) => wishList.user)
  wishList: Wishlist[];

  @OneToMany((type) => ProductReview, (product_review) => product_review.user)
  productReview: ProductReview[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Conversation, (conversation) => conversation.customerId)
  customerIds: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.staffId)
  staffIds: Conversation[];

  @Column({
    default: '',
  })
  stripeId: string;

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
