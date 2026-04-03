"use client";
import { Feature108 } from "@/components/blocks/shadcnblocks-com-feature108";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Zap, Pointer, Layout } from "lucide-react";
import dynamic from "next/dynamic";
import { DemoButton } from "@/components/demo-button";
import { HeroVideo } from "@/components/ui/hero-video";
import { useTranslations } from "next-intl";
import { VideoLoadingProvider, useVideoLoading } from "@/components/video-loading-context";
import Loading from "./loading";

const IntegrationsSection = dynamic(
  () => import("@/components/integrations-6")
);
const ContentSection = dynamic(() => import("@/components/content-2"));
const ContributorsSection = dynamic(() => import("@/components/contributors"));
const FAQ = dynamic(() => import("@/components/faq"));

const TransitionToSlate = () => (
  <div className="h-24 md:h-32 bg-gradient-to-b from-black to-slate-950" />
);
const TransitionToBlack = () => (
  <div className="h-24 md:h-32 bg-gradient-to-b from-slate-950 to-black" />
);

function HomeContent() {
  const t = useTranslations();
  const { isVideoLoaded } = useVideoLoading();

  const demoData = {
    badge: t("features.badge"),
    heading: t("features.heading"),
    description: t("features.description"),
    tabs: [
      {
        value: "tab-1",
        icon: <Zap className="h-auto w-4 shrink-0" />,
        label: t("features.tabs.chat.label"),
        content: {
          badge: t("features.tabs.chat.badge"),
          title: t("features.tabs.chat.title"),
          description: t("features.tabs.chat.description"),
          buttonText: t("features.tabs.chat.button"),
          imageSrc: "/chat.png",
          imageAlt: "AI Chat Interface",
        },
      },
      {
        value: "tab-2",
        icon: <Pointer className="h-auto w-4 shrink-0" />,
        label: t("features.tabs.export.label"),
        content: {
          badge: t("features.tabs.export.badge"),
          title: t("features.tabs.export.title"),
          description: t("features.tabs.export.description"),
          buttonText: t("features.tabs.export.button"),
          imageSrc: "/kai-flow-cds.png",
          imageAlt: "Data Export",
        },
      },
      {
        value: "tab-3",
        icon: <Layout className="h-auto w-4 shrink-0" />,
        label: t("features.tabs.rag.label"),
        content: {
          badge: t("features.tabs.rag.badge"),
          title: t("features.tabs.rag.title"),
          description: t("features.tabs.rag.description"),
          buttonText: t("features.tabs.rag.button"),
          imageSrc: "/kai-flow-rag-updated.png",
          imageAlt: "RAG Implementation",
        },
      },
      {
        value: "tab-4",
        icon: <Zap className="h-auto w-4 shrink-0" />,
        label: t("features.tabs.lowCode.label"),
        content: {
          badge: t("features.tabs.lowCode.badge"),
          title: t("features.tabs.lowCode.title"),
          description: t("features.tabs.lowCode.description"),
          buttonText: t("features.tabs.lowCode.button"),
          imageSrc: "/low-code.png",
          imageAlt: "Visual Workflow Builder",
        },
      },
    ],
  };

  return (
    <>
      {/* Skeleton Loading — video yüklenene kadar gösterilir */}
      {!isVideoLoaded && (
        <div className="animate-fadeIn">
          <Loading />
        </div>
      )}

      {/* Gerçek içerik — video yüklenene kadar gizli, yüklendikten sonra fade-in */}
      <div
        className={`transition-opacity duration-700 ease-out ${isVideoLoaded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          }`}
      >
        <div className="overflow-x-hidden">
          <WavyBackground containerClassName="pt-20 lg:pt-24" className="max-w-6xl mx-auto pb-8 pt-2 px-4">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold inter-var text-center bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                {t("hero.title")}
              </h1>
              <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white/90 font-semibold inter-var text-center mt-2 mb-1">
                {t("hero.subtitle")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg mt-3 text-white/80 font-light inter-var text-center max-w-3xl leading-relaxed">
                {t("hero.description")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              <a
                href="https://github.com/kafein-product-space/KAI-Fusion"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/10 border border-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 min-w-[140px] sm:min-w-[160px] justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t("hero.github")}
              </a>
              <DemoButton variant="hero" />
            </div>

            <div className="mt-8 flex justify-center flex-1 min-h-0">
              <div className="rounded-3xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full max-w-4xl mx-auto shadow-2xl shadow-white/10">
                <div className="rounded-[calc(1.5rem-2px)] bg-black/95 p-1 overflow-hidden">
                  <HeroVideo
                    src="/videos/demo.mp4"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </WavyBackground>
          <Feature108 {...demoData} />
          <TransitionToSlate />
          <IntegrationsSection />
          <TransitionToBlack />
          <ContentSection />
          <TransitionToSlate />
          <FAQ />
          <TransitionToBlack />
          <ContributorsSection />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <VideoLoadingProvider>
      <HomeContent />
    </VideoLoadingProvider>
  );
}
