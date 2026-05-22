import { DataBlock } from "../components";
import { OrderTable } from "./OrderTable";
import type { Order } from "../types";

export function OrdersPanel({ orders, onChanged, onMessageOrder }: {
  orders: Order[];
  onChanged: () => void;
  onMessageOrder: (order: Order) => void;
}) {
  return (
    <DataBlock title="Orders">
      <OrderTable orders={orders} onChanged={onChanged} onMessageOrder={onMessageOrder} />
    </DataBlock>
  );
}
