export enum ProductType {
  'NUONG' = 'NUONG',
  'LAU' = 'LAU',
}

export enum StripePaymentMode {
  PAYMENT = 'payment',
  SUBSCRIPTION = 'subscription',
}

export enum StripeEvent {
  PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded',
  INVOICE_PAYMENT_SUCCEEDED = 'invoice.payment_succeeded',
}

export enum BucketName {
  AVATAR_BUCKET = 'avatar',
  PRODUCTS_BUCKET = 'products',
}

export const PAYMENT_SUCCESS_URL = 'http://localhost:8080/home';

export const PAYMENT_CANCEL_URL = 'http://localhost:8080/home';

export const SUBSCRIPTION_SUCCESS_URL =
  `http://localhost:${process.env.PORT || 3000}` +
  '/stripe/sub/success/checkout/session?session_id={CHECKOUT_SESSION_ID}';

export const SUBSCRIPTION_CANCEL_URL =
  `http://localhost:${process.env.PORT || 3000}` +
  '/stripe/sub/failed/checkout/session';

export const API_VERSION_STRIPE = '2024-04-10';
