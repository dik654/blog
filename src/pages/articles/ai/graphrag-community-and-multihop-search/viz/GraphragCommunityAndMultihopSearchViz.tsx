import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["kg-v43", "검색 인덱스", "Local", "Global", "DRIFT", "경계"] as const;

const NOTES = [
  "앞 글이 만든 kg-v43에는 node 5개·edge 4개와 source_id가 있습니다. 아직 community report와 검색용 embedding은 없습니다.",
  "질문 전에 graph를 community 둘로 나눠 report를 만들고, entity description embedding과 entity↔text unit 매핑을 준비합니다.",
  "q-882는 entity embedding으로 U-42·tenant-a를 찾고, 관련 entity·relationship·report·text unit을 token 예산 안에 조립해 ‘모바일 앱’을 답합니다.",
  "q-883처럼 전체 자료의 주제를 묻는 질문은 community report 둘을 map 단계에서 각각 읽고, 중요한 point를 골라 reduce 단계에서 한 답으로 합칩니다.",
  "q-884는 관련 community report로 넓은 답과 후속 질문을 만든 뒤, 후속 질문마다 local search를 실행하고 결과를 관련도 순으로 합칩니다.",
  "v3.3.0은 local·global·drift를 별도 API와 CLI method로 제공합니다. 질문을 보고 검색 방식을 자동 선택하는 단계나 고정 hop BFS는 이 경로의 기본 계약이 아닙니다.",
] as const;

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex min-w-10 flex-col items-center justify-center gap-1 text-center text-primary" aria-hidden>
      {label ? <span className="text-[9px] font-bold text-muted-foreground">{label}</span> : null}
      <span className="text-xl">→</span>
    </div>
  );
}

function Box({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-3 py-3 ${strong ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <p className="break-keep text-xs font-bold text-foreground sm:text-sm">{title}</p>
      <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{detail}</p>
    </div>
  );
}

function GraphScene() {
  const nodes = ["U-42", "A-17", "tenant-a", "E401", "모바일 앱"];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
      <div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {nodes.map((node, index) => (
            <div
              key={node}
              className={`border px-2 py-3 text-xs font-bold ${index === 0 ? "border-primary bg-primary/10" : "border-border"}`}
            >
              {node}
            </div>
          ))}
        </div>
        <ol className="mt-3 grid gap-1 border-y border-border py-2 font-mono text-[10px] leading-4 text-muted-foreground sm:grid-cols-2">
          <li>U-42 ─usesAccount→ A-17</li>
          <li>U-42 ─memberOf→ tenant-a</li>
          <li>U-42 ─reported→ E401</li>
          <li>E401 ─occursIn→ 모바일 앱</li>
        </ol>
      </div>
      <div className="border-l-2 border-primary pl-4">
        <p className="font-mono text-sm font-bold">kg-v43</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          node 5 · edge 4 · source 3
        </p>
        <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">
          관계를 저장한 그래프와 질문을 받을 검색 인덱스는 같은 것이 아닙니다.
        </p>
      </div>
    </div>
  );
}

function IndexScene() {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] sm:items-center">
      <Box title="kg-v43" detail="node 5 · edge 4 · source_id 보존" strong />
      <Arrow label="질문 전" />
      <div className="grid gap-2 sm:grid-cols-2">
        <Box title="Community reports" detail="C-A 사용자·계정 / C-B 오류·앱" />
        <Box title="Entity embeddings" detail="질문과 가까운 시작 entity 후보" />
        <Box title="Text unit mappings" detail="entity를 원문 d-17·d-22·d-31로 연결" />
        <Box title="Relationships" detail="context에 넣을 관계와 rank" />
      </div>
    </div>
  );
}

function LocalScene() {
  return (
    <div>
      <p className="border-l-2 border-primary pl-3 text-sm font-bold leading-6">
        q-882 · “tenant-a 사용자가 보고한 오류는 어디서 발생했나?”
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <Box title="Entity mapping" detail="tenant-a · U-42 후보" />
        <Arrow />
        <Box title="Mixed context" detail="entity · relationship · report · d-22" />
        <Arrow />
        <Box title="답변" detail="E401은 모바일 앱에서 발생했습니다." strong />
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        공식 구현은 네 자료 묶음을 각각 고른 뒤 하나의 context window에 넣습니다.
      </p>
    </div>
  );
}

function GlobalScene() {
  return (
    <div>
      <p className="border-l-2 border-primary pl-3 text-sm font-bold leading-6">
        q-883 · “이 자료 전체가 다루는 문제를 요약해줘.”
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <div className="grid gap-2">
          <Box title="Report C-A" detail="사용자 · 계정 · tenant" />
          <Box title="Report C-B" detail="오류 · 모바일 앱" />
        </div>
        <Arrow label="map" />
        <Box title="중간 point" detail="중요도 점수와 함께 후보 답을 생성" />
        <Arrow label="reduce" />
        <Box title="전체 답변" detail="계정 사용과 앱 오류 보고를 함께 요약" strong />
      </div>
    </div>
  );
}

function DriftScene() {
  return (
    <div>
      <p className="border-l-2 border-primary pl-3 text-sm font-bold leading-6">
        q-884 · “계정 문제와 오류가 어떻게 연결되나?”
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
        {[
          ["Primer", "관련 report 상위 K개로 넓은 답"],
          ["후속 질문", "사용자·오류 연결을 더 구체화"],
          ["Local 반복", "후속 질문별 entity·원문 수집"],
          ["결과 정렬", "질문·답 계층을 관련도 순으로 결합"],
        ].map(([title, detail], index) => (
          <div key={title} className={`relative ${index < 3 ? "sm:after:absolute sm:after:-right-2 sm:after:top-1/2 sm:after:text-primary sm:after:content-['→']" : ""}`}>
            <Box title={`${index + 1}. ${title}`} detail={detail} strong={index === 3} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BoundaryScene() {
  return (
    <div className="grid gap-px bg-border p-px sm:grid-cols-2">
      <section className="bg-background p-4">
        <p className="text-[10px] font-bold text-primary">v3.3.0 기본 경로</p>
        <h5 className="mt-2 text-sm font-bold">자료를 context로 조립</h5>
        <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
          entity embedding으로 시작점을 찾고, 연결된 record를 순위화해 token 예산까지 채웁니다.
          답의 관계 합성은 LLM이 수행합니다.
        </p>
      </section>
      <section className="bg-background p-4">
        <p className="text-[10px] font-bold text-muted-foreground">별도 구현이 필요한 경로</p>
        <h5 className="mt-2 text-sm font-bold">정확한 N-hop graph traversal</h5>
        <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
          시작 node, edge 방향, 최대 hop과 방문 규칙을 강제하려면 graph query나 custom
          context builder가 그 상태를 직접 소유해야 합니다.
        </p>
      </section>
    </div>
  );
}

const SCENES: readonly ReactNode[] = [
  <GraphScene key="graph" />,
  <IndexScene key="index" />,
  <LocalScene key="local" />,
  <GlobalScene key="global" />,
  <DriftScene key="drift" />,
  <BoundaryScene key="boundary" />,
];

export default function GraphragCommunityAndMultihopSearchViz() {
  const scenes = useAnimatedScenes(LABELS.length, 6400, { loop: false });

  return (
    <VizFrame
      eyebrow="GraphRAG · 전체 경로"
      title="kg-v43에 검색용 상태를 더하고, 질문 방식에 따라 다른 문맥을 만듭니다"
      description="같은 그래프를 쓰더라도 local은 entity 중심 자료를 모으고, global은 community report 전체를 종합하며, DRIFT는 report에서 후속 local 질문으로 내려갑니다."
      note="kg-v43과 q-882~884는 앞 글을 잇기 위한 설명용 사례입니다. 검색 경로와 기본 인자는 Microsoft GraphRAG v3.3.0 문서·소스를 기준으로 구분했습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Knowledge Graph에서 local, global, DRIFT 검색으로 이어지는 여섯 장면"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <h4 className="text-base font-bold text-foreground">{LABELS[scenes.active]}</h4>
          <span className="font-mono text-[10px] font-bold text-primary">
            {String(scenes.active + 1).padStart(2, "0")} / {String(LABELS.length).padStart(2, "0")}
          </span>
        </div>
        <div className="sm:hidden">{SCENES[scenes.active]}</div>
        <StableSceneStack active={scenes.active} scenes={SCENES} className="hidden sm:grid" />
        <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
          {NOTES[scenes.active]}
        </p>
        <StaticSceneList labels={LABELS} notes={NOTES} />
        <AnimatedSceneControls {...scenes} labels={LABELS} playLabel="전체 경로 재생" />
      </div>
    </VizFrame>
  );
}
