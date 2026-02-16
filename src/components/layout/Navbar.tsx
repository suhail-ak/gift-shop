import { Link } from "@/i18n/routing";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import CartButton from "@/components/cart/CartButton";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <nav className="border-b bg-background">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          {t('brand')}
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:underline">
            {t('home')}
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:underline">
            {t('admin')}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
