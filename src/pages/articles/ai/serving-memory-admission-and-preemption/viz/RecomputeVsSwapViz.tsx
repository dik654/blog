import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * GPU pool 40 block과 CPU 교환 영역을 함께 그려 C를 멈추고 되살리는 두 경로를 비교한다.
 * 한 mechanism: 재계산은 KV를 버리고 이력 161 token을 GPU로 다시 계산하며, 교환은 KV byte를 CPU에 맡겼다 돌려받는다.
 * 어느 쪽이든 재개에는 10 + 1 = 11 block이 필요하다.
 */
type Owner = "A" | "B" | "C" | "free";
const POOL = 40;
const COLORS: Record<Owner, string> = {
  A: "border-[#2563eb] bg-[#2563eb] text-white",
  B: "border-[#7c3aed] bg-[#7c3aed] text-white",
  C: "border-[#ea580c] bg-[#ea580c] text-white",
  free: "border-border bg-background text-muted-foreground",
};

interface Scene {
  label: string;
  a: number;
  b: number;
  c: number;
  cpu: number;
  history: "kept" | "none";
  lane: "none" | "recompute" | "swap" | "both";
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "압박: 수요 3 > free 2", a: 15, b: 13, c: 10, cpu: 0, history: "none", lane: "none", note: "A·B·C가 다음 위치를 처리하려면 각각 block 하나가 더 필요합니다. 수요 3이 남은 2칸보다 큽니다." },
  { label: "C를 멈춤", a: 16, b: 14, c: 0, cpu: 0, history: "kept", lane: "none", note: "A와 B에 한 칸씩 준 뒤 가장 늦게 온 C를 멈춥니다. C의 10 block이 반환되어 free는 10입니다. C의 토큰 이력 161개는 남깁니다." },
  { label: "재계산 경로", a: 16, b: 14, c: 0, cpu: 0, history: "kept", lane: "recompute", note: "재계산은 C의 KV를 버립니다. 되살릴 때 이력 161 token을 GPU가 다시 처리하며, 근사 계산으로 6.44 ms가 듭니다." },
  { label: "교환 경로", a: 16, b: 14, c: 0, cpu: 10, history: "kept", lane: "swap", note: "교환은 C의 10 block, 20 MiB를 CPU 메모리로 내보냅니다. GPU 칸은 똑같이 10개가 비지만 계산한 KV는 CPU에 남아 있습니다." },
  { label: "재개는 11칸부터", a: 16, b: 14, c: 0, cpu: 10, history: "kept", lane: "none", note: "어느 경로든 다음 161번째 위치를 위한 칸이 하나 더 필요해 11 block을 받아야 합니다. free 10으로는 재개할 수 없습니다." },
  { label: "A 종료 → C 재개", a: 0, b: 14, c: 11, cpu: 0, history: "kept", lane: "both", note: "A가 16 block을 반환하면 free는 26입니다. C가 11칸을 받아도 15칸이 남아 하한 3을 지킵니다. 이때 재계산은 6.44 ms의 GPU 시간, 교환은 40 MiB 왕복 1.678 ms의 전송 시간을 씁니다." },
];

function poolOwners(s: Scene): Owner[] {
  return [...Array(s.a).fill("A"), ...Array(s.b).fill("B"), ...Array(s.c).fill("C"), ...Array(POOL - s.a - s.b - s.c).fill("free")] as Owner[];
}

const MS_AXIS = 8;

export default function RecomputeVsSwapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const owners = poolOwners(scene);
  const free = owners.filter((o) => o === "free").length;
  const showRecompute = scene.lane === "recompute" || scene.lane === "both";
  const showSwap = scene.lane === "swap" || scene.lane === "both";

  return (
    <VizFrame
      eyebrow="Recompute vs swap"
      title="버린 KV를 다시 계산할지, CPU에 맡겼다 돌려받을지"
      description="왼쪽은 GPU KV pool 40 block, 오른쪽은 CPU 교환 영역입니다. 아래 두 줄은 C를 되살릴 때 쓰는 GPU 계산 시간과 전송 시간입니다."
      note="block 수와 6.44 ms·1.678 ms는 8·9·17절의 설명용 가정과 근사입니다. 실측이 아니며 attention 길이 항과 전송 준비 비용은 빠져 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU pool과 CPU 교환 영역에서 C를 멈추고 되살리는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
            <div>
              <p className="mb-1 text-[11px] font-bold text-muted-foreground">GPU pool · free {free}</p>
              <div className="grid grid-cols-10 gap-1">
                {owners.map((o, i) => (
                  <motion.span
                    key={i}
                    layout={!reduced}
                    className={`flex h-6 items-center justify-center rounded-sm border text-[10px] font-bold ${COLORS[o]}`}
                    transition={{ duration: reduced ? 0 : 0.4 }}
                  >
                    {o === "free" ? "" : o}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-bold text-muted-foreground">CPU 교환 · {scene.cpu ? "20 MiB" : "비어 있음"}</p>
              <div className="grid grid-cols-5 gap-1 rounded-sm border border-dashed border-border p-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.span
                    key={`${scenes.active}-${i}`}
                    className={`h-6 rounded-sm border ${i < scene.cpu ? COLORS.C : "border-border/60 bg-background"}`}
                    initial={i < scene.cpu && scene.lane === "swap" && !reduced ? { opacity: 0, x: -24 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : i * 0.05, duration: 0.35 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 font-bold text-muted-foreground">C 토큰 이력</span>
            <span className={`h-4 flex-1 rounded-sm border ${scene.history === "kept" ? "border-[#ea580c] bg-[#ffedd5] dark:bg-[#7c2d12]/40" : "border-dashed border-border"}`} />
            <span className="w-[4.75rem] shrink-0 whitespace-nowrap text-right font-mono font-bold">{scene.history === "kept" ? "161 token" : "—"}</span>
          </div>

          <div className="mt-3 space-y-2">
            {[
              { key: "recompute", name: "재계산 · GPU", ms: 6.44, on: showRecompute, color: "bg-[#ea580c]" },
              { key: "swap", name: "교환 · PCIe", ms: 1.678, on: showSwap, color: "bg-[#0d9488]" },
            ].map((lane) => (
              <div key={lane.key} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0 font-bold">{lane.name}</span>
                <div className="relative h-5 flex-1 rounded-sm border border-border bg-muted/30">
                  <motion.span
                    className={`absolute inset-y-0 left-0 rounded-sm ${lane.color}`}
                    initial={false}
                    animate={{ width: lane.on ? `${(lane.ms / MS_AXIS) * 100}%` : "0%" }}
                    transition={{ duration: reduced ? 0 : 0.7 }}
                  />
                </div>
                <span className="w-[4.75rem] shrink-0 whitespace-nowrap text-right font-mono font-bold">{lane.on ? `${lane.ms} ms` : "—"}</span>
              </div>
            ))}
            <p className="pl-[6.5rem] whitespace-nowrap font-mono text-[10px] text-muted-foreground">0 ──────── {MS_AXIS} ms</p>
          </div>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
