"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { initials } from "./data";
import { Spinner } from "./icons";
import { Avatar, ease, Panel, PanelHeader } from "./ui";

const COLORS = ["#c6f432", "#ff6b4a", "#9fe6ff", "#ffb547", "#c4a1ff"];
type SaveState = "idle" | "saving" | "saved";

function Field({ id, label, value, onChange, hint, mono }: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string; mono?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-semibold text-bone/80">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={`mt-2 h-12 w-full rounded-xl border border-bone/10 bg-graphite/50 px-3.5 text-[14.5px] outline-none transition-[border-color,box-shadow] focus:border-lime/60 focus:shadow-[0_0_0_4px_rgba(198,244,50,.12)] ${mono ? "font-mono text-[13.5px]" : "font-medium"}`}
      />
      {hint && <p className="mt-1.5 text-[12px] text-smoke">{hint}</p>}
    </div>
  );
}

/** Profile: avatar color, name/handle fields, and a save button with saving → saved states. */
export function ProfileTab({ onEvent }: { onEvent: (name: string, detail: string) => void }) {
  const [name, setName] = useState("Dolly Diwakar");
  const [handle, setHandle] = useState("dolly");
  const [color, setColor] = useState(COLORS[0]);
  const [state, setState] = useState<SaveState>("idle");
  const [dirty, setDirty] = useState(false);

  function touch<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v);
      setDirty(true);
      if (state === "saved") setState("idle");
    };
  }

  function save() {
    if (state !== "idle" || !dirty) return;
    setState("saving");
    onEvent("profile.save", `${name} · @${handle}`);
    setTimeout(() => {
      setState("saved");
      setDirty(false);
      setTimeout(() => setState("idle"), 1800);
    }, 900);
  }

  return (
    <Panel className="p-6">
      <PanelHeader title="Profile" note="How you appear to your team." />

      <div className="mt-6 flex items-center gap-5">
        <motion.span key={color} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
          <Avatar text={initials(name)} color={color} size={64} />
        </motion.span>
        <div>
          <p className="text-[13px] font-semibold text-bone/80">Avatar color</p>
          <div role="radiogroup" aria-label="Avatar color" className="mt-2.5 flex gap-2.5">
            {COLORS.map((c, i) => (
              <button key={c} id={`avatar-color-${i}`} type="button" role="radio" aria-checked={c === color} aria-label={c} onClick={() => touch(setColor)(c)} className="relative grid size-8 cursor-pointer place-items-center rounded-full">
                {c === color && <motion.span layoutId="avatar-ring" className="absolute -inset-[3px] rounded-full border-2" style={{ borderColor: c }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                <span className="size-6 rounded-full shadow-[inset_0_-2px_0_rgba(0,0,0,.25)]" style={{ background: c }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="pf-name" label="Full name" value={name} onChange={touch(setName)} />
        <Field id="pf-handle" label="Handle" value={handle} onChange={(v) => touch(setHandle)(v.toLowerCase().replace(/[^a-z0-9-]/g, ""))} hint="pulse.app/u/…" mono />
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-bone/[.07] pt-5">
        <AnimatePresence>
          {dirty && state === "idle" && (
            <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[12.5px] text-smoke">
              Unsaved changes
            </motion.p>
          )}
        </AnimatePresence>
        <motion.button
          id="profile-save"
          type="button"
          onClick={save}
          disabled={!dirty && state === "idle"}
          whileTap={{ scale: 0.97 }}
          className={`relative ml-auto flex h-11 min-w-[150px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl text-[14px] font-bold transition-[background,box-shadow,opacity] duration-300 disabled:cursor-default disabled:opacity-45 ${
            state === "saved" ? "bg-lime text-graphite shadow-[0_0_0_4px_rgba(198,244,50,.18)]" : "shimmer bg-lime text-graphite shadow-[0_12px_28px_-12px_#c6f432]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state === "idle" && (
              <motion.span key="i" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }}>
                Save changes
              </motion.span>
            )}
            {state === "saving" && (
              <motion.span key="s" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }}>
                <Spinner className="size-3.5" /> Saving…
              </motion.span>
            )}
            {state === "saved" && (
              <motion.span key="d" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease }} />
                </svg>
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </Panel>
  );
}
