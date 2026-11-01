import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "시간", "범위", "접근", "장부", "분배", "경계"] as const;

const NOTES = [
  "정부나 사업자가 시설을 만들고 운영자가 차량과 인력을 투입하면 이용자는 일자리·학교·병원에 닿습니다. 역 주변 토지와 건물은 움직이지 않아도 위치의 이익을 얻을 수 있습니다.",
  "편도 통근이 60분에서 35분으로 줄면 한 번에 25분을 아낍니다. 하루 왕복과 한 달 20일을 같은 조건으로 계산하면 25×2×20=1,000분, 즉 16시간 40분입니다.",
  "35분이 문 앞에서 문 앞까지인지 차량에 탄 시간만인지 먼저 확인합니다. 차량 35분에 걷기 10분과 대기 10분이 더 들면 실제 편도는 55분입니다.",
  "빠른 차량만으로 접근성이 생기지는 않습니다. 운행 간격·첫차와 막차·보행과 환승·혼잡이 맞아야 정해진 시간과 비용 안에서 일자리와 서비스에 닿을 수 있습니다.",
  "설명용 한 달에 시간은 1,000분 줄지만 추가 교통비 2만 원과 월세 10만 원으로 현금 지출은 12만 원 늘어납니다. 절약한 시간에 시급을 곱한 값이 통장에 자동으로 들어오는 것은 아닙니다.",
  "이용자는 시간을 얻고, 운영자는 요금을 받고, 집주인은 임대료 상승을 얻을 수 있으며, 정부는 건설비와 운영 지원을 냅니다. 같은 접근성 개선이 시간 가치와 임대료에 함께 반영됐다면 사회 편익으로 두 번 더하지 않습니다.",
  "개통 뒤 새 수요와 혼잡, 공사비 초과와 지연, 유지비, 소음, 이주를 함께 확인합니다. 임차인이 오른 월세를 감당하지 못해 떠나면 계획했던 접근성 이익을 누리지 못할 수 있습니다.",
] as const;

type Panel = "flow" | "time" | "scope" | "access" | "ledger" | "distribution" | "boundary";

const SCENES = [
  {
    title: "교통 시설은 이용자뿐 아니라 주변 토지의 위치 이익도 바꿉니다",
    detail: "건설·운영·이동 경로와 위치 이익이 이동하는 경로를 나누어 봅니다.",
    panel: "flow",
    formula: "정부·사업자 → 시설 → 운영자 → 이용자 → 일자리·서비스",
    conclusion: "시설 비용을 낸 사람과 시간·임대료 이익을 얻는 사람이 같다고 가정하지 않습니다.",
  },
  {
    title: "편도 25분 절약은 왕복 20일에 1,000분입니다",
    detail: "같은 출발지와 도착지, 같은 출근 일수라는 설명용 조건을 고정합니다.",
    panel: "time",
    formula: "(60−35)분 × 왕복 2회 × 20일 = 1,000분 = 16시간 40분",
    conclusion: "편도 값인지 왕복 값인지, 하루인지 한 달인지 단위를 바꾸어 계산합니다.",
  },
  {
    title: "차량 35분과 문 앞에서 문 앞까지 35분은 다른 측정입니다",
    detail: "걷기와 대기·환승 시간을 어디까지 포함했는지 먼저 확인합니다.",
    panel: "scope",
    formula: "걷기 10분 + 대기 10분 + 차량 35분 = 실제 편도 55분",
    conclusion: "노선 속도만 빨라져도 접근 시간이 그대로일 수 있으므로 측정 범위를 고정합니다.",
  },
  {
    title: "접근성은 정해진 시간과 비용 안에서 닿는 선택지의 범위입니다",
    detail: "선로의 존재가 아니라 실제로 이용 가능한 운행과 연결 조건을 봅니다.",
    panel: "access",
    formula: "차량 속도 + 배차 + 보행·환승 + 운행 시간 + 혼잡 → 닿는 기회",
    conclusion: "속도가 같아도 주변 일자리와 연결망이 다르면 접근성은 달라집니다.",
  },
  {
    title: "시간은 줄어도 한 달 현금 지출은 12만 원 늘 수 있습니다",
    detail: "추가 교통비 2만 원과 월세 상승 10만 원을 시간 절약과 별도 장부에 적습니다.",
    panel: "ledger",
    formula: "시간 −1,000분 · 현금 +(2만 원+10만 원)=+12만 원",
    conclusion: "절약한 시간의 가치와 실제 통장에서 나간 현금을 같은 숫자로 바로 합치지 않습니다.",
  },
  {
    title: "같은 접근성 이익이 시간과 임대료에 함께 담겼는지 확인합니다",
    detail: "누가 얻고 누가 내는지 표시한 뒤 사회 전체의 새 편익과 이전을 구분합니다.",
    panel: "distribution",
    formula: "이용자: 시간 · 운영자: 요금 · 집주인: 임대료 · 정부: 건설·지원",
    conclusion: "시간 가치와 토지가치 상승이 같은 원인을 반영하면 독립 편익처럼 두 번 더하지 않습니다.",
  },
  {
    title: "새 수요·지연·유지비·이주를 빼면 사업을 과대평가합니다",
    detail: "개통 뒤 수요와 비용, 지역 사이의 이동, 기존 주민의 잔류 여부를 다시 측정합니다.",
    panel: "boundary",
    formula: "접근성 개선 − 혼잡·지연·유지비·소음·이주 + 분배 효과",
    conclusion: "평균 이동시간 하나가 아니라 누가 실제로 남아 어떤 기회에 닿았는지 확인합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[8px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function Arrow() {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">→</span>;
}

function FlowPanel() {
  return (
    <div aria-label="교통 시설에서 이용자와 주변 토지로 이어지는 경로">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="건설" detail="정부·사업자" />
        <Arrow />
        <Stage title="운영" detail="차량·인력" />
        <Arrow />
        <Stage title="이용자" detail="요금·이동" strong />
        <Arrow />
        <Stage title="기회" detail="일자리·서비스" />
      </div>
      <p className="mt-3 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">역 주변 토지·건물 → 접근성 개선이 임대료·가격에 반영될 수 있음</p>
    </div>
  );
}

function TimePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="한 달 통근시간 절약 계산">
      <Stage title="편도 절약" detail="60−35=25분" />
      <span className="font-mono text-sm font-black">×</span>
      <Stage title="왕복·20일" detail="2×20" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="한 달" detail="1,000분" strong />
    </div>
  );
}

function ScopePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="문 앞에서 문 앞까지 통근시간 범위">
      <Stage title="걷기" detail="10분" />
      <span className="font-mono text-sm font-black">+</span>
      <Stage title="대기·환승" detail="10분" />
      <span className="font-mono text-sm font-black">+</span>
      <Stage title="차량" detail="35분 → 총 55분" strong />
    </div>
  );
}

function AccessPanel() {
  const items = [["속도", "차량 이동"], ["빈도", "배차·대기"], ["연결", "보행·환승"], ["시간", "첫차·막차"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="교통 접근성을 만드는 네 조건">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function LedgerPanel() {
  const rows = [["시간", "−1,000분", "생활에서 절약"], ["교통비", "+2만 원", "통장 지출"], ["월세", "+10만 원", "통장 지출"], ["현금 합계", "+12만 원", "시간과 별도"]] as const;
  return (
    <div className="space-y-1" aria-label="통근시간과 한 달 현금 지출 장부">
      {rows.map(([label, value, note], index) => (
        <div key={label} className={`grid grid-cols-[0.8fr_0.7fr_1fr] items-center gap-2 border-b py-1.5 sm:py-2 ${index === rows.length - 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{label}</p>
          <p className={`text-right font-mono text-xs font-black sm:text-sm ${index === rows.length - 1 ? "text-primary" : ""}`}>{value}</p>
          <p className="break-keep text-right text-[8px] font-bold text-muted-foreground sm:text-[10px]">{note}</p>
        </div>
      ))}
    </div>
  );
}

function DistributionPanel() {
  const items = [["이용자", "시간 절약"], ["운영자", "추가 요금"], ["집주인", "임대료 상승"], ["정부", "건설·지원"]] as const;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="교통 이익과 비용의 분배">
      {items.map(([title, detail]) => <Stage key={title} title={title} detail={detail} strong={title === "이용자"} />)}
    </div>
  );
}

function BoundaryPanel() {
  const items = [["수요", "새 혼잡·대기"], ["사업", "초과비·지연"], ["운영", "유지비·소음"], ["주민", "월세·이주"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="교통 사업 평가에서 다시 확인할 경계">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function TransportAccessLandValueViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="교통 접근성 · 설명용 한 달 장부"
      title="편도 25분 절약이 기회·현금·토지가치로 전달되는 과정"
      description="시설의 물리 경로에서 출발해 문 앞 통근시간, 접근 가능한 기회, 가구 지출과 위치 이익의 분배를 차례로 봅니다."
      note="시간·교통비·월세 수치는 설명용 가정입니다. 실제 사업 평가는 현지 수요·토지 규칙·공사비·운영비와 사람별 이동 자료를 사용합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-transport-access-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "flow" && <FlowPanel />}
          {scene.panel === "time" && <TimePanel />}
          {scene.panel === "scope" && <ScopePanel />}
          {scene.panel === "access" && <AccessPanel />}
          {scene.panel === "ledger" && <LedgerPanel />}
          {scene.panel === "distribution" && <DistributionPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="교통 접근성과 토지가치 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
