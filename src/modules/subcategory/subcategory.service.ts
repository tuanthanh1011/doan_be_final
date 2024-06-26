import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { FindSubcategoryDto } from './dto/list-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private subCategoryRepository: Repository<Subcategory>,

    private readonly categoryService: CategoryService,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const { subCategoryName, description, category } = createSubcategoryDto;
    const categoryFind = await this.categoryService.findOne(category);
    const slug = this.convertToSlug(subCategoryName);
    const create: Subcategory = this.subCategoryRepository.create({
      subCategoryName,
      description,
      category: categoryFind,
      slug,
    });

    return this.subCategoryRepository.save(create);
  }

  convertToSlug(text: string) {
    const from =
      'ÁÀẠÃẢÂẤẦẬẪẨĂẮẰẶẴẲÉÈẸẼẺÊẾỀỆỄỂÓÒỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÚÙỤŨỦƯỨỪỰỮỬÍÌỊĨỈÝỲỴỸỶĐáàạãảâấầậẫẩăắằặẵẳéèẹẽẻêếềệễểóòọõỏôốồộỗổơớờợỡởúùụũủưứừựữửíìịĩỉýỳỵỹỷđ';
    const to =
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeoooooooooooooooouuuuuuuuuiiiiiyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEOOOOOOOOOOOOOOOOUUUUUUUUIIIIIYYYYYD';

    text = text
      .split('')
      .map((char, i) => {
        const index = from.indexOf(char);
        return index !== -1 ? to[index] : char;
      })
      .join('');

    text = text.toLowerCase();

    text = text
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return text;
  }

  async findAll(findSubcategoryDto: FindSubcategoryDto) {
    const {
      search,
      page,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findSubcategoryDto;

    const query = this.subCategoryRepository
      .createQueryBuilder('subcategory')
      .innerJoinAndSelect('subcategory.category', 'category');

    if (search) {
      query.andWhere('subcategory.subCategoryName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      query.orderBy(
        `subcategory.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [items, total] = await query.getManyAndCount();
    const totalPage = perPage ? Math.ceil(total / perPage) : 1;

    return {
      page: +page || 1,
      perPage: +perPage || total,
      rows: items,
      total,
      totalPage,
    };
  }

  async findOne(id: string): Promise<Subcategory> {
    const subcategory = await this.subCategoryRepository
      .createQueryBuilder('subcategory')
      .innerJoinAndSelect('subcategory.category', 'category')
      .where('subcategory.id = :id', { id })
      .getOne();

    if (!subcategory) {
      throw new NotFoundException('Không tìm thấy danh mục tương ứng');
    }

    return subcategory;
  }

  async update(
    subcategoryId: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    const { description, category, isActive, subCategoryName } =
      updateSubcategoryDto;
    const subcategory = await this.findOne(subcategoryId);

    const categoryFind = await this.categoryService.findOne(category);

    subcategory.category = categoryFind;

    subcategory.description = description;

    subcategory.subCategoryName = subCategoryName;

    subcategory.isActive = isActive;

    await this.subCategoryRepository.save(subcategory);

    return subcategory;
  }

  remove(subcategoryId: string) {
    try {
      const query = this.subCategoryRepository
        .createQueryBuilder('subcategory')
        .delete()
        .where('subcategory.id = :subcategoryId', { subcategoryId });

      return query.execute();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Sản phẩm đã được sử dụng. Không thể xóa',
        );
      } else {
        throw new BadRequestException();
      }
    }
  }
}
