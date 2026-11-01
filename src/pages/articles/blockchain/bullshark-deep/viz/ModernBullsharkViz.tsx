import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["L2 보류", "L4 연결", "L4 지지", "이전 앵커", "하위 DAG", "순서 저장"] as const;

const TRACE_STATES = [
  {
    title: "라운드 2의 앵커 L2는 인증됐지만, 이 노드에서는 지지표가 하나뿐입니다.",
    now: "L2는 DAG에 남지만 f+1=2에 못 미쳐 아직 직접 커밋되지 않습니다.",
    evidence: "L2와 그 인과적 과거가 인증서 DAG에 존재합니다.",
    pending: "인증서는 앵커 커밋이나 전체 순서를 뜻하지 않습니다.",
  },
  {
    title: "라운드 4의 새 앵커 L4에서 L2까지 인과 경로가 이어집니다.",
    now: "L4 → 라운드 3 인증서 → L2 경로를 모든 노드가 같은 부모 digest로 확인할 수 있습니다.",
    evidence: "나중에 L4가 결정되면 L2를 앞에 둘 수 있는 공통 근거가 생겼습니다.",
    pending: "L4 자체가 아직 지지 임계값을 넘지는 않았습니다.",
  },
  {
    title: "라운드 5의 B5와 C5가 L4를 부모로 참조합니다.",
    now: "서로 다른 작성자의 stake를 더해 support=2를 얻고 validity threshold를 통과합니다.",
    evidence: "고정 구현에서 L4를 직접 커밋할 조건이 충족됐습니다.",
    pending: "L4만 먼저 출력하면 이전 앵커와의 순서가 빠질 수 있습니다.",
  },
  {
    title: "L4에서 거꾸로 걸어가 아직 커밋하지 않은 이전 앵커를 찾습니다.",
    now: "L4에서 L2로 가는 경로가 있으므로 목록은 [L4, L2]가 되고, 출력할 때 뒤집어 L2를 먼저 처리합니다.",
    evidence: "두 노드가 L2를 직접 커밋한 시점이 달라도 앵커 순서는 L2 → L4로 같아집니다.",
    pending: "앵커 목록만으로 그 사이의 모든 인증서 순서는 아직 정해지지 않았습니다.",
  },
  {
    title: "L2의 과거를 먼저, 이어서 L4의 새 과거만 펼칩니다.",
    now: "DFS가 부모 digest의 정렬된 집합을 따라가고, 이미 커밋한 작성자·라운드는 제외한 뒤 round 기준 안정 정렬을 적용합니다.",
    evidence: "도착 순서가 아니라 인증서에 들어 있는 부모 관계로 같은 하위 DAG를 얻습니다.",
    pending: "이 결과는 인증서 순서이며 거래 실행 성공은 아닙니다.",
  },
  {
    title: "각 인증서에 consensus index를 붙이고 커밋 상태를 저장합니다.",
    now: "last_committed, 다음 index, 출력 digest를 갱신한 뒤 애플리케이션 계층으로 인증서를 보냅니다.",
    evidence: "재시작 때 복구할 합의 순서와 커밋 경계가 남습니다.",
    pending: "가리키는 배치 바이트를 가져와 검증하고 실행하는 단계는 뒤에 남아 있습니다.",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title} ${state.now} ${state.evidence} ${state.pending}`);

const ROUNDS = [
  { label: "r5 · L4 지지", nodes: ["A5", "B5 → L4", "C5 → L4", "D5"] },
  { label: "r4 · 새 앵커", nodes: ["L4 · A4", "B4", "C4", "D4"] },
  { label: "r3 · 연결", nodes: ["A3", "B3", "C3", "D3"] },
  { label: "r2 · 이전 앵커", nodes: ["L2 · A2", "B2", "C2", "D2"] },
] as const;

function nodeState(roundIndex: number, nodeIndex: number, scene: number) {
  const visible =
    (roundIndex === 3 && scene >= 0) ||
    (roundIndex === 2 && scene >= 1) ||
    (roundIndex === 1 && scene >= 1) ||
    (roundIndex === 0 && scene >= 2);

  const active =
    (scene === 0 && roundIndex === 3 && nodeIndex === 0) ||
    (scene === 1 && ((roundIndex === 3 && nodeIndex === 0) || (roundIndex === 2 && nodeIndex <= 2) || (roundIndex === 1 && nodeIndex === 0))) ||
    (scene === 2 && ((roundIndex === 0 && (nodeIndex === 1 || nodeIndex === 2)) || (roundIndex === 1 && nodeIndex === 0))) ||
    (scene === 3 && ((roundIndex === 3 && nodeIndex === 0) || (roundIndex === 1 && nodeIndex === 0))) ||
    (scene >= 4 && ((roundIndex === 3 && nodeIndex <= 2) || (roundIndex === 2 && nodeIndex <= 2) || (roundIndex === 1 && nodeIndex === 0)));

  return { visible, active };
}

function Progress({ active }: { active: number }) {
  return (
    <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
      {TRACE_LABELS.map((label, index) => (
        <span key={label} className={`h-1.5 ${index <= active ? "bg-primary" : "bg-border"}`} />
      ))}
    </div>
  );
}

export function BullsharkCommitTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6200, { loop: false });
  const state = TRACE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 앵커 추적 · n=4, f=1"
      title="보류된 L2가 L4와 함께 한 줄의 순서가 되기까지"
      description="보관된 e67f915 구현의 부분 동기식 Bullshark 경로를 여섯 단계로 추적합니다."
      note="설명용 인증서 이름 L2·L4를 사용합니다. 현재 Sui의 합의 구현이나 비동기 Bullshark 변형을 나타내지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="Bullshark가 보류된 L2와 새 앵커 L4를 결정적 순서로 출력하는 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>

          <div className="mt-3 grid gap-3 xl:grid-cols-[1.15fr_.85fr]">
            <div className="border border-border bg-background p-3">
              <div className="mb-2 grid grid-cols-[5.5rem_repeat(4,minmax(0,1fr))] gap-1 text-center text-[9px] font-semibold text-muted-foreground">
                <span />
                <span>A</span><span>B</span><span>C</span><span>D</span>
              </div>
              <div className="space-y-2">
                {ROUNDS.map((round, roundIndex) => (
                  <div key={round.label} className="grid grid-cols-[5.5rem_repeat(4,minmax(0,1fr))] items-center gap-1">
                    <span className="break-keep text-[9px] font-semibold text-muted-foreground">{round.label}</span>
                    {round.nodes.map((node, nodeIndex) => {
                      const status = nodeState(roundIndex, nodeIndex, scenes.active);
                      return (
                        <span
                          key={node}
                          className={`min-w-0 border px-1 py-2 text-center text-[9px] font-bold leading-4 transition-colors duration-200 sm:text-[10px] ${
                            status.active
                              ? "border-primary bg-primary text-primary-foreground"
                              : status.visible
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
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-[10px] font-bold">
                <div className={`border p-2 ${scenes.active >= 3 ? "border-primary bg-primary/10" : "border-border bg-card"}`}>앵커 L2</div>
                <span className="text-muted-foreground">→</span>
                <div className={`border p-2 ${scenes.active >= 2 ? "border-primary bg-primary/10" : "border-border bg-card"}`}>앵커 L4</div>
              </div>
            </div>

            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 xl:block xl:space-y-px xl:overflow-visible xl:border xl:border-border xl:bg-border xl:p-px">
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0">
                <p className="text-[10px] font-semibold text-muted-foreground">지금 일어나는 일</p>
                <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.now}</p>
              </div>
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0">
                <p className="text-[10px] font-semibold text-muted-foreground">새로 생긴 근거</p>
                <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.evidence}</p>
              </div>
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0">
                <p className="text-[10px] font-semibold text-muted-foreground">아직 남은 단계</p>
                <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.pending}</p>
              </div>
            </div>
          </div>
          <Progress active={scenes.active} />
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="L2와 L4의 순서 결정 과정 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

const ORDER_ROWS = [
  ["부모 탐색", "Certificate.header.parents", "BTreeSet의 digest 순서", "로컬 수신 순서"],
  ["중복 제외", "already_ordered + last_committed[author]", "이미 방문했거나 같은 작성자·라운드가 커밋됐으면 제외", "인증서를 두 번 출력"],
  ["GC 경계", "round + gc_depth ≥ last_committed_round", "복구 가능한 범위 안의 인증서만 유지", "삭제된 과거를 추측"],
  ["최종 배열", "stable sort_by_key(round)", "라운드가 오래된 인증서부터 출력", "author 정렬이 코드에 있다고 가정"],
] as const;

export function BullsharkOrderingViz() {
  return (
    <VizFrame
      eyebrow="고정 구현의 하위 DAG 평탄화"
      title="정렬 규칙은 논문 요약이 아니라 실제 자료구조까지 읽어야 합니다"
      description="e67f915의 order_dag가 참조하는 값과 사용하지 않는 값을 분리했습니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable
        columns={["단계", "입력 상태", "결정 규칙", "사용하면 안 되는 값"]}
        rows={ORDER_ROWS}
        desktopMinWidthClassName="min-w-[880px]"
      />
    </VizFrame>
  );
}

const VARIANT_ROWS = [
  ["부분 동기식 설명 v1", "짝수 라운드 앵커", "다음 홀수 라운드의 f+1 edge", "GST 뒤 timeout이 더는 만료되지 않는 진행"],
  ["보관된 e67f915 코드", "committee.leader(even round)", "validity_threshold stake + linked()", "위 설명을 구현한 역사적 standalone 코드"],
  ["비동기 Bullshark v3", "4라운드 wave의 steady-state·fallback leaders", "vote type·2f+1·common coin 경로", "비동기 진행과 동기 구간 fast path"],
] as const;

export function BullsharkVariantViz() {
  return (
    <VizFrame
      eyebrow="변형 경계"
      title="같은 Bullshark 이름 아래에서도 리더·라운드·진행 조건이 다릅니다"
      description="이 글의 실행 추적은 가운데 고정 구현에 한정합니다. 비동기 논문의 4라운드 wave를 그 코드에 덧씌우지 않습니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable
        columns={["근거", "리더 위치", "커밋 근거", "진행 조건"]}
        rows={VARIANT_ROWS}
        desktopMinWidthClassName="min-w-[900px]"
      />
    </VizFrame>
  );
}
