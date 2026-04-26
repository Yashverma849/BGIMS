import type { PaymentMethod } from '~lib/schema';

export interface PaymentIntent {
  amountInPaise: number;
  currency: 'INR';
  description: string;
  applicationId: string;
}

export interface PaymentResult {
  paymentId: string;
  method: PaymentMethod;
  amountLabel: string;
  capturedAt: string;
  status: 'captured' | 'failed';
}

export interface PaymentGateway {
  /** Returns a promise that resolves when the gateway hands back control. */
  charge(intent: PaymentIntent, method: PaymentMethod, opts?: PaymentChargeOptions): Promise<PaymentResult>;
}

export interface PaymentChargeOptions {
  onProgress?: (message: string) => void;
}
