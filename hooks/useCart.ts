"use client";

import { useCartStore } from "@/stores/cartStore";
import type { GemVariant } from "@/types";

export function useCart() {
  const store = useCartStore();

  return {
    items: store.items,
    itemCount: store.itemCount(),
    subtotal: store.subtotal(),
    addItem: (variant: GemVariant, quantity = 1) =>
      store.addItem(variant, quantity),
    removeItem: (variantId: string) => store.removeItem(variantId),
    updateQuantity: (variantId: string, quantity: number) =>
      store.updateQuantity(variantId, quantity),
    clearCart: store.clearCart,
  };
}
