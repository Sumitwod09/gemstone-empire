"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GemVariant } from "@/types";

export interface CartStoreItem {
  variantId: string;
  quantity: number;
  variant: GemVariant;
}

interface CartStore {
  items: CartStoreItem[];
  addItem: (variant: GemVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (variant, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === variant.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === variant.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { variantId: variant.id, quantity, variant },
            ],
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.variant.price * i.quantity,
          0
        ),
    }),
    {
      name: "gemstone-empire-cart",
    }
  )
);
