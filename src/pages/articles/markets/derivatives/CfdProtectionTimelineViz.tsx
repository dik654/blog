import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["노출", "1% 충격", "청산선", "가격 틈", "잔액 보호", "시간표", "상품 이름", "경계"] as const;

const NOTES = [
  "현금 100에 주요 통화쌍의 설명용 30배를 적용하면 명목 노출은 3,000입니다. 레버리지 한도는 손실 속도를 정하는 출발선입니다.",
  "기초가격이 1% 불리하게 움직이면 손실은 30이고 다른 손익·비용이 없을 때 계좌 자금은 70으로 줄어듭니다.",
  "필요 증거금 100인 단순 계좌에서 순자산이 50으로 내려가면 50% 계좌 단위 강제청산선에 닿습니다.",
  "주말 가격 틈이나 급변에서는 시장이 청산선 너머에서 열릴 수 있어 실제 체결가격과 손실은 계산한 선을 넘을 수 있습니다.",
  "음수 잔액 보호는 급변 때 강제청산이 늦어져도 적용 대상 소매 CFD 계좌에서 넣은 총자금을 넘는 잔여채무를 막는 마지막 방어선입니다.",
  "거래 전 적정성·위험경고, 주문 때 레버리지 한도, 거래 중 계좌 청산, 급변 뒤 음수 잔액 보호가 서로 다른 시점에 작동합니다.",
  "영구선물이라는 이름이어도 레버리지로 기초자산 가격 차액을 지급하는 구조가 CFD 정의에 들면 같은 보호 조치를 검토합니다.",
  "소매·전문 고객, 기초자산, 계약법인, 계좌 범위와 최신 규칙을 확인하고 보호 장치를 원금 보장으로 읽지 않습니다.",
] as const;

type Panel = "exposure" | "shock" | "closeout" | "gap" | "negative" | "timeline" | "label" | "boundary";

const SCENES = [
  {
    title: "현금 100에 30배 레버리지를 적용하면 가격 노출은 3,000입니다",
    detail: "주요 통화쌍을 가정한 설명용 상단 배수이며 실제 한도는 고객과 기초자산·관할 규칙에 따라 달라집니다.",
    panel: "exposure",
    formula: "현금 100×레버리지 30=명목 노출 3,000",
    conclusion: "레버리지는 이익 가능성만 키우는 기능이 아니라 같은 가격 변화가 계좌 자금에 닿는 속도를 함께 키웁니다.",
  },
  {
    title: "가격이 1% 불리하게 움직이면 손실 30이 나고 계좌 자금은 70이 됩니다",
    detail: "스프레드·수수료·익일 자금비용과 다른 포지션이 없다는 단순 장부로 첫 충격을 계산합니다.",
    panel: "shock",
    formula: "손실=3,000×1%=30 · 계좌 순자산=100−30=70",
    conclusion: "기초자산의 1%는 작아 보여도 30배 계좌에서는 처음 넣은 돈의 30%가 한 번에 움직입니다.",
  },
  {
    title: "필요 증거금 100의 50%인 순자산 50에서 계좌 단위 강제청산선에 닿습니다",
    detail: "한 포지션만 있고 필요 증거금이 그대로라는 설명용 계산이며 실제 회사는 계좌 전체 포지션을 함께 봅니다.",
    panel: "closeout",
    formula: "50% 청산선=필요 증거금 100×0.5=순자산 50 · 누적손실 50",
    conclusion: "강제청산은 손실을 0으로 되돌리는 장치가 아니라 더 줄기 전에 하나 이상의 포지션을 닫기 시작하는 제동장치입니다.",
  },
  {
    title: "시장이 청산선 너머에서 다시 열리면 50보다 큰 손실 가격에 체결될 수 있습니다",
    detail: "가격 틈과 유동성 부족 때는 주문 가능한 첫 가격이 계산한 문턱보다 불리해 강제청산만으로 잔여채무를 막지 못합니다.",
    panel: "gap",
    formula: "계산 청산선 50 → 시장 가격 틈 → 실제 체결 순자산 20 또는 음수 가능",
    conclusion: "청산 임계값과 실제 체결값을 구분해야 다음 층인 음수 잔액 보호가 왜 별도로 필요한지 보입니다.",
  },
  {
    title: "음수 잔액 보호는 급변 뒤 넣은 총자금을 넘는 CFD 계좌 채무를 막는 마지막 층입니다",
    detail: "적용 대상 소매 계좌 기준이며 다른 상품·계좌·전문 고객의 의무까지 모두 없애는 일반 면책은 아닙니다.",
    panel: "negative",
    formula: "시장 급변 뒤 계산 잔액 −20 → 적용 대상 계좌 최종 고객 채무 하한 0",
    conclusion: "잔액 보호는 원금 손실을 막지 않고 계좌가 0이 된 뒤 추가로 빚지는 극단 상황의 범위를 제한합니다.",
  },
  {
    title: "적정성·위험경고·레버리지·강제청산·잔액 보호는 서로 다른 시점에 개입합니다",
    detail: "한 장치가 빠졌을 때 어느 위험이 다시 열리는지 보려면 고객 여정의 시간 순서로 나눠야 합니다.",
    panel: "timeline",
    formula: "거래 전 심사·경고 → 주문 한도 → 실시간 계좌 감시 → 50% 청산 → 급변 뒤 잔액 보호",
    conclusion: "CFD 보호 체계는 한 번의 승인이나 한 숫자가 아니라 거래 전·중·후의 연속된 통제입니다.",
  },
  {
    title: "‘영구선물’이라는 이름 대신 가격 차액·레버리지·청산·상대방 구조를 봅니다",
    detail: "ESMA는 2026년 레버리지 영구계약이 CFD 정의에 드는지 계약별로 판단하고 해당하면 기존 개입 조치를 적용하라고 알렸습니다.",
    panel: "label",
    formula: "상품 이름 ≠ 법적 분류 · 실제 권리·지급·담보·청산 → CFD 정의 대입",
    conclusion: "새 이름으로 포장한 상품도 경제적 지급 구조가 같다면 기존 소비자 보호의 적용 범위를 우회했다고 단정할 수 없습니다.",
  },
  {
    title: "고객 지위·기초자산·법인·계좌 범위를 남기고 보호를 안전 보증으로 읽지 않습니다",
    detail: "전문 고객 전환이나 해외 관계사 계좌는 더 큰 레버리지와 함께 소매 보호 일부를 잃게 할 수 있습니다.",
    panel: "boundary",
    formula: "소매·전문 + 기초자산 + 계약법인 + 계좌범위 + 적정성·비용·가격 틈",
    conclusion: "좋은 검토는 최대 배수보다 어떤 보호가 어느 계좌에 적용되고 어떤 손실은 그대로 남는지를 보여 줍니다.",
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

function ExposurePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="현금과 레버리지로 만든 CFD 명목 노출"><Box label="현금" value="100" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">×</span><Box label="레버리지" value="30배" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="명목 노출" value="3,000" active /></div>;
}

function ShockPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="1퍼센트 불리한 이동 뒤 CFD 계좌"><Box label="가격 변화" value="−1%" /><Box label="손실" value="−30" /><Box label="남은 순자산" value="70" active /></div>;
}

function CloseoutPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="계좌 단위 50퍼센트 강제청산선"><Box label="필요 증거금" value="100" /><Box label="50% 문턱" value="50" /><Box label="행동" value="포지션 청산" active /></div>;
}

function GapPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="가격 틈에서 달라지는 강제청산 결과"><Box label="계산 문턱" value="순자산 50" /><Box label="시장 재개" value="가격 틈" /><Box label="실제 체결" value="50 아래 가능" active /></div>;
}

function NegativePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="음수 잔액 보호의 마지막 방어선"><Box label="급변 뒤 계산" value="−20" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="보호 적용" value="초과 채무 제한" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="고객 잔액" value="0" active /></div>;
}

function TimelinePanel() {
  const steps = ["적정성", "위험경고", "레버리지", "50% 청산", "잔액 보호"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="소매 CFD 보호가 작동하는 시간 순서">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function LabelPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="영구선물 이름에서 CFD 지급 구조를 확인하는 과정"><Box label="화면 이름" value="영구선물" /><Box label="실제 구조" value="차액·레버리지" /><Box label="법적 확인" value="CFD 정의 대입" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="소매 CFD 보호의 다섯 적용 경계"><Box label="고객" value="소매·전문" /><Box label="상품" value="기초자산" /><Box label="상대" value="계약법인" /><Box label="범위" value="계좌 단위" /><Box label="잔여" value="비용·가격 틈" active /></div>;
}

export default function CfdProtectionTimelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11500, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="소매 CFD · 현금 100에서 강제청산과 잔액 보호까지"
      title="30배 노출의 손실 속도와 50% 청산선, 음수 잔액 보호가 서로 다른 시점에 작동합니다"
      description="현금 100으로 노출 3,000을 만든 뒤 1% 손실 30, 순자산 50의 강제청산선, 가격 틈과 마지막 잔액 보호까지 한 계좌로 추적합니다."
      note="금액과 단일 포지션은 보호 장치의 순서를 설명하기 위한 가정입니다. 실제 적용은 고객 지위·기초자산·계약법인·계좌 전체 포지션·비용과 최신 EU 국가조치 또는 영국 FCA 규칙을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-cfd-protection-timeline data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "exposure" && <ExposurePanel />}
          {scene.panel === "shock" && <ShockPanel />}
          {scene.panel === "closeout" && <CloseoutPanel />}
          {scene.panel === "gap" && <GapPanel />}
          {scene.panel === "negative" && <NegativePanel />}
          {scene.panel === "timeline" && <TimelinePanel />}
          {scene.panel === "label" && <LabelPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="소매 CFD 보호 시간표 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
