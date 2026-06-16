"use client";

import { AnimatePresence, motion } from "framer-motion";
import Loop from "@/components/Loop";
import type { LoopState } from "@/components/Loop";
import { FormEvent, useState } from "react";
import type { CSSProperties } from "react";

type CanvasLoopModel = {
  id: string;
  label: string;
  tension: number;
  state: LoopState;
  size: number;
  left: string;
  top: string;
  rotate: number;
  delay: number;
};

const initialLoops: CanvasLoopModel[] = [
  {
    id: "urgent-open",
    label: "An unresolved thought",
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

function CanvasLoop({ loop }: { loop: CanvasLoopModel }) {
  const style = {
    left: loop.left,
    top: loop.top,
  } satisfies CSSProperties;

  return (
    <motion.div
      aria-label={loop.label}
      className="absolute"
      initial={{
        opacity: 0,
        scale: 0.9,
        x: "-50%",
        y: "-50%",
        rotate: loop.rotate,
        filter: "blur(7px)",
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

export default function Home() {
  const [loops, setLoops] = useState(initialLoops);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState("");
  const [mentalPresence, setMentalPresence] = useState(3);

  function closeModal() {
    setIsModalOpen(false);
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
        onClick={() => setIsModalOpen(true)}
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
    </main>
  );
}
