"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DevPanel, type DevEvent } from "./devtools";
import { ApiTab } from "./api-tab";
import { TABS, type TabId } from "./data";
import { Icon } from "./icons";
import { NotificationsTab } from "./notifications-tab";
import { ProfileTab } from "./profile-tab";
import { TeamTab } from "./team-tab";
import { ease } from "./ui";

type SettingsPanelProps = {
  /** Shows the event log under the panel. */
  devtools?: boolean;
  defaultTab?: TabId;
};

/** Settings: animated tabs (Profile · Team · API keys · Notifications) with an event log. */
export function SettingsPanel({ devtools = true, defaultTab = "profile" }: SettingsPanelProps) {
  const [tab, setTab] = useState<TabId>(defaultTab);
  const [events, setEvents] = useState<DevEvent[]>([]);
  const t0 = useRef(0);
  const nextId = useRef(0);

  const log = useCallback((name: string, detail: string, extra: Partial<DevEvent> = {}) => {
    const t = (performance.now() - t0.current) / 1000;
    setEvents((list) => [{ id: nextId.current++, t, name, detail, ...extra }, ...list].slice(0, 7));
  }, []);

  useEffect(() => {
    t0.current = performance.now();
    log("settings.open", "workspace acme-studio");
  }, [log]);

  const onEvent = useCallback((name: string, detail: string, extra?: { ms?: number; error?: boolean } | boolean) => {
    log(name, detail, typeof extra === "boolean" ? { error: extra } : (extra ?? {}));
  }, [log]);

  function switchTab(next: TabId) {
    if (next === tab) return;
    setTab(next);
    log("tab.switch", next);
  }

  const state = { tab };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-10 mx-auto w-full max-w-[880px] px-6">
        <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#c6f432,#7fa81a)] text-[16px] font-black text-graphite shadow-[0_8px_20px_-8px_#c6f432]">P</span>
          <div className="leading-tight">
            <h1 className="text-[22px] font-bold tracking-tight">Settings</h1>
            <p className="text-[12.5px] text-smoke">Acme Studio · pulse.app/acme-studio</p>
          </div>
          <span className="ml-auto hidden items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-[11.5px] font-semibold text-lime sm:flex">
            <Icon name="globe" className="size-3.5" />
            All changes sync live
          </span>
        </motion.header>

        {/* tabs */}
        <motion.nav initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }} className="mt-5 flex gap-1 rounded-2xl border border-bone/[.09] bg-white/[.03] p-1.5 backdrop-blur-xl" role="tablist" aria-label="Settings sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => switchTab(t.id)}
              className={`relative flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl text-[13.5px] font-semibold transition-colors ${tab === t.id ? "text-graphite" : "text-smoke hover:text-bone"}`}
            >
              {tab === t.id && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-xl bg-lime shadow-[0_0_24px_-8px_#c6f432]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className="relative flex items-center gap-2">
                <Icon name={t.icon} className="size-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </span>
            </button>
          ))}
        </motion.nav>

        {/* active tab */}
        <div className="relative mt-4 min-h-[428px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -14, filter: "blur(6px)" }} transition={{ duration: 0.35, ease }}>
              {tab === "profile" && <ProfileTab onEvent={onEvent} />}
              {tab === "team" && <TeamTab onEvent={onEvent} />}
              {tab === "api" && <ApiTab onEvent={onEvent} />}
              {tab === "notifications" && <NotificationsTab onEvent={onEvent} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {devtools && (
          <div className="mt-4">
            <DevPanel state={state} events={events} />
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
