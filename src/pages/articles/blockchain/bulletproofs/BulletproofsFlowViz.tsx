import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "주장 고정",
  "commitment",
  "bit 관계",
  "같은 w",
  "L·R 고정",
  "절반씩 접기",
  "검증 경계",
] as const;

const SCENES = [
  {
    question: "무엇을 공개하고 무엇을 숨길까요?",
    answer:
      "x=3과 y=12는 공개하지만, 둘을 잇는 witness w=4와 blinding r은 숨깁니다.",
    state: "public (x=3, y=12) · secret (w=4, r)",
    confirmed: "증명할 statement와 숨길 witness",
    unknown: "숨긴 w가 정말 3w=12이고 0≤w<8인지",
    phase: 0,
  },
  {
    question: "값을 숨기면 verifier가 무엇을 기준으로 검사할까요?",
    answer:
      "Prover가 V=wG+rH를 공개합니다. r 때문에 w는 보이지 않지만 같은 V를 나중 관계에 다시 묶을 수 있습니다.",
    state: "V = 4G + rH",
    confirmed: "숨긴 값과 blinding에 대한 공개 기준점 V",
    unknown: "V 안의 값이 허용 range 안인지",
    phase: 1,
  },
  {
    question: "4가 0부터 7 사이라는 말을 어떻게 식으로 바꿀까요?",
    answer:
      "4를 little-endian bits (0,0,1)로 놓고 각 bit가 0 또는 1인지, 0·1+0·2+1·4=4인지 검사합니다.",
    state: "aL=(0,0,1) · ai(ai−1)=0 · ⟨aL,(1,2,4)⟩=4",
    confirmed: "3-bit 값이 만드는 범위 0≤w<8",
    unknown: "이 bits의 4와 commitment V의 4가 같은 witness인지",
    phase: 2,
  },
  {
    question: "두 식이 각각 참이면 충분할까요?",
    answer:
      "아닙니다. 3w=12, bit relation, V=wG+rH가 같은 witness 변수를 공유해야 합니다. 서로 다른 w를 쓰면 결합 주장을 위조할 수 있습니다.",
    state: "same w: 3w=12 ↔ bits ↔ V",
    confirmed: "Commitment와 range·산술 관계의 witness 결속",
    unknown: "긴 vector 관계를 짧은 proof로 만드는 방법",
    phase: 3,
  },
  {
    question: "Vector를 바로 접으면 왜 안 될까요?",
    answer:
      "Prover가 좌우 cross term을 L과 R에 먼저 commit합니다. 그 뒤 transcript가 challenge u를 내므로 결과를 본 뒤 유리한 u를 고를 수 없습니다.",
    state: "append L,R → u = Transcript.challenge()",
    confirmed: "이번 round의 cross term과 challenge 순서",
    unknown: "u로 길이를 어떻게 절반으로 줄이는지",
    phase: 4,
  },
  {
    question: "짧은 proof는 어디에서 나오나요?",
    answer:
      "Witness와 generator를 맞물린 u·u⁻¹ 계수로 접습니다. 길이 8은 8→4→2→1의 세 round가 되고 proof에는 round별 L/R과 마지막 scalar만 남습니다.",
    state: "n=8 · rounds=log₂8=3 · L/R pairs=3",
    confirmed: "Proof 크기는 witness 길이에 logarithmic",
    unknown: "Prover·verifier의 전체 연산도 logarithmic인지",
    phase: 5,
  },
  {
    question: "Proof가 짧으면 검증 비용도 log n일까요?",
    answer:
      "아닙니다. 논문도 proof generation과 verification time은 n에 선형이라고 밝힙니다. Verifier는 transcript·point·generator profile과 최종 multiscalar relation을 검사합니다.",
    state: "proof bytes O(log n) · prove/verify work O(n)",
    confirmed: "같은 V의 range·relation에 대한 proof 승인",
    unknown: "애플리케이션 정책·구현 audit·성능은 별도",
    phase: 6,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 새로 확정된 것은 ${scene.confirmed}입니다.`,
);

const PIPELINE = [
  ["공개 주장", "3·w=12"],
  ["숨긴 값", "w=4, r"],
  ["기준점", "V=wG+rH"],
  ["range 관계", "bits 001"],
  ["IPA", "8→4→2→1"],
] as const;

export default function BulletproofsFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 witness 추적 · x=3 · y=12 · w=4 · 3-bit range"
      title="숨긴 4가 같은 commitment와 range 관계를 끝까지 지나갑니다"
      description="값을 숨기는 일, 범위를 보이는 일, 긴 vector 관계를 접는 일을 한 번에 섞지 않고 차례대로 봅니다."
      note="w=4와 3-bit range는 설명용입니다. 실제 protocol은 curve·generator capacity·transcript domain·bit length를 함께 고정합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="Bulletproofs commitment range IPA 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[38rem] space-y-4 sm:min-h-[34rem] xl:min-h-[30rem]"
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
            playLabel="Bulletproofs 한 witness 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
