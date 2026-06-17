"use client";

import { AnimatePresence, motion } from "framer-motion";
import Loop from "@/components/Loop";
import type { LoopState } from "@/components/Loop";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { FormEvent, PointerEvent } from "react";

type CanvasLoopModel = {
  id: string;
  label: string;
  createdAt: string;
  completedAt?: string;
  integratedAt?: string;
  plan?: LoopPlan;
  resurfacedAt?: string;
  tension: number;
  state: LoopState;
  size: number;
  left: string;
  top: string;
  rotate: number;
  delay: number;
};

type LoopPlan = {
  when: string;
  where: string;
  firstAction: string;
};

type ParsedPlan = {
  when: Date | null;
  where: string;
  isExactTime: boolean;
  hasMinutePrecision: boolean;
};

const initialLoops: CanvasLoopModel[] = [
  {
    id: "urgent-open",
    label: "An unresolved thought",
    createdAt: "2026-06-12T12:00:00.000Z",
    tension: 5,
    state: "open",
    size: 188,
    left: "28%",
    top: "30%",
    rotate: 0,
    delay: 0.08,
  },
  {
    id: "soft-plan",
    label: "A gentler plan",
    createdAt: "2026-06-13T12:00:00.000Z",
    plan: {
      when: "2026-06-17T09:00",
      where: "The quiet table by the window",
      firstAction: "Open the notebook to a blank page",
    },
    tension: 2,
    state: "planned",
    size: 126,
    left: "42%",
    top: "25%",
    rotate: 0,
    delay: 0.18,
  },
  {
    id: "central-open",
    label: "Something mentally present",
    createdAt: "2026-06-14T12:00:00.000Z",
    tension: 3,
    state: "open",
    size: 268,
    left: "57%",
    top: "58%",
    rotate: 0,
    delay: 0,
  },
  {
    id: "closed-memory",
    label: "A closed loop",
    createdAt: "2026-06-10T12:00:00.000Z",
    completedAt: "2026-06-16T10:30:00.000Z",
    integratedAt: "2026-06-16T10:30:02.000Z",
    tension: 1,
    state: "completed",
    size: 184,
    left: "78%",
    top: "58%",
    rotate: 0,
    delay: 0.34,
  },
  {
    id: "quiet-plan",
    label: "A quiet next step",
    createdAt: "2026-06-15T12:00:00.000Z",
    plan: {
      when: "2026-06-18T16:30",
      where: "After tea, at the desk",
      firstAction: "Write the first honest sentence",
    },
    tension: 4,
    state: "planned",
    size: 150,
    left: "76%",
    top: "69%",
    rotate: 0,
    delay: 0.26,
  },
];

const placementSequence = [
  { left: "56%", top: "20%", rotate: 0, size: 126 },
  { left: "83%", top: "48%", rotate: 0, size: 138 },
  { left: "19%", top: "61%", rotate: 0, size: 154 },
  { left: "68%", top: "30%", rotate: 0, size: 152 },
  { left: "39%", top: "72%", rotate: 0, size: 154 },
  { left: "79%", top: "25%", rotate: 0, size: 136 },
];

const starPlacements = [
  { left: "19%", top: "28%", size: 9 },
  { left: "71%", top: "24%", size: 7 },
  { left: "48%", top: "42%", size: 10 },
  { left: "82%", top: "58%", size: 6 },
  { left: "31%", top: "66%", size: 8 },
  { left: "61%", top: "76%", size: 7 },
];

function getLoopSeed(id: string) {
  return id
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);
}

function getLoopTerritory(loop: CanvasLoopModel) {
  if (loop.state === "completed") {
    return {
      duration: 0,
      x: [0],
      y: [0],
    };
  }

  const seed = getLoopSeed(loop.id);
  const baseRadius = loop.state === "planned" ? 18 : loop.resurfacedAt ? 22 : 24;
  const radius = Math.min(40, baseRadius + (seed % 5) * 3 + loop.tension);

  return {
    duration: 19 + (seed % 9) + (loop.state === "planned" ? 7 : 0),
    x: [0, radius * 0.42, -radius * 0.28, radius * 0.16, 0],
    y: [0, -radius * 0.24, radius * 0.38, -radius * 0.18, 0],
  };
}

function CanvasLoop({
  focused,
  loop,
  onBlur,
  onFocus,
  onSelect,
}: {
  focused: boolean;
  loop: CanvasLoopModel;
  onBlur: () => void;
  onFocus: (loopId: string) => void;
  onSelect: (loopId: string) => void;
}) {
  const style = {
    left: loop.left,
    top: loop.top,
    height: loop.size,
    width: loop.size,
  } satisfies CSSProperties;
  const resurfaced = Boolean(loop.resurfacedAt);
  const labelOpacity = Math.min(0.5 + loop.tension * 0.018, 0.6);
  const labelSize = 12 + (loop.tension - 1) * 0.2;
  const territory = getLoopTerritory(loop);

  return (
    <motion.button
      aria-label={loop.label}
      className="absolute overflow-visible border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-[#8B7A68]/25 focus-visible:outline-none"
      initial={{
        opacity: 0,
        scale: resurfaced ? 0.72 : 0.9,
        x: "-50%",
        y: resurfaced ? "-34%" : "-50%",
        filter: resurfaced ? "blur(12px)" : "blur(7px)",
      }}
      animate={{
        opacity: 1,
        scale: focused ? 1.045 : 1,
        x: "-50%",
        y: "-50%",
        filter: "blur(0px)",
      }}
      transition={{ duration: 1.2, ease: "easeOut", delay: loop.delay }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(loop.id);
        }
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          onFocus(loop.id);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") {
          onBlur();
        }
      }}
      onPointerUp={(event) => {
        if (event.pointerType === "touch" && !focused) {
          onFocus(loop.id);
          return;
        }

        onSelect(loop.id);
      }}
      style={style}
      type="button"
      whileTap={{ scale: 0.985 }}
    >
      <motion.span
        className="absolute inset-0 block overflow-visible"
        animate={{
          x: territory.x,
          y: territory.y,
        }}
        transition={{
          duration: territory.duration,
          ease: "easeInOut",
          ...(loop.state === "completed"
            ? { repeat: 0 }
            : {
                repeat: Infinity,
                times: [0, 0.24, 0.57, 0.83, 1],
              }),
        }}
      >
        <AnimatePresence>
          {focused ? (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-[#8B7A68]/10 blur-2xl"
              initial={{ opacity: 0, scale: 0.78, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.84, x: "-50%", y: "-50%" }}
              style={{
                height: loop.size * 0.82,
                width: loop.size * 0.82,
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ) : null}
        </AnimatePresence>

        <Loop
          className="overflow-visible drop-shadow-[0_18px_44px_rgba(70,55,40,0.045)]"
          focused={focused}
          resurfaced={resurfaced}
          size={loop.size}
          state={loop.state}
          tension={loop.tension}
        />

        <motion.span
          className={[
            "pointer-events-none absolute left-1/2 top-[94%] block min-h-5 w-72 max-w-[72vw] -translate-x-1/2 text-center font-medium leading-snug tracking-[0.01em] text-[#4A4037]",
            focused
              ? "whitespace-normal"
              : "overflow-hidden truncate whitespace-nowrap px-12",
          ].join(" ")}
          animate={{
            opacity: focused ? 0.84 : labelOpacity,
            y: 0,
          }}
          style={{
            fontSize: Math.min(focused ? labelSize + 0.3 : labelSize, 13),
          }}
          transition={{ duration: 0.34, ease: "easeOut" }}
        >
          {loop.label}
        </motion.span>
      </motion.span>
    </motion.button>
  );
}

function AddLoopModal({
  mentalPresence,
  onClose,
  onMentalPresenceChange,
  onSubmit,
  task,
  onTaskChange,
}: {
  mentalPresence: number;
  onClose: () => void;
  onMentalPresenceChange: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  task: string;
  onTaskChange: (value: string) => void;
}) {
  return (
    <motion.div
      aria-labelledby="add-loop-title"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center px-5 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
    >
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-[#4C3B2B]/10 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <motion.form
        className="relative w-full max-w-md rounded-[2rem] border border-[#6E6257]/12 bg-[#FCFAF5]/88 p-7 text-[#332C25] shadow-[0_28px_80px_rgba(76,59,43,0.14)] backdrop-blur-md"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onSubmit={onSubmit}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <div className="mb-8 flex items-start justify-between gap-6">
          <h2
            className="text-2xl leading-tight font-light tracking-[-0.03em]"
            id="add-loop-title"
          >
            What&apos;s on your mind?
          </h2>
          <button
            aria-label="Close modal"
            className="-mt-1 rounded-full px-2 py-1 text-xl leading-none text-[#6E6257]/65 transition-colors hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/30 focus-visible:outline-none"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <label className="block text-sm text-[#6E6257]" htmlFor="loop-task">
          Task
        </label>
        <input
          autoFocus
          className="mt-3 w-full rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-5 py-3 text-base text-[#332C25] outline-none transition focus:border-[#8B7A68]/35 focus:bg-[#FFFDF8]/78"
          id="loop-task"
          onChange={(event) => onTaskChange(event.target.value)}
          placeholder="Name the loop gently"
          type="text"
          value={task}
        />

        <div className="mt-8">
          <label
            className="block text-sm text-[#6E6257]"
            htmlFor="mental-presence"
          >
            How mentally present is this?
          </label>
          <input
            aria-valuetext={`${mentalPresence} out of 5`}
            className="mt-5 w-full accent-[#8B7A68]"
            id="mental-presence"
            max="5"
            min="1"
            onChange={(event) =>
              onMentalPresenceChange(Number(event.target.value))
            }
            type="range"
            value={mentalPresence}
          />
          <div className="mt-2 flex justify-between text-xs text-[#6E6257]/70">
            <span>Not much</span>
            <span>Constantly.</span>
          </div>
        </div>

        <button
          className="mt-9 w-full rounded-full border border-[#6E6257]/14 bg-[#332C25]/88 px-5 py-3 text-sm tracking-[0.02em] text-[#F7F4EE] transition hover:bg-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!task.trim()}
          type="submit"
        >
          Place it here
        </button>
      </motion.form>
    </motion.div>
  );
}

function formatCreatedDate(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(createdAt));
}

function formatCompletionDate(completedAt: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(completedAt));
}

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

function toPlanDateTimeValue(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function nextWeekday(targetDay: number) {
  const today = startOfToday();
  const daysUntilTarget = (targetDay + 7 - today.getDay()) % 7 || 7;
  return addDays(today, daysUntilTarget);
}

function getPlanDay(input: string) {
  const normalized = input.toLowerCase();
  const today = startOfToday();
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const weekdayIndex = weekdays.findIndex((weekday) =>
    normalized.includes(weekday),
  );

  if (normalized.includes("tomorrow")) {
    return addDays(today, 1);
  }

  if (normalized.includes("tonight") || normalized.includes("today")) {
    return today;
  }

  if (weekdayIndex >= 0) {
    return nextWeekday(weekdayIndex);
  }

  return addDays(today, 1);
}

function getPlanTime(input: string) {
  const normalized = input.toLowerCase();
  const exactTime = normalized.match(
    /\b(?:at\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/,
  );

  if (exactTime) {
    const [, hourText, minuteText, meridiem] = exactTime;
    let hour = Number(hourText);

    if (meridiem === "pm" && hour < 12) {
      hour += 12;
    }

    if (meridiem === "am" && hour === 12) {
      hour = 0;
    }

    return {
      hour,
      minute: minuteText ? Number(minuteText) : 0,
      isExactTime: true,
      hasMinutePrecision: Boolean(minuteText),
    };
  }

  if (normalized.includes("after class")) {
    return { hour: 15, minute: 0, isExactTime: false, hasMinutePrecision: false };
  }

  if (normalized.includes("morning")) {
    return { hour: 9, minute: 0, isExactTime: false, hasMinutePrecision: false };
  }

  if (normalized.includes("afternoon")) {
    return { hour: 14, minute: 0, isExactTime: false, hasMinutePrecision: false };
  }

  if (normalized.includes("evening")) {
    return { hour: 18, minute: 0, isExactTime: false, hasMinutePrecision: false };
  }

  if (normalized.includes("tonight")) {
    return { hour: 20, minute: 0, isExactTime: false, hasMinutePrecision: false };
  }

  return { hour: 15, minute: 0, isExactTime: false, hasMinutePrecision: false };
}

function titleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getPlanLocation(input: string) {
  const normalizedInput = input.trim();
  const locationMatch = normalizedInput.match(
    /\b(?:at|in)\s+(?:the\s+)?([a-zA-Z][a-zA-Z\s'-]*?)(?:\s+(?:at|around|by|before|after)\s+\d|\s*$)/i,
  );

  if (locationMatch?.[1]) {
    return titleCase(locationMatch[1]);
  }

  if (input.toLowerCase().includes("library")) {
    return "Library";
  }

  return "";
}

function parsePlanIntention(input: string): ParsedPlan {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      when: null,
      where: "",
      isExactTime: false,
      hasMinutePrecision: false,
    };
  }

  const day = getPlanDay(trimmedInput);
  const time = getPlanTime(trimmedInput);
  const when = new Date(day);
  when.setHours(time.hour, time.minute, 0, 0);

  return {
    when,
    where: getPlanLocation(trimmedInput),
    isExactTime: time.isExactTime,
    hasMinutePrecision: time.hasMinutePrecision,
  };
}

function formatPlanChipTime(date: Date) {
  const now = new Date();
  const tomorrow = addDays(startOfToday(), 1);
  const dateLabel =
    date.toDateString() === tomorrow.toDateString()
      ? "Tomorrow"
      : date.toDateString() === now.toDateString()
        ? "Today"
        : new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "short",
          }).format(date);

  return `${dateLabel}, ${formatHorizonTime(date)}`;
}

function getHourAngle(hour: number) {
  return ((hour % 12) / 12) * 360;
}

function LoopDetailModal({
  loop,
  onResolve,
}: {
  loop: CanvasLoopModel;
  onResolve: (action: "complete" | "plan" | "later") => void;
}) {
  return (
    <motion.div
      aria-labelledby="loop-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-5 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
    >
      <div className="absolute inset-0 bg-[#4C3B2B]/10 backdrop-blur-[2px]" />

      <motion.div
        className="relative w-full max-w-md rounded-[2rem] border border-[#6E6257]/12 bg-[#FCFAF5]/90 px-7 py-8 text-center text-[#332C25] shadow-[0_28px_80px_rgba(76,59,43,0.14)] backdrop-blur-md"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <p className="mb-4 text-[0.7rem] tracking-[0.28em] text-[#6E6257]/62 uppercase">
          Open Loop
        </p>

        <h2
          className="mx-auto max-w-sm text-3xl leading-tight font-light tracking-[-0.04em]"
          id="loop-detail-title"
        >
          {loop.label}
        </h2>

        <p className="mt-4 text-sm text-[#6E6257]/72">
          Created {formatCreatedDate(loop.createdAt)}
        </p>

        <p className="mt-10 text-base text-[#4F463D]">
          How do you want to resolve this?
        </p>

        <div className="mt-7 grid gap-3">
          <button
            className="rounded-full border border-[#6E6257]/14 bg-[#332C25]/88 px-5 py-3 text-sm tracking-[0.02em] text-[#F7F4EE] transition hover:bg-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none"
            onClick={() => onResolve("complete")}
            type="button"
          >
            Complete
          </button>
          <button
            className="rounded-full border border-[#6E6257]/16 bg-[#F7F4EE]/70 px-5 py-3 text-sm tracking-[0.02em] text-[#4F463D] transition hover:bg-[#FFFDF8]/76 focus-visible:ring-2 focus-visible:ring-[#8B7A68]/30 focus-visible:outline-none"
            onClick={() => onResolve("plan")}
            type="button"
          >
            Make a Plan
          </button>
          <button
            className="rounded-full px-5 py-3 text-sm tracking-[0.02em] text-[#6E6257]/78 transition hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/25 focus-visible:outline-none"
            onClick={() => onResolve("later")}
            type="button"
          >
            Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RadialTimeSelector({
  inferred,
  onChange,
}: {
  inferred: ParsedPlan;
  onChange: (date: Date, hasMinutePrecision: boolean) => void;
}) {
  const selectedDate = inferred.when ?? (() => {
    const fallback = addDays(startOfToday(), 1);
    fallback.setHours(15, 0, 0, 0);
    return fallback;
  })();
  const [showMinutes, setShowMinutes] = useState(inferred.hasMinutePrecision);
  const hourAngle = getHourAngle(selectedDate.getHours());
  const handleX = 50 + Math.sin((hourAngle * Math.PI) / 180) * 38;
  const handleY = 50 - Math.cos((hourAngle * Math.PI) / 180) * 38;

  function updateHourFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const angle = (Math.atan2(x, -y) * 180) / Math.PI;
    const normalizedAngle = (angle + 360) % 360;
    const nextHour12 = Math.round(normalizedAngle / 30) % 12 || 12;
    const nextDate = new Date(selectedDate);
    const currentHour = selectedDate.getHours();
    const shouldBePM = currentHour >= 12;
    nextDate.setHours((nextHour12 % 12) + (shouldBePM ? 12 : 0));
    onChange(nextDate, showMinutes || selectedDate.getMinutes() !== 0);
  }

  function updateMinutes(minutes: number) {
    const nextDate = new Date(selectedDate);
    nextDate.setMinutes(minutes, 0, 0);
    onChange(nextDate, true);
  }

  function toggleMeridiem() {
    const nextDate = new Date(selectedDate);
    const currentHour = nextDate.getHours();
    nextDate.setHours(currentHour >= 12 ? currentHour - 12 : currentHour + 12);
    onChange(nextDate, showMinutes || nextDate.getMinutes() !== 0);
  }

  return (
    <motion.div
      className="mt-5 rounded-[1.75rem] border border-[#6E6257]/12 bg-[#F7F4EE]/62 p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <p className="text-center text-sm text-[#6E6257]/72">
        Move around the circle to shift the hour.
      </p>

      <div
        aria-label="Adjust hour"
        aria-valuemax={12}
        aria-valuemin={1}
        aria-valuenow={selectedDate.getHours() % 12 || 12}
        aria-valuetext={formatHorizonTime(selectedDate)}
        className="relative mx-auto mt-5 size-56 touch-none rounded-full border border-[#8B7A68]/16 bg-[radial-gradient(circle,rgba(255,255,255,0.58),rgba(247,244,238,0.2)_58%,rgba(139,122,104,0.08))]"
        onPointerDown={updateHourFromPointer}
        onPointerMove={(event) => {
          if (event.buttons === 1) {
            updateHourFromPointer(event);
          }
        }}
        role="slider"
      >
        {[12, 3, 6, 9].map((hour) => {
          const angle = getHourAngle(hour);
          const x = 50 + Math.sin((angle * Math.PI) / 180) * 42;
          const y = 50 - Math.cos((angle * Math.PI) / 180) * 42;

          return (
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 text-xs text-[#6E6257]/50"
              key={hour}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {hour}
            </span>
          );
        })}

        <motion.span
          className="absolute block size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6E6257]/78 shadow-[0_0_28px_rgba(110,98,87,0.2)]"
          animate={{ left: `${handleX}%`, top: `${handleY}%` }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        />
        <div className="absolute inset-[4.35rem] grid place-items-center rounded-full bg-[#FCFAF5]/70 text-center">
          <span className="text-2xl font-light tracking-[-0.04em]">
            {formatHorizonTime(selectedDate)}
          </span>
          <button
            className="mt-1 text-xs tracking-[0.18em] text-[#6E6257]/68 uppercase"
            onClick={toggleMeridiem}
            type="button"
          >
            {selectedDate.getHours() >= 12 ? "PM" : "AM"}
          </button>
        </div>
      </div>

      <div className="mt-5 text-center">
        <button
          className="rounded-full px-4 py-2 text-xs tracking-[0.18em] text-[#6E6257]/72 uppercase transition hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/25 focus-visible:outline-none"
          onClick={() => setShowMinutes((value) => !value)}
          type="button"
        >
          {showMinutes ? "Hide finer precision" : "Need finer precision?"}
        </button>
      </div>

      <AnimatePresence>
        {showMinutes ? (
          <motion.div
            className="mt-4 grid grid-cols-4 gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {[0, 15, 30, 45].map((minute) => (
              <button
                className="rounded-full border border-[#6E6257]/12 px-3 py-2 text-sm text-[#6E6257]/80 transition hover:bg-[#FFFDF8]/70 hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/25 focus-visible:outline-none"
                key={minute}
                onClick={() => updateMinutes(minute)}
                type="button"
              >
                :{padNumber(minute)}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function PlanLoopModal({
  loop,
  onClose,
  onSubmit,
}: {
  loop: CanvasLoopModel;
  onClose: () => void;
  onSubmit: (plan: LoopPlan) => void;
}) {
  const initialWhen = loop.plan?.when ? new Date(loop.plan.when) : null;
  const [planLanguage, setPlanLanguage] = useState(
    loop.plan
      ? `${loop.plan.where} ${initialWhen ? formatPlanChipTime(initialWhen) : ""}`.trim()
      : "",
  );
  const [parsedPlan, setParsedPlan] = useState<ParsedPlan>(
    loop.plan && initialWhen
      ? {
          when: initialWhen,
          where: loop.plan.where,
          isExactTime: true,
          hasMinutePrecision: initialWhen.getMinutes() !== 0,
        }
      : parsePlanIntention(""),
  );
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationDraft, setLocationDraft] = useState(loop.plan?.where ?? "");
  const [firstAction, setFirstAction] = useState(
    loop.plan?.firstAction ?? "",
  );
  const isSpecific =
    parsedPlan.when !== null &&
    parsedPlan.where.trim().length > 0 &&
    firstAction.trim().length > 0;

  function handlePlanLanguageChange(value: string) {
    const nextParsedPlan = parsePlanIntention(value);
    setPlanLanguage(value);
    setParsedPlan(nextParsedPlan);
    setLocationDraft(nextParsedPlan.where);
  }

  function handleTimeChange(date: Date, hasMinutePrecision: boolean) {
    setParsedPlan((currentPlan) => ({
      ...currentPlan,
      when: date,
      isExactTime: true,
      hasMinutePrecision,
    }));
  }

  function handleLocationChange(value: string) {
    setLocationDraft(value);
    setParsedPlan((currentPlan) => ({
      ...currentPlan,
      where: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSpecific || !parsedPlan.when) {
      return;
    }

    onSubmit({
      when: toPlanDateTimeValue(parsedPlan.when),
      where: parsedPlan.where.trim(),
      firstAction: firstAction.trim(),
    });
  }

  return (
    <motion.div
      aria-labelledby="plan-loop-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-5 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
    >
      <button
        aria-label="Return to canvas"
        className="absolute inset-0 cursor-default bg-[#4C3B2B]/10 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <motion.form
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-[#6E6257]/12 bg-[#FCFAF5]/92 px-7 py-8 text-[#332C25] shadow-[0_28px_80px_rgba(76,59,43,0.14)] backdrop-blur-md"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onSubmit={handleSubmit}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <p className="mb-4 text-center text-[0.7rem] tracking-[0.28em] text-[#6E6257]/62 uppercase">
          Partial closure
        </p>

        <h2
          className="mx-auto max-w-sm text-center text-3xl leading-tight font-light tracking-[-0.04em]"
          id="plan-loop-title"
        >
          {loop.label}
        </h2>

        <div className="mt-9 space-y-6">
          <label className="block text-sm text-[#6E6257]" htmlFor="plan-language">
            Say when and where, naturally.
            <textarea
              autoFocus
              className="mt-3 min-h-24 w-full resize-none rounded-[1.5rem] border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-5 py-4 text-base leading-7 text-[#332C25] outline-none transition focus:border-[#8B7A68]/35 focus:bg-[#FFFDF8]/78"
              id="plan-language"
              onChange={(event) => handlePlanLanguageChange(event.target.value)}
              placeholder="Tomorrow after class at the library"
              value={planLanguage}
            />
          </label>

          <div>
            <p className="mb-3 text-sm text-[#6E6257]">What Future You is holding</p>
            <div className="flex flex-wrap gap-2">
              {parsedPlan.when ? (
                <button
                  className="rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-4 py-2 text-sm text-[#4F463D] transition hover:bg-[#FFFDF8]/76 focus-visible:ring-2 focus-visible:ring-[#8B7A68]/30 focus-visible:outline-none"
                  onClick={() => setIsTimeOpen((value) => !value)}
                  type="button"
                >
                  ✓ {formatPlanChipTime(parsedPlan.when)}
                </button>
              ) : null}

              {parsedPlan.where || planLanguage.trim() ? (
                <button
                  className="rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-4 py-2 text-sm text-[#4F463D] transition hover:bg-[#FFFDF8]/76 focus-visible:ring-2 focus-visible:ring-[#8B7A68]/30 focus-visible:outline-none"
                  onClick={() => setIsLocationOpen((value) => !value)}
                  type="button"
                >
                  {parsedPlan.where ? `✓ ${parsedPlan.where}` : "Add place"}
                </button>
              ) : null}
            </div>
          </div>

          <AnimatePresence>
            {isTimeOpen ? (
              <RadialTimeSelector
                inferred={parsedPlan}
                onChange={handleTimeChange}
              />
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {isLocationOpen ? (
              <motion.label
                className="block text-sm text-[#6E6257]"
                htmlFor="plan-location-refine"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Refine place
                <input
                  className="mt-3 w-full rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-5 py-3 text-base text-[#332C25] outline-none transition focus:border-[#8B7A68]/35 focus:bg-[#FFFDF8]/78"
                  id="plan-location-refine"
                  onChange={(event) => handleLocationChange(event.target.value)}
                  placeholder="The place it will happen"
                  type="text"
                  value={locationDraft}
                />
              </motion.label>
            ) : null}
          </AnimatePresence>

          <label
            className="block text-sm text-[#6E6257]"
            htmlFor="plan-first-action"
          >
            What is the first action?
            <input
              className="mt-3 w-full rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-5 py-3 text-base text-[#332C25] outline-none transition focus:border-[#8B7A68]/35 focus:bg-[#FFFDF8]/78"
              id="plan-first-action"
              onChange={(event) => setFirstAction(event.target.value)}
              placeholder="The smallest honest movement"
              type="text"
              value={firstAction}
            />
          </label>
        </div>

        <button
          className="mt-9 w-full rounded-full border border-[#6E6257]/14 bg-[#332C25]/88 px-5 py-3 text-sm tracking-[0.02em] text-[#F7F4EE] transition hover:bg-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!isSpecific}
          type="submit"
        >
          Entrust it to Future You
        </button>
      </motion.form>
    </motion.div>
  );
}

function getScheduledDate(loop: CanvasLoopModel) {
  if (!loop.plan?.when) {
    return null;
  }

  const date = new Date(loop.plan.when);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getResurfacedPlacement(loop: CanvasLoopModel) {
  return {
    left: `${Math.min(86, Math.max(12, Number.parseFloat(loop.left) + 6))}%`,
    top: `${Math.min(82, Math.max(16, Number.parseFloat(loop.top) - 8))}%`,
    rotate: loop.rotate - 6,
  };
}

function formatHorizonDay(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(date);
}

function formatHorizonTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPlannedGroups(loops: CanvasLoopModel[]) {
  const plannedLoops = loops
    .map((loop) => ({
      loop,
      scheduledDate: getScheduledDate(loop),
    }))
    .filter(
      (
        item,
      ): item is {
        loop: CanvasLoopModel;
        scheduledDate: Date;
      } => loopIsPlannedWithDate(item),
    )
    .sort(
      (first, second) =>
        first.scheduledDate.getTime() - second.scheduledDate.getTime(),
    );

  return plannedLoops.reduce<
    {
      key: string;
      label: string;
      loops: typeof plannedLoops;
    }[]
  >((groups, plannedLoop) => {
    const key = plannedLoop.scheduledDate.toISOString().slice(0, 10);
    const existingGroup = groups.find((group) => group.key === key);

    if (existingGroup) {
      existingGroup.loops.push(plannedLoop);
      return groups;
    }

    groups.push({
      key,
      label: formatHorizonDay(plannedLoop.scheduledDate),
      loops: [plannedLoop],
    });

    return groups;
  }, []);
}

function loopIsPlannedWithDate(item: {
  loop: CanvasLoopModel;
  scheduledDate: Date | null;
}) {
  return item.loop.state === "planned" && item.scheduledDate !== null;
}

function HorizonSheet({
  loops,
  onClose,
}: {
  loops: CanvasLoopModel[];
  onClose: () => void;
}) {
  const plannedGroups = getPlannedGroups(loops);

  return (
    <motion.div
      aria-labelledby="horizon-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
    >
      <button
        aria-label="Close Horizon"
        className="absolute inset-0 cursor-default bg-[#4C3B2B]/10 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <motion.section
        className="relative max-h-[82vh] w-full overflow-hidden rounded-t-[2.25rem] border-x border-t border-[#6E6257]/12 bg-[#FCFAF5]/94 px-6 pt-4 pb-8 text-[#332C25] shadow-[0_-28px_90px_rgba(76,59,43,0.13)] backdrop-blur-md sm:max-w-3xl sm:px-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto mb-7 h-1 w-12 rounded-full bg-[#6E6257]/18" />

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.7rem] tracking-[0.32em] text-[#6E6257]/62 uppercase">
              Horizon
            </p>
            <h2
              className="mt-3 max-w-lg text-3xl leading-tight font-light tracking-[-0.045em] sm:text-4xl"
              id="horizon-title"
            >
              Future versions of yourself are holding these intentions.
            </h2>
          </div>

          <button
            aria-label="Close Horizon"
            className="rounded-full px-2 py-1 text-xl leading-none text-[#6E6257]/65 transition-colors hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/30 focus-visible:outline-none"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <div className="mt-9 max-h-[50vh] overflow-y-auto pr-1">
          {plannedGroups.length > 0 ? (
            <div className="space-y-9">
              {plannedGroups.map((group) => (
                <section key={group.key}>
                  <p className="mb-5 text-sm text-[#6E6257]/72">
                    {group.label}
                  </p>

                  <div className="space-y-5">
                    {group.loops.map(({ loop, scheduledDate }) => (
                      <motion.div
                        className="grid grid-cols-[4.25rem_1fr] items-center gap-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        key={loop.id}
                      >
                        <div className="relative grid size-16 place-items-center">
                          <Loop
                            className="overflow-visible opacity-75"
                            size={62}
                            state="planned"
                            tension={Math.max(1, loop.tension - 1)}
                          />
                        </div>

                        <div className="border-l border-[#6E6257]/10 pl-5">
                          <p className="text-xs tracking-[0.18em] text-[#6E6257]/58 uppercase">
                            {formatHorizonTime(scheduledDate)} -{" "}
                            {loop.plan?.where}
                          </p>
                          <p className="mt-2 text-lg leading-snug font-light tracking-[-0.02em] text-[#332C25]">
                            {loop.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#6E6257]/78">
                            First: {loop.plan?.firstAction}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p className="max-w-sm text-sm leading-6 text-[#6E6257]/72">
              No future self is holding a plan yet. When a loop has a when,
              where, and first action, it will rest here.
            </p>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

function ConstellationSheet({
  loops,
  onClose,
}: {
  loops: CanvasLoopModel[];
  onClose: () => void;
}) {
  const completedLoops = loops.filter(
    (loop) => loop.state === "completed" && loop.integratedAt && loop.completedAt,
  );
  const [selectedStarId, setSelectedStarId] = useState<string | null>(
    completedLoops[0]?.id ?? null,
  );
  const selectedStar =
    completedLoops.find((loop) => loop.id === selectedStarId) ?? null;

  return (
    <motion.div
      aria-labelledby="constellation-title"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-[#111419] text-[#F7F4EE]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(247,244,238,0.13),transparent_22rem),radial-gradient(circle_at_70%_70%,rgba(139,122,104,0.11),transparent_24rem),linear-gradient(180deg,#15171d,#0f1218)]" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(247,244,238,0.42)_0.7px,transparent_0.8px)] [background-size:42px_42px]" />

      <motion.div
        className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-10"
        initial={{ y: 18 }}
        animate={{ y: 0 }}
        exit={{ y: 18 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.7rem] tracking-[0.32em] text-[#D8CAB7]/60 uppercase">
              Constellation
            </p>
            <h2
              className="mt-3 max-w-xl text-3xl leading-tight font-light tracking-[-0.045em] text-[#F7F4EE] sm:text-4xl"
              id="constellation-title"
            >
              Completed intentions no longer demand attention. They become part
              of the story.
            </h2>
          </div>

          <button
            aria-label="Close Constellation"
            className="rounded-full px-2 py-1 text-xl leading-none text-[#D8CAB7]/70 transition-colors hover:text-[#F7F4EE] focus-visible:ring-2 focus-visible:ring-[#F7F4EE]/25 focus-visible:outline-none"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <div className="relative mt-8 min-h-[48vh] flex-1 overflow-hidden rounded-[2rem] border border-[#F7F4EE]/8 bg-[#F7F4EE]/[0.025]">
          {completedLoops.length > 0 ? (
            completedLoops.map((loop, index) => {
              const placement = starPlacements[index % starPlacements.length];
              const style = {
                left: placement.left,
                top: placement.top,
              } satisfies CSSProperties;

              return (
                <motion.button
                  aria-label={`Remember ${loop.label}`}
                  className="absolute rounded-full bg-[#F7F4EE] shadow-[0_0_22px_rgba(247,244,238,0.34)] focus-visible:ring-2 focus-visible:ring-[#F7F4EE]/40 focus-visible:outline-none"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{
                    opacity: selectedStarId === loop.id ? 0.96 : 0.58,
                    scale: selectedStarId === loop.id ? 1.24 : 1,
                    x: "-50%",
                    y: "-50%",
                  }}
                  key={loop.id}
                  onClick={() => setSelectedStarId(loop.id)}
                  style={{
                    ...style,
                    height: placement.size,
                    width: placement.size,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  type="button"
                />
              );
            })
          ) : (
            <p className="absolute top-1/2 left-1/2 max-w-xs -translate-x-1/2 -translate-y-1/2 text-center text-sm leading-6 text-[#D8CAB7]/66">
              Nothing has settled into memory yet.
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedStar?.completedAt ? (
            <motion.div
              className="mx-auto mt-7 max-w-md text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              key={selectedStar.id}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-xl leading-snug font-light tracking-[-0.03em]">
                {selectedStar.label}
              </p>
              <p className="mt-3 text-sm text-[#D8CAB7]/66">
                Completed {formatCompletionDate(selectedStar.completedAt)}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [loops, setLoops] = useState(initialLoops);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorizonOpen, setIsHorizonOpen] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [focusedLoopId, setFocusedLoopId] = useState<string | null>(null);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  const [planningLoopId, setPlanningLoopId] = useState<string | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<string | null>(null);
  const [task, setTask] = useState("");
  const [mentalPresence, setMentalPresence] = useState(3);
  const selectedLoop =
    loops.find((loop) => loop.id === selectedLoopId) ?? null;
  const planningLoop =
    loops.find((loop) => loop.id === planningLoopId) ?? null;
  const canvasLoops = loops.filter(
    (loop) => loop.state !== "completed" || !loop.integratedAt,
  );

  function closeModal() {
    setIsModalOpen(false);
  }

  useEffect(() => {
    function resurfaceDueLoops() {
      const now = Date.now();
      let didResurface = false;

      setLoops((currentLoops) =>
        currentLoops.map((loop) => {
          const scheduledDate = getScheduledDate(loop);

          if (
            loop.state !== "planned" ||
            loop.resurfacedAt ||
            scheduledDate === null ||
            scheduledDate.getTime() > now
          ) {
            return loop;
          }

          didResurface = true;

          return {
            ...loop,
            ...getResurfacedPlacement(loop),
            delay: 0,
            resurfacedAt: new Date(now).toISOString(),
            state: "open",
          };
        }),
      );

      if (didResurface) {
        setIsHorizonOpen(false);
        setArrivalMessage("The moment you planned for has arrived.");
      }
    }

    resurfaceDueLoops();

    const timer = window.setInterval(resurfaceDueLoops, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!arrivalMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setArrivalMessage(null);
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [arrivalMessage]);

  useEffect(() => {
    const timers = loops
      .filter(
        (loop) => loop.state === "completed" && loop.completedAt && !loop.integratedAt,
      )
      .map((loop) =>
        window.setTimeout(() => {
          setLoops((currentLoops) =>
            currentLoops.map((currentLoop) =>
              currentLoop.id === loop.id
                ? {
                    ...currentLoop,
                    integratedAt:
                      currentLoop.integratedAt ?? new Date().toISOString(),
                  }
                : currentLoop,
            ),
          );
        }, 1800),
      );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [loops]);

  function handleResolveLoop(action: "complete" | "plan" | "later") {
    if (action === "complete") {
      const completedAt = new Date().toISOString();

      setLoops((currentLoops) =>
        currentLoops.map((loop) =>
          loop.id === selectedLoopId
            ? {
                ...loop,
                completedAt,
                delay: 0,
                integratedAt: undefined,
                state: "completed",
              }
            : loop,
        ),
      );
    }

    if (action === "plan") {
      setPlanningLoopId(selectedLoopId);
    }

    setSelectedLoopId(null);
  }

  function handleSubmitPlan(plan: LoopPlan) {
    setLoops((currentLoops) =>
      currentLoops.map((loop) =>
        loop.id === planningLoopId
          ? {
              ...loop,
              completedAt: undefined,
              delay: 0,
              integratedAt: undefined,
              plan,
              resurfacedAt: undefined,
              state: "planned",
            }
          : loop,
      ),
    );
    setPlanningLoopId(null);
  }

  function handleCreateLoop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTask = task.trim();

    if (!trimmedTask) {
      return;
    }

    const placement = placementSequence[loops.length % placementSequence.length];
    const createdLoop: CanvasLoopModel = {
      id: `loop-${Date.now()}`,
      label: trimmedTask,
      createdAt: new Date().toISOString(),
      tension: mentalPresence,
      state: "open",
      size: placement.size + ((loops.length % 3) - 1) * 12,
      left: placement.left,
      top: placement.top,
      rotate: placement.rotate,
      delay: 0,
    };

    setLoops((currentLoops) => [...currentLoops, createdLoop]);
    setTask("");
    setMentalPresence(3);
    closeModal();
  }

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
          {canvasLoops.map((loop) => (
            <CanvasLoop
              focused={focusedLoopId === loop.id}
              key={`${loop.id}-${loop.resurfacedAt ?? "resting"}-${loop.completedAt ?? "open"}`}
              loop={loop}
              onBlur={() => setFocusedLoopId(null)}
              onFocus={setFocusedLoopId}
              onSelect={(loopId) => {
                setIsModalOpen(false);
                setIsHorizonOpen(false);
                setIsConstellationOpen(false);
                setFocusedLoopId(null);
                setPlanningLoopId(null);
                setSelectedLoopId(loopId);
              }}
            />
          ))}
        </div>
      </section>

      <motion.p
        className="fixed right-0 bottom-[5.75rem] left-0 z-20 px-6 text-center text-sm tracking-[0.02em] text-[#6E6257] sm:bottom-24 sm:text-base"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.42 }}
      >
        What&apos;s sitting in your mind?
      </motion.p>

      <AnimatePresence>
        {arrivalMessage ? (
          <motion.p
            className="fixed top-8 left-1/2 z-40 max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-full border border-[#6E6257]/12 bg-[#FCFAF5]/82 px-5 py-3 text-center text-sm text-[#5E544A] shadow-[0_18px_48px_rgba(76,59,43,0.09)] backdrop-blur-md"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {arrivalMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <motion.button
        aria-label="Open Horizon"
        className="fixed bottom-6 left-6 z-30 rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/55 px-4 py-3 text-xs tracking-[0.22em] text-[#6E6257]/80 uppercase shadow-[0_10px_30px_rgba(76,59,43,0.06)] backdrop-blur-sm transition-colors hover:bg-[#FFFDF8]/70 hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none sm:bottom-8 sm:left-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          setIsModalOpen(false);
          setIsConstellationOpen(false);
          setFocusedLoopId(null);
          setSelectedLoopId(null);
          setPlanningLoopId(null);
          setIsHorizonOpen(true);
        }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
        type="button"
      >
        Horizon
      </motion.button>

      <motion.button
        aria-label="Open Constellation"
        className="fixed bottom-[4.8rem] left-6 z-30 rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/55 px-4 py-3 text-xs tracking-[0.22em] text-[#6E6257]/80 uppercase shadow-[0_10px_30px_rgba(76,59,43,0.06)] backdrop-blur-sm transition-colors hover:bg-[#FFFDF8]/70 hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none sm:bottom-[5.25rem] sm:left-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          setIsModalOpen(false);
          setIsHorizonOpen(false);
          setFocusedLoopId(null);
          setSelectedLoopId(null);
          setPlanningLoopId(null);
          setIsConstellationOpen(true);
        }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.56 }}
        type="button"
      >
        Constellation
      </motion.button>

      <motion.button
        aria-label="Add an open loop"
        className="fixed right-6 bottom-6 z-30 grid size-11 place-items-center rounded-full border border-[#6E6257]/18 bg-[#F7F4EE]/55 text-2xl leading-none font-light text-[#6E6257]/80 shadow-[0_10px_30px_rgba(76,59,43,0.08)] backdrop-blur-sm transition-colors hover:bg-[#FFFDF8]/70 hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none sm:right-8 sm:bottom-8"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setFocusedLoopId(null);
          setSelectedLoopId(null);
          setPlanningLoopId(null);
          setIsHorizonOpen(false);
          setIsConstellationOpen(false);
          setIsModalOpen(true);
        }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.56 }}
        type="button"
      >
        +
      </motion.button>

      <AnimatePresence>
        {isModalOpen ? (
          <AddLoopModal
            mentalPresence={mentalPresence}
            onClose={closeModal}
            onMentalPresenceChange={setMentalPresence}
            onSubmit={handleCreateLoop}
            onTaskChange={setTask}
            task={task}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedLoop ? (
          <LoopDetailModal
            key={selectedLoop.id}
            loop={selectedLoop}
            onResolve={handleResolveLoop}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {planningLoop ? (
          <PlanLoopModal
            key={planningLoop.id}
            loop={planningLoop}
            onClose={() => setPlanningLoopId(null)}
            onSubmit={handleSubmitPlan}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isHorizonOpen ? (
          <HorizonSheet loops={loops} onClose={() => setIsHorizonOpen(false)} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isConstellationOpen ? (
          <ConstellationSheet
            loops={loops}
            onClose={() => setIsConstellationOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
