import { Fragment } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "정답 쌍",
  "점수 행렬",
  "정답 확률",
  "가중치 갱신",
  "검색에 반영",
] as const;

const NOTES = [
  "질문 Q1과 문서 D1처럼 정답 관계가 있는 세 쌍을 한 배치에 넣습니다. Q1에서 보면 D2와 D3은 따로 모으지 않아도 negative가 됩니다.",
  "세 질문과 세 문서를 각각 인코딩하면 3×3 점수 행렬이 생깁니다. 대각선은 정답 쌍이며, 나머지 여섯 칸은 같은 배치에서 재사용한 negative입니다.",
  "Q1 행의 logit 2·1·0을 softmax에 넣으면 D1 확률은 0.6652이고 loss는 0.4076입니다. 정답이 1에 가까울수록 loss가 작아집니다.",
  "Q1 행에서 정답 logit의 기울기는 −0.3348, 두 negative는 +0.2447·+0.0900입니다. 경사하강은 D1 점수를 올리고 D2·D3 점수를 내리는 방향으로 가중치를 바꿉니다.",
  "설명용 다음 상태에서 Q1 행이 2.6·0.7·−0.2가 되면 D1 확률은 0.8262, loss는 0.1909가 됩니다. 학습된 입력 규칙과 가중치로 문서 index를 다시 만들 때 검색 순위에 반영됩니다.",
] as const;

const PAIRS = [
  { q: "Q1 · 충전이 안 돼요", d: "D1 · 케이블·어댑터 점검" },
  { q: "Q2 · 배송지 변경", d: "D2 · 발송 전 주소 변경" },
  { q: "Q3 · 환불 기한", d: "D3 · 수령 후 7일" },
] as const;

const INITIAL_SCORES = [
  [2, 1, 0],
  [0.4, 2.2, 0.7],
  [0.3, 0.8, 2.1],
] as const;

const UPDATED_Q1 = [2.6, 0.7, -0.2] as const;

function panelClass(active: boolean) {
  return `min-w-0 border p-3 transition-colors sm:p-4 ${
    active
      ? "border-primary/60 bg-primary/[0.045] text-foreground"
      : "border-border bg-background text-muted-foreground"
  }`;
}

export default function EmbeddingModelFineTuningViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const active = scenes.active;
  const scores = active >= 3 ? [UPDATED_Q1, INITIAL_SCORES[1], INITIAL_SCORES[2]] : INITIAL_SCORES;

  return (
    <VizFrame
      eyebrow="한 배치 추적 · Q1"
      title="정답 쌍 세 개가 검색 모델의 한 번의 학습 신호가 되는 과정"
      description="Q1을 따라가면 pair 데이터, 3×3 점수 행렬, InfoNCE loss, gradient, 새 검색 index가 한 흐름으로 이어집니다. 숫자는 계산을 재현하기 위한 설명용 logit입니다."
      note="이 그림은 학습 메커니즘을 보여 주는 계산 예시입니다. 점수 변화량과 검색 품질은 특정 모델의 측정 결과가 아닙니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="정답 쌍에서 검색 결과까지 이어지는 embedding fine-tuning 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="mb-4 overflow-x-auto pb-1">
          <ol className="grid min-w-[36rem] grid-cols-5 gap-px bg-border p-px">
            {SCENES.map((label, index) => (
              <li
                key={label}
                className={`min-h-16 bg-background px-3 py-2 text-xs leading-5 ${
                  active === index ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="mt-1 block break-keep">{label}</strong>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.05fr_1.25fr_1fr]">
          <section className={panelClass(active === 0)} aria-label="학습 배치의 정답 쌍">
            <p className="text-[10px] font-black text-primary">BATCH · 3 PAIRS</p>
            <div className="mt-3 space-y-2">
              {PAIRS.map((pair, index) => (
                <div key={pair.q} className={`border-l-2 pl-3 ${index === 0 ? "border-primary" : "border-border"}`}>
                  <p className="break-keep text-xs font-bold leading-5">{pair.q}</p>
                  <p className="break-keep text-[11px] leading-5 text-muted-foreground">↳ {pair.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5">
              Q1 기준: <strong className="text-foreground">positive 1개</strong> · negative 2개
            </p>
          </section>

          <section className={panelClass(active === 1 || active === 3)} aria-label="질문과 문서의 점수 행렬">
            <p className="text-[10px] font-black text-primary">LOGITS · QUERY × DOCUMENT</p>
            <div className="mt-3 grid grid-cols-[2rem_repeat(3,minmax(2.5rem,1fr))] gap-1 text-center text-[10px]">
              <span />
              {["D1", "D2", "D3"].map((doc) => <strong key={doc}>{doc}</strong>)}
              {scores.map((row, rowIndex) => (
                <Fragment key={`row-${rowIndex}`}>
                  <strong className="flex items-center justify-start">Q{rowIndex + 1}</strong>
                  {row.map((value, colIndex) => {
                    const positive = rowIndex === colIndex;
                    const changed = active >= 3 && rowIndex === 0;
                    return (
                      <span
                        key={`${rowIndex}-${colIndex}`}
                        className={`flex h-10 items-center justify-center border font-mono font-bold ${
                          positive
                            ? "border-primary/60 bg-primary/10 text-foreground"
                            : "border-border bg-muted/30"
                        } ${changed ? "ring-1 ring-inset ring-primary/30" : ""}`}
                      >
                        {value.toFixed(1)}
                      </span>
                    );
                  })}
                </Fragment>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5">
              대각선 3칸은 positive, 나머지 <strong className="text-foreground">6칸은 in-batch negative</strong>입니다.
            </p>
          </section>

          <section className={panelClass(active === 2 || active === 4)} aria-label="Q1의 확률과 loss 계산">
            <p className="text-[10px] font-black text-primary">Q1 · SOFTMAX &amp; LOSS</p>
            {active < 4 ? (
              <div className="mt-3 min-h-36 space-y-2 font-mono text-[11px] leading-5">
                <p>exp(2) = 7.389</p>
                <p>Z = 7.389 + 2.718 + 1</p>
                <p className="border-y border-border py-2 font-bold text-foreground">P(D1|Q1) = 0.6652</p>
                <p>L = −log(0.6652) = 0.4076</p>
              </div>
            ) : (
              <div className="mt-3 min-h-36 space-y-2 font-mono text-[11px] leading-5">
                <p>Q1 logits = 2.6 · 0.7 · −0.2</p>
                <p className="border-y border-border py-2 font-bold text-foreground">P(D1|Q1) = 0.8262</p>
                <p>L = 0.1909</p>
                <p className="font-sans text-muted-foreground">문서 index를 다시 만듭니다.</p>
              </div>
            )}
            <div className="mt-3 min-h-[3.5rem] border-t border-border pt-3 text-[11px] leading-5 sm:min-h-[5.5rem]">
              <p><strong className="text-foreground">∂L/∂s</strong></p>
              <p className={`mt-1 font-mono ${active >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                {active >= 3 ? "D1 −0.3348 · D2 +0.2447 · D3 +0.0900" : "D1 — · D2 — · D3 —"}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-4 border-l-2 border-primary/50 pl-4">
          <p className="text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · {SCENES[active]}
          </p>
          <p className="mt-1 min-h-24 break-keep text-sm leading-6 text-muted-foreground sm:min-h-12">{NOTES[active]}</p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          playLabel="과정 재생"
          className="mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
