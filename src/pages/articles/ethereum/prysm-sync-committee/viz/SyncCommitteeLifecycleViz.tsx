import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "head 관찰",
  "member 서명",
  "subnet 전파",
  "contribution",
  "block 포함",
  "update 검증",
  "header 갱신",
] as const;

const SCENES = [
  {
    question: "Slot 100의 블록 R100을 보았다는 사실을 작은 기기에 어떻게 전할까요?",
    answer:
      "전체 validator의 attestation을 다시 실행시키지 않고, 이 기간에 미리 정해 둔 sync committee가 R100에 짧은 BLS 서명을 남기게 합니다.",
    actor: "current sync committee · 512 positions",
    object: "slot=100 · head root=R100",
    receipt: "서명할 대상 R100 확정",
    next: "위원회 구성원 V37은 무엇을 서명합니까?",
  },
  {
    question: "위원회 구성원 V37은 R100만 그대로 서명합니까?",
    answer:
      "아닙니다. R100과 DOMAIN_SYNC_COMMITTEE로 signing root를 만든 뒤 서명합니다. 같은 루트의 attestation 서명과 역할을 섞지 않기 위해서입니다.",
    actor: "validator V37 · committee position 261",
    object: "HTR(R100, Dsync) → σ37",
    receipt: "SyncCommitteeMessage(slot 100, R100, V37, σ37)",
    next: "512개 메시지를 전부 전역 채널에 뿌려야 합니까?",
  },
  {
    question: "512개 메시지를 전부 전역 채널에 뿌려야 합니까?",
    answer:
      "Mainnet에서는 512 positions를 4개 subnet으로 나눕니다. Position 261은 subnet 2의 local bit 5이므로 그 subnet으로 전파됩니다.",
    actor: "sync_committee_2 gossip subnet",
    object: "261 = 2 × 128 + 5",
    receipt: "subnet 2의 bit 5와 σ37",
    next: "Subnet의 메시지를 누가 한 덩어리로 줄입니까?",
  },
  {
    question: "Subnet의 메시지를 누가 한 덩어리로 줄입니까?",
    answer:
      "각 slot의 selection proof가 뽑은 aggregator가 같은 slot·root의 유효 메시지만 모아 local bitvector와 집계 서명을 만듭니다.",
    actor: "subnet 2 aggregator",
    object: "128 local bits + aggregated BLS signature",
    receipt: "SyncCommitteeContribution(subnet 2, R100)",
    next: "네 subcommittee 결과는 어디서 다시 합쳐집니까?",
  },
  {
    question: "네 subcommittee 결과는 어디서 다시 합쳐집니까?",
    answer:
      "Slot 101 proposer가 R100과 slot 100에 맞는 contribution을 subnet별로 고르고, 네 bit 구간과 서명을 SyncAggregate 하나로 합쳐 block 101에 넣습니다.",
    actor: "slot 101 block proposer",
    object: "4 × 128 bits → 512 bits · aggregate signatures",
    receipt: "block 101 body의 SyncAggregate",
    next: "집계 서명이 맞으면 light client는 곧바로 R100을 확정합니까?",
  },
  {
    question: "집계 서명이 맞으면 light client는 곧바로 R100을 확정합니까?",
    answer:
      "아닙니다. 신뢰한 block root에서 current committee를 증명한 뒤 slot 순서, period, 참여 bits, finality·next-committee branch와 BLS 서명을 검사합니다.",
    actor: "light client store",
    object: "trusted root · Merkle branches · committee bits · signature",
    receipt: "유효하지만 아직 채택 여부를 판단할 update",
    next: "유효한 update는 언제 optimistic 또는 finalized가 됩니까?",
  },
  {
    question: "유효한 update는 언제 optimistic 또는 finalized가 됩니까?",
    answer:
      "동적 safety threshold를 넘으면 optimistic header를 전진시킬 수 있습니다. Finalized header는 2/3 이상 참여와 유효한 finality branch 등 더 강한 조건을 통과해야 갱신됩니다.",
    actor: "light client update rule",
    object: "active participants > safety threshold · 또는 3n ≥ 2N",
    receipt: "optimistic header 또는 finalized header 갱신",
    next: "그러면 sync committee 서명과 finality는 왜 같은 말이 아닐까요?",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 결과는 ${scene.receipt}입니다.`,
);

export default function SyncCommitteeLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 서명에서 light-client header까지"
      title="V37이 R100에 남긴 한 표가 subnet·block·update를 거쳐 쓰이는 경로"
      description="각 단계에서 새로 확정되는 사실과 아직 확정되지 않은 사실을 구분합니다."
      note="V37, slot 100·101과 R100은 설명용입니다. 512 positions, 4 subnets와 검증 경계는 고정한 사양과 Prysm v7.3.1 source를 따릅니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Sync committee 서명 전달 경로 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[39rem] space-y-4 sm:min-h-[35rem] xl:min-h-[30rem]"
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.25fr)_minmax(14rem,0.75fr)]">
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
                  이 단계의 주체
                </p>
                <p className="mt-2 break-words border-l-2 border-primary pl-3 text-xs font-black leading-5">
                  {scene.actor}
                </p>
                <p className="mt-4 text-[9px] font-bold text-muted-foreground">
                  판단 재료
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5 sm:text-xs">
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

            <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-black" aria-label="Mainnet sync subcommittee 구간">
              {[0, 1, 2, 3].map((subnet) => (
                <div
                  key={subnet}
                  className={`border px-1 py-2 ${
                    subnet === 2 && scenes.active >= 2 && scenes.active <= 4
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  subnet {subnet} · 128 positions
                </div>
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Sync committee 서명 전달 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
