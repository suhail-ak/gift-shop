"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

export default function CartPage() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const { items, updateQuantity, removeItem } = useCartStore();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>
    );
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('empty')}</p>
        <Button asChild className="mt-8">
          <Link href="/">{t('continueShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const name = item.name[locale as keyof typeof item.name];
            return (
              <div key={item.id} className="flex gap-4 border p-4 rounded-lg items-center">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image src={item.image} alt={name} fill className="object-cover rounded-md" />
                </div>
                <div className="flex-grow space-y-2">
                  <h3 className="font-bold">{name}</h3>
                  <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.id)} className="ml-4 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-1">
          <div className="border p-6 rounded-lg space-y-4 sticky top-4">
            <div className="flex justify-between text-lg font-bold">
              <span>{t('total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/checkout">{t('checkout')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
