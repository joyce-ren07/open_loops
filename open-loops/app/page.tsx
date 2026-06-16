"use client";

import { AnimatePresence, motion } from "framer-motion";
import Loop from "@/components/Loop";
import type { LoopState } from "@/components/Loop";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { FormEvent } from "react";

type CanvasLoopModel = {
  id: string;
  label: string;
  createdAt: string;
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

const initialLoops: CanvasLoopModel[] = [
  {
    id: "urgent-open",
    label: "An unresolved thought",
    createdAt: "2026-06-12T12:00:00.000Z",
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
    label: "A gentler plan",
    createdAt: "2026-06-13T12:00:00.000Z",
    plan: {
      when: "2026-06-17T09:00",
      where: "The quiet table by the window",
      firstAction: "Open the notebook to a blank page",
    },
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
    label: "Something mentally present",
    createdAt: "2026-06-14T12:00:00.000Z",
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
    label: "A closed loop",
    createdAt: "2026-06-10T12:00:00.000Z",
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
    label: "A quiet next step",
    createdAt: "2026-06-15T12:00:00.000Z",
    plan: {
      when: "2026-06-18T16:30",
      where: "After tea, at the desk",
      firstAction: "Write the first honest sentence",
    },
    tension: 4,
    state: "planned",
    size: 166,
    left: "24%",
    top: "78%",
    rotate: 17,
    delay: 0.26,
  },
];

const placementSequence = [
  { left: "58%", top: "73%", rotate: -18, size: 190 },
  { left: "83%", top: "29%", rotate: 14, size: 152 },
  { left: "10%", top: "56%", rotate: 7, size: 176 },
  { left: "36%", top: "18%", rotate: -8, size: 138 },
  { left: "70%", top: "82%", rotate: 21, size: 168 },
  { left: "28%", top: "42%", rotate: -2, size: 206 },
];

function CanvasLoop({
  loop,
  onSelect,
}: {
  loop: CanvasLoopModel;
  onSelect: (loopId: string) => void;
}) {
  const style = {
    left: loop.left,
    top: loop.top,
  } satisfies CSSProperties;
  const resurfaced = Boolean(loop.resurfacedAt);

  return (
    <motion.button
      aria-label={loop.label}
      className="absolute cursor-pointer border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-[#8B7A68]/25 focus-visible:outline-none"
      initial={{
        opacity: 0,
        scale: resurfaced ? 0.72 : 0.9,
        x: "-50%",
        y: resurfaced ? "-34%" : "-50%",
        rotate: loop.rotate,
        filter: resurfaced ? "blur(12px)" : "blur(7px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: "-50%",
        y: "-50%",
        rotate: loop.rotate,
        filter: "blur(0px)",
      }}
      transition={{ duration: 1.2, ease: "easeOut", delay: loop.delay }}
      onClick={() => onSelect(loop.id)}
      style={style}
      type="button"
      whileHover={{ scale: 1.018 }}
      whileTap={{ scale: 0.985 }}
    >
      <Loop
        className="overflow-visible drop-shadow-[0_18px_44px_rgba(70,55,40,0.045)]"
        resurfaced={resurfaced}
        size={loop.size}
        state={loop.state}
        tension={loop.tension}
      />
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

function PlanLoopModal({
  loop,
  onClose,
  onSubmit,
}: {
  loop: CanvasLoopModel;
  onClose: () => void;
  onSubmit: (plan: LoopPlan) => void;
}) {
  const [when, setWhen] = useState(loop.plan?.when ?? "");
  const [where, setWhere] = useState(loop.plan?.where ?? "");
  const [firstAction, setFirstAction] = useState(
    loop.plan?.firstAction ?? "",
  );
  const isSpecific =
    when.trim().length > 0 &&
    where.trim().length > 0 &&
    firstAction.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSpecific) {
      return;
    }

    onSubmit({
      when: when.trim(),
      where: where.trim(),
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
        className="relative w-full max-w-md rounded-[2rem] border border-[#6E6257]/12 bg-[#FCFAF5]/92 px-7 py-8 text-[#332C25] shadow-[0_28px_80px_rgba(76,59,43,0.14)] backdrop-blur-md"
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
          <label className="block text-sm text-[#6E6257]" htmlFor="plan-when">
            When?
            <input
              autoFocus
              className="mt-3 w-full rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-5 py-3 text-base text-[#332C25] outline-none transition focus:border-[#8B7A68]/35 focus:bg-[#FFFDF8]/78"
              id="plan-when"
              onChange={(event) => setWhen(event.target.value)}
              type="datetime-local"
              value={when}
            />
          </label>

          <label className="block text-sm text-[#6E6257]" htmlFor="plan-where">
            Where?
            <input
              className="mt-3 w-full rounded-full border border-[#6E6257]/14 bg-[#F7F4EE]/72 px-5 py-3 text-base text-[#332C25] outline-none transition focus:border-[#8B7A68]/35 focus:bg-[#FFFDF8]/78"
              id="plan-where"
              onChange={(event) => setWhere(event.target.value)}
              placeholder="The place it will happen"
              type="text"
              value={where}
            />
          </label>

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
          Let it rest here
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

export default function Home() {
  const [loops, setLoops] = useState(initialLoops);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorizonOpen, setIsHorizonOpen] = useState(false);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  const [planningLoopId, setPlanningLoopId] = useState<string | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<string | null>(null);
  const [task, setTask] = useState("");
  const [mentalPresence, setMentalPresence] = useState(3);
  const selectedLoop =
    loops.find((loop) => loop.id === selectedLoopId) ?? null;
  const planningLoop =
    loops.find((loop) => loop.id === planningLoopId) ?? null;

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

  function handleResolveLoop(action: "complete" | "plan" | "later") {
    if (action === "complete") {
      setLoops((currentLoops) =>
        currentLoops.map((loop) =>
          loop.id === selectedLoopId ? { ...loop, state: "completed" } : loop,
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
              plan,
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
          {loops.map((loop) => (
            <CanvasLoop
              key={`${loop.id}-${loop.resurfacedAt ?? "resting"}`}
              loop={loop}
              onSelect={(loopId) => {
                setIsModalOpen(false);
                setIsHorizonOpen(false);
                setPlanningLoopId(null);
                setSelectedLoopId(loopId);
              }}
            />
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
        aria-label="Add an open loop"
        className="fixed right-6 bottom-6 z-30 grid size-11 place-items-center rounded-full border border-[#6E6257]/18 bg-[#F7F4EE]/55 text-2xl leading-none font-light text-[#6E6257]/80 shadow-[0_10px_30px_rgba(76,59,43,0.08)] backdrop-blur-sm transition-colors hover:bg-[#FFFDF8]/70 hover:text-[#332C25] focus-visible:ring-2 focus-visible:ring-[#8B7A68]/35 focus-visible:outline-none sm:right-8 sm:bottom-8"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setSelectedLoopId(null);
          setPlanningLoopId(null);
          setIsHorizonOpen(false);
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
    </main>
  );
}
