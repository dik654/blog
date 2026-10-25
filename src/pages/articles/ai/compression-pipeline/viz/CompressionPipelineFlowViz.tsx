import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    short: "기준",
    title: "배포 기준과 baseline을 고정합니다.",
    note: "그림의 값은 설명용입니다. 실제 limit은 대상 환경에서 정합니다.",
  },
  {
    short: "후보",
    title: "병목을 직접 바꾸는 후보만 남깁니다.",
    note: "Weight resident와 dense graph 병목을 가정해 A·B·A+B를 비교합니다.",
  },
  {
    short: "빌드",
    title: "구조 변경 뒤 다시 build합니다.",
    note: "각 단계는 입력·출력 digest와 data manifest를 다음 단계에 넘깁니다.",
  },
  {
    short: "검증",
    title: "같은 workload에서 gate를 확인합니다.",
    note: "A+B의 설명용 결과는 loss 0.5, memory 7GB, p95 7ms입니다.",
  },
  {
    short: "승인",
    title: "통과 digest만 배포하고 실패하면 복귀합니다.",
    note: "Canary가 실패하면 이전 digest로 돌아가고 receipt는 근거로 남깁니다.",
  },
] as const;

const CANDIDATES = [
  { id: "baseline", label: "Baseline", loss: "0.0", memory: "12GB", p95: "10ms" },
  { id: "a", label: "A · 양자화", loss: "0.3", memory: "8GB", p95: "8ms" },
  { id: "b", label: "B · 가지치기", loss: "0.4", memory: "10GB", p95: "9ms" },
  { id: "ab", label: "A+B", loss: "0.5", memory: "7GB", p95: "7ms" },
] as const;

function PipelineDiagram({ active }: { active: number }) {
  const built = active >= 2;
  const verified = active >= 3;
  const released = active >= 4;

  return (
    <div className="grid gap-2 xl:grid-cols-[minmax(0,.8fr)_minmax(0,1.5fr)_minmax(0,.9fr)] xl:items-stretch xl:gap-4">
      <section className="grid grid-cols-[auto_1fr] items-center gap-3 border-t-2 border-primary px-2 py-1.5 xl:block xl:px-3 xl:py-3" aria-label="배포 기준">
        <p className="text-[10px] font-black text-primary">배포 기준 · 설명용</p>
        <dl className="grid grid-cols-3 gap-2 xl:mt-3 xl:grid-cols-1">
          {[
            ["Quality loss", "≤ 0.5"],
            ["Memory", "≤ 7GB"],
            ["p95", "≤ 9ms"],
          ].map(([label, value]) => (
            <div key={label} className="border-l border-border pl-2 xl:py-1">
              <dt className="hidden break-keep text-[10px] text-muted-foreground sm:block">{label}</dt>
              <dd className="font-mono text-xs font-bold sm:mt-1 sm:text-sm">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 hidden text-[11px] leading-5 text-muted-foreground xl:block">
          같은 hardware·engine·요청 분포에서 비교
        </p>
      </section>

      <section className="border-y border-border px-2 py-2 xl:px-3 xl:py-3" aria-label="후보 artifact 벤치">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black text-primary">후보 벤치</p>
            <p className="mt-1 hidden text-xs text-muted-foreground xl:block">
              단일 stage와 결합 후보를 같은 행 규칙으로 기록
            </p>
          </div>
          <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground xl:inline">
            receipt
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1 xl:mt-3 xl:grid-cols-2 xl:gap-2">
          {CANDIDATES.map((candidate) => {
            const isCombined = candidate.id === "ab";
            const isActive = isCombined && active >= 2;
            const failed = verified && candidate.memory !== "7GB";
            return (
              <div
                key={candidate.id}
                className={`min-w-0 border-l-2 px-2 py-2 transition-colors xl:px-3 ${
                  released && isCombined
                    ? "border-primary bg-primary/10"
                    : failed
                      ? "border-destructive/60 text-muted-foreground"
                      : isActive
                        ? "border-primary bg-primary/5"
                        : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="break-keep text-[10px] leading-4 xl:text-xs">{candidate.label}</strong>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    <span className="xl:hidden" aria-hidden>
                      {released && isCombined ? "✓" : failed ? "×" : built && isCombined ? "●" : "○"}
                    </span>
                    <span className="hidden xl:inline">
                      {released && isCombined
                        ? "RELEASE"
                        : failed
                          ? "MEMORY FAIL"
                          : built && isCombined
                            ? "BUILT"
                            : "CANDIDATE"}
                    </span>
                  </span>
                </div>
                <div className="mt-1 grid font-mono text-[8px] leading-4 xl:mt-2 xl:grid-cols-3 xl:gap-1 xl:text-[10px]">
                  <span className="xl:hidden">Δq {candidate.loss}</span>
                  <span className="xl:hidden">M {candidate.memory.replace("GB", "G")}</span>
                  <span className="xl:hidden">p95 {candidate.p95}</span>
                  <span className="hidden xl:inline">Δq {candidate.loss}</span>
                  <span className="hidden xl:inline">{candidate.memory}</span>
                  <span className="hidden xl:inline">{candidate.p95}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[9px] text-muted-foreground xl:mt-3 xl:text-[10px]">
          <span className={`h-px flex-1 ${built ? "bg-primary" : "bg-border"}`} />
          <span>{built ? "구조 → 회복 → calibration → build" : "아직 build 전"}</span>
          <span className={`h-px flex-1 ${verified ? "bg-primary" : "bg-border"}`} />
        </div>
      </section>

      <section className="grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-center gap-3 border-t-2 border-border px-2 py-1.5 xl:block xl:px-3 xl:py-3" aria-label="승인 기록">
        <div className="flex items-center gap-2 xl:block">
          <p className="text-[10px] font-black text-primary">Release pointer</p>
          <div className="border-l border-border pl-2 xl:mt-3 xl:border xl:px-3 xl:py-3">
            <p className="hidden text-[10px] text-muted-foreground xl:block">현재 digest</p>
            <p className="whitespace-nowrap font-mono text-[9px] font-bold xl:mt-1 xl:text-sm">
              {released ? "artifact-ab" : "baseline"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] content-start gap-x-2 gap-y-1 text-[10px] leading-4 xl:mt-3 xl:gap-x-3 xl:gap-y-2 xl:text-[11px] xl:leading-5">
          <span className="text-muted-foreground">완료 증거</span>
          <strong>{released ? "gate receipt + canary" : "baseline receipt"}</strong>
          <span className="text-muted-foreground">실패 시</span>
          <strong>이전 digest로 복귀</strong>
        </div>
      </section>
    </div>
  );
}

export default function CompressionPipelineFlowViz() {
  const labels = SCENES.map((scene) => `${scene.short}: ${scene.title}`);
  const notes = SCENES.map((scene) => scene.note);
  const controlLabels = SCENES.map((scene) => scene.short);
  const controls = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? SCENES.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="실무 경로 · 제안된 검증 계약 [A]"
      title="한 후보가 목표 고정부터 승인·롤백까지 지나가는 경로"
      description="왼쪽의 배포 기준, 가운데의 같은 후보 벤치, 오른쪽의 release pointer를 고정해 두고 상태만 바꿉니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="compression-pipeline-flow"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 border-y border-border/70 bg-background px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 xl:px-6 xl:py-6"
      >
        <div data-viz-live-only>
          <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 min-h-10 break-keep text-base font-bold leading-5 sm:mt-2 sm:min-h-[2.5rem] sm:text-lg sm:leading-7">
            {SCENES[active].title}
          </h3>
          <div className="mt-3 xl:mt-4">
            <PipelineDiagram active={active} />
          </div>
          <p className="mt-2 min-h-10 border-l border-primary/50 pl-3 text-[11px] leading-4 text-muted-foreground sm:mt-3 sm:pl-4 sm:text-xs sm:leading-5 xl:mt-4 xl:min-h-[3.5rem] xl:text-sm xl:leading-6">
            {SCENES[active].note}
          </p>
        </div>
        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={controlLabels}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden xl:!pt-3 xl:[&_[data-viz-desktop-controls]]:flex xl:[&_[data-viz-mobile-controls]]:hidden xl:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
