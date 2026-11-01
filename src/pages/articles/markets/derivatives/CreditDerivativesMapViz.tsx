import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["보호", "역할", "지급", "강도", "판단", "트랜치", "공동", "경계"] as const;

const NOTES = [
  "은행은 회사채 1억 원을 계속 보유하면서 CDS 보호를 삽니다. 연 2% 프리미엄은 단순 연 200만 원입니다.",
  "기준기업, 보호매수자, 보호매도자와 신용사건·경매 결정 절차를 구분합니다. 기준기업은 CDS 계약의 당사자가 아닐 수 있습니다.",
  "신용사건 뒤 회수 가격이 액면의 40%이면 보호 지급은 1억 원×60%=6,000만 원입니다.",
  "평평한 한 해 근사에서는 스프레드 2%를 손실률 60%로 나눠 연 부도 도착 세기 약 3.33%를 읽습니다.",
  "회사 뉴스가 바로 지급이 되는 것이 아니라 계약상 신용사건, 인도 가능한 채무, 경매와 최종가격 40을 차례로 확정합니다.",
  "1억 원 지수의 0~3% 트랜치는 첫 300만 원, 3~7% 트랜치는 다음 400만 원의 손실을 받습니다.",
  "개별 평균 부도율이 같아도 여러 기업이 함께 무너지면 손실분포의 꼬리와 선순위 트랜치 위험이 달라집니다.",
  "기준채무 불일치, 보호매도자 부도, 담보와 회수율, 공동 충격을 남기고 신용보호를 완전한 손실 제거로 읽지 않습니다.",
] as const;

type Panel = "protection" | "roles" | "payout" | "intensity" | "process" | "tranche" | "joint" | "boundary";

const SCENES = [
  {
    title: "회사채 1억 원을 보유한 채 연 200만 원을 내고 부도 손실을 옮깁니다",
    detail: "채권의 소유권과 고객 관계는 유지하면서 계약이 정한 신용사건의 손실만 별도 상대에게 이전합니다.",
    panel: "protection",
    formula: "명목 1억 원 × 연 CDS 스프레드 2% = 단순 연 프리미엄 200만 원",
    conclusion: "CDS는 회사의 모든 어려움을 보상하는 보험이 아니라 기준기업·채무·사건·결제가 정해진 파생계약입니다.",
  },
  {
    title: "기준기업과 보호를 사고파는 두 당사자, 사건을 판단하는 절차를 나눕니다",
    detail: "채권을 발행한 회사와 손실 보전을 약속한 상대를 섞으면 기준기업 부도와 상대방 부도를 구분할 수 없습니다.",
    panel: "roles",
    formula: "기준기업 · 보호매수자 → 프리미엄 · 보호매도자 → 손실 지급 · 결정 절차",
    conclusion: "보호매도자가 기준기업과 함께 약해지면 채권 손실이 날 때 보호금도 받지 못하는 잘못된 방향의 위험이 생깁니다.",
  },
  {
    title: "경매 회수 가격이 40이면 액면 100과의 차이 60이 보호 지급입니다",
    detail: "현금결제에서는 정한 최종가격과 액면의 차이를 지급하고, 현물결제에서는 인도 가능한 부실채권과 액면을 교환합니다.",
    panel: "payout",
    formula: "1억 원×(1−40%)=6,000만 원 · 회수 4,000만 원 + 보호 6,000만 원",
    conclusion: "어느 채무가 인도 가능하고 누가 최종가격을 정하는지에 따라 기대한 채권 손실과 실제 정산이 달라질 수 있습니다.",
  },
  {
    title: "스프레드 2%와 손실률 60%의 단순 근사는 연 도착 세기 약 3.33%입니다",
    detail: "여러 지급일·할인·생존곡선과 선지급금을 뺀 직관용 계산이며 실제 부도확률과 그대로 같지 않습니다.",
    panel: "intensity",
    formula: "단순 λ≈CDS 스프레드÷손실률=2%÷60%≈3.33%/년",
    conclusion: "상품의 돈 흐름을 이해하는 계산과 만기별 위험강도곡선 보정은 다음 글에서 별도 단계로 다룹니다.",
  },
  {
    title: "뉴스에서 신용사건 판단·경매·최종가격·현금결제까지 순서대로 진행합니다",
    detail: "공통 결정 절차는 많은 계약이 같은 사건을 제각각 해석하는 일을 줄이지만 개별 확인서의 범위를 대신하지 않습니다.",
    panel: "process",
    formula: "질문 제출 → 신용사건 결정 → 인도채무 확정 → 경매 → 최종가격 40 → 손실 60 지급",
    conclusion: "회사 사정이 나쁘다는 평가와 계약상 지급 조건이 성립했다는 결정은 같은 문장이 아닙니다.",
  },
  {
    title: "지수 손실 500만 원은 0~3% 구간 300을 먼저 없애고 다음 구간 200을 줄입니다",
    detail: "명목 1억 원의 포트폴리오에서 누적손실을 시작점과 끝점이 다른 계약들이 순서대로 나눠 받습니다.",
    panel: "tranche",
    formula: "손실 500만 원 → 0~3%: 300만 원 전액 · 3~7%: 다음 200만 원 · 상위 구간: 0",
    conclusion: "같은 명목원금이어도 첫 손실 구간과 선순위 구간은 손실분포의 서로 다른 부분을 거래합니다.",
  },
  {
    title: "평균 부도율이 같아도 공동 충격이 커지면 손실이 한 시점에 몰립니다",
    detail: "작은 독립 부도가 자주 나타나는 장부와 여러 기업이 함께 무너지는 장부는 선순위 트랜치의 꼬리위험이 다릅니다.",
    panel: "joint",
    formula: "개별 부도·회수 + 기업 간 결합 → 포트폴리오 손실분포 → 트랜치별 기대손실",
    conclusion: "트랜치 가격은 평균 부도 하나가 아니라 누가 함께 무너지는지와 손실 순서에 민감합니다.",
  },
  {
    title: "기준채무·상대방·담보·공동부도의 네 경계를 남깁니다",
    detail: "보유 채권과 CDS가 다르거나 법적 사건이 성립하지 않거나 보호매도자가 약해지면 헤지 결과가 어긋납니다.",
    panel: "boundary",
    formula: "기준채무 일치 + 사건 정의 + 보호매도자 신용·담보 + 회수율 + 공동부도 스트레스",
    conclusion: "좋은 보고서는 프리미엄 절감보다 보호가 실패하는 경로와 결제 뒤 남는 노출을 함께 보여 줍니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Box({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function ProtectionPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="회사채 보유와 CDS 보호"><Box label="보유 회사채" value="1억 원 유지" /><Box label="연 프리미엄" value="200만 원 지급" /><Box label="신용사건 보호" value="손실 보전 약속" active /></div>;
}

function RolesPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="CDS의 네 역할"><Box label="기준기업" value="채권 발행자" /><Box label="보호매수자" value="프리미엄 지급" /><Box label="보호매도자" value="손실 지급" /><Box label="결정 절차" value="사건·경매 판단" active /></div>;
}

function PayoutPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="회수 가격에서 CDS 보호 지급 계산"><Box label="액면" value="1억 원" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">−</span><Box label="회수 가격" value="4,000만 원" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="보호 지급" value="6,000만 원" active /></div>;
}

function IntensityPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="CDS 스프레드와 손실률의 단순 부도강도 근사"><Box label="CDS 스프레드" value="2%" /><Box label="손실률" value="60%" /><Box label="단순 도착 세기" value="약 3.33%" active /></div>;
}

function ProcessPanel() {
  const steps = ["사건 질문", "결정", "인도채무", "경매", "현금결제"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="신용사건 판단부터 CDS 결제까지">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function TranchePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="누적손실 500만 원의 트랜치별 배분"><Box label="0~3%" value="첫 300만 원 전액" active /><Box label="3~7%" value="다음 200만 원" /><Box label="7% 위" value="이번 손실 0" /></div>;
}

function JointPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="독립 부도와 공동 충격의 손실분포 비교"><Box label="흩어진 부도" value="작은 손실이 여러 시점" /><Box label="공동 충격" value="큰 손실이 한 시점 · 선순위 영향" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="신용보호의 다섯 실패 경계"><Box label="채무" value="보유물과 기준 일치" /><Box label="사건" value="계약 정의" /><Box label="상대" value="보호매도자 신용" /><Box label="담보" value="결제 가능성" /><Box label="공동" value="잘못된 방향" active /></div>;
}

export default function CreditDerivativesMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="신용파생 · 회사채 1억 원의 보호와 손실 순서"
      title="회사채 손실을 CDS로 옮기고 사건 판단·경매·트랜치까지 추적합니다"
      description="연 프리미엄 200만 원과 회수 40%에서 출발해 보호 지급 6,000만 원, 단순 부도강도 3.33%, 사건 결정 절차와 지수 손실의 트랜치 배분을 연결합니다."
      note="명목 1억 원, 스프레드 2%, 회수 40%와 지수 손실 500만 원은 작동 원리를 설명하기 위한 가정입니다. 실제 계약은 적용 정의·확인서·지급일·선지급금·인도채무와 경매 규칙을 따릅니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-credit-derivatives-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "protection" && <ProtectionPanel />}
          {scene.panel === "roles" && <RolesPanel />}
          {scene.panel === "payout" && <PayoutPanel />}
          {scene.panel === "intensity" && <IntensityPanel />}
          {scene.panel === "process" && <ProcessPanel />}
          {scene.panel === "tranche" && <TranchePanel />}
          {scene.panel === "joint" && <JointPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="신용파생상품 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
