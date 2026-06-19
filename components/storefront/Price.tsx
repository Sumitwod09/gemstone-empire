"use client";

import { useCurrency } from "./CurrencyContext";
import { useEffect, useState } from "react";

interface PriceProps {
  amount: number;
  className?: string;
}

export function Price({ amount, className = "" }: PriceProps) {
  const { formatLocalPrice, isLoaded } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    // Server render or pre-mount fallback: USD price
    return (
      <span className={className} suppressHydrationWarning>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount)}
      </span>
    );
  }

  return (
    <span className={className} suppressHydrationWarning>
      {formatLocalPrice(amount)}
    </span>
  );
}
