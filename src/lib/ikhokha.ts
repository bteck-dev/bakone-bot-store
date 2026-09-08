import { apiRequest } from "./api";

type CheckoutRequest = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
};

type CheckoutResponse = {
  orderId: string;
  paymentId: string;
  paymentLink: string;
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

  if (!checkout.paymentLink) throw new Error("iKhokha did not return a checkout link.");
  window.location.assign(checkout.paymentLink);
}
