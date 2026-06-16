"use client";

import { motion } from "framer-motion";

function OpenLoopGlyph() {
  return (
    <motion.svg
      aria-hidden="true"
      className="h-[min(54vw,340px)] w-[min(54vw,340px)] overflow-visible"
      fill="none"
      initial={{ opacity: 0, scale: 0.94, rotate: -6 }}
      animate={{
        opacity: 1,
        scale: [0.96, 1.03, 0.96],
        rotate: [-6, 2, -6],
      }}
      transition={{
        opacity: { duration: 1.4, ease: "easeOut" },
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      viewBox="0 0 240 240"
    >
      <motion.circle
        cx="120"
        cy="120"
        r="82"
        stroke="#D8CAB7"
        strokeDasharray="2 18"
        strokeLinecap="round"
        strokeWidth="1.5"
        animate={{ opacity: [0.18, 0.36, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M72 118C72 82 108 58 142 73C177 88 182 134 151 156C120 178 76 158 82 120C88 82 142 76 164 108C184 137 164 174 126 178"
        stroke="#7D6A58"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
      <path
        d="M94 123C96 102 116 91 135 98C154 106 158 130 141 143C124 156 101 146 105 124"
        stroke="#C2A88B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </motion.svg>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-[#332C25]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.82),rgba(247,244,238,0)_32rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:linear-gradient(115deg,rgba(91,74,56,0.08)_0.5px,transparent_0.5px),linear-gradient(rgba(91,74,56,0.05)_0.5px,transparent_0.5px)] [background-size:38px_38px]" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-28 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <OpenLoopGlyph />
        </motion.div>

        <motion.p
          className="text-[0.78rem] tracking-[0.34em] text-[#6E6257] uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.18 }}
        >
          Open Loops
        </motion.p>
      </section>

      <motion.p
        className="fixed right-0 bottom-8 left-0 z-20 px-6 text-center text-sm tracking-[0.02em] text-[#6E6257] sm:text-base"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.42 }}
      >
        What&apos;s sitting in your mind?
      </motion.p>

      <motion.button
        aria-label="Add an open loop"
        className="fixed right-6 bottom-6 z-30 grid size-11 place-items-center rounded-full border border-[#6E6257]/18 bg-[#F7F4EE]/55 text-2xl leading-none font-light text-[#6E6257]/80 shadow-[0_10px_30px_rgba(76,59,43,0.08)] backdrop-blur-sm transition-colors hover:bg-[#FFFDF8]/70 hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none sm:right-8 sm:bottom-8"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.56 }}
        type="button"
      >
        +
      </motion.button>
    </main>
  );
}
