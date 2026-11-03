import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["배치 적재", "PoA 인증", "blip 동안 축적", "cut 결정", "빠진 suffix 동기화", "한 줄로 실행"] as const;

const TRACE_STATES = [
  {
    title: "A 차선의 새 칸 A2에 Alice→Bob 거래 묶음이 실립니다.",
    now: "A 복제본은 거래 묶음, 차선 위치 2, 이전 칸 A1의 참조를 한 제안에 담아 모든 복제본에 보냅니다.",
    evidence: "A2가 A1 뒤에 놓여야 한다는 부모 관계와 실제 payload가 전달되기 시작했습니다.",
    pending: "제안만 보냈을 뿐입니다. 다른 노드가 데이터를 받았다는 증거도, 전체 순서도 아직 없습니다.",
  },
  {
    title: "같은 A2를 받은 f+1개 노드의 표가 모여 PoA가 됩니다.",
    now: "n=4, f=1 예에서는 같은 digest에 대한 서로 다른 두 표가 모이면 A2가 인증된 car가 됩니다.",
    evidence: "투표자 중 적어도 한 정상 노드가 A2와 그 앞의 차선 이력을 가지고 있습니다.",
    pending: "PoA는 데이터 회수 가능성의 증거입니다. A2의 전역 순서나 Byzantine 차선의 유일한 fork를 정하지는 않습니다.",
  },
  {
    title: "합의가 잠시 멈춰도 네 차선은 가능한 속도로 계속 전진합니다.",
    now: "A·B·C는 2번 칸까지, D는 3번 칸까지 인증됩니다. 합의 leader의 정지와 데이터 전파를 묶지 않았기 때문입니다.",
    evidence: "blip 동안 처리해야 할 데이터가 각 차선의 인증된 이력으로 이미 쌓였습니다.",
    pending: "차선마다 따로 놓인 기록일 뿐입니다. 어느 끝점까지 한 번에 커밋할지는 정하지 않았습니다.",
  },
  {
    title: "Leader는 모든 데이터를 다시 싣지 않고 네 차선의 끝점 [2,2,2,3]만 제안합니다.",
    now: "합의는 A2·B2·C2·D3의 digest와 인증 근거를 담은 짧은 cut 하나를 결정합니다.",
    evidence: "이전 cut 뒤의 backlog 전체를 어떤 끝점까지 포함할지가 한 번에 고정됩니다.",
    pending: "느린 노드는 cut이 가리키는 payload 일부를 아직 갖고 있지 않을 수 있습니다.",
  },
  {
    title: "각 노드는 자신에게 빠진 차선의 뒷부분만 병렬로 가져옵니다.",
    now: "이전 cut [1,1,1,1]과 비교해 A2·B2·C2·D2·D3을 찾고, digest와 부모 연결을 확인합니다.",
    evidence: "결정된 cut을 실제 거래 묶음과 연결할 수 있는 완전한 suffix가 로컬에 생깁니다.",
    pending: "payload를 모았어도 모든 노드가 같은 거래 순서로 실행한다는 규칙이 한 단계 남았습니다.",
  },
  {
    title: "모든 노드가 같은 zipper 규칙으로 새 suffix를 한 줄의 실행 순서로 만듭니다.",
    now: "차선과 위치에 대한 결정적 규칙을 적용하고, 이미 실행한 watermark 이하의 칸은 다시 내보내지 않습니다.",
    evidence: "A2의 Alice→Bob 거래가 다른 차선 거래와 같은 전역 위치에 놓이고 중복 없이 실행으로 넘어갑니다.",
    pending: "합의 성공은 애플리케이션 실행 성공과 다릅니다. 상태 변경 영수증까지 확인해야 요청이 끝납니다.",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title} ${state.evidence} ${state.pending}`);

const LANES = [
  { name: "A", cars: ["A0", "A1", "A2"], tip: 2 },
  { name: "B", cars: ["B0", "B1", "B2"], tip: 2 },
  { name: "C", cars: ["C0", "C1", "C2"], tip: 2 },
  { name: "D", cars: ["D0", "D1", "D2", "D3"], tip: 3 },
] as const;

function carVisible(laneIndex: number, carIndex: number, scene: number) {
  if (scene <= 1) return laneIndex === 0 && carIndex <= 2;
  return true;
}

function carActive(laneIndex: number, carIndex: number, scene: number) {
  if (scene <= 1) return laneIndex === 0 && carIndex === 2;
  if (scene === 2 || scene === 3) return carIndex === LANES[laneIndex].tip;
  return carIndex > 1;
}

function LaneTrack({ laneIndex, scene }: { laneIndex: number; scene: number }) {
  const lane = LANES[laneIndex];
  return (
    <div className="grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-center text-xs font-black text-muted-foreground">{lane.name}</span>
      <div className="flex min-w-0 items-center gap-1" aria-label={`${lane.name} 차선`}>
        {lane.cars.map((car, carIndex) => {
          const visible = carVisible(laneIndex, carIndex, scene);
          const active = carActive(laneIndex, carIndex, scene);
          return (
            <div key={car} className="contents">
              {carIndex > 0 ? <span className={`shrink-0 text-[10px] font-black ${visible ? "text-primary" : "text-border"}`} aria-hidden="true">→</span> : null}
              <span
                className={`min-w-0 flex-1 border px-1 py-2 text-center text-[10px] font-bold transition-colors duration-200 ${
                  active && visible
                    ? "border-primary bg-primary text-primary-foreground"
                    : visible
                      ? "border-border bg-background text-foreground"
                      : "border-border/40 bg-muted/20 text-muted-foreground/25"
                }`}
              >
                {car}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AutobahnLaneCutViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6200, { loop: false });
  const state = TRACE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 거래 묶음 추적 · n=4, f=1"
      title="A2에 실린 거래가 네 차선의 전역 순서가 되기까지"
      description="데이터 전파와 합의를 분리하면 blip 동안 쌓인 backlog를 왜 cut 하나로 따라잡을 수 있는지 봅니다."
      note="화살표는 각 차선 안의 부모 참조를 뜻합니다. 차선끼리 직접 참조하는 DAG가 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="Autobahn에서 A2 거래 묶음이 전역 순서가 되는 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage className="min-h-[772px] sm:min-h-[704px] xl:min-h-[470px]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>

          <div className="mt-3 grid gap-3 xl:grid-cols-[1.1fr_.9fr]">
            <div className="min-w-0 border border-border bg-card p-3">
              <div className="space-y-2.5">
                {LANES.map((lane, laneIndex) => <LaneTrack key={lane.name} laneIndex={laneIndex} scene={scenes.active} />)}
              </div>

              <div className={`mt-4 border p-3 transition-colors duration-200 ${scenes.active >= 3 ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold text-muted-foreground">합의가 정하는 cut</p>
                  <p className="text-[10px] font-bold text-primary">이전 cut [1,1,1,1]</p>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {[2, 2, 2, 3].map((position, index) => (
                    <span key={`${LANES[index].name}-${position}`} className={`border px-1 py-2 text-center text-xs font-black ${scenes.active >= 3 ? "border-primary bg-background text-primary" : "border-border bg-background text-muted-foreground/30"}`}>
                      {LANES[index].name}{position}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-px border border-border bg-border p-px">
              <div className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">지금 일어나는 일</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.now}</p></div>
              <div className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">새로 확정된 것</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.evidence}</p></div>
              <div className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">아직 확정되지 않은 것</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.pending}</p></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
            {TRACE_LABELS.map((label, index) => <span key={label} className={`h-1.5 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="Autobahn 거래 처리 과정 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

export function AutobahnCommitViz() {
  const rows = [
    ["car PoA", "f+1", "데이터 보유 정상 노드를 적어도 한 명 남김", "전역 순서·fork 부재"],
    ["PrepareQC", "2f+1 Prep-Vote", "같은 view에서 한 cut만 준비됨", "아직 slow-path commit 아님"],
    ["slow CommitQC", "2f+1 Confirm-Ack", "다음 view가 복구할 durable 증거", "payload 실행 완료"],
    ["fast CommitQC", "n Prep-Vote", "gracious interval에서 Confirm 생략", "일부 표만 받은 상태"],
    ["Timeout Certificate", "2f+1 Timeout", "다음 view를 여는 ticket", "임의의 새 cut 선택"],
  ] as const;

  return (
    <VizFrame
      eyebrow="증거의 이름이 다른 이유"
      title="각 인증서는 다음 단계에 필요한 한 가지 사실만 증명합니다"
      description="PoA, PrepareQC, CommitQC와 TC를 하나의 ready 값으로 뭉치면 복구 때 무엇이 확정됐는지 잃습니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable columns={["증거", "필요한 표", "여기까지 보장", "아직 보장하지 않음"]} rows={rows} desktopMinWidthClassName="min-w-[860px]" />
    </VizFrame>
  );
}
