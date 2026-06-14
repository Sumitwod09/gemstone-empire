"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui";
import { formatPrice, formatCarat } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 25 : 0;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-4">
        <FontAwesomeIcon icon={faBagShopping} className="w-16 h-16 text-[var(--color-border-strong)]" />
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Your cart is empty
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-sm">
          You haven't added any gems yet. Browse our collection to find your perfect stone.
        </p>
        <Link href="/products">
          <Button size="lg" className="mt-2">Browse Gems</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Item list */}
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const primaryImage =
              item.variant.images?.find((img) => img.is_primary) ??
              item.variant.images?.[0];
            return (
              <div
                key={item.variantId}
                className="flex gap-4 bg-white border border-[var(--color-border)] rounded-[8px] p-4"
              >
                <div className="w-20 h-20 flex-shrink-0 bg-[var(--color-surface)] rounded-[6px] overflow-hidden relative">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt_text ?? item.variant.sku}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                    {item.variant.product?.name ?? item.variant.sku}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 capitalize">
                    {item.variant.shape} / {formatCarat(item.variant.carat_weight)}
                  </p>
                  {item.variant.origin && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.variant.origin}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {item.variant.stock_qty > 1 ? (
                        <>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 border border-[var(--color-border)] rounded flex items-center justify-center text-sm hover:bg-[var(--color-surface)]"
                          >
                            -
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 border border-[var(--color-border)] rounded flex items-center justify-center text-sm hover:bg-[var(--color-surface)]"
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-[var(--color-text-muted)]">Qty: 1</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.variant.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  aria-label="Remove item"
                  className="self-start p-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <aside className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-5 h-fit sticky top-20">
          <h2 className="text-base font-semibold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {subtotal < 500 && subtotal > 0 && (
              <p className="text-xs text-[var(--color-text-muted)]">
                Free shipping on orders over $500
              </p>
            )}
          </div>
          <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="block mt-4">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/products" className="block mt-2">
            <Button variant="ghost" className="w-full" size="sm">
              Continue Shopping
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
