import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["거래", "상계", "담보", "문서", "운영", "미래", "CVA", "경계"] as const;

const NOTES = [
  "A와 B 사이 네 거래의 현재가치는 +5·+4·−2·−5입니다. 받을 가치 9와 줄 가치 7을 더한 총 절대금액은 16입니다.",
  "같은 집행 가능한 상계집합이라면 종료 때 네 거래를 한 순수취액 +2로 줄입니다. 법률상 집행 가능성이 계산의 전제입니다.",
  "B가 현금담보 1.5를 이미 냈고 바로 사용할 수 있으면 현재 잔여노출은 2−1.5=0.5입니다.",
  "기본계약은 관계 규칙, 확인서는 개별 거래 조건, CSA는 담보 규칙, 운영 장부는 평가·대조·결제 상태를 소유합니다.",
  "거래 체결 뒤 확인·매일 평가·담보 요구·대조·분쟁·지급이 반복되고, 종료사건이 생기면 통지와 종료가치·상계·담보 적용으로 넘어갑니다.",
  "변동증거금은 이미 생긴 현재가치, 개시증거금은 부도 뒤 대체까지 시장이 움직일 잠재 미래변화를 겨냥합니다.",
  "미래 양의 노출 10, 부도확률 2%, 손실률 60%인 단순 사례의 할인 전 기대손실은 0.12입니다.",
  "상계 법률의견, 담보가치와 결제, 가격분쟁, 데이터·통지, 잘못된 방향의 위험을 남기고 CVA 한 숫자로 운영 경로를 대신하지 않습니다.",
] as const;

type Panel = "trades" | "netting" | "collateral" | "documents" | "operations" | "future" | "cva" | "boundary";

const SCENES = [
  {
    title: "네 거래의 받을 가치 9와 줄 가치 7을 먼저 그대로 펼칩니다",
    detail: "상계 전에는 A가 받을 두 거래와 줄 두 거래가 각각 남아 있어 총 절대금액은 16입니다.",
    panel: "trades",
    formula: "받을 가치 +5+4=9 · 줄 가치 |−2|+|−5|=7 · 총 절대금액 16",
    conclusion: "장외 상대방 위험은 상품 한 건보다 같은 상대와 어떤 계약 묶음에 들어 있는지에서 시작합니다.",
  },
  {
    title: "집행 가능한 같은 상계집합이면 종료 때 네 거래를 한 순수취액 2로 줄입니다",
    detail: "거래를 더하는 계산보다 어느 법인·지점·상품이 같은 계약에 포함되고 도산법에서 인정되는지가 먼저입니다.",
    panel: "netting",
    formula: "+5+4−2−5=+2 · 상계 전 총 16 → 종료 순액 2",
    conclusion: "계약 문구만 있다고 위험 감소가 생기는 것이 아니라 해당 관할의 법률의견과 거래 범위가 계산을 지지해야 합니다.",
  },
  {
    title: "순노출 2에서 사용할 수 있는 현금담보 1.5를 빼면 0.5가 남습니다",
    detail: "담보 가치가 유지되고 즉시 처분할 수 있다는 설명용 전제이며 종료기간의 가격 변화는 별도로 남습니다.",
    panel: "collateral",
    formula: "현재 순노출 2−현금담보 1.5=잔여 현재노출 0.5",
    conclusion: "법률상계와 담보는 서로 다른 층에서 노출을 줄이며 어느 하나가 다른 층의 실패를 자동으로 고치지 않습니다.",
  },
  {
    title: "관계 규칙·거래 조건·담보 규칙·운영 상태를 네 기록으로 나눕니다",
    detail: "문서가 있어도 거래 식별자나 평가 자료가 다르면 담보 요구와 종료금액을 두고 분쟁이 생길 수 있습니다.",
    panel: "documents",
    formula: "기본계약 · 개별 확인서 · CSA 담보부속서 · 평가·대조·결제 장부",
    conclusion: "각 기록이 소유하는 상태와 최신 시점을 알아야 계약의 법적 권리와 오늘 운영 숫자를 연결할 수 있습니다.",
  },
  {
    title: "체결부터 확인·평가·담보·대조를 반복하고 종료사건에서 한 금액으로 정산합니다",
    detail: "매일 반복되는 운영과 부도 때 한 번 실행하는 종료 절차를 구분해 어느 단계에서 불일치가 생겼는지 찾습니다.",
    panel: "operations",
    formula: "체결 → 확인 → 매일 평가 → 담보 요구·결제 → 대조·분쟁 → 종료가치·상계",
    conclusion: "가격 분쟁과 담보 결제 실패, 잘못된 거래 정보와 통지 누락은 계약이 표준이어도 실제 손실을 키울 수 있습니다.",
  },
  {
    title: "현재가치를 옮기는 담보와 대체기간의 미래 변화를 덮는 담보를 구분합니다",
    detail: "오늘 순가치가 0이어도 내일 시장이 움직이고 상대가 부도난 뒤 거래를 대체할 때까지 양의 노출이 생길 수 있습니다.",
    panel: "future",
    formula: "변동증거금 VM → 이미 생긴 현재가치 · 개시증거금 IM → 청산기간 잠재 변화",
    conclusion: "담보 통화와 노출 통화가 다르거나 담보가 상대와 함께 약해지면 헤어컷과 추가 스트레스가 필요합니다.",
  },
  {
    title: "미래 양의 노출 10에 부도확률 2%와 손실률 60%를 곱하면 0.12입니다",
    detail: "한 시점의 할인 전 단순 기대손실이며 실제 CVA는 여러 미래 시점과 시장이 반영한 부도확률·담보·상계를 사용합니다.",
    panel: "cva",
    formula: "CVA 단순값=10×0.02×0.60=0.12",
    conclusion: "CVA는 법률상계나 담보를 대신하는 장치가 아니라 남은 미래 노출과 상대 신용을 무부도 가격에서 조정한 값입니다.",
  },
  {
    title: "법률·담보·평가·운영·공동악화의 경계를 한 보고서에 남깁니다",
    detail: "같은 기본계약 아래에서도 지점·상품·통화와 담보 부속서가 다르면 모든 거래가 하나로 상계되지 않을 수 있습니다.",
    panel: "boundary",
    formula: "상계 법률의견 + 담보 가용성 + 평가 대조 + 결제·통지 + 잘못된 방향의 위험",
    conclusion: "좋은 보고서는 총명목이나 CVA 하나보다 상계집합별 현재·미래노출과 실패한 운영 단계를 보여 줍니다.",
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

function TradesPanel() {
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="네 장외파생 거래의 현재가치"><Box label="거래 1" value="+5" /><Box label="거래 2" value="+4" /><Box label="거래 3" value="−2" /><Box label="거래 4" value="−5" /></div>;
}

function NettingPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="받을 가치와 줄 가치의 종료 일괄상계"><Box label="받을 가치" value="9" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">−</span><Box label="줄 가치" value="7" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="종료 순액" value="+2" active /></div>;
}

function CollateralPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="상계 뒤 담보를 적용한 잔여노출"><Box label="상계 순노출" value="2" /><Box label="현금담보" value="1.5" /><Box label="잔여노출" value="0.5" active /></div>;
}

function DocumentsPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="장외파생 거래의 네 기록"><Box label="기본계약" value="관계·종료·상계" /><Box label="확인서" value="명목·금리·만기" /><Box label="CSA" value="담보 규칙" /><Box label="운영 장부" value="평가·대조·결제" active /></div>;
}

function OperationsPanel() {
  const steps = ["체결", "확인", "평가", "담보", "대조·종료"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="장외파생 거래의 운영 생애">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function FuturePanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="변동증거금과 개시증거금의 시간 범위"><Box label="변동증거금 VM" value="이미 생긴 현재가치" /><Box label="개시증거금 IM" value="대체기간의 잠재 변화" active /></div>;
}

function CvaPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="미래 양의 노출에서 CVA 기대손실 계산"><Box label="미래 양의 노출" value="10" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">×</span><Box label="부도·손실" value="2%×60%" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="기대손실" value="0.12" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="장외파생 상대방 위험의 다섯 검증 경계"><Box label="법률" value="상계 집행" /><Box label="담보" value="가치·가용성" /><Box label="평가" value="가격 대조" /><Box label="운영" value="결제·통지" /><Box label="공동" value="잘못된 방향" active /></div>;
}

export default function OtcLifecycleMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="장외파생 · 네 거래에서 상계·담보·CVA까지"
      title="총 절대금액 16을 종료 순액 2와 담보 뒤 0.5로 줄이고 미래 손실을 가격에 반영합니다"
      description="+5·+4·−2·−5의 네 거래에서 출발해 상계집합, CSA 담보, 문서와 매일 운영, 변동·개시증거금, 단순 CVA 0.12의 경계를 연결합니다."
      note="거래가치와 담보·미래 노출·부도확률은 작동 원리를 설명하기 위한 가정입니다. 실제 상계와 담보는 상대 법인·지점·상품·관할의 문서와 법률의견, 정확한 평가·결제 상태를 사용합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-otc-lifecycle-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "trades" && <TradesPanel />}
          {scene.panel === "netting" && <NettingPanel />}
          {scene.panel === "collateral" && <CollateralPanel />}
          {scene.panel === "documents" && <DocumentsPanel />}
          {scene.panel === "operations" && <OperationsPanel />}
          {scene.panel === "future" && <FuturePanel />}
          {scene.panel === "cva" && <CvaPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="장외파생 위험 경로 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
