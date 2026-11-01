import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["권리", "경로", "가격", "괴리", "수익", "부도", "재설정", "확인"] as const;

const NOTES = [
  "ETF 한 좌는 펀드가 보유한 자산 묶음의 지분입니다. ETN 한 장은 발행 금융회사가 지수에 따라 돈을 지급하겠다는 무담보 채무입니다.",
  "ETF에서는 투자자의 돈이 펀드 재산과 연결되고 자산 보관 장부가 남습니다. ETN에서는 투자자가 발행자의 지급 약속을 삽니다. 거래소는 두 상품의 매수·매도를 연결하지만 권리의 종류를 바꾸지 않습니다.",
  "순자산 1억 원을 1만 좌로 나누면 ETF 한 좌의 NAV는 1만 원입니다. 시장에서 1만100원에 체결되면 100원, 1%의 괴리가 생깁니다.",
  "AP가 자산 바스켓을 1만 원에 조달해 ETF 한 좌를 만들고 1만100원에 팔 때 비용이 60원이면 40원이 남습니다. 비용이 130원이면 30원 손실이라 괴리를 줄일 거래가 성립하지 않습니다.",
  "1만100원에 산 상품을 1만1000원에 팔면 이익은 900원이고 수익률은 약 8.91%입니다. 기초 자산이 10% 올라도 처음에 NAV보다 비싸게 산 만큼 실제 수익률은 낮습니다.",
  "ETN이 약정상 1만1000원을 지급할 차례여도 발행자가 부도나 40%만 회수하면 4400원을 받습니다. 1만100원 매수가와 비교한 손실은 5700원입니다. ETF는 펀드 재산을 기준으로 청구하므로 손실 경로가 다릅니다.",
  "지수가 100에서 110으로 오른 뒤 100으로 돌아오면 일일 2배 상품은 100→120→98.18이 됩니다. 매일 바뀐 펀드 가치에 다음 날 2배 노출을 다시 맞추기 때문입니다.",
  "매수 전에는 기초 자산보다 먼저 법적 권리, NAV와 체결가, 설정·환매가 작동할 조건, 발행자와 계약 상대방, 일일 재설정 여부, 비용과 환율을 확인합니다.",
] as const;

type Panel = "claim" | "path" | "price" | "arbitrage" | "return" | "default" | "reset" | "check";

const SCENES = [
  {
    title: "같은 지수를 따라도 ETF는 자산 지분이고 ETN은 발행자의 채무입니다",
    detail: "거래 화면의 등락률보다 부도 때 누구에게 무엇을 청구하는지 먼저 봅니다.",
    panel: "claim",
    formula: "ETF = 펀드 재산의 지분 · ETN = 발행자의 지급 약속",
    conclusion: "상품 이름이 비슷해도 손실을 회수하는 법적 경로는 다릅니다.",
  },
  {
    title: "ETF의 돈은 자산 묶음으로 가고 ETN의 돈은 발행자 채무와 연결됩니다",
    detail: "거래소는 매매를 연결하지만 펀드 재산과 발행자 신용을 대신하지 않습니다.",
    panel: "path",
    formula: "투자자 → 거래소 → 펀드 자산 또는 발행자 채무",
    conclusion: "판매 장소와 실제 지급 재원을 분리해야 한 회사의 실패가 어디로 번지는지 알 수 있습니다.",
  },
  {
    title: "ETF 한 좌의 NAV와 지금 체결되는 시장가격은 따로 정해집니다",
    detail: "1억 원의 순자산을 1만 좌로 나눈 뒤 시장 체결가와 비교합니다.",
    panel: "price",
    formula: "1억 원 ÷ 1만 좌 = NAV 1만 원 · 체결가 1만100원 · 괴리 +1%",
    conclusion: "자산이 10% 오르는 것과 1만100원에 산 투자자의 수익률은 같은 계산이 아닙니다.",
  },
  {
    title: "괴리는 AP가 자산과 ETF 좌수를 바꿔 거래할 수 있을 때 줄어듭니다",
    detail: "100원의 가격 차이에서 설정·매도 비용을 빼 거래 유인을 확인합니다.",
    panel: "arbitrage",
    formula: "괴리 100원 − 비용 60원 = +40원 · 비용 130원이면 −30원",
    conclusion: "AP가 있다는 사실만으로 NAV 가격에 언제나 팔 수 있는 것은 아닙니다.",
  },
  {
    title: "1만100원에 사서 1만1000원에 팔면 실제 수익률은 약 8.91%입니다",
    detail: "기초 자산의 상승률과 투자자가 지불한 가격을 같은 분모에 넣지 않습니다.",
    panel: "return",
    formula: "(1만1000원 − 1만100원) ÷ 1만100원 ≈ 8.91%",
    conclusion: "처음 낸 괴리와 거래비용이 기초 자산 수익에서 투자자가 실제로 얻는 몫을 바꿉니다.",
  },
  {
    title: "ETN의 계산식이 맞아도 발행자가 지급하지 못하면 회수액이 달라집니다",
    detail: "약정 지급액 1만1000원과 부도 뒤 40% 회수라는 별도 가정을 비교합니다.",
    panel: "default",
    formula: "1만1000원 × 40% = 4400원 · 매수가 대비 손실 5700원",
    conclusion: "ETN의 지수 성과와 발행자 신용은 서로 다른 위험입니다.",
  },
  {
    title: "일일 2배 상품은 매일 바뀐 가치에 다음 날 노출을 다시 맞춥니다",
    detail: "지수가 출발점으로 돌아와도 이틀 수익이 0%가 되지 않는 이유를 계산합니다.",
    panel: "reset",
    formula: "지수 100→110→100 · 일일 2배 100→120→98.18",
    conclusion: "하루 목표 배수와 여러 날 누적 수익의 단순 배수는 다릅니다.",
  },
  {
    title: "법적 권리와 가격 형성 조건을 확인한 뒤 비용과 수익을 비교합니다",
    detail: "실물·합성 ETF, ETN, 레버리지 상품에도 같은 읽기 순서를 적용합니다.",
    panel: "check",
    formula: "권리 → NAV·체결가 → 설정·환매 → 신용·상대방 → 재설정 → 비용",
    conclusion: "같은 지수를 추종한다는 한 줄만으로 상품의 손실 경로와 보유 기간을 정할 수 없습니다.",
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

function Arrow({ label }: { label?: string }) {
  return (
    <div className="text-center" aria-hidden="true">
      {label && <p className="mb-0.5 hidden text-[8px] font-bold text-muted-foreground sm:block">{label}</p>}
      <span className="font-mono text-sm font-black text-primary">→</span>
    </div>
  );
}

function ClaimPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="ETF 지분과 ETN 채무 청구권 비교">
      <Cell title="ETF" value="펀드 재산의 지분" active />
      <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground">≠</div>
      <Cell title="ETN" value="발행자에 대한 채권" />
    </div>
  );
}

function PathPanel() {
  return (
    <div className="grid grid-cols-[0.9fr_auto_0.9fr_auto_1.1fr] items-center gap-1 sm:gap-2" aria-label="투자자 돈이 ETF 자산 또는 ETN 채무로 이어지는 경로">
      <Cell title="투자자" value="1만100원" />
      <Arrow />
      <Cell title="거래소" value="매수·매도 연결" />
      <Arrow />
      <div className="grid gap-1.5">
        <Cell title="ETF" value="펀드 자산 장부" active />
        <Cell title="ETN" value="발행자 채무" />
      </div>
    </div>
  );
}

function PricePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="ETF 순자산가치와 시장가격의 괴리 계산">
      <Cell title="순자산" value="1억 원" />
      <Arrow label="÷ 1만 좌" />
      <Cell title="한 좌 NAV" value="1만 원" />
      <Arrow label="시장 주문" />
      <Cell title="체결가" value="1만100원 · +1%" active />
    </div>
  );
}

function ArbitragePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="AP 거래비용에 따른 괴리 축소 유인">
      <Cell title="설정·매도 비용 60원" value="100 − 60 = +40원" active />
      <Cell title="설정·매도 비용 130원" value="100 − 130 = −30원" />
    </div>
  );
}

function ReturnPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="ETF 매수가격에서 실제 수익률을 계산하는 과정">
      <Cell title="매수" value="1만100원" />
      <Arrow />
      <Cell title="매도" value="1만1000원" />
      <Arrow />
      <Cell title="실제 수익" value="900원 · 8.91%" active />
    </div>
  );
}

function DefaultPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="ETF 자산 청구와 ETN 발행자 부도 회수 비교">
      <Cell title="ETF" value="펀드 재산을 기준으로 정산" />
      <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground">vs</div>
      <Cell title="ETN 발행자 부도" value="1만1000원 × 40% = 4400원" active />
    </div>
  );
}

function ResetPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="지수 왕복과 일일 2배 상품의 재설정 경로 비교">
      <Cell title="기초지수" value="100 → 110 → 100" />
      <Cell title="일일 2배" value="100 → 120 → 98.18" active />
    </div>
  );
}

function CheckPanel() {
  const steps = ["법적 권리", "NAV·체결가", "설정·환매", "신용·상대방", "일일 재설정", "비용·환율"];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2" aria-label="ETF와 ETN을 매수하기 전 확인하는 여섯 단계">
      {steps.map((step, index) => <Cell key={step} title={`${index + 1}`} value={step} active={index === 0} />)}
    </div>
  );
}

export default function FundsEtfsEtnsMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="펀드·ETF·ETN · 한 매수의 전체 지도"
      title="1만100원으로 같은 지수를 사도 손에 쥔 권리와 손실 경로는 다릅니다"
      description="ETF의 펀드 지분과 ETN의 발행자 채무를 먼저 가른 뒤, NAV 괴리·설정과 환매·실제 수익·발행자 부도·일일 재설정을 같은 숫자로 연결합니다."
      note="금액과 회수율은 구조를 비교하기 위한 설명용 가정입니다. 규제 수치와 상품 조건은 관할·시점·설명서에 따라 달라지므로 본문의 날짜가 있는 공식 근거를 함께 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-funds-etfs-etns-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "claim" && <ClaimPanel />}
          {scene.panel === "path" && <PathPanel />}
          {scene.panel === "price" && <PricePanel />}
          {scene.panel === "arbitrage" && <ArbitragePanel />}
          {scene.panel === "return" && <ReturnPanel />}
          {scene.panel === "default" && <DefaultPanel />}
          {scene.panel === "reset" && <ResetPanel />}
          {scene.panel === "check" && <CheckPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="ETF와 ETN 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
