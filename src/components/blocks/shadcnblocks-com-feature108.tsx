"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "shadcnblocks.com",
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Join us to build flawless web solutions.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Boost Revenue",
      content: {
        badge: "Modern Tactics",
        title: "Make your site a true standout.",
        description:
          "Discover new web trends that help you craft sleek, highly functional sites that drive traffic and convert leads into customers.",
        buttonText: "See Plans",
        imageSrc:
          "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Higher Engagement",
      content: {
        badge: "Expert Features",
        title: "Boost your site with top-tier design.",
        description:
          "Use stellar design to easily engage users and strengthen their loyalty. Create a seamless experience that keeps them coming back for more.",
        buttonText: "See Tools",
        imageSrc:
          "https://shadcnblocks.com/images/block/placeholder-dark-2.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Stunning Layouts",
      content: {
        badge: "Elite Solutions",
        title: "Build an advanced web experience.",
        description:
          "Lift your brand with modern tech that grabs attention and drives action. Create a digital experience that stands out from the crowd.",
        buttonText: "See Options",
        imageSrc:
          "https://shadcnblocks.com/images/block/placeholder-dark-3.svg",
        imageAlt: "placeholder",
      },
    },
  ],
}: Feature108Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const activeContent = tabs.find((t) => t.value === activeTab)?.content;

  return (
    <section id="features" className="relative min-h-screen py-16 md:py-20 bg-black flex items-center overflow-hidden scroll-mt-16">
      {/* Corner vignette shadows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl text-white">
            {heading}
          </h1>
          <p className="text-white/70">{description}</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid grid-cols-2 gap-3 max-w-2xl mx-auto sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:gap-10 bg-transparent border-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white/70 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white border-2 border-white/30 data-[state=active]:border-purple-400/60 transition-all duration-300"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-3xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
          <div className="rounded-[calc(1.5rem-3px)] bg-black/95 p-8 pb-16 sm:p-10 sm:pb-20 md:p-12 md:pb-24 lg:p-16 lg:pb-28 overflow-visible min-h-[600px] sm:min-h-[450px] lg:min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeContent && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="grid place-items-start gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-8 w-full"
                >
                  <div className="flex flex-col gap-5">
                    <Badge
                      variant="outline"
                      className="w-fit border-2 border-white bg-white/10 text-white"
                    >
                      {activeContent.badge}
                    </Badge>
                    <h3 className="text-xl sm:text-2xl font-semibold lg:text-4xl text-white">
                      {activeContent.title}
                    </h3>
                    <p className="text-white/80 lg:text-lg">
                      {activeContent.description}
                    </p>
                  </div>
                  <div className="rounded-2xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full">
                    <div className="rounded-[calc(1rem-3px)] bg-black/95 w-full overflow-hidden">
                      <Image
                        src={activeContent.imageSrc}
                        alt={activeContent.imageAlt}
                        width={800}
                        height={600}
                        className="rounded-[calc(1rem-3px)] w-full h-auto object-contain"
                        priority={false}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
