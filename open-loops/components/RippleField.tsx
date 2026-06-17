"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LoopState } from "@/components/Loop";

type RippleFieldProps = {
  focused?: boolean;
  prevalence: number;
  seed: number;
  size: number;
  state: LoopState;
  tension: number;
};

const RIPPLE_PATHS = [
  "M120 35C164 32 203 61 208 105C214 158 179 201 130 206C82 211 41 181 33 137C24 91 50 52 93 39C105 36 114 35 120 35Z",
  "M118 41C157 37 195 67 199 111C204 154 172 193 126 198C81 203 45 174 40 135C35 93 59 57 98 45C106 42 114 41 118 41Z",
  "M122 48C154 45 187 71 191 111C195 148 166 183 126 188C87 193 55 168 49 134C42 99 64 67 101 53C108 50 116 49 122 48Z",
];

function getRippleConfig(state: LoopState, tension: number, prevalence: number) {
  if (state === "completed") {
    return {
      amplitude: 0,
      count: 0,
      opacity: 0,
      radius: prevalence,
      spread: 0,
    };
  }

  if (state === "planned") {
    return {
      amplitude: 0.035 + tension * 0.003,
      count: 2,
      opacity: 0.15,
      radius: prevalence * 0.66,
      spread: 0.18,
    };
  }

  return {
    amplitude: 0.08 + tension * 0.012,
    count: 4,
    opacity: 0.23,
    radius: prevalence,
    spread: 0.36,
  };
}

export default function RippleField({
  focused = false,
  prevalence,
  seed,
  size,
  state,
  tension,
}: RippleFieldProps) {
  const prefersReducedMotion = useReducedMotion();
  const config = getRippleConfig(state, tension, prevalence);
  const isCompleted = state === "completed";
  const shouldAnimate = !prefersReducedMotion && !isCompleted;
  const viewBoxSize = 240;
  const baseDuration = state === "planned" ? 30 : 11;

  return (
    <svg
      aria-hidden="true"
      className="overflow-visible"
      fill="none"
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
    >
      <defs>
        <filter id={`ripple-blur-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.55" />
        </filter>
        <radialGradient id={`ripple-fade-${seed}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6E6257" stopOpacity="0" />
          <stop offset="62%" stopColor="#6E6257" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#6E6257" stopOpacity="0" />
        </radialGradient>
      </defs>

      {!isCompleted ? (
        <motion.circle
          cx="120"
          cy="120"
          fill={`url(#ripple-fade-${seed})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: focused ? 0.16 : 0.1 }}
          r={config.radius * 0.34}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      ) : null}

      {Array.from({ length: config.count }).map((_, index) => {
        const isOpen = state === "open";
        const duration = isOpen
          ? baseDuration + ((seed + index * 5) % 5)
          : baseDuration + ((seed + index * 5) % 8) + index * 2;
        const pulsePause = isOpen ? 8 + ((seed + index * 7) % 13) : 0;
        const delay = -((seed % 11) + index * (isOpen ? 3.7 : duration * 0.32));
        const path = RIPPLE_PATHS[(seed + index) % RIPPLE_PATHS.length];
        const baseScale = state === "planned" ? 0.54 + index * 0.11 : 0.42 + index * 0.13;
        const maxScale = state === "planned" ? baseScale + config.spread : baseScale + config.spread;
        const opacity = focused ? config.opacity + 0.04 : config.opacity;

        return (
          <motion.g
            filter={`url(#ripple-blur-${seed})`}
            initial={{
              opacity: opacity * 0.35,
              scale: baseScale,
              x: 120,
              y: 120,
            }}
            animate={
              shouldAnimate
                ? {
                    opacity:
                      state === "planned"
                        ? [opacity * 0.38, opacity * 0.58, opacity * 0.28]
                        : [0, opacity, opacity * 0.34, 0],
                    scale: isOpen
                      ? [baseScale, maxScale * 0.9, maxScale + config.amplitude]
                      : [baseScale, maxScale, maxScale + config.amplitude],
                    x: [120, 120 + ((seed + index) % 3) - 1, 120],
                    y: [120, 120 - (((seed + index) % 4) - 1.5), 120],
                  }
                : {
                    opacity: opacity * 0.42,
                    scale: baseScale,
                    x: 120,
                    y: 120,
                  }
            }
            key={`${seed}-${index}`}
            style={{ transformOrigin: "center" }}
            transition={{
              delay,
              duration,
              ease: "easeInOut",
              repeat: shouldAnimate ? Infinity : 0,
              repeatDelay: shouldAnimate && isOpen ? pulsePause : 0,
            }}
          >
            <path
              d={path}
              stroke="#6E6257"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={state === "planned" ? 0.38 : 0.5}
              strokeWidth={state === "planned" ? 1.12 : 1.28 + tension * 0.06}
              transform="translate(-120 -120)"
            />
          </motion.g>
        );
      })}
    </svg>
  );
}
