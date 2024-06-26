import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { Products } from './modules/products/entities/product.entity';
import { DetailProductModule } from './modules/detail-product/detail-product.module';
import { DetailProduct } from './modules/detail-product/entities/detail-product.entity';
import { Category } from './modules/category/entities/category.entity';
import { Subcategory } from './modules/subcategory/entities/subcategory.entity';
import { UserAddress } from './modules/user_address/entities/user_address.entity';
import { CategoryModule } from './modules/category/category.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { Cart } from './modules/cart/entities/cart.entity';
import { CartModule } from './modules/cart/cart.module';
import { UserAddressModule } from './modules/user_address/user_address.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { Order } from './modules/order/entities/order.entity';
import { OrderModule } from './modules/order/order.module';
import { OrderDetail } from './modules/order_detail/entities/order_detail.entity';
import { OrderDetailModule } from './modules/order_detail/order_detail.module';
import { MessageModule } from './modules/message/message.module';
import { Message } from './modules/message/entities/message.entity';
import { Wishlist } from './modules/wishlist/entities/wishlist.entity';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ProductReviewModule } from './modules/product_review/product_review.module';
import { ProductReview } from './modules/product_review/entities/product_review.entity';
import { Conversation } from './modules/conversations/entities/conversation.entity';
import { ConversationsModule } from './modules/conversations/conversations.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        timezone: 'local',
        entities: [
          User,
          Products,
          DetailProduct,
          Category,
          Subcategory,
          UserAddress,
          Cart,
          Order,
          OrderDetail,
          Message,
          Wishlist,
          ProductReview,
          Conversation,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      envFilePath: '.env.example',
    }),

    CategoryModule,
    SubcategoryModule,
    ProductsModule,
    DetailProductModule,
    CartModule,
    UserAddressModule,
    StripeModule,
    OrderModule,
    OrderDetailModule,
    MessageModule,
    WishlistModule,
    ProductReviewModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
