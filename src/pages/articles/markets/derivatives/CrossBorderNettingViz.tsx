import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["세 거래", "법률 지도", "부도", "상계 인정", "상계 불확실", "규제 인정", "의견 범위", "전환"] as const;

const NOTES = [
  "같은 기본계약 아래 +12·−7·−2인 세 거래는 종료 일괄상계가 유효할 때 하나의 순수취액 +3이 됩니다.",
  "계약 묶음뿐 아니라 준거법, 당사자 법인과 지점, 도산·정리 관할을 함께 확인해야 순액의 법적 근거가 생깁니다.",
  "부도 사건 뒤 종료·가치평가·통화환산·합산을 거쳐 한 당사자가 한 번 지급할 금액을 만듭니다.",
  "상계가 집행 가능하고 담보가 4라면 설명용 미담보 노출은 max(3−4,0)=0입니다.",
  "상계가 불확실하면 받을 거래 12를 지급 거래와 따로 보아 담보 4 뒤 노출을 max(12−4,0)=8로 계산할 수 있습니다.",
  "본국과 현지국의 규제 인정은 비청산 증거금 의무의 중복을 줄일 수 있지만 도산법상 상계 효력을 대신하지 않습니다.",
  "법률의견은 당사자·지점·상품·문서·준거법·도산 절차와 검토 시점을 가진 적용 범위 문서입니다.",
  "새 상품·지점·법 개정·의견 만료가 범위를 벗어나면 위험 장부를 순액 기준에서 총액 기준으로 전환합니다.",
] as const;

type Panel = "trades" | "map" | "default" | "net" | "gross" | "recognition" | "opinion" | "switch";

const SCENES = [
  {
    title: "세 거래를 따로 보면 받을 돈 12와 줄 돈 9가 함께 남습니다",
    detail: "종료 일괄상계가 유효하면 세 현재가치를 더해 하나의 순수취액 3으로 바꿉니다.",
    panel: "trades",
    formula: "+12−7−2=+3",
    conclusion: "순액 3은 가격 계산만의 결과가 아니라 같은 계약 묶음과 집행 가능한 법률효과가 함께 만든 값입니다.",
  },
  {
    title: "순액 3을 쓰기 전에 계약·당사자·준거법·도산 관할을 한 지도에 놓습니다",
    detail: "같은 국가 이름만 보고 본점, 지점과 자회사를 같은 법적 범위로 처리하지 않습니다.",
    panel: "map",
    formula: "계약 묶음 + 법인·지점 + 준거법 + 도산·정리 관할",
    conclusion: "각 칸이 법률의견의 범위 안에 있어야 거래 장부의 상계 인정 표시를 켤 수 있습니다.",
  },
  {
    title: "부도 사건이 나면 종료·평가·환산·합산을 거쳐 한 지급액을 만듭니다",
    detail: "통지 시점과 가격 자료, 계산 대리인, 정리당국의 일시정지 권한도 이 경로의 일부입니다.",
    panel: "default",
    formula: "부도 사건 → 종료 → 가치평가 → 통화환산 → 합산 → 한 번 지급",
    conclusion: "상계는 숫자 세 개를 바로 더하는 기능이 아니라 계약과 현지법에 묶인 실행 절차입니다.",
  },
  {
    title: "상계가 인정되면 순수취 3에서 담보 4를 빼 미담보 노출 0을 봅니다",
    detail: "설명용 단순 계산이며 실제 위험 측정은 담보의 적격성·헤어컷·시점과 계약 조건을 더 반영합니다.",
    panel: "net",
    formula: "max(순액 3−담보 4, 0)=0",
    conclusion: "법적으로 집행 가능한 순액을 위험·한도·자본 계산의 출발점으로 사용할 수 있습니다.",
  },
  {
    title: "상계가 불확실하면 받을 거래 12와 지급 거래 9를 따로 집행할 가능성을 봅니다",
    detail: "같은 담보 4가 있어도 총 양수 가치 12에서 빼면 설명용 미담보 노출은 8입니다.",
    panel: "gross",
    formula: "max(총 양수 12−담보 4, 0)=8 · 순액 기준과 차이 8",
    conclusion: "법률 판단 하나가 같은 시장가치의 담보·한도·자본 수요를 바꿀 수 있습니다.",
  },
  {
    title: "규제 인정은 본국·현지국 증거금 의무의 중복을 줄이는 감독 판단입니다",
    detail: "BCBS–IOSCO 기준은 일관되고 중복되지 않는 국경 간 비청산 증거금 체계를 지향합니다.",
    panel: "recognition",
    formula: "본국 규칙 ↔ 현지 규칙 · 동등성 판단 → 한 체계의 준수 인정 가능",
    conclusion: "감독상 대체준수나 동등성은 도산관재인에게 순액 3을 집행할 수 있다는 사법 판단이 아닙니다.",
  },
  {
    title: "법률의견은 어느 당사자·상품·문서·법과 시점까지 결론이 유효한지 적습니다",
    detail: "한 장의 의견을 다른 지점, 새 상품과 개정된 법에 영구 재사용하지 않습니다.",
    panel: "opinion",
    formula: "당사자 + 지점 + 상품 + 문서 버전 + 준거법·도산법 + 검토일",
    conclusion: "위험 시스템은 상계 인정 여부뿐 아니라 근거 문서의 적용 범위와 만료·예외를 함께 저장해야 합니다.",
  },
  {
    title: "범위를 벗어나는 변화가 생기면 순액 장부를 총액 장부로 전환합니다",
    detail: "새 상품·새 지점·법 개정·의견 만료를 감지한 뒤 재검토가 끝날 때까지 보수적인 노출을 사용합니다.",
    panel: "switch",
    formula: "근거 유효: 3→0 · 근거 미확인: 12→8",
    conclusion: "좋은 통제는 순액과 총액을 모두 보관하고 법률 근거가 흔들릴 때 담보·한도·자본을 함께 다시 계산합니다.",
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

function TradesPanel() {
  return <div className="grid grid-cols-[1fr_1fr_1fr_0.9fr] gap-1.5 sm:gap-3" aria-label="세 거래의 현재가치와 순액"><Tile label="거래 A" value="+12" /><Tile label="거래 B" value="−7" /><Tile label="거래 C" value="−2" /><Tile label="순액" value="+3" active /></div>;
}

function MapPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="종료 일괄상계의 법률 지도"><Tile label="계약" value="상계 묶음" /><Tile label="당사자" value="법인·지점" /><Tile label="준거법" value="문서의 법" /><Tile label="도산 관할" value="법원·정리당국" active /></div>;
}

function DefaultPanel() {
  const steps = ["종료", "평가", "환산", "합산", "지급"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="부도 뒤 종료 일괄상계 절차">{steps.map((step, index) => <Tile key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function ExposurePanel({ net }: { net: boolean }) {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label={net ? "상계 인정 시 노출 계산" : "상계 불확실 시 노출 계산"}><Tile label={net ? "인정 순액" : "총 양수 가치"} value={net ? "3" : "12"} /><Tile label="담보" value="4" /><Tile label="미담보 노출" value={net ? "0" : "8"} active /></div>;
}

function RecognitionPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="본국과 현지국 증거금 규칙의 상호인정"><Tile label="본국 감독" value="증거금 규칙 A" /><span className="font-mono text-xs font-black">↔</span><Tile label="현지 감독" value="규칙 B 인정 가능" active /></div>;
}

function OpinionPanel() {
  const items = [["당사자", "법인·지점"], ["상품", "거래 유형"], ["문서", "버전"], ["법", "준거·도산"], ["시점", "검토일"]] as const;
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="관할별 법률의견의 적용 범위">{items.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === items.length - 1} />)}</div>;
}

function SwitchPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="법률 근거 변화에 따른 노출 기준 전환"><Tile label="근거 유효" value="순액 3 → 노출 0" /><span className="font-mono text-xs font-black">→</span><Tile label="범위 밖·만료" value="총액 12 → 노출 8" active /></div>;
}

export default function CrossBorderNettingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="국경 간 상계 · 계약 효과와 감독 인정"
      title="세 거래의 순액 3은 법률 근거가 유효할 때만 위험 숫자가 됩니다"
      description="+12·−7·−2인 세 거래가 부도 뒤 하나의 지급액이 되는 과정과, 근거가 흔들릴 때 총액 노출로 되돌아가는 운영 경로를 추적합니다."
      note="수치는 구조를 설명하기 위한 가정입니다. 실제 상계·담보·자본 처리는 당사자·문서·준거법·도산 관할과 적용 규칙을 법률·위험 담당자가 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-cross-border-netting data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "trades" && <TradesPanel />}
          {scene.panel === "map" && <MapPanel />}
          {scene.panel === "default" && <DefaultPanel />}
          {scene.panel === "net" && <ExposurePanel net />}
          {scene.panel === "gross" && <ExposurePanel net={false} />}
          {scene.panel === "recognition" && <RecognitionPanel />}
          {scene.panel === "opinion" && <OpinionPanel />}
          {scene.panel === "switch" && <SwitchPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="국경 간 종료 일괄상계 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
