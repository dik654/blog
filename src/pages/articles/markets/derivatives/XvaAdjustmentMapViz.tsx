import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["기준", "조정", "신용", "자금", "독립", "동시", "경로", "경계"] as const;

const NOTES = [
  "부도와 자금비용을 빼기 전 모형가격 10에서 시작합니다. 이 값은 시장 현금흐름만 반영한 설명용 기준가격입니다.",
  "CVA 0.6을 빼고 DVA 0.2를 더한 뒤 FVA 0.3과 MVA 0.1을 빼면 설명용 거래가치는 9.2가 됩니다.",
  "CVA는 상대방이 먼저 부도날 때 받을 양의 노출의 손실을, DVA는 은행 자신의 부도 가능성이 부채 가치에 미치는 효과를 봅니다.",
  "FVA는 무담보 자금조달 비용을, MVA는 개시증거금을 조달해 묶어 두는 비용을 봅니다. 증거금 5에 2%를 1년 적용한 단순 MVA는 0.1입니다.",
  "노출 10, 부도확률 2%, 손실률 60%를 서로 독립으로 놓으면 단순 CVA 근사는 0.12입니다.",
  "같은 충격에서 노출이 18, 부도확률이 5%로 함께 오르면 손실 근사는 0.54입니다. 독립 근사의 4.5배입니다.",
  "실무에서는 시장 경로마다 거래가치, 상계와 담보, 부도와 자금비용을 같은 계약 조건으로 전진시킨 뒤 네 조정을 계산합니다.",
  "네 값을 더하기 전에 상계집합, 담보, 곡선, 부호와 공통 위험요인을 확인합니다. 같은 효과를 두 번 세면 9.2라는 합계도 의미가 없습니다.",
] as const;

type Panel = "clean" | "ledger" | "credit" | "funding" | "independent" | "wrongWay" | "path" | "boundary";

const SCENES = [
  {
    title: "시장 현금흐름만 가격 낸 기준값 10에서 시작합니다",
    detail: "상대방 부도, 은행 자신의 신용, 무담보 자금과 개시증거금 비용은 아직 장부에 들어오지 않았습니다.",
    panel: "clean",
    formula: "기준가격 = 10",
    conclusion: "xVA는 새 상품 하나가 아니라 실제 계약에서 빠진 신용·자금·담보 효과를 기준가격에 연결하는 조정 장부입니다.",
  },
  {
    title: "네 조정을 한 칸씩 반영하면 기준값 10이 거래가치 9.2가 됩니다",
    detail: "최종 합계만 보지 않고 각 조정이 가치를 어느 방향으로 바꾸는지 차례로 추적합니다.",
    panel: "ledger",
    formula: "10−0.6+0.2−0.3−0.1 = 9.2",
    conclusion: "CVA·DVA·FVA·MVA가 서로 다른 위험을 나타내는지 확인해야 이 합계가 유효합니다.",
  },
  {
    title: "상대방 부도 손실과 은행 자신의 신용 효과는 반대 방향으로 들어옵니다",
    detail: "누가 먼저 부도나는지와 그때 거래가 양의 노출인지 음의 노출인지가 출발점입니다.",
    panel: "credit",
    formula: "상대방 부도 손실 → CVA −0.6 · 자기 신용 효과 → DVA +0.2",
    conclusion: "두 항을 같은 부도확률이나 같은 노출로 계산하면 계약의 방향과 부호가 뒤섞입니다.",
  },
  {
    title: "무담보 자금 0.3과 개시증거금 비용 0.1을 서로 다른 장부로 둡니다",
    detail: "현재 거래가치의 자금조달과 미래 개시증거금을 묶어 두는 비용은 같은 현금흐름이 아닙니다.",
    panel: "funding",
    formula: "MVA 단순 근사 = 증거금 5 × 스프레드 2% × 1년 = 0.1",
    conclusion: "담보를 늘려 신용위험을 낮춰도 개시증거금 조달 부담은 오히려 커질 수 있습니다.",
  },
  {
    title: "노출과 부도를 독립으로 놓으면 상대방 손실 근사는 0.12입니다",
    detail: "한 시점의 양의 노출, 부도확률과 회수하지 못하는 비율을 곱해 시간 적분을 한 칸으로 줄입니다.",
    panel: "independent",
    formula: "10 × 2% × (1−40%) = 10 × 0.02 × 0.60 = 0.12",
    conclusion: "0.12는 할인, 여러 시점과 노출·부도 사이의 관계를 생략한 설명용 근사입니다.",
  },
  {
    title: "시장 충격이 노출과 부도확률을 함께 올리면 손실 근사는 0.54가 됩니다",
    detail: "노출은 10에서 18로 1.8배, 부도확률은 2%에서 5%로 2.5배가 되어 곱은 4.5배로 커집니다.",
    panel: "wrongWay",
    formula: "18 × 5% × 60% = 0.54 · 0.54 ÷ 0.12 = 4.5배",
    conclusion: "잘못된 방향의 위험은 각각의 입력을 따로 충격하는 검사보다 같은 원인으로 함께 악화되는 경로에서 드러납니다.",
  },
  {
    title: "시장 경로마다 거래가치·담보·부도·자금비용을 같은 순서로 계산합니다",
    detail: "계약과 상계집합을 고정한 뒤 여러 미래 시점의 노출과 증거금, 신용과 조달곡선을 함께 맞춥니다.",
    panel: "path",
    formula: "시장 경로 → 거래 재평가 → 상계·담보 → 부도·자금 → xVA 장부",
    conclusion: "가격, 신용위험, 자금과 담보 운영이 같은 거래 식별자와 계약 버전을 써야 계산과 실제 자산 이동을 비교할 수 있습니다.",
  },
  {
    title: "부호·계약·공통 위험요인을 확인한 뒤에만 네 조정을 합칩니다",
    detail: "숫자 네 개가 있다고 자동으로 더하지 않고 어떤 현금흐름과 상태를 누가 소유하는지부터 확인합니다.",
    panel: "boundary",
    formula: "정의 → 상계집합 → 담보 → 곡선·모형 → 중복검사 → 합계",
    conclusion: "좋은 xVA 보고서는 9.2뿐 아니라 각 항의 가정, 민감도, 실제 담보 실패와 다시 계산할 수 있는 버전을 함께 남깁니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Box({ label, value, active = false, danger = false }: { label: string; value: string; active?: boolean; danger?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${danger ? "text-destructive" : active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow({ children = "→" }: { children?: string }) {
  return <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground sm:text-base">{children}</div>;
}

function CleanPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="시장 현금흐름에서 기준가격 10을 계산한 상태">
      <Box label="계약 현금흐름" value="시장 모형으로 할인" />
      <Arrow />
      <Box label="기준가격" value="10" active />
    </div>
  );
}

function LedgerPanel() {
  const entries = [
    ["기준", "10"],
    ["CVA −0.6", "9.4"],
    ["DVA +0.2", "9.6"],
    ["FVA −0.3", "9.3"],
    ["MVA −0.1", "9.2"],
  ] as const;
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="기준가격에 네 xVA 조정을 차례로 반영하는 장부">
      {entries.map(([label, value], index) => <Box key={label} label={label} value={value} active={index === entries.length - 1} />)}
    </div>
  );
}

function CreditPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="상대방 신용과 은행 자신의 신용 조정 비교">
      <Box label="상대방 먼저 부도" value="받을 양의 노출 손실 · CVA −0.6" danger />
      <Box label="은행 자신이 부도" value="지급할 부채 가치 효과 · DVA +0.2" active />
    </div>
  );
}

function FundingPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4" aria-label="FVA와 MVA의 자금 장부 비교">
      <Box label="FVA" value="무담보 자금비용 0.3" />
      <span className="hidden sm:flex"><Arrow>≠</Arrow></span>
      <Box label="MVA" value="5×2%×1년=0.1" active />
    </div>
  );
}

function IndependentPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="노출과 부도확률을 독립으로 둔 단순 CVA 계산">
      <Box label="양의 노출" value="10" />
      <span className="hidden sm:flex"><Arrow>×</Arrow></span>
      <Box label="부도확률" value="2%" />
      <span className="hidden sm:flex"><Arrow>×</Arrow></span>
      <Box label="손실률" value="60% → 0.12" active />
    </div>
  );
}

function WrongWayPanel() {
  return (
    <div className="space-y-2.5" aria-label="독립 근사와 잘못된 방향의 위험 손실 비교">
      <div className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-2 sm:grid-cols-[7rem_1fr_4rem]">
        <p className="break-keep text-[9px] font-black sm:text-xs">독립 가정</p>
        <div className="h-3 border border-border sm:h-4"><div className="h-full w-[22%] bg-muted-foreground/45" /></div>
        <p className="text-right font-mono text-[10px] font-black sm:text-sm">0.12</p>
      </div>
      <div className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-2 sm:grid-cols-[7rem_1fr_4rem]">
        <p className="break-keep text-[9px] font-black sm:text-xs">동시 악화</p>
        <div className="h-3 border border-foreground/50 sm:h-4"><div className="h-full w-full bg-primary/75" /></div>
        <p className="text-right font-mono text-[10px] font-black text-primary sm:text-sm">0.54</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Box label="노출" value="10 → 18 · 1.8배" />
        <Box label="부도확률" value="2% → 5% · 2.5배" danger />
      </div>
    </div>
  );
}

function PathPanel() {
  const steps = [
    ["시장 경로", "금리·환율·가격"],
    ["거래 재평가", "시점별 +/− 가치"],
    ["상계·담보", "노출·개시증거금"],
    ["신용·자금", "PD·LGD·조달곡선"],
    ["조정 장부", "CVA·DVA·FVA·MVA"],
  ] as const;
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="시장 시나리오에서 xVA 장부까지 계산하는 경로">
      {steps.map(([label, value], index) => <Box key={label} label={`${index + 1} · ${label}`} value={value} active={index === steps.length - 1} />)}
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="xVA 합산 전 확인할 네 경계">
      <Box label="계약" value="상계집합·통화·만기" />
      <Box label="담보" value="VM·IM·위험기간" />
      <Box label="모형" value="곡선·노출·부도 관계" />
      <Box label="통제" value="부호·중복·버전" active />
    </div>
  );
}

export default function XvaAdjustmentMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="xVA · 기준가격 10에서 시작하는 전체 지도"
      title="네 조정으로 9.2를 만들고 동시 악화에서 0.54가 되는 이유를 추적합니다"
      description="CVA·DVA·FVA·MVA를 한 약어로 외우지 않고 가치가 바뀌는 장부로 연 뒤, 노출과 부도확률이 함께 움직일 때 독립 근사가 놓치는 위험까지 이어 봅니다."
      note="10, 0.6, 0.2, 0.3, 0.1과 한 시점의 부도확률은 작동 원리를 설명하기 위한 가정입니다. 실제 값은 계약, 상계집합, 담보, 여러 미래 시점, 시장·신용·조달 곡선과 기관의 평가 목적에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-xva-adjustment-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "clean" && <CleanPanel />}
          {scene.panel === "ledger" && <LedgerPanel />}
          {scene.panel === "credit" && <CreditPanel />}
          {scene.panel === "funding" && <FundingPanel />}
          {scene.panel === "independent" && <IndependentPanel />}
          {scene.panel === "wrongWay" && <WrongWayPanel />}
          {scene.panel === "path" && <PathPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="xVA 계산 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
