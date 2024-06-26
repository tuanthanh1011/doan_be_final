import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class UserAddress {
  @PrimaryColumn()
  id: string;

  @Column()
  @ManyToOne((type) => User, (user) => user.userAddress)
  user: string;

  @Column()
  username: string;

  @Column()
  phone: string;

  @Column()
  address: string;

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
