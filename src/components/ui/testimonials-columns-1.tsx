"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
// Remove the import of testimonials, as it is not needed for the prop type

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = memo(
  ({
    className,
    testimonials,
    duration,
  }: {
    className?: string;
    testimonials: Testimonial[];
    duration?: number;
  }) => {
    return (
      <div className={className}>
        <motion.div
          animate={{
            translateY: "-50%",
          }}
          transition={{
            duration: duration || 10,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          className="flex flex-col gap-6 pb-6 bg-transparent"
          style={{ willChange: "transform" }}
        >
          {[
            ...new Array(2).fill(0).map((_, index) => (
              <React.Fragment key={index}>
                {testimonials.map(({ text, image, name, role }, i) => (
                  <div
                    className="p-10 rounded-3xl border border-white/20 bg-white/5 shadow-lg shadow-white/10 max-w-xs w-full"
                    key={i}
                  >
                    <div className="text-white/90">{text}</div>
                    <div className="flex items-center gap-2 mt-5">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          fill
                          src={image}
                          alt={name}
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium tracking-tight leading-5 text-white">
                          {name}
                        </div>
                        <div className="leading-5 opacity-60 tracking-tight text-white/70">
                          {role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            )),
          ]}
        </motion.div>
      </div>
    );
  });
