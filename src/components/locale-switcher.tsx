"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as "en" | "tr", scroll: false });
    });
  };

  return (
    <div
      className={`flex items-center gap-1 bg-white/10 rounded-md p-0.5 transition-opacity duration-300 ${isPending ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
    >
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => handleSwitch(loc.code)}
          disabled={isPending}
          className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${locale === loc.code
            ? "bg-white text-black"
            : "text-white/70 hover:text-white"
            }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
