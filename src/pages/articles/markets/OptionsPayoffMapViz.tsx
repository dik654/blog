import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["권리", "조건", "90", "108", "120", "양쪽", "단위", "반복"] as const;

const NOTES = [
  "콜 매수자는 프리미엄 8을 먼저 내고 만기에 100으로 살지 선택합니다. 매도자는 8을 받지만 매수자가 요구하면 100으로 팔아야 합니다. 권리와 의무가 비대칭이어서 손익 모양도 달라집니다.",
  "계약에는 기초자산, 행사가격 100, 만기, 한 계약이 묶는 단위, 실물 또는 현금결제를 적습니다. 화면의 8과 20에 계약 승수를 곱해야 실제 지급액이 됩니다.",
  "만기 가격이 90이면 100에 살 이유가 없으므로 행사하지 않습니다. 행사 가치는 0이고 이미 낸 프리미엄 8만 남아 순손익은 −8입니다.",
  "만기 가격이 108이면 100에 살 권리의 행사 가치는 8입니다. 처음 낸 프리미엄 8과 같아 순손익은 0이 됩니다. 행사가격 100과 손익분기점 108은 다릅니다.",
  "만기 가격이 120이면 행사 가치는 20입니다. 여기서 프리미엄 8을 빼면 콜 매수자의 순이익은 12입니다. 가격 상승을 맞힌 것만으로 프리미엄이 자동 회수되는 것은 아닙니다.",
  "만기 가격 120에서 매수자는 +12, 매도자는 −12입니다. 가격이 90 이하이면 매수자는 −8, 매도자는 +8입니다. 주식을 보유하지 않은 콜 매도자의 손실은 주가와 함께 계속 커질 수 있습니다.",
  "표준 미국 주식옵션이 100주를 묶는다면 120에서 차액 20은 2000달러이고 프리미엄 8은 800달러입니다. 포인트당 25만 원인 지수옵션이라면 같은 12포인트 순손익은 300만 원입니다.",
  "콜 매도자가 프리미엄 8을 열 번 받아 80을 벌어도 주가 200인 한 계약에서 92를 잃으면 합계는 −12입니다. 반복 전략은 작은 이익의 빈도뿐 아니라 드문 손실의 크기와 담보 요구를 함께 봐야 합니다.",
] as const;

type Panel = "rights" | "terms" | "p90" | "p108" | "p120" | "mirror" | "multiplier" | "repeat";

const SCENES = [
  {
    title: "프리미엄 8은 불리하면 거래하지 않을 권리와 요청받으면 이행할 의무의 가격입니다",
    detail: "콜 매수자와 매도자 사이에서 돈·선택·의무가 언제 이동하는지 먼저 봅니다.",
    panel: "rights",
    formula: "지금: 매수자 −8 → 매도자 +8 · 만기: 매수자가 행사 여부 선택",
    conclusion: "매수자는 손실 한도를 사고 매도자는 그 한도를 제공하는 대가로 프리미엄을 받습니다.",
  },
  {
    title: "100에 살 권리는 만기·계약 단위·결제 방식이 있어야 실제 지급액이 됩니다",
    detail: "같은 20의 차액도 1주, 100주, 지수 1포인트에서 현금 규모가 달라집니다.",
    panel: "terms",
    formula: "기초자산 · 행사가격 100 · 만기 · 승수 · 결제 방식",
    conclusion: "호가 화면의 숫자만 보고 최대 손실과 필요한 현금을 정할 수 없습니다.",
  },
  {
    title: "만기 가격 90에서는 행사하지 않고 처음 낸 8만 잃습니다",
    detail: "시장가격보다 비싼 100으로 살 의무가 없으므로 행사 가치는 0입니다.",
    panel: "p90",
    formula: "max(90−100, 0) − 8 = −8",
    conclusion: "가격이 행사가격 아래로 내려가도 콜 매수자의 손실은 프리미엄 8에서 멈춥니다.",
  },
  {
    title: "만기 가격 108에서는 행사 가치 8이 프리미엄 8과 같아집니다",
    detail: "권리를 행사할 수 있는 구간과 순이익이 시작되는 구간을 나눕니다.",
    panel: "p108",
    formula: "max(108−100, 0) − 8 = 0",
    conclusion: "콜의 손익분기점은 행사가격이 아니라 행사가격과 프리미엄을 더한 108입니다.",
  },
  {
    title: "만기 가격 120에서는 행사 가치 20에서 프리미엄 8을 빼 순이익 12가 남습니다",
    detail: "주가 상승, 행사 가치, 최종 순손익을 한 계산으로 연결합니다.",
    panel: "p120",
    formula: "max(120−100, 0) − 8 = 12",
    conclusion: "방향을 맞혔는지가 아니라 상승폭이 구입비를 넘었는지가 최종 손익을 정합니다.",
  },
  {
    title: "같은 계약의 매수자와 매도자 손익은 부호가 반대지만 손실 한도는 다릅니다",
    detail: "가격 90과 120에서 두 장부를 나란히 놓습니다.",
    panel: "mirror",
    formula: "가격 90: 매수 −8·매도 +8 · 가격 120: 매수 +12·매도 −12",
    conclusion: "무담보 콜 매도자는 받은 8보다 훨씬 큰 손실과 중간 담보 요구를 만날 수 있습니다.",
  },
  {
    title: "한 단위 순이익 12에 계약 승수를 곱해야 실제 현금 손익이 됩니다",
    detail: "미국 주식옵션 100주와 포인트당 25만 원인 지수옵션의 가정을 비교합니다.",
    panel: "multiplier",
    formula: "12×100주=1200달러 · 12포인트×25만 원=300만 원",
    conclusion: "같은 손익 그래프도 계약 승수·통화·결제 방식에 따라 계좌에서 움직이는 돈이 다릅니다.",
  },
  {
    title: "프리미엄 8을 열 번 받아도 한 번의 92 손실이 누적 이익을 넘을 수 있습니다",
    detail: "자주 이기는 전략처럼 보여도 드문 큰 손실과 담보 부담을 함께 계산합니다.",
    panel: "repeat",
    formula: "10×(+8) + (−92) = −12",
    conclusion: "옵션은 위험 모양을 바꾸는 계약이지 작은 이익을 반복하면 안전해지는 계약이 아닙니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Cell({ title, value, active = false }: { title: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{title}</p>
      <p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow() {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">→</span>;
}

function RightsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="콜옵션의 권리와 의무 교환">
      <Cell title="콜 매수자" value="8 지급 · 행사 여부 선택" active />
      <div className="flex items-center justify-center"><Arrow /></div>
      <Cell title="콜 매도자" value="8 수취 · 요청받으면 이행" />
    </div>
  );
}

function TermsPanel() {
  const terms = ["기초자산", "행사가 100", "만기", "계약 승수", "결제 방식"];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2" aria-label="옵션 지급액을 결정하는 계약 조건">
      {terms.map((term, index) => <Cell key={term} title={`${index + 1}`} value={term} active={index === 1} />)}
    </div>
  );
}

function PayoffPanel({ price }: { price: 90 | 108 | 120 }) {
  const exercise = Math.max(price - 100, 0);
  const net = exercise - 8;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label={`만기 가격 ${price}에서 콜 매수 손익 계산`}>
      <Cell title="만기 가격" value={String(price)} />
      <div className="font-mono text-sm font-black text-muted-foreground">→</div>
      <Cell title="행사 가치" value={String(exercise)} />
      <div className="font-mono text-sm font-black text-muted-foreground">− 8</div>
      <Cell title="순손익" value={net > 0 ? `+${net}` : String(net)} active />
    </div>
  );
}

function MirrorPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="콜 매수자와 매도자의 반대 손익">
      <Cell title="가격 90" value="매수 −8 · 매도 +8" />
      <Cell title="가격 120" value="매수 +12 · 매도 −12" active />
    </div>
  );
}

function MultiplierPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="옵션 계약 승수에 따른 실제 현금 손익">
      <Cell title="미국 주식옵션 가정" value="12 × 100주 = 1200달러" />
      <Cell title="지수옵션 가정" value="12 × 25만 원 = 300만 원" active />
    </div>
  );
}

function RepeatPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="옵션 매도 반복 이익과 큰 손실의 합계">
      <Cell title="작은 이익" value="8 × 10회 = +80" />
      <div className="font-mono text-sm font-black text-muted-foreground">+</div>
      <Cell title="한 번의 큰 손실" value="−92" />
      <div className="font-mono text-sm font-black text-muted-foreground">=</div>
      <Cell title="누적 결과" value="−12" active />
    </div>
  );
}

export default function OptionsPayoffMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="옵션 · 콜 한 계약의 전체 지도"
      title="100에 살 권리를 8에 사면 만기 가격이 108을 넘어야 순이익입니다"
      description="프리미엄을 먼저 주고받는 권리·의무부터 만기 가격 90·108·120의 손익, 매수자와 매도자의 반대 장부, 계약 승수와 반복 매도의 큰 손실까지 같은 콜옵션으로 추적합니다."
      note="가격과 프리미엄은 계산을 설명하기 위한 가정입니다. 실제 옵션의 승수, 행사·배정 방식, 증거금, 결제 시점, 세금과 수수료는 상품·관할·계좌 조건에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-options-payoff-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "rights" && <RightsPanel />}
          {scene.panel === "terms" && <TermsPanel />}
          {scene.panel === "p90" && <PayoffPanel price={90} />}
          {scene.panel === "p108" && <PayoffPanel price={108} />}
          {scene.panel === "p120" && <PayoffPanel price={120} />}
          {scene.panel === "mirror" && <MirrorPanel />}
          {scene.panel === "multiplier" && <MultiplierPanel />}
          {scene.panel === "repeat" && <RepeatPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="옵션 손익 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
