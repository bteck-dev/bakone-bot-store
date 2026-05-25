import { apiRequest } from "./api";

type CheckoutRequest = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
};

type CheckoutResponse = {
  orderId: string;
  approvalUrl?: string;
  paypal?: {
    approvalUrl?: string;
  };
};

const getCheckoutUrl = (checkout: CheckoutResponse): string => {
  return checkout.approvalUrl || checkout.paypal?.approvalUrl || "";
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

  const checkoutUrl = getCheckoutUrl(checkout);

  if (!checkoutUrl) {
    throw new Error("Payment provider did not return a checkout URL.");
  }

  window.location.assign(checkoutUrl);
}


