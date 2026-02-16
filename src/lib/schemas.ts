import { z } from "zod";

export const LocalizedStringSchema = z.object({
  en: z.string().min(1),
  fa: z.string().min(1),
  ps: z.string().min(1),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  description: LocalizedStringSchema,
  price: z.number().min(0),
  image: z.string().url(),
  category: z.string().min(1),
  status: z.enum(["active", "archived"]),
  inventory: z.number().int().min(0),
});

export type Product = z.infer<typeof ProductSchema>;

export const CartItemSchema = ProductSchema.extend({
  quantity: z.number().int().min(1),
  giftWrap: z.boolean().default(false),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const GuestInfoSchema = z.object({
  email: z.string().email(),
  shippingAddress: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
  // paymentDetails: z.any(), // Handled by Stripe/payment processor
});

export const OrderSchema = z.object({
  id: z.string().optional(),
  items: z.array(CartItemSchema),
  total: z.number().min(0),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  guestInfo: GuestInfoSchema,
  paymentIntentId: z.string().optional(),
  createdAt: z.any(), // Firestore timestamp
});

export type Order = z.infer<typeof OrderSchema>;
