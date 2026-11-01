import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["100건", "분류", "청산 60", "비청산 40", "보고 100", "동시 상태", "대조", "경계"] as const;

const NOTES = [
  "장외파생 100건을 설명용 묶음으로 두고 의무청산 60건, 비청산 40건과 보고 출발점 100건을 서로 다른 상태로 추적합니다.",
  "상품·거래상대·문턱·예외를 계약별로 대입해야 중앙청산 대상과 비청산 경로가 갈립니다.",
  "청산 60건은 CCP가 원래 두 거래상대 사이에 들어가 증거금과 부도처리 순서를 운영합니다.",
  "비청산 40건은 무규제 계약이 아니라 확인·평가·포트폴리오 대조·분쟁 처리와 담보를 두 회사가 직접 관리합니다.",
  "거래보고는 청산 여부와 별도이므로 청산 60건과 비청산 40건 모두의 체결·변경·종료 상태가 저장소로 갈 수 있습니다.",
  "한 계약은 청산 상태, 담보 상태와 보고 상태를 동시에 가지며 한 칸이 완료돼도 다른 칸이 자동 완료되지 않습니다.",
  "운영 장부는 계약 100, 청산 60, 비청산 40, 보고 대상 100과 누락·불일치를 매일 다른 분모로 대조합니다.",
  "나라·상품·거래상대·예외·시행일이 바뀌면 같은 계약의 결과도 달라지므로 EU 결과를 미국에 그대로 복사하지 않습니다.",
] as const;

type Panel = "book" | "classify" | "clear" | "bilateral" | "report" | "states" | "reconcile" | "boundary";

const SCENES = [
  {
    title: "장외계약 100건이 청산 60건과 비청산 40건으로 갈려도 보고 출발점은 100건일 수 있습니다",
    detail: "숫자는 적용 범위의 차이를 보이기 위한 가정이며 실제 범위는 계약과 거래상대별로 판단합니다.",
    panel: "book",
    formula: "전체 100=청산 60+비청산 40 · 보고 출발점 100",
    conclusion: "청산 비율 60%와 보고 대상 100건은 서로 다른 의무의 분모이므로 모순이 아닙니다.",
  },
  {
    title: "상품·거래상대·문턱·예외를 차례로 대입해야 실행 경로가 정해집니다",
    detail: "거래 목적이 헤지라는 이유만으로 청산·보고·위험 완화 의무가 자동 면제되지는 않습니다.",
    panel: "classify",
    formula: "상품 분류 → 거래상대 → 청산 문턱 → 그룹·최종사용자 예외 → 적용 의무",
    conclusion: "의무의 입력값을 계약별 상태표에 저장해야 법무·운영·위험팀이 같은 100건을 셉니다.",
  },
  {
    title: "청산 60건은 CCP가 두 회사 사이에 들어가 두 계약과 증거금 계정으로 바뀝니다",
    detail: "청산소는 각 거래의 반대편이 되고 증거금·부도기금·부도처리 순서를 운영합니다.",
    panel: "clear",
    formula: "회사 A↔회사 B → 회사 A↔CCP↔회사 B · 청산 비율=60÷100=60%",
    conclusion: "상대방 위험을 표준화해 모으는 대신 CCP·청산회원·유동성·운영 위험을 새로 관리합니다.",
  },
  {
    title: "비청산 40건은 두 회사가 확인·평가·대조·분쟁과 담보를 직접 운영합니다",
    detail: "중앙청산 밖에 남았다는 사실을 무담보나 무규제와 같은 뜻으로 읽지 않습니다.",
    panel: "bilateral",
    formula: "계약 확인 → 일일 평가 → 포트폴리오 대조 → 분쟁 처리 → 양자 증거금",
    conclusion: "비청산 위험 완화는 계약의 가격과 담보가 어긋나는 시간을 줄이는 별도 운영 흐름입니다.",
  },
  {
    title: "거래정보저장소는 청산 60건과 비청산 40건의 생애주기 정보를 함께 받습니다",
    detail: "저장소는 감독 자료를 모으지만 계약 상대가 되거나 지급을 보증하지 않습니다.",
    panel: "report",
    formula: "체결·변경·평가·청산·종료 이벤트 + 거래 식별자 → 거래정보저장소",
    conclusion: "제출 메시지 수와 계약 수는 다를 수 있으므로 보고 완료를 계약 100건의 위험 이전으로 해석하지 않습니다.",
  },
  {
    title: "한 계약은 청산·담보·보고의 세 상태를 동시에 가지며 완료 주체도 다릅니다",
    detail: "CCP, 양자 담보 운영과 보고 주체가 서로 다른 필드를 바꾸므로 하나의 완료 표시로 합치지 않습니다.",
    panel: "states",
    formula: "계약 ID → 청산 상태 · 담보/분쟁 상태 · 보고 생애주기 상태",
    conclusion: "각 상태의 책임자와 실패 조건을 따로 두어야 재전송·담보 분쟁·청산 거절을 정확히 복구할 수 있습니다.",
  },
  {
    title: "운영 대조는 계약·청산·비청산·보고를 서로 다른 분모로 매일 맞춥니다",
    detail: "예시는 100건이 모두 분류되고 보고됐다는 정상 장부이며 실제 운영에서는 누락과 중복을 별도로 셉니다.",
    panel: "reconcile",
    formula: "전체 100=60+40 · 보고 대상 100−보고 완료 100=누락 0",
    conclusion: "한 숫자만 맞추지 않고 청산 거절, 담보 불일치, 보고 누락과 중복을 계약 ID로 되짚습니다.",
  },
  {
    title: "관할·상품·상대방·예외·적용일을 붙여야 다른 시장의 결과를 잘못 복사하지 않습니다",
    detail: "EU EMIR과 미국 CFTC는 공통 원리가 있어도 구체적인 상품 범위와 거래상대 예외가 다릅니다.",
    panel: "boundary",
    formula: "관할 + 상품 정의 + 거래상대 + 문턱·예외 + 규칙 버전·적용일",
    conclusion: "좋은 비교는 ‘60% 청산’이라는 결과보다 어떤 규칙으로 60건을 골랐는지를 먼저 보존합니다.",
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

function BookPanel() {
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="장외계약 100건의 청산 비청산 보고 장부"><Tile label="전체" value="100건" /><Tile label="청산" value="60건" active /><Tile label="비청산" value="40건" /><Tile label="보고 출발점" value="100건" active /></div>;
}

function ClassifyPanel() {
  const steps = [["1", "상품"], ["2", "상대방"], ["3", "문턱"], ["4", "예외"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="장외파생 계약의 의무 분류 순서">{steps.map(([n, label], index) => <Tile key={n} label={`${n}단계`} value={label} active={index === 3} />)}</div>;
}

function ClearPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="중앙청산소가 두 거래상대 사이에 들어가는 과정"><Tile label="회사 A" value="원계약" /><span className="font-mono text-xs font-black">↔</span><Tile label="CCP" value="두 계약·증거금" active /><span className="font-mono text-xs font-black">↔</span><Tile label="회사 B" value="원계약" /></div>;
}

function BilateralPanel() {
  const steps = ["확인", "평가", "대조", "분쟁", "담보"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="비청산 장외계약의 위험 완화 순서">{steps.map((step, index) => <Tile key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function ReportPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="청산과 비청산 계약의 거래정보저장소 보고"><Tile label="청산" value="60건" /><span className="font-mono text-xs font-black">↘</span><Tile label="거래정보저장소" value="생애주기 자료" active /><span className="font-mono text-xs font-black">↗</span><Tile label="비청산" value="40건" /></div>;
}

function StatesPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="계약 하나가 동시에 가지는 세 규제 상태"><Tile label="청산 상태" value="대상·수락·CCP" /><Tile label="담보 상태" value="평가·분쟁·증거금" /><Tile label="보고 상태" value="체결·변경·종료" active /></div>;
}

function ReconcilePanel() {
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="장외파생 운영 장부의 일일 대조"><Tile label="계약" value="100" /><Tile label="청산" value="60" /><Tile label="비청산" value="40" /><Tile label="보고 누락" value="0" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="장외파생 규칙 비교의 다섯 경계"><Tile label="관할" value="EU·미국" /><Tile label="상품" value="금리·신용 등" /><Tile label="상대방" value="FC·NFC 등" /><Tile label="조건" value="문턱·예외" /><Tile label="시점" value="버전·적용일" active /></div>;
}

export default function OtcClearingReportingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11500, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="장외파생 · 청산·담보·보고의 세 상태"
      title="계약 100건은 청산 60, 비청산 40과 보고 100의 장부를 동시에 가집니다"
      description="같은 계약 묶음을 중앙청산, 비청산 위험 완화와 거래보고의 서로 다른 상태로 나누고 각 경로의 책임과 실패를 추적합니다."
      note="100·60·40은 적용 범위의 차이를 보이기 위한 가정입니다. 실제 의무는 관할·상품·거래상대·문턱·예외·규칙 버전과 적용일을 계약별로 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-otc-clearing-reporting data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "book" && <BookPanel />}
          {scene.panel === "classify" && <ClassifyPanel />}
          {scene.panel === "clear" && <ClearPanel />}
          {scene.panel === "bilateral" && <BilateralPanel />}
          {scene.panel === "report" && <ReportPanel />}
          {scene.panel === "states" && <StatesPanel />}
          {scene.panel === "reconcile" && <ReconcilePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="장외파생 청산·담보·보고 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
