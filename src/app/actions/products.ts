"use server";

import { getAdminFirestore } from "@/lib/firebase-admin";
import { Product } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { dummyProducts } from "@/lib/dummy-data";

export async function getProducts(status: "active" | "archived" | "all" = "active"): Promise<Product[]> {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasServiceAccount) {
    // Filter dummy products if needed
    if (status !== "all") {
        return dummyProducts.filter(p => p.status === status);
    }
    return dummyProducts;
  }

  try {
    const db = getAdminFirestore();
    let query: FirebaseFirestore.Query = db.collection("products");

    if (status !== "all") {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const products: Product[] = [];

    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to dummy data in case of error
    if (status !== "all") {
        return dummyProducts.filter(p => p.status === status);
    }
    return dummyProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasServiceAccount) {
    return dummyProducts.find(p => p.id === id) || null;
  }

  try {
    const db = getAdminFirestore();
    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return dummyProducts.find(p => p.id === id) || null;
  }
}

export async function createProduct(data: Omit<Product, "id">) {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasServiceAccount) {
    throw new Error("No service account configured. Cannot perform write operations.");
  }

  const db = getAdminFirestore();
  const docRef = await db.collection("products").add(data);
  revalidatePath("/admin/products");
  revalidatePath("/");
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id">>) {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasServiceAccount) {
    throw new Error("No service account configured. Cannot perform write operations.");
  }

  const db = getAdminFirestore();
  await db.collection("products").doc(id).update(data);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasServiceAccount) {
    throw new Error("No service account configured. Cannot perform write operations.");
  }

  const db = getAdminFirestore();
  await db.collection("products").doc(id).update({ status: "archived" });
  revalidatePath("/admin/products");
  revalidatePath("/");
}
