import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["목표와 출발점", "Stage 순서", "Batch 계산", "저장과 checkpoint", "다음 stage 전달", "역순 unwind"] as const;
const NOTES = [
  "과거 블록 100부터 250까지 채워야 하고 현재 stage checkpoint는 99라고 가정합니다. Pipeline은 151개 블록을 한 번에 처리하지 않고 stage별 유한 범위로 나눕니다.",
  "기본 stage set은 입력 확보, 실행 자료 파생, state commitment 확인, index·prune·finish 순서로 흐릅니다. 뒤 stage는 앞 stage가 저장한 checkpoint보다 멀리 갈 수 없습니다.",
  "Checkpoint 99, target 250, threshold 64라면 다음 범위는 100..163입니다. 이어서 164..227, 마지막으로 228..250을 처리합니다.",
  "Stage는 범위의 output을 쓴 뒤 같은 read-write provider transaction에 checkpoint 163을 저장하고 commit합니다. 시도한 범위나 메모리 진행률은 checkpoint가 아닙니다.",
  "현재 stage가 완료되면 다음 stage의 target은 바로 앞 stage의 checkpoint가 됩니다. 그래서 각 stage의 frontier는 서로 다를 수 있지만 의존 순서를 거슬러 앞서가지는 않습니다.",
  "Reorg나 잘못된 suffix로 140까지 돌아가야 하면 실행 순서의 반대로 stage를 unwind합니다. 각 stage는 140 이후 output과 checkpoint를 함께 되돌린 뒤 새 branch를 다시 실행합니다.",
] as const;

function Cell({ title, body, active = false, warn = false }: { title: string; body: string; active?: boolean; warn?: boolean }) {
  const tone = active ? "border-primary text-primary" : warn ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : "border-border";
  return <div className={`min-w-0 border bg-background p-3 ${tone}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span></div>;
}

export default function RethPipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7200, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame eyebrow="개념 경로 · checkpoint 99에서 block 250까지" title="각 stage가 유한한 범위를 저장하고 checkpoint를 넘깁니다" description="한 stage의 batch 실행부터 다음 stage의 target, reorg 때 역순 되감기까지 하나의 상태 변화로 추적합니다." note="99·250·64는 설명용 가정입니다. Stage 순서와 execute·checkpoint·commit·unwind 경계는 Reth v2.8.1 source에 귀속합니다." canvasClassName="px-2 py-2 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only data-reth-pipeline-scene={active} tabIndex={0} role="group" aria-label="Reth Pipeline이 stage별 batch와 checkpoint로 과거 블록을 처리하고 역순으로 되감는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">{SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}</div>
        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Cell title="DURABLE CHECKPOINT" body="마지막 저장 block 99" active /><span className="font-black text-primary">→</span><Cell title="PIPELINE TARGET" body="과거 block 250" active /></div><p className="border-y border-border py-3 text-center text-xs font-bold">다음 미완료 block 100 · 남은 범위 100..250</p></div> : null}
          {active === 1 ? <div className="grid min-h-[15rem] content-center gap-2"><div className="grid grid-cols-2 gap-2 lg:grid-cols-4"><Cell title="입력 확보" body="ERA1? → Headers → Bodies" active /><Cell title="실행 파생" body="Senders → Execution → sender prune" /><Cell title="상태 commitment" body="Merkle unwind → account/storage hashing → Merkle execute" /><Cell title="조회·보존" body="Tx lookup → history → prune → finish" /></div><p className="border-y border-primary/40 py-3 text-center text-xs font-bold text-primary">뒤 stage target ≤ 바로 앞 stage checkpoint</p></div> : null}
          {active === 2 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-3 gap-2"><Cell title="BATCH 1" body="100..163 · 64 blocks" active /><Cell title="BATCH 2" body="164..227 · 64 blocks" /><Cell title="BATCH 3" body="228..250 · 23 blocks" /></div><div className="border-y border-border py-3 text-center font-mono text-xs">start = 99 + 1 · end = min(250, 99 + 64) = 163</div></div> : null}
          {active === 3 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><Cell title="EXECUTE" body="100..163 output 작성" /><span className="hidden self-center font-black text-primary sm:block">→</span><Cell title="SAVE CHECKPOINT" body="stage = 163" active /><span className="hidden self-center font-black text-primary sm:block">→</span><Cell title="COMMIT" body="한 provider transaction" active /></div><p className="border-y border-border py-3 text-center text-xs font-bold">Commit 실패 → output과 checkpoint 모두 공개하지 않음</p></div> : null}
          {active === 4 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Cell title="Headers" body="checkpoint 250" /><Cell title="Bodies" body="checkpoint 227" active /><Cell title="Senders" body="target 227 · current 180" /><Cell title="Execution" body="target 180 · current 163" /></div><p className="border-y border-primary/40 py-3 text-center text-xs font-bold text-primary">Stage마다 frontier는 다르지만 dependency를 넘지는 않습니다</p></div> : null}
          {active === 5 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-2 gap-2 sm:grid-cols-5"><Cell title="Merkle" body="250 → 140" warn /><Cell title="Execution" body="250 → 140" warn /><Cell title="Senders" body="250 → 140" /><Cell title="Bodies" body="250 → 140" /><Cell title="Headers" body="250 → 140" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">소비자부터 역순 삭제·checkpoint 저장·commit → 새 branch forward</p></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["출발", "순서", "범위", "Commit", "전달", "Unwind"]} playLabel="Pipeline 흐름 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
