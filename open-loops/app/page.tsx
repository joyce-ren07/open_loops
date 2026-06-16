"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type Loop = {
  id: string;
  left: string;
  top: string;
  size: number;
  color: string;
  opacity: number;
  duration: number;
  delay: number;
  rotate: number;
};

const loops: Loop[] = [
  {
    id: "sun-warmed",
    left: "8%",
    top: "16%",
    size: 170,
    color: "#b4532a",
    opacity: 0.36,
    duration: 17,
    delay: 0,
    rotate: -8,
  },
  {
    id: "quiet-corner",
    left: "73%",
    top: "12%",
    size: 136,
    color: "#7c5b34",
    opacity: 0.3,
    duration: 21,
    delay: 1.4,
    rotate: 11,
  },
  {
    id: "half-remembered",
    left: "58%",
    top: "34%",
    size: 230,
    color: "#d38b49",
    opacity: 0.24,
    duration: 24,
    delay: 0.7,
    rotate: -15,
  },
  {
    id: "soft-margin",
    left: "16%",
    top: "59%",
    size: 198,
    color: "#6f4d32",
    opacity: 0.28,
    duration: 19,
    delay: 2.1,
    rotate: 7,
  },
  {
    id: "amber-thread",
    left: "76%",
    top: "63%",
    size: 158,
    color: "#c86f35",
    opacity: 0.34,
    duration: 20,
    delay: 3,
    rotate: -4,
  },
  {
    id: "small-orbit",
    left: "39%",
    top: "71%",
    size: 116,
    color: "#9a6b3f",
    opacity: 0.25,
    duration: 16,
    delay: 1.1,
    rotate: 19,
  },
];

function FloatingLoop({ loop }: { loop: Loop }) {
  const style = {
    left: loop.left,
    top: loop.top,
    width: loop.size,
    opacity: loop.opacity,
  } satisfies CSSProperties;

  return (
    <motion.svg
      aria-hidden="true"
      className="absolute -translate-x-1/2 -translate-y-1/2 overflow-visible drop-shadow-[0_18px_30px_rgba(77,50,25,0.08)]"
      fill="none"
      initial={{ y: 0, rotate: loop.rotate, scale: 0.96 }}
      animate={{
        y: [0, -18, 12, 0],
        x: [0, 10, -8, 0],
        rotate: [loop.rotate, loop.rotate + 8, loop.rotate - 5, loop.rotate],
        scale: [0.96, 1.03, 0.98, 0.96],
      }}
      transition={{
        duration: loop.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: loop.delay,
      }}
      style={style}
      viewBox="0 0 160 120"
    >
      <path
        d="M25 66C17 35 52 16 82 37C111 58 92 103 55 92C18 81 55 28 102 31C143 34 150 76 119 97C88 118 39 101 25 66Z"
        stroke={loop.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      <path
        d="M39 57C52 29 86 24 103 44C122 67 98 94 70 84C42 74 54 44 84 42C113 40 126 61 111 79"
        stroke={loop.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </motion.svg>
  );
}

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8 text-[#2d241b] sm:px-10">
      <div className="absolute inset-x-6 top-6 bottom-24 rounded-[2.5rem] border border-[#7c5b34]/10 bg-[#fff7e8]/30 shadow-[0_30px_100px_rgba(93,61,31,0.14)] backdrop-blur-[1px] sm:inset-x-10" />

      <div className="pointer-events-none absolute inset-0">
        {loops.map((loop) => (
          <FloatingLoop key={loop.id} loop={loop} />
        ))}
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center text-center">
        <motion.p
          className="mb-5 rounded-full border border-[#8f6236]/20 bg-[#fffaf0]/45 px-4 py-2 text-sm tracking-[0.28em] text-[#8b5e34]/80 uppercase shadow-sm"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Open loops
        </motion.p>

        <motion.h1
          className="max-w-3xl text-5xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.12 }}
        >
          Let the unfinished thoughts drift.
        </motion.h1>

        <motion.p
          className="mt-7 max-w-xl text-lg leading-8 text-[#5d4934]/82 sm:text-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
        >
          A soft place to notice the loops still moving in the background, then
          give them room to loosen.
        </motion.p>
      </section>

      <motion.div
        className="fixed right-0 bottom-8 left-0 z-20 flex justify-center px-6"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        <p className="rounded-full border border-[#7c5b34]/15 bg-[#fffaf0]/70 px-5 py-3 text-sm text-[#4e3c2c]/80 shadow-[0_12px_40px_rgba(91,63,33,0.12)] backdrop-blur-md sm:text-base">
          What&apos;s sitting in your mind?
        </p>
      </motion.div>
    </main>
  );
}
