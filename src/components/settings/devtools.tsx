"use client";

import { AnimatePresence, motion } from "motion/react";

export type DevEvent = {
  id: number;
  /** Seconds since the flow mounted. */
  t: number;
  name: string;
  detail: string;
  /** Duration of async work, if any. */
  ms?: number;
  error?: boolean;
};

const ease = [0.2, 0.8, 0.2, 1] as const;

function Value({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <>
        <span className="text-smoke">[</span>
        {value.map((v, i) => (
          <span key={i}>
            {i > 0 && <span className="text-smoke">, </span>}
            <span className="text-[#9fe6ff]">&quot;{String(v)}&quot;</span>
          </span>
        ))}
        <span className="text-smoke">]</span>
      </>
    );
  }
  if (typeof value === "number") return <span className="text-amber">{value}</span>;
  return <span className="text-[#9fe6ff]">&quot;{String(value)}&quot;</span>;
}

/**
 * Dev overlay: the flow's state as JSON (a line flashes when its value changes)
 * next to a log of what just happened, with timings for async work.
 */
export function DevPanel({ state, events }: { state: Record<string, unknown>; events: DevEvent[] }) {
  const keys = Object.keys(state);

  return (
    <motion.section
      id="devtools"
      aria-label="Developer tools"
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease, delay: 0.25 }}
      className="overflow-hidden rounded-[22px] border border-bone/10 bg-[#0d0d0f]/90 font-mono text-[11.5px] leading-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,.95)] backdrop-blur-xl"
    >
      <div className="flex h-9 items-center gap-2 border-b border-bone/[.07] px-4 text-[11px] text-smoke">
        <i className="size-2 rounded-full bg-lime shadow-[0_0_8px_#c6f432]" />
        <b className="font-bold tracking-[2px] text-bone">DEVTOOLS</b>
        <span className="ml-auto">state</span>
        <span className="w-[240px] pl-4">events</span>
      </div>
      <div className="grid h-[168px] grid-cols-[1fr_256px]">
        {/* state */}
        <div className="overflow-hidden px-4 py-2.5">
          <div className="text-smoke">{"{"}</div>
          {keys.map((k) => {
            const json = JSON.stringify(state[k]);
            return (
              <div key={k} className="relative truncate whitespace-nowrap pl-3">
                <motion.span key={json} aria-hidden className="absolute inset-y-0 -left-1 right-0 rounded bg-lime/25" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut" }} />
                <span className="relative">
                  <span className="text-[#e9ff9e]">{k}</span>
                  <span className="text-smoke">: </span>
                  <Value value={state[k]} />
                  <span className="text-smoke">,</span>
                </span>
              </div>
            );
          })}
          <div className="text-smoke">{"}"}</div>
        </div>

        {/* events */}
        <ol className="overflow-hidden border-l border-bone/[.07] px-3 py-2.5" aria-live="polite">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: -10, backgroundColor: e.error ? "rgba(255,107,74,.18)" : "rgba(198,244,50,.16)" }}
                animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease, backgroundColor: { duration: 1.2 } }}
                className="-mx-1.5 flex items-baseline gap-2 rounded-md px-1.5 py-[3px]"
              >
                <span className="flex-none text-[10.5px] text-bone/35">{e.t.toFixed(2).padStart(5, "0")}s</span>
                <span className="min-w-0 flex-1 truncate">
                  <b className={`font-semibold ${e.error ? "text-coral" : "text-[#e9ff9e]"}`}>{e.name}</b> <span className="text-bone/70">{e.detail}</span>
                </span>
                {e.ms !== undefined && <span className="flex-none text-[10.5px] text-lime">{Math.round(e.ms)}ms</span>}
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </motion.section>
  );
}
