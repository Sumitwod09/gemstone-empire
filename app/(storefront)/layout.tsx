import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { getCategories } from "@/lib/db";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
