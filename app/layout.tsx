import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gemstone Empire — Premium Loose Gemstones",
    template: "%s | Gemstone Empire",
  },
  description:
    "Shop premium loose precious and semi-precious gemstones. Certified quality, worldwide shipping from Hampshire, US.",
  openGraph: {
    siteName: "Gemstone Empire",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
