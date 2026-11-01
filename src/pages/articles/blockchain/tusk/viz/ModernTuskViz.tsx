import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENE_LABELS = ["인증된 DAG", "L1 후보", "지지 1개", "L1 건너뜀", "L2 후보", "지지 2개", "L2 확정", "L1부터 출력"] as const;
const ROUND_X = [8, 29, 50, 71, 92] as const;
const AUTHOR_Y = [26, 45, 64, 83] as const;
const AUTHORS = ["A", "B", "C", "D"] as const;

type NodeId = `r${1 | 2 | 3 | 4 | 5}${"a" | "b" | "c" | "d"}`;
type DagNode = { id: NodeId; round: 1 | 2 | 3 | 4 | 5; author: typeof AUTHORS[number]; x: number; y: number };
type EdgeKind = "l1-support" | "l2-support" | "recovery";
type DagEdge = { from: NodeId; to: NodeId; kind?: EdgeKind };

const DAG_NODES: readonly DagNode[] = ROUND_X.flatMap((x, roundIndex) =>
  AUTHORS.map((author, authorIndex) => ({
    id: `r${roundIndex + 1}${author.toLowerCase()}` as NodeId,
    round: (roundIndex + 1) as DagNode["round"],
    author,
    x,
    y: AUTHOR_Y[authorIndex],
  })),
);

const PARENTS: Record<2 | 3 | 4 | 5, readonly (readonly number[])[]> = {
  2: [[0, 1, 2], [0, 1, 3], [0, 1, 2], [0, 1, 2]],
  3: [[0, 1, 2], [0, 2, 3], [0, 1, 2], [1, 2, 3]],
  4: [[0, 1, 2], [0, 2, 3], [0, 1, 3], [0, 1, 3]],
  5: [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]],
};

const DAG_EDGES: readonly DagEdge[] = ([2, 3, 4, 5] as const).flatMap((round) =>
  PARENTS[round].flatMap((parents, authorIndex) => parents.map((parentIndex) => {
    const from = `r${round}${AUTHORS[authorIndex].toLowerCase()}` as NodeId;
    const to = `r${round - 1}${AUTHORS[parentIndex].toLowerCase()}` as NodeId;
    const kind: EdgeKind | undefined = from === "r2b" && to === "r1d"
      ? "l1-support"
      : (from === "r4a" || from === "r4b") && to === "r3c"
        ? "l2-support"
        : from === "r3c" && to === "r2b"
          ? "recovery"
          : undefined;
    return { from, to, kind };
  })),
);

const NODE_BY_ID = Object.fromEntries(DAG_NODES.map((node) => [node.id, node])) as Record<NodeId, DagNode>;

type TraceState = {
  title: string;
  detail: string;
  result: string;
  visibleRound: number;
  activeNodes: readonly NodeId[];
  activeKinds: readonly EdgeKind[];
  l1Status: "대기" | "지지 부족" | "간접 확정";
  l2Status: "아직 없음" | "후보" | "명시적 확정";
  output: readonly string[];
};

const TRACE_STATES: readonly TraceState[] = [
  { title: "Narwhal이 데이터가 있는 인증서 DAG를 먼저 만듭니다", detail: "Tusk는 거래 원문을 다시 퍼뜨리지 않고, 검증을 마친 인증서와 부모 연결을 입력으로 읽습니다.", result: "가용성은 확인했지만 순서는 아직 정하지 않았습니다.", visibleRound: 1, activeNodes: ["r1a", "r1b", "r1c", "r1d"], activeKinds: [], l1Status: "대기", l2Status: "아직 없음", output: [] },
  { title: "첫 wave의 동전은 1라운드 D 인증서를 L1으로 고릅니다", detail: "지도자는 미리 방송을 독점하는 사람이 아니라, 이미 DAG에 있는 첫 라운드 후보 중 나중에 뽑힌 인증서입니다.", result: "선택만 끝났습니다. 지지 조건은 별도로 확인해야 합니다.", visibleRound: 1, activeNodes: ["r1d"], activeKinds: [], l1Status: "대기", l2Status: "아직 없음", output: [] },
  { title: "2라운드에서 L1을 직접 가리키는 인증서는 B 하나뿐입니다", detail: "n=4, f=1이므로 서로 다른 작성자 2명, 즉 f+1명의 지지가 필요합니다. 중복 연결은 작성자 수를 늘리지 않습니다.", result: "L1 지지 1/2 · 확정 조건 미달", visibleRound: 2, activeNodes: ["r1d", "r2b"], activeKinds: ["l1-support"], l1Status: "지지 부족", l2Status: "아직 없음", output: [] },
  { title: "3라운드에서 L1을 골라도 그 자리에서는 건너뜁니다", detail: "동전 결과와 지지 조건은 서로 다릅니다. L1은 후보로 남지만 아직 출력하지 않습니다.", result: "첫 wave 종료 · 출력 없음", visibleRound: 3, activeNodes: ["r1d", "r2b", "r3a", "r3b", "r3c", "r3d"], activeKinds: ["l1-support"], l1Status: "지지 부족", l2Status: "아직 없음", output: [] },
  { title: "같은 3라운드는 다음 wave의 첫 라운드이기도 합니다", detail: "두 wave가 한 라운드를 겹쳐 쓰며, 두 번째 동전은 3라운드 C 인증서를 L2로 고릅니다.", result: "L2가 새 후보가 됩니다.", visibleRound: 3, activeNodes: ["r1d", "r2b", "r3c"], activeKinds: ["recovery"], l1Status: "지지 부족", l2Status: "후보", output: [] },
  { title: "4라운드 A와 B가 L2를 가리켜 지지 2개를 만듭니다", detail: "서로 다른 작성자 두 명이므로 f+1 조건을 만족합니다. L2의 인과 과거에는 R2-B를 거쳐 L1로 가는 경로도 있습니다.", result: "L2 지지 2/2 · 확정 가능", visibleRound: 4, activeNodes: ["r1d", "r2b", "r3c", "r4a", "r4b"], activeKinds: ["l2-support", "recovery"], l1Status: "지지 부족", l2Status: "후보", output: [] },
  { title: "5라운드 동전이 L2를 고르면 L2를 명시적으로 확정합니다", detail: "지지 조건을 통과한 L2가 현재 anchor가 됩니다. 이제 직전 확정 지점까지 이전 지도자 경로를 거꾸로 찾습니다.", result: "L2 명시적 확정 · L1 경로 발견", visibleRound: 5, activeNodes: ["r1d", "r2b", "r3c", "r4a", "r4b", "r5a", "r5b", "r5c", "r5d"], activeKinds: ["l2-support", "recovery"], l1Status: "간접 확정", l2Status: "명시적 확정", output: [] },
  { title: "인과 경로에 있던 L1을 먼저, 그다음 L2를 출력합니다", detail: "각 지도자의 아직 출력하지 않은 조상을 정해진 규칙으로 펼치면 도착 순서가 달라도 같은 인증서 순서를 얻습니다.", result: "L1의 미출력 조상 → L1 → L2의 나머지 조상 → L2", visibleRound: 5, activeNodes: ["r1d", "r2b", "r3c", "r4a", "r4b"], activeKinds: ["l1-support", "l2-support", "recovery"], l1Status: "간접 확정", l2Status: "명시적 확정", output: ["L1 쪽 인과 과거", "L1", "L2 쪽 인과 과거", "L2"] },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title}. ${state.detail} ${state.result}`);

function edgeIsActive(edge: DagEdge, state: TraceState) { return Boolean(edge.kind && state.activeKinds.includes(edge.kind)); }
function nodeIsActive(node: DagNode, state: TraceState) { return state.activeNodes.includes(node.id); }
function nodeLabel(node: DagNode) { return node.id === "r1d" ? "L1" : node.id === "r3c" ? "L2" : `${node.round}${node.author}`; }

function StatusCell({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border p-2.5 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="break-keep text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-1 break-keep text-xs font-black leading-5">{value}</p></div>;
}

export function TuskWaveTraceViz() {
  const scenes = useAnimatedScenes(SCENE_LABELS.length, 6500, { loop: false });
  const state = TRACE_STATES[scenes.active];
  return <VizFrame eyebrow="설명용 DAG · n=4 · f=1 · 지지 기준 f+1=2" title="첫 지도자를 건너뛰어도 다음 지도자가 인과 경로를 따라 되찾습니다" description="논문 Figure 5의 핵심을 여덟 장면으로 나눠, 후보 선택·지지·명시적 확정·이전 지도자 복구를 따로 봅니다." note="화살표는 새 인증서가 가리키는 부모 방향입니다. 실제 인증서는 이전 라운드의 2f+1개 부모를 가지며, 그림은 판단에 필요한 연결을 중심으로 단순화했습니다." canvasClassName="p-2.5 sm:p-5">
    <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="두 개의 겹치는 Tusk wave에서 L1을 건너뛰고 L2 확정 뒤 L1을 복구하는 여덟 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      <div data-viz-scene-stage>
        <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {SCENE_LABELS[scenes.active]}</p>
        <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
        <p className="mt-1 min-h-12 text-xs font-semibold leading-5 text-muted-foreground">{state.detail}</p>
        <div className="relative mt-3 h-[19rem] overflow-hidden border border-border bg-background sm:h-[22rem]" aria-label="5개 라운드와 4개 검증자 인증서 DAG">
          <div className="absolute inset-x-0 top-1 grid grid-cols-5 px-1 text-center text-[8px] font-black sm:text-[10px]">{[1, 2, 3, 4, 5].map((round) => <span key={round}>라운드 {round}</span>)}</div>
          <div className="absolute left-[2%] right-[48%] top-7 h-1 bg-destructive/65" aria-hidden="true" /><div className="absolute left-[48%] right-[2%] top-7 h-1 bg-primary/65" aria-hidden="true" />
          <div className="absolute left-[2%] top-8 text-[8px] font-bold text-destructive">wave 1</div><div className="absolute left-[50%] top-8 text-[8px] font-bold text-primary">wave 2</div>
          {state.visibleRound >= 3 && <div className="absolute left-1/2 top-11 -translate-x-1/2 border border-destructive bg-background px-1.5 py-0.5 text-[8px] font-black text-destructive">동전 → L1</div>}
          {state.visibleRound >= 5 && <div className="absolute left-[92%] top-11 -translate-x-1/2 border border-primary bg-background px-1.5 py-0.5 text-[8px] font-black text-primary">동전 → L2</div>}
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="tusk-arrow-primary" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="var(--primary)" /></marker><marker id="tusk-arrow-danger" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="var(--destructive)" /></marker></defs>
            {DAG_EDGES.map((edge) => { const from = NODE_BY_ID[edge.from]; const to = NODE_BY_ID[edge.to]; const visible = from.round <= state.visibleRound; const active = edgeIsActive(edge, state); const danger = edge.kind === "l1-support" && state.l1Status === "지지 부족"; return <line key={`${edge.from}-${edge.to}`} x1={from.x - 2.5} y1={from.y} x2={to.x + 2.5} y2={to.y} stroke={active ? danger ? "var(--destructive)" : "var(--primary)" : "var(--border)"} strokeWidth={active ? 2.4 : 0.8} strokeOpacity={visible ? active ? 1 : 0.5 : 0} strokeLinecap="round" vectorEffect="non-scaling-stroke" markerEnd={visible && active ? danger ? "url(#tusk-arrow-danger)" : "url(#tusk-arrow-primary)" : undefined} className="transition-all duration-200" />; })}
          </svg>
          {DAG_NODES.map((node) => { const visible = node.round <= state.visibleRound; const active = nodeIsActive(node, state); const l1 = node.id === "r1d"; const l2 = node.id === "r3c"; const rejected = l1 && state.l1Status === "지지 부족"; const committed = (l1 && state.l1Status === "간접 확정") || (l2 && state.l2Status === "명시적 확정"); const color = committed || l2 ? "border-primary bg-primary text-primary-foreground" : rejected || l1 ? "border-destructive bg-destructive text-destructive-foreground" : active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground"; return <div key={node.id} className={`absolute flex h-8 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border text-[8px] font-black transition-all duration-200 sm:h-10 sm:w-12 sm:text-[10px] ${color}`} style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: visible ? active || l1 || l2 ? 1 : 0.52 : 0 }} aria-hidden="true">{nodeLabel(node)}</div>; })}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2"><StatusCell label="L1 상태" value={state.l1Status} active={state.l1Status === "간접 확정"} /><StatusCell label="L2 상태" value={state.l2Status} active={state.l2Status === "명시적 확정"} /><StatusCell label="현재 결과" value={state.output.length ? "순서 출력" : "출력 없음"} active={state.output.length > 0} /></div>
        <div className={`mt-3 min-h-16 border p-3 ${state.output.length ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}><p className="text-[9px] font-black">{state.output.length ? "결정된 순서" : "이번 장면의 판단"}</p>{state.output.length ? <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] font-bold">{state.output.map((item, index) => <span key={item} className="contents">{index > 0 && <span aria-hidden="true">→</span>}<span className="border border-primary-foreground/45 px-2 py-1">{item}</span></span>)}</div> : <p className="mt-1 text-xs font-semibold leading-5">{state.result}</p>}</div>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENE_LABELS} controlLabels={SCENE_LABELS} playLabel="Tusk 확정 과정 재생" />
    </div>
    <StaticSceneList labels={SCENE_LABELS} notes={TRACE_NOTES} />
  </VizFrame>;
}

const EVIDENCE_ROWS = [
  ["2022 논문", "3라운드 wave·공통 동전·f+1 지지", "비동기 적대자에서 지도자 확정 기대 7라운드, 무작위 지연에서 각 블록 기대 4.5라운드", "현재 제품의 실제 배치"],
  ["논문 프로토타입", "고정 커밋 70dc862의 consensus/src/lib.rs", "f+1 지지·이전 지도자 경로·DAG 펼치기", "공통 동전: TODO이며 실제 선택은 라운드 로빈"],
  ["2024년 후속 분석", "동전을 일찍 알 수 있는 구현과 wave 종료 때만 검사하는 규칙", "모두 wave를 진행해도 한 정직한 참여자만 계속 확정할 수 있는 실행", "원 논문의 모든 안전성까지 반박"],
  ["현재 Sui", "Mysticeti 기반 DAG 합의", "Tusk 계보를 발전시킨 별도 프로토콜", "Tusk가 현재 Sui 합의라는 주장"],
] as const;

export function TuskEvidenceBoundaryViz() { return <VizFrame eyebrow="논문 · 프로토타입 · 후속 분석 · 현재 제품" title="같은 Tusk라는 이름 아래에서도 확인되는 사실은 근거마다 다릅니다" description="논문이 제안한 알고리즘과 당시 공개 코드, 이후의 형식적 반론, 현재 제품 경로를 한 줄로 합치지 않습니다." documentFlow canvasClassName="p-0"><ResponsiveVizTable columns={["근거", "확인 대상", "확인되는 것", "이 근거만으로 말할 수 없는 것"]} rows={EVIDENCE_ROWS} desktopMinWidthClassName="min-w-[980px]" /></VizFrame>; }

const LIVENESS_ROWS = [
  ["안전성", "정직한 참여자가 상충하는 지도자 순서를 확정하지 않음", "원 논문의 인과 경로·quorum 교차 논증", "2024 공격에서도 같은 지도자 순서는 유지"],
  ["원 논문의 진행 주장", "비동기 적대자에서도 지도자 확정 확률이 wave마다 상수", "동전이 지지 가능한 지도자보다 늦게 드러난다는 전제", "기대값이지 시간 상한은 아님"],
  ["2024 반론의 실행", "모두 다음 wave로 진행하지만 대부분은 지도자를 확정하지 못함", "동전 공개 시점·서로 다른 local DAG·wave 종료 시점의 검사", "메시지를 영원히 버리는 공격이 아님"],
  ["완화책의 경계", "늦게 도착한 지지도 다시 검사하고, 오래 확정이 없으면 back-pressure", "약한 진행 회복과 저장 공간 제한에 도움", "DAG-Rider 수준의 강한 진행성이 자동 복구됨"],
] as const;

export function TuskLivenessBoundaryViz() { return <VizFrame eyebrow="안전성과 진행성은 별도 주장" title="모두 다음 라운드로 움직이는 것과 모두 계속 확정하는 것은 다릅니다" description="원 논문의 주장과 2024년 반론이 각각 어떤 전제와 결론을 갖는지 나눠 읽습니다." documentFlow canvasClassName="p-0"><ResponsiveVizTable columns={["구분", "무엇을 묻나", "핵심 근거", "경계"]} rows={LIVENESS_ROWS} desktopMinWidthClassName="min-w-[940px]" /></VizFrame>; }
