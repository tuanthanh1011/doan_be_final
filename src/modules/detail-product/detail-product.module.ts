import { Module } from '@nestjs/common';
import { DetailProductService } from './detail-product.service';
import { DetailProductController } from './detail-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailProduct } from './entities/detail-product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([DetailProduct]), ProductsModule],
  controllers: [DetailProductController],
  providers: [DetailProductService],
})
export class DetailProductModule {}
