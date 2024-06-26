import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DetailProductService } from './detail-product.service';
import { CreateDetailProductDto } from './dto/create-detail-product.dto';
import { UpdateDetailProductDto } from './dto/update-detail-product.dto';

@Controller('detail-product')
export class DetailProductController {
  constructor(private readonly detailProductService: DetailProductService) {}

  @Post()
  create(@Body() createDetailProductDto: CreateDetailProductDto) {
    return this.detailProductService.create(createDetailProductDto);
  }

  // @Get()
  // findAll() {
  //   return this.detailProductService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.detailProductService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDetailProductDto: UpdateDetailProductDto) {
  //   return this.detailProductService.update(+id, updateDetailProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.detailProductService.remove(+id);
  // }
}
