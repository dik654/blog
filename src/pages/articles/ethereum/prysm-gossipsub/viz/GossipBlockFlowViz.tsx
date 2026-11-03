import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "봉투 도착",
  "경로 선택",
  "크기 제한",
  "객체 복원",
  "합의 검사",
  "세 판정",
  "증폭·소비",
] as const;

const SCENES = [
  {
    question:
      "Peer P7이 보낸 block bytes를 왜 바로 이웃에게 복사하지 않습니까?",
    answer:
      "Gossip은 한 번의 입력을 여러 피어에게 증폭합니다. 검증 전 전파는 공격자의 잘못된 bytes까지 대신 증폭합니다.",
    object: "peer=P7 · topic · compressed bytes",
    receipt: "untrusted envelope",
    next: "어느 규칙으로 열 봉투인지 어떻게 압니까?",
  },
  {
    question: "같은 beacon_block 이름인데도 왜 topic 전체를 확인합니까?",
    answer:
      "Fork digest·message name·encoding suffix가 맞아야 현재 fork의 block decoder와 validator를 선택할 수 있습니다.",
    object: "/eth2/{fork}/beacon_block/ssz_snappy",
    receipt: "exact route + validator",
    next: "Topic이 맞으면 안전하게 압축을 풀 수 있습니까?",
  },
  {
    question: "작은 압축 입력이 메모리를 크게 차지하는 공격은 어디서 막습니까?",
    answer:
      "압축 bytes 상한을 먼저 보고, Snappy가 예고한 해제 크기와 실제 SSZ payload도 10 MiB 상한 안인지 확인합니다.",
    object: "10 MiB raw → 12,233,418 B compressed bound",
    receipt: "bounded bytes",
    next: "크기가 맞으면 어떤 Go 객체로 복원합니까?",
  },
  {
    question:
      "Fork마다 block 모양이 달라지는데 아무 구조체로나 decode해도 됩니까?",
    answer:
      "Topic의 fork digest로 정확한 schema를 고른 뒤 Snappy를 풀고 SSZ 객체를 복원합니다. 그 전에는 block이라고 믿지 않습니다.",
    object: "topic → fork schema → SignedBeaconBlock",
    receipt: "typed candidate B352",
    next: "형식이 맞는 block은 모두 전파합니까?",
  },
  {
    question: "형식이 맞는 B352가 consensus에도 유효한지는 무엇을 봅니까?",
    answer:
      "동기화 상태·중복·slot 시간·finalized 경계·부모·서명·proposer index·fork별 payload 조건을 확인합니다.",
    object: "seen · time · parent · signature · proposer",
    receipt: "validation result + reason",
    next: "실패를 모두 같은 벌점으로 처리합니까?",
  },
  {
    question: "Reject와 Ignore는 왜 따로 있어야 합니까?",
    answer:
      "명백한 invalid 입력은 Reject, 이미 봤거나 부모가 아직 없는 입력은 Ignore, 새롭고 유효한 입력만 Accept합니다.",
    object: "Accept / Reject / Ignore",
    receipt: "remote fault와 local state 분리",
    next: "Accept가 곧 chain 확정이라는 뜻입니까?",
  },
  {
    question: "Accept 뒤에는 무엇이 일어나고, 무엇은 아직 일어나지 않았습니까?",
    answer:
      "GossipSub는 이웃으로 전파하고 Prysm subscriber는 typed object를 처리합니다. Fork choice·state transition·finality는 다음 단계입니다.",
    object: "mesh propagation · ValidatorData · subscriber",
    receipt: "전파 허용 ≠ 최종 합의",
    next: "어느 단계가 느릴 때 mesh 전체가 막힙니까?",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 결과는 ${scene.receipt}입니다.`,
);

export default function GossipBlockFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Peer P7이 보낸 beacon block B352 한 개"
      title="GossipSub는 소문을 무조건 퍼뜨리는 망이 아니라, 검증된 입력만 증폭하는 통제된 확성기입니다"
      description="Topic이 붙은 bytes가 전파 가능한 block 후보가 될 때까지 같은 입력을 따라갑니다."
      note="Peer·block root와 fork digest는 설명용입니다. 크기 상한과 판정 경계는 고정한 Ethereum spec·Prysm v7.3.1을 따릅니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Beacon block gossip 검증 생명주기 탐색기"
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
                <p className="mt-2 break-words border-l-2 border-primary pl-3 font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.object}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <article className="min-w-0 border border-primary/60 bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  남긴 결과
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5 sm:text-xs">
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
            playLabel="Beacon block gossip 검증 생명주기 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
