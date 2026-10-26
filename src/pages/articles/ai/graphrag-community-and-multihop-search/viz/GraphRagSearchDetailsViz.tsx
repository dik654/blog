import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

function StepBox({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div className={`min-w-0 border px-3 py-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <p className="text-[10px] font-bold text-primary">{label}</p>
      <p className="mt-1 break-keep text-xs font-bold leading-5 text-foreground sm:text-sm">{value}</p>
    </div>
  );
}

function SceneViz({
  labels,
  notes,
  scenes: sceneNodes,
  ariaLabel,
  playLabel,
}: {
  labels: readonly string[];
  notes: readonly string[];
  scenes: readonly ReactNode[];
  ariaLabel: string;
  playLabel: string;
}) {
  const scenes = useAnimatedScenes(labels.length, 6400, { loop: false });
  return (
    <div
      id={scenes.playbackId}
      data-viz-canvas
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
      onKeyDown={scenes.onKeyDown}
      className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h4 className="text-base font-bold">{labels[scenes.active]}</h4>
        <span className="font-mono text-[10px] font-bold text-primary">
          {String(scenes.active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
        </span>
      </div>
      <div className="sm:hidden">{sceneNodes[scenes.active]}</div>
      <StableSceneStack active={scenes.active} scenes={sceneNodes} className="hidden sm:grid" />
      <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
        {notes[scenes.active]}
      </p>
      <StaticSceneList labels={labels} notes={notes} />
      <AnimatedSceneControls {...scenes} labels={labels} playLabel={playLabel} />
    </div>
  );
}

const COMMUNITY_LABELS = ["관계 그래프", "두 묶음", "분할 비교", "Report 생성"] as const;
const COMMUNITY_NOTES = [
  "kg-v43은 U-42가 사용자·계정·tenant 쪽과 오류·앱 쪽을 잇는 다리입니다.",
  "설명용 분할은 C-A에 U-42·A-17·tenant-a, C-B에 E401·모바일 앱을 둡니다. 양쪽 안쪽 edge는 각각 2개와 1개입니다.",
  "이 분할의 modularity는 0.21875입니다. E401을 C-A로 옮기면 -0.03125가 되어, 이 작은 예에서는 원래 분할이 더 조밀합니다.",
  "각 묶음의 node·edge·근거를 LLM이 report로 요약합니다. Graph나 원문이 바뀌면 report도 같은 index version에서 다시 만들어야 합니다.",
] as const;

function CommunityGraph({ partitioned = false }: { partitioned?: boolean }) {
  const nodes = [
    ["U-42", "A"],
    ["A-17", "A"],
    ["tenant-a", "A"],
    ["E401", "B"],
    ["모바일 앱", "B"],
  ] as const;
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {nodes.map(([node, group]) => (
          <div
            key={node}
            className={`border px-2 py-3 text-xs font-bold ${partitioned ? (group === "A" ? "border-primary bg-primary/10" : "border-amber-600 bg-amber-500/10") : "border-border"}`}
          >
            {node}
            {partitioned ? <span className="mt-1 block text-[9px] text-muted-foreground">C-{group}</span> : null}
          </div>
        ))}
      </div>
      <ol className="mt-3 grid gap-1 border-y border-border py-2 font-mono text-[10px] leading-4 text-muted-foreground sm:grid-cols-2">
        <li>U-42 ─usesAccount→ A-17</li>
        <li>U-42 ─memberOf→ tenant-a</li>
        <li className="text-primary">U-42 ─reported→ E401 · 다리</li>
        <li>E401 ─occursIn→ 모바일 앱</li>
      </ol>
    </div>
  );
}

const COMMUNITY_SCENES: readonly ReactNode[] = [
  <CommunityGraph key="raw" />,
  <CommunityGraph key="partitioned" partitioned />,
  <div key="compare" className="grid gap-px bg-border p-px sm:grid-cols-2">
    <section className="bg-background p-4">
      <p className="text-[10px] font-bold text-primary">원래 분할</p>
      <p className="mt-2 font-mono text-lg font-bold">Q = 0.21875</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">C-A 안쪽 edge 2 · C-B 안쪽 edge 1</p>
    </section>
    <section className="bg-background p-4">
      <p className="text-[10px] font-bold text-muted-foreground">E401을 C-A로 이동</p>
      <p className="mt-2 font-mono text-lg font-bold">Q = -0.03125</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">모바일 앱 하나가 고립돼 우연 기대보다 나빠짐</p>
    </section>
  </div>,
  <div key="reports" className="grid gap-3 sm:grid-cols-2">
    <StepBox label="REPORT C-A" value="tenant-a 사용자 U-42는 A-17 계정을 사용합니다." active />
    <StepBox label="REPORT C-B" value="U-42가 보고한 E401은 모바일 앱에서 발생했습니다." active />
    <p className="sm:col-span-2 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
      report에는 community id·level·rank와 요약이 함께 저장됩니다. 질문 시점의 global search는 이 report를 읽습니다.
    </p>
  </div>,
];

export function CommunityReportBuildViz() {
  return (
    <VizFrame
      eyebrow="Community index · 설명용 계산"
      title="kg-v43을 두 묶음으로 나누고, 질문 전에 report 두 개를 만듭니다"
      description="Community는 조밀한 관계 묶음이고 report는 그 묶음을 LLM이 요약한 검색용 상태입니다. 둘은 같은 것이 아닙니다."
      note="node 5·edge 4와 Q 값은 설명용 kg-v43에서 계산했습니다. 실제 분할은 그래프 크기·가중치·resolution 설정에 따라 달라집니다."
    >
      <SceneViz labels={COMMUNITY_LABELS} notes={COMMUNITY_NOTES} scenes={COMMUNITY_SCENES} ariaLabel="kg-v43을 community로 나누고 report를 만드는 네 단계" playLabel="Community 과정 재생" />
    </VizFrame>
  );
}

const LOCAL_LABELS = ["질문", "Entity 후보", "예산 분할", "Context", "답변"] as const;
const LOCAL_NOTES = [
  "q-882는 tenant-a에서 시작해 오류가 발생한 위치를 묻습니다. 호출자는 local search를 선택했습니다.",
  "질문 embedding과 entity description embedding을 비교해 tenant-a와 U-42를 시작 후보로 고릅니다. 후보 누락은 뒤 단계에서 복구되지 않습니다.",
  "v3.3.0 mixed_context.py 기본 인자는 전체 8,000 token 중 text unit 50%, community 25%, 나머지 25%를 entity·relationship·covariate에 씁니다.",
  "선택 entity에 연결된 report·relationship·text unit을 각 예산 안에서 순위화합니다. d-31과 d-22가 들어오면서 U-42→E401→모바일 앱 관계를 볼 수 있습니다.",
  "LLM은 조립된 context를 읽어 답합니다. 이는 관계 record를 context에 넣은 뒤 생성하는 경로이며, graph engine이 정답 node를 BFS로 반환한 경로가 아닙니다.",
] as const;

const LOCAL_SCENES: readonly ReactNode[] = [
  <StepBox key="query" label="q-882 · LOCAL" value="tenant-a 사용자가 보고한 오류는 어디서 발생했나?" active />,
  <div key="entities" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
    <StepBox label="질문 embedding" value="tenant-a · 사용자 · 오류 · 발생 위치" />
    <span className="text-center text-xl text-primary" aria-hidden>→</span>
    <div className="grid gap-2">
      <StepBox label="후보 1" value="tenant-a" active />
      <StepBox label="후보 2" value="U-42" active />
    </div>
  </div>,
  <div key="budget" className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
    <StepBox label="TEXT UNIT" value="4,000 · 50%" active />
    <StepBox label="COMMUNITY" value="2,000 · 25%" />
    <StepBox label="LOCAL DATA" value="2,000 · 25%" />
    <StepBox label="TOTAL" value="8,000 token" />
  </div>,
  <div key="context" className="grid gap-2 sm:grid-cols-2">
    <StepBox label="Entities" value="tenant-a · U-42 · E401 · 모바일 앱" />
    <StepBox label="Relationships" value="memberOf · reported · occursIn" />
    <StepBox label="Reports" value="C-A · C-B 중 entity와 연결된 report" />
    <StepBox label="Sources" value="d-31 · d-22 text unit" active />
  </div>,
  <div key="answer" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
    <StepBox label="조립된 context" value="U-42가 E401을 보고했고 E401은 모바일 앱에서 발생" />
    <span className="text-center text-xl text-primary" aria-hidden>→</span>
    <StepBox label="답변" value="오류 E401은 모바일 앱에서 발생했습니다." active />
  </div>,
];

export function LocalSearchContextViz() {
  return (
    <VizFrame
      eyebrow="Local search · v3.3.0 코드 경로"
      title="질문을 entity에 연결하고, 네 종류의 자료를 token 예산 안에 조립합니다"
      description="Local search의 핵심 출력은 특정 node 하나가 아니라 LLM이 읽을 mixed context입니다."
      note="8,000·50%·25%는 v3.3.0 LocalSearchMixedContext.build_context의 기본 인자입니다. 실제 설정은 바꿀 수 있으며 이 글이 성능을 측정한 값은 아닙니다."
    >
      <SceneViz labels={LOCAL_LABELS} notes={LOCAL_NOTES} scenes={LOCAL_SCENES} ariaLabel="q-882 local search가 답변 문맥을 만드는 다섯 단계" playLabel="Local 과정 재생" />
    </VizFrame>
  );
}

const GLOBAL_LABELS = ["질문", "Report batch", "Map", "Reduce", "DRIFT 비교"] as const;
const GLOBAL_NOTES = [
  "q-883은 특정 entity가 아니라 자료 전체의 주제를 묻습니다. 호출자는 global search를 선택했습니다.",
  "선택한 community level의 report를 섞고 token 크기에 맞춰 여러 batch로 나눕니다.",
  "각 batch에서 중간 point와 중요도 점수를 만듭니다. 이 단계는 report batch 수만큼 병렬화할 수 있습니다.",
  "중요한 point를 골라 최종 context 예산까지 채운 뒤 한 답으로 합칩니다. 병렬화는 지연을 줄일 수 있지만 총 LLM 호출량을 없애지 않습니다.",
  "DRIFT는 모든 report를 map-reduce하지 않습니다. 질문과 가까운 report 상위 K개로 primer를 만들고 후속 질문마다 local search를 실행합니다.",
] as const;

const GLOBAL_SCENES: readonly ReactNode[] = [
  <StepBox key="query" label="q-883 · GLOBAL" value="이 자료 전체가 다루는 문제를 요약해줘." active />,
  <div key="batches" className="grid gap-2 sm:grid-cols-2">
    <StepBox label="BATCH 1" value="Report C-A · 사용자·계정·tenant" />
    <StepBox label="BATCH 2" value="Report C-B · 오류·모바일 앱" />
  </div>,
  <div key="map" className="grid gap-2 sm:grid-cols-2">
    <StepBox label="POINT A · 83" value="사용자의 계정·tenant 관계" active />
    <StepBox label="POINT B · 91" value="사용자 보고와 앱 오류의 연결" active />
  </div>,
  <div key="reduce" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
    <StepBox label="점수순 context" value="Point B → Point A" />
    <span className="text-center text-xl text-primary" aria-hidden>→</span>
    <StepBox label="최종 답변" value="계정 사용과 모바일 앱 오류 보고가 연결된 자료입니다." active />
  </div>,
  <div key="drift" className="grid gap-2 sm:grid-cols-4">
    <StepBox label="1 · Primer" value="상위 K report" />
    <StepBox label="2 · Follow-up" value="세부 질문 생성" />
    <StepBox label="3 · Local" value="질문별 자료 수집" />
    <StepBox label="4 · Output" value="관련도 순 계층" active />
  </div>,
];

export function GlobalAndDriftViz() {
  return (
    <VizFrame
      eyebrow="Global·DRIFT · 서로 다른 확장"
      title="Global은 report 전체를 종합하고, DRIFT는 report에서 후속 local 질문으로 내려갑니다"
      description="두 방식 모두 community report를 쓰지만 읽는 범위와 반복 상태가 다릅니다."
      note="Point 점수 83·91과 최종 문장은 설명용 가정입니다. map·reduce 및 DRIFT의 단계는 Microsoft GraphRAG v3.3.0 문서와 구현 경계를 따릅니다."
    >
      <SceneViz labels={GLOBAL_LABELS} notes={GLOBAL_NOTES} scenes={GLOBAL_SCENES} ariaLabel="Global map-reduce와 DRIFT의 차이를 보여주는 다섯 장면" playLabel="Global·DRIFT 과정 재생" />
    </VizFrame>
  );
}

const HOP_LABELS = ["질문", "관계 자료", "LLM 합성", "실패", "별도 traversal"] as const;
const HOP_NOTES = [
  "q-882는 tenant-a→U-42→E401→모바일 앱의 세 관계를 이어야 답할 수 있습니다.",
  "Local context builder가 관계 record와 연결 원문을 문맥에 넣으면 LLM이 그 연결을 읽을 수 있습니다.",
  "이 사례의 답은 세 관계를 합성해 얻습니다. 하지만 기본 API가 정확히 3-hop을 모두 탐색했다고 보장하는 것은 아닙니다.",
  "시작 entity나 중간 relationship이 top-k·token 예산에서 빠지면 경로가 끊깁니다. 생성 모델이 관계 방향을 잘못 합성할 수도 있습니다.",
  "모든 경로를 빠짐없이 찾거나 최대 hop을 강제해야 한다면 graph query가 traversal 결과를 만들고, 그 결과를 RAG context에 넣는 별도 경로가 필요합니다.",
] as const;

const HOP_SCENES: readonly ReactNode[] = [
  <StepBox key="q" label="q-882" value="tenant-a 사용자가 보고한 오류는 어디서 발생했나?" active />,
  <div key="records" className="grid gap-2 sm:grid-cols-3">
    <StepBox label="관계 1" value="U-42 ─memberOf→ tenant-a" />
    <StepBox label="관계 2" value="U-42 ─reported→ E401" />
    <StepBox label="관계 3" value="E401 ─occursIn→ 모바일 앱" active />
  </div>,
  <div key="compose" className="border-y border-border py-4 text-center">
    <p className="font-mono text-xs font-bold sm:text-sm">tenant-a ← U-42 → E401 → 모바일 앱</p>
    <p className="mt-3 text-sm font-bold text-primary">답 · 모바일 앱</p>
  </div>,
  <div key="failure" className="grid gap-px bg-border p-px sm:grid-cols-3">
    <StepBox label="후보 누락" value="U-42를 못 찾음" />
    <StepBox label="예산 잘림" value="occursIn 관계가 빠짐" />
    <StepBox label="생성 오류" value="방향·주체를 잘못 합성" />
  </div>,
  <div key="traversal" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
    <StepBox label="Graph query" value="시작 node·edge 방향·max_depth=3을 강제" />
    <span className="text-center text-xl text-primary" aria-hidden>→</span>
    <StepBox label="RAG context" value="검증된 경로와 source_id를 LLM에 전달" active />
  </div>,
];

export function MultiHopBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Multi-hop · 구현 경계"
      title="관계 여러 개를 읽는 것과 N-hop traversal을 보장하는 것은 다릅니다"
      description="GraphRAG local search는 관계 자료를 문맥에 넣습니다. 경로 완전성이나 최대 hop을 강제하는 graph query는 별도 책임입니다."
      note="q-882의 세 관계는 설명용 사례입니다. v3.3.0 LocalSearchMixedContext에는 사용자에게 노출된 max_hops BFS 인자가 없습니다."
    >
      <SceneViz labels={HOP_LABELS} notes={HOP_NOTES} scenes={HOP_SCENES} ariaLabel="Multi-hop 답변과 결정적 graph traversal의 경계를 보여주는 다섯 장면" playLabel="Multi-hop 경계 재생" />
    </VizFrame>
  );
}
