import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "입금 확정",
  "발행",
  "source 소각",
  "attestation",
  "destination 발행",
  "상환 소각",
  "은행 지급",
  "공시·사업",
] as const;

type Ledger = {
  reserve: number;
  ethereum: number;
  base: number;
  issue: number;
  cctp: number;
  payout: number;
};

const SCENES: readonly {
  question: string;
  answer: string;
  owner: string;
  event: string;
  result: string;
  stillOpen: string;
  ledger: Ledger;
}[] = [
  {
    question: "100달러가 은행에 들어오면 곧바로 100 USDC일까요?",
    answer:
      "아닙니다. 먼저 eligible Circle Mint 고객의 은행 입금이 확정됩니다. 이때 reserve 쪽에는 100이 들어왔지만, chain에는 아직 token이 없습니다.",
    owner: "bank rail → issuer settlement ledger",
    event: "USD 100 settled",
    result: "발행 대기 100",
    stillOpen: "어느 chain·address에 token을 만들지는 아직 확정되지 않았습니다.",
    ledger: { reserve: 100, ethereum: 0, base: 0, issue: 100, cctp: 0, payout: 0 },
  },
  {
    question: "그렇다면 아무 지갑이나 100 USDC를 만들 수 있을까요?",
    answer:
      "아닙니다. 승인된 minter가 pause·blacklist·mint allowance를 통과해야 Ethereum의 total supply와 고객 balance가 함께 100 늘어납니다.",
    owner: "Circle issuer control → FiatToken contract",
    event: "mint(customer, 100)",
    result: "Ethereum native supply 100",
    stillOpen: "거래소에서 보이는 1달러 가격은 이 contract가 직접 고정하지 않습니다.",
    ledger: { reserve: 100, ethereum: 100, base: 0, issue: 0, cctp: 0, payout: 0 },
  },
  {
    question: "25 USDC를 Base로 보낼 때 reserve의 달러도 이동할까요?",
    answer:
      "아닙니다. CCTP는 Ethereum의 native USDC 25를 소각하고 destination·recipient·amount·fee·finality가 든 message를 만듭니다. Reserve 100은 그대로입니다.",
    owner: "source TokenMessengerV2",
    event: "depositForBurn(25, Base, recipient)",
    result: "Ethereum 75 · CCTP 대기 25",
    stillOpen: "Source 소각만으로 Base balance가 생긴 것은 아닙니다.",
    ledger: { reserve: 100, ethereum: 75, base: 0, issue: 0, cctp: 25, payout: 0 },
  },
  {
    question: "Circle의 attestation은 reserve 100을 다시 증명할까요?",
    answer:
      "아닙니다. Iris attestation은 특정 source burn message가 요구한 confirmation 수준에 도달했다는 서명입니다. 월간 reserve assurance와 이름만 비슷하고 증명 대상은 다릅니다.",
    owner: "Circle Iris attestation service",
    event: "sign(message, executed finality)",
    result: "destination에서 검사할 message receipt",
    stillOpen: "Attestation을 destination contract에 제출해 nonce와 domain을 확인해야 합니다.",
    ledger: { reserve: 100, ethereum: 75, base: 0, issue: 0, cctp: 25, payout: 0 },
  },
  {
    question: "같은 attestation을 두 번 내면 Base에 50이 생길까요?",
    answer:
      "아닙니다. Destination MessageTransmitter는 signature·domain·caller·version과 unused nonce를 검사합니다. 한 번 사용한 nonce는 다시 쓸 수 없고, 성공한 25만 native USDC로 발행됩니다.",
    owner: "destination MessageTransmitterV2 → TokenMessengerV2",
    event: "receiveMessage(message, attestation)",
    result: "Ethereum 75 · Base 25",
    stillOpen: "Recipient application의 후속 hook 안전은 CCTP core가 대신 보장하지 않습니다.",
    ledger: { reserve: 100, ethereum: 75, base: 25, issue: 0, cctp: 0, payout: 0 },
  },
  {
    question: "Ethereum의 40 USDC를 소각하면 은행에 40달러가 도착했을까요?",
    answer:
      "아닙니다. 상환용 burn은 circulating supply를 40 줄입니다. 하지만 bank payout이 끝날 때까지는 고객에게 지급할 40이라는 별도 진행 상태가 남습니다.",
    owner: "Circle Mint redemption ledger → FiatToken burn",
    event: "burn(40)",
    result: "Ethereum 35 · 지급 대기 40",
    stillOpen: "은행 rail·규제·계정 상태를 통과해 실제 USD가 지급돼야 합니다.",
    ledger: { reserve: 100, ethereum: 35, base: 25, issue: 0, cctp: 0, payout: 40 },
  },
  {
    question: "상환은 언제 완전히 끝났다고 말할 수 있을까요?",
    answer:
      "고객 은행 계좌의 payout receipt까지 확인됐을 때입니다. 설명용 reserve는 100에서 60으로 줄고, 지급 대기 40도 0이 됩니다. Chain에는 Ethereum 35와 Base 25가 남습니다.",
    owner: "issuer treasury → banking partner → customer bank",
    event: "USD 40 paid",
    result: "Reserve 60 · native supply 합계 60",
    stillOpen: "이 한 건의 완료가 모든 holder의 즉시 상환이나 시장가격 1달러를 보장하지 않습니다.",
    ledger: { reserve: 60, ethereum: 35, base: 25, issue: 0, cctp: 0, payout: 0 },
  },
  {
    question: "그러면 무엇을 보고 USDC 전체가 맞는지 판단할까요?",
    answer:
      "같은 cutoff의 chain별 outstanding supply와 reserve report를 맞춥니다. 여기에 direct redemption 자격·pending payout·CCTP message·admin control을 따로 봅니다. Circle의 사업 수익은 reserve 수익에서 큰 distribution·transaction 비용이 빠지는 구조입니다.",
    owner: "issuer disclosure · accountant · chain indexer · operations",
    event: "same-cutoff reconciliation",
    result: "Backing·이동·지급·사업을 서로 다른 주장으로 검증",
    stillOpen: "Monthly assurance는 real-time proof, market-price guarantee나 모든 holder의 Circle 계정을 뜻하지 않습니다.",
    ledger: { reserve: 60, ethereum: 35, base: 25, issue: 0, cctp: 0, payout: 0 },
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 결과는 ${scene.result}입니다.`,
);

const LEDGER_LABELS: readonly [keyof Ledger, string][] = [
  ["reserve", "설명용 reserve"],
  ["ethereum", "Ethereum supply"],
  ["base", "Base supply"],
  ["issue", "발행 대기"],
  ["cctp", "CCTP 대기"],
  ["payout", "은행 지급 대기"],
] as const;

export default function UsdcLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9800, { loop: false });
  const scene = SCENES[scenes.active];
  const tracked =
    scene.ledger.ethereum +
    scene.ledger.base +
    scene.ledger.issue +
    scene.ledger.cctp +
    scene.ledger.payout;

  return (
    <VizFrame
      eyebrow="한 고객의 100달러를 끝까지 추적"
      title="입금·두 체인·상환 사이에서 100이라는 값은 어디에 있을까요?"
      description="Token supply가 줄어든 순간에도 사라진 가치가 발행 대기·CCTP message·은행 지급 대기 중 어디에 남는지 봅니다."
      note="100·25·40과 Ethereum→Base는 설명용이며 fee를 0으로 둡니다. ‘추적 가치’는 이해를 위한 운영 장부로 Circle의 공식 회계식이나 reserve assurance 기준이 아닙니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="USDC 100달러 원장 이동 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[39rem] space-y-3 sm:min-h-[34rem] xl:min-h-[31rem]"
          >
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`min-w-0 border px-1 py-2 text-center text-[8px] font-black leading-4 sm:text-[9px] ${
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
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생긴 꼬리 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 owner
                </p>
                <p className="mt-2 break-words border-l-2 border-primary pl-3 text-xs font-black leading-5">
                  {scene.owner}
                </p>
                <p className="mt-4 text-[9px] font-bold text-muted-foreground">
                  실제 사건
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.event}
                </p>
              </article>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {LEDGER_LABELS.map(([key, label]) => (
                <article key={key} className="min-w-0 border border-border bg-background p-2.5">
                  <p className="break-keep text-[8px] font-bold leading-4 text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-sm font-black tabular-nums">
                    {scene.ledger[key]}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-2">
              <article className="min-w-0 border border-primary/60 bg-background p-3">
                <p className="text-[8px] font-bold text-muted-foreground">추적 가치</p>
                <p className="mt-1 font-mono text-sm font-black">{tracked}</p>
                <p className="mt-1 break-keep text-[8px] leading-4 text-muted-foreground">
                  supply + 세 pending bucket
                </p>
              </article>
              <article className="min-w-0 border border-amber-500/50 bg-amber-500/5 p-3">
                <p className="text-[8px] font-bold text-muted-foreground">아직 닫히지 않은 질문</p>
                <p className="mt-1 break-keep text-[9px] font-black leading-4 sm:text-[10px] sm:leading-5">
                  {scene.stillOpen}
                </p>
              </article>
            </div>

            <p className="break-keep border-l-2 border-primary pl-3 text-[10px] font-black leading-5">
              새로 확정된 결과 · {scene.result}
            </p>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="USDC 100달러 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
