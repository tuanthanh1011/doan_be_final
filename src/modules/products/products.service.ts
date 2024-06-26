import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { FindProductsDto } from './dto/list-product.dto';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BucketName } from 'src/constans/enum';
import { ProductReview } from '../product_review/entities/product_review.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private readonly subcategoryService: SubcategoryService,
    private readonly minioClientService: MinioClientService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { subcategory, image, productName, price } = createProductDto;
    const subcategoryFind = await this.subcategoryService.findOne(subcategory);
    const create = this.productsRepository.create({
      image,
      productName,
      price,
      subcategory: subcategoryFind,
    });
    return this.productsRepository.save(create);
  }

  async findAll(findProductsDto: FindProductsDto) {
    const {
      search,
      page,
      category,
      subCategory,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.subcategory', 'subcategory')
      .innerJoinAndSelect('subcategory.category', 'category')
      .where('product.isActive = true')
      .andWhere('subcategory.isActive');

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category && subCategory) {
      query
        .andWhere('subcategory.slug = :subCategorySlug', {
          subCategorySlug: subCategory,
        })
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    } else if (category) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: category,
      });
    } else if (subCategory) {
      query.andWhere('subcategory.slug = :subCategorySlug', {
        subCategorySlug: subCategory,
      });
    }

    if (sortBy) {
      query.orderBy(
        `product.${sortBy}`,
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

  async findAllByAdmin(findProductsDto: FindProductsDto) {
    const {
      search,
      page,
      category,
      subCategory,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.subcategory', 'subcategory')
      .innerJoinAndSelect('subcategory.category', 'category')
      .andWhere('subcategory.isActive');

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category && subCategory) {
      query
        .andWhere('subcategory.slug = :subCategorySlug', {
          subCategorySlug: subCategory,
        })
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    } else if (category) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: category,
      });
    } else if (subCategory) {
      query.andWhere('subcategory.slug = :subCategorySlug', {
        subCategorySlug: subCategory,
      });
    }

    if (sortBy) {
      query.orderBy(
        `product.${sortBy}`,
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

  async findAllAdmin(findProductsDto: FindProductsDto) {
    const {
      search,
      page,
      category,
      subCategory,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.subcategory', 'subcategory')
      .innerJoinAndSelect('subcategory.category', 'category');

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category && subCategory) {
      query
        .andWhere('subcategory.slug = :subCategorySlug', {
          subCategorySlug: subCategory,
        })
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    } else if (category) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: category,
      });
    } else if (subCategory) {
      query.andWhere('subcategory.slug = :subCategorySlug', {
        subCategorySlug: subCategory,
      });
    }

    if (sortBy) {
      query.orderBy(
        `product.${sortBy}`,
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

  async findProductById(id: string) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm tương ứng');
    }

    return product;
  }

  async findOne(id: string) {
    const product = await this.productsRepository
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.subcategory', 'subcategory')
      .where('products.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm tương ứng');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { image, productName, subcategory, isActive, price } =
      updateProductDto;

    const product = await this.productsRepository.findOneBy({
      id: id,
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy món ăn phù hợp');
    }

    if (subcategory) {
      const subcategoryInstance =
        await this.subcategoryService.findOne(subcategory);
      if (!subcategoryInstance) {
        throw new NotFoundException('Không tìm thấy danh mục phù hợp');
      }
      product.subcategory = subcategoryInstance;
    }

    product.image = image;

    product.productName = productName;

    product.isActive = isActive;

    product.price = price;

    await this.productsRepository.save(product);

    return product;
  }

  remove(productId: string) {
    try {
      const query = this.productsRepository
        .createQueryBuilder('products')
        .delete()
        .where('products.id = :productId', { productId });

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

  async uploadFile(file: Express.Multer.File) {
    try {
      const urlImage = await this.minioClientService.uploadFile(
        file,
        BucketName.PRODUCTS_BUCKET,
      );
      return urlImage;
    } catch (err) {
      console.log(err);
    }
  }

  async updateRateAvg(productId: string, rateAvg: number, totalRate: number) {
    const product = await this.findProductById(productId);

    product.rateAvg = rateAvg;

    product.rateTotal = totalRate;

    await this.productsRepository.save(product);

    return product;
  }

  async getTotalProduct() {
    const result = await this.productsRepository.findBy({
      isActive: true,
    });

    return {
      total: result.length,
    };
  }
}
