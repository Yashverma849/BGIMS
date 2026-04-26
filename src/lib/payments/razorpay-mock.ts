import type { PaymentGateway, PaymentIntent, PaymentResult, PaymentChargeOptions } from './adapter';
import type { PaymentMethod } from '~lib/schema';
import { newPaymentId, type ProgrammeId } from '~lib/schema';
import { formatINR } from '~lib/format';

const STAGES = [
  'Connecting to Razorpay…',
  'Verifying payment method…',
  'Authorising with your bank…',
  'Confirming transaction…',
];

export const razorpayMock: PaymentGateway = {
  async charge(
    intent: PaymentIntent,
    method: PaymentMethod,
    opts?: PaymentChargeOptions,
  ): Promise<PaymentResult> {
    const onProgress = opts?.onProgress;
    onProgress?.(STAGES[0]);
    let stage = 0;
    const tick = setInterval(() => {
      stage++;
      if (stage < STAGES.length) onProgress?.(STAGES[stage]);
    }, 700);
    await new Promise((r) => setTimeout(r, 3200));
    clearInterval(tick as unknown as number);
    return {
      paymentId: newPaymentId(),
      method,
      amountLabel: formatINR(intent.amountInPaise / 100),
      capturedAt: new Date().toISOString(),
      status: 'captured',
    };
  },
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Credit / Debit card',
  netbanking: 'Net banking',
  wallet: 'Wallet',
};

export const PROGRAMME_LABEL: Record<ProgrammeId, string> = {
  'MBA-BF': 'MBA · Banking & Finance',
  MMS: 'MMS',
  BMS: 'BMS',
  PHD: 'Ph.D.',
};
