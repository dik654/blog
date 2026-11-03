import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "Dataset 고정",
  "시점 확인",
  "번호 추첨",
  "Piece 탐색",
  "경로 검증",
  "증명 기록",
  "서비스 판정",
] as const;

const SCENES = [
  {
    question: "무엇을 증명할지 먼저 고정합니다",
    answer: "Piece A 60개와 B 40개를 순서대로 놓은 100-leaf dataset입니다.",
    dataset: "A [0–59] · B [60–99]",
    clock: "challenge 전",
    sample: "아직 없음",
    receipt: "setId·roots·counts",
  },
  {
    question: "아무 때나 proof를 내도 될까요?",
    answer:
      "아닙니다. 계약이 저장한 nextChallengeEpoch에 도달했고 challenge가 실제로 예약돼 있어야 합니다.",
    dataset: "challengeRange = 100",
    clock: "block ≥ challenge epoch",
    sample: "beacon seed 대기",
    receipt: "시점 통과",
  },
  {
    question: "제공자가 유리한 leaf를 고르지 못하게 하려면?",
    answer:
      "해당 epoch의 beacon seed, setId와 proof 순번을 해시합니다. 이 예에서는 100으로 나눈 나머지가 73이라고 둡니다.",
    dataset: "L = 100 leaves",
    clock: "seed = beacon(epoch)",
    sample: "keccak(seed,setId,0) mod 100 = 73",
    receipt: "logical leaf 73",
  },
  {
    question: "73번 leaf는 어느 piece 안에 있을까요?",
    answer:
      "계약의 sum-tree가 누적 leaf 수를 이진 탐색합니다. 73은 A의 60개를 지난 뒤이므로 B의 13번 leaf입니다.",
    dataset: "A 60개를 건너 B 선택",
    clock: "같은 proving period",
    sample: "piece B · local 13",
    receipt: "PieceIdAndOffset",
  },
  {
    question: "B의 13번 leaf라는 주장을 어떻게 확인할까요?",
    answer:
      "제출된 leaf와 Merkle siblings를 순서대로 결합해 등록된 B의 root와 같은지 확인합니다.",
    dataset: "expected root = root(B)",
    clock: "proof 제출 중",
    sample: "leaf 13 + Merkle path",
    receipt: "root 일치 여부",
  },
  {
    question: "한 sample이 맞으면 무엇이 확정될까요?",
    answer:
      "요구된 모든 sample이 맞아야 마지막 증명 epoch가 갱신되고 listener가 possessionProven 통지를 받습니다.",
    dataset: "같은 set revision",
    clock: "last proven = current block",
    sample: "K개 proof 모두 통과",
    receipt: "PossessionProven event",
  },
  {
    question: "이제 사용자가 파일을 받을 수 있다는 뜻일까요?",
    answer:
      "아닙니다. 이는 뽑힌 leaf를 열었다는 possession receipt입니다. 전체 파일 retrieval과 속도는 별도 시험입니다.",
    dataset: "sampled possession 확인",
    clock: "이번 period만 성공",
    sample: "미래 period는 미증명",
    receipt: "retrieval gate 별도",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 현재 증거는 ${scene.receipt}입니다.`,
);

export function PdpChallengeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Piece A 60 leaves · Piece B 40 leaves · challenge 73"
      title="PDP는 dataset 전체에서 leaf를 뽑고, 그 leaf가 속한 piece의 Merkle path를 확인합니다"
      description="한 번의 possession proof가 dataset, 시점, 무작위 번호, piece 탐색과 서비스 판정으로 이어지는 과정을 따라갑니다."
      note="73은 계산 흐름을 보기 위한 고정 예입니다. 실제 번호는 해당 epoch의 beacon randomness와 setId, proof 순번에서 결정됩니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="PDP challenge와 proof 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[38rem] space-y-4 sm:min-h-[32rem] xl:min-h-[27rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/30 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(12rem,0.65fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생기는 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계가 남기는 증거
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.receipt}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  다음 단계의 질문은 이 증거만으로 답할 수 없는 부분에서
                  생깁니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["Dataset", scene.dataset],
                ["Schedule", scene.clock],
                ["Challenge", scene.sample],
                ["Receipt", scene.receipt],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${
                    index === 3 ? "border-primary/60" : "border-border"
                  }`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${
                    index <= scenes.active ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="한 번의 PDP 증명 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
