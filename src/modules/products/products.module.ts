import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { ProductReviewModule } from '../product_review/product_review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products]),
    SubcategoryModule,
    MinioClientModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
