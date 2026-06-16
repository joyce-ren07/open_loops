"use client";

import { motion } from "framer-motion";
import Loop from "@/components/Loop";
import type { LoopState } from "@/components/Loop";
import type { CSSProperties } from "react";

type ExampleLoop = {
  id: string;
  tension: number;
  state: LoopState;
  size: number;
  left: string;
  top: string;
  rotate: number;
  delay: number;
};

const exampleLoops: ExampleLoop[] = [
  {
    id: "urgent-open",
    tension: 5,
    state: "open",
    size: 218,
    left: "14%",
    top: "22%",
    rotate: -13,
    delay: 0.08,
  },
  {
    id: "soft-plan",
    tension: 2,
    state: "planned",
    size: 142,
    left: "68%",
    top: "16%",
    rotate: 9,
    delay: 0.18,
  },
  {
    id: "central-open",
    tension: 3,
    state: "open",
    size: 318,
    left: "43%",
    top: "45%",
    rotate: 4,
    delay: 0,
  },
  {
    id: "closed-memory",
    tension: 1,
    state: "completed",
    size: 184,
    left: "78%",
    top: "58%",
    rotate: -7,
    delay: 0.34,
  },
  {
    id: "quiet-plan",
    tension: 4,
    state: "planned",
    size: 166,
    left: "24%",
    top: "78%",
    rotate: 17,
    delay: 0.26,
  },
];

function CanvasLoop({ loop }: { loop: ExampleLoop }) {
  const style = {
    left: loop.left,
    top: loop.top,
    transform: `translate(-50%, -50%) rotate(${loop.rotate}deg)`,
  } satisfies CSSProperties;

  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: loop.delay }}
      style={style}
    >
      <Loop
        className="overflow-visible drop-shadow-[0_18px_44px_rgba(70,55,40,0.045)]"
        size={loop.size}
        state={loop.state}
        tension={loop.tension}
      />
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-[#332C25]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.82),rgba(247,244,238,0)_32rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:linear-gradient(115deg,rgba(91,74,56,0.08)_0.5px,transparent_0.5px),linear-gradient(rgba(91,74,56,0.05)_0.5px,transparent_0.5px)] [background-size:38px_38px]" />

      <section
        aria-label="Open Loops mental space"
        className="relative z-10 min-h-screen"
      >
        <motion.p
          className="absolute top-8 left-8 text-[0.72rem] tracking-[0.32em] text-[#6E6257]/70 uppercase"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.12 }}
        >
          Open Loops
        </motion.p>

        <div className="absolute inset-0">
          {exampleLoops.map((loop) => (
            <CanvasLoop key={loop.id} loop={loop} />
          ))}
        </div>
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
