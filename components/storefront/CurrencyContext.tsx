"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "RUB" | "AUD" | "CAD" | "ZAR";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: "USD", symbol: "$", rate: 1.0, label: "USD ($)" },
  INR: { code: "INR", symbol: "₹", rate: 83.5, label: "INR (₹)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.78, label: "GBP (£)" },
  RUB: { code: "RUB", symbol: "₽", rate: 90.0, label: "RUB (₽)" },
  AUD: { code: "AUD", symbol: "A$", rate: 1.50, label: "AUD (A$)" },
  CAD: { code: "CAD", symbol: "C$", rate: 1.37, label: "CAD (C$)" },
  ZAR: { code: "ZAR", symbol: "R", rate: 18.2, label: "ZAR (R)" },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatLocalPrice: (usdAmount: number) => string;
  isLoaded: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check local storage first
    const saved = localStorage.getItem("user-currency") as CurrencyCode;
    if (saved && CURRENCIES[saved]) {
      setCurrencyCode(saved);
      setIsLoaded(true);
      return;
    }

    // 2. Fallback to location-based detection (Timezone & Language)
    let detected: CurrencyCode = "USD";
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = navigator.language || "";

      if (tz.includes("Kolkata") || tz.includes("Calcutta") || lang.includes("in")) {
        detected = "INR";
      } else if (tz.includes("Europe/Moscow") || tz.includes("Moscow") || tz.includes("Russian") || lang.includes("ru")) {
        detected = "RUB";
      } else if (tz.includes("London") || tz.includes("GB") || lang.includes("en-GB")) {
        detected = "GBP";
      } else if (tz.includes("Europe/") || lang.includes("fr") || lang.includes("de") || lang.includes("it") || lang.includes("es")) {
        detected = "EUR";
      } else if (tz.includes("Australia") || tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane")) {
        detected = "AUD";
      } else if (tz.includes("Canada") || tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal")) {
        detected = "CAD";
      } else if (tz.includes("Africa/") || tz.includes("Johannesburg") || tz.includes("Cairo") || tz.includes("Lagos")) {
        detected = "ZAR";
      }

      setCurrencyCode(detected);
    } catch {
      // Ignore
    }

    // 3. Try geo IP detection API for premium reliability
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          const country = data.country_code.toUpperCase();
          let geoDetected: CurrencyCode = "USD";
          
          if (country === "IN") geoDetected = "INR";
          else if (country === "RU") geoDetected = "RUB";
          else if (country === "GB") geoDetected = "GBP";
          else if (["DE", "FR", "IT", "ES", "NL", "BE", "AT", "FI", "GR", "IE", "PT"].includes(country)) geoDetected = "EUR";
          else if (country === "AU") geoDetected = "AUD";
          else if (country === "CA") geoDetected = "CAD";
          else if (["ZA", "NG", "KE", "EG", "MA"].includes(country)) geoDetected = "ZAR";
          
          setCurrencyCode(geoDetected);
          localStorage.setItem("user-currency", geoDetected);
        }
      })
      .catch(() => {
        // Fall back silently to timezone detection
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const handleSetCurrencyCode = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyCode(code);
      localStorage.setItem("user-currency", code);
    }
  };

  const formatLocalPrice = (usdAmount: number) => {
    const cur = CURRENCIES[currencyCode];
    const converted = usdAmount * cur.rate;
    
    // Format using standard Intl formatting
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: CURRENCIES[currencyCode],
        setCurrencyCode: handleSetCurrencyCode,
        formatLocalPrice,
        isLoaded,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
