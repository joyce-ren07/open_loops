"use client";

import { motion, useReducedMotion } from "framer-motion";

export type LoopState = "open" | "planned" | "completed";

type LoopProps = {
  tension: number;
  state: LoopState;
  resurfaced?: boolean;
  size?: number;
  className?: string;
};

const LOOP_PATH =
  "M120 32C164 30 203 64 209 108C216 159 181 202 132 208C84 214 40 184 31 138C22 93 48 49 91 37C103 34 113 32 120 32Z";

function normalizeTension(tension: number) {
  return Math.min(5, Math.max(1, tension));
}

function getVisibleLength(state: LoopState, tension: number, resurfaced: boolean) {
  if (state === "completed") {
    return 1;
  }

  const normalized = normalizeTension(tension);

  if (resurfaced) {
    return 0.93 - normalized * 0.008;
  }

  if (state === "planned") {
    return 0.988 - normalized * 0.002;
  }

  return 0.72 - normalized * 0.035;
}

function getStroke(state: LoopState, tension: number) {
  const normalized = normalizeTension(tension);

  if (state === "completed") {
    return {
      color: "#8B8176",
      width: 2.2,
      opacity: 0.44,
    };
  }

  if (state === "planned") {
    return {
      color: "#7D6F63",
      width: 2.15 + normalized * 0.08,
      opacity: 0.48,
    };
  }

  return {
    color: "#6F6257",
    width: 2.25 + normalized * 0.16,
    opacity: 0.52,
  };
}

export default function Loop({
  tension,
  state,
  resurfaced = false,
  size = 340,
  className,
}: LoopProps) {
  const prefersReducedMotion = useReducedMotion();
  const visibleLength = getVisibleLength(state, tension, resurfaced);
  const stroke = getStroke(state, tension);
  const isCompleted = state === "completed";
  const isPlanned = state === "planned";
  const shouldAnimate = !isCompleted && !prefersReducedMotion;
  const dashOffset = isPlanned ? 0.018 : 0.08;

  return (
    <motion.svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      initial={{ opacity: 0, scale: isCompleted ? 1 : 0.97, rotate: -3 }}
      animate={
        shouldAnimate
          ? {
              opacity: 1,
              scale: isPlanned
                ? [1, 1.006, 1]
                : resurfaced
                  ? [0.99, 1.018, 0.99]
                  : [0.97, 1.035, 0.97],
              x: isPlanned ? [0, 0.6, 0] : resurfaced ? [0, 1.8, 0] : [0, 4, -3, 0],
              y: isPlanned ? [0, -0.8, 0] : resurfaced ? [0, -2.4, 0] : [0, -5, 3, 0],
              rotate: isPlanned
                ? [-0.4, 0.35, -0.4]
                : resurfaced
                  ? [-0.8, 0.9, -0.8]
                  : [-3, 2.5, -1.5, -3],
            }
          : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
      }
      transition={{
        opacity: { duration: 1.1, ease: "easeOut" },
        duration: isPlanned ? 22 : resurfaced ? 12 : 8.5,
        repeat: shouldAnimate ? Infinity : 0,
        ease: "easeInOut",
      }}
      viewBox="0 0 240 240"
      width={size}
    >
      <motion.path
        d={LOOP_PATH}
        pathLength="1"
        stroke={stroke.color}
        strokeDasharray={`${visibleLength} ${1 - visibleLength}`}
        strokeDashoffset={isCompleted ? 0 : dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={stroke.opacity}
        strokeWidth={stroke.width}
        animate={
          shouldAnimate
            ? {
                strokeDashoffset: isPlanned
                  ? [dashOffset, dashOffset + 0.004, dashOffset]
                  : resurfaced
                    ? [dashOffset, dashOffset + 0.018, dashOffset]
                  : [dashOffset, dashOffset + 0.045, dashOffset],
              }
            : { strokeDashoffset: 0 }
        }
        transition={{
          duration: isPlanned ? 24 : resurfaced ? 12 : 9,
          repeat: shouldAnimate ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  );
}
