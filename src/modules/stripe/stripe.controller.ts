import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { GetUrlPaymentDto } from './dto/getUrlPayment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('payment')
  getUrlPayment(@Body() getUrlPaymentDto: any, @User() user: IUser) {
    return this.stripeService.getUrl(getUrlPaymentDto, user);
  }

  @Get('pay/success/checkout/session')
  paymentSuccess() {
    return { status: 'payment-success', payment: 'success' };
  }

  @Get('sub/success/checkout/session')
  subscriptionSuccess() {
    return { status: 'subscription-payment-success', payment: 'success' };
  }

  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    return this.stripeService.webhook(signature, request.rawBody);
  }
}
