"use client";
import { Product } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useTranslations } from "next-intl";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const t = useTranslations("Product");

  return (
    <Button size="lg" onClick={() => addItem(product)} className="w-full md:w-auto">
      {t('addToCart')}
    </Button>
  );
}
