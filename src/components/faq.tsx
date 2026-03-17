"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const t = useTranslations("faq");

    const faqItems = Array.from({ length: 6 }, (_, i) => ({
        question: t(`items.${i}.question`),
        answer: t(`items.${i}.answer`),
    }));

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative min-h-screen py-16 md:py-20 bg-black flex items-center overflow-hidden scroll-mt-16">
            {/* Corner vignette shadows */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.7)_0%,transparent_70%)]" />
            </div>
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 relative z-10">
                <div className="rounded-3xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <div className="rounded-[calc(1.5rem-3px)] bg-black/95 p-8 pb-16 sm:p-10 sm:pb-20 md:p-12 md:pb-24 lg:p-16 lg:pb-28 overflow-hidden relative">
                        <div className="text-center mb-12 flex flex-col items-center">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                {t("heading")}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 max-w-2xl">
                                {t("description")}
                            </p>
                        </div>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {faqItems.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    transition={{ layout: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] } }}
                                    className="p-[1px] rounded-xl bg-gradient-to-r from-blue-500/40 via-purple-500/30 to-pink-500/40 will-change-auto"
                                >
                                    <div className="rounded-[calc(1rem-2px)] bg-white/5">
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="w-full px-4 py-4 sm:px-6 sm:py-5 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                                        >
                                            <span className="text-base sm:text-lg font-bold text-white pr-6 sm:pr-8">
                                                {faq.question}
                                            </span>
                                            <motion.div
                                                animate={{ rotate: openIndex === index ? 180 : 0 }}
                                                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            </motion.div>
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {openIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: [0.4, 0.0, 0.2, 1],
                                                        opacity: { duration: 0.25 }
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pt-2 pb-4 sm:px-6 sm:pb-6 text-white/85 font-medium leading-relaxed">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
