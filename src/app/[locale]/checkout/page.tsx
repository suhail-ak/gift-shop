"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { GuestInfoSchema } from "@/lib/schemas";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { createOrder } from "@/app/actions/checkout";
import Turnstile from "@/components/Turnstile";
import { useMounted } from "@/hooks/use-mounted";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mounted = useMounted();

  const form = useForm<z.infer<typeof GuestInfoSchema>>({
    resolver: zodResolver(GuestInfoSchema),
    defaultValues: {
      email: "",
      shippingAddress: {
        name: "",
        address: "",
        city: "",
        zip: "",
        country: "",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof GuestInfoSchema>) => {
    setIsSubmitting(true);

    try {
        const orderData = {
            items: items.map(item => ({ id: item.id, quantity: item.quantity })),
            guestInfo: data
        };
        const result = await createOrder(orderData);
        if (result.success) {
            clearCart();
            router.push("/");
        }
    } catch (e) {
        console.error("Order failed", e);
    }
    setIsSubmitting(false);
  };

  if (!mounted) return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
    </div>
  );

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
      return <div className="p-8 text-center">Cart is empty</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <FormField
                control={form.control}
                name="shippingAddress.name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="shippingAddress.address"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="shippingAddress.city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('city')}</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shippingAddress.zip"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('zip')}</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
             <FormField
                control={form.control}
                name="shippingAddress.country"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('country')}</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>

          <Turnstile />

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : t('submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
