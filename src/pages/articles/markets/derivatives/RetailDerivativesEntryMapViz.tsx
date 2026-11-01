import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["주문", "한국 1단계", "정지", "한국 2단계", "싱가포르", "유효기간", "보호", "확인"] as const;

const NOTES = [
  "첫 파생상품 주문은 돈만 넣는 동작이 아니라 고객·계약법인·상품·권유 여부를 정한 뒤 각 시장의 진입 문으로 들어갑니다.",
  "한국 신규 일반개인은 사전교육 1시간, 모의거래 3시간, 기본예탁금 1,000만 원을 충족해야 1단계 상품 범위로 갑니다.",
  "교육을 마쳐도 예탁금이 700만 원이면 1,000만 원 문에서 멈춥니다. 통과해도 모든 옵션 매도가 허용되는 것은 아닙니다.",
  "전체 선물·옵션으로 넓히려면 미결제약정을 10거래일 이상 보유한 경험과 2단계 기본예탁금 2,000만 원을 확인합니다.",
  "싱가포르는 상장 복잡상품에 CAR, 비상장 복잡상품에 CKA를 두고 자격·경력·거래·교육 가운데 지식과 경험 근거를 확인합니다.",
  "거래 경험 경로는 최근 3년 6회이지만 CAR와 CKA의 유효기간은 같지 않습니다. CAR은 조건부 3년, CKA는 1년입니다.",
  "시장 진입, 지식·경험 심사, 판매 권유의 적합성, 고객자산 보관과 분쟁 경로는 서로 다른 질문입니다.",
  "확인일·계약법인·고객분류·상품·권유 여부를 함께 적고 앱의 거래 가능 표시를 다른 나라의 허가나 안전 보증으로 읽지 않습니다.",
] as const;

type Panel = "order" | "korea1" | "stop" | "korea2" | "singapore" | "validity" | "protection" | "check";

const SCENES = [
  {
    title: "첫 주문 전에 고객·계약법인·상품·권유 여부부터 네 칸으로 고정합니다",
    detail: "같은 사람도 일반·전문 고객인지, 상장·장외 상품인지, 판매자의 권유가 있었는지에 따라 다른 규칙을 지납니다.",
    panel: "order",
    formula: "고객 분류 → 계약법인 → 상품 분류 → 권유 여부 → 국가별 진입 절차",
    conclusion: "계좌 화면의 버튼보다 어떤 법인과 어떤 상품을 어떤 방식으로 계약하는지가 적용 규칙을 결정합니다.",
  },
  {
    title: "한국 1단계는 교육 1시간·모의거래 3시간·예탁금 1,000만 원을 확인합니다",
    detail: "신규 일반개인의 설명용 경로이며 회원사별 차등과 일부 상품의 별도 기준은 실제 약관에서 다시 확인합니다.",
    panel: "korea1",
    formula: "사전교육 ≥1시간 + 모의거래 ≥3시간 + 기본예탁금 ≥1,000만 원",
    conclusion: "통과하면 변동성지수선물을 뺀 선물과 옵션 매수 범위로 들어가며 모든 파생상품이 한꺼번에 열리지는 않습니다.",
  },
  {
    title: "교육을 끝내도 예탁금 700만 원이면 1,000만 원 문 앞에서 주문이 멈춥니다",
    detail: "교육 이수, 지식, 돈, 상품 범위는 서로 대신할 수 없는 상태이므로 각각의 통과 여부를 따로 봅니다.",
    panel: "stop",
    formula: "700만 원<1,000만 원 → 1단계 예탁 문 미통과 → 주문 범위 열리지 않음",
    conclusion: "반대로 예탁금을 채웠다는 사실도 상품을 이해하거나 손실을 감당할 수 있다는 증명은 아닙니다.",
  },
  {
    title: "한국 2단계는 미결제약정 10거래일 경험과 예탁금 2,000만 원으로 범위를 넓힙니다",
    detail: "경험은 단순 계좌 보유가 아니라 미결제약정을 보유한 거래일로 확인하며 실제 상품·회원사 조건을 같이 봅니다.",
    panel: "korea2",
    formula: "미결제약정 보유 ≥10거래일 + 기본예탁금 ≥2,000만 원 → 전체 선물·옵션 범위",
    conclusion: "단계가 올라가면 허용 범위가 넓어질 뿐 최대손실·추가증거금·유동성 위험이 줄어드는 것은 아닙니다.",
  },
  {
    title: "싱가포르는 상장 복잡상품의 CAR와 비상장 복잡상품의 CKA를 나눕니다",
    detail: "학력·전문자격·관련 경력·거래 경험·공식 학습 평가 중 적용 가능한 근거로 구조를 이해할 바탕을 확인합니다.",
    panel: "singapore",
    formula: "상장 SIP → CAR · 비상장 SIP → CKA · 지식·경험 근거 확인",
    conclusion: "심사 이름은 상품이 상장됐는지에 따라 갈리며 지식·경험 평가는 고객의 위험 선호를 보는 적합성과 다릅니다.",
  },
  {
    title: "최근 3년 6회라는 경험 길은 같아도 CAR과 CKA의 유효기간은 다릅니다",
    detail: "CAR은 3년 동안 상장 SIP 거래가 한 번 이하일 때 3년 뒤 만료되고, CKA 결과는 거래 횟수와 무관하게 1년입니다.",
    panel: "validity",
    formula: "경험 경로: 최근 3년 6회 · CAR: 조건부 3년 · CKA: 1년",
    conclusion: "숫자 6을 합격표처럼 외우지 않고 상장·비상장 상품, 충족 경로와 결과의 유효기간을 함께 기록합니다.",
  },
  {
    title: "거래 가능·상품 이해·개별 적합성·고객자산 보호를 네 판단으로 분리합니다",
    detail: "한 시장에서 주문이 가능해도 다른 시장의 승인, 그 사람에게 알맞은 상품, 계약법인의 안전과 분쟁 경로는 자동으로 따라오지 않습니다.",
    panel: "protection",
    formula: "진입 문 ≠ 지식 심사 ≠ 권유 적합성 ≠ 보관·분쟁 보호",
    conclusion: "각 제도는 줄이는 위험이 다르므로 어느 하나의 통과 결과를 전체 안전의 증명으로 확장하지 않습니다.",
  },
  {
    title: "국가 비교표에는 숫자보다 확인일·법인·고객·상품·권유를 먼저 남깁니다",
    detail: "규정은 바뀌고 같은 브랜드도 계약법인이 다를 수 있으므로 최신 공식 안내와 실제 계좌 약관을 함께 확인합니다.",
    panel: "check",
    formula: "확인일 + 계약법인 + 고객분류 + 상품분류 + 권유 여부 + 자산보관·분쟁기관",
    conclusion: "좋은 비교는 나라 이름 옆 숫자를 모으는 표가 아니라 실제 주문이 어느 문에서 멈추고 어떤 보호가 남는지 보여 줍니다.",
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

function OrderPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="첫 주문 전에 확인할 네 분류"><Box label="고객" value="일반·전문" /><Box label="법인" value="계약 상대" /><Box label="상품" value="상장·비상장" /><Box label="경로" value="권유·직접 주문" active /></div>;
}

function KoreaOnePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="한국 신규 일반개인의 1단계 진입 조건"><Box label="사전교육" value="1시간 이상" /><Box label="모의거래" value="3시간 이상" /><Box label="기본예탁금" value="1,000만 원" active /></div>;
}

function StopPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="예탁금 부족으로 멈춘 한국 1단계 주문"><Box label="보유 현금" value="700만 원" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">&lt;</span><Box label="1단계 문" value="1,000만 원" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="주문 상태" value="멈춤" active /></div>;
}

function KoreaTwoPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="한국 일반개인의 2단계 진입 조건"><Box label="미결제약정" value="10거래일 이상" /><Box label="기본예탁금" value="2,000만 원" /><Box label="상품 범위" value="전체 선물·옵션" active /></div>;
}

function SingaporePanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="싱가포르 복잡상품의 CAR과 CKA"><Box label="상장 SIP" value="CAR 계좌 심사" active /><Box label="비상장 SIP" value="CKA 지식 심사" /></div>;
}

function ValidityPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="싱가포르 거래 경험 경로와 심사 유효기간"><Box label="경험 경로" value="3년 안 6회" /><Box label="CAR" value="조건부 3년" /><Box label="CKA" value="1년" active /></div>;
}

function ProtectionPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="파생상품 거래 전에 구분할 네 보호"><Box label="시장 진입" value="주문 가능" /><Box label="지식·경험" value="구조 이해" /><Box label="적합성" value="목적·재산" /><Box label="보관·분쟁" value="법인·계정·기관" active /></div>;
}

function CheckPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="국가별 파생상품 규칙을 다시 확인할 다섯 항목"><Box label="언제" value="확인일" /><Box label="누구와" value="계약법인" /><Box label="누가" value="고객분류" /><Box label="무엇을" value="상품분류" /><Box label="어떻게" value="권유·주문" active /></div>;
}

export default function RetailDerivativesEntryMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11500, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="소매 파생상품 진입 · 한국과 싱가포르"
      title="한국의 단계별 주문 문과 싱가포르의 지식·경험 심사가 서로 다른 질문에 답합니다"
      description="한국의 1시간·3시간·1,000만 원과 10거래일·2,000만 원, 싱가포르의 CAR·CKA와 최근 3년 6회를 한 투자자의 첫 주문에 대입합니다."
      note="숫자는 2026년 11월 2일 확인한 공식 안내의 대상과 조건을 함께 읽어야 합니다. 실제 거래 전에는 회원사 약관과 최신 규정, 계약법인·고객분류·상품·권유 여부를 다시 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-retail-derivatives-entry-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "order" && <OrderPanel />}
          {scene.panel === "korea1" && <KoreaOnePanel />}
          {scene.panel === "stop" && <StopPanel />}
          {scene.panel === "korea2" && <KoreaTwoPanel />}
          {scene.panel === "singapore" && <SingaporePanel />}
          {scene.panel === "validity" && <ValidityPanel />}
          {scene.panel === "protection" && <ProtectionPanel />}
          {scene.panel === "check" && <CheckPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="국가별 파생상품 진입 경로 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
