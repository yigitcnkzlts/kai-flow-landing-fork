"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { DemoButton } from "./demo-button";

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [starCount, setStarCount] = React.useState<number | null>(null);
  const t = useTranslations("header");

  const navLinks = [
    { name: t("features"), href: "#features" },
    { name: t("integrations"), href: "#integrations" },
    { name: t("content"), href: "#content" },
    { name: t("faq"), href: "#faq" },
    { name: t("contributors"), href: "#contributors" },
    { name: t("docs"), href: "/docs" },
  ];

  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  React.useEffect(() => {
    fetch("https://api.github.com/repos/kafein-product-space/KAI-Fusion")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.stargazers_count != null) setStarCount(data.stargazers_count);
      })
      .catch(() => { });
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed top-0 left-0 z-20 w-full transition-all duration-300 bg-black/70 backdrop-blur-md",
          scrolled && "bg-black/90 backdrop-blur-xl"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between py-2 lg:py-2">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={140}
                  height={140}
                  className="h-16 lg:h-18 w-auto"
                />
              </Link>
            </div>

            {/* Next to Logo: Nav links (desktop only) */}
            <div className="hidden lg:flex items-center">
              <ul className="flex gap-6 xl:gap-8 text-base font-bold items-center">
                {navLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-white hover:text-white/80 block duration-150 whitespace-nowrap"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Action buttons (desktop) + Locale Switcher + Hamburger (mobile) */}
            <div className="flex items-center gap-3">
              {/* Desktop action buttons */}
              <div className="hidden lg:flex items-center gap-3">
                <DemoButton
                  variant="header"
                  className="bg-white text-black hover:bg-gray-100 duration-150 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap"
                />
                <Link
                  href="https://github.com/kafein-product-space/KAI-Fusion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black hover:bg-gray-100 duration-150 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="whitespace-nowrap">{t("starOnGithub")}</span>
                  {starCount !== null && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-black/10 px-1 py-0.5 text-[10px] font-medium">
                      <svg className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {starCount}
                    </span>
                  )}
                </Link>
              </div>

              <LocaleSwitcher />

              {/* Hamburger - mobile only */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-gray-400"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Mobile dropdown menu */}
            <div className="bg-black in-data-[state=active]:block mb-6 hidden w-full flex-wrap items-center justify-end rounded-3xl border-2 border-white p-4 sm:p-6 shadow-2xl shadow-background-light/10 lg:hidden">
              <div className="bg-black w-full">
                <ul className="space-y-4 sm:space-y-6 text-base w-full">
                  {navLinks.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="text-white hover:text-white/80 block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <DemoButton
                      variant="header"
                      className="bg-white text-black hover:bg-gray-100 duration-150 flex items-center gap-2 px-4 py-2 rounded-md font-medium w-full justify-center"
                    />
                  </li>
                  <li>
                    <Link
                      href="https://github.com/kafein-product-space/KAI-Fusion"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black hover:bg-gray-100 duration-150 flex items-center gap-2 px-4 py-2 rounded-md font-medium w-full justify-center"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>{t("starOnGithub")}</span>
                      {starCount !== null && (
                        <span className="ml-1 inline-flex items-center gap-0.5 rounded-md bg-black/10 px-1.5 py-0.5 text-xs font-medium">
                          <svg className="w-3 h-3 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          {starCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header >
  );
};
