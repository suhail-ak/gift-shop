"use server";

import { getAdminFirestore } from "@/lib/firebase-admin";
import { GuestInfoSchema, Product } from "@/lib/schemas";
import { dummyProducts } from "@/lib/dummy-data";
import { z } from "zod";

const CreateOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().min(1),
    giftWrap: z.boolean().optional(),
  })),
  guestInfo: GuestInfoSchema,
});

export async function createOrder(data: z.infer<typeof CreateOrderSchema>) {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Validate input
  const validated = CreateOrderSchema.parse(data);

  // Rate Limiting (Placeholder)
  // const ip = headers().get("x-forwarded-for");
  // await checkRateLimit(ip);

  let total = 0;
  const db = hasServiceAccount ? getAdminFirestore() : null;
  const orderItems = [];

  for (const item of validated.items) {
    let product;
    if (db) {
        try {
            const doc = await db.collection("products").doc(item.id).get();
            if (doc.exists) {
                product = { id: doc.id, ...doc.data() } as unknown as Product;
            }
        } catch (e) {
            console.error("Error fetching product for order", e);
        }
    }

    if (!product) {
        // Fallback to dummy data
        product = dummyProducts.find(p => p.id === item.id);
    }

    if (!product) {
        throw new Error(`Product ${item.id} not found`);
    }

    // Price Integrity: Use server price
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItems.push({
        ...product,
        quantity: item.quantity,
        giftWrap: item.giftWrap || false
    });
  }

  const order = {
    items: orderItems,
    total,
    status: "pending",
    guestInfo: validated.guestInfo,
    createdAt: new Date(),
  };

  if (db) {
    const ref = await db.collection("orders").add(order);
    return { success: true, orderId: ref.id };
  } else {
    console.log("Mock Order Created:", order);
    return { success: true, orderId: "mock-id-" + Date.now() };
  }
}
