import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약", "CFTC", "SEC", "영업행위", "입금", "분리", "파산", "경계"] as const;

const NOTES = [
  "미국 파생상품은 회사 이름보다 계약의 기준자산과 구조를 먼저 분류해야 CFTC·SEC·공동 관할의 문을 찾을 수 있습니다.",
  "금리스왑처럼 일반 스왑에 해당하는 계약은 CFTC 틀에서 딜러 등록, 청산·보고와 영업행위 의무를 확인합니다.",
  "단일 회사 신용위험에 연동된 전형적인 신용스왑은 SEC의 증권기반스왑 틀을 먼저 보고, 혼합스왑은 공동 경계를 확인합니다.",
  "딜러 영업행위는 거래상대 자격, 중요한 위험과 특성, 이해충돌, 일일 가격 표시를 남기는 별도 통제입니다.",
  "고객이 FCM 계좌에 현금 100을 넣고 증거금 20을 쓰더라도 나머지 80을 포함한 고객 재산 전체의 표시가 유지됩니다.",
  "고객자금은 FCM 자기 돈과 분리되고 은행·청산소의 계정 이름과 상계 금지 확인을 통해 고객을 위한 자금임을 이어 갑니다.",
  "분리 보관은 파산 때 우선권을 주지만 실제 분리 풀이 청구보다 부족하면 전액 즉시 반환을 보장하지 않습니다.",
  "상품 분류, 계약 법인, 등록 역할, 청산 여부, 자금 계정과 분쟁 경로를 한 줄에 남겨야 실제 보호 장치를 찾을 수 있습니다.",
] as const;

type Panel = "contract" | "cftc" | "sec" | "conduct" | "deposit" | "segregation" | "failure" | "boundary";

const SCENES = [
  {
    title: "같은 금융그룹과 거래해도 계약 구조에 따라 감독 문과 자금 계정이 갈립니다",
    detail: "금리스왑, 단일 회사 신용스왑, 장내 선물 계좌를 각각 분류해야 관할과 보호 절차가 보입니다.",
    panel: "contract",
    formula: "계약 구조 → CFTC 스왑 · SEC 증권기반스왑 · FCM 선물 고객계정",
    conclusion: "‘미국 규제’ 한 칸으로 묶으면 상품 감독, 딜러 영업행위와 고객자금 보관을 서로 바꿔 읽게 됩니다.",
  },
  {
    title: "금리스왑은 일반 스왑 분류에서 CFTC의 등록·청산·보고 경로를 먼저 봅니다",
    detail: "실제 적용은 거래상대 자격, 상품과 예외, 청산 의무 범위와 국경 간 조건을 계약별로 확인합니다.",
    panel: "cftc",
    formula: "금리 현금흐름 교환 → 스왑 정의 → CFTC 규칙 → 딜러·청산·보고 확인",
    conclusion: "감독기관을 찾는 일과 계약이 안전하거나 수익성 있다는 판단은 서로 다른 질문입니다.",
  },
  {
    title: "단일 회사 신용위험에 연동된 전형적 스왑은 SEC의 별도 문으로 갑니다",
    detail: "단일 증권·대출·좁은 증권지수에 기초한 스왑은 증권기반스왑 정의를 보고 혼합스왑은 두 기관의 공동 경계를 확인합니다.",
    panel: "sec",
    formula: "단일 회사 신용사건 → 증권기반스왑 정의 → SEC · 혼합 요소가 있으면 공동 확인",
    conclusion: "계약 이름만으로 단정하지 않고 기준자산, 지수 구성과 지급 조건을 법적 정의에 대입합니다.",
  },
  {
    title: "관할을 찾은 뒤에는 딜러가 거래상대에게 무엇을 확인하고 설명했는지 봅니다",
    detail: "상품 감독과 별개로 거래상대 자격, 중요한 위험·특성, 이해충돌과 일일 가격 표시가 기록으로 남습니다.",
    panel: "conduct",
    formula: "거래상대 확인 → 위험·특성 → 유인·이해충돌 → 일일 가격 표시 → 기록",
    conclusion: "영업행위 통제는 고객자금을 어디에 보관했는지와 다른 상태를 관리하므로 두 장부를 따로 검증합니다.",
  },
  {
    title: "선물 고객이 현금 100을 넣고 증거금 20을 써도 고객재산 표시는 100 전체에 남습니다",
    detail: "설명용 FCM 계좌에서 포지션에 필요한 금액과 아직 쓰지 않은 잔액을 나눠 봅니다.",
    panel: "deposit",
    formula: "고객 입금 100=필요 증거금 20+남은 고객 잔액 80",
    conclusion: "쓰지 않은 80은 FCM의 운영자금이나 다른 고객 손실을 메우는 돈으로 자동 전환되지 않습니다.",
  },
  {
    title: "고객자금은 FCM 자기 자산과 떨어진 이름으로 은행·청산소까지 이어집니다",
    detail: "고객을 위한 분리 계정 표시와 FCM 채무에 대한 상계 금지 확인이 보관 경로의 핵심입니다.",
    panel: "segregation",
    formula: "고객 100 → FCM 고객 분리계정 → 은행·DCO · FCM 자기계정과 구분",
    conclusion: "분리는 자금의 소유·사용 경계를 지키는 장치이지 선물 가격 손실을 보전하는 보험은 아닙니다.",
  },
  {
    title: "파산 때 분리 풀 90만 남았다면 고객 청구 100이 곧바로 전액 반환되지는 않습니다",
    detail: "설명용 부족 상황이며 실제 배분은 계정 종류, 파산 절차와 전체 고객 청구를 함께 봅니다.",
    panel: "failure",
    formula: "고객 청구 100−확인된 분리 풀 90=부족 10 · 나머지는 파산 배분 절차",
    conclusion: "분리 자금의 우선권과 원금 전액 보장은 같은 말이 아니므로 실제 잔액과 부족 처리까지 확인합니다.",
  },
  {
    title: "계약마다 상품·법인·역할·청산·계정·분쟁 경로를 한 줄에 연결합니다",
    detail: "같은 브랜드 아래 FCM, 스왑딜러, 증권기반스왑딜러와 증권회사가 다른 법인일 수 있습니다.",
    panel: "boundary",
    formula: "상품 분류 + 계약 법인 + 등록 역할 + 청산 여부 + 자금 계정 + 분쟁 기관",
    conclusion: "이 여섯 칸을 남겨야 장애·민원·파산 때 어느 규칙과 기록이 실제 계약을 다루는지 찾을 수 있습니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Cell({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function ContractPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="미국 파생상품 계약 세 갈래"><Cell label="금리스왑" value="CFTC" /><Cell label="단일 회사 신용스왑" value="SEC" active /><Cell label="장내 선물계좌" value="FCM 분리" /></div>;
}

function CftcPanel() {
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="금리스왑의 CFTC 규제 경로"><Cell label="계약" value="금리스왑" /><Cell label="분류" value="일반 스왑" /><Cell label="감독" value="CFTC" active /><Cell label="확인" value="딜러·청산·보고" /></div>;
}

function SecPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="증권기반스왑과 혼합스왑의 감독 경로"><Cell label="단일 증권·신용" value="증권기반스왑" /><Cell label="감독" value="SEC" active /><Cell label="혼합 요소" value="SEC+CFTC 확인" /></div>;
}

function ConductPanel() {
  const items = [["1", "상대 자격"], ["2", "위험·특성"], ["3", "이해충돌"], ["4", "일일 가격"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="스왑 딜러 영업행위 기록">{items.map(([step, label], index) => <Cell key={step} label={`${step}단계`} value={label} active={index === 3} />)}</div>;
}

function DepositPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="FCM 고객 현금 100의 분리 장부"><Cell label="고객 입금" value="100" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">=</span><Cell label="필요 증거금" value="20" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">+</span><Cell label="남은 고객잔액" value="80" active /></div>;
}

function SegregationPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="고객자금이 FCM에서 은행과 청산소로 분리되는 경로"><Cell label="고객" value="현금·증권" /><span className="text-center font-mono text-xs font-black">→</span><Cell label="FCM" value="고객 분리계정" active /><span className="text-center font-mono text-xs font-black">→</span><Cell label="은행·DCO" value="고객용 표시" /></div>;
}

function FailurePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="FCM 파산 때 고객 청구와 분리 풀 부족"><Cell label="고객 청구" value="100" /><Cell label="분리 풀" value="90" active /><Cell label="부족분" value="10 · 파산 절차" /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 sm:gap-2" aria-label="미국 파생상품 보호 경로의 여섯 확인 항목"><Cell label="상품" value="스왑·SBS·선물" /><Cell label="법인" value="계약 상대" /><Cell label="역할" value="딜러·FCM" /><Cell label="청산" value="CCP 여부" /><Cell label="계정" value="자금 위치" /><Cell label="분쟁" value="담당 기관" active /></div>;
}

export default function UsDerivativesRegulatoryMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11500, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="미국 파생상품 · 계약 분류에서 고객자금까지"
      title="감독기관, 딜러 영업행위와 고객자금 분리는 서로 다른 장부입니다"
      description="금리스왑·단일 회사 신용스왑·선물 계좌를 분류하고, 고객 현금 100이 FCM 분리계정과 파산 절차에서 어떻게 추적되는지 따라갑니다."
      note="계약과 금액은 규제 경계를 설명하기 위한 가정입니다. 실제 적용은 상품 정의·계약 법인·거래상대 지위·청산 여부·계정 종류와 최신 SEC·CFTC 규칙을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-us-derivatives-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "contract" && <ContractPanel />}
          {scene.panel === "cftc" && <CftcPanel />}
          {scene.panel === "sec" && <SecPanel />}
          {scene.panel === "conduct" && <ConductPanel />}
          {scene.panel === "deposit" && <DepositPanel />}
          {scene.panel === "segregation" && <SegregationPanel />}
          {scene.panel === "failure" && <FailurePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="미국 파생상품 규제와 고객자금 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
