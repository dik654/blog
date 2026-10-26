import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["실행 결과", "저장 위치 분류", "세 저장소 준비", "순서대로 확정", "중단 뒤 재조정", "한 시점으로 읽기"] as const;
const NOTES = [
  "실행이 끝난 블록 1,000은 영수증·송신자·account/storage changeset, 과거 조회 index, canonical state와 stage checkpoint를 함께 만듭니다.",
  "StorageSettings V2는 순차 immutable history를 static files, history·lookup index를 RocksDB, canonical state와 공개 checkpoint를 MDBX로 보냅니다.",
  "세 backend는 각자 segment, write batch, write transaction을 준비합니다. 아직 MDBX가 999를 가리키므로 독자가 보는 persistent frontier도 999입니다.",
  "정상 commit은 static files finalize, RocksDB batches, MDBX transaction 순서입니다. 마지막 MDBX commit 뒤에야 블록 1,000이 persistent view에 공개됩니다.",
  "MDBX commit 전에 멈추면 static files와 RocksDB가 1,000까지 앞설 수 있습니다. 재시작은 MDBX의 999 checkpoint를 기준으로 앞선 자료를 prune해 mixed view를 막습니다.",
  "Provider는 in-memory head를 먼저 capture하고 DB snapshot을 엽니다. Memory overlap을 우선하고 MDBX-visible tip 안에서 세 저장소를 조합해 한 query가 같은 chain frontier만 읽습니다.",
] as const;

const Store = ({ title, state, detail, active = false }: { title: string; state: string; detail: string; active?: boolean }) => (
  <div className={`min-w-0 border bg-background p-3 ${active ? "border-primary" : "border-border"}`}>
    <span className="text-[9px] font-bold text-muted-foreground">{title}</span>
    <strong className={`mt-2 block break-keep text-sm ${active ? "text-primary" : ""}`}>{state}</strong>
    <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
  </div>
);

export default function RethStorageV2Viz() {
  const scenes = useAnimatedScenes(SCENES.length, 6800, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · 블록 1,000 저장"
      title="세 저장소는 순서대로 전진하고 MDBX가 공개 지점을 정합니다"
      description="한 블록의 결과가 분류되고 저장되고, 중간 종료 뒤 다시 한 시점으로 맞춰지는 과정을 따라갑니다."
      note="Block 번호와 자료 값은 흐름을 설명하는 식별자입니다. Backend route와 commit·repair 순서는 Reth v2.8.1 source에 귀속합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only data-reth-storage-scene={active} tabIndex={0} role="group" aria-label="Reth Storage V2가 블록 결과를 세 저장소에 순서대로 기록하고 복구하는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">
          {SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}
        </div>

        <section className="mt-3 min-h-[20rem] border border-border bg-background p-3 sm:min-h-[17rem] sm:p-5" aria-label="현재 Reth 저장 상태">
          {active === 0 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="border border-primary p-4 text-center"><span className="text-[9px] font-bold text-muted-foreground">EXECUTED BLOCK</span><strong className="mt-2 block text-2xl">1,000</strong></div><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3">{["receipts · senders", "account/storage changes", "history indices", "canonical state", "headers · metadata", "stage checkpoints"].map((item) => <div key={item} className="bg-background p-3 text-center text-[10px] font-bold leading-4">{item}</div>)}</div></div> : null}
          {active === 1 ? <div className="grid min-h-[14rem] content-center gap-3 md:grid-cols-3"><Store title="STATIC FILES" state="순차 immutable history" detail="receipts · senders · changesets" active /><Store title="ROCKSDB" state="history · lookup index" detail="tx hash numbers · account/storage history" active /><Store title="MDBX" state="canonical state · checkpoint" detail="독자에게 공개할 persistent frontier" active /></div> : null}
          {active === 2 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid gap-3 md:grid-cols-3"><Store title="STATIC FILES" state="segment 1,000 준비" detail="pending finalize" active /><Store title="ROCKSDB" state="batch 1,000 준비" detail="아직 uncommitted" active /><Store title="MDBX" state="tx 1,000 준비" detail="아직 visible tip 999" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">준비 상태 ≠ 독자에게 공개된 체인</p></div> : null}
          {active === 3 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-2"><Store title="01" state="Static finalize" detail="segment sync" active /><span className="self-center font-black text-primary">→</span><Store title="02" state="RocksDB commit" detail="pending batches" active /><span className="self-center font-black text-primary">→</span><Store title="03" state="MDBX commit" detail="visible tip 1,000" active /></div><p className="border-y border-primary/50 py-3 text-center text-xs font-bold text-primary">마지막 MDBX commit 뒤 persistent frontier = 1,000</p></div> : null}
          {active === 4 ? <div className="grid min-h-[14rem] content-center gap-4"><div className="grid gap-3 md:grid-cols-3"><Store title="STATIC FILES" state="1,000 · ahead" detail="MDBX 999까지 truncate" /><Store title="ROCKSDB" state="1,000 · ahead" detail="stale index prune" /><Store title="MDBX" state="999 · visible" detail="복구 기준 checkpoint" active /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center"><strong className="border border-amber-500/70 p-3 text-xs">중단 직후 · 1,000 / 1,000 / 999</strong><span className="font-black text-primary">→</span><strong className="border border-primary p-3 text-xs">재조정 · 999 / 999 / 999</strong></div></div> : null}
          {active === 5 ? <div className="grid min-h-[14rem] content-center gap-4"><div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] sm:items-center"><Store title="MEMORY" state="head 먼저 capture" detail="아직 DB에 flush되지 않은 canonical overlap" active /><span className="hidden font-black text-primary sm:block">→</span><div className="grid gap-2 sm:grid-cols-3"><Store title="STATIC" state="history" detail="tip 안의 range" /><Store title="ROCKS" state="index" detail="tip으로 제한" /><Store title="MDBX" state="snapshot" detail="visible tip" active /></div></div><p className="border-y border-border py-3 text-center text-xs font-bold">Memory overlap 우선 + 같은 DB snapshot = 한 query의 한 chain frontier</p></div> : null}
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["결과", "분류", "준비", "확정", "복구", "읽기"]} playLabel="Reth 저장 흐름 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
