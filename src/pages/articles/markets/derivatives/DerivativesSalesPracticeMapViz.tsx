import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["노출", "계약", "손실", "규칙", "대안", "상담", "증거", "경계"] as const;

const NOTES = [
  "수출기업이 한 달 뒤 실제로 받을 달러는 1억 달러입니다. 먼저 입금 시점·취소 가능성·기존 헤지를 확인합니다.",
  "제안 구조는 환율 상승 시 2억 달러를 약정 환율로 팔 의무를 만들 수 있습니다. 실제 노출을 넘는 1억 달러가 새 위험입니다.",
  "시장 환율이 약정 환율보다 200원 높다면 초과 1억 달러를 구해 넘기는 단순 차액은 200억 원입니다.",
  "판매자가 권유하면 적합성, 권유 없이 법정 위험상품을 찾으면 적정성 절차가 중심입니다. 적용 범위는 고객·상품·경로별로 확인합니다.",
  "단순 선도, 옵션 매수, 거래하지 않기와 구조화 계약을 같은 노출·기간·비용·최악손실 조건에서 비교합니다.",
  "고객 정보 파악, 불리한 시나리오 계산, 설명, 고객의 되짚기, 승인·주문, 사후 노출 재검토를 한 흐름으로 잇습니다.",
  "고객 정보, 계산·설명 자료, 녹취·확인, 승인·주문과 사후 연락은 서로 다른 사실을 소유하므로 함께 남겨야 합니다.",
  "자격증·서명·수익 결과 하나로 올바른 판매를 판정하지 않고 당시 법령·계약·고객 정보·설명·이해·기록을 함께 봅니다.",
] as const;

type Panel = "exposure" | "contract" | "loss" | "rules" | "alternatives" | "consultation" | "evidence" | "boundary";

const SCENES = [
  {
    title: "한 달 뒤 받을 수출대금 1억 달러를 먼저 실제 노출로 확인합니다",
    detail: "헤지 상품 이름보다 입금 통화·날짜·금액·취소 가능성과 이미 체결한 계약을 먼저 엽니다.",
    panel: "exposure",
    formula: "예상 수취 1억 달러 · 입금일·확정성·기존 헤지 확인",
    conclusion: "고객 목적을 ‘환헤지’ 한 단어로 적지 않고 실제 현금흐름과 계약 가능한 범위를 숫자로 고정합니다.",
  },
  {
    title: "환율 상승 때 2억 달러를 팔 의무가 생기면 실제 노출보다 1억 달러가 많습니다",
    detail: "보호받는 하락 장면과 의무가 배수로 커지는 상승 장면을 같은 크기와 같은 기간으로 나란히 봅니다.",
    panel: "contract",
    formula: "계약 매도의무 2억−실제 수취 1억=초과의무 1억 달러",
    conclusion: "헤지라는 이름이 붙어도 계약 의무가 실제 노출을 넘으면 남는 부분은 환율 방향에 새로 노출됩니다.",
  },
  {
    title: "환율 차이 200원을 초과의무 1억 달러에 곱하면 단순 차액은 200억 원입니다",
    detail: "관측일·배수·상한·중도 종료가격을 빼고 손실 방향만 보여 주는 설명용 계산입니다.",
    panel: "loss",
    formula: "100,000,000달러×200원/달러=20,000,000,000원=200억 원",
    conclusion: "유리한 평균 수익보다 고객이 추가로 마련해야 할 통화와 현금의 최대 경로를 먼저 이해시킵니다.",
  },
  {
    title: "권유가 있으면 적합성, 권유 없이 위험상품을 찾으면 적정성 절차를 구분합니다",
    detail: "두 규칙 모두 설문 점수 하나가 아니라 고객 정보와 상품 손실 구조를 맞추는 절차이며 적용 대상은 법령에서 다시 확인합니다.",
    panel: "rules",
    formula: "권유 있음 → 적합성 · 권유 없음+법정 대상 → 적정성·부적정 고지",
    conclusion: "판매 경로가 달라지면 확인할 책임도 달라지므로 주문 화면과 상담 기록에서 권유가 있었는지 재구성할 수 있어야 합니다.",
  },
  {
    title: "구조화 계약을 단순 선도·옵션 매수·거래하지 않기와 같은 조건에서 비교합니다",
    detail: "보호 범위만 비교하지 않고 비용, 초과의무, 추가 현금, 중도 종료와 실제 노출 변화까지 함께 놓습니다.",
    panel: "alternatives",
    formula: "같은 1억 달러·같은 만기·같은 환율 장면 → 비용·최악손실·의무 비교",
    conclusion: "더 단순한 대안이 같은 목적을 충족하면 복잡한 구조를 선택할 이유와 포기하는 권리를 설명해야 합니다.",
  },
  {
    title: "정보 수집부터 계산·설명·되짚기·주문·사후 재검토까지 한 상담으로 잇습니다",
    detail: "고객이 불리한 장면을 자기 말로 설명하지 못하면 다시 설명하거나 권유를 멈추고, 노출이 줄면 계약 규모도 다시 봅니다.",
    panel: "consultation",
    formula: "파악 → 시나리오 → 대안 → 설명 → 고객 되짚기 → 승인·주문 → 사후 점검",
    conclusion: "설명서는 중간 산출물이고 최종 상태는 고객이 판단에 필요한 정보를 이해했는지와 그 근거가 남았는지입니다.",
  },
  {
    title: "고객·상품·설명·주문의 상태를 서로 다른 증거에서 다시 맞춥니다",
    detail: "나중에 분쟁이 생기면 한 장의 서명보다 당시 고객 정보, 계산 버전, 제공 문서, 대화와 승인·주문 시각을 연결합니다.",
    panel: "evidence",
    formula: "고객 프로필 + 상품 시나리오 + 제공·설명·이해 기록 + 승인·주문·사후 연락",
    conclusion: "각 기록의 소유자와 시각·버전을 알아야 ‘무엇을 알았고 무엇을 설명했는가’를 재구성할 수 있습니다.",
  },
  {
    title: "자격증·서명·수익 결과 하나를 올바른 판매의 증명으로 쓰지 않습니다",
    detail: "수익이 났어도 누락된 위험 설명은 사라지지 않고, 손실이 났다는 사실만으로 위반이 자동 확정되지도 않습니다.",
    panel: "boundary",
    formula: "당시 법령·고객 분류·계약조건·설명·이해·기록·사후 변화",
    conclusion: "좋은 판매 검토는 결과론 대신 계약 당시 판단 과정과 최신 관할 규칙을 같은 시간축에서 확인합니다.",
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
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="수출기업의 실제 달러 노출"><Box label="한 달 뒤" value="수취 예정" /><Box label="실제 노출" value="1억 달러" active /><Box label="먼저 확인" value="금액·날짜·확정성" /></div>;
}

function ContractPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="실제 수출 노출과 계약 매도의무의 차이"><Box label="계약 의무" value="2억 달러" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">−</span><Box label="실제 수취" value="1억 달러" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="초과의무" value="1억 달러" active /></div>;
}

function LossPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="초과 매도의무에서 생기는 설명용 차액"><Box label="초과분" value="1억 달러" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">×</span><Box label="환율 차이" value="200원" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="단순 차액" value="200억 원" active /></div>;
}

function RulesPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="권유 유무에 따른 적합성과 적정성"><Box label="판매자가 권유" value="고객에게 적합한가" active /><Box label="고객이 직접 선택" value="법정 대상이면 적정한가·고지" /></div>;
}

function AlternativesPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="환헤지 대안 네 가지"><Box label="단순 선도" value="가격 고정" /><Box label="옵션 매수" value="권리만 확보" /><Box label="구조화 계약" value="조건부 배수의무" active /><Box label="거래 안 함" value="환율 노출 유지" /></div>;
}

function ConsultationPanel() {
  const steps = ["고객", "계산", "대안", "설명", "되짚기", "주문·사후"];
  return <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2" aria-label="파생상품 상담의 여섯 단계">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function EvidencePanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="판매 과정을 재구성하는 네 증거"><Box label="고객" value="목적·재산·경험" /><Box label="상품" value="조건·계산 버전" /><Box label="설명" value="문서·녹취·되짚기" /><Box label="실행" value="승인·주문·사후" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="파생상품 판매 판단의 다섯 경계"><Box label="법령" value="거래 시점" /><Box label="고객" value="일반·전문" /><Box label="계약" value="실제 조건" /><Box label="과정" value="설명·이해" /><Box label="증거" value="기록·버전" active /></div>;
}

export default function DerivativesSalesPracticeMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11500, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="파생상품 판매 · 1억 달러 노출과 2억 달러 의무"
      title="초과의무 1억 달러와 불리한 차액 200억 원을 먼저 계산한 뒤 권유·설명·기록을 연결합니다"
      description="실제 수출 노출에서 출발해 구조화 계약의 초과의무, 적합성과 적정성, 단순 대안, 고객의 되짚기와 분쟁 때 다시 맞출 증거까지 한 상담을 추적합니다."
      note="달러 금액과 환율 차이는 작동 원리를 설명하기 위한 가정입니다. 실제 판매 판단은 거래 당시 법령·감독규정, 고객과 상품의 법적 분류, 계약서와 승인된 평가 자료를 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-sales-practice-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "exposure" && <ExposurePanel />}
          {scene.panel === "contract" && <ContractPanel />}
          {scene.panel === "loss" && <LossPanel />}
          {scene.panel === "rules" && <RulesPanel />}
          {scene.panel === "alternatives" && <AlternativesPanel />}
          {scene.panel === "consultation" && <ConsultationPanel />}
          {scene.panel === "evidence" && <EvidencePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="파생상품 판매 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
