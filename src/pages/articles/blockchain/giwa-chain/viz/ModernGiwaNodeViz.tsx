import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "세대 고정",
  "빠른 관측",
  "L1 재구성",
  "Engine 전달",
  "EVM 실행",
  "확정 전진",
  "앱 승인",
] as const;

const SCENES = [
  {
    title: "먼저 ‘어느 체인 규칙을 실행할지’를 한 세대로 묶습니다",
    detail:
      "GIWA Sepolia chain ID 91342, genesis, rollup config, L1 실행·beacon 원천과 GIWA node v0.6.1을 함께 고정합니다. 이름이 같아도 이 묶음이 다르면 같은 검증 실행으로 취급하지 않습니다.",
    input: "chain 91342 · genesis · rollup",
    decision: "generation G 계산",
    state: "동기화 시작 전",
    effect: "외부 효과 금지",
  },
  {
    title: "Sequencer가 거래 T를 L2 block 120에 넣어 먼저 보여 줍니다",
    detail:
      "사용자는 빠르게 receipt를 받지만 이 시점의 120은 unsafe head입니다. ‘실행 결과가 보인다’는 사실과 ‘L1 데이터에서 다시 만들었다’는 사실은 아직 같지 않습니다.",
    input: "sequencer block 120 · T",
    decision: "unsafe branch로 수용",
    state: "unsafe 120 · safe 118",
    effect: "되돌릴 수 있는 미리보기만",
  },
  {
    title: "op-node가 Sepolia L1의 batch를 읽어 같은 payload를 다시 만듭니다",
    detail:
      "L1 block·receipt·beacon data와 batch frame을 활성 규칙대로 읽습니다. v0.6.1은 Glamsterdam 이후 L1 header를 검증할 수 있는 op-node v1.19.5를 사용합니다. 구버전이면 이 단계가 멈출 수 있습니다.",
    input: "canonical L1 · batch · config",
    decision: "payload P₁₂₀ derivation",
    state: "T의 L1 origin 확인 중",
    effect: "아직 외부 지급 보류",
  },
  {
    title: "op-node가 만든 payload를 인증된 Engine API로 넘깁니다",
    detail:
      "공유 JWT는 op-node가 op-reth의 비공개 Engine endpoint를 호출할 권한을 확인합니다. JWT가 맞는다는 사실은 payload가 올바르거나 L1 RPC가 정직하다는 증명이 아닙니다.",
    input: "payload · parent · fork choice",
    decision: "JWT 확인 뒤 Engine 호출",
    state: "실행 대기",
    effect: "호출 권한만 확인",
  },
  {
    title: "op-reth가 payload를 실행해 receipt와 state root를 계산합니다",
    detail:
      "op-reth는 parent state 위에서 T를 포함한 payload를 EVM으로 실행합니다. 기준 node와 payload hash·receipt·state root가 다르면 RPC가 살아 있어도 같은 chain을 검증한 것이 아닙니다.",
    input: "S₁₁₉ · P₁₂₀",
    decision: "EVM 실행과 root 비교",
    state: "T receipt 재현",
    effect: "실행 일치 확인",
  },
  {
    title: "L1에 실린 batch와 origin의 상태에 따라 head가 차례로 전진합니다",
    detail:
      "예제에서는 처음에 unsafe 120·safe 118·finalized 115입니다. block 120이 L1 batch에서 재구성되면 safe가 120으로, 그 L1 origin이 finalized되면 finalized도 120으로 전진합니다. L1 reorg가 나면 공통 origin까지 되감습니다.",
    input: "L1 canonicality · finality",
    decision: "ancestry와 origin 갱신",
    state: "unsafe → safe → finalized",
    effect: "정책별 승인 가능",
  },
  {
    title: "애플리케이션은 거래 가치와 되돌림 가능성에 맞는 head를 요구합니다",
    detail:
      "UI 미리보기는 unsafe를 쓸 수 있지만 배송·타망 지급은 safe 또는 finalized와 중복 방지 effect ID를 함께 확인합니다. Chain confirmation이 stablecoin 준비금이나 상환 가능성까지 보증하지는 않습니다.",
    input: "generation · receipt · head · effect ID",
    decision: "네 조건을 AND로 판정",
    state: "승인 또는 보류",
    effect: "정책을 통과한 효과만 1회 실행",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 현재 상태는 ${scene.state}입니다.`,
);

export default function ModernGiwaNodeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8400, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="GIWA Sepolia · 거래 T · L2 block 120"
      title="거래가 보이는 순간부터 외부 효과를 승인하는 순간까지 같은 증거 사슬을 따라갑니다"
      description="op-node가 무엇을 결정하고 op-reth가 무엇을 실행하는지, unsafe·safe·finalized가 언제 바뀌는지를 한 거래로 연결합니다."
      note="120·118·115는 설명용 높이입니다. 실제 운영에서는 높이만 보지 않고 block hash, L1 origin과 ancestry를 함께 확인합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="GIWA 거래와 node 검증 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[43rem] space-y-4 sm:min-h-[34rem] xl:min-h-[29rem]"
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.45fr)_minmax(13rem,0.55fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 답할 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계에서 확정된 것
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.state}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  앞 단계의 성공을 다음 단계의 성공으로 바꾸어 읽지 않습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["입력 증거", scene.input],
                ["이 단계의 판단", scene.decision],
                ["현재 head·상태", scene.state],
                ["허용할 효과", scene.effect],
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
            playLabel="GIWA 거래 T의 검증 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
