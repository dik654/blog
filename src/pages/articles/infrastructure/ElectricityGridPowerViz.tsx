import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "병목", "단위", "비용", "선택", "운영", "경계"] as const;

const NOTES = [
  "발전소가 낼 수 있는 전기는 계통운영자의 안전 판단과 송전망을 거쳐 공장에 도착합니다. 공장이 낸 돈은 발전·망 운영·소매 계약의 규칙에 따라 반대 방향으로 나뉩니다.",
  "설명용 한 시간에 먼 발전소는 100MWh를 만들 수 있지만 송전 경로는 80MWh만 통과시킵니다. 공장 수요 100MWh를 맞추려면 가까운 공급이나 수요 조정으로 20MWh를 더 마련해야 합니다.",
  "100MW는 그 순간의 출력이고, 이를 한 시간 유지하면 100MWh의 에너지가 됩니다. 저장장치도 담을 수 있는 MWh와 한 번에 내보낼 수 있는 MW를 따로 확인합니다.",
  "먼 전력 80MWh에 MWh당 5만 원을 내면 400만 원, 가까운 전력 20MWh에 10만 원을 내면 200만 원입니다. 조달비 600만 원은 혼잡이 없는 500만 원보다 100만 원 많지만 최종 전기요금 전체는 아닙니다.",
  "망을 넓히면 장기 용량이 늘고, 작업 20MWh를 밤으로 옮기면 낮의 병목을 줄이며, 저장장치는 다른 시간의 전기를 옮깁니다. 각각 건설비·일정·충전 손실이라는 다른 비용이 생깁니다.",
  "발전·계통운영·망 소유·소매 공급을 한 조직이 맡을 수도 있고 여러 조직이 나눠 맡을 수도 있습니다. 같은 100MWh라도 접속권·요금·혼잡비의 결정 주체가 달라집니다.",
  "20MWh를 저장한 장치라도 출력이 5MW라면 한 시간에 최대 5MWh만 보탭니다. 부족분 20MWh 가운데 15MWh가 남으므로 평균 요금과 저장 용량만으로 필요한 순간의 공급을 보장할 수 없습니다.",
] as const;

type Panel = "path" | "constraint" | "units" | "cost" | "choices" | "roles" | "boundary";

const SCENES = [
  {
    title: "발전·계통운영·송전·사용을 지나야 전기가 공장에 도착합니다",
    detail: "물리적 전기 흐름과 사용자가 낸 돈의 배분 경로를 같은 화살표로 섞지 않습니다.",
    panel: "path",
    formula: "발전 → 계통 판단 → 송전망 → 공장 · 지급은 계약을 따라 반대 방향",
    conclusion: "발전량이 충분해도 망의 안전 한도와 접속권이 없으면 그 전기를 원하는 곳에서 쓸 수 없습니다.",
  },
  {
    title: "100MWh를 만들 수 있어도 이 경로로는 80MWh만 보냅니다",
    detail: "손실과 다른 이용자는 생략하고, 공장 수요 100MWh를 한 시간 안에 맞춘다는 설명용 사례입니다.",
    panel: "constraint",
    formula: "min(발전 가능 100, 송전 한도 80) = 먼 공급 80 · 부족 20",
    conclusion: "20MWh는 먼저 만들고 버린 전기가 아니라 가까운 공급·수요 조정·저장으로 채워야 할 차이입니다.",
  },
  {
    title: "MW는 속도이고 MWh는 그 속도를 시간 동안 누적한 양입니다",
    detail: "발전기·송전선·저장장치의 출력과 한 시간 동안 보낼 에너지를 구분합니다.",
    panel: "units",
    formula: "100MW × 1시간 = 100MWh · 5MW × 1시간 = 5MWh",
    conclusion: "에너지 용량이 커도 출력이 작으면 짧은 시간의 큰 부족을 모두 메우지 못합니다.",
  },
  {
    title: "먼 전력 80과 가까운 전력 20의 조달비는 600만 원입니다",
    detail: "먼 공급 단가는 MWh당 5만 원, 가까운 대체 공급은 10만 원이라는 설명용 한 시간 장부입니다.",
    panel: "cost",
    formula: "80×5만 + 20×10만 = 600만 원 · 혼잡 없음 100×5만 = 500만 원",
    conclusion: "차이 100만 원은 이 한 시간의 추가 조달비이며 망 유지·고장 대비·소매 비용은 포함하지 않습니다.",
  },
  {
    title: "망 보강·사용 시간 이동·저장은 같은 병목을 다른 방식으로 풉니다",
    detail: "어느 선택이 싼지는 병목이 반복되는 시간, 공사비, 생산 일정과 저장 손실을 함께 봐야 합니다.",
    panel: "choices",
    formula: "용량 확대 | 낮 20MWh를 밤으로 이동 | 다른 시간의 전기를 저장",
    conclusion: "한 시간의 100만 원 차이만으로 송전선이나 저장장치 투자를 결정할 수 없습니다.",
  },
  {
    title: "같은 전기 흐름도 운영과 가격을 정하는 조직은 지역마다 다릅니다",
    detail: "통합 전력회사와 독립 계통운영자 지역은 발전·망·소매의 책임과 계약 경계가 다릅니다.",
    panel: "roles",
    formula: "물리 흐름은 발전→망→사용 · 권한은 접속·운영·요금 계약으로 분리",
    conclusion: "국가 이름이나 평균 요금 대신 누가 접속을 승인하고 혼잡비와 최종 요금을 정하는지 확인합니다.",
  },
  {
    title: "저장량 20MWh만 보고 한 시간의 부족 20MWh를 채운다고 말할 수 없습니다",
    detail: "저장장치 출력 5MW, 방전 시간 한 시간, 손실은 생략한다는 설명용 경계입니다.",
    panel: "boundary",
    formula: "5MW × 1시간 = 5MWh 공급 · 20−5 = 15MWh 부족",
    conclusion: "실제 공장 입지에서는 접속일·보장 용량·정전 대체 수단과 생산 중단 손실까지 확인합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-0.5" aria-hidden="true">
      {label && <span className="break-keep text-center text-[7px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>}
      <span className="font-mono text-sm font-black text-primary">→</span>
    </div>
  );
}

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[9px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[8px] font-bold leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function PathPanel() {
  return (
    <div aria-label="발전소에서 공장까지 전기가 흐르는 경로">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="발전" detail="낼 수 있는 출력" />
        <Arrow label="전기" />
        <Stage title="계통운영" detail="수급·안전 판단" />
        <Arrow />
        <Stage title="송전망" detail="통과 한도" />
        <Arrow />
        <Stage title="공장" detail="기계가 사용" strong />
      </div>
      <div className="mt-3 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">
        공장 지급 → 소매·망·운영·발전 계약에 따라 배분
      </div>
    </div>
  );
}

function ConstraintPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="발전량과 송전 한도와 부족분">
      <Stage title="먼 발전" detail="가능 100MWh" />
      <Arrow label="한도 80" />
      <Stage title="공장 도착" detail="80MWh" strong />
      <span className="text-center font-mono text-sm font-black">+</span>
      <Stage title="가까운 공급" detail="부족 20MWh" />
    </div>
  );
}

function UnitsPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="전력 MW와 에너지 MWh 비교">
      <div className="border-y border-border py-3 text-center sm:py-4">
        <p className="text-[9px] font-black sm:text-xs">순간 출력</p>
        <p className="mt-1 font-mono text-xl font-black text-primary">100MW</p>
        <p className="mt-1 text-[8px] text-muted-foreground sm:text-[10px]">흐르는 속도</p>
      </div>
      <div className="border border-foreground/60 p-3 text-center sm:p-4">
        <p className="text-[9px] font-black sm:text-xs">한 시간 에너지</p>
        <p className="mt-1 font-mono text-xl font-black">100MWh</p>
        <p className="mt-1 text-[8px] text-muted-foreground sm:text-[10px]">100MW × 1시간</p>
      </div>
    </div>
  );
}

function CostPanel() {
  const rows = [
    ["먼 공급", "80MWh × 5만 원", "400만"],
    ["가까운 공급", "20MWh × 10만 원", "200만"],
    ["현재 조달", "400만 + 200만", "600만"],
    ["혼잡 없음", "100MWh × 5만 원", "500만"],
  ] as const;
  return (
    <div className="space-y-1" aria-label="송전 혼잡이 있는 한 시간의 전력 조달비">
      {rows.map(([label, calculation, value], index) => (
        <div key={label} className={`grid grid-cols-[0.8fr_1.4fr_0.7fr] items-center gap-2 border-b py-1.5 sm:py-2 ${index === 2 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{label}</p>
          <p className="font-mono text-[8px] text-muted-foreground sm:text-[10px]">{calculation}</p>
          <p className={`text-right font-mono text-xs font-black sm:text-sm ${index === 2 ? "text-primary" : ""}`}>{value} 원</p>
        </div>
      ))}
    </div>
  );
}

function ChoicesPanel() {
  const items = [
    ["망 보강", "장기 통과량 확대", "공사비·인허가"],
    ["시간 이동", "20MWh를 밤으로", "교대·납기 비용"],
    ["저장", "다른 시간 전기 사용", "출력·손실·설치비"],
  ] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="전력망 병목을 줄이는 세 선택">
      {items.map(([title, effect, cost], index) => (
        <div key={title} className={`min-w-0 border-y px-1 py-3 text-center sm:py-4 ${index === 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] font-bold leading-3.5 sm:text-[10px]">{effect}</p>
          <p className="mt-1 break-keep text-[7px] leading-3 text-muted-foreground sm:text-[9px]">{cost}</p>
        </div>
      ))}
    </div>
  );
}

function RolesPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="전력 산업의 두 운영 구조">
      <div className="border border-border p-3 sm:p-4">
        <p className="text-[9px] font-black sm:text-xs">통합 전력회사</p>
        <p className="mt-2 break-keep text-[8px] font-bold leading-4 text-muted-foreground sm:text-[10px]">발전·망·소매를 한 조직이 함께 맡을 수 있음</p>
      </div>
      <div className="border border-foreground/60 p-3 sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">분리된 시장·운영</p>
        <p className="mt-2 break-keep text-[8px] font-bold leading-4 text-muted-foreground sm:text-[10px]">발전사·계통운영자·망·소매 계약이 나뉨</p>
      </div>
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="저장장치 출력 한계 계산">
      <Stage title="부족" detail="20MWh" />
      <span className="font-mono text-sm font-black">−</span>
      <Stage title="한 시간 방전" detail="5MW×1h=5MWh" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="남은 부족" detail="15MWh" strong />
    </div>
  );
}

export default function ElectricityGridPowerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="전력망 · 설명용 공장 한 시간"
      title="발전 100MWh가 공장 공급 100MWh가 되지 못하는 과정"
      description="전기의 물리 경로와 비용·접속권·운영 책임을 나누고, 80MWh 송전 한도에서 생기는 선택을 따라갑니다."
      note="발전량·송전 한도·단가·저장장치 수치는 설명용 가정입니다. 실제 접속 가능량과 공급 개시일은 해당 망사업자와 계약 문서에서 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-electricity-grid-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "path" && <PathPanel />}
          {scene.panel === "constraint" && <ConstraintPanel />}
          {scene.panel === "units" && <UnitsPanel />}
          {scene.panel === "cost" && <CostPanel />}
          {scene.panel === "choices" && <ChoicesPanel />}
          {scene.panel === "roles" && <RolesPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="전력망 공급 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
