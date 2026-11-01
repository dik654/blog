import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["순위", "바닥", "증폭", "가정", "민감도", "비교", "경계"] as const;

const NOTES = [
  "회사 가치가 100이고 먼저 갚을 청구권이 60이면 주주 몫은 남은 40입니다. 주식은 약속된 금액이 아니라 앞 순위가 다 받고 남은 몫에 대한 권리입니다.",
  "회사 가치가 75로 줄면 주주 몫은 15가 되고, 40으로 줄면 주주 몫은 0입니다. 유한책임 때문에 0보다 아래로 내려가지는 않습니다.",
  "자산 수익률이 8%, 차입 금리가 5%, 부채와 자기자본이 같으면 주주 수익률은 11%입니다. 자산 수익률이 3%로 떨어지면 주주 수익률은 1%로 더 크게 낮아집니다.",
  "주식에는 만기와 약정 배당이 없으므로 미래 현금을 먼저 가정해야 합니다. 1년 뒤 배당 1,000원, 요구 수익률 8%, 영구 성장률 3%라면 고든 모형의 값은 2만 원입니다.",
  "요구 수익률은 8%로 둔 채 성장률만 3%에서 4%로 바꾸면 값은 2만 원에서 2만5천 원으로 25% 오릅니다. 작은 분모 때문에 가정 오차가 크게 증폭됩니다.",
  "비슷한 회사의 배수를 쓰면 긴 현금흐름 예측을 줄일 수 있지만 가정이 사라지는 것은 아닙니다. 비교 회사의 가격과 회계 기준, 자본구조가 맞는지 먼저 확인해야 합니다.",
  "주당 가치는 새 주식 발행으로 희석될 수 있고, 요구 수익률은 분산해도 남는 위험에서 정해집니다. 이 글은 현금흐름 가정을 다루고 위험의 가격은 다음 글로 넘깁니다.",
] as const;

type Panel = "rank" | "floor" | "leverage" | "assumption" | "sensitivity" | "multiple" | "boundary";

const SCENES = [
  {
    title: "회사 가치 100에서 앞 순위 60을 갚고 남은 40이 주주 몫입니다",
    detail: "같은 회사에 걸린 청구권을 지급 순서대로 놓습니다.",
    panel: "rank",
    formula: "주주 몫=max(회사 가치−앞 순위 청구액, 0)=40",
    conclusion: "주식은 정해진 지급 약속이 아니라 마지막에 남은 몫을 받을 권리입니다.",
  },
  {
    title: "회사 가치가 부채보다 작아져도 주주 몫은 0에서 멈춥니다",
    detail: "잔여청구권과 유한책임이 함께 만드는 꺾인 모양을 확인합니다.",
    panel: "floor",
    formula: "회사 75→주주 15 · 회사 40→주주 0",
    conclusion: "아래는 막혀 있고 위는 열려 있어 회사 가치 변화가 주주 쪽에서 더 크게 보입니다.",
  },
  {
    title: "빚은 사업 수익률과 차입 금리의 차이를 주주 돈 위에서 증폭합니다",
    detail: "같은 자산 100을 전부 자기 돈으로 살 때와 절반을 빌릴 때를 비교합니다.",
    panel: "leverage",
    formula: "ROE=ROA+(D/E)×(ROA−r_d)",
    conclusion: "레버리지는 수익을 새로 만들지 않고 이미 있는 차이를 좋은 쪽과 나쁜 쪽 모두 확대합니다.",
  },
  {
    title: "약속이 없는 주식은 먼저 미래 배당의 모양을 가정해야 합니다",
    detail: "배당이 매년 같은 비율로 영원히 늘어난다는 가장 단순한 모형을 적용합니다.",
    panel: "assumption",
    formula: "D₁ 1,000원 ÷ (r 8%−g 3%)=20,000원",
    conclusion: "계산값은 참값이 아니라 배당·성장률·요구 수익률이라는 가정의 결과입니다.",
  },
  {
    title: "성장률을 1%포인트만 올려도 평가액은 25% 커집니다",
    detail: "분모 r−g가 작을수록 작은 가정 차이가 큰 가격 차이로 바뀝니다.",
    panel: "sensitivity",
    formula: "g: 3%→4% · P: 20,000원→25,000원",
    conclusion: "영구 성장률을 과하게 잡으면 원하는 가격을 만드는 계산이 되므로 사용 범위를 먼저 제한해야 합니다.",
  },
  {
    title: "배수 평가는 긴 예측 대신 비교 회사의 가격을 빌려 씁니다",
    detail: "주주 몫끼리, 회사 전체끼리 분자와 분모를 맞춥니다.",
    panel: "multiple",
    formula: "주가÷주당순이익 · 기업가치÷이자 전 영업성과",
    conclusion: "비교 회사가 비싸게 거래되거나 기준이 다르면 그 오류도 평가 대상에 그대로 옮겨 옵니다.",
  },
  {
    title: "주식 수와 위험의 가격까지 정해야 한 주의 가치가 완성됩니다",
    detail: "이 글이 계산한 것과 다음 글에서 채워야 할 것을 분리합니다.",
    panel: "boundary",
    formula: "사업의 현금흐름 → 주주 몫 → 주식 수 → 한 주 가치",
    conclusion: "희석은 한 주의 몫을 바꾸고, 분산해도 남는 위험은 요구 수익률 r을 바꿉니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Cell({ title, value, active = false }: { title: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60" : "border-border"}`}>
      <p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{title}</p>
      <p className={`mt-1 break-keep font-mono text-[10px] font-black sm:text-sm ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="font-mono text-sm font-black text-primary">→</span>;
}

function RankPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="회사 가치가 선순위와 주주 몫으로 나뉘는 순서">
      <Cell title="회사 가치" value="100" />
      <Arrow />
      <Cell title="앞 순위" value="60" />
      <Arrow />
      <Cell title="주주" value="40" active />
    </div>
  );
}

function FloorPanel() {
  const cases = [["회사 100", "주주 40"], ["회사 75", "주주 15"], ["회사 40", "주주 0"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="회사 가치가 줄 때 주주 몫이 0에서 멈추는 세 사례">
      {cases.map(([firm, equity], index) => <Cell key={firm} title={firm} value={equity} active={index === 2} />)}
    </div>
  );
}

function LeveragePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="자산 수익률이 좋을 때와 나쁠 때 레버리지 효과">
      <div className="border border-border p-3 sm:p-4">
        <p className="text-[8px] font-black text-muted-foreground sm:text-xs">사업이 8% 벌 때</p>
        <p className="mt-2 font-mono text-[10px] font-black sm:text-sm">무차입 8%</p>
        <p className="mt-1 font-mono text-[10px] font-black text-primary sm:text-sm">절반 차입 11%</p>
      </div>
      <div className="border border-border p-3 sm:p-4">
        <p className="text-[8px] font-black text-muted-foreground sm:text-xs">사업이 3% 벌 때</p>
        <p className="mt-2 font-mono text-[10px] font-black sm:text-sm">무차입 3%</p>
        <p className="mt-1 font-mono text-[10px] font-black text-destructive sm:text-sm">절반 차입 1%</p>
      </div>
    </div>
  );
}

function AssumptionPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="배당 성장과 요구 수익률을 가정해 주식 가치를 계산하는 과정">
      <Cell title="1년 뒤 배당" value="1,000원" />
      <Arrow />
      <Cell title="r−g" value="8%−3%" />
      <Arrow />
      <Cell title="가치" value="20,000원" active />
    </div>
  );
}

function SensitivityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="성장률 가정 변화가 주식 가치에 미치는 영향">
      <Cell title="g 3%" value="20,000원" />
      <div className="text-center"><p className="font-mono text-xs font-black text-primary">+1%p →</p><p className="mt-1 text-[8px] font-bold text-muted-foreground sm:text-xs">가치 +25%</p></div>
      <Cell title="g 4%" value="25,000원" active />
    </div>
  );
}

function MultiplePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="주주 가치 배수와 기업 전체 가치 배수의 짝">
      <Cell title="주주 몫끼리" value="주가 ÷ 주당순이익" active />
      <Cell title="회사 전체끼리" value="기업가치 ÷ 영업성과" />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="회사 현금흐름에서 한 주 가치까지 남은 결정">
      <Cell title="주주 전체 몫" value="현금흐름" />
      <Arrow />
      <Cell title="희석 후 주식 수" value="한 주 몫" active />
      <Arrow />
      <Cell title="남은 질문" value="위험의 가격 r" />
    </div>
  );
}

export default function EquityValuationMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="주식 · 한 회사의 전체 지도"
      title="남는 몫이 한 주의 가치가 되기까지 순위, 레버리지, 성장 가정을 연결합니다"
      description="회사 가치 100, 앞 순위 청구액 60인 사례에서 시작해 유한책임과 레버리지를 거친 뒤, 배당 모형과 비교 배수의 경계까지 따라갑니다."
      note="회사 가치·부채·수익률·배당 값은 구조를 설명하기 위한 가정입니다. 세금·파산 비용·발행 조건은 단순화했고, 요구 수익률을 정하는 절차는 다음 위험 글에서 이어집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-equity-valuation-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "rank" && <RankPanel />}
          {scene.panel === "floor" && <FloorPanel />}
          {scene.panel === "leverage" && <LeveragePanel />}
          {scene.panel === "assumption" && <AssumptionPanel />}
          {scene.panel === "sensitivity" && <SensitivityPanel />}
          {scene.panel === "multiple" && <MultiplePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="주식 가치 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
