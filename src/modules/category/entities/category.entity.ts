import { Products } from 'src/modules/products/entities/product.entity';
import { Subcategory } from 'src/modules/subcategory/entities/subcategory.entity';
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
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  categoryName: string;

  @Column({
    default: '',
  })
  description: string;

  @Column({
    default: '',
  })
  slug: string;

  @OneToMany((type) => Subcategory, (subcategory) => subcategory.category)
  subcategorys: Subcategory[];

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
