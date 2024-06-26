import { Category } from 'src/modules/category/entities/category.entity';
import { Products } from 'src/modules/products/entities/product.entity';
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
export class Subcategory {
  @PrimaryColumn()
  id: string;

  @Column()
  subCategoryName: string;

  @Column({
    default: '',
  })
  slug: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    default: '',
  })
  description?: string;

  @OneToMany((type) => Products, (product) => product.subcategory)
  products: Products[];

  @ManyToOne((type) => Category, (category) => category.subcategorys)
  category: Category;

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
