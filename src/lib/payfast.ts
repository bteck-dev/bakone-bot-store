// PayFast checkout helpers.
// NOTE: You will wire up your backend to generate a signed payload + ITN endpoint.
// For now, this submits a standard PayFast HTML form. Swap PAYFAST_URL to live
// (https://www.payfast.co.za/eng/process) when going to production.

import type { Product } from "./products";

export const PAYFAST_URL = "https://sandbox.payfast.co.za/eng/process";
// Sandbox merchant credentials (PayFast public test credentials). Replace with
// your real merchant_id/merchant_key from env on the server before launch.
export const PAYFAST_MERCHANT_ID = "10000100";
export const PAYFAST_MERCHANT_KEY = "46f0cd694581a";

// PayFast charges in ZAR. Frontend stores prices in USD as per the brief —
// we convert with a simple rate stub. Your backend should do the live conversion
// (or charge directly in ZAR) before signing the payload.
export const USD_TO_ZAR = 19;

export function payfastFieldsForProduct(
  product: Product,
  buyerEmail: string,
  origin: string,
) {
  const amountZAR = (product.priceUSD * USD_TO_ZAR).toFixed(2);
  const m_payment_id = `${product.id}-${Date.now()}`;
  return {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${origin}/success?ref=${m_payment_id}`,
    cancel_url: `${origin}/shop?cancelled=1`,
    notify_url: `${origin}/api/public/payfast-notify`,
    m_payment_id,
    amount: amountZAR,
    item_name: `${product.name} — License Key`,
    item_description: product.shortDescription.slice(0, 250),
    email_address: buyerEmail,
    custom_str1: product.id,
  } as const;
}
