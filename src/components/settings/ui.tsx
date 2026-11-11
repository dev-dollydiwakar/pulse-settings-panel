"use client";

import { AnimatePresence, motion, type HTMLMotionProps, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";

export const ease = [0.2, 0.8, 0.2, 1] as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
};

/** Frosted glass panel. */
export function Panel({ className = "", children, ...rest }: HTMLMotionProps<"section">) {
  return (
    <motion.section
      variants={rise}
      className={`relative rounded-[22px] border border-bone/[.09] bg-[linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.02))] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_30px_60px_-40px_rgba(0,0,0,.9)] backdrop-blur-xl ${className}`}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

export function PanelHeader({ title, note, children }: { title: string; note?: string; children?: ReactNode }) {
  return (
    <header className="flex items-start gap-4">
      <div className="min-w-0">
        <h2 className="text-[16px] font-semibold">{title}</h2>
        {note && <p className="mt-0.5 text-[13px] text-smoke">{note}</p>}
      </div>
      {children && <div className="ml-auto flex flex-none items-center gap-2">{children}</div>}
    </header>
  );
}

/** Accessible toggle (role="switch") with a springy knob. */
export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[26px] w-[46px] flex-none cursor-pointer rounded-full border transition-colors duration-300 ${checked ? "border-lime/60 bg-lime" : "border-bone/15 bg-bone/10"}`}
    >
      <motion.span
        className={`absolute top-[3px] left-[3px] size-[18px] rounded-full shadow-[0_2px_6px_rgba(0,0,0,.45)] ${checked ? "bg-graphite" : "bg-bone"}`}
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 32 }}
      />
    </button>
  );
}

export type Option<T extends string> = { value: T; note?: string };

/** Listbox dropdown with a glass menu. Closes on outside click and Esc. */
export function Select<T extends string>({ value, options, onChange, id, label, align = "right", size = "md" }: { value: T; options: Option<T>[]; onChange: (v: T) => void; id?: string; label: string; align?: "left" | "right"; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value}`}
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-2 rounded-xl border bg-white/[.04] font-semibold transition-colors ${size === "sm" ? "h-9 px-3 text-[13px]" : "h-11 px-3.5 text-[14px]"} ${open ? "border-lime/50" : "border-bone/10 hover:border-bone/25"}`}
      >
        {value}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease }} className="text-smoke">
          <Icon name="chevron" className="size-4" strokeWidth={2.4} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -8, scale: 0.95, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 460, damping: 32 }}
            className={`absolute top-[calc(100%+6px)] z-40 w-[250px] rounded-2xl border border-bone/10 bg-[#151517]/90 p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur-2xl ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}
          >
            {options.map((o) => (
              <li
                key={o.value}
                id={id ? `${id}-${o.value.toLowerCase()}` : undefined}
                role="option"
                aria-selected={o.value === value}
                tabIndex={0}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(o.value);
                    setOpen(false);
                  }
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left outline-none hover:bg-white/[.06] focus-visible:bg-white/[.06]"
              >
                <span className="min-w-0">
                  <b className="block text-[13.5px] font-semibold">{o.value}</b>
                  {o.note && <span className="block text-[12px] text-smoke">{o.note}</span>}
                </span>
                {o.value === value && <Icon name="check" className="ml-auto size-4 text-lime" strokeWidth={2.8} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Avatar({ text, color, size = 36 }: { text: string; color: string; size?: number }) {
  return (
    <span className="grid flex-none place-items-center rounded-full font-bold text-graphite" style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}>
      {text}
    </span>
  );
}
