import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "요청 고정",
  "주 저장",
  "복제",
  "체인 결속",
  "증명 시작",
  "검증·정산",
  "완료 판정",
] as const;

const SCENES = [
  {
    title: "Alice가 1 GiB 파일을 두 제공자에게 보관해 달라고 요청합니다",
    detail:
      "파일 바이트, 기대한 Piece CID, 제공자 수, 체인·계약·SDK 버전과 결제 토큰을 한 요청으로 고정합니다. 같은 파일이어도 이 문맥이 다르면 같은 서비스 실행이 아닙니다.",
    bytes: "Alice의 원본 1 GiB",
    chain: "dataset 없음",
    proof: "아직 없음",
    money: "승인·잔액 사전 확인",
    result: "업로드 전",
  },
  {
    title: "SDK가 첫 제공자에게 바이트를 보내 Piece CID를 확인합니다",
    detail:
      "store 성공은 제공자가 바이트를 받았다는 오프체인 사실입니다. 아직 dataset에 piece가 올라가지 않았으므로 이 시점의 데이터를 온체인 보관 완료라고 부르면 안 됩니다.",
    bytes: "주 제공자에 저장",
    chain: "여전히 미등록",
    proof: "challenge 대상 아님",
    money: "streaming 지급 전",
    result: "store receipt",
  },
  {
    title: "두 번째 제공자가 첫 제공자에게서 같은 Piece CID를 가져옵니다",
    detail:
      "Synapse SDK v2는 기본적으로 주 제공자 한 곳에 올린 뒤 보조 제공자가 provider-to-provider로 가져가게 합니다. 일부 복제만 성공하면 complete=false로 남겨야 합니다.",
    bytes: "주·보조 제공자 사본",
    chain: "각 context는 아직 미등록",
    proof: "각 제공자별 준비",
    money: "복제 자체는 정산 아님",
    result: "pull 결과",
  },
  {
    title: "SDK가 성공한 제공자별 dataset에 piece를 commit합니다",
    detail:
      "commit은 저장된 바이트를 payer·provider·dataset·payment rail과 연결합니다. store 뒤 commit이 모두 실패하면 데이터는 제공자에 있지만 체인에는 없는 별도 실패 상태입니다.",
    bytes: "Piece CID 유지",
    chain: "piece·dataset·rail 결속",
    proof: "아직 첫 period 전",
    money: "rate·lockup 예약",
    result: "on-chain commit",
  },
  {
    title: "첫 nextProvingPeriod가 평생 사용할 period 기준점을 만듭니다",
    detail:
      "piece 추가는 rate와 필요한 lockup을 먼저 갱신하지만, 첫 활성화 경계 이전 epoch는 streaming 지급 대상이 아닙니다. ‘요금을 예약했다’와 ‘지급받을 기간이 생겼다’를 구별합니다.",
    bytes: "등록된 dataset 유지",
    chain: "activation epoch A",
    proof: "첫 deadline 예약",
    money: "A 이전 streaming 0",
    result: "proving 활성화",
  },
  {
    title:
      "Filecoin Pay가 Warm Storage에 proven epoch 수를 물어 정산액을 줄입니다",
    detail:
      "proven period는 금액에 기여하고, deadline이 지난 faulted period는 0원으로 cursor만 전진합니다. 아직 열린 마지막 period는 실패가 아니므로 그 앞에서 정산을 멈춥니다.",
    bytes: "proof가 가리키는 사본",
    chain: "(settledUpTo, target]",
    proof: "proven·faulted·open",
    money: "rate × proven epochs",
    result: "검증된 settlement",
  },
  {
    title:
      "복제 commit과 정산이 맞아도 실제 retrieval을 따로 시험한 뒤 완료로 표시합니다",
    detail:
      "SDK의 complete는 요청한 사본 commit 결과를 말합니다. 장기 운영 완료는 같은 Piece CID의 retrieval, canonical chain state, proof·rail reconciliation과 복구 책임까지 별도 gate로 확인해야 합니다.",
    bytes: "retrieval bytes 재해시",
    chain: "canonical dataset 확인",
    proof: "요구 period 판정 확인",
    money: "중복 정산 없음",
    result: "운영 release gate",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 현재 결과는 ${scene.result}입니다.`,
);

export function OnchainCloudFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8600, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Alice의 1 GiB 파일 1건 · 제공자 2곳 · 한 settlement 경로"
      title="파일을 받은 사실, 체인에 묶인 사실, 증명한 기간과 지급액은 서로 다른 완료 상태입니다"
      description="한 요청을 store, 복제, commit, proving 활성화, proof-gated settlement와 retrieval 확인까지 따라갑니다."
      note="1 GiB와 제공자 두 곳은 설명용 fixture입니다. 실제 기본 복제 수·가격·period·lockup은 사용 중인 SDK와 배포 계약에서 읽습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Filecoin Onchain Cloud 요청 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[49rem] space-y-4 sm:min-h-[34rem] xl:min-h-[29rem]"
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
                  {scene.result}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  앞 단계의 성공을 다음 단계의 성공으로 바꾸어 읽지 않습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["실제 바이트", scene.bytes],
                ["온체인 상태", scene.chain],
                ["보관 증명", scene.proof],
                ["결제·완료", scene.money],
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
            playLabel="한 파일의 저장·증명·정산 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}

export function PeriodStateViz() {
  const states = [
    [
      "PROVEN",
      "유효한 proof가 period bitmap에 기록됨",
      "해당 구간의 epoch가 지급액에 참여",
    ],
    [
      "FAULTED",
      "deadline이 지났지만 bitmap에 proof가 없음",
      "0원으로 settledUpTo만 전진",
    ],
    [
      "OPEN",
      "deadline 전이라 proof가 더 올 수 있음",
      "실패로 확정하지 않고 cursor 정지",
    ],
  ] as const;

  return (
    <VizFrame
      eyebrow="한 proving period를 읽는 세 가지 경우"
      title="0원을 내는 fault와 아직 계산할 수 없는 open은 같은 상태가 아닙니다"
      description="정산액과 정산 위치를 따로 보면 세 상태의 차이가 선명해집니다."
      documentFlow
      canvasClassName="p-3 sm:p-5"
    >
      <div data-viz-scene-stage className="grid gap-2 sm:grid-cols-3">
        {states.map(([state, fact, settlement]) => (
          <article
            key={state}
            className="min-w-0 border border-border bg-background p-4"
          >
            <p className="font-mono text-[10px] font-black text-primary">
              {state}
            </p>
            <p className="mt-3 break-keep text-xs font-bold leading-5">
              {fact}
            </p>
            <p className="mt-3 border-t border-border pt-3 text-[11px] leading-5 text-muted-foreground">
              정산 효과 · {settlement}
            </p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}

export function PaymentRailViz() {
  const fields = [
    ["funds", "payer가 실제로 맡긴 token 잔액"],
    ["operator approval", "service가 대신 만들 수 있는 rate·lockup 한도"],
    ["paymentRate", "한 epoch가 늘 때의 최대 gross 지급 속도"],
    ["lockupFixed", "일회성 lifecycle 비용을 위해 예약한 금액"],
    ["settledUpTo", "이 epoch까지 포함해 이미 정산했다는 cursor"],
  ] as const;

  return (
    <VizFrame
      eyebrow="payer account · rail · validator"
      title="Payment rail은 자동이체 한 건이 아니라 지급 한도와 진행 위치를 가진 장부입니다"
      description="잔액 하나만 보지 않고 권한, rate, reserve와 cursor를 함께 확인합니다."
      documentFlow
      canvasClassName="p-3 sm:p-5"
    >
      <div
        data-viz-scene-stage
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
      >
        {fields.map(([field, meaning], index) => (
          <article
            key={field}
            className={`min-w-0 border bg-background p-3 ${
              index === fields.length - 1
                ? "border-primary/60"
                : "border-border"
            }`}
          >
            <p className="font-mono text-[9px] font-black text-primary">
              {field}
            </p>
            <p className="mt-2 break-keep text-[11px] font-bold leading-5">
              {meaning}
            </p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
