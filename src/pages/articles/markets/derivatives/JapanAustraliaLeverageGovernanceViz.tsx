import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["출발", "일본 한도", "로스컷", "호주 한도", "1% 충격", "목표시장", "판매 점검", "경계"] as const;

const NOTES = [
  "현금 100으로 시작해도 일본 개인 장외 FX는 4% 증거금, 호주 소매 CFD는 기초자산별 증거금률을 적용하므로 허용 노출이 다릅니다.",
  "일본 개인 장외 FX의 4% 이상 증거금은 100÷0.04=2,500, 즉 최대 25배와 같은 뜻입니다.",
  "25배 노출에서 환율이 1% 불리하게 움직이면 손실은 25입니다. 로스컷이 있어도 급변과 가격 틈에서는 증거금보다 큰 손실이 날 수 있습니다.",
  "호주 소매 CFD는 주요 통화쌍 30배에서 암호자산 2배까지 기초자산별로 다른 초기증거금을 요구합니다.",
  "같은 현금 100과 같은 1% 충격이어도 일본 개인 FX는 25, 호주 30배 상품은 30, 2배 상품은 2의 손실이 납니다.",
  "호주의 목표시장 결정은 발행자가 맞는 소비자 범위와 유통 조건을 정하고 판매 결과를 다시 검토하게 합니다.",
  "가입 질문을 한 번 통과시키는 데서 끝나지 않고 실제 거래 결과·불만·목표시장 밖 판매를 모아 상품과 유통 경로를 고칩니다.",
  "국가 이름보다 고객 지위, 상품, 계약 법인, 보호 장치와 적용 시점을 한 줄에 남겨야 비교가 실제 계좌에 맞습니다.",
] as const;

type Panel = "split" | "japan" | "lossCut" | "australia" | "shock" | "tmd" | "review" | "boundary";

const SCENES = [
  {
    title: "같은 현금 100도 고객과 상품 규칙을 거치면 허용 노출이 달라집니다",
    detail: "일본의 개인 장외 FX 한도와 호주의 소매 CFD 상품별 한도는 서로 다른 범위를 규율합니다.",
    panel: "split",
    formula: "현금 100 → 일본 개인 장외 FX 2,500 · 호주 소매 CFD 3,000~200",
    conclusion: "25배와 30배를 나라 전체의 위험 순위로 비교하지 않고 어떤 고객·상품에 붙은 숫자인지 먼저 확인합니다.",
  },
  {
    title: "일본 개인 장외 FX의 증거금 4%는 최대 25배와 같은 관계입니다",
    detail: "통화쌍과 관계없이 거래금액의 4% 이상을 넣고 유지한다는 일본 금융청 안내를 역수로 바꿉니다.",
    panel: "japan",
    formula: "허용 노출=현금 100÷0.04=2,500 · 레버리지=1÷0.04=25배",
    conclusion: "4%와 25배는 두 제도가 아니라 같은 주문 한도를 증거금률과 배수로 각각 표현한 값입니다.",
  },
  {
    title: "25배 노출에서 1% 불리한 이동은 현금 100 중 25를 줄입니다",
    detail: "업체의 로스컷은 손실 확대를 줄이는 장치지만 급변 때 정한 가격에 반드시 체결된다는 보증은 아닙니다.",
    panel: "lossCut",
    formula: "손실=2,500×1%=25 · 남은 순자산=100−25=75",
    conclusion: "로스컷 규칙과 손실 상한을 같은 것으로 읽지 않아야 가격 틈 뒤 남을 수 있는 채무를 놓치지 않습니다.",
  },
  {
    title: "호주 소매 CFD는 기초자산에 따라 30배에서 2배까지 다르게 제한합니다",
    detail: "주요 통화, 지수·금, 기타 원자재, 주식·기타, 암호자산 순으로 초기증거금 요구가 커집니다.",
    panel: "australia",
    formula: "3.33%→30배 · 5%→20배 · 10%→10배 · 20%→5배 · 50%→2배",
    conclusion: "한 나라 안에서도 변동성과 유동성이 다른 상품에 같은 배수를 복사하지 않습니다.",
  },
  {
    title: "현금과 가격 충격을 고정하면 규칙이 손실 속도를 얼마나 바꾸는지 보입니다",
    detail: "비용·환전·다른 포지션과 가격 틈을 뺀 설명용 장부로 배수만 비교합니다.",
    panel: "shock",
    formula: "일본 100×25×1%=25 · 호주 100×30×1%=30 · 100×2×1%=2",
    conclusion: "배수는 최대 손실이 아니라 같은 시장 움직임이 계좌 자금에 전달되는 속도를 바꿉니다.",
  },
  {
    title: "호주의 목표시장 결정은 상품 설계와 실제 판매 경로를 하나의 되먹임 고리로 묶습니다",
    detail: "발행자는 맞는 소비자 범위와 유통 조건을 적고, 판매사는 그 범위에 맞게 유통하며 결과를 다시 보냅니다.",
    panel: "tmd",
    formula: "상품 특성 → 목표 고객·유통 조건 → 판매 → 결과·불만 → 검토",
    conclusion: "목표시장 문서는 개인 투자 조언이 아니라 어떤 소비자에게 어떤 경로로 팔지 관리하는 상품 단위 통제입니다.",
  },
  {
    title: "가입 질문을 통과시킨 뒤에도 실제 거래 결과가 나쁘면 목표시장과 유통을 다시 고칩니다",
    detail: "ASIC의 2026년 부문 점검은 목표시장 문서, 가입 질문, 보고와 거래 결과 모니터링을 함께 살폈습니다.",
    panel: "review",
    formula: "가입 답변 저장 → 목표시장 대조 → 거래 결과 집계 → 이탈 보고 → 문서·경로 수정",
    conclusion: "판매 통제는 첫 화면의 설문이 아니라 유통 뒤 결과까지 돌아오는 운영 절차여야 합니다.",
  },
  {
    title: "실제 계좌에는 고객 지위·상품·법인·보호·적용 시점을 함께 붙입니다",
    detail: "전문 고객 전환이나 해외 법인 계약은 더 큰 한도와 함께 소매 보호 일부를 바꿀 수 있습니다.",
    panel: "boundary",
    formula: "고객 + 기초자산 + 계약법인 + 레버리지·청산·잔액보호 + 확인일",
    conclusion: "좋은 국가 비교는 최대 배수 하나가 아니라 그 숫자와 보호 장치가 적용되는 경계를 남깁니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Metric({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function SplitPanel() {
  return <div className="grid grid-cols-[0.8fr_1fr_1fr] gap-2 sm:gap-4" aria-label="현금 100이 일본과 호주 규칙에서 다른 노출이 되는 과정"><Metric label="공통 출발" value="현금 100" /><Metric label="일본 개인 장외 FX" value="최대 2,500" active /><Metric label="호주 소매 CFD" value="상품별 3,000~200" active /></div>;
}

function JapanPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="일본 개인 장외 FX 증거금과 레버리지 계산"><Metric label="현금" value="100" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">÷</span><Metric label="증거금률" value="4%" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Metric label="허용 노출" value="2,500 · 25배" active /></div>;
}

function LossCutPanel() {
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="일본 개인 장외 FX 1퍼센트 손실과 로스컷 경계"><Metric label="노출" value="2,500" /><Metric label="1% 충격" value="−25" /><Metric label="순자산" value="75" active /><Metric label="급변" value="가격 틈 가능" /></div>;
}

const AUSTRALIA_LIMITS = [
  ["주요 통화", "30배", "w-full"],
  ["지수·금 등", "20배", "w-4/5"],
  ["기타 원자재", "10배", "w-3/5"],
  ["주식·기타", "5배", "w-2/5"],
  ["암호자산", "2배", "w-1/5"],
] as const;

function AustraliaPanel() {
  return (
    <div className="space-y-1.5 sm:space-y-2" aria-label="호주 소매 CFD 기초자산별 레버리지 한도">
      {AUSTRALIA_LIMITS.map(([label, value, width]) => (
        <div key={label} className="grid grid-cols-[4.8rem_1fr_2.5rem] items-center gap-2 text-[9px] font-black sm:grid-cols-[7rem_1fr_3.5rem] sm:text-xs">
          <span className="break-keep text-muted-foreground">{label}</span>
          <span className="h-2.5 border border-border bg-background sm:h-3"><span className={`block h-full bg-foreground/75 ${width}`} /></span>
          <span className="text-right text-primary">{value}</span>
        </div>
      ))}
    </div>
  );
}

function ShockPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="현금 100과 1퍼센트 충격의 세 손실"><Metric label="일본 개인 FX" value="손실 25" /><Metric label="호주 주요 통화" value="손실 30" active /><Metric label="호주 암호자산" value="손실 2" /></div>;
}

function TmdPanel() {
  const steps = [["1", "상품 특성"], ["2", "목표시장"], ["3", "판매 조건"], ["4", "결과 검토"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="호주 목표시장 결정의 설계 유통 검토 고리">{steps.map(([n, label], index) => <Metric key={n} label={`${n}단계`} value={label} active={index === 3} />)}</div>;
}

function ReviewPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="가입 질문부터 상품 유통 개선까지 이어지는 점검"><Metric label="가입" value="질문·답변" /><Metric label="대조" value="목표시장" /><Metric label="관측" value="손익·불만" /><Metric label="수정" value="문서·판매 경로" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="레버리지와 상품 거버넌스의 적용 경계"><Metric label="고객" value="소매·전문" /><Metric label="상품" value="FX·CFD 기초자산" /><Metric label="상대" value="계약 법인" /><Metric label="보호" value="청산·잔액" /><Metric label="시점" value="최신 규칙" active /></div>;
}

export default function JapanAustraliaLeverageGovernanceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11500, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="일본·호주 · 현금 100의 노출과 판매 경로"
      title="레버리지 숫자와 목표시장 통제는 서로 다른 위험을 줄입니다"
      description="현금 100이 일본 개인 장외 FX와 호주 소매 CFD에서 얼마의 노출이 되는지 계산한 뒤, 호주의 상품 설계·판매·결과 검토가 어떻게 이어지는지 추적합니다."
      note="금액과 가격 충격은 규칙의 차이를 보이기 위한 가정입니다. 실제 거래에서는 고객 지위·계약 법인·기초자산·비용·청산 조건·최신 규칙을 다시 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-japan-australia-leverage data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "split" && <SplitPanel />}
          {scene.panel === "japan" && <JapanPanel />}
          {scene.panel === "lossCut" && <LossCutPanel />}
          {scene.panel === "australia" && <AustraliaPanel />}
          {scene.panel === "shock" && <ShockPanel />}
          {scene.panel === "tmd" && <TmdPanel />}
          {scene.panel === "review" && <ReviewPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="일본·호주 레버리지와 상품 유통 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
