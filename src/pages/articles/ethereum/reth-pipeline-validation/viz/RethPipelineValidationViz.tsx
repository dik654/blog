import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["조건 고정", "기준선 생성", "Commit 경계 종료", "잘못된 입력·reorg", "격리·복구", "증거로 결정"] as const;
const NOTES = [
  "Reth v2.8.1과 source SHA, stage set, prune 설정, chain fixture, database snapshot과 장비 조건을 하나의 run ID에 고정합니다.",
  "오류가 없는 기준 구현에서 stage별 output digest, checkpoint, state root와 종료 시점을 기록합니다. 이 자료가 candidate의 비교 기준입니다.",
  "Stage execute 전, output·checkpoint 저장 뒤 commit 전, commit 직후에 process를 종료합니다. 재시작 후 output과 checkpoint가 서로 다른 range를 가리키면 실패입니다.",
  "누락 body, 잘못된 sender와 root mismatch를 넣고 250에서 140으로 reorg합니다. 오류가 downstream stage로 조용히 넘어가거나 unwind 뒤 stale output이 남으면 실패입니다.",
  "불일치를 발견하면 candidate sync를 중지하고 database, stage checkpoints와 logs를 보존합니다. 기준 snapshot 또는 이전 binary로 되돌린 뒤 전체 range를 다시 대조합니다.",
  "정확성, restart와 rollback을 통과한 run에서만 blocks/s, CPU, I/O와 RTO를 비교합니다. 대상 환경 측정 전 결정 상태는 proposed입니다.",
] as const;

function Cell({ title, body, tone = "plain" }: { title: string; body: string; tone?: "plain" | "active" | "warn" }) {
  const style = tone === "active" ? "border-primary text-primary" : tone === "warn" ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : "border-border";
  return <div className={`min-w-0 border bg-background p-3 ${style}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span></div>;
}

export default function RethPipelineValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7200, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame eyebrow="실무 경로 · Pipeline 변경 검증" title="같은 fixture를 commit과 unwind 경계에서 멈춰 결과를 대조합니다" description="정상 처리량보다 먼저 output·checkpoint·state root가 중단과 복구 뒤에도 같은지 확인합니다." note="화면은 실험 순서를 설명합니다. 대상 환경의 성능·복구 측정값은 아직 없습니다." canvasClassName="px-2 py-2 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only data-reth-pipeline-validation-scene={active} tabIndex={0} role="group" aria-label="Reth Pipeline 변경을 commit과 unwind 경계에서 검증하고 복구하는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">{SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}</div>
        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[15rem] content-center gap-2 sm:grid-cols-3"><Cell title="SOURCE" body="v2.8.1 · d763342…" tone="active" /><Cell title="PIPELINE" body="stage set · thresholds · prune" tone="active" /><Cell title="FIXTURE" body="blocks 100..250 · DB snapshot" tone="active" /></div> : null}
          {active === 1 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Cell title="OUTPUT" body="table·file digest" /><Cell title="CHECKPOINT" body="stage별 block" /><Cell title="ROOT" body="state root·receipts" /><Cell title="EVENT" body="error·commit order" /></div><p className="border-y border-primary/40 py-3 text-center text-xs font-bold text-primary">기준 구현의 golden receipt</p></div> : null}
          {active === 2 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-3 gap-2"><Cell title="A · EXECUTE 전" body="checkpoint 99" /><Cell title="B · COMMIT 전" body="transaction 미공개" tone="warn" /><Cell title="C · COMMIT 직후" body="output·checkpoint 163" tone="active" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">재시작 결과는 99 또는 163 · 서로 섞인 상태는 허용하지 않음</p></div> : null}
          {active === 3 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid gap-2 sm:grid-cols-2"><Cell title="INVALID INPUT" body="missing body · bad sender · root mismatch" tone="warn" /><Cell title="REORG 250 → 140" body="reverse unwind · new branch forward" tone="warn" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">첫 오류에서 checkpoint 정지 · unwind 뒤 140 이후 stale output 0</p></div> : null}
          {active === 4 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5">{[["발견", "parity fail"], ["격리", "sync off"], ["보존", "DB·logs"], ["복구", "snapshot/rollback"], ["재진입", "full parity"]].map(([a,b], index) => <Cell key={a} title={a} body={b} tone={index === 0 ? "warn" : index === 4 ? "active" : "plain"} />)}</div><p className="text-center text-xs text-muted-foreground">운영 장비에 fault를 주입하지 않고 격리한 사본에서만 실행</p></div> : null}
          {active === 5 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4"><Cell title="정확성" body="output·checkpoint·root" /><Cell title="복구" body="restart·unwind·rollback" /><Cell title="비용" body="blocks/s·CPU·I/O" /><Cell title="서비스" body="sync RTO·catch-up lag" /></div><div className="grid grid-cols-3 gap-px bg-border p-px"><Cell title="STATUS" body="proposed" /><Cell title="채택" body="모든 gate 통과" tone="active" /><Cell title="기각" body="mixed range 1건" tone="warn" /></div></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["조건", "기준선", "중단", "장애", "복구", "결정"]} playLabel="Pipeline 검증 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
