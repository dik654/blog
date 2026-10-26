import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "기준선",
    title: "먼저 단일 agent의 결과를 기준선으로 남깁니다",
    note: "같은 입력·도구·모델·검증 기준에서 60분, 10달러, 품질 0.80이었다고 가정합니다. 이 기준선이 없으면 agent를 늘린 효과를 분리할 수 없습니다.",
  },
  {
    code: "분리",
    title: "서로 독립적인 세 작업만 worker에게 나눕니다",
    note: "자료 조사, 변경 분석, 정책 검토는 서로 다른 context와 artifact owner를 가집니다. 작업 ID와 input snapshot은 분리 전에 고정합니다.",
  },
  {
    code: "결과",
    title: "각 worker는 답변이 아니라 검증 가능한 receipt를 냅니다",
    note: "Receipt에는 task ID, input hash, artifact URI·checksum, 근거, 검증 결과, 불확실성, 재시도 key가 함께 들어갑니다.",
  },
  {
    code: "합류",
    title: "필수 결과·충돌·전체 검사를 모두 통과해야 완료됩니다",
    note: "세 receipt가 모두 있어도 같은 artifact의 checksum이 다르거나 전체 test가 실패하면 publish하지 않습니다. 실패한 task만 재시도하거나 사람에게 넘깁니다.",
  },
] as const;

const workers = [
  { id: "t-01", label: "자료 조사", artifact: "sources.json", checksum: "8b2" },
  { id: "t-02", label: "변경 분석", artifact: "diff-report.json", checksum: "a41" },
  { id: "t-03", label: "정책 검토", artifact: "policy-verdict.json", checksum: "c07" },
] as const;

function WorkerRow({
  worker,
  active,
}: {
  worker: (typeof workers)[number];
  active: number;
}) {
  const assigned = active >= 1;
  const returned = active >= 2;

  return (
    <div className="grid min-w-0 grid-cols-[3.1rem_minmax(0,.8fr)_minmax(0,1.2fr)] items-center gap-2 border-b border-border py-3 last:border-b-0">
      <span className="font-mono text-[10px] font-black text-primary">
        {worker.id}
      </span>
      <span className={`break-keep text-xs font-bold ${assigned ? "text-foreground" : "text-muted-foreground"}`}>
        {worker.label}
      </span>
      <span className={`min-w-0 break-all font-mono text-[10px] leading-4 ${returned ? "text-foreground" : "text-muted-foreground/55"}`}>
        {returned ? `${worker.artifact}@${worker.checksum}` : assigned ? "실행 중" : "미할당"}
      </span>
    </div>
  );
}

export default function MultiAgentRequestFlowViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, {
    autoPlay: false,
    loop: false,
  });
  const active = controls.reducedMotion ? scenes.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="한 요청 추적"
      title="작업을 나누고 receipt로 다시 합칩니다"
      description="배포 후보 하나를 세 worker가 검토한다고 가정하고, 기준선부터 완료 판정까지 따라갑니다. 시간·비용·품질 수치는 설명용 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="multi-agent-request-flow"
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

          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)_minmax(0,.85fr)] lg:items-stretch">
            <section className={`${active === 0 ? "block" : "hidden"} border-y border-border py-4 lg:block`}>
              <p className="text-[10px] font-black text-muted-foreground">요청 · RELEASE-42</p>
              <p className="mt-2 break-keep text-sm font-bold leading-6">배포 후보의 근거·변경·정책을 검사합니다</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <dt className="text-[9px] text-muted-foreground">시간</dt>
                  <dd className="mt-1 text-sm font-bold">60분</dd>
                </div>
                <div>
                  <dt className="text-[9px] text-muted-foreground">비용</dt>
                  <dd className="mt-1 text-sm font-bold">$10</dd>
                </div>
                <div>
                  <dt className="text-[9px] text-muted-foreground">품질</dt>
                  <dd className="mt-1 text-sm font-bold">0.80</dd>
                </div>
              </dl>
              <p className="mt-4 text-[10px] leading-4 text-muted-foreground">input sha256: 71f… · 동일 검증 기준</p>
            </section>

            <section className={`${active === 1 || active === 2 ? "block" : "hidden"} border-y py-2 transition-colors duration-200 lg:block ${active >= 1 ? "border-primary/55" : "border-border"}`}>
              <div className="flex items-center justify-between gap-3 py-2">
                <span className="text-[10px] font-black text-muted-foreground">작업 결과 · RECEIPT</span>
                <strong className="text-[10px] text-primary">
                  {active < 1 ? "0/3" : active < 2 ? "실행 중" : "3/3"}
                </strong>
              </div>
              {workers.map((worker) => (
                <WorkerRow key={worker.id} worker={worker} active={active} />
              ))}
            </section>

            <section className={`${active >= 3 ? "block" : "hidden"} border-y py-4 transition-colors duration-200 lg:block ${active >= 3 ? "border-primary" : "border-border"}`}>
              <p className="text-[10px] font-black text-muted-foreground">합류 판정</p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  ["필수 receipt", active >= 2],
                  ["파일 식별값 충돌 없음", active >= 3],
                  ["전체 validator", active >= 3],
                ].map(([label, passed]) => (
                  <div key={String(label)} className="flex items-center justify-between gap-3 border-b border-border pb-2">
                    <span className="break-keep text-muted-foreground">{label}</span>
                    <strong className={passed ? "text-primary" : "text-muted-foreground/50"}>
                      {passed ? "통과" : "대기"}
                    </strong>
                  </div>
                ))}
              </div>
              <p className={`mt-4 break-keep text-sm font-bold ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                {active >= 3 ? "완료 · publish 가능" : "아직 완료 아님"}
              </p>
            </section>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {scenes.map((scene, index) => (
              <section
                key={scene.code}
                aria-current={index === active ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-3 transition-colors duration-200 ${
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
          controlLabels={labels}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
