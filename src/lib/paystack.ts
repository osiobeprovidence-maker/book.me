const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export interface PaystackConfig {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

export function initializePayment(config: PaystackConfig) {
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount * 100,
    ref: config.reference,
    metadata: config.metadata,
    callback: (response: { reference: string }) => {
      config.onSuccess(response.reference);
    },
    onClose: () => {
      config.onCancel();
    },
  });
  handler.openIframe();
}

export function generateReference() {
  return 'BK_' + Math.random().toString(36).substring(2, 15).toUpperCase();
}
