"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Confetti } from "./confetti";

const ease = [0.2, 0.8, 0.2, 1] as const;

const PARTS = [
  { n: 1, name: "Auth flow", img: "/recap/p1.jpg", rotate: -7, x: -32 },
  { n: 2, name: "Onboarding", img: "/recap/p2.jpg", rotate: -3.5, x: -16 },
  { n: 3, name: "Dashboard", img: "/recap/p3.jpg", rotate: 0, x: 0 },
  { n: 4, name: "Pricing", img: "/recap/p4.jpg", rotate: 3.5, x: 16 },
  { n: 5, name: "Settings", img: "/recap/p5.jpg", rotate: 7, x: 32 },
];

/** Series recap: the five Pulse screens fan in one by one, then the closing title. Trigger with window.__pulseFinale(true). */
export function PulseFinale() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__pulseFinale = (v: boolean) => setShow(v);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-50 overflow-hidden bg-graphite">
          {/* backdrop */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgb(242_240_233/.04)_1px,transparent_1px),linear-gradient(90deg,rgb(242_240_233/.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask:radial-gradient(ellipse_at_50%_45%,#000_30%,transparent_80%)]" />
            <i className="absolute -top-44 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-lime opacity-[.17] blur-[130px]" />
            <i className="absolute -bottom-40 -left-28 size-[500px] rounded-full bg-[#5f8f14] opacity-20 blur-[120px]" />
            <i className="absolute -right-28 -bottom-40 size-[500px] rounded-full bg-coral opacity-[.18] blur-[120px]" />
          </div>

          {/* fanned windows */}
          <div className="absolute inset-x-0 top-[12%] flex justify-center [perspective:1400px]">
            {PARTS.map((p, i) => (
              <motion.figure
                key={p.n}
                className="absolute w-[30vw] overflow-hidden rounded-2xl border border-bone/15 bg-[#101012] shadow-[0_50px_100px_-30px_rgba(0,0,0,.95)]"
                style={{ left: `calc(50% - 15vw + ${p.x}vw)`, zIndex: i === 2 ? 5 : i === 1 || i === 3 ? 4 : 3 }}
                initial={{ opacity: 0, y: "70vh", rotate: p.rotate * 2, scale: 0.8 }}
                animate={{ opacity: 1, y: p.n === 3 ? "-2vh" : "0vh", rotate: p.rotate, scale: i === 2 ? 1.04 : 1 }}
                transition={{ delay: 0.5 + i * 1.05, type: "spring", stiffness: 160, damping: 22 }}
              >
                <figcaption className="flex h-9 items-center gap-1.5 border-b border-bone/[.08] px-3">
                  <i className="size-2 rounded-full bg-[#ff5f57]" />
                  <i className="size-2 rounded-full bg-[#febc2e]" />
                  <i className="size-2 rounded-full bg-[#28c840]" />
                  <span className="mx-auto font-mono text-[11px] text-smoke">
                    Part {p.n} · <b className="font-semibold text-bone">{p.name}</b>
                  </span>
                </figcaption>
                <Image src={p.img} alt={`Part ${p.n}: ${p.name}`} width={1200} height={750} className="block w-full" priority />
              </motion.figure>
            ))}
          </div>

          {/* closing title */}
          <motion.div initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 6.4, duration: 0.8, ease }} className="absolute inset-x-0 bottom-[7%] text-center">
            <p className="font-mono text-[13px] font-bold tracking-[5px] text-lime">PULSE SAAS · THE COMPLETE SERIES</p>
            <h2 className="mt-3 text-[56px] leading-none font-black tracking-[-2.5px]">
              Five screens. <span className="bg-[linear-gradient(90deg,#c6f432,#e9ff9e)] bg-clip-text text-transparent">One product.</span>
            </h2>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              {PARTS.map((p, i) => (
                <motion.span key={p.n} initial={{ opacity: 0, y: 14, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 7.1 + i * 0.1, type: "spring", stiffness: 420, damping: 24 }} className="rounded-full border border-bone/15 bg-white/[.05] px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur-xl">
                  {p.name}
                </motion.span>
              ))}
              <motion.span initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 7.7, type: "spring", stiffness: 500, damping: 18 }} className="relative flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-[13px] font-black text-graphite shadow-[0_0_40px_-8px_#c6f432]">
                Complete ✓
                <span className="pointer-events-none absolute top-1/2 left-1/2">
                  <Confetti fire={1} />
                </span>
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
