import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["약속", "가격", "역산", "재투자", "민감도", "곡선", "경계"] as const;

const NOTES = [
  "액면 100, 표면금리 3%, 만기 3년 채권은 1년 뒤 3, 2년 뒤 3, 3년 뒤 103을 지급하기로 한 약속입니다. 채권을 사는 오늘의 가격과 미래에 받을 금액을 먼저 나눕니다.",
  "할인율 3%에서 3·3·103을 각각 오늘 값 2.91·2.83·94.26으로 바꾸어 더하면 가격은 100입니다. 먼 현금일수록 더 오래 할인됩니다.",
  "시장 가격이 94.55로 먼저 관측되면 계산 방향을 거꾸로 돌립니다. 세 현금흐름의 현재가치 합이 94.55가 되게 하는 할인율을 찾으면 만기수익률은 약 5%입니다.",
  "만기수익률 5%가 실제 수익률이 되려면 1년과 2년 뒤 받은 이자도 5%로 다시 굴려야 합니다. 만기까지 보유한다는 조건만으로는 재투자 금리가 정해지지 않습니다.",
  "같은 채권에서 수익률이 3%에서 4%로 1%포인트 오르면 가격은 100에서 약 97.22로 내려갑니다. 듀레이션은 이 작은 변화의 기울기를 요약하고, 변화가 커지면 볼록성 보정이 필요합니다.",
  "실제로는 1년·3년·10년 현금흐름에 같은 할인율 하나를 쓰지 않습니다. 만기별 금리를 점으로 놓아 수익률곡선을 만들고 각 시점의 현금흐름을 해당 만기의 할인율로 되돌립니다.",
  "이 계산은 약속된 현금흐름이 그대로 지급된다는 범위 안에서 작동합니다. 부도 가능성, 중도상환 선택권, 현금흐름이 정해지지 않은 주식은 추가 가정과 다른 평가 절차가 필요합니다.",
] as const;

type Panel = "promise" | "price" | "solve" | "reinvest" | "sensitivity" | "curve" | "boundary";

const SCENES = [
  {
    title: "채권 한 장은 오늘의 가격과 세 번의 약정 지급을 연결합니다",
    detail: "먼저 누가 언제 얼마를 주기로 했는지 시간표로 고정합니다.",
    panel: "promise",
    formula: "오늘 가격 P ↔ 1년 3 · 2년 3 · 3년 103",
    conclusion: "표면금리 3%는 액면 100에 곱해 매년 받을 이자 3을 정하는 계약 조건입니다.",
  },
  {
    title: "세 현금흐름을 3%로 오늘에 모으면 가격은 100입니다",
    detail: "각 지급액과 그 시점의 할인계수를 곱한 뒤 합칩니다.",
    panel: "price",
    formula: "2.91+2.83+94.26=100",
    conclusion: "할인율이 커지면 각 현재가치가 작아지므로 같은 약속의 가격은 내려갑니다.",
  },
  {
    title: "시장 가격 94.55를 설명하는 할인율을 거꾸로 찾으면 약 5%입니다",
    detail: "가격이 먼저 주어졌을 때 식의 미지수를 수익률로 바꿉니다.",
    panel: "solve",
    formula: "94.55=3/(1+y)+3/(1+y)²+103/(1+y)³ → y≈5%",
    conclusion: "만기수익률은 별도의 시장 정보가 아니라 관측 가격을 한 숫자로 다시 표현한 값입니다.",
  },
  {
    title: "만기수익률이 실현되려면 중간 이자도 같은 수익률로 다시 굴려야 합니다",
    detail: "만기 보유와 이자 재투자를 서로 다른 조건으로 봅니다.",
    panel: "reinvest",
    formula: "실현 결과=만기 원금·이자+중간 이자의 재투자 결과",
    conclusion: "만기수익률은 채권을 비교하는 공통 척도이지 미래의 실제 수익률을 보장하는 값이 아닙니다.",
  },
  {
    title: "수익률이 1%포인트 오르면 가격은 100에서 약 97.22로 내려갑니다",
    detail: "듀레이션은 가격곡선 한 점의 기울기를 변화율로 요약합니다.",
    panel: "sensitivity",
    formula: "y: 3%→4% · P: 100→97.22 · 변화율≈−2.78%",
    conclusion: "현금이 늦게 들어오는 채권일수록 할인율 변화에 더 오래 노출돼 듀레이션이 커집니다.",
  },
  {
    title: "만기마다 다른 금리를 이으면 수익률곡선이 됩니다",
    detail: "한 할인율로 모든 시점을 처리한 단순 계산을 만기별 구조로 확장합니다.",
    panel: "curve",
    formula: "1년 2.6% · 3년 3.1% · 10년 3.8%",
    conclusion: "곡선의 모양에는 앞으로의 단기금리 기대와 기간 프리미엄이 함께 섞여 있습니다.",
  },
  {
    title: "가격 식이 설명하는 범위와 추가로 확인할 위험을 분리합니다",
    detail: "고정된 약속, 지급 실패, 선택권, 남는 몫의 청구권을 구분합니다.",
    panel: "boundary",
    formula: "고정 현금흐름 평가 + 신용위험·선택권·불확실한 현금흐름",
    conclusion: "채권 가격식을 이해한 뒤에야 회사채 스프레드와 주식 가치에서 무엇이 새로 필요한지 보입니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[8px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function Arrow() {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">→</span>;
}

function PromisePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="채권의 오늘 가격과 세 번의 미래 현금흐름">
      <Stage title="오늘" detail="가격 P 지급" strong />
      <Arrow />
      <Stage title="1년" detail="이자 3" />
      <Arrow />
      <Stage title="2년" detail="이자 3" />
      <Arrow />
      <Stage title="3년" detail="이자 3+원금 100" />
    </div>
  );
}

function PricePanel() {
  const rows = [["1년 3", "×0.9709", "2.91"], ["2년 3", "×0.9426", "2.83"], ["3년 103", "×0.9151", "94.26"]] as const;
  return (
    <div className="space-y-1.5" aria-label="채권 현금흐름의 현재가치 계산">
      {rows.map(([cash, factor, value]) => (
        <div key={cash} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-border pb-1.5 text-center text-[8px] font-black sm:text-xs">
          <span>{cash}</span><span className="font-mono text-muted-foreground">{factor}</span><span className="text-primary">{value}</span>
        </div>
      ))}
    </div>
  );
}

function SolvePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="시장 가격에서 만기수익률을 찾는 과정">
      <Stage title="시장 가격" detail="94.55" strong />
      <Arrow />
      <Stage title="가격 식" detail="y를 바꿔 반복" />
      <Arrow />
      <Stage title="만기수익률" detail="약 5%" />
    </div>
  );
}

function ReinvestPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="만기수익률 실현에 필요한 재투자 조건">
      <Stage title="1년 이자 3" detail="다시 투자" />
      <Arrow />
      <Stage title="2년 이자 3" detail="다시 투자" />
      <Arrow />
      <Stage title="만기 지급 103" detail="보유 종료" strong />
    </div>
  );
}

function SensitivityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="수익률 상승에 따른 채권 가격 하락">
      <Stage title="수익률 3%" detail="가격 100" />
      <div className="text-center"><p className="font-mono text-xs font-black text-primary">+1%p →</p><p className="mt-1 text-[7px] font-bold text-muted-foreground sm:text-[10px]">가격 −2.78%</p></div>
      <Stage title="수익률 4%" detail="가격 97.22" strong />
    </div>
  );
}

function CurvePanel() {
  const points = [["1년", "2.6%"], ["3년", "3.1%"], ["10년", "3.8%"]] as const;
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-4" aria-label="만기별 금리로 만든 우상향 수익률곡선">
      {points.map(([term, rate], index) => (
        <div key={term} className={`border-b-2 px-2 text-center ${index === 2 ? "border-primary pb-5" : index === 1 ? "border-foreground/60 pb-3" : "border-border pb-1"}`}>
          <p className="font-mono text-[10px] font-black sm:text-sm">{rate}</p>
          <p className="mt-1 text-[8px] font-bold text-muted-foreground sm:text-xs">{term}</p>
        </div>
      ))}
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="채권 가격식의 범위와 추가 평가 요소">
      <Stage title="고정 약속" detail="이 글의 가격 식" strong />
      <Stage title="부도" detail="신용 스프레드" />
      <Stage title="선택권" detail="현금흐름 변화" />
      <Stage title="주식" detail="남는 몫 추정" />
    </div>
  );
}

export default function BondPricingMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="채권 · 한 약속의 전체 지도"
      title="3·3·103의 약속이 가격, 수익률, 금리 위험과 곡선으로 이어지는 과정"
      description="한 채권의 현금흐름을 할인해 가격을 만들고, 시장 가격에서 수익률을 역산한 뒤 민감도와 만기별 금리 구조까지 확장합니다."
      note="액면·표면금리·시장 가격과 만기별 금리는 설명용 가정입니다. 약속된 지급이 이행되고 세금·거래비용이 없다고 둔 뒤, 마지막 장면에서 이 범위를 벗어나는 위험을 구분합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-bond-pricing-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "promise" && <PromisePanel />}
          {scene.panel === "price" && <PricePanel />}
          {scene.panel === "solve" && <SolvePanel />}
          {scene.panel === "reinvest" && <ReinvestPanel />}
          {scene.panel === "sensitivity" && <SensitivityPanel />}
          {scene.panel === "curve" && <CurvePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="채권 가격과 수익률 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
