import { SettingsPanel } from "@/components/settings";
import { PulseFinale } from "@/components/settings/pulse-finale";


export default function Home() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-graphite py-10">
      {/* backdrop the glass panels blur */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgb(242_240_233/.035)_1px,transparent_1px),linear-gradient(90deg,rgb(242_240_233/.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask:radial-gradient(ellipse_at_50%_40%,#000_35%,transparent_80%)]" />
        <i className="absolute -top-40 -left-24 size-[560px] rounded-full bg-lime opacity-[.2] blur-[120px] [animation:drift-a_12s_ease-in-out_infinite_alternate]" />
        <i className="absolute top-1/3 left-1/2 size-[420px] rounded-full bg-[#5f8f14] opacity-25 blur-[120px] [animation:drift-c_14s_ease-in-out_infinite_alternate]" />
        <i className="absolute -right-24 -bottom-40 size-[520px] rounded-full bg-coral opacity-20 blur-[120px] [animation:drift-b_13s_ease-in-out_infinite_alternate]" />
      </div>
      <SettingsPanel />
      <PulseFinale />
    </div>
  );
}
