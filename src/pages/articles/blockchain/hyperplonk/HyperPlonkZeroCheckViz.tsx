import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "네 행",
  "2-bit 좌표",
  "gate 오차",
  "상쇄 반례",
  "임의 가중치",
  "두 round",
  "commitment 확인",
] as const;

const SCENES = [
  {
    question: "이번 증명에서 네 행은 무엇을 만족해야 할까요?",
    answer:
      "각 행의 x와 y는 x⁵=y를 만족해야 합니다. 공식 test는 x=[0,1,2,3], y=[0,1,32,243]을 사용합니다.",
    state: "rows: (0,0) · (1,1) · (2,32) · (3,243)",
    confirmed: "네 행에 같은 high-degree gate를 적용",
    unknown: "2ⁿ개 행을 어떻게 적은 단계로 검사하는지",
    phase: 0,
  },
  {
    question: "행 번호를 왜 00·01·10·11로 바꿀까요?",
    answer:
      "네 행을 두 비트 좌표로 보면 각 witness column을 두 변수 multilinear polynomial로 확장할 수 있습니다. 2^μ행이면 좌표는 μ개입니다.",
    state: "00→row0 · 01→row1 · 10→row2 · 11→row3",
    confirmed: "4-row table과 {0,1}² hypercube의 일대일 대응",
    unknown: "각 좌표가 gate를 지키는지 나타내는 값",
    phase: 1,
  },
  {
    question: "어느 값이 행의 잘못을 드러낼까요?",
    answer:
      "각 Boolean corner에서 f(x)=q·X(x)⁵−Y(x)를 계산합니다. 정상 표는 [0,0,0,0]이고 row 10의 y를 31로 바꾸면 그 자리 오차가 1입니다.",
    state: "f(00,01,10,11) = [0,0,0,0] · bad y10=31 → [0,0,1,0]",
    confirmed: "Gate 전체를 하나의 error polynomial f로 표현",
    unknown: "오차 네 개의 합만 0이면 충분한지",
    phase: 2,
  },
  {
    question: "행 오차를 그냥 더하면 모든 행이 0임을 알 수 있을까요?",
    answer:
      "아닙니다. [1,−1,0,0]처럼 잘못된 두 행이 서로 상쇄될 수 있습니다. 단순 합 0은 모든 행이 0이라는 주장보다 약합니다.",
    state: "1 + (−1) + 0 + 0 = 0 · but two rows are wrong",
    confirmed: "Plain sumcheck만으로 zero-everywhere를 말할 수 없음",
    unknown: "상쇄가 미리 설계되지 않게 행마다 다른 가중치를 주는 법",
    phase: 3,
  },
  {
    question: "ZeroCheck는 상쇄를 어떻게 막을까요?",
    answer:
      "Prover가 오차표를 정한 뒤 transcript에서 임의 r을 뽑고, 각 row 오차에 eq(row,r)을 곱합니다. 잘못된 행의 조합이 이 임의 가중합까지 0일 확률은 작습니다.",
    state: "f̂(x)=f(x)·eq(x,r) · claim Σx∈{0,1}² f̂(x)=0",
    confirmed: "모든 corner의 0 주장을 임의 가중합 하나로 축소",
    unknown: "네 항의 합 주장을 어떻게 두 메시지로 줄이는지",
    phase: 4,
  },
  {
    question: "Sumcheck의 두 round에서 무엇이 유지될까요?",
    answer:
      "첫 메시지는 둘째 비트를 합친 p₁(t), 둘째 메시지는 첫 challenge를 고정한 p₂(t)입니다. 매번 pᵢ(0)+pᵢ(1)이 직전 claim과 같아야 합니다.",
    state: "4 corners → p₁(t) → r₁ → p₂(t) → r₂ → f̂(r₁,r₂)",
    confirmed: "2²개 항의 합을 2개 변수만큼의 round로 축소",
    unknown: "마지막 f̂(r₁,r₂)를 prover가 마음대로 말하지 못하게 하는 법",
    phase: 5,
  },
  {
    question: "마지막 한 점이 원래 witness에서 왔음을 누가 확인할까요?",
    answer:
      "Multilinear PCS가 미리 commitment한 X·Y·selector를 같은 random point에서 엽니다. Copy 관계는 별도 permutation check가 맡습니다.",
    state: "ZeroCheck + permutation check + multilinear KZG openings",
    confirmed: "Gate·copy·commitment를 서로 다른 검사로 결속",
    unknown: "현재 reference source의 외부 audit와 production hardening은 별도",
    phase: 6,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 새로 확정된 것은 ${scene.confirmed}입니다.`,
);

const PIPELINE = [
  ["table", "4 rows"],
  ["MLE", "2 variables"],
  ["gate", "x⁵−y"],
  ["zero", "f·eq"],
  ["proof", "KZG open"],
] as const;

export default function HyperPlonkZeroCheckViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="공식 four-row fixture · x⁵=y"
      title="네 행의 오류를 임의 가중합으로 바꾼 뒤 두 round로 줄입니다"
      description="Table→Boolean 좌표→gate error→ZeroCheck→sumcheck→commitment opening을 한 사례로 추적합니다."
      note="작은 네 행은 구조를 보여 주는 사례입니다. 2^μ행에서는 μ변수 MLE와 μ-round sumcheck가 됩니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="HyperPLONK 네 행 zero-check sumcheck 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[43rem] space-y-4 sm:min-h-[35rem] lg:min-h-[29rem] xl:min-h-[25rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`min-w-0 border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/25 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(13rem,0.65fr)]">
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생긴 꼬리 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 장면의 상태
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">
                  {scene.state}
                </p>
              </article>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PIPELINE.map(([name, value], index) => (
                <article
                  key={name}
                  className={`min-w-0 border bg-background p-3 ${
                    index <= scene.phase
                      ? "border-primary/60"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <p className="text-[9px] font-bold">{name}</p>
                  <p className="mt-2 break-words font-mono text-[9px] font-black leading-5 sm:text-[10px]">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">새로 확정된 결과</p>
                <p className="mt-2 break-keep text-xs font-semibold leading-5">
                  {scene.confirmed}
                </p>
              </article>
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">
                  아직 닫히지 않은 질문
                </p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  {scene.unknown}
                </p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="HyperPLONK 네 행 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
