import { apiRequest } from "./api";

type CheckoutRequest = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
};

type CheckoutResponse = {
  orderId: string;
  paymentLink?: string;
  approvalUrl?: string;
};

export async function startCheckout(input: CheckoutRequest) {
  const checkout = await apiRequest<CheckoutResponse>("/payments/checkout", {
    method: "POST",
    body: JSON.stringify({
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone || undefined,
      product_id: input.productId,
    }),
  });

  const checkoutUrl = checkout.paymentLink || checkout.approvalUrl;

  if (!checkoutUrl) {
    throw new Error("No payment link is configured for this product.");
  }

  window.location.assign(checkoutUrl);
}