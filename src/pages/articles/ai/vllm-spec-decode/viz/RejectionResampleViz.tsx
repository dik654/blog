import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Draft K=4 제안",
  "Target 한 pass 검증",
  "Rejection point 판정",
  "Residual에서 resample",
  "Prefix commit",
] as const;

type CellState = "empty" | "draft" | "scored" | "accept" | "reject" | "drop" | "resample" | "commit";

/** 위치 1..4는 draft 후보, 위치 5는 전부 수락됐을 때만 쓰는 bonus 자리입니다. */
const CELLS: readonly (readonly CellState[])[] = [
  ["draft", "draft", "draft", "draft", "empty"],
  ["scored", "scored", "scored", "scored", "scored"],
  ["accept", "accept", "reject", "drop", "drop"],
  ["accept", "accept", "resample", "drop", "drop"],
  ["commit", "commit", "commit", "empty", "empty"],
];

const LABELS = ["t₁", "t₂", "t₃", "t₄", "bonus"] as const;

const RATIO = [
  { p: 0.42, q: 0.35, r: 0.61 },
  { p: 0.28, q: 0.31, r: 0.55 },
  { p: 0.12, q: 0.40, r: 0.73 },
  { p: 0.33, q: 0.30, r: 0.20 },
] as const;

const NOTES = [
  "Draft model이 현재 prefix에서 t₁부터 t₄까지 autoregressive하게 뽑습니다. 이 네 번은 작은 model의 실행이라 값이 쌉니다.",
  "Target은 prefix+t₁..t₄를 한 번에 입력받아 다섯 위치의 분포 p를 동시에 냅니다. 다섯 번이 아니라 한 번의 forward입니다.",
  "왼쪽부터 r ≤ p/q 인지 봅니다. t₁·t₂는 통과하고 t₃에서 r=0.73 > p/q=0.30 이므로 이 위치가 rejection point입니다.",
  "위치 3은 target에만 남은 질량 (p−q)₊를 정규화한 분포에서 다시 뽑습니다. t₄는 t₃가 있다고 가정한 후보이므로 버립니다.",
  "t₁·t₂와 correction token까지 세 token을 commit하고 다음 cycle을 시작합니다. 전부 수락됐다면 위치 5에서 bonus를 뽑았을 것입니다.",
] as const;

const STATE_CLASS: Record<CellState, string> = {
  empty: "border-dashed border-border text-muted-foreground/60",
  draft: "border-border bg-muted/40 text-foreground",
  scored: "border-primary/55 bg-primary/5 text-foreground",
  accept: "border-emerald-600 bg-emerald-500/5 text-foreground",
  reject: "border-rose-600 bg-rose-500/5 text-foreground",
  drop: "border-dashed border-border text-muted-foreground/60 line-through",
  resample: "border-amber-600 bg-amber-500/5 text-foreground",
  commit: "border-primary bg-primary/10 text-foreground",
};

const STATE_TEXT: Record<CellState, string> = {
  empty: "비어 있음",
  draft: "draft q",
  scored: "target p",
  accept: "수락",
  reject: "거부",
  drop: "폐기",
  resample: "resample",
  commit: "commit",
};

export default function RejectionResampleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const cells = CELLS[scenes.active];
  const showRatio = scenes.active >= 2;

  return (
    <VizFrame
      eyebrow="Rejection point"
      title="첫 거부 위치에서 correction을 뽑고 그 뒤 후보는 버립니다"
      description="한 verification cycle을 다섯 장면으로 나눴습니다. 위치마다 draft 확률 q, target 확률 p, uniform 난수 r을 두고 왼쪽부터 r ≤ p/q 를 검사합니다."
      note="숫자는 설명용 예시입니다. 실제 runtime은 같은 판정을 batch 전체에 대해 vectorize하고, KV cache commit 지점을 rejection point에 맞춥니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Speculative decoding rejection point와 resample"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Cycle step · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {cells.map((state, index) => (
              <div
                key={`${index}-${state}`}
                className={`flex min-h-20 min-w-0 flex-col items-center justify-center border px-1 text-center font-mono text-xs font-bold ${STATE_CLASS[state]}`}
              >
                <span>{LABELS[index]}</span>
                <span className="mt-1 text-[10px] font-semibold opacity-75">
                  {STATE_TEXT[state]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 grid min-h-10 grid-cols-5 gap-2 font-mono text-[10px] leading-4 text-muted-foreground">
            {RATIO.map((row, index) => (
              <div key={LABELS[index]} className="min-w-0 text-center">
                {showRatio ? (
                  <>
                    <span>p/q {Math.min(1, row.p / row.q).toFixed(2)}</span>
                    <br />
                    <span>r {row.r.toFixed(2)}</span>
                  </>
                ) : (
                  <span>
                    q {row.q.toFixed(2)}
                    {scenes.active >= 1 ? ` · p ${row.p.toFixed(2)}` : ""}
                  </span>
                )}
              </div>
            ))}
            <div className="text-center">{showRatio ? "n=K일 때만" : ""}</div>
          </div>
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
