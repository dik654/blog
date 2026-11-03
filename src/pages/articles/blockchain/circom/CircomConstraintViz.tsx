import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "주장 고정",
  "두 결과물",
  "witness 계산",
  "제약 검사",
  "빠진 제약",
  "증명·검증",
  "출시 경계",
] as const;

const SCENES = [
  {
    question: "무엇을 공개하고 무엇을 숨길까요?",
    answer:
      "Verifier에게 out=12는 공개하고 a=3, b=4는 숨깁니다. 증명할 관계는 ‘숨긴 a와 b의 곱이 공개 out과 같다’입니다.",
    state: "public out=12 · private a=3,b=4 · relation a·b=out",
    confirmed: "공개 statement와 비공개 witness의 경계",
    unknown: "Circom source가 이 관계를 어떻게 실행과 검사로 나누는지",
    phase: 0,
  },
  {
    question: "Circom source 하나가 왜 두 종류의 결과를 만들까요?",
    answer:
      "WASM·C++ witness generator는 정직한 prover가 값을 채우도록 돕고, R1CS는 verifier가 반드시 성립해야 할 식을 검사하도록 만듭니다.",
    state: ".circom → witness generator + R1CS",
    confirmed: "계산 경로와 검증 규칙은 서로 다른 artifact",
    unknown: "정직한 입력 3과 4가 들어오면 각각 무슨 일을 하는지",
    phase: 1,
  },
  {
    question: "Witness generator가 먼저 하는 일은 무엇일까요?",
    answer:
      "입력 a=3, b=4를 받아 out=12를 계산하고 witness의 각 칸을 채웁니다. 이 단계는 값을 만드는 실행이지, 악의적 prover를 막는 검증이 아닙니다.",
    state: "calculate: 3·4 → out=12 → witness cells",
    confirmed: "정상 입력에서 witness를 재현하는 계산",
    unknown: "누군가 out=11인 witness를 직접 만들면 무엇이 막는지",
    phase: 2,
  },
  {
    question: "Verifier는 3과 4를 보지 않고 어떻게 11을 거절할까요?",
    answer:
      "R1CS에 a·b=out이라는 행이 남습니다. Prover가 제출한 witness를 대입하면 3·4=12는 성립하지만 3·4=11은 성립하지 않습니다.",
    state: "enforce: ⟨A,z⟩·⟨B,z⟩=⟨C,z⟩ → 3·4=12",
    confirmed: "악의적 witness를 거절하는 실제 규칙",
    unknown: "계산만 남고 이 행이 빠지면 어떻게 되는지",
    phase: 3,
  },
  {
    question: "`out <-- a*b`도 화면에서는 12가 나오는데 왜 위험할까요?",
    answer:
      "`<--`는 witness 계산만 만듭니다. 정상 생성기는 12를 내지만 R1CS에 곱셈 행이 없으므로, 생성기를 우회한 prover의 다른 out을 그 규칙으로 거절할 수 없습니다.",
    state: "honest demo: 12 · malicious witness: relation not enforced",
    confirmed: "정상 데모 성공과 회로 안전성은 다른 주장",
    unknown: "안전한 artifact를 proof system과 어떻게 연결하는지",
    phase: 4,
  },
  {
    question: "Circom이 proof까지 직접 만드는 도구일까요?",
    answer:
      "아닙니다. Circom은 R1CS와 witness generator를 만들고, snarkjs 같은 별도 도구가 witness·키·R1CS를 사용해 proof를 만들고 검증합니다.",
    state: "Circom compile → witness → setup/key → prove → verify",
    confirmed: "컴파일러와 증명 도구의 책임 경계",
    unknown: "버전이나 public 순서가 바뀌어도 같은 주장인지",
    phase: 5,
  },
  {
    question: "출시할 때 무엇을 한 묶음으로 고정해야 할까요?",
    answer:
      "Compiler·source·R1CS·witness generator·public schema·proving/verifying key를 같은 manifest로 묶고, out=11과 오래된 키가 반드시 실패하는지 확인합니다.",
    state: "one manifest · valid 12 passes · invalid 11/stale key fail",
    confirmed: "같은 회로와 같은 공개 주장을 재현하는 출시 단위",
    unknown: "애플리케이션 관계 자체가 충분한지는 별도 audit 대상",
    phase: 6,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 새로 확정된 것은 ${scene.confirmed}입니다.`,
);

const PIPELINE = [
  ["statement", "out=12"],
  ["witness", "a=3,b=4"],
  ["계산", "WASM/C++"],
  ["규칙", "R1CS"],
  ["증거", "proof"],
] as const;

export default function CircomConstraintViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 회로 추적 · public out=12 · private a=3,b=4"
      title="같은 Circom source에서 계산기와 검사 규칙이 갈라집니다"
      description="정직한 prover가 값을 계산하는 길과 verifier가 악의적 witness를 거절하는 길을 섞지 않고 차례대로 봅니다."
      note="3·4=12는 설명용입니다. 실제 출시는 field, compiler, optimization, public schema와 proof backend까지 함께 고정해야 합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="Circom witness 계산과 R1CS 제약 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[40rem] space-y-4 sm:min-h-[34rem] lg:min-h-[28rem] xl:min-h-[24rem]"
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
            playLabel="Circom 한 회로 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
