"use client";

import { Product } from "@/lib/schemas";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCartStore } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const addItem = useCartStore((state) => state.addItem);

  const name = product.name[locale as keyof typeof product.name];
  const description = product.description[locale as keyof typeof product.description];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="relative w-full h-48">
          <Image src={product.image} alt={name} fill className="object-cover rounded-md" />
        </div>
        <CardTitle className="mt-4">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        <p className="mt-2 font-bold text-lg">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex w-full gap-2">
            <Button variant="outline" className="w-full" asChild>
                <Link href={`/product/${product.id}`}>{t('details')}</Link>
            </Button>
            <Button onClick={() => addItem(product)} className="w-full">{t('addToCart')}</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
