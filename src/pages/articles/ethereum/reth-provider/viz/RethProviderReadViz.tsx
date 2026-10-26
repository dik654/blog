import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["요청 고정", "상태 종류 선택", "Snapshot 열기", "Overlay 만들기", "Key별 읽기", "같은 시점 반환"] as const;
const NOTES = [
  "요청은 블록 번호만이 아니라 H1000이라는 hash와 account A·slot K를 지정합니다. 이 anchor가 이후 memory, overlay와 DB 경로의 공통 기준입니다.",
  "StateProviderFactory는 latest, historical, pending을 구분합니다. H1000이 retained memory에 있으면 그 state를 사용하고, 없으면 영속 history에서 찾습니다.",
  "범위 조회에서는 memory head를 먼저 capture하고 DB read snapshot을 엽니다. 순서를 뒤집으면 flush 도중 두 범위 사이에 빈 구간이 생길 수 있습니다.",
  "OverlayBuilder는 H1000에서 필요한 실행 결과를 DB frontiers 위에 얹습니다. 영속 tip 995보다 뒤의 996~1,000이 아직 memory에 있어도 같은 anchor로 읽습니다.",
  "A는 overlay의 balance 7이 DB의 10보다 우선합니다. Slot K가 overlay에 없으면 history evidence 또는 같은 DB snapshot의 state table로 내려가 5를 읽습니다.",
  "결과 A=7, K=5는 H1000 실행 뒤 상태에 귀속합니다. Pruned history나 빠진 changeset은 값 없음으로 숨기지 않고 오류로 반환합니다.",
] as const;

function Box({ label, value, detail, active = false }: { label: string; value: string; detail: string; active?: boolean }) {
  return <div className={`min-w-0 border bg-background p-3 ${active ? "border-primary" : "border-border"}`}><span className="text-[9px] font-bold text-muted-foreground">{label}</span><strong className={`mt-2 block break-keep text-sm ${active ? "text-primary" : ""}`}>{value}</strong><p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p></div>;
}

export default function RethProviderReadViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6800, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame eyebrow="개념 경로 · H1000 상태 조회" title="블록 anchor를 고른 뒤 overlay와 DB snapshot을 같은 조회로 묶습니다" description="영속화가 늦어져 일부 블록이 memory에 남아 있어도 account와 storage가 한 블록의 상태를 읽는 과정을 따라갑니다." note="H1000, block 995~1,000과 account 값은 설명용 가정입니다. 분기·snapshot·lookup 순서는 Reth v2.8.1 source에 귀속합니다." canvasClassName="px-2 py-2 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only data-reth-provider-scene={active} tabIndex={0} role="group" aria-label="Reth StateProvider가 한 블록의 account와 storage를 memory와 database에서 읽는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">{SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}</div>
        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[15rem] content-center gap-3"><Box label="STATE QUERY" value="block hash H1000" detail="account A · storage slot K" active /><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{["number 1,000", "hash H1000", "account A", "slot K"].map((value) => <strong key={value} className="border border-border p-3 text-center text-xs">{value}</strong>)}</div></div> : null}
          {active === 1 ? <div className="grid min-h-[15rem] content-center gap-3 sm:grid-cols-3"><Box label="LATEST" value="canonical head" detail="memory head 또는 DB latest" /><Box label="HISTORICAL" value="canonical H1000" detail="memory retained → DB history" active /><Box label="PENDING" value="head + 1" detail="없으면 latest fallback" /></div> : null}
          {active === 2 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><Box label="01 · MEMORY" value="head_state capture" detail="996~1,000 retained" active /><span className="hidden font-black text-primary sm:block">→</span><Box label="02 · DATABASE" value="read snapshot" detail="persistent tip 995" active /></div><p className="border-y border-border py-3 text-center text-xs font-bold">Memory 먼저 · DB 나중 = flush가 겹쳐도 range gap 없음</p></div> : null}
          {active === 3 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr]"><Box label="DB FRONTIER" value="persistent 995" detail="read-only transaction" /><span className="hidden self-center font-black text-primary sm:block">+</span><Box label="EXECUTION OVERLAY" value="996 → 1,000" detail="H1000 anchor에서 lazy resolve" active /></div><p className="border-y border-primary/50 py-3 text-center text-xs font-bold text-primary">OverlayStateProvider · target = H1000 실행 뒤 상태</p></div> : null}
          {active === 4 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid gap-3 sm:grid-cols-2"><Box label="ACCOUNT A" value="overlay 7" detail="DB 10으로 내려가지 않음" active /><Box label="STORAGE K" value="overlay miss → DB 5" detail="같은 snapshot에서 fallback" active /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center"><strong className="border border-border p-3 text-xs">overlay key 존재?</strong><span className="font-black text-primary">→</span><strong className="border border-primary p-3 text-xs">yes: overlay · no: history/DB</strong></div></div> : null}
          {active === 5 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-3 gap-px bg-border p-px"><Box label="ANCHOR" value="H1000" detail="after block 1,000" active /><Box label="ACCOUNT" value="A = 7" detail="overlay source" active /><Box label="STORAGE" value="K = 5" detail="DB source" active /></div><div className="grid grid-cols-2 gap-2"><Box label="VALID ABSENCE" value="None 또는 zero" detail="API 의미에 따른 정상 결과" /><Box label="UNAVAILABLE" value="pruned · missing evidence" detail="오류로 구분" /></div></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["요청", "선택", "스냅샷", "Overlay", "조회", "반환"]} playLabel="Provider 조회 흐름 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
