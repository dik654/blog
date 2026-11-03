import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "8행 trace",
  "AIR 규칙",
  "config 조립",
  "trace 고정",
  "quotient",
  "opening",
  "검증 재생",
  "외부 문맥",
] as const;

const SCENES = [
  {
    question: "피보나치 계산을 증명기에 넣으면 가장 먼저 무엇이 생길까요?",
    answer:
      "숫자 한 줄이 아니라 left·right 두 열을 가진 8행 실행표가 생깁니다. 첫 행 (0,1)에서 시작해 마지막 행 (13,21)까지 앞 행의 두 값을 다음 행으로 옮깁니다.",
    state: "trace = [(0,1),(1,1),(1,2),(2,3),(3,5),(5,8),(8,13),(13,21)]",
    confirmed: "Witness는 숨겨진 정답 하나가 아니라 규칙을 따라간 실행표입니다.",
    next: "표 안의 숫자가 실제로 규칙을 따르는지 표현하는 방법",
    phase: 0,
  },
  {
    question: "검증기는 여덟 행을 어떤 규칙으로 읽을까요?",
    answer:
      "첫 행은 공개 시작값 (0,1), 인접한 두 행은 next.left=local.right와 next.right=local.left+local.right, 마지막 행은 공개 끝값 21이어야 합니다.",
    state: "first=(0,1) · transition=(b,a+b) · last.right=21",
    confirmed: "AIR은 실행표를 받아들일 조건을 첫 행·전이·마지막 행으로 나눕니다.",
    next: "이 규칙을 짧은 proof로 바꿀 때 필요한 암호 부품",
    phase: 1,
  },
  {
    question: "Plonky3에서 '설정 하나'는 무엇을 함께 고를까요?",
    answer:
      "공식 test는 BabyBear, 4차 확장체, Poseidon2, Merkle MMCS, radix-2 DFT, FRI PCS, challenger를 type alias로 연결합니다. 이 조합 전체가 하나의 검증 프로필입니다.",
    state: "BabyBear → Poseidon2/MMCS → DFT/FRI PCS → Challenger → StarkConfig",
    confirmed: "Plonky3는 고정된 STARK 하나가 아니라 서로 맞는 부품을 조립하는 toolkit입니다.",
    next: "prover가 실행표를 받은 뒤 처음으로 보내는 값",
    phase: 2,
  },
  {
    question: "검증자의 무작위 질문보다 먼저 무엇을 고정할까요?",
    answer:
      "Prover는 trace를 더 큰 평가 영역으로 확장한 뒤 PCS로 commit합니다. Transcript는 이 commitment와 공개값을 흡수한 다음 여러 AIR 제약을 섞을 challenge α를 만듭니다.",
    state: "trace → LDE/MMCS commitment R_trace → absorb(public=[0,1,21]) → α",
    confirmed: "질문을 본 뒤 실행표를 바꾸지 못하도록 trace commitment가 먼저 옵니다.",
    next: "모든 행의 여러 제약을 한 번에 확인하는 방법",
    phase: 3,
  },
  {
    question: "여러 제약을 왜 quotient 하나로 합칠까요?",
    answer:
      "AIR 제약들을 α의 거듭제곱으로 섞고, trace 영역에서 0이 되는 다항식으로 나눕니다. 올바른 trace라면 나머지 없이 낮은 차수 quotient가 생기고, prover는 그 조각에도 commit합니다.",
    state: "Q(X) = C_α(X) / Z_H(X) · commit(R_quotient)",
    confirmed: "행마다 0이라는 조건이 하나의 다항식 항등식으로 바뀝니다.",
    next: "검증자가 전체 다항식을 받지 않고 항등식을 확인하는 방법",
    phase: 4,
  },
  {
    question: "Proof에는 trace 전체 대신 무엇이 들어갈까요?",
    answer:
      "Transcript가 만든 바깥점 ζ에서 current·next trace와 quotient 값을 열고, 그 값들이 commitment에 속한다는 PCS·FRI opening proof를 넣습니다. 전체 trace는 proof에 복사하지 않습니다.",
    state: "proof = commitments + opened_values(ζ,gζ) + PCS/FRI proof + degree + PoW",
    confirmed: "Proof는 고정된 다항식의 필요한 위치만 열어 보이는 묶음입니다.",
    next: "verifier가 같은 α와 ζ를 다시 얻는 조건",
    phase: 5,
  },
  {
    question: "Verifier는 proof만 읽고 무엇을 증명했는지 알아낼까요?",
    answer:
      "아닙니다. 호출자가 config·FibonacciAir·공개값 [0,1,21]을 따로 넘깁니다. Verifier는 이 외부 문맥으로 transcript를 재생하고 PCS opening과 AIR·quotient 항등식을 차례로 확인합니다.",
    state: "verify(config, FibonacciAir, proof, public_values) → replay → opening → AIR identity",
    confirmed: "검증 결과의 의미는 proof bytes와 verifier가 들고 있는 문맥을 합쳐야 정해집니다.",
    next: "proof 구조체에 실제로 빠져 있는 식별 정보",
    phase: 6,
  },
  {
    question: "배포 시스템이 proof와 함께 따로 고정해야 할 것은 무엇일까요?",
    answer:
      "실제 Proof 구조에는 AIR 코드의 식별자, 공개값, config manifest, source commit이 없습니다. 애플리케이션이 verifier route·AIR/config version·공개 statement를 신뢰된 envelope로 묶어야 합니다.",
    state: "meaning = proof bytes + AIR/version + config/params + public values",
    confirmed: "Plonky3 proof는 self-describing receipt가 아닙니다.",
    next: "고정 커밋의 정상·변조 test와 malformed proof panic 경계",
    phase: 7,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 이 장면에서 ${scene.confirmed}`,
);

const TRACE = [
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 3],
  [3, 5],
  [5, 8],
  [8, 13],
  [13, 21],
] as const;

const STACK = [
  ["field", "BabyBear"],
  ["hash", "Poseidon2"],
  ["commit", "Merkle MMCS"],
  ["transform", "radix-2 DFT"],
  ["PCS", "TwoAdic FRI"],
  ["transcript", "Duplex challenger"],
] as const;

const PROOF_FIELDS = ["commitments", "opened values", "PCS/FRI proof", "degree bits", "PoW witness"];
const EXTERNAL_CONTEXT = ["AIR implementation", "public values", "exact config", "source/version"];

export default function Plonky3ProofViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="공식 uni-stark Fibonacci test · 8행"
      title="Proof bytes의 의미가 생기는 과정을 한 요청으로 따라갑니다"
      description="(0,1)에서 21까지 가는 실행표가 AIR·config·commitment·quotient·FRI opening을 거쳐 검증되는 경로입니다."
      note="그림의 수치와 type stack은 Plonky3 commit 0d803737의 uni-stark Fibonacci test를 따릅니다. num_queries=2와 작은 PoW는 test profile이지 운영 보안 권장값이 아닙니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="Plonky3 Fibonacci proof 여덟 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[61rem] space-y-4 sm:min-h-[52rem] lg:min-h-[43rem] xl:min-h-[39rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.45fr)_minmax(15rem,0.55fr)]">
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
                <p className="text-[9px] font-bold text-muted-foreground">이 장면의 상태</p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">
                  {scene.state}
                </p>
              </article>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {TRACE.map(([left, right], index) => (
                <article
                  key={`${left}-${right}-${index}`}
                  className={`min-w-0 border bg-background p-2 text-center ${
                    scene.phase >= 0 ? "border-primary/45" : "border-border"
                  }`}
                >
                  <p className="text-[8px] font-bold text-muted-foreground">row {index}</p>
                  <p className="mt-1 font-mono text-[10px] font-black">
                    {left} · {right}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">같이 맞물리는 config stack</p>
                <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {STACK.map(([role, value], index) => (
                    <div
                      key={role}
                      className={`min-w-0 border p-2 ${
                        scene.phase >= 2 && index <= Math.min(scene.phase, STACK.length - 1)
                          ? "border-primary/55 bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <p className="text-[8px] font-bold text-muted-foreground">{role}</p>
                      <p className="mt-1 break-keep text-[9px] font-black leading-4">{value}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">proof 안과 밖을 구별하기</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="min-w-0 border border-emerald-500/40 p-3">
                    <p className="text-[8px] font-black text-emerald-700 dark:text-emerald-300">Proof 안</p>
                    <ul className="mt-2 space-y-1 text-[9px] leading-4">
                      {PROOF_FIELDS.map((item) => <li key={item}>· {item}</li>)}
                    </ul>
                  </div>
                  <div className={`min-w-0 border p-3 ${scene.phase >= 6 ? "border-amber-500/60 bg-amber-500/5" : "border-border"}`}>
                    <p className="text-[8px] font-black text-amber-700 dark:text-amber-300">호출자가 제공</p>
                    <ul className="mt-2 space-y-1 text-[9px] leading-4">
                      {EXTERNAL_CONTEXT.map((item) => <li key={item}>· {item}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
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
                  다음 꼬리 질문
                </p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  {scene.next}
                </p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Plonky3 proof 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
