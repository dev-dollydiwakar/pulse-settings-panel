"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CHANNELS, NOTIFICATIONS, type Channel } from "./data";
import { Icon } from "./icons";
import { ease, Panel, PanelHeader, Switch } from "./ui";

type Prefs = Record<string, Record<Channel, boolean>>;

/** Notifications: a channel matrix of switches that auto-saves with a "Saved" pill. */
export function NotificationsTab({ onEvent }: { onEvent: (name: string, detail: string) => void }) {
  const [prefs, setPrefs] = useState<Prefs>(() => Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, { ...n.defaults }])));
  const [saved, setSaved] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function toggle(id: string, channel: Channel) {
    const next = !prefs[id][channel];
    setPrefs((p) => ({ ...p, [id]: { ...p[id], [channel]: next } }));
    onEvent("prefs.update", `${id}.${channel} = ${next}`);
    setSaved((s) => s + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(0), 1600);
  }

  return (
    <Panel className="p-6">
      <PanelHeader title="Notifications" note="Changes save automatically.">
        <AnimatePresence>
          {saved > 0 && (
            <motion.span
              key={saved}
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
              className="flex items-center gap-1.5 rounded-full bg-lime/12 px-2.5 py-1 text-[12px] font-bold text-lime"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease }} />
              </svg>
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </PanelHeader>

      <div className="mt-5 overflow-hidden rounded-2xl border border-bone/[.07]">
        <div className="grid grid-cols-[1fr_repeat(3,64px)] items-center gap-2 border-b border-bone/[.07] bg-white/[.03] px-4 py-2.5 sm:grid-cols-[1fr_repeat(3,84px)]">
          <span className="font-mono text-[11px] font-bold tracking-[1.5px] text-smoke">EVENT</span>
          {CHANNELS.map((c) => (
            <span key={c.id} className="text-center font-mono text-[11px] font-bold tracking-[1.5px] text-smoke">
              {c.label.toUpperCase()}
            </span>
          ))}
        </div>
        {NOTIFICATIONS.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease }}
            className="grid grid-cols-[1fr_repeat(3,64px)] items-center gap-2 border-b border-bone/[.05] px-4 py-3.5 last:border-0 sm:grid-cols-[1fr_repeat(3,84px)]"
          >
            <div className="min-w-0 pr-2">
              <b className="block text-[13.5px] font-semibold">{n.title}</b>
              <span className="block truncate text-[12px] text-smoke">{n.note}</span>
            </div>
            {CHANNELS.map((c) => (
              <div key={c.id} className="flex justify-center">
                <Switch id={`sw-${n.id}-${c.id}`} checked={prefs[n.id][c.id]} onChange={() => toggle(n.id, c.id)} label={`${n.title} via ${c.label}`} />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[12px] text-smoke">
        <Icon name="mail" className="size-3.5" />
        Email goes to dolly@acme.studio · Slack posts to #pulse-alerts
      </p>
    </Panel>
  );
}
