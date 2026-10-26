import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import type { ReactNode } from "react";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "목록",
    title: "검색어 하나와 순서가 있는 결과 세 개를 한 평가 단위로 묶습니다",
    note: "설명용 가정입니다. ‘서울 야간 소아과’의 결과 A·B·C에 관련도 3·0·2를 붙이고, 사용자가 보는 상위 세 칸을 평가합니다.",
  },
  {
    code: "판정",
    title: "점수를 계산하기 전에 새 문서의 관련도를 확인합니다",
    note: "후보 시스템이 1위에 올린 D는 아직 미판정입니다. D를 0점으로 간주하지 않고 추가 판정해 관련도 3을 얻은 뒤 두 시스템을 다시 채점합니다.",
  },
  {
    code: "채점",
    title: "첫 정답, 회수한 정답, 순서의 효용을 따로 계산합니다",
    note: "D 판정 뒤 기존 시스템은 관련 문서 세 개 중 A·C 두 개를, 후보 시스템은 D·A·C 세 개를 회수합니다. NDCG@3은 각각 0.658과 1.000입니다.",
  },
  {
    code: "집계",
    title: "질의별 점수를 어떤 사용자 집단으로 합칠지 정합니다",
    note: "후보 시스템은 자주 검색되는 질의에서 좋아지고 드문 질의에서 나빠졌습니다. 질의 종류별 평균은 0.816으로 낮지만 요청 횟수별 평균은 0.996으로 높습니다.",
  },
] as const;

function Panel({
  active,
  index,
  children,
}: {
  active: number;
  index: number;
  children: ReactNode;
}) {
  return (
    <section
      aria-current={active === index ? "step" : undefined}
      className={`${active === index ? "block border-primary" : "hidden border-border lg:block lg:opacity-45"} min-w-0 border-y py-4 transition-opacity`}
    >
      {children}
    </section>
  );
}

function ResultRow({
  rank,
  name,
  relevance,
}: {
  rank: number;
  name: string;
  relevance: string;
}) {
  return (
    <div className="grid grid-cols-[1.6rem_minmax(0,1fr)_3.5rem] items-center gap-2 border-b border-border py-2 text-xs last:border-b-0">
      <span className="font-mono text-[10px] text-muted-foreground">{rank}</span>
      <strong className="min-w-0 break-keep">{name}</strong>
      <span className="text-right font-mono text-[10px] text-primary">{relevance}</span>
    </div>
  );
}

export default function RankingMetricFlowViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, {
    autoPlay: false,
    loop: false,
  });
  const active = controls.reducedMotion ? scenes.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="한 검색 추적"
      title="결과 목록 하나가 서비스 평가 숫자가 되기까지"
      description="같은 검색 결과를 목록, 판정 범위, 질의별 채점, 사용자 집단 집계의 네 장면으로 추적합니다. 수치는 계산을 설명하기 위한 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="ranking-metric-flow"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex h-full min-h-0 min-w-0 flex-col border-y border-border/70 bg-background px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-5"
      >
        <div
          data-viz-live-only
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
        >
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 min-h-14 break-keep text-lg font-bold leading-7 sm:min-h-8">
            {scenes[active].title}
          </h3>

          <div className="mt-4 grid min-w-0 gap-5 lg:grid-cols-4">
            <Panel active={active} index={0}>
              <p className="text-[10px] font-black text-muted-foreground">검색 요청</p>
              <div className="mt-3 border-l-2 border-primary pl-3">
                <strong className="break-keep text-sm">서울 야간 소아과</strong>
                <p className="mt-1 text-[10px] text-muted-foreground">관찰 깊이 k = 3</p>
              </div>
              <div className="mt-4 border-y border-border">
                <ResultRow rank={1} name="A · 밤 10시 진료" relevance="rel 3" />
                <ResultRow rank={2} name="B · 낮 진료 안내" relevance="rel 0" />
                <ResultRow rank={3} name="C · 야간 진료 정보" relevance="rel 2" />
              </div>
            </Panel>

            <Panel active={active} index={1}>
              <p className="text-[10px] font-black text-muted-foreground">후보 시스템의 새 결과</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="border border-border px-3 py-3">
                  <span className="text-[10px] text-muted-foreground">판정 전</span>
                  <strong className="mt-2 block font-mono text-lg">D ?</strong>
                  <p className="mt-1 leading-5 text-muted-foreground">관련도 모름</p>
                </div>
                <div className="border border-primary px-3 py-3">
                  <span className="text-[10px] text-muted-foreground">추가 판정</span>
                  <strong className="mt-2 block font-mono text-lg">D 3</strong>
                  <p className="mt-1 leading-5 text-muted-foreground">직접 답변</p>
                </div>
              </div>
              <p className="mt-4 break-keep text-xs font-bold leading-5 text-primary">
                판정 집합을 먼저 확정한 뒤 점수를 계산합니다.
              </p>
            </Panel>

            <Panel active={active} index={2}>
              <p className="text-[10px] font-black text-muted-foreground">판정 뒤 질의별 점수</p>
              <div className="mt-3 space-y-3 text-xs">
                <div className="border-l-2 border-primary pl-3">
                  <strong>기존 · RR 1 · Recall@3 2/3</strong>
                  <p className="mt-1 text-muted-foreground">NDCG@3 0.658</p>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <strong>후보 · RR 1 · Recall@3 3/3</strong>
                  <p className="mt-1 text-muted-foreground">NDCG@3 1.000</p>
                </div>
              </div>
            </Panel>

            <Panel active={active} index={3}>
              <p className="text-[10px] font-black text-muted-foreground">질의 종류별 · 요청 횟수별</p>
              <div className="mt-3 border-y border-border text-xs">
                <div className="grid grid-cols-[minmax(0,1fr)_3rem_3rem] gap-2 border-b border-border py-3">
                  <strong>기존</strong>
                  <span className="font-mono">.829</span>
                  <span className="text-right font-mono">.661</span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_3rem_3rem] gap-2 py-3">
                  <strong>후보</strong>
                  <span className="font-mono">.816</span>
                  <span className="text-right font-mono text-primary">.996</span>
                </div>
              </div>
              <p className="mt-4 break-keep text-xs font-bold leading-5 text-primary">
                어떤 사용자를 대표하는지에 따라 승자가 달라집니다.
              </p>
            </Panel>
          </div>

          <div className="mt-5 hidden grid-cols-4 gap-2 lg:grid">
            {scenes.map((scene, index) => (
              <section
                key={scene.code}
                aria-current={index === active ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-3 ${
                  index === active
                    ? "border-primary bg-primary/5"
                    : index < active
                      ? "border-primary/55"
                      : "border-border text-muted-foreground"
                }`}
              >
                <p className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 break-keep text-xs font-bold leading-5">{scene.code}</p>
              </section>
            ))}
          </div>

          <p className="mt-4 min-h-20 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-16">
            {scenes[active].note}
          </p>
        </div>

        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={scenes.map((scene) => scene.code)}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
