import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "곱셈 한 줄",
  "8칸으로 늘리기",
  "두 종류의 거짓",
  "oracle을 먼저 고정",
  "질문 만들기",
  "필요한 칸만 열기",
  "두 검사를 함께 통과",
] as const;

const SCENES = [
  {
    question: "검증자가 확인하려는 가장 작은 계산은 무엇일까요?",
    answer:
      "비공개 값 a=3과 b=4를 곱하면 공개 결과 c=12가 된다는 한 줄입니다. 벡터 z=(1,3,4,12)에서 A·z=3, B·z=4, C·z=12가 됩니다.",
    state: "z=(1,3,4,12) · 3×4−12=0",
    confirmed: "R1CS 한 행은 세 선형식의 값과 곱셈 하나를 검사합니다.",
    next: "검증자가 z 전체를 읽지 않고도 틀린 표를 찾을 방법",
    phase: 0,
  },
  {
    question: "네 값을 왜 여덟 칸으로 늘릴까요?",
    answer:
      "F17의 네 점 0·1·2·3에서 z와 같은 3차 이하 다항식을 만들고 4·5·6·7에서도 평가합니다. 여분의 칸은 값들이 제각각 바뀌기 어렵게 만듭니다.",
    state: "[1,3,4,12] → [1,3,4,12,1,13,5,2]",
    confirmed: "한 다항식의 평가표라는 공통 구조가 생겼습니다.",
    next: "유효한 다른 코드워드도 원래 곱셈을 만족하는지",
    phase: 1,
  },
  {
    question: "낮은 차수 코드워드이면 곱셈도 자동으로 맞을까요?",
    answer:
      "아닙니다. c=11로 바꿔 다시 인코딩한 [1,3,4,11,14,3,2,1]도 3차 코드워드입니다. 그러나 3×4−11=1이므로 계산 관계는 틀립니다.",
    state: "valid codeword ≠ valid computation",
    confirmed: "코드 근접성 검사와 R1CS 관계 검사는 서로 다른 일을 합니다.",
    next: "두 검사를 위해 prover 표를 언제 고정해야 하는지",
    phase: 2,
  },
  {
    question: "검증자의 질문보다 무엇이 먼저 정해져야 할까요?",
    answer:
      "Prover가 각 round의 oracle 표를 만들고 Merkle root를 먼저 보냅니다. 이 root가 정해진 뒤에는 질문받은 칸만 정상으로 다시 고를 수 없습니다.",
    state: "oracle values → Merkle tree → root R₀",
    confirmed: "질문 전에 표 전체의 한 버전을 고정했습니다.",
    next: "사람이 던지던 공개 난수를 비대화식 proof에서 만드는 법",
    phase: 3,
  },
  {
    question: "비대화식 proof에서 무작위 질문은 어디서 나올까요?",
    answer:
      "BCS는 root와 prover message를 hashchain에 넣고 challenge와 query position을 꺼냅니다. 같은 transcript를 읽는 prover와 verifier가 같은 질문을 재생합니다.",
    state: "absorb(root,message) → squeeze(challenge,query)",
    confirmed: "질문이 commit된 oracle과 앞선 메시지에 묶였습니다.",
    next: "64칸 oracle 전체가 아니라 네 칸만 보낼 때 필요한 증거",
    phase: 4,
  },
  {
    question: "검증자는 선택한 네 칸이 root 안에 있었음을 어떻게 알까요?",
    answer:
      "각 값과 공유 가능한 Merkle authentication path를 받습니다. 공식 one-round test는 64칸 중 0·1·2·3을 열고 root와 경로 hash를 포함한 크기식을 검사합니다.",
    state: "4 values + pruned Merkle path · expected 82 bytes",
    confirmed: "선택한 위치는 root에 결속되지만 열지 않은 모든 값의 의미까지 증명하지는 않습니다.",
    next: "Merkle path 검사와 계산 관계 검사를 합치는 마지막 조건",
    phase: 5,
  },
  {
    question: "최종 verifier가 둘 중 하나만 통과해도 받아들일까요?",
    answer:
      "아닙니다. 실제 Aurora wrapper는 BCS transcript의 Merkle·순서 검증과 Aurora IOP의 관계 predicate를 모두 계산하고 두 값의 AND만 반환합니다.",
    state: "accept = transcript_is_valid && protocol_accepts",
    confirmed: "표의 출처와 표가 뜻하는 계산을 동시에 확인합니다.",
    next: "선택한 field·code·FRI·hash·soundness profile의 정확한 고정",
    phase: 6,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 이 장면에서 ${scene.confirmed}`,
);

const PIPELINE = [
  ["relation", "3×4=12"],
  ["encode", "4→8 cells"],
  ["commit", "Merkle root"],
  ["query", "hash-derived"],
  ["decide", "two checks"],
] as const;

const GOOD = [1, 3, 4, 12, 1, 13, 5, 2];
const BAD_RELATION = [1, 3, 4, 11, 14, 3, 2, 1];

export default function LibiopOracleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 줄 R1CS · F17의 교육용 8칸 코드"
      title="표가 낮은 차수인지와 곱셈이 맞는지는 별도로 검사합니다"
      description="3×4=12 한 줄을 codeword·oracle commitment·BCS query·최종 판정까지 같은 값으로 추적합니다."
      note="F17의 4→8 systematic 예시는 역할을 보여 주기 위한 작은 모형입니다. 실제 libiop의 Aurora profile과 field·domain·masking parameter는 더 큽니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="libiop R1CS oracle BCS 일곱 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[49rem] space-y-4 sm:min-h-[41rem] lg:min-h-[34rem] xl:min-h-[31rem]"
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.6fr)]">
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
                    index <= Math.min(scene.phase, PIPELINE.length - 1)
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-2">
              {[
                ["c=12 · 관계도 맞음", GOOD],
                ["c=11 · 코드는 맞지만 관계는 틀림", BAD_RELATION],
              ].map(([label, values]) => (
                <article key={label as string} className="min-w-0 bg-background p-4">
                  <p className="break-keep text-[9px] font-bold text-muted-foreground">
                    {label as string}
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-8">
                    {(values as number[]).map((value, index) => (
                      <div
                        key={`${label}-${index}`}
                        className={`min-w-0 border p-2 text-center font-mono text-[10px] font-black ${
                          index < 4 ? "border-primary/50 bg-primary/5" : "border-border"
                        }`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
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
            playLabel="libiop R1CS oracle BCS 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
