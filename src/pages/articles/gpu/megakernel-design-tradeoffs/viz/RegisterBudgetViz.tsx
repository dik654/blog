import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resource-sharing — register 예산이 task 별 최대값으로 고정되고(128),
 * 그 값이 SM register file 65,536 을 warp 몇 개로 자르는지(16 vs 51), 이어 붙이면 합이 되는지(288 > 255).
 * 4,096 = 128×32, 1,280 = 40×32, 65,536÷4,096 = 16, 65,536÷1,280 = 51.2 → 51.
 */
const SCENES = [
  { label: "task 별 요구", summary: "max(128, 96, 40) = 128", note: "Task 가 switch 로 갈라져 live range 가 겹치지 않으면 kernel 의 register 수는 요구의 최대값입니다. 점선은 쓰지 않아도 잡아 두는 몫으로, norm task 도 thread 당 128 을 잡습니다." },
  { label: "128 로 자르면", summary: "65,536 ÷ 4,096 = warp 16", note: "Occupancy 는 SM 에 동시에 올라갈 수 있는 warp 수입니다. Warp 는 thread 32개이므로 thread 당 128 이면 warp 당 4,096 이고, 긴 막대인 register file 65,536 에 16개가 들어갑니다." },
  { label: "40 으로 자르면", summary: "65,536 ÷ 1,280 ≈ warp 51", note: "Norm task 만 따로 돌면 warp 당 1,280 이라 51개까지 올라갑니다(남는 register 256). 같은 kernel 안에서는 위쪽 16개로 도는 것이 cross-operator register pressure 입니다." },
  { label: "이어 붙이면 합", summary: "96 + 64 + 128 = 288 > 255", note: "Task 로 나누지 않고 한 task 에 이어 붙이면 앞 operator 의 결과가 register 에 살아 있어 최대값이 아니라 합이 됩니다. 160 까지는 상한 안이지만 셋째 stage 에서 33 만큼 넘쳐 spill 이 납니다." },
] as const;

const NEEDS = [
  { name: "GEMM", need: 128, color: "#2563eb" },
  { name: "attention", need: 96, color: "#7c3aed" },
  { name: "norm", need: 40, color: "#059669" },
] as const;

const STAGES = [
  { label: "96", need: 96, color: "#7c3aed" },
  { label: "64", need: 64, color: "#0891b2" },
  { label: "128", need: 128, color: "#2563eb" },
] as const;

const AXIS = 300;
const LIMIT = 255;
const FILE = 65536;

function Strip({ label, unit, count, color, dim }: { label: string; unit: number; count: number; color: string; dim?: boolean }) {
  return (
    <div className={dim ? "opacity-40" : ""}>
      <p className="mb-1 text-xs font-semibold">{label}</p>
      <div className="flex h-8 overflow-hidden rounded-sm border border-border">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="h-full border-r border-background" style={{ width: `${(unit / FILE) * 100}%`, backgroundColor: `${color}55` }} />
        ))}
      </div>
    </div>
  );
}

export default function RegisterBudgetViz() {
  const stageStarts = STAGES.map((_, index) => STAGES.slice(0, index).reduce<number>((sum, stage) => sum + stage.need, 0));
  return (
    <SceneShell
      eyebrow="Register 예산"
      title="가장 무거운 task 가 모든 task 의 register 예산이 됩니다"
      description="128·96·40·64 는 이 글이 계산을 보여 주려고 둔 가정값이고, 65,536 은 SM 의 register file 크기입니다."
      ariaLabel="task 별 register 요구와 kernel 최대값, register file 을 warp 로 나누는 칸, 한 task 에 이어 붙였을 때의 합"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <div key="needs" className="space-y-3">
              {NEEDS.map((row) => (
                <div key={row.name} className="grid grid-cols-[4.25rem_minmax(0,1fr)_2rem] items-center gap-2 text-xs">
                  <span className="font-semibold">{row.name}</span>
                  <div className="relative h-6 rounded-sm border border-dashed border-border" style={{ width: "100%" }}>
                    <div className="h-full rounded-sm" style={{ width: `${(row.need / 128) * 100}%`, backgroundColor: `${row.color}55` }} />
                  </div>
                  <span className="text-right font-mono">{row.need}</span>
                </div>
              ))}
              <p className="text-xs leading-5 text-muted-foreground">점선 칸 전체 = kernel 이 thread 마다 잡는 128</p>
            </div>,
            <div key="w128" className="space-y-3">
              <Strip label="thread 당 128 → warp 16개" unit={4096} count={16} color="#2563eb" />
              <Strip label="thread 당 40" unit={1280} count={51} color="#059669" dim />
            </div>,
            <div key="w40" className="space-y-3">
              <Strip label="thread 당 128 → warp 16개" unit={4096} count={16} color="#2563eb" dim />
              <Strip label="thread 당 40 → warp 51개" unit={1280} count={51} color="#059669" />
            </div>,
            <div key="sum">
              <div className="relative h-8 rounded-sm bg-muted/40">
                {STAGES.map((stage, index) => (
                  <span
                    key={stage.label}
                    className="absolute inset-y-0 flex items-center justify-center border-r border-background font-mono text-xs font-bold"
                    style={{ left: `${(stageStarts[index] / AXIS) * 100}%`, width: `${(stage.need / AXIS) * 100}%`, backgroundColor: `${stage.color}40` }}
                  >
                    {stage.label}
                  </span>
                ))}
                <div className="absolute inset-y-0 border-y border-r border-dashed" style={{ left: `${(LIMIT / AXIS) * 100}%`, width: `${((288 - LIMIT) / AXIS) * 100}%`, borderColor: "#dc2626", backgroundColor: "#dc262633" }} />
                <div className="absolute -inset-y-1 w-px" style={{ left: `${(LIMIT / AXIS) * 100}%`, backgroundColor: "#dc2626" }} />
              </div>
              <div className="relative mt-2 h-5 text-xs">
                <span className="absolute font-mono" style={{ left: `${(160 / AXIS) * 100}%`, transform: "translateX(-50%)" }}>160</span>
                <span className="absolute whitespace-nowrap font-mono font-bold" style={{ left: `${(LIMIT / AXIS) * 100}%`, transform: "translateX(-50%)", color: "#dc2626" }}>상한 255</span>
              </div>
              <p className="mt-1 text-right font-mono text-xs font-bold">thread 당 합 288 · 초과 33</p>
            </div>,
          ]}
        />
      )}
    />
  );
}
