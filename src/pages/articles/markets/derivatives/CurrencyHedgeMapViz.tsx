import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["위험", "순노출", "금리", "선도", "과다 헤지", "베이시스", "조정", "경계"] as const;

const NOTES = [
  "수출회사는 석 달 뒤 100만 달러를 받습니다. 환율이 1,350원에서 1,250원으로 내리면 같은 달러 매출의 원화 환산액이 1억 원 줄어들므로 사업 이익에 환율 방향이 섞입니다.",
  "같은 날 달러 원가 20만 달러를 내야 한다면 실제로 원화 환율에 노출된 금액은 80만 달러입니다. 받는 돈과 내는 돈의 통화와 날짜를 맞춰 순노출부터 계산합니다.",
  "현물 1,350원, 원화 금리 3%, 달러 금리 5%, 기간 0.25년을 넣습니다. 두 통화의 같은 만기 원리금을 맞추면 석 달 선도환율은 약 1,343원입니다.",
  "회사는 순노출 80만 달러를 약 1,343원에 팔아 약 10억7,467만 원을 고정합니다. 선도포인트 약 −7원은 미래 환율 예측이 아니라 두 통화 금리와 결제 조건이 만든 상대 가격입니다.",
  "100만 달러 전부를 선도 매도했는데 실제 매출이 60만 달러라면 40만 달러가 부족합니다. 회사는 부족한 달러를 시장에서 사서 약속을 이행해야 하므로 판매량 감소가 새 환율 포지션으로 바뀝니다.",
  "이론 선도환율은 두 무위험 금리의 관계에서 나오지만 실제 은행 호가에는 달러 조달 수요, 신용 한도, 딜러의 대차대조표 비용과 교차통화 베이시스가 더해집니다.",
  "확정 채권과 예상 주문을 나누고, 결제일 변경·주문 취소·원가 변화를 반영해 헤지 수량과 만기를 계속 고칩니다. 한 번 체결하고 잊는 계약이 아닙니다.",
  "환율이 유리하게 움직일 기회, 증거금과 담보 현금, 거래상대방 위험, 회계상 손익 시점은 별도 장부로 남습니다. 좋은 환헤지는 총액보다 통화·날짜별 순노출과 취소 시 행동을 보여 줍니다.",
] as const;

type Panel = "risk" | "net" | "rates" | "forward" | "over" | "basis" | "adjust" | "boundary";

const SCENES = [
  {
    title: "석 달 뒤 받을 100만 달러는 환율이 100원 내리면 원화 매출이 1억 원 줄어듭니다",
    detail: "수출 이익과 환율 방향이 한 장부에 섞인 상태에서 시작합니다.",
    panel: "risk",
    formula: "100만 달러 × (1,350원 − 1,250원) = 1억 원",
    conclusion: "헤지할 대상은 달러 매출이라는 이름이 아니라 환율 변화가 실제 원화 현금에 미치는 금액입니다.",
  },
  {
    title: "받을 100만 달러에서 같은 날 낼 원가 20만 달러를 빼면 순노출은 80만 달러입니다",
    detail: "사업 안에서 이미 서로 상쇄되는 달러 현금흐름을 먼저 제거합니다.",
    panel: "net",
    formula: "받을 돈 100만 − 낼 돈 20만 = 순노출 80만 달러",
    conclusion: "총매출 100만 달러를 전부 헤지하면 자연 헤지된 20만 달러까지 다시 팔게 됩니다.",
  },
  {
    title: "원화 3%와 달러 5%를 같은 석 달 만기로 옮기면 두 통화의 원리금이 달라집니다",
    detail: "현물환율에 금리 차이가 붙는 이유를 분자와 분모로 나눕니다.",
    panel: "rates",
    formula: "원화 배수 1.0075 · 달러 배수 1.0125 · 기간 0.25년",
    conclusion: "달러 금리가 더 높으면 이 가정에서 원화 기준 선도환율은 현물 1,350원보다 낮아집니다.",
  },
  {
    title: "현물 1,350원에 두 금리 배수를 적용하면 석 달 선도는 약 1,343원입니다",
    detail: "순노출 80만 달러를 이 가격에 팔아 원화 수입을 고정합니다.",
    panel: "forward",
    formula: "1,350 × 1.0075 ÷ 1.0125 ≈ 1,343원",
    conclusion: "80만 달러의 설명용 고정액은 약 10억7,467만 원이며 선도는 미래 현물환율 예보가 아닙니다.",
  },
  {
    title: "100만 달러를 미리 팔았는데 실제 매출이 60만 달러면 40만 달러를 새로 사야 합니다",
    detail: "환율 위험을 줄이려다 판매량 변화가 반대 통화 포지션을 만드는 경우입니다.",
    panel: "over",
    formula: "선도 매도 100만 − 실제 수취 60만 = 부족 40만 달러",
    conclusion: "예상 거래와 확정 채권의 헤지 비율을 같게 두면 주문 취소가 과다 헤지로 바뀔 수 있습니다.",
  },
  {
    title: "이론 선도와 실제 은행 호가 사이에는 교차통화 베이시스와 조달 제약이 들어갑니다",
    detail: "금리식에서 벗어난 차이를 계산 오류나 환율 전망으로만 읽지 않습니다.",
    panel: "basis",
    formula: "실제 호가 = 금리평가 선도 + 조달·신용·유동성·장부 비용",
    conclusion: "달러 조달 수요와 딜러 한도가 바뀌면 같은 금리 차이에서도 헤지 비용이 달라질 수 있습니다.",
  },
  {
    title: "확정 거래와 예상 주문을 나누고 결제일과 금액이 바뀔 때 계약도 함께 줄이거나 늘립니다",
    detail: "환헤지는 한 번의 가격 선택이 아니라 노출 장부와 계약 장부를 맞추는 과정입니다.",
    panel: "adjust",
    formula: "노출 갱신 → 헤지 비율 검토 → 수량·만기 조정 → 다시 측정",
    conclusion: "수량과 날짜가 실제 현금흐름을 따라가지 않으면 환율을 고정해도 베이시스 위험이 남습니다.",
  },
  {
    title: "선도 계약 뒤에도 유리한 환율의 포기·담보 현금·상대방·회계 시점 위험이 남습니다",
    detail: "고정된 환율 한 숫자와 서비스 전체의 안전성을 구분합니다.",
    panel: "boundary",
    formula: "경제적 헤지 ≠ 회계상 헤지 ≠ 현금 유동성 ≠ 계약 이행",
    conclusion: "좋은 보고서는 통화·날짜별 순노출, 헤지 비율, 상대방, 담보와 취소 시 행동을 함께 보여 줍니다.",
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

function Operator({ children }: { children: string }) {
  return <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground sm:text-base">{children}</div>;
}

function RiskPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="환율 하락 전후 원화 매출 비교">
      <Cell title="오늘 환율" value="1달러 1,350원" />
      <Operator>→</Operator>
      <Cell title="결제일 환율" value="1달러 1,250원 · 매출 −1억 원" active />
    </div>
  );
}

function NetPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-1 sm:gap-2" aria-label="달러 매출에서 달러 원가를 뺀 순통화노출">
      <Cell title="달러 매출" value="+100만" />
      <Operator>−</Operator>
      <Cell title="달러 원가" value="20만" />
      <Operator>=</Operator>
      <Cell title="순노출" value="80만 달러" active />
    </div>
  );
}

function RatesPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="원화와 달러의 석 달 금리 배수">
      <Cell title="기간" value="0.25년" />
      <Cell title="원화 3%" value="1 + 0.03×0.25 = 1.0075" active />
      <Cell title="달러 5%" value="1 + 0.05×0.25 = 1.0125" />
    </div>
  );
}

function ForwardPanel() {
  return (
    <div className="space-y-2 sm:space-y-3" aria-label="두 통화 금리로 계산한 선도환율과 고정 원화액">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-1 sm:gap-2">
        <Cell title="현물" value="1,350원" />
        <Operator>×</Operator>
        <Cell title="원화÷달러 배수" value="1.0075÷1.0125" />
        <Operator>=</Operator>
        <Cell title="석 달 선도" value="약 1,343원" active />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4">
        <Cell title="순노출" value="80만 달러" />
        <Operator>→</Operator>
        <Cell title="원화 고정액" value="약 10억7,467만 원" active />
      </div>
    </div>
  );
}

function OverPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-1 sm:gap-2" aria-label="예상 매출 감소로 생기는 과다 헤지">
      <Cell title="선도 매도" value="100만 달러" />
      <Operator>−</Operator>
      <Cell title="실제 매출" value="60만 달러" />
      <Operator>=</Operator>
      <Cell title="시장 매수 필요" value="40만 달러" active />
    </div>
  );
}

function BasisPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1.2fr] items-stretch gap-2 sm:gap-4" aria-label="이론 선도환율과 실제 시장 호가의 차이">
      <Cell title="금리평가 식" value="현물·두 통화 금리" />
      <Operator>+</Operator>
      <Cell title="시장 조달 마찰" value="달러 수요·신용·유동성·장부 비용" active />
    </div>
  );
}

function AdjustPanel() {
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="순통화노출과 헤지 계약을 반복 조정하는 순서">
      <Cell title="1" value="노출 갱신" />
      <Cell title="2" value="확정·예상 구분" active />
      <Cell title="3" value="수량·만기 조정" />
      <Cell title="4" value="결과 재측정" />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-3" aria-label="선도 환헤지 뒤에도 남는 네 위험">
      <Cell title="기회비용" value="유리한 환율도 포기" />
      <Cell title="유동성" value="담보·증거금 현금" />
      <Cell title="이행" value="거래상대방 위험" active />
      <Cell title="회계" value="손익 인식 시점" />
    </div>
  );
}

export default function CurrencyHedgeMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="환헤지 · 100만 달러 매출의 전체 지도"
      title="총매출이 아니라 같은 날짜의 순통화노출부터 헤지합니다"
      description="석 달 뒤 받을 100만 달러에서 달러 원가 20만 달러를 빼고, 순노출 80만 달러를 약 1,343원에 고정한 뒤 과다 헤지·교차통화 베이시스·계약 조정까지 연결합니다."
      note="환율·금리·매출은 작동 원리를 설명하기 위한 가정입니다. 실제 선도 호가에는 통화 순서, 복리와 일수 관행, 매수·매도 차이, 신용 한도, 담보와 교차통화 베이시스가 반영됩니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-currency-hedge-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "risk" && <RiskPanel />}
          {scene.panel === "net" && <NetPanel />}
          {scene.panel === "rates" && <RatesPanel />}
          {scene.panel === "forward" && <ForwardPanel />}
          {scene.panel === "over" && <OverPanel />}
          {scene.panel === "basis" && <BasisPanel />}
          {scene.panel === "adjust" && <AdjustPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="환헤지 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
