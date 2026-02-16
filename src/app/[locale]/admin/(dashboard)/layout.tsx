"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4 space-y-4 bg-gray-50">
        <h1 className="text-xl font-bold mb-8 px-4">Admin Dashboard</h1>
        <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start" asChild>
                <Link href="/admin">Overview</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
                <Link href="/admin/products">Products</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
                <Link href="/admin/orders">Orders</Link>
            </Button>
             <Button variant="outline" className="justify-start mt-8" onClick={() => auth.signOut()}>
                Logout
            </Button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
