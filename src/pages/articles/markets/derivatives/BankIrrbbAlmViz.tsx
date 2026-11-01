import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["처음 장부", "금리 상승", "두 시간축", "위험 원인", "감독 충격", "ALCO", "스왑", "사후 관리"] as const;

const NOTES = [
  "고정금리 대출 100의 이자 5에서 변동금리 예금 80의 비용 1.6을 빼면 처음 순이자 차이는 3.4입니다.",
  "예금금리가 2%에서 3%로 먼저 오르면 비용은 2.4가 되고 순이자 차이는 2.6으로 0.8 줄어듭니다.",
  "NII는 앞으로 일정 기간의 이자수익과 비용을, EVE는 전체 미래 현금흐름을 오늘 가치로 바꾼 차이를 봅니다.",
  "금리 변경 시점이 다른 갭 위험, 기준금리가 다르게 움직이는 베이시스 위험, 고객 선택이 만기를 바꾸는 옵션 위험을 나눕니다.",
  "2026년 시행 Basel IRRBB 기준은 EVE에 여섯 감독 충격, NII에 두 충격을 적용하고 최악의 EVE 감소를 Tier 1 자본의 15% 기준과 비교합니다.",
  "ALCO는 대출·예금·채권·조달·파생상품을 한 장부에서 보고 위험 선호와 자본·유동성 한도 안에서 조정합니다.",
  "명목 80의 변동금리 수취·고정금리 지급 스왑은 1%포인트 상승 때 설명용 수취액 0.8을 늘려 예금비용 증가분과 맞춥니다.",
  "예금 잔액, 조기상환, 기준금리 차이와 담보·상대방 위험이 바뀌면 헤지 뒤 EVE와 NII를 다시 계산하고 규모를 조정합니다.",
] as const;

type Panel = "base" | "rise" | "clocks" | "risks" | "shocks" | "alco" | "swap" | "monitor";

const SCENES = [
  {
    title: "고정 대출 이자 5에서 변동 예금 비용 1.6을 빼면 처음 이자 차이는 3.4입니다",
    detail: "다른 비용과 수익을 제외한 설명용 장부이며 자산과 부채의 금리 변경 시점부터 확인합니다.",
    panel: "base",
    formula: "대출 100×5%=5 · 예금 80×2%=1.6 · 이자 차이=3.4",
    conclusion: "은행의 금리 위험은 금리 전망 하나보다 자산과 부채가 언제, 어떤 기준으로 다시 가격이 정해지는지에서 시작합니다.",
  },
  {
    title: "예금금리만 3%로 오르면 비용이 2.4가 되고 이자 차이는 2.6으로 줄어듭니다",
    detail: "대출 수입이 그대로인 동안 예금비용이 먼저 늘어 설명용 연간 순이자 차이가 0.8 감소합니다.",
    panel: "rise",
    formula: "80×3%=2.4 · 5−2.4=2.6 · 3.4−2.6=0.8 감소",
    conclusion: "이 0.8은 앞으로 한 기간의 이자 흐름을 본 NII 사례이며 전체 경제가치 변화와 같은 숫자가 아닙니다.",
  },
  {
    title: "같은 금리 충격을 NII와 EVE의 서로 다른 시간축으로 계산합니다",
    detail: "NII는 정한 기간의 수익·비용을, EVE는 미래 현금흐름 전체의 현재가치 차이를 봅니다.",
    panel: "clocks",
    formula: "NII=기간 이자수익−이자비용 · EVE=PV(자산 현금흐름)−PV(부채 현금흐름)",
    conclusion: "단기 이익이 버텨도 장기 경제가치가 크게 줄 수 있고, 반대 상황도 있어 두 측정을 함께 봅니다.",
  },
  {
    title: "금리 위험을 갭·베이시스·옵션의 세 원인으로 나눕니다",
    detail: "5년 고정 대출과 3개월 변동 예금, 서로 다른 기준금리, 고객의 조기상환 선택이 각각 다른 헤지를 요구합니다.",
    panel: "risks",
    formula: "변경 시점 차이=갭 · 기준금리 차이=베이시스 · 고객 선택=옵션",
    conclusion: "만기표 하나만 보면 기준금리의 갈라짐과 고객 행동이 만든 실제 현금흐름 변화를 놓칩니다.",
  },
  {
    title: "감독 충격은 평행·곡선 모양·단기금리 변화를 나눠 EVE와 NII를 흔듭니다",
    detail: "2026년 시행 기준은 통화별 충격값을 사용하며 본문의 1%포인트는 원리를 보이기 위한 가정입니다.",
    panel: "shocks",
    formula: "EVE 6개 충격 · NII 2개 충격 · 최악 ΔEVE ÷ Tier 1 자본과 15% 기준 비교",
    conclusion: "평행 상승만 시험하지 않고 가팔라짐·평평해짐과 단기금리 충격까지 보아 비평행 위험을 찾습니다.",
  },
  {
    title: "ALCO는 대출·예금·채권·조달·헤지를 한 장부에서 함께 조정합니다",
    detail: "한 데스크의 수익보다 은행 전체의 EVE·NII, 유동성, 자본과 위험 선호를 먼저 봅니다.",
    panel: "alco",
    formula: "현금흐름 지도 → 충격별 EVE·NII → 한도 → 조달·상품·헤지 결정",
    conclusion: "파생상품은 ALCO가 선택하는 위험 이동 수단이며 장부 전체의 측정과 의사결정을 대신하지 않습니다.",
  },
  {
    title: "명목 80의 변동금리 수취 스왑은 설명용 비용 증가 0.8과 맞습니다",
    detail: "고정금리를 지급하고 변동금리를 받으면 1%포인트 상승 때 수취액이 연 0.8 늘어납니다.",
    panel: "swap",
    formula: "스왑 80×1%=+0.8 · 예금비용 증가 −0.8 · 단순 합계 0",
    conclusion: "지급일·기준금리·할인·스프레드가 다르면 실제 상쇄액은 달라지므로 거래 뒤 다시 측정합니다.",
  },
  {
    title: "헤지 뒤에도 잔액·고객 행동·베이시스·담보와 상대방 위험을 계속 봅니다",
    detail: "예금이 80 아래로 줄거나 대출이 조기상환되면 명목 80의 스왑이 과한 위험을 새로 만들 수 있습니다.",
    panel: "monitor",
    formula: "실제 잔액 변화 → EVE·NII 재계산 → 한도 확인 → 헤지 규모 재조정",
    conclusion: "스왑 손익만 맞는다고 장부 전체가 안전해지는 것이 아니므로 헤지 전후의 남은 위험을 같은 장부에서 추적합니다.",
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

function BasePanel({ risen = false }: { risen?: boolean }) {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label={risen ? "예금금리 상승 뒤 이자 장부" : "금리 상승 전 이자 장부"}><Tile label="대출 이자" value="5.0" /><Tile label="예금 비용" value={risen ? "2.4" : "1.6"} /><Tile label="이자 차이" value={risen ? "2.6" : "3.4"} active /></div>;
}

function ClocksPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="순이자이익과 경제가치의 두 시간축"><Tile label="NII · 다음 기간" value="이자수익−이자비용" /><Tile label="EVE · 전체 미래" value="자산 PV−부채 PV" active /></div>;
}

function RisksPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="은행 장부 금리 위험의 세 원인"><Tile label="갭" value="변경 시점" /><Tile label="베이시스" value="기준금리" /><Tile label="옵션" value="고객 선택" active /></div>;
}

function ShocksPanel() {
  const shocks = ["평행 ↑", "평행 ↓", "가팔라짐", "평평해짐", "단기 ↑", "단기 ↓"];
  return <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-3" aria-label="IRRBB 여섯 감독 금리 충격">{shocks.map((shock, index) => <Tile key={shock} label={`${index + 1}번`} value={shock} active={index === 3} />)}</div>;
}

function AlcoPanel() {
  const books = ["대출", "예금", "채권", "조달", "헤지"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="ALCO가 함께 조정하는 은행 장부">{books.map((book, index) => <Tile key={book} label="ALCO 입력" value={book} active={index === books.length - 1} />)}</div>;
}

function SwapPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="예금 비용 증가와 금리스왑 수취액 상쇄"><Tile label="예금 비용" value="−0.8" /><span className="font-mono text-xs font-black">+</span><Tile label="변동 수취 스왑" value="+0.8" active /></div>;
}

function MonitorPanel() {
  const checks = [["잔액", "예금 이탈"], ["행동", "조기상환"], ["금리", "베이시스"], ["거래", "담보·상대방"]] as const;
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="금리 헤지 뒤 다시 확인할 위험">{checks.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === checks.length - 1} />)}</div>;
}

export default function BankIrrbbAlmViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="은행 ALM · EVE와 NII"
      title="예금금리 상승으로 줄어든 0.8을 은행 전체 장부에서 추적합니다"
      description="대출·예금의 금리 변경 시점에서 시작해 EVE·NII, 갭·베이시스·옵션 위험, 감독 충격, ALCO와 금리스왑의 사후 관리까지 이어 봅니다."
      note="100·80과 1%포인트는 계산 구조를 보이기 위한 가정입니다. 실제 은행은 통화별 감독 충격, 고객 행동, 자본·유동성 한도와 회계·담보 조건을 반영합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-bank-irrbb-alm data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "base" && <BasePanel />}
          {scene.panel === "rise" && <BasePanel risen />}
          {scene.panel === "clocks" && <ClocksPanel />}
          {scene.panel === "risks" && <RisksPanel />}
          {scene.panel === "shocks" && <ShocksPanel />}
          {scene.panel === "alco" && <AlcoPanel />}
          {scene.panel === "swap" && <SwapPanel />}
          {scene.panel === "monitor" && <MonitorPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="은행 장부 금리위험 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
