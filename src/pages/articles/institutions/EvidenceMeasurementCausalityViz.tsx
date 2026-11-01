import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["관찰", "경로", "계산", "측정", "교란", "배정", "범위"] as const;

const NOTES = [
  "설명용 20가구를 A와 B에 10가구씩 둡니다. 처음에는 두 집단 모두 하루 평균 10kWh이고, 이후 A는 8kWh, B는 9kWh입니다.",
  "현실에서 대상을 고르고 같은 조건으로 잰 뒤 비교를 계산하고 주장 범위를 정합니다. 뒤 단계의 계산이 앞 단계의 대상·측정 문제를 없애지는 않습니다.",
  "A의 변화 −2에서 B의 변화 −1을 빼면 −1kWh/가구·일입니다. 이중차분의 산술 결과이며, 원인효과로 읽으려면 평행 추세를 비롯한 조건이 필요합니다.",
  "같은 조건에서 8.0·8.1·7.9가 반복되면 평균은 8.0입니다. 계기가 항상 0.5 낮게 기록한다면 반복값이 고르더라도 측정 편향은 남습니다.",
  "A에만 계기 교체·재실시간 변화·절약 성향이 함께 나타나면 관측된 추가 감소에 다른 원인이 섞일 수 있습니다. 문제마다 필요한 확인 절차가 다릅니다.",
  "무작위 배정은 이미 모인 20가구를 A와 B에 나누는 절차입니다. 전국에서 누가 20가구로 뽑히는지를 정하는 표본 추출과 구분합니다.",
  "현재 자료로 계산한 값은 두 평균 변화의 차이 −1입니다. 개별 관측값과 변동성이 없으므로 통계적 불확실성, 전국 대표성, 장기 효과는 아직 판단하지 않습니다.",
] as const;

type Panel = "observation" | "path" | "difference" | "measurement" | "threats" | "assignment" | "scope";

const SCENES = [
  { title: "장치를 단 A는 10에서 8로, 비교한 B는 10에서 9로 줄었습니다", detail: "두 집단에 각각 10가구가 있고 같은 기간의 하루 평균을 비교한다는 설명용 사례입니다.", panel: "observation", formula: "A: 10 → 8 · B: 10 → 9kWh/가구·일", conclusion: "A의 2 감소를 모두 장치 효과라고 부르기 전에 B에서도 생긴 1 감소를 설명해야 합니다." },
  { title: "대상을 고른 뒤 재고 비교하고 마지막에 주장 범위를 정합니다", detail: "대상·측정·비교·해석은 서로 다른 단계이며 각 단계에서 다른 오류가 생길 수 있습니다.", panel: "path", formula: "대상 선택 → 측정 → 비교 계산 → 주장", conclusion: "계산식이 맞아도 대상 선택과 측정 조건이 잘못되면 결론은 흔들립니다." },
  { title: "A의 변화에서 B의 변화를 한 번 더 뺍니다", detail: "두 집단의 전후 변화를 먼저 구하고 그 차이를 다시 빼는 이중차분의 설명용 산술입니다.", panel: "difference", formula: "(8 − 10) − (9 − 10) = −2 − (−1) = −1", conclusion: "−1은 계산된 추가 감소이며 원인효과라는 해석에는 평행 추세 등 별도 조건이 필요합니다." },
  { title: "반복값이 가까워도 계기가 한쪽으로 치우칠 수 있습니다", detail: "같은 조건에서 8.0·8.1·7.9를 얻었지만 A의 계기가 교체 뒤 0.5 낮게 기록한다는 경우를 나눠 봅니다.", panel: "measurement", formula: "반복 평균 8.0 · 가능한 계기 편향 −0.5", conclusion: "반복성은 값의 모임을 보여주지만 기준값과의 차이나 전체 불확실성을 혼자 증명하지 않습니다." },
  { title: "A에만 생긴 변화는 장치 효과와 함께 숫자에 들어옵니다", detail: "계기 교체, 집을 비운 시간, 원래의 절약 성향은 서로 다른 경로로 비교를 흔듭니다.", panel: "threats", formula: "관측 차이 = 장치 영향 + 동시 변화 + 측정 변화 + 표본 차이", conclusion: "어떤 차이가 있었는지 기록하고 측정 보정·더 나은 비교·새 실험을 문제에 맞게 선택해야 합니다." },
  { title: "20가구를 나누는 절차와 20가구를 뽑는 절차를 구분합니다", detail: "무작위 배정은 참여자 안에서 개입을 정하고, 표본 추출은 더 큰 모집단에서 참여자를 정합니다.", panel: "assignment", formula: "모집단 → 표본 추출 → 20가구 → 무작위 배정 → A·B", conclusion: "배정이 공정해도 처음 모인 20가구가 전국의 모든 가구를 대표한다고 보장되지는 않습니다." },
  { title: "계산한 사실과 조건부 해석, 아직 모르는 범위를 나눠 보고합니다", detail: "효과의 방향·불확실성·적용 대상을 한 문장에 섞지 않고 근거 수준에 맞춰 적습니다.", panel: "scope", formula: "계산됨 −1 · 원인 해석은 조건부 · 장기·전국 효과는 미확인", conclusion: "좋은 주장은 숫자를 세게 말하는 것이 아니라 측정·비교·범위의 조건을 드러냅니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function ObservationPanel() {
  const groups = [["A · 장치", "10", "8", "−2"], ["B · 비교", "10", "9", "−1"]] as const;
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="A와 B의 전후 전력 사용량">
      {groups.map(([label, before, after, change], index) => (
        <div key={label} className={`min-w-0 border p-3 sm:p-4 ${index === 0 ? "border-foreground/50" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{label}</p>
          <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 text-center"><Value label="전" value={before} /><span aria-hidden="true">→</span><Value label="후" value={after} /></div>
          <p className={`mt-2 text-center font-mono text-xs font-black sm:text-base ${index === 0 ? "text-primary" : ""}`}>변화 {change}kWh</p>
        </div>
      ))}
    </div>
  );
}

function Value({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[8px] font-bold text-muted-foreground">{label}</p><p className="font-mono text-base font-black sm:text-xl">{value}</p></div>;
}

function PathPanel() {
  const steps = [["대상", "누구를 볼까"], ["측정", "무엇을 어떻게 잴까"], ["비교", "어떤 차이를 뺄까"], ["주장", "어디까지 말할까"]] as const;
  return (
    <div className="relative grid grid-cols-4 gap-1.5" aria-label="대상 선택에서 주장까지의 증거 경로">
      <span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, detail], index) => <Step key={title} index={index + 1} title={title} detail={detail} />)}
    </div>
  );
}

function Step({ index, title, detail }: { index: number; title: string; detail: string }) {
  return <div className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>;
}

function DifferencePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3" aria-label="두 집단의 전후 변화 차이 계산">
      <Amount label="A 변화" value="−2" /><span className="font-black" aria-hidden="true">−</span><Amount label="B 변화" value="−1" /><span className="font-black" aria-hidden="true">=</span><Amount label="추가 감소" value="−1" primary />
    </div>
  );
}

function Amount({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-2.5 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p><p className={`mt-1 font-mono text-sm font-black sm:text-lg ${primary ? "text-primary" : ""}`}>{value}kWh</p></div>;
}

function MeasurementPanel() {
  const readings = ["8.0", "8.1", "7.9"];
  return (
    <div className="grid grid-cols-[1.2fr_0.8fr] gap-2 sm:gap-4" aria-label="반복 측정값과 계기 편향의 차이">
      <div className="border border-border p-3"><p className="text-[9px] font-black">같은 조건의 반복값</p><div className="mt-2 grid grid-cols-3 gap-1.5">{readings.map((value) => <span key={value} className="border-y border-border py-2 text-center font-mono text-xs font-black sm:text-base">{value}</span>)}</div><p className="mt-2 text-center text-[9px] font-bold text-muted-foreground">평균 8.0kWh</p></div>
      <div className="border border-foreground/50 p-3 text-center"><p className="text-[9px] font-black">계기 교체 뒤</p><p className="mt-3 font-mono text-lg font-black text-primary">−0.5kWh</p><p className="mt-2 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px]">매번 같은 방향의 편향은 반복만으로 찾지 못합니다.</p></div>
    </div>
  );
}

function ThreatsPanel() {
  const threats = [["측정", "A만 계기를 교체"], ["동시 변화", "A만 재실시간 감소"], ["대상 선택", "절약 성향이 A에 집중"]] as const;
  return <TriplePanel items={threats} label="관측 차이에 섞일 수 있는 세 문제" />;
}

function AssignmentPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1.15fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="표본 추출과 무작위 배정의 차이">
      <SmallBox title="더 큰 모집단" detail="전국 가구 등" /><span aria-hidden="true">→</span><SmallBox title="표본 추출" detail="참여할 20가구" primary /><span aria-hidden="true">→</span><SmallBox title="무작위 배정" detail="A 10 · B 10" />
    </div>
  );
}

function SmallBox({ title, detail, primary = false }: { title: string; detail: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-2.5 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className={`break-keep text-[9px] font-black sm:text-xs ${primary ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px]">{detail}</p></div>;
}

function ScopePanel() {
  const items = [["계산됨", "평균 변화의 차이 −1"], ["조건 필요", "장치의 원인효과"], ["아직 미확인", "불확실성·전국·장기"]] as const;
  return <TriplePanel items={items} label="현재 근거로 말할 수 있는 범위" />;
}

function TriplePanel({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label={label}>{items.map(([title, detail], index) => <div key={title} className={`min-w-0 border-y py-3 text-center sm:py-4 ${index === 0 ? "border-foreground/50" : "border-border"}`}><p className={`text-[9px] font-black sm:text-sm ${index === 0 ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] font-bold leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}</div>;
}

export default function EvidenceMeasurementCausalityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="증거 읽기 · 설명용 20가구" title="10이 8이 된 관찰에서 원인과 적용 범위를 분리하는 과정" description="A와 B의 전후 차이, 측정 조건, 교란, 배정과 표본, 주장 범위를 같은 사례로 연결합니다." note="가구 수·전력 사용량·계기 편향은 모두 설명용 가정입니다. 실제 장치의 절감 효과나 통계적 유의성을 뜻하지 않습니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-evidence-causality-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "observation" && <ObservationPanel />}{scene.panel === "path" && <PathPanel />}{scene.panel === "difference" && <DifferencePanel />}{scene.panel === "measurement" && <MeasurementPanel />}{scene.panel === "threats" && <ThreatsPanel />}{scene.panel === "assignment" && <AssignmentPanel />}{scene.panel === "scope" && <ScopePanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="측정과 인과 판단 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
