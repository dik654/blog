import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["입력 고정", "Registry", "Gas 경계", "Vector", "Backend", "장애", "Rollback"] as const;
const NOTES = [
  "Base와 candidate에 Reth tag·commit, revm versions·features, ChainSpec digest, fork, raw call corpus와 장비 조건을 고정합니다.",
  "Homestead부터 Osaka까지 Spec별 address set과 implementation identity를 대조합니다. 주소가 빠지거나 일찍 활성화되면 바로 실패입니다.",
  "각 입력을 exact cost−1, exact cost, exact cost+1 gas에서 실행해 status·gas used·output bytes를 비교합니다.",
  "정상·경계·malformed input을 protocol fixture와 upstream test vector에 재생합니다. Correctness가 맞은 뒤에만 성능을 봅니다.",
  "가능한 backend를 독립 process에서 실행해 같은 bytes·status·gas를 내는지 확인합니다. Collector는 결과를 고치지 않습니다.",
  "Panic·provider error·중단·재시작에서 partial output이나 잘못된 성공이 노출되지 않는지 확인하고 run receipt를 보존합니다.",
  "Candidate를 격리하고 binary·dependencies·features·ChainSpec·config를 baseline으로 되돌린 뒤 전체 corpus를 다시 통과해야 복구가 끝납니다.",
] as const;

function Gate({ title, body, state }: { title: string; body: string; state: "idle" | "active" | "done" | "warn" }) {
  const tone = state === "active" ? "border-primary text-primary" : state === "done" ? "border-primary/35" : state === "warn" ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : "border-border text-muted-foreground";
  return <div className={`min-w-0 border bg-background p-3 ${tone}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span></div>;
}

export default function RethPrecompilesValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9800, { loop: false });
  const active = scenes.active;
  const gates = [
    ["MANIFEST", "release·deps·features·fork"],
    ["REGISTRY", "spec별 address·implementation"],
    ["GAS", "cost−1 · cost · cost+1"],
    ["VECTOR", "정상·경계·malformed bytes"],
    ["BACKEND", "status·gas·output parity"],
    ["FAULT", "panic·restart·partial result"],
    ["ROLLBACK", "baseline 전체 재생"],
  ] as const;

  return (
    <VizFrame
      eyebrow="실무 경로 · Precompile 변경 검증"
      title="정확성·장애·rollback이 같은 run receipt에 남아야 합니다"
      description="Base와 candidate를 독립 실행하고, 한 경계씩 비교한 뒤에만 성능을 측정합니다."
      note="대상 환경의 처리량과 복구 시간은 아직 측정하지 않았습니다. 화면의 절차는 격리한 test node용입니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only data-reth-precompiles-validation-scene={active} tabIndex={0} role="group" aria-label="Precompile 변경을 registry, gas, vector, backend, 장애와 rollback에서 검증하는 일곱 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-px bg-border p-px" aria-label="Precompile 변경 검증 전체 단계">
            {gates.map(([title], index) => (
              <div key={title} className={`min-w-0 bg-background py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <div className={`mt-2 border bg-background p-3 ${active === 5 ? "border-amber-500/70" : "border-primary"}`}>
            <strong className="block text-sm">{gates[active][0]}</strong>
            <span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{gates[active][1]}</span>
          </div>
        </div>
        <div className="hidden gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-7">
          {gates.map(([title, body], index) => <Gate key={title} title={title} body={body} state={index === active ? (index === 5 ? "warn" : "active") : index < active ? "done" : "idle"} />)}
        </div>
        <section className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border border-border bg-background p-3 sm:min-h-[11rem] sm:gap-3 sm:p-4">
          <div className="min-w-0 border border-border p-2 sm:p-3"><span className="font-mono text-[9px] font-black text-muted-foreground">BASE</span><strong className="mt-2 block break-keep text-xs sm:text-sm">고정한 기준 구현</strong><span className="mt-1 block break-words text-[9px] leading-4 text-muted-foreground sm:text-[10px]">run_id · input hash · result receipt</span></div>
          <div className="text-center font-mono text-[10px] font-black text-primary">{active < 6 ? "대조" : "복구"}</div>
          <div className={`min-w-0 border p-2 sm:p-3 ${active === 5 ? "border-amber-500/70" : "border-primary/45"}`}><span className="font-mono text-[9px] font-black text-muted-foreground">CANDIDATE</span><strong className="mt-2 block break-keep text-xs sm:text-sm">{active === 5 ? "격리·증거 보존" : active === 6 ? "Baseline으로 rollback" : "같은 입력 독립 실행"}</strong><span className="mt-1 block break-words text-[9px] leading-4 text-muted-foreground sm:text-[10px]">{active < 4 ? "증거 수집 중" : active === 4 ? "status·gas·bytes 판정" : active === 5 ? "잘못된 성공 금지" : "전체 corpus 재통과"}</span></div>
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["입력", "주소", "Gas", "Vector", "Backend", "장애", "복구"]} playLabel="검증 절차 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
