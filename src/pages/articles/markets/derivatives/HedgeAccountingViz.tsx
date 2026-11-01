import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["80% 지정", "경제적 상쇄", "문서화", "효과 요건", "보고일", "160% 불일치", "재조정", "중단"] as const;

const NOTES = [
  "변동금리 차입 100억 원 중 80억 원을 스왑으로 헤지하면 시작 시 지정 비율은 80÷100=80%입니다.",
  "금리가 1%포인트 오를 때 차입비용은 약 1억 원 늘고 스왑 수취액은 약 8,000만 원 늘어 설명용 순증가액은 2,000만 원입니다.",
  "헤지관계 시작 시 헤지대상·위험·헤지수단·위험관리 목적·비율·효과 평가 방법을 공식 지정하고 문서화합니다.",
  "회계상 효과 요건은 경제적 관계, 신용위험의 비지배, 실제 수량에서 나온 헤지비율을 함께 확인합니다.",
  "각 보고일에는 가치 변화를 비교하고 예상한 비효과 원인과 실제 비효과를 기록하며 문서를 갱신합니다.",
  "차입금이 50억 원으로 줄었는데 지정 스왑이 80억 원이면 비율은 80÷50=160%가 됩니다.",
  "위험관리 목적이 유지되고 수량 조정으로 효과 요건을 다시 충족할 수 있으면 비효과를 먼저 인식하고 지정량을 재조정합니다.",
  "목적이 끝났거나 적격 요건을 더는 충족하지 못하면 재조정으로 억지로 이어 가지 않고 해당 부분의 헤지회계를 앞으로 중단합니다.",
] as const;

type Panel = "ratio" | "offset" | "document" | "effectiveness" | "report" | "mismatch" | "rebalance" | "stop";

const SCENES = [
  {
    title: "차입 100억 원 중 스왑 80억 원을 지정하면 시작 헤지비율은 80%입니다",
    detail: "경제적으로 스왑을 체결한 사실과 회계상 어떤 위험을 얼마만큼 지정했는지를 따로 기록합니다.",
    panel: "ratio",
    formula: "지정 스왑 80억 ÷ 헤지대상 차입 100억=80%",
    conclusion: "헤지회계는 파생상품을 보유했다는 이유로 자동 시작되지 않으며 회사가 선택한 관계와 비율에서 출발합니다.",
  },
  {
    title: "금리 1%포인트 상승 때 차입비용 1억 원 중 스왑이 약 8,000만 원을 상쇄합니다",
    detail: "날짜·기준금리·신용스프레드·할인 차이를 빼고 명목금액만 맞춘 설명용 계산입니다.",
    panel: "offset",
    formula: "100억×1%=+1억 비용 · 80억×1%=−0.8억 상쇄 · 순증가 0.2억",
    conclusion: "현금 위험이 줄었다는 경제적 결과와 재무제표에서 손익을 어떻게 표시할지는 서로 다른 판단입니다.",
  },
  {
    title: "시작일에 대상·위험·수단·목적·비율·평가 방법을 한 문서로 연결합니다",
    detail: "결과가 좋았던 거래를 보고기간 말에 골라 사후 지정하지 않습니다.",
    panel: "document",
    formula: "헤지대상 + 위험요소 + 헤지수단 + 목적·전략 + 헤지비율 + 효과 평가",
    conclusion: "IFRS 9의 공식 지정과 문서화는 어느 손익을 어떤 위험관리 관계로 읽을지 시작 시점에 고정합니다.",
  },
  {
    title: "효과 요건은 경제적 관계·신용위험·실제 수량에서 나온 비율을 함께 봅니다",
    detail: "가치 변화가 완벽히 같아야 한다는 뜻이 아니라 상쇄 관계를 왜곡하는 지정인지 확인합니다.",
    panel: "effectiveness",
    formula: "경제적 관계 있음 · 신용위험이 지배하지 않음 · 실제 헤지 수량과 같은 비율",
    conclusion: "명목금액 비율만 맞아도 기준금리와 지급일이 다르면 비효과가 생길 수 있습니다.",
  },
  {
    title: "보고일마다 가치 변화와 비효과 원인을 비교하고 문서를 갱신합니다",
    detail: "헤지대상과 수단의 변화, 신용위험, 기준금리 차이와 예상 현금흐름의 변화를 함께 봅니다.",
    panel: "report",
    formula: "가치 변화 측정 → 효과 요건 확인 → 비효과 인식 → 근거 문서 갱신",
    conclusion: "처음 지정이 통과했어도 관계가 유지되는지는 계속 평가해야 하며 현금위험과 회계표시를 둘 다 추적합니다.",
  },
  {
    title: "차입이 50억 원으로 줄고 스왑 80억 원이 남으면 지정 비율은 160%가 됩니다",
    detail: "조기상환으로 실제 위험이 줄었는데 기존 스왑을 그대로 두면 초과 헤지가 새로운 금리 방향을 만듭니다.",
    panel: "mismatch",
    formula: "스왑 80억 ÷ 남은 차입 50억=160%",
    conclusion: "처음의 80% 지정이 시간이 지나도 같은 의미라고 가정하지 않고 실제 노출 수량을 다시 확인합니다.",
  },
  {
    title: "위험관리 목적이 같다면 비효과를 먼저 인식하고 지정 수량을 다시 맞춥니다",
    detail: "수량 조정으로 효과 요건을 회복할 수 있을 때 기존 헤지관계의 계속으로 재조정합니다.",
    panel: "rebalance",
    formula: "기존 80억 지정 → 비효과 인식 → 지정량 50억으로 조정 → 50÷50=100%",
    conclusion: "재조정은 불리한 손익을 숨기는 새 지정이 아니라 같은 목적을 유지하며 헤지비율을 복구하는 절차입니다.",
  },
  {
    title: "목적이 끝났거나 요건을 회복할 수 없으면 해당 부분의 헤지회계를 앞으로 중단합니다",
    detail: "경제적 헤지를 계속 보유할 수 있어도 회계상 관계가 자동으로 계속되는 것은 아닙니다.",
    panel: "stop",
    formula: "목적 유지+요건 회복 가능=재조정 · 목적 종료 또는 요건 실패=장래 중단",
    conclusion: "경제적 위험 감소, 헤지회계의 손익 표시와 파생상품의 현금·담보 위험을 별도 장부로 설명해야 합니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function RatioPanel({ mismatch = false }: { mismatch?: boolean }) {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label={mismatch ? "차입 감소 뒤 헤지비율" : "헤지 시작 시 지정 비율"}><Tile label="헤지대상 차입" value={mismatch ? "50억" : "100억"} /><Tile label="지정 스왑" value="80억" /><Tile label="헤지비율" value={mismatch ? "160%" : "80%"} active /></div>;
}

function OffsetPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="금리 상승 때 차입과 스왑의 경제적 상쇄"><Tile label="차입비용" value="+1.0억" /><span className="font-mono text-xs font-black">−</span><Tile label="스왑 상쇄" value="0.8억" /><span className="font-mono text-xs font-black">=</span><Tile label="순증가" value="0.2억" active /></div>;
}

function DocumentPanel() {
  const items = ["대상", "위험", "수단", "목적", "비율", "평가"];
  return <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-3" aria-label="헤지관계 시작 시 문서화할 항목">{items.map((item, index) => <Tile key={item} label={`${index + 1}번`} value={item} active={index === items.length - 1} />)}</div>;
}

function EffectivenessPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="헤지 효과의 세 요건"><Tile label="관계" value="경제적 상쇄" /><Tile label="신용위험" value="가치변화 비지배" /><Tile label="비율" value="실제 수량과 일치" active /></div>;
}

function ReportPanel() {
  const steps = ["측정", "요건", "비효과", "갱신"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="보고일 헤지관계 평가 절차">{steps.map((step, index) => <Tile key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function RebalancePanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="헤지비율 재조정"><Tile label="재조정 전" value="80÷50=160%" /><span className="font-mono text-xs font-black">→</span><Tile label="지정량 조정" value="50÷50=100%" active /></div>;
}

function StopPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="헤지회계 재조정과 중단의 경계"><Tile label="목적 유지·회복 가능" value="재조정" /><Tile label="목적 종료·요건 실패" value="장래 중단" active /></div>;
}

export default function HedgeAccountingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="헤지회계 · 지정·효과·재조정"
      title="차입 100억과 스왑 80억을 시작일 지정부터 160% 불일치까지 추적합니다"
      description="경제적 상쇄와 회계상 지정의 경계를 먼저 나누고, 문서화·효과 평가·재조정·중단이 어떤 상태 변화인지 한 관계를 따라가며 확인합니다."
      note="금액과 1%포인트 충격은 절차를 설명하기 위한 가정입니다. 실제 회계 처리는 적용 기준서, 계약 조건, 보고기간과 회사의 위험관리 문서를 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-hedge-accounting data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "ratio" && <RatioPanel />}
          {scene.panel === "offset" && <OffsetPanel />}
          {scene.panel === "document" && <DocumentPanel />}
          {scene.panel === "effectiveness" && <EffectivenessPanel />}
          {scene.panel === "report" && <ReportPanel />}
          {scene.panel === "mismatch" && <RatioPanel mismatch />}
          {scene.panel === "rebalance" && <RebalancePanel />}
          {scene.panel === "stop" && <StopPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="헤지회계 지정과 재조정 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
