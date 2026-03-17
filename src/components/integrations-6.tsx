"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Integration = {
  icon: string;
  name: string;
  invert?: boolean;
};

const repeat = <T,>(arr: T[], times: number): T[] =>
  Array.from({ length: times }, () => arr).flat();

export default function IntegrationsSection() {
  const [icons, setIcons] = useState<Integration[]>([]);
  const t = useTranslations("integrations");

  useEffect(() => {
    fetch("/api/icons")
      .then((res) => res.json())
      .then((data) => setIcons(data.icons ?? []))
      .catch(() => setIcons([]));
  }, []);

  const mid = Math.ceil(icons.length / 2);
  const row1 = repeat(icons.slice(0, mid), 2);
  const row2 = repeat(icons.slice(mid), 2);

  return (
    <section
      id="integrations"
      className="relative w-full py-20 md:py-28 lg:py-32 bg-slate-950 flex items-center justify-center overflow-hidden"
    >
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Corner vignette shadows */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-full mx-auto w-full px-0 relative z-10">
        {/* Header */}
        <header className="flex flex-col mb-14 lg:mb-20 gap-y-5 items-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm text-violet-300 font-medium tracking-wide">
              {t("ecosystem")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-tight">
            {t("heading")}{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
              {t("headingHighlight")}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/50">
            {t("description")}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                20+
              </span>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                {t("aiIntegrations")}
              </span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                ✓
              </span>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                {t("businessCases")}
              </span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                {t("setupTimeValue")}
              </span>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                {t("setupTime")}
              </span>
            </div>
          </div>
        </header>

        {/* 2-Row Marquee with 3D perspective */}
        <div className="mb-16 lg:mb-20" style={{ perspective: "1200px" }}>
          <div
            className="overflow-hidden space-y-3 md:space-y-4"
            style={{
              transform: "rotateX(12deg)",
              transformOrigin: "center top",
            }}
          >
            <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="flex w-max gap-3 md:gap-4 animate-scroll-left">
                {row1.map((integration, index) => (
                  <IntegrationCard
                    key={`row1-${index}`}
                    {...integration}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="flex w-max gap-3 md:gap-4 animate-scroll-right">
                {row2.map((integration, index) => (
                  <IntegrationCard
                    key={`row2-${index}`}
                    {...integration}
                    index={index + 5}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 px-4">
          <Button
            asChild
            size="lg"
            className="relative bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base shadow-lg shadow-violet-600/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
          >
            <Link href="#integrations">{t("exploreAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const accentColors = [
  "group-hover:border-blue-500/60 group-hover:shadow-blue-500/15",
  "group-hover:border-violet-500/60 group-hover:shadow-violet-500/15",
  "group-hover:border-purple-500/60 group-hover:shadow-purple-500/15",
  "group-hover:border-cyan-500/60 group-hover:shadow-cyan-500/15",
  "group-hover:border-pink-500/60 group-hover:shadow-pink-500/15",
  "group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/15",
  "group-hover:border-amber-500/60 group-hover:shadow-amber-500/15",
  "group-hover:border-rose-500/60 group-hover:shadow-rose-500/15",
];

const IntegrationCard = ({
  icon,
  name,
  invert,
  index,
}: Integration & { index: number }) => {
  const colorClass = accentColors[index % accentColors.length];

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <div
        className={`flex h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-xl bg-white border border-white p-3 md:p-4 transition-all duration-300 hover:scale-110 shadow-xl shadow-black/40 ${colorClass} hover:shadow-2xl cursor-pointer`}
      >
        <Image
          src={icon}
          alt={name}
          width={40}
          height={40}
          className={`w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity ${invert ? "invert" : ""}`}
          unoptimized
        />
      </div>
      <span className="text-[10px] md:text-xs text-white/50 group-hover:text-white/80 transition-colors duration-300 font-medium truncate max-w-[96px] text-center">
        {name}
      </span>
    </div>
  );
};
