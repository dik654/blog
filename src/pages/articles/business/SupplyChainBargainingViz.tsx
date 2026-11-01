import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["부품", "조립", "이동", "판매", "통계", "협상", "관세"] as const;

const NOTES = [
  "다른 나라의 부품업체가 40달러어치 부품을 보냅니다. 이 금액은 아직 최종 소비가격도, 조립국이 새로 만든 가치도 아닙니다.",
  "조립국이 노동과 설비 등으로 20달러를 더합니다. 출하가격은 60달러가 되지만 조립국의 국내 부가가치는 설명용 가정에서 20달러입니다.",
  "국제 운송과 통관 단계에서 10달러가 더해집니다. 어느 서비스가 어느 나라의 부가가치인지는 실제 계약과 투입 자료를 더 확인해야 합니다.",
  "브랜드와 판매 단계가 30달러를 더하면 고객 가격은 100달러가 됩니다. 이 30달러도 광고·재고·반품 비용을 빼기 전 금액입니다.",
  "부품 수출 40달러와 완제품 수출 60달러를 더한 100달러는 국경 거래 총액입니다. 40달러가 60달러 안에 포함되므로 이를 모두 새 가치라고 읽지 않습니다.",
  "협상력은 공장 크기만으로 정해지지 않습니다. 대체 공급자, 인증과 설비의 전환 비용, 규격 승인, 고객 접근을 누가 통제하는지 확인합니다.",
  "과세가격을 60달러, 관세율을 10%로 가정하면 관세는 6달러입니다. 소비가격을 100달러로 유지하면 판매 몫이 24달러로 줄고, 판매 몫 30달러를 유지하면 가격이 106달러가 됩니다.",
] as const;

type StageKey = "parts" | "assembly" | "logistics" | "sales";

type Scene = {
  title: string;
  detail: string;
  active: readonly StageKey[];
  values: Record<StageKey, number>;
  cumulative: number;
  mode: "flow" | "statistics" | "power" | "tariff";
  formula: string;
  conclusion: string;
};

const ZERO_VALUES: Record<StageKey, number> = {
  parts: 0,
  assembly: 0,
  logistics: 0,
  sales: 0,
};

const FULL_VALUES: Record<StageKey, number> = {
  parts: 40,
  assembly: 20,
  logistics: 10,
  sales: 30,
};

const SCENES: readonly Scene[] = [
  {
    title: "부품 40달러가 첫 번째 국경을 넘습니다",
    detail: "부품업체가 받은 40달러는 완제품을 만들기 위한 중간투입입니다. 아직 조립국에서 새로 더한 가치는 없습니다.",
    active: ["parts"],
    values: { ...ZERO_VALUES, parts: 40 },
    cumulative: 40,
    mode: "flow",
    formula: "누적 거래가격 = 부품 40달러",
    conclusion: "국경을 넘은 금액과 그 나라에서 새로 만든 가치는 같은 숫자가 아닙니다.",
  },
  {
    title: "조립국이 20달러를 더해 60달러에 출하합니다",
    detail: "외국 부품 40달러에 조립국의 노동·설비 등이 만든 20달러가 더해집니다. 이 사례에서 60달러는 총수출액, 20달러는 국내 부가가치입니다.",
    active: ["parts", "assembly"],
    values: { ...ZERO_VALUES, parts: 40, assembly: 20 },
    cumulative: 60,
    mode: "flow",
    formula: "수출 60 − 외국 부품 40 = 국내 부가가치 20달러",
    conclusion: "수출액 60달러 전부가 조립국에 남는 것은 아닙니다.",
  },
  {
    title: "국제 물류가 10달러를 더합니다",
    detail: "운송·보험·통관 같은 서비스가 제품을 다음 시장으로 옮깁니다. 이 비용을 누가 부담하는지는 계약과 관세평가 방식에 따라 달라집니다.",
    active: ["parts", "assembly", "logistics"],
    values: { ...ZERO_VALUES, parts: 40, assembly: 20, logistics: 10 },
    cumulative: 70,
    mode: "flow",
    formula: "부품 40 + 조립 20 + 물류 10 = 70달러",
    conclusion: "물류비는 제품 이동의 대가이며 조립국의 제조 부가가치와 구분합니다.",
  },
  {
    title: "브랜드와 판매 단계가 30달러를 더해 고객에게 팝니다",
    detail: "판매자는 고객을 찾고 재고·광고·반품 위험을 부담합니다. 30달러는 이 비용을 차감하기 전 단계별 몫이며 순이익으로 확정할 수 없습니다.",
    active: ["parts", "assembly", "logistics", "sales"],
    values: FULL_VALUES,
    cumulative: 100,
    mode: "flow",
    formula: "40 + 20 + 10 + 30 = 최종 소비가격 100달러",
    conclusion: "최종가격은 네 단계의 금액이 쌓인 결과입니다.",
  },
  {
    title: "국경 거래 총액과 새 부가가치를 다른 장부에서 봅니다",
    detail: "부품 40달러가 완제품 60달러 안에 들어 있습니다. 두 수출을 더한 100달러를 조립국이 새로 만든 가치라고 읽으면 같은 부품을 다시 셉니다.",
    active: ["parts", "assembly"],
    values: FULL_VALUES,
    cumulative: 100,
    mode: "statistics",
    formula: "국경 거래 40 + 60 = 100달러 ≠ 조립국의 새 가치 20달러",
    conclusion: "총수출 통계와 부가가치 통계는 서로 다른 질문에 답합니다.",
  },
  {
    title: "대체하기 어려운 지점을 가진 쪽이 계약 조건을 바꿉니다",
    detail: "공장 수가 아니라 교체 가능한 공급자 수, 재인증 시간, 규격 승인권, 고객 접근권을 확인합니다. 한 지점의 통제가 다른 단계의 몫을 바꿀 수 있습니다.",
    active: ["parts", "assembly", "logistics", "sales"],
    values: FULL_VALUES,
    cumulative: 100,
    mode: "power",
    formula: "대체 선택지 ↓ · 전환 비용 ↑ · 통제권 ↑ → 협상력 ↑",
    conclusion: "협상력은 생산량보다 상대가 빠져나갈 수 있는지에서 드러납니다.",
  },
  {
    title: "관세 6달러를 누가 떠안을지 두 경로로 나눕니다",
    detail: "과세가격 60달러와 관세율 10%는 설명용 가정입니다. 세관에 납부할 책임과 계약·가격 조정을 거쳐 비용을 최종 부담하는 주체는 별도입니다.",
    active: ["parts", "assembly", "logistics", "sales"],
    values: FULL_VALUES,
    cumulative: 100,
    mode: "tariff",
    formula: "60 × 10% = 관세 6달러",
    conclusion: "고객 가격 고정이면 판매 몫 24달러, 판매 몫 고정이면 고객 가격 106달러입니다.",
  },
];

const STAGES: readonly {
  key: StageKey;
  short: string;
  owner: string;
  note: string;
}[] = [
  { key: "parts", short: "부품 40", owner: "부품업체", note: "중간투입" },
  { key: "assembly", short: "조립 +20", owner: "조립국", note: "국내 부가가치" },
  { key: "logistics", short: "물류 +10", owner: "운송·통관", note: "이동 서비스" },
  { key: "sales", short: "판매 +30", owner: "브랜드·판매", note: "고객 접점" },
] as const;

const CONTROL_POINTS = [
  ["대체 공급자", "같은 품질을 낼 회사를 얼마나 빨리 바꿀 수 있나"],
  ["인증·설비", "새 업체로 옮길 때 시간과 비용이 얼마나 드나"],
  ["규격 승인", "제품 사양과 불량 판정을 누가 정하나"],
  ["고객 접근", "주문·브랜드·판매망을 누가 보유하나"],
] as const;

function StagePath({ scene }: { scene: Scene }) {
  return (
    <div className="relative grid grid-cols-4 gap-1 sm:gap-3" aria-label="부품부터 고객까지 이어지는 공급망">
      <span className="absolute left-[8%] right-[8%] top-[18px] h-px bg-border sm:top-[22px]" aria-hidden="true" />
      {STAGES.map((stage, index) => {
        const active = scene.active.includes(stage.key);
        return (
          <div key={stage.key} className="relative min-w-0 text-center">
            <div className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-[9px] font-black transition-colors duration-300 motion-reduce:transition-none sm:h-11 sm:w-11 sm:text-xs ${active ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"}`}>
              {index + 1}
            </div>
            <p className="mt-1.5 break-keep text-[9px] font-black leading-3.5 sm:mt-2 sm:text-xs sm:leading-4">{stage.owner}</p>
            <p className="mt-0.5 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{stage.note}</p>
          </div>
        );
      })}
    </div>
  );
}

function ValueBar({ scene }: { scene: Scene }) {
  const total = Math.max(scene.cumulative, 1);
  return (
    <div>
      <div className="flex h-10 w-full overflow-hidden border border-foreground/25 bg-muted/25 sm:h-12" aria-label={`현재 누적 금액 ${scene.cumulative}달러`}>
        {STAGES.map((stage) => {
          const value = scene.values[stage.key];
          if (value === 0) return null;
          const width = `${(value / total) * 100}%`;
          return (
            <div
              key={stage.key}
              style={{ width }}
              className="flex min-w-0 items-center justify-center border-r border-background/60 px-0.5 text-center last:border-r-0"
            >
              <span className="break-keep text-[8px] font-black leading-3 sm:text-[11px] sm:leading-4">{stage.short}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3 text-[9px] font-bold text-muted-foreground sm:text-xs">
        <span>누적 가격</span>
        <span className="font-mono text-foreground">{scene.cumulative}달러</span>
      </div>
    </div>
  );
}

function StatisticsPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3" aria-label="총수출과 부가가치 비교">
      <div className="border border-border p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">국경 거래 장부</p>
        <p className="mt-2 font-mono text-base font-black sm:text-2xl">40 + 60 = 100</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[11px] sm:leading-4">부품 40이 완제품 60 안에 다시 포함됩니다.</p>
      </div>
      <div className="border border-foreground/30 p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">조립국 가치 장부</p>
        <p className="mt-2 font-mono text-base font-black text-primary sm:text-2xl">60 − 40 = 20</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[11px] sm:leading-4">국내 몫 비율은 20 ÷ 60 ≈ 33.3%입니다.</p>
      </div>
    </div>
  );
}

function PowerPanel() {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-3" aria-label="공급망 협상력을 만드는 네 통제 지점">
      {CONTROL_POINTS.map(([label, note]) => (
        <div key={label} className="min-w-0 border-y border-foreground/25 px-1.5 py-2.5 sm:px-2 sm:py-3">
          <p className="break-keep text-[9px] font-black sm:text-xs">{label}</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{note}</p>
        </div>
      ))}
    </div>
  );
}

function TariffPanel() {
  return (
    <div className="space-y-2 sm:space-y-3" aria-label="관세 6달러의 두 부담 경로">
      <div className="flex items-center justify-center gap-2 border-y border-dashed border-foreground/30 py-2 text-center">
        <span className="break-keep text-[9px] font-bold sm:text-xs">과세가격 60달러</span>
        <span aria-hidden="true">×</span>
        <span className="break-keep text-[9px] font-bold sm:text-xs">관세율 10%</span>
        <span aria-hidden="true">=</span>
        <span className="break-keep font-mono text-xs font-black text-primary sm:text-base">6달러</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="border border-border p-2.5 sm:p-4">
          <p className="break-keep text-[9px] font-black sm:text-xs">고객 가격 100달러 유지</p>
          <p className="mt-1.5 font-mono text-xs font-black sm:text-base">60 + 10 + 6 + 24 = 100</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">판매 단계 몫 30 → 24달러</p>
        </div>
        <div className="border border-foreground/30 p-2.5 sm:p-4">
          <p className="break-keep text-[9px] font-black sm:text-xs">판매 단계 30달러 유지</p>
          <p className="mt-1.5 font-mono text-xs font-black sm:text-base">60 + 10 + 6 + 30 = 106</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">고객 가격 100 → 106달러</p>
        </div>
      </div>
    </div>
  );
}

export default function SupplyChainBargainingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="글로벌 가치사슬 · 설명용 제품"
      title="고객이 낸 100달러를 생산·이동·판매·정책으로 나누어 추적합니다"
      description="같은 제품의 국경 거래액, 새로 더한 가치, 계약상 통제권, 관세 부담을 한 흐름에서 서로 다른 장부로 봅니다."
      note="40·20·10·30달러와 10% 관세율은 설명용 가정입니다. 실제 과세가격·세율·운임 포함 여부·비용 전가는 관할 법과 계약, 시장 상황을 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-supply-chain-bargaining-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <StagePath scene={scene} />
          {scene.mode === "flow" && <ValueBar scene={scene} />}
          {scene.mode === "statistics" && <StatisticsPanel />}
          {scene.mode === "power" && <PowerPanel />}
          {scene.mode === "tariff" && <TariffPanel />}

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="공급망 가격과 협상력 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
