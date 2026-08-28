import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: query 행 하나가 K/V tile 을 차례로 만나며 running max·normalizer 를
 * 고치는 동안 HBM 에는 무엇이 오가는지. 점수 행 [1, 3, 2, 5] 를 tile 두 개로 나눈다.
 * stage 높이는 네 장면의 최대 필요 크기로 고정하고 control row 는 아래 고정 row 에 둔다.
 */
const SCENES = ["Q block 상주", "tile 1 · s=[1, 3]", "tile 2 · max 갱신", "O/ℓ 만 기록"] as const;

type HbmCell = { id: string; label: string };
const HBM_CELLS: readonly HbmCell[] = [
  { id: "Q", label: "Q" },
  { id: "K1", label: "K₁" },
  { id: "V1", label: "V₁" },
  { id: "K2", label: "K₂" },
  { id: "V2", label: "V₂" },
  { id: "O", label: "O" },
  { id: "L", label: "L" },
];

type SceneState = {
  reads: readonly string[];
  writes: readonly string[];
  resident: readonly string[];
  tile: string;
  score: string;
  max: string;
  scale: string;
  norm: string;
  acc: string;
  changed: readonly string[];
  transfers: string;
};

const STATES: readonly SceneState[] = [
  {
    reads: ["Q"],
    writes: [],
    resident: ["Q"],
    tile: "없음",
    score: "—",
    max: "−∞",
    scale: "—",
    norm: "0",
    acc: "0",
    changed: [],
    transfers: "읽기 1 · 쓰기 0",
  },
  {
    reads: ["K1", "V1"],
    writes: [],
    resident: ["Q"],
    tile: "K₁ V₁",
    score: "[1, 3]",
    max: "3",
    scale: "× 1 (첫 tile)",
    norm: "e⁻² + e⁰ = 1.135",
    acc: "0.135·v₁ + 1·v₂",
    changed: ["tile", "score", "max", "norm", "acc"],
    transfers: "읽기 3 · 쓰기 0",
  },
  {
    reads: ["K2", "V2"],
    writes: [],
    resident: ["Q"],
    tile: "K₂ V₂",
    score: "[2, 5]",
    max: "3 → 5",
    scale: "× e³⁻⁵ = 0.135",
    norm: "0.135×1.135 + e⁻³ + e⁰ = 1.203",
    acc: "0.135·Õ + 0.050·v₃ + 1·v₄",
    changed: ["tile", "score", "max", "scale", "norm", "acc"],
    transfers: "읽기 5 · 쓰기 0",
  },
  {
    reads: [],
    writes: ["O", "L"],
    resident: ["Q"],
    tile: "없음",
    score: "버림",
    max: "5",
    scale: "—",
    norm: "1.203",
    acc: "Õ / 1.203 → O",
    changed: ["acc"],
    transfers: "읽기 5 · 쓰기 2",
  },
];

const NOTES = [
  "Thread block 이 자기 Q block 을 SRAM 에 올리고 running max m=−∞, normalizer ℓ=0, 출력 누적 Õ=0 으로 시작합니다.",
  "첫 K/V tile 을 읽어 점수 [1, 3] 을 SRAM 안에서 만들고 m=3, ℓ=1.135 로 씁니다. 점수 tile 은 여기서 소비되고 HBM 에 가지 않습니다.",
  "둘째 tile 의 최댓값 5 가 더 크므로 이전 ℓ 과 Õ 에 e³⁻⁵=0.135 를 곱해 기준점을 옮긴 뒤 새 항을 더합니다. 행 전체로 계산한 1.203 과 같습니다.",
  "모든 tile 이 끝나면 Õ 를 ℓ 로 나눈 O 와 logsumexp L 만 HBM 에 씁니다. 표준 구현이 쓰고 읽던 S, P 왕복 네 번이 사라졌습니다.",
] as const;

const SRAM_ROWS: readonly { key: keyof SceneState; label: string }[] = [
  { key: "tile", label: "현재 K/V tile" },
  { key: "score", label: "S tile = q·Kᵀ" },
  { key: "max", label: "running max m" },
  { key: "scale", label: "보정 계수" },
  { key: "norm", label: "running normalizer ℓ" },
  { key: "acc", label: "출력 누적 Õ" },
];

export default function FlashAttentionIoAwareKernelViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const state = STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="Tiled attention · online softmax"
      title="K/V tile 이 SRAM 을 지나가는 동안 m 과 ℓ 만 고쳐 쓰고 S 는 HBM 에 남기지 않습니다"
      description="Query 행 하나가 점수 [1, 3, 2, 5] 를 tile 두 개로 나눠 읽는 장면입니다. 왼쪽은 HBM 에서 오가는 block, 오른쪽은 SRAM 에 머무는 상태입니다."
      note="실제 kernel 은 B_r 행을 한꺼번에 처리하고 v 는 d 차원 벡터입니다. 그림은 한 행과 기호 v 로 줄였고, 수치는 소수 셋째 자리에서 반올림했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="FlashAttention tile 과 online softmax 상태 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(36rem,calc(100dvh-15rem))] min-h-[28rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.7fr]">
            <div className="min-w-0 border border-border p-3">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-bold text-muted-foreground">HBM · off-chip</p>
                <p className="font-mono text-[10px] text-muted-foreground">{state.transfers}</p>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5 md:grid-cols-2">
                {HBM_CELLS.map((cell) => {
                  const reading = state.reads.includes(cell.id);
                  const writing = state.writes.includes(cell.id);
                  const resident = state.resident.includes(cell.id);
                  const pending = (cell.id === "O" || cell.id === "L") && !writing;
                  return (
                    <div
                      key={cell.id}
                      className={`flex min-h-10 items-center justify-between border px-2 font-mono text-xs ${
                        reading || writing
                          ? "border-primary bg-primary/10 text-foreground"
                          : resident
                            ? "border-primary/40 text-foreground"
                            : pending
                              ? "border-dashed border-border text-muted-foreground"
                              : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="font-bold">{cell.label}</span>
                      <span className="text-[10px]">
                        {reading ? "→ SRAM" : writing ? "← SRAM" : resident ? "복사됨" : pending ? "비어 있음" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 border-t border-dashed border-border pt-2 font-mono text-[10px] text-muted-foreground">
                S (N×N), P (N×N): 없음
              </p>
            </div>
            <div className="min-w-0 border border-primary/50 p-3">
              <p className="text-[11px] font-bold text-primary">SRAM · on-chip</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex min-h-8 items-center justify-between gap-3 border border-primary/40 px-2 text-xs">
                  <span className="text-muted-foreground">Q block (상주)</span>
                  <span className="font-mono">q</span>
                </div>
                {SRAM_ROWS.map((row) => {
                  const changed = state.changed.includes(row.key);
                  return (
                    <div
                      key={row.key}
                      className={`flex min-h-8 items-center justify-between gap-3 border px-2 text-xs ${
                        changed ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="shrink-0">{row.label}</span>
                      <span className="truncate font-mono text-right">{state[row.key] as string}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
