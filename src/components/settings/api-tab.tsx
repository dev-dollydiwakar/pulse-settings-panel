"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { API_KEYS, newSecret, type ApiKey } from "./data";
import { Icon, Spinner } from "./icons";
import { ease, Panel, PanelHeader } from "./ui";

type Confirming = { id: string } | null;

function mask(prefix: string) {
  return `${prefix}••••••••••••••••••••`;
}

/** API keys: generate (secret shown once), reveal, copy, revoke with inline confirm. */
export function ApiTab({ onEvent }: { onEvent: (name: string, detail: string, extra?: { ms?: number; error?: boolean }) => void }) {
  const [keys, setKeys] = useState<ApiKey[]>(API_KEYS);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Confirming>(null);
  const [generating, setGenerating] = useState(false);

  function generate() {
    if (generating) return;
    setGenerating(true);
    const start = performance.now();
    setTimeout(() => {
      const key: ApiKey = { id: `k${Date.now()}`, name: "Development", prefix: "sk_dev_", secret: newSecret("sk_dev_"), created: "Just now", lastUsed: "Never" };
      setKeys((list) => [key, ...list]);
      setRevealed(key.id);
      setGenerating(false);
      onEvent("key.generate", `${key.prefix}… (shown once)`, { ms: performance.now() - start });
    }, 850);
  }

  async function copy(key: ApiKey) {
    const value = key.secret ?? mask(key.prefix);
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard blocked (e.g. permissions): the visual feedback still plays for the demo */
    }
    setCopied(key.id);
    onEvent("key.copy", `${key.prefix}…`);
    setTimeout(() => setCopied((c) => (c === key.id ? null : c)), 1500);
  }

  function revoke(id: string) {
    const key = keys.find((k) => k.id === id);
    setKeys((list) => list.filter((k) => k.id !== id));
    setConfirming(null);
    onEvent("key.revoke", `${key?.name.toLowerCase()} revoked`, { error: true });
  }

  return (
    <Panel className="p-6">
      <PanelHeader title="API keys" note="Authenticate requests to the Pulse API.">
        <button
          id="generate-key"
          type="button"
          onClick={generate}
          className="shimmer relative flex h-10 w-[150px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-lime text-[13.5px] font-bold text-graphite shadow-[0_10px_24px_-10px_#c6f432]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {generating ? (
              <motion.span key="g" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                <Spinner className="size-3.5" /> Generating
              </motion.span>
            ) : (
              <motion.span key="i" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                <Icon name="plus" className="size-4" strokeWidth={2.6} /> New key
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PanelHeader>

      <ul className="mt-5 grid gap-2">
        <AnimatePresence initial={false}>
          {keys.map((k) => {
            const isNew = !!k.secret;
            const shown = revealed === k.id && isNew;
            return (
              <motion.li
                key={k.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, filter: "blur(6px)", transition: { duration: 0.3 } }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                id={`key-${k.id}`}
                className={`rounded-2xl border p-3.5 ${isNew ? "border-lime/30 bg-lime/[.05]" : "border-bone/[.07] bg-white/[.025]"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-9 flex-none place-items-center rounded-xl ${isNew ? "bg-lime text-graphite" : "bg-lime/10 text-lime"}`}>
                    <Icon name="key" className="size-4" />
                  </span>
                  <b className="text-[14px] font-semibold">{k.name}</b>
                  {isNew && <span className="rounded-md bg-lime/15 px-1.5 py-px font-mono text-[10.5px] font-bold text-lime">COPY IT NOW · SHOWN ONCE</span>}
                  <span className="ml-auto font-mono text-[11.5px] text-smoke">
                    {k.created} · last used {k.lastUsed}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <code className="flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-bone/10 bg-graphite/60 px-3 font-mono text-[12.5px] whitespace-nowrap text-bone/90">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={String(shown)} className="truncate" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                        {shown ? k.secret : mask(k.prefix)}
                      </motion.span>
                    </AnimatePresence>
                  </code>
                  {isNew && (
                    <button id={`reveal-${k.id}`} type="button" aria-label={shown ? "Hide key" : "Reveal key"} onClick={() => setRevealed(shown ? null : k.id)} className="grid size-10 flex-none cursor-pointer place-items-center rounded-xl border border-bone/10 text-smoke transition-colors hover:border-bone/25 hover:text-bone">
                      <Icon name={shown ? "eyeOff" : "eye"} className="size-[17px]" />
                    </button>
                  )}
                  <button
                    id={`copy-${k.id}`}
                    type="button"
                    onClick={() => copy(k)}
                    className={`flex h-10 w-[96px] flex-none cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-[13px] font-semibold transition-colors ${copied === k.id ? "border-lime/50 bg-lime/12 text-lime" : "border-bone/10 text-bone hover:border-lime/40"}`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied === k.id ? (
                        <motion.span key="c" className="flex items-center gap-1.5" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease }} />
                          </svg>
                          Copied
                        </motion.span>
                      ) : (
                        <motion.span key="i" className="flex items-center gap-1.5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                          <Icon name="copy" className="size-4" /> Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* revoke with inline confirm */}
                  <div className="relative flex-none">
                    <button
                      id={`revoke-${k.id}`}
                      type="button"
                      onClick={() => setConfirming(confirming?.id === k.id ? null : { id: k.id })}
                      className={`flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-colors ${confirming?.id === k.id ? "border-coral/60 bg-coral/12 text-coral" : "border-bone/10 text-smoke hover:border-coral/40 hover:text-coral"}`}
                    >
                      <Icon name="trash" className="size-4" /> Revoke
                    </button>
                    <AnimatePresence>
                      {confirming?.id === k.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 480, damping: 30 }}
                          className="absolute right-0 bottom-[calc(100%+8px)] z-30 w-[240px] origin-bottom-right rounded-2xl border border-coral/30 bg-[#151517]/95 p-3.5 shadow-[0_24px_50px_-16px_rgba(0,0,0,.9)] backdrop-blur-xl"
                        >
                          <p className="flex items-start gap-2 text-[12.5px] leading-snug text-bone/90">
                            <span className="mt-px text-coral">
                              <Icon name="alert" className="size-4" />
                            </span>
                            Requests with this key will fail immediately. This can&apos;t be undone.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => setConfirming(null)} className="h-9 flex-1 cursor-pointer rounded-lg border border-bone/15 text-[12.5px] font-semibold text-bone">
                              Cancel
                            </button>
                            <button id={`confirm-revoke-${k.id}`} type="button" onClick={() => revoke(k.id)} className="h-9 flex-1 cursor-pointer rounded-lg bg-coral text-[12.5px] font-bold text-graphite">
                              Revoke key
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <p className="mt-4 flex items-center gap-2 text-[12px] text-smoke">
        <Icon name="shield" className="size-3.5" />
        Secrets are hashed at rest. A key is shown once, right after it&apos;s generated.
      </p>
    </Panel>
  );
}
