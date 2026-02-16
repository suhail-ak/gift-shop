"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {cur === "en"
              ? "English"
              : cur === "fa"
              ? "فارسی"
              : "پښتو"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
