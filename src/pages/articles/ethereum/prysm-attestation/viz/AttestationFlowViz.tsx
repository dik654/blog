import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "임무 배정",
  "세 표 선택",
  "안전 서명",
  "서브넷",
  "집계",
  "블록 포함",
  "합의 반영",
] as const;

const SCENES = [
  {
    question: "Validator 17은 언제, 어느 위원회에서 투표합니까?",
    answer: "Slot 352·committee 2·position 17이라는 duty를 받습니다.",
    object: "dependent root · validator index · slot · committee",
    receipt: "duty@B352",
    next: "무엇을 보고 투표해야 합니까?",
  },
  {
    question: "Attestation 한 장에는 왜 root가 세 개나 들어갑니까?",
    answer:
      "현재 head B352, 이미 justified된 source J, 이번 epoch의 target T를 한 투표에 담습니다.",
    object: "head=B352 · source=J10 · target=T11",
    receipt: "AttestationData",
    next: "서명만 맞으면 안전합니까?",
  },
  {
    question: "같은 key가 충돌하는 두 표에 서명하면 어떻게 합니까?",
    answer:
      "Signing root를 만들고 slashing DB가 double·surround vote를 거절한 뒤 한 번만 서명합니다.",
    object: "domain · signing root · history",
    receipt: "96-byte BLS signature",
    next: "모든 노드에 직접 보내야 합니까?",
  },
  {
    question: "한 표를 64개 gossip topic 중 어디로 보냅니까?",
    answer:
      "Epoch 안에서 지난 committee 수와 현재 index를 더해 subnet 수로 나눈 나머지를 씁니다.",
    object: "(4×(352 mod 32)+2) mod 64 = 2",
    receipt: "attestation subnet 2",
    next: "수많은 단일 표를 그대로 블록에 넣습니까?",
  },
  {
    question: "같은 내용을 지지한 표를 어떻게 한 개로 줄입니까?",
    answer:
      "같은 AttestationData이고 참여 bit가 겹치지 않는 표만 bitlist와 BLS signature로 집계합니다.",
    object: "data identity · disjoint bits · signatures",
    receipt: "aggregate + participant bits",
    next: "집계됐으면 chain에 반영됐습니까?",
  },
  {
    question: "Pool에 든 aggregate는 언제 protocol 입력이 됩니까?",
    answer:
      "Proposer가 활성 fork의 inclusion 조건과 한도 안에서 골라 block body에 넣어야 합니다.",
    object: "pool candidate · fork limit · timeliness",
    receipt: "included attestation",
    next: "한 표가 head와 finality에 똑같이 쓰입니까?",
  },
  {
    question: "포함된 한 표는 합의에서 어떤 두 일을 합니까?",
    answer:
      "Head root는 fork-choice weight에, source·target은 justification·finality와 reward 계산에 들어갑니다.",
    object: "head vote ≠ source→target checkpoint vote",
    receipt: "fork-choice·finality participation",
    next: "어느 단계의 실패를 다시 시도할 수 있습니까?",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 결과는 ${scene.receipt}입니다.`,
);

export default function AttestationFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Validator 17의 표 한 장 · slot 352"
      title="Attestation은 ‘head에 한 표’가 아니라, 세 root를 서명해 집계·포함시키는 합의 입력입니다"
      description="Duty를 받은 순간부터 fork choice와 finality에 반영될 때까지 같은 표를 따라갑니다."
      note="Validator·slot·committee와 root 이름은 설명용입니다. Subnet 예시는 S=32, committees-per-slot=4, N=64를 가정합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Prysm attestation 한 장의 생명주기 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[42rem] space-y-4 sm:min-h-[34rem] xl:min-h-[29rem]"
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생긴 꼬리 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 판단 재료
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.object}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <article className="min-w-0 border border-primary/60 bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  남긴 결과
                </p>
                <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.receipt}
                </p>
              </article>
              <article className="min-w-0 border border-border bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  다음 질문
                </p>
                <p className="mt-2 break-keep text-[10px] font-black leading-5 sm:text-xs">
                  {scene.next}
                </p>
              </article>
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
            playLabel="Validator 17의 attestation 생명주기 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
