import { Fragment } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: signal map A1과 noise map A2를 각각 만들고 λ로 스케일한 뒤 빼서
 * D = A1 − λA2를 얻는 4-token toy. stage 높이는 네 장면의 최대 크기로 고정한다.
 */
const SCENES = ["신호 map A1", "노이즈 map A2", "λ 로 스케일", "차 D = A1 − λA2"] as const;

const TOKENS = ["τ₁", "τ₂", "τ₃", "τ₄"] as const;
const A1 = [0.1, 0.1, 0.7, 0.1];
const A2 = [0.25, 0.25, 0.25, 0.25];
const LAMBDA = 0.8;
const SCALED_A2 = A2.map((v) => Number((v * LAMBDA).toFixed(2)));
const D = A1.map((v, i) => Number((v - SCALED_A2[i]).toFixed(2)));

const NOTES = [
  "Q₁, K₁ 로 만든 첫 softmax map 입니다. 표준 attention 과 계산 방식이 같고, token 3 에 0.70 을 몰아준 뾰족한 분포입니다.",
  "Q₂, K₂ 로 독립적으로 만든 두 번째 softmax map 입니다. 네 token 에 0.25 씩 고르게 퍼져 정보량이 적은, 공통 성분에 가까운 분포입니다.",
  "λ=0.8 을 곱해 두 map 의 크기를 맞춥니다. 0.25 였던 각 값이 0.20 으로 줄어듭니다.",
  "A1 에서 λA2 를 빼면 token 3 만 0.50 으로 남고 나머지 세 자리는 음수(−0.10)가 됩니다. 합은 1−λ=0.20 으로 줄었습니다.",
] as const;

type RowKey = "a1" | "a2" | "d";
const ROWS: readonly { key: RowKey; label: string }[] = [
  { key: "a1", label: "A1 · signal" },
  { key: "a2", label: "A2 · noise (λ 적용 전/후)" },
  { key: "d", label: "D = A1 − λA2" },
];

const STATES: readonly {
  values: Record<RowKey, readonly number[] | null>;
  changed: RowKey;
}[] = [
  { values: { a1: A1, a2: null, d: null }, changed: "a1" },
  { values: { a1: A1, a2: A2, d: null }, changed: "a2" },
  { values: { a1: A1, a2: SCALED_A2, d: null }, changed: "a2" },
  { values: { a1: A1, a2: SCALED_A2, d: D }, changed: "d" },
];

function cellClass(value: number | null) {
  if (value === null) return "border-border text-muted-foreground";
  if (value < 0) return "border-dashed border-primary/50 bg-primary/5 text-foreground";
  if (value >= 0.5) return "border-primary bg-primary/20 text-foreground";
  if (value >= 0.2) return "border-primary/50 bg-primary/10 text-foreground";
  return "border-border text-muted-foreground";
}

export default function DifferentialAttentionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const state = STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="Paired attention maps · differential attention coefficient"
      title="같은 4개 token 위에서 두 softmax map 을 만들고 λ 로 스케일한 뒤 빼면 음수가 나올 수 있습니다"
      description="Query 하나가 4개 key 를 보는 장면입니다. 위 두 행은 독립적으로 계산한 A1, A2 이고 아래 행은 둘의 차 D 입니다."
      note="실제 model 은 N×N 전체 행렬과 여러 head 를 동시에 계산합니다. 그림은 한 query 행과 4개 key 로 줄였습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Differential attention 의 signal map·noise map·차 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-5 border border-border p-3">
            <div className="grid grid-cols-[5rem_repeat(4,1fr)] gap-1.5 text-xs">
              <div />
              {TOKENS.map((t) => (
                <div key={t} className="text-center font-mono text-[10px] text-muted-foreground">
                  {t}
                </div>
              ))}
              {ROWS.map((row) => {
                const values = state.values[row.key];
                const changed = state.changed === row.key;
                return (
                  <Fragment key={row.key}>
                    <div
                      className={`flex items-center text-[11px] font-bold ${changed ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {row.label}
                    </div>
                    {TOKENS.map((t, i) => {
                      const v = values ? values[i] : null;
                      return (
                        <div
                          key={`${row.key}-${t}`}
                          className={`flex min-h-10 items-center justify-center border font-mono text-[11px] ${cellClass(v)}`}
                        >
                          {v === null ? "—" : v.toFixed(2)}
                        </div>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
            <p className="mt-3 border-t border-dashed border-border pt-2 font-mono text-[10px] text-muted-foreground">
              λ = {LAMBDA.toFixed(1)} · Σ A1 = 1.00 · Σ D = {D.reduce((s, v) => s + v, 0).toFixed(2)}
            </p>
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
