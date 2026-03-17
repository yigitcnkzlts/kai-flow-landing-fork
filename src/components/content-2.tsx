"use client";
import { Cpu, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ContentSection() {
  const t = useTranslations("content");

  return (
    <section id="content" className="relative min-h-screen py-16 md:py-20 bg-black flex items-center overflow-hidden scroll-mt-16">
      {/* Corner vignette shadows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
      </div>
      <div className="mx-auto px-4 sm:px-6 relative z-10 w-full max-w-5xl">
        <div className="rounded-3xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="rounded-[calc(1.5rem-3px)] bg-black/95 p-8 pb-16 sm:p-10 sm:pb-20 md:p-12 md:pb-24 lg:p-16 lg:pb-28 overflow-hidden relative">
          <div className="space-y-8 md:space-y-16">
            <h2 className="relative z-10 max-w-xl text-3xl sm:text-4xl font-medium lg:text-5xl text-white">
              {t("heading")}
            </h2>

            <div className="relative">
              <div className="relative z-10 space-y-4 md:w-1/2">
                <p className="text-white/80">
                  {t("description1")}{" "}
                  <span className="text-white font-medium">
                    {t("descriptionHighlight")}
                  </span>{" "}
                  {t("description2")}
                </p>
                <p className="text-white/80">
                  {t("description3")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="size-4" />
                      <h3 className="text-sm font-medium text-white">{t("realtimeTriggers")}</h3>
                    </div>
                    <p className="text-white/70 text-sm">
                      {t("realtimeTriggersDesc")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="size-4" />
                      <h3 className="text-sm font-medium text-white">{t("modularLogic")}</h3>
                    </div>
                    <p className="text-white/70 text-sm">
                      {t("modularLogicDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
                <div
                  aria-hidden
                  className="bg-linear-to-l z-1 to-black absolute -left-20 -top-12 -bottom-12 right-0 hidden from-transparent to-85% md:block"
                ></div>
                <div className="relative rounded-2xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <div className="rounded-[calc(1rem-3px)] bg-black p-2">
                  <Image
                    src="/cds.png"
                    className="hidden rounded-[12px] dark:block"
                    alt="workflow builder dark"
                    width={1207}
                    height={929}
                  />
                  <Image
                    src="/cds.png"
                    className="rounded-[12px] shadow dark:hidden"
                    alt="workflow builder light"
                    width={1207}
                    height={929}
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
