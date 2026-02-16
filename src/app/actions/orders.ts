"use server";

import { getAdminFirestore } from "@/lib/firebase-admin";
import { Order } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getOrders(): Promise<Order[]> {
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!hasServiceAccount) {
        return []; // No dummy orders for now
    }

    try {
        const db = getAdminFirestore();
        const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
        const orders: Order[] = [];
        snapshot.forEach((doc) => {
             orders.push({ id: doc.id, ...doc.data() } as Order);
        });
        return orders;
    } catch (e) {
        console.error("Error fetching orders", e);
        return [];
    }
}

export async function updateOrderStatus(id: string, status: Order['status']) {
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!hasServiceAccount) {
         throw new Error("No service account");
    }
    const db = getAdminFirestore();
    await db.collection("orders").doc(id).update({ status });
    revalidatePath("/admin/orders");
}
