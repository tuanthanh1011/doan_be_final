import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { FindSubcategoryDto } from './dto/list-subcategory.dto';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Get()
  findAll(@Query() findSubcategoryDto: FindSubcategoryDto) {
    console.log(findSubcategoryDto);
    return this.subcategoryService.findAll(findSubcategoryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') subcategoryId: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update(subcategoryId, updateSubcategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
