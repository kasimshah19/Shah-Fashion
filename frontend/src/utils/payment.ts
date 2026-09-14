import type { PaymentMethod } from '../types';

export interface PaymentInitParams {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

/**
 * STUB: Payment gateway integration point.
 * Replace this function with Razorpay / PayU / Cashfree SDK calls.
 *
 * Example Razorpay integration:
 * ```
 * const options = {
 *   key: import.meta.env.VITE_RAZORPAY_KEY,
 *   amount: amount * 100,
 *   order_id: razorpayOrderId,
 *   handler: (response) => { ... }
 * };
 * new Razorpay(options).open();
 * ```
 */
export async function initiatePayment(params: PaymentInitParams): Promise<PaymentResult> {
  try {
    const res = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return { success: data.success, paymentId: data.paymentId };
  } catch {
    // Fallback for offline/demo mode
    await new Promise((r) => setTimeout(r, 1500));
    return { success: true, paymentId: `pay_demo_${Date.now()}` };
  }
}
