import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 7절의 C 요청을 GPU 슬롯 2칸과 CPU 등록 목록 위에서 따라간다.
 * 한 mechanism: step 종류 한도 → 파일 읽기·검증 → CPU 등록(한도 초과 시 가장 오래된 것 삭제) → GPU 슬롯 LRU 내리기 → 복사.
 */
type QState = "in" | "skip" | "wait";
type CpuState = "keep" | "new" | "drop";

interface Scene {
  label: string;
  step: number;
  queue: readonly { id: string; state: QState }[];
  file: { id: string; text: string } | null;
  gpu: readonly { id: string; last: number; fresh?: boolean; out?: string }[];
  cpu: readonly { id: string; state: CpuState }[];
  cpuLimit: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "step 5 · C는 다음으로",
    step: 5,
    queue: [{ id: "A", state: "in" }, { id: "B", state: "in" }, { id: "C", state: "skip" }],
    file: null,
    gpu: [{ id: "A", last: 5 }, { id: "B", last: 5 }],
    cpu: [{ id: "A", state: "keep" }, { id: "B", state: "keep" }],
    cpuLimit: 2,
    note: "이번 step에 A와 B 요청이 이미 들어가 adapter 종류가 한도 2에 닿았습니다. 처음 보는 C 요청은 건너뛰고 다음 step을 기다립니다.",
  },
  {
    label: "step 6 · C 파일 읽기",
    step: 6,
    queue: [{ id: "B", state: "in" }, { id: "C", state: "in" }],
    file: { id: "C", text: "파일 읽기 · 검증 ✓" },
    gpu: [{ id: "A", last: 5 }, { id: "B", last: 6 }],
    cpu: [{ id: "A", state: "keep" }, { id: "B", state: "keep" }],
    cpuLimit: 2,
    note: "step 6에는 B와 C 두 종류라 C가 들어갑니다. worker가 C 파일을 먼저 읽고 검증합니다. 이 단계가 실패하면 기존 등록은 하나도 지우지 않습니다.",
  },
  {
    label: "CPU 등록 · 첫 내리기",
    step: 6,
    queue: [{ id: "B", state: "in" }, { id: "C", state: "in" }],
    file: { id: "C", text: "CPU에 등록" },
    gpu: [{ id: "A", last: 5 }, { id: "B", last: 6 }],
    cpu: [{ id: "A", state: "drop" }, { id: "B", state: "keep" }, { id: "C", state: "new" }],
    cpuLimit: 2,
    note: "읽기가 성공한 뒤에야 C를 CPU에 등록합니다. 등록이 3개가 되어 한도 2를 넘으므로 가장 오래 안 쓴 A의 CPU 등록을 지웁니다.",
  },
  {
    label: "GPU 슬롯 · 둘째 내리기",
    step: 6,
    queue: [{ id: "B", state: "in" }, { id: "C", state: "in" }],
    file: null,
    gpu: [{ id: "C", last: 6, fresh: true, out: "A" }, { id: "B", last: 6 }],
    cpu: [{ id: "B", state: "keep" }, { id: "C", state: "keep" }],
    cpuLimit: 2,
    note: "GPU 슬롯 2칸도 차 있습니다. 마지막 사용이 step 5로 더 오래된 A를 슬롯에서 내리고 그 26 MiB 자리에 C를 복사합니다. 두 번의 내리기가 서로 다른 cache에서 일어났습니다.",
  },
  {
    label: "CPU 한도 3이면",
    step: 8,
    queue: [{ id: "A", state: "in" }, { id: "B", state: "in" }],
    file: { id: "A", text: "파일 읽기 없음 · CPU에서 복사" },
    gpu: [{ id: "A", last: 8, fresh: true, out: "C" }, { id: "B", last: 8 }],
    cpu: [{ id: "A", state: "keep" }, { id: "B", state: "keep" }, { id: "C", state: "keep" }],
    cpuLimit: 3,
    note: "(가정) max_cpu_loras=3이었다면 A의 CPU 등록이 남습니다. step 8에 A가 다시 오면 마지막 사용이 오래된 C를 슬롯에서 내리고 A를 파일 읽기 없이 CPU에서 복사만 합니다.",
  },
];

const COLOR: Record<string, string> = { A: "#2563eb", B: "#d97706", C: "#16a34a" };

function Chip({ id, dim, strike }: { id: string; dim?: boolean; strike?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-black text-white ${dim ? "opacity-35" : ""} ${strike ? "line-through" : ""}`}
      style={{ backgroundColor: COLOR[id] }}
    >
      {id}
    </span>
  );
}

export default function TwoTierAdapterCacheViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const t = (d: number) => ({ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : d });

  return (
    <VizFrame
      eyebrow="Two-tier adapter cache"
      title="처음 보는 adapter는 파일 → CPU 등록 → GPU 슬롯 순서로 들어갑니다"
      description="위에서 아래로 이번 step의 요청, GPU 슬롯 2칸(max_loras=2), CPU 등록 목록입니다. 슬롯 아래 숫자는 마지막으로 쓴 step입니다."
      note="7절의 가정을 따릅니다. 처음 네 장면은 max_cpu_loras를 비워 GPU와 같은 2로 둔 경우이고, 마지막 장면만 3으로 바꾼 비교입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="adapter C가 GPU 슬롯에 들어가는 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs text-muted-foreground">step {scene.step}</span>
          </div>

          <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-4 text-xs">
            <span className="font-bold text-muted-foreground">이번 step</span>
            <div className="flex min-h-[3.7rem] flex-wrap content-start items-center gap-2 sm:min-h-0">
              {scene.queue.map((q, i) => (
                <motion.span key={q.id + i} className="flex items-center gap-1" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={t(i * 0.12)}>
                  <Chip id={q.id} dim={q.state === "skip"} />
                  {q.state === "skip" ? <span className="font-bold text-[#dc2626]">대기</span> : null}
                </motion.span>
              ))}
              <span className="ml-auto font-mono text-muted-foreground">
                종류 {Math.min(2, new Set(scene.queue.filter((q) => q.state === "in").map((q) => q.id)).size)} / 2
              </span>
            </div>

            <span className="font-bold text-muted-foreground">파일</span>
            <div className="flex h-7 items-center gap-2">
              {scene.file ? (
                <motion.span className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.3)}>
                  <Chip id={scene.file.id} />
                  <span className="font-bold text-foreground">{scene.file.text}</span>
                </motion.span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>

            <span className="font-bold text-muted-foreground">GPU 슬롯</span>
            <div className="grid grid-cols-2 gap-2">
              {scene.gpu.map((g, i) => (
                <div key={i} className={`relative flex items-center gap-2 rounded-md border px-2 py-2 ${g.fresh ? "border-[#16a34a]" : "border-border"}`}>
                  {g.out ? (
                    <motion.span className="absolute -top-2 right-2 rounded-sm bg-background px-1 text-[10px] font-bold text-[#dc2626]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.2)}>
                      {g.out} 내림
                    </motion.span>
                  ) : null}
                  <motion.span initial={g.fresh ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
                    <Chip id={g.id} />
                  </motion.span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    26 MiB
                    <br />
                    last {g.last}
                  </span>
                </div>
              ))}
            </div>

            <span className="font-bold text-muted-foreground">CPU 등록</span>
            <div className="flex min-h-[3.7rem] flex-wrap content-start items-center gap-2 sm:min-h-0">
              {scene.cpu.map((c) => (
                <motion.span key={c.id} className="flex items-center gap-1" initial={c.state === "new" ? { opacity: 0, y: -8 } : false} animate={{ opacity: c.state === "drop" ? 0.35 : 1, y: 0 }} transition={t(c.state === "drop" ? 0.7 : 0.3)}>
                  <Chip id={c.id} strike={c.state === "drop"} />
                  {c.state === "drop" ? <span className="font-bold text-[#dc2626]">삭제</span> : null}
                </motion.span>
              ))}
              <span className="ml-auto font-mono text-muted-foreground">
                {scene.cpu.filter((c) => c.state !== "drop").length} / 한도 {scene.cpuLimit}
              </span>
            </div>
          </div>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
