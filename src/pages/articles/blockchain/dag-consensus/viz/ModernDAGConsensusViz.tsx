import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["거래 도착", "블록 인증", "DAG 연결", "앵커 결정", "한 줄로 정렬", "실행"] as const;

const TRACE_STATES = [
  {
    title: "Alice의 거래 T1이 A의 worker에 도착합니다.",
    now: "Worker A가 T1을 배치에 넣고 다른 검증자의 worker에게 전파합니다.",
    evidence: "T1 원문과 배치 해시가 생겼지만 아직 인증서는 없습니다.",
    pending: "가용성·순서·실행 중 어느 것도 확정되지 않았습니다.",
  },
  {
    title: "A1에 서로 다른 검증자 2f+1=3명의 서명이 모입니다.",
    now: "A1은 T1 배치 해시와 이전 라운드 인증서 참조를 담은 certified block이 됩니다.",
    evidence: "Cert(A1)은 정상 검증자 f+1명 이상이 A1의 데이터를 보유한다는 근거입니다.",
    pending: "Cert(A1)은 T1의 전역 실행 순서를 정하지 않습니다.",
  },
  {
    title: "다음 라운드의 각 블록이 이전 라운드 인증서 2f+1개를 가리킵니다.",
    now: "A2·B2·C2·D2가 서로 다른 부모 집합을 골라도 정족수 교집합으로 DAG가 이어집니다.",
    evidence: "A2의 인과적 과거에 A1이 들어가므로 T1까지 거슬러 갈 경로가 생깁니다.",
    pending: "연결된 DAG에도 독립 블록의 가능한 위상 정렬은 여러 개입니다.",
  },
  {
    title: "Bullshark의 짝수 라운드 앵커 A2가 f+1=2표를 얻습니다.",
    now: "라운드 3의 B3와 C3가 A2를 가리키면 두 edge가 A2에 대한 표가 됩니다.",
    evidence: "Partially synchronous Bullshark 규칙에서 A2를 commit할 조건이 생겼습니다.",
    pending: "앵커 결정과 그 인과적 과거의 실제 payload 수신은 같은 사건이 아닙니다.",
  },
  {
    title: "모든 검증자가 A2의 미처리 인과적 과거를 같은 규칙으로 펼칩니다.",
    now: "A1·B1·C1 뒤 A2처럼 round·author·digest 기반의 고정 규칙으로 순서를 만듭니다.",
    evidence: "도착 순서가 달라도 같은 committed prefix가 나옵니다.",
    pending: "T1을 실행하기 전 현재 노드에 A1의 배치 원문이 없으면 먼저 가져와야 합니다.",
  },
  {
    title: "빠진 배치를 가져온 뒤 T1을 결정된 위치에서 한 번만 실행합니다.",
    now: "검증자는 중복 제거와 애플리케이션 검증을 거쳐 같은 상태 전이를 적용합니다.",
    evidence: "실행 receipt와 새 state root가 생기면 비로소 T1의 결과를 확인할 수 있습니다.",
    pending: "인증서 수신 시각을 클라이언트 최종 완료 시각으로 기록하면 안 됩니다.",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title} ${state.now} ${state.evidence} ${state.pending}`);

const ROUNDS = [
  { label: "r3 · 투표", nodes: ["A3", "B3→★", "C3→★", "D3"] },
  { label: "r2 · 앵커", nodes: ["A2 ★", "B2", "C2", "D2"] },
  { label: "r1 · 데이터", nodes: ["A1 · T1", "B1 · T2", "C1", "D1"] },
] as const;

function nodeVisible(roundIndex: number, scene: number) {
  if (roundIndex === 2) return scene >= 1;
  if (roundIndex === 1) return scene >= 2;
  return scene >= 3;
}

function nodeHighlighted(roundIndex: number, nodeIndex: number, scene: number) {
  if (scene === 1) return roundIndex === 2 && nodeIndex === 0;
  if (scene === 2) return (roundIndex === 2 && nodeIndex === 0) || (roundIndex === 1 && nodeIndex === 0);
  if (scene === 3) return (roundIndex === 0 && (nodeIndex === 1 || nodeIndex === 2)) || (roundIndex === 1 && nodeIndex === 0);
  if (scene >= 4) return (roundIndex === 2 && nodeIndex <= 2) || (roundIndex === 1 && nodeIndex === 0);
  return false;
}

function SceneProgress({ active }: { active: number }) {
  return (
    <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
      {TRACE_LABELS.map((label, index) => (
        <span key={label} className={`h-1.5 ${index <= active ? "bg-primary" : "bg-border"}`} />
      ))}
    </div>
  );
}

export function DAGTransactionTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6200, { loop: false });
  const state = TRACE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 거래 추적 · n=4, f=1"
      title="T1이 배치에서 실행 결과가 될 때까지"
      description="Narwhal이 데이터를 인증하고, Bullshark가 앵커를 결정하며, 결정적 선형화가 실행 순서를 만듭니다."
      note="Narwhal v4와 부분 동기식 Bullshark v1의 규칙을 n=4, f=1 설명용 DAG에 적용했습니다. Bullshark의 비동기 변형은 wave와 leader 규칙이 더 복잡합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="DAG 합의에서 거래 T1이 처리되는 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>

          <div className="mt-3 grid gap-3 xl:grid-cols-[1.2fr_.8fr]">
            <div className="border border-border bg-background p-3">
              <div className="mb-2 grid grid-cols-[4.25rem_repeat(4,minmax(0,1fr))] gap-1 text-center text-[9px] font-semibold text-muted-foreground">
                <span />
                <span>A</span><span>B</span><span>C</span><span>D</span>
              </div>
              <div className="space-y-2">
                {ROUNDS.map((round, roundIndex) => (
                  <div key={round.label} className="grid grid-cols-[4.25rem_repeat(4,minmax(0,1fr))] items-center gap-1">
                    <span className="text-[9px] font-semibold text-muted-foreground">{round.label}</span>
                    {round.nodes.map((node, nodeIndex) => {
                      const visible = nodeVisible(roundIndex, scenes.active);
                      const highlighted = nodeHighlighted(roundIndex, nodeIndex, scenes.active);
                      return (
                        <span
                          key={node}
                          className={`min-w-0 border px-1 py-2 text-center text-[10px] font-bold leading-4 transition-colors duration-200 ${
                            highlighted
                              ? "border-primary bg-primary text-primary-foreground"
                              : visible
                                ? "border-border bg-card text-foreground"
                                : "border-border/40 bg-muted/20 text-muted-foreground/30"
                          }`}
                        >
                          {node}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className={`mt-3 border p-2 text-center text-[10px] font-semibold transition-colors duration-200 ${scenes.active === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                Client · Alice의 T1
              </div>
            </div>

            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 xl:block xl:space-y-px xl:overflow-visible xl:border xl:border-border xl:bg-border xl:p-px">
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0">
                <p className="text-[10px] font-semibold text-muted-foreground">지금 일어나는 일</p>
                <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.now}</p>
              </div>
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0">
                <p className="text-[10px] font-semibold text-muted-foreground">새로 생긴 증거</p>
                <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.evidence}</p>
              </div>
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0">
                <p className="text-[10px] font-semibold text-muted-foreground">아직 확정되지 않음</p>
                <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.pending}</p>
              </div>
            </div>
          </div>

          <SceneProgress active={scenes.active} />
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="T1 처리 과정 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

const STATE_ROWS = [
  ["Certified", "Cert(A1) · 2f+1 서명", "A1 데이터의 사후 회수 근거", "전역 순서·애플리케이션 유효성"],
  ["Committed", "f+1표를 얻은 앵커 A2", "A2와 이전 앵커의 결정", "모든 payload의 현재 노드 도착"],
  ["Ordered", "결정적 causal traversal", "독립 블록까지 포함한 한 줄의 prefix", "상태 기계 적용 성공"],
  ["Executed", "중복 제거·검증·상태 전이", "새 state root와 실행 receipt", "다른 노드의 응답 완료 시각"],
] as const;

export function DAGStateBoundaryViz() {
  return (
    <VizFrame
      eyebrow="상태 경계"
      title="인증·커밋·정렬·실행을 한 상태로 합치지 않습니다"
      description="각 단계의 증거가 무엇을 보장하고, 다음 단계에 무엇이 남는지 비교합니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable
        columns={["상태", "증거", "여기까지 보장", "아직 보장하지 않음"]}
        rows={STATE_ROWS}
        desktopMinWidthClassName="min-w-[820px]"
      />
    </VizFrame>
  );
}

export function DAGArrivalOrderCounterexampleViz() {
  return (
    <VizFrame
      eyebrow="도착 순서 반례"
      title="같은 두 거래를 받아도 네트워크 도착 순서는 실행 순서가 될 수 없습니다"
      description="초기 잔액을 0으로 두고 x는 +10, y는 ×2라고 가정합니다."
      documentFlow
      canvasClassName="p-3 sm:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="border border-border bg-background p-4">
          <p className="text-[10px] font-semibold text-muted-foreground">검증자 A의 도착 순서</p>
          <p className="mt-3 text-lg font-black">0 → x(+10) → y(×2)</p>
          <p className="mt-2 text-sm font-semibold text-primary">결과 20</p>
        </div>
        <span className="text-center text-xs font-black text-destructive">≠</span>
        <div className="border border-border bg-background p-4">
          <p className="text-[10px] font-semibold text-muted-foreground">검증자 B의 도착 순서</p>
          <p className="mt-3 text-lg font-black">0 → y(×2) → x(+10)</p>
          <p className="mt-2 text-sm font-semibold text-destructive">결과 10</p>
        </div>
      </div>
      <div className="mt-3 border border-primary bg-primary/5 p-3 text-xs font-semibold leading-5">
        해결: committed anchor의 causal history를 round·author·digest처럼 모든 검증자가 공유하는 값으로 정렬합니다.
      </div>
    </VizFrame>
  );
}
