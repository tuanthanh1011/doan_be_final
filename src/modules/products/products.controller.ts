import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UsePipes,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/list-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { Roles } from 'src/decorator/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/validation.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('EMPLOYEE')
  @Get('totalProduct')
  getTotalProduct() {
    return this.productsService.getTotalProduct();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Get('allProduct')
  async findAllByAdmin(@Query() findProductsDto: FindProductsDto) {
    return this.productsService.findAllByAdmin(findProductsDto);
  }

  @Get()
  async findAll(@Query() findProductsDto: FindProductsDto) {
    return this.productsService.findAll(findProductsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: any) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileValidationPipe())
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const urlImage = await this.productsService.uploadFile(file);
    res.json({
      data: {
        urlImage: urlImage,
      },
    });
  }
}
