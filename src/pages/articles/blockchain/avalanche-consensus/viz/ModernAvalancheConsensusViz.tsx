import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = [
  "시작",
  "A 4표",
  "B 3표",
  "B 4표",
  "표본 실패",
  "B 연속 1",
  "B 연속 2",
  "B 결정",
] as const;

type Vote = "A" | "B" | "응답 없음" | "아직 안 뽑음";

type TraceState = {
  sample: readonly Vote[];
  sampleResult: string;
  snowflakePreference: "A" | "B";
  confidence: number;
  snowballPreference: "A" | "B";
  strengthA: number;
  strengthB: number;
  finalized: boolean;
  change: string;
  boundary: string;
};

const TRACE_STATES: readonly TraceState[] = [
  {
    sample: ["아직 안 뽑음", "아직 안 뽑음", "아직 안 뽑음", "아직 안 뽑음", "아직 안 뽑음"],
    sampleResult: "초기 preference A · poll 전",
    snowflakePreference: "A",
    confidence: 0,
    snowballPreference: "A",
    strengthA: 0,
    strengthB: 0,
    finalized: false,
    change: "노드는 A를 먼저 선호하지만 아직 표본 근거와 연속 confidence가 없습니다.",
    boundary: "초기값은 합의 결과가 아닙니다.",
  },
  {
    sample: ["A", "A", "A", "A", "응답 없음"],
    sampleResult: "A 4표 · preference와 confidence threshold 통과",
    snowflakePreference: "A",
    confidence: 1,
    snowballPreference: "A",
    strengthA: 1,
    strengthB: 0,
    finalized: false,
    change: "A가 alphaPreference=3과 alphaConfidence=4를 모두 넘어 confidence가 1이 됩니다.",
    boundary: "한 번 성공했으므로 beta=3 결정에는 아직 두 번이 더 필요합니다.",
  },
  {
    sample: ["B", "B", "B", "A", "응답 없음"],
    sampleResult: "B 3표 · preference threshold만 통과",
    snowflakePreference: "B",
    confidence: 0,
    snowballPreference: "A",
    strengthA: 1,
    strengthB: 1,
    finalized: false,
    change: "Snowflake의 내부 preference는 B로 바뀌지만 4표 미만이라 confidence는 0입니다.",
    boundary: "Snowball strength는 1:1 동률이라 lazy tie 규칙이 기존 A를 유지합니다.",
  },
  {
    sample: ["B", "B", "B", "B", "A"],
    sampleResult: "B 4표 · 두 threshold 모두 통과",
    snowflakePreference: "B",
    confidence: 1,
    snowballPreference: "B",
    strengthA: 1,
    strengthB: 2,
    finalized: false,
    change: "B confidence가 1이 되고 누적 strength도 2가 되어 Snowball preference가 B로 바뀝니다.",
    boundary: "Preference가 정해졌어도 local decision은 아닙니다.",
  },
  {
    sample: ["B", "B", "A", "응답 없음", "응답 없음"],
    sampleResult: "최다 B 2표 · preference threshold 미달",
    snowflakePreference: "B",
    confidence: 0,
    snowballPreference: "B",
    strengthA: 1,
    strengthB: 2,
    finalized: false,
    change: "어느 후보도 3표를 얻지 못해 consecutive confidence만 0으로 초기화됩니다.",
    boundary: "누적 strength와 preference는 실패 poll 하나로 지워지지 않습니다.",
  },
  {
    sample: ["B", "B", "B", "B", "A"],
    sampleResult: "B 4표 · 새 연속 구간 시작",
    snowflakePreference: "B",
    confidence: 1,
    snowballPreference: "B",
    strengthA: 1,
    strengthB: 3,
    finalized: false,
    change: "실패 뒤 첫 B 성공이므로 confidence는 다시 1부터 시작합니다.",
    boundary: "앞선 B 성공은 누적 strength에는 남지만 현재 streak에는 포함되지 않습니다.",
  },
  {
    sample: ["B", "B", "B", "B", "응답 없음"],
    sampleResult: "B 4표 · 연속 성공 2",
    snowflakePreference: "B",
    confidence: 2,
    snowballPreference: "B",
    strengthA: 1,
    strengthB: 4,
    finalized: false,
    change: "같은 B가 confidence threshold를 다시 넘어 연속 counter가 2가 됩니다.",
    boundary: "Beta=3이므로 아직 상태를 잠그지 않습니다.",
  },
  {
    sample: ["B", "B", "B", "B", "B"],
    sampleResult: "B 5표 · 연속 성공 3",
    snowflakePreference: "B",
    confidence: 3,
    snowballPreference: "B",
    strengthA: 1,
    strengthB: 5,
    finalized: true,
    change: "Confidence가 beta=3에 닿아 이 로컬 Snowflake 상태는 B로 결정됩니다.",
    boundary: "한 노드의 local decision과 network 전체의 probabilistic safety는 같은 증거가 아닙니다.",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map(
  (state) => `${state.sampleResult}. ${state.change} ${state.boundary}`,
);

function VoteCell({ vote }: { vote: Vote }) {
  const style = vote === "A"
    ? "border-foreground bg-foreground text-background"
    : vote === "B"
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-background text-muted-foreground";
  return (
    <div className={`flex min-h-14 min-w-0 items-center justify-center border px-1.5 text-center text-[10px] font-black leading-4 transition-colors duration-200 ${style}`}>
      {vote}
    </div>
  );
}

function CounterBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="mt-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }} aria-hidden="true">
        {Array.from({ length: max }, (_, index) => (
          <span key={index} className={`h-2 ${index < value ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
    </div>
  );
}

export function AvalanchePollTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 7000, { loop: false });
  const state = TRACE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="설명용 parameter · k=5 · alphaPreference=3 · alphaConfidence=4 · beta=3"
      title="같은 poll 기록이 preference와 confidence를 서로 다르게 바꿉니다"
      description="AvalancheGo v1.14.2의 Snowflake와 Snowball 상태 전이를 여덟 장면으로 나눠 따라갑니다."
      note="실제 v1.14.2 기본값은 20·15·15·20입니다. 서로 다른 두 alpha의 역할을 보이려고 유효한 작은 값을 사용합니다."
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="A와 B의 표본 응답이 Snowflake confidence와 Snowball strength를 바꾸는 여덟 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.sampleResult}</h4>

          <div className="mt-3 grid gap-3 xl:grid-cols-[.82fr_1.18fr]">
            <section className="border border-border bg-background p-3" aria-label="현재 poll 표본">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-black">이번에 물어본 5명</p>
                <p className="text-[9px] font-semibold text-muted-foreground">복원 없는 설명용 표본</p>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {state.sample.map((vote, index) => <VoteCell key={`${scenes.active}-${index}`} vote={vote} />)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px bg-border text-center text-[10px] font-bold">
                <div className="bg-card p-2">preference ≥ 3</div>
                <div className="bg-card p-2">confidence ≥ 4</div>
              </div>
              <p className="mt-3 text-xs font-semibold leading-5">{state.change}</p>
            </section>

            <section className="grid gap-px bg-border sm:grid-cols-2" aria-label="Snowflake와 Snowball 상태">
              <div className="bg-background p-3">
                <p className="text-[10px] font-black">Snowflake · 연속 성공</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="border border-border p-2"><p className="break-keep text-[9px] text-muted-foreground">내부 선호</p><p className="mt-1 text-lg font-black">{state.snowflakePreference}</p></div>
                  <div className="border border-border p-2"><p className="break-keep text-[9px] text-muted-foreground">연속 횟수</p><p className="mt-1 text-lg font-black">{state.confidence}</p></div>
                </div>
                <div className="mt-3"><CounterBar value={state.confidence} max={3} label="beta까지" /></div>
              </div>
              <div className="bg-background p-3">
                <p className="text-[10px] font-black">Snowball · 누적 성공</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="border border-border p-2"><p className="break-keep text-[9px] text-muted-foreground">A 누적</p><p className="mt-1 text-lg font-black">{state.strengthA}</p></div>
                  <div className="border border-border p-2"><p className="break-keep text-[9px] text-muted-foreground">B 누적</p><p className="mt-1 text-lg font-black">{state.strengthB}</p></div>
                  <div className="border border-border p-2"><p className="break-keep text-[9px] text-muted-foreground">외부 선호</p><p className="mt-1 text-lg font-black">{state.snowballPreference}</p></div>
                </div>
                <p className="mt-3 text-[10px] font-semibold leading-5 text-muted-foreground">동률이면 기존 preference를 유지하고, 한쪽 strength가 더 클 때만 바꿉니다.</p>
              </div>
            </section>
          </div>

          <div className={`mt-3 border p-3 ${state.finalized ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
            <p className="text-[10px] font-black">{state.finalized ? "로컬 결정" : "아직 결정 전"}</p>
            <p className="mt-1 text-xs font-semibold leading-5">{state.boundary}</p>
          </div>
          <div className="mt-4 grid grid-cols-8 gap-1" aria-hidden="true">
            {TRACE_LABELS.map((label, index) => <span key={label} className={`h-1.5 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="표본 투표 상태 전이 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

const IMPLEMENTATION_ROWS = [
  ["논문 Snow family", "Slush → Snowflake → Snowball → Avalanche", "프로토콜 구성을 설명", "현재 Primary Network 배치도"],
  ["Parameters", "K·AlphaPreference·AlphaConfidence·Beta", "유효한 threshold 관계 검사", "sampler·network 안전성"],
  ["Snowflake state", "preference·consecutive confidence", "실패·preference 변경 때 counter 초기화", "network 전체 결정"],
  ["Snowball state", "choice별 preferenceStrength", "누적 poll 우세로 preference에 관성 추가", "v1.14.2 Snowman 기본 factory"],
  ["AvalancheGo manager", "Topological{Factory: SnowflakeFactory}", "Snowman block path 생성", "Snowball type을 쓴다는 주장"],
] as const;

export function AvalancheImplementationBoundaryViz() {
  return (
    <VizFrame
      eyebrow="논문 이름과 실행 코드의 경계"
      title="Snowball을 설명한다고 현재 AvalancheGo가 그 factory를 쓴다는 뜻은 아닙니다"
      description="프로토콜 계보, 로컬 상태 구현, 실제 Snowman wiring을 같은 표에서 분리합니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable columns={["대상", "확인한 경계", "이 근거가 말하는 것", "말하지 않는 것"]} rows={IMPLEMENTATION_ROWS} desktopMinWidthClassName="min-w-[980px]" />
    </VizFrame>
  );
}

const DECISION_ROWS = [
  ["한 poll", "표본 안의 응답 수", "preference 또는 confidence counter 갱신"],
  ["한 노드의 local decision", "연속 confidence가 beta 도달", "그 로컬 상태를 더 이상 바꾸지 않음"],
  ["Network safety", "모든 정직한 노드의 상충 결정 확률", "Byzantine stake·sampler·timing 모델 필요"],
  ["Network liveness", "정직한 노드가 결국 결정하는가", "응답 가능성·partition 회복 조건 필요"],
  ["Chain acceptance", "Snowman ancestry·block validity·VM 경로", "Snowball counter 하나보다 넓은 상태 전이"],
] as const;

export function AvalancheDecisionBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Poll · local state · network property"
      title="표본 4표, confidence 3, network finality는 서로 다른 관찰입니다"
      description="어떤 값이 바뀌었는지와 그 값만으로 아직 말할 수 없는 것을 나눕니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable columns={["관찰 단위", "판단 근거", "확인되는 범위"]} rows={DECISION_ROWS} desktopMinWidthClassName="min-w-[820px]" />
    </VizFrame>
  );
}
