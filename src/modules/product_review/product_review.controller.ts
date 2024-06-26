import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductReviewService } from './product_review.service';
import { CreateProductReviewDto } from './dto/create-product_review.dto';
import { UpdateProductReviewDto } from './dto/update-product_review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/user.decorator';
import { CheckReviewedDto } from './dto/check_reviewed.dto';

@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProductReviewDto: CreateProductReviewDto,
    @User() user: IUser,
  ) {
    const { id } = user;
    return this.productReviewService.create(createProductReviewDto, id);
  }

  @Get()
  findAll() {
    return this.productReviewService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('is-reviewed')
  isReviewed(@User() user: IUser, @Body() checkReviewedDto: CheckReviewedDto) {
    const { id } = user;
    const { orderId, productId } = checkReviewedDto;
    return this.productReviewService.isReviewed(orderId, productId, id);
  }

  @Get(':product')
  findByProduct(@Param('product') productId: string) {
    return this.productReviewService.findByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productReviewService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ) {
    return this.productReviewService.update(+id, updateProductReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productReviewService.remove(+id);
  }
}
