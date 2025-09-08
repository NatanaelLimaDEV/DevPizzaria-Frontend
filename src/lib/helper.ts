import { OrderItemProps } from "@/providers/order";


export function calculateTotal(order: OrderItemProps[]) {
    return order.reduce((total, item) => {
        const itemTotal = parseFloat(item.product.price) * item.amount;
        return total + itemTotal;
    }, 0);
}