"use client";
import { useTranslations } from "next-intl";
import { useDemoModal } from "./demo-modal-provider";

interface DemoButtonProps {
  variant?: "navbar" | "hero";
}

export function DemoButton({ variant = "navbar" }: DemoButtonProps) {
  const t = useTranslations("hero");
  const { openModal } = useDemoModal();

  // Navbar: kompakt buton (header'da)
  const navbarClasses = "px-3.5 py-1.5 rounded-lg text-sm gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5),0_0_40px_rgba(168,85,247,0.2)]";
  
  // Hero: büyük buton (ana sayfada GitHub butonu ile aynı boyut)
  const heroClasses = "px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base gap-2.5 min-w-[140px] sm:min-w-[160px] shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6),0_0_60px_rgba(168,85,247,0.3)]";
  
  const iconSize = variant === "navbar" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <button
      onClick={openModal}
      className={`group relative bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-white font-semibold tracking-wide backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center cursor-pointer overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400 before:via-violet-400 before:to-pink-400 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:-z-10 ${variant === "navbar" ? navbarClasses : heroClasses}`}
    >
      <svg
        className={`${iconSize} relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      <span className="relative z-10 whitespace-nowrap transition-all duration-300">
        {t("bookDemo")}
      </span>
    </button>
  );
}
