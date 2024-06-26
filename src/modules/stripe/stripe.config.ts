import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeConfigService {
  [x: string]: any;
  constructor(private readonly configService: ConfigService) {}

  get secretKey(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY');
  }
}
