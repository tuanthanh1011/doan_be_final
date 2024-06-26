import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigModule } from '@nestjs/config';
import { StripeConfigService } from './stripe.config';
import { OrderModule } from '../order/order.module';
import { OrderDetailModule } from '../order_detail/order_detail.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [ConfigModule, StripeModule, OrderModule, CartModule],
  controllers: [StripeController],
  providers: [StripeService, StripeConfigService],
})
export class StripeModule {}
