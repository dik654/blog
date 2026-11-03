import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "후보 발견",
  "후보 필터",
  "연결 시도",
  "신원 확인",
  "Status 검사",
  "활성 피어",
  "계속 평가",
] as const;

const SCENES = [
  {
    question:
      "Discv5에서 N42의 ENR를 받으면 바로 합의 데이터를 요청해도 됩니까?",
    answer:
      "아닙니다. ENR는 서명된 주소 안내문입니다. 지금 아는 것은 ‘이 node ID가 이 주소와 fork 정보를 광고했다’는 사실뿐입니다.",
    object: "node=N42 · ENR seq=12 · IP · TCP/QUIC · fork digest",
    receipt: "discovery candidate",
    next: "서명된 후보라면 모두 dial해야 합니까?",
  },
  {
    question: "서명된 후보라면 모두 dial해야 합니까?",
    answer:
      "Prysm은 주소 유효성, bad 상태, 이미 활성·연결됐는지, 재시도 가능 시각, fork digest를 먼저 확인합니다.",
    object: "valid address · !bad · !active · ready · same fork",
    receipt: "dial 가능한 candidate N42",
    next: "후보 통과가 곧 연결 성공입니까?",
  },
  {
    question: "후보 필터를 통과하면 곧바로 active peer가 됩니까?",
    answer:
      "아닙니다. Prysm은 timeout 안에서 libp2p host.Connect를 호출합니다. 실패하면 연결 오류를 기록하고 아직 active로 올리지 않습니다.",
    object: "PeerId + multiaddr · maxDialTimeout",
    receipt: "libp2p connection 또는 실패 이유",
    next: "소켓이 열렸다면 상대 신원도 확인된 것입니까?",
  },
  {
    question: "소켓이 열렸다면 상대 신원도 확인된 것입니까?",
    answer:
      "libp2p는 TCP 또는 QUIC 위에서 Noise 보안 채널을 만들고 PeerId를 확인한 뒤 여러 protocol stream을 함께 쓸 연결로 올립니다.",
    object: "transport → Noise identity → stream multiplexer",
    receipt: "인증된 libp2p connection",
    next: "PeerId가 맞으면 같은 Ethereum chain입니까?",
  },
  {
    question: "PeerId가 맞으면 같은 Ethereum chain을 따르는 피어입니까?",
    answer:
      "아닙니다. Status RPC에서 fork digest, 미래 head slot, finalized epoch와 root를 local chain과 대조합니다. outbound는 통과해야 Connected가 됩니다.",
    object: "fork digest · finalized root/epoch · head root/slot",
    receipt: "compatible chain status",
    next: "Status를 통과하면 그 피어의 모든 말이 진실입니까?",
  },
  {
    question: "Status를 통과하면 그 피어의 모든 말이 진실입니까?",
    answer:
      "아닙니다. 이제 gossip과 Req/Resp를 주고받을 자격만 생겼습니다. 블록·attestation·응답은 각각의 규칙으로 다시 검증합니다.",
    object: "connection state=Connected · protocol streams enabled",
    receipt: "active peer ≠ trusted data",
    next: "연결 뒤의 행동은 다음 선택에 어떻게 반영합니까?",
  },
  {
    question: "연결 뒤의 행동은 다음 피어 선택에 어떻게 반영합니까?",
    answer:
      "Bad response, chain status, GossipSub 결과와 block 제공 이력을 따로 계산합니다. 일부는 soft score에, terminal 오류는 즉시 bad 판정에 들어갑니다.",
    object: "bad responses · status · gossip · block provider",
    receipt: "유지 · prune · goodbye · 재시도 판단",
    next: "어느 하위 점수가 최종 합계와 차단을 만들까요?",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 결과는 ${scene.receipt}입니다.`,
);

export default function P2PPeerLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Discv5가 알려 준 후보 N42 한 개"
      title="주소를 발견한 뒤에도 신원과 체인 상태를 통과해야 비로소 합의 피어가 됩니다"
      description="같은 후보가 discovery record에서 active peer로 승격되고, 행동 결과에 따라 다시 퇴출될 때까지 따라갑니다."
      note="N42와 ENR sequence는 설명용입니다. 검사 순서와 상태 경계는 고정한 Prysm v7.3.1 source를 따릅니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Prysm 피어 승격 생명주기 탐색기"
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
            playLabel="Prysm 피어 승격 생명주기 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
