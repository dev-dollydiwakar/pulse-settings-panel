"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { initials, MEMBERS, ROLES, type Member, type Role } from "./data";
import { Icon } from "./icons";
import { Avatar, Panel, PanelHeader, Select } from "./ui";

type Removed = { member: Member; index: number };

/** Team: role dropdowns, invite, and remove with an undo toast. */
export function TeamTab({ onEvent }: { onEvent: (name: string, detail: string, error?: boolean) => void }) {
  const [members, setMembers] = useState(MEMBERS);
  const [removed, setRemoved] = useState<Removed | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function setRole(id: string, role: Role) {
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));
    const m = members.find((x) => x.id === id);
    onEvent("member.role", `${m?.email} → ${role.toLowerCase()}`);
  }

  function remove(id: string) {
    const index = members.findIndex((m) => m.id === id);
    if (index < 0) return;
    const member = members[index];
    setMembers((list) => list.filter((m) => m.id !== id));
    setRemoved({ member, index });
    onEvent("member.remove", member.email, true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRemoved(null), 4500);
  }

  function undo() {
    if (!removed) return;
    setMembers((list) => {
      const next = [...list];
      next.splice(removed.index, 0, removed.member);
      return next;
    });
    onEvent("member.restore", removed.member.email);
    setRemoved(null);
    if (timer.current) clearTimeout(timer.current);
  }

  return (
    <Panel className="p-6">
      <PanelHeader title="Team" note={`${members.length} members · 1 seat left on Pro`}>
        <button id="invite" type="button" className="shimmer relative flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-lime px-4 text-[13.5px] font-bold text-graphite shadow-[0_10px_24px_-10px_#c6f432]">
          <Icon name="plus" className="size-4" strokeWidth={2.6} /> Invite
        </button>
      </PanelHeader>

      <ul className="mt-5 grid gap-2">
        <AnimatePresence initial={false}>
          {members.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, filter: "blur(6px)", transition: { duration: 0.3 } }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              id={`member-${m.id}`}
              className="flex items-center gap-3.5 rounded-2xl border border-bone/[.07] bg-white/[.025] p-3 pr-2.5"
            >
              <span className="relative flex-none">
                <Avatar text={initials(m.name)} color={m.color} size={40} />
                {m.lastActive === "Online" && <i className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-graphite bg-lime" />}
              </span>
              <span className="min-w-0 flex-1">
                <b className="flex items-center gap-2 text-[14px] font-semibold">
                  {m.name}
                  {m.role === "Owner" && <span className="rounded-md bg-lime/12 px-1.5 py-px font-mono text-[10.5px] font-bold text-lime">OWNER</span>}
                </b>
                <span className="block truncate font-mono text-[12px] text-smoke">
                  {m.email} · {m.lastActive}
                </span>
              </span>
              {m.role === "Owner" ? (
                <span className="px-3 text-[13px] font-semibold text-smoke">Owner</span>
              ) : (
                <>
                  <Select id={`role-${m.id}`} label={`Role for ${m.name}`} size="sm" value={m.role} options={ROLES.map((r) => ({ value: r.value, note: r.note }))} onChange={(v) => setRole(m.id, v)} />
                  <button
                    id={`remove-${m.id}`}
                    type="button"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => remove(m.id)}
                    className="grid size-9 flex-none cursor-pointer place-items-center rounded-xl border border-transparent text-smoke transition-colors hover:border-coral/40 hover:bg-coral/10 hover:text-coral"
                  >
                    <Icon name="trash" className="size-4" />
                  </button>
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* undo toast */}
      <AnimatePresence>
        {removed && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 460, damping: 28 }}
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-bone/15 bg-[#151517]/95 py-2.5 pr-2.5 pl-4 shadow-[0_24px_50px_-16px_rgba(0,0,0,.9)] backdrop-blur-xl"
          >
            <span className="text-[13px] whitespace-nowrap">
              Removed <b className="font-semibold">{removed.member.name}</b>
            </span>
            <motion.span key={removed.member.id} className="absolute -bottom-px left-4 h-[2px] rounded-full bg-lime/70" initial={{ width: "calc(100% - 32px)" }} animate={{ width: 0 }} transition={{ duration: 4.5, ease: "linear" }} />
            <button id="undo" type="button" onClick={undo} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-lime px-3 py-1.5 text-[12.5px] font-bold text-graphite">
              <Icon name="undo" className="size-3.5" strokeWidth={2.4} /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
