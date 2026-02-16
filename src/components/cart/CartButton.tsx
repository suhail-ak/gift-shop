"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useMounted } from "@/hooks/use-mounted";

export default function CartButton() {
  const mounted = useMounted();
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Link href="/cart">
      <Button variant="outline" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
