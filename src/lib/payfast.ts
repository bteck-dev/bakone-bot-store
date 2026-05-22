import { apiRequest } from "./api";

type CheckoutRequest = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
};

type CheckoutResponse = {
  orderId: string;
  payfast: {
    actionUrl: string;
    data: Record<string, string>;
  };
};

const submitPayFastForm = (actionUrl: string, data: Record<string, string>) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  form.enctype = "application/x-www-form-urlencoded";

  Object.entries(data)
    .filter(([, value]) => value !== "")
    .forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

  document.body.appendChild(form);
  form.submit();
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

  submitPayFastForm(checkout.payfast.actionUrl, checkout.payfast.data);
}
