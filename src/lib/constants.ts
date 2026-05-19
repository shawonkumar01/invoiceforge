export const APP_NAME = "InvoiceForge";
export const FREE_INVOICE_LIMIT = 5;

/** Replace with your Lemon Squeezy / Stripe payment link after signup */
export const PRO_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_PRO_CHECKOUT_URL ||
  "https://your-store.lemonsqueezy.com/checkout/buy/your-product";

export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"] as const;
