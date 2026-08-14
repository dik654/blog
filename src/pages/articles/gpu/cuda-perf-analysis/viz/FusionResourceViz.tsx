import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function FlowArrow({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 54 16" aria-hidden="true" className="h-4 w-10 shrink-0">
      <motion.path
        d="M2 8h44"
        fill="none"
        className="stroke-muted-foreground/60"
        strokeWidth="1.25"
        strokeDasharray="4 4"
        animate={active ? { strokeDashoffset: [8, 0] } : undefined}
        transition={active ? { duration: 0.8, repeat: Infinity, ease: "linear" } : undefined}
      />
      <path
        d="m40 3 7 5-7 5"
        fill="none"
        className="stroke-primary"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KernelNode({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <div
      className={`flex h-16 w-24 shrink-0 items-center justify-center border px-3 text-center font-mono text-xs font-black ${
        accent
          ? "border-primary bg-primary/[0.07] text-primary"
          : "border-border bg-background text-foreground"
      }`}
    >
      {label}
    </div>
  );
}

function MemoryNode({ label = "HBM" }: { label?: string }) {
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-1 text-center">
      <svg viewBox="0 0 64 52" role="img" aria-label={`${label} memory`} className="h-14 w-16">
        <title>{label}</title>
        <g fill="none" className="stroke-muted-foreground" strokeWidth="1.25">
          <path d="M8 13v27c0 5 11 9 24 9s24-4 24-9V13" />
          <ellipse cx="32" cy="13" rx="24" ry="9" />
          <path d="M8 27c0 5 11 9 24 9s24-4 24-9" />
        </g>
      </svg>
      <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

function UnfusedScene({ active }: { active: boolean }) {
  return (
    <div className="space-y-5">
      <div className="flex min-w-0 flex-col items-center justify-center gap-2 sm:flex-row sm:gap-1">
        <KernelNode label="Kernel A" />
        <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
        <MemoryNode />
        <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
        <KernelNode label="Kernel B" />
        <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
        <MemoryNode />
        <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
        <KernelNode label="Kernel C" />
      </div>
      <div className="grid grid-cols-2 gap-px border border-border bg-border text-center text-xs sm:grid-cols-4">
        {["launch 3회", "중간 write 2회", "중간 read 2회", "연산별 자원 독립"].map((item) => (
          <div key={item} className="bg-background px-3 py-3 font-semibold">{item}</div>
        ))}
      </div>
    </div>
  );
}

function SmallFusionScene({ active }: { active: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_13rem] lg:items-center">
      <div className="border border-primary/50 bg-primary/[0.025] p-5">
        <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.16em] text-primary">
          one fused kernel
        </p>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <KernelNode label="Bias" />
          <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
          <KernelNode label="Activation" accent />
          <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
          <KernelNode label="Multiply" />
        </div>
      </div>
      <dl className="divide-y divide-border border-y border-border text-xs">
        <div className="flex justify-between py-3"><dt>Launch</dt><dd className="font-bold text-primary">3 → 1</dd></div>
        <div className="flex justify-between py-3"><dt>중간 HBM</dt><dd className="font-bold text-primary">2 → 0</dd></div>
        <div className="flex justify-between py-3"><dt>Live state</dt><dd className="font-bold">작게 유지</dd></div>
      </dl>
    </div>
  );
}

const pressureRows = [
  ["Register live ranges", 92],
  ["Shared-memory budget", 78],
  ["Instruction footprint", 70],
  ["Resident warp budget", 24],
] as const;

function MegakernelScene({ active }: { active: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
      <div className="relative border border-amber-600/55 bg-amber-500/[0.025] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
          one large scheduling envelope
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["GEMM", "Softmax", "Top-K", "Sampling", "KV update", "Branch paths"].map((item, index) => (
            <motion.div
              key={item}
              className="flex h-16 items-center justify-center border border-border bg-background px-2 text-center text-xs font-bold"
              animate={active ? { opacity: [0.45, 1, 0.45] } : undefined}
              transition={{ duration: 1.2, delay: index * 0.08, repeat: active ? Infinity : 0 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {pressureRows.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono font-bold">{value}%</span>
            </div>
            <div className="h-2 border border-border bg-background">
              <motion.div
                className={value < 40 ? "h-full bg-amber-600/70" : "h-full bg-primary/70"}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-1 border-t border-border pt-4 text-[10px] font-bold text-amber-700 dark:text-amber-300">
          <span>register</span><FlowArrow active={active} /><span>local address</span><FlowArrow active={active} /><span>L2 / device memory</span>
        </div>
      </div>
    </div>
  );
}

function FlashAttentionScene({ active }: { active: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[9rem_1fr_9rem] lg:items-center">
      <MemoryNode label="HBM · Q/K/V" />
      <div className="border border-primary/55 bg-primary/[0.025] p-5">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <KernelNode label="QKᵀ tile" />
          <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
          <KernelNode label="Online softmax" accent />
          <span className="rotate-90 sm:rotate-0"><FlowArrow active={active} /></span>
          <KernelNode label="× V tile" />
        </div>
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          SRAM/register에 맞는 tile만 유지하고 전체 N×N attention matrix는 HBM에 materialize하지 않습니다.
        </p>
      </div>
      <MemoryNode label="HBM · output" />
    </div>
  );
}

function PersistentScene({ active }: { active: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[13rem_1fr] lg:items-center">
      <div className="border-y border-border py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">work queue</p>
        <div className="mt-3 space-y-2">
          {["task A", "task B", "task C", "stop token"].map((task, index) => (
            <motion.div
              key={task}
              className="border border-border bg-background px-3 py-2 font-mono text-xs"
              animate={active ? { x: [0, 5, 0] } : undefined}
              transition={{ duration: 1, delay: index * 0.15, repeat: active ? Infinity : 0 }}
            >
              {task}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="border border-primary/55 bg-primary/[0.025] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">long-lived kernel</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["dequeue", "execute", "publish", "repeat"].map((step) => (
            <div key={step} className="flex h-16 items-center justify-center border border-border bg-background px-2 text-center text-xs font-bold">
              {step}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Launch를 줄이는 대신 queue contention, fairness, 종료 protocol, 고정 residency와 다른 kernel의 scheduling을 새로 책임집니다.
        </p>
      </div>
    </div>
  );
}

const scenes = [
  { title: "여러 kernel", subtitle: "중간값이 HBM을 왕복", render: UnfusedScene },
  { title: "작은 fusion", subtitle: "낮은 pressure로 왕복 제거", render: SmallFusionScene },
  { title: "Megakernel", subtitle: "합친 자원 비용이 커짐", render: MegakernelScene },
  { title: "FlashAttention", subtitle: "Tile 안에서 fusion 경계 선택", render: FlashAttentionScene },
  { title: "Persistent", subtitle: "살아 있는 worker가 queue 소비", render: PersistentScene },
] as const;

export function FusionMegakernelViz() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const timer = window.setTimeout(() => {
      setScene((current) => {
        if (current === scenes.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [playing, reduceMotion, scene]);

  const Scene = scenes[scene].render;

  return (
    <figure data-viz="kernel-fusion-megakernel" className="not-prose my-9 overflow-hidden border-y border-border bg-background">
      <figcaption className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold text-primary">Fusion boundary animation</p>
          <p className="mt-1 text-base font-bold">Launch를 합칠수록 사라지는 비용과 새로 생기는 비용</p>
        </div>
        <button
          type="button"
          disabled={Boolean(reduceMotion)}
          onClick={() => {
            if (!playing && scene === scenes.length - 1) setScene(0);
            setPlaying((current) => !current);
          }}
          className="border border-primary/50 px-3 py-2 text-xs font-bold text-primary disabled:opacity-50"
        >
          {reduceMotion ? "모션 줄이기 적용" : playing ? "일시정지" : "흐름 재생"}
        </button>
      </figcaption>

      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-5" role="tablist" aria-label="Fusion 흐름 장면">
        {scenes.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={scene === index}
            onClick={() => { setPlaying(false); setScene(index); }}
            className={`min-w-0 border-b border-r border-border px-3 py-3 text-left last:border-r-0 sm:border-b-0 ${scene === index ? "bg-primary/[0.06]" : "bg-background"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <span className="mt-1 block break-words text-xs font-bold">{item.title}</span>
            <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{item.subtitle}</span>
          </button>
        ))}
      </div>

      <div data-viz-canvas className="min-w-0 p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scenes[scene].title}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Scene active={playing} />
          </motion.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}

const registerChoices = [32, 64, 128, 255] as const;

export function RegisterResidencyViz() {
  const [registers, setRegisters] = useState<(typeof registerChoices)[number]>(64);
  const maxWarps = 64;
  const residentWarps = Math.min(maxWarps, Math.floor(65_536 / (32 * registers)));
  const residentThreads = residentWarps * 32;

  return (
    <figure data-viz="register-residency" className="not-prose my-9 overflow-hidden border-y border-border bg-background">
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">CC 7.0 simplified register bound</p>
        <p className="mt-1 text-base font-bold">Thread당 register가 늘면 spill 전에도 resident warp가 줄어든다</p>
      </figcaption>
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[15rem_1fr]">
        <div>
          <p className="text-xs font-bold text-muted-foreground">Thread당 32-bit registers</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {registerChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setRegisters(choice)}
                className={`border px-3 py-3 font-mono text-sm font-black ${choice === registers ? "border-primary bg-primary/[0.06] text-primary" : "border-border bg-background"}`}
              >
                {choice}
              </button>
            ))}
          </div>
          <dl className="mt-5 divide-y divide-border border-y border-border text-xs">
            <div className="flex justify-between py-3"><dt>Register-file bound</dt><dd className="font-bold">{residentThreads} threads</dd></div>
            <div className="flex justify-between py-3"><dt>Resident warp upper bound</dt><dd className="font-bold text-primary">{residentWarps} / 64</dd></div>
            <div className="flex justify-between py-3"><dt>단순 occupancy</dt><dd className="font-bold">{Math.round((residentWarps / maxWarps) * 100)}%</dd></div>
          </dl>
        </div>

        <div className="min-w-0">
          <div className="grid grid-cols-8 gap-1 sm:grid-cols-16" aria-label={`${residentWarps}개 resident warp와 ${maxWarps - residentWarps}개 비어 있는 warp slot`}>
            {Array.from({ length: maxWarps }, (_, index) => (
              <motion.span
                key={index}
                className={`aspect-square border ${index < residentWarps ? "border-primary/60 bg-primary/45" : "border-border bg-muted/20"}`}
                animate={{ opacity: index < residentWarps ? 1 : 0.35 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-[7rem_auto_8rem_auto_9rem] sm:items-center sm:justify-center">
            <KernelNode label="live values" />
            <span className="rotate-90 justify-self-center sm:rotate-0"><FlowArrow /></span>
            <KernelNode label="local address" accent />
            <span className="rotate-90 justify-self-center sm:rotate-0"><FlowArrow /></span>
            <MemoryNode label="L2 / device memory" />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            위 계산은 register file만 본 upper bound입니다. 실제 residency는 block 크기, register allocation granularity, shared memory와 architecture limit의 최소값입니다. 255는 여러 최신 NVIDIA architecture 표에서 보이는 thread당 최대치이지 kernel 전체 한도가 아닙니다.
          </p>
        </div>
      </div>
    </figure>
  );
}
