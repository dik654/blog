import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["조건 고정", "기준선 생성", "Flush 교차", "Reorg·prune", "격리·복구", "증거로 결정"] as const;
const NOTES = [
  "v2.8.1 source와 binary, Storage V1/V2, prune checkpoints, partial-persistence 설정, chain fixture와 장비 조건을 한 run ID에 고정합니다.",
  "Latest, retained memory, historical, pending hash별로 account·storage·root·proof와 정상 absence·pruned 오류를 기준 구현에서 기록합니다.",
  "Memory block을 DB로 flush하는 직전·중간·직후에 같은 range와 hash query를 반복합니다. 어느 순간에도 memory와 DB 사이의 block gap이 나타나면 실패입니다.",
  "Reorg로 canonical hash를 바꾸고 prune checkpoint 경계를 이동합니다. Number query는 새 canonical hash로, explicit hash는 지원 범위나 오류 계약으로 분리합니다.",
  "Mixed value나 잘못된 None을 발견하면 candidate serving을 중지하고 memory/DB frontier와 source를 보존합니다. 이전 binary·snapshot 또는 rebuild 뒤 전체 query parity를 다시 확인합니다.",
  "정확성·restart·rollback을 통과한 run에서만 latency, CPU, I/O와 cache 비용을 비교합니다. 측정이 없으면 결정은 proposed입니다.",
] as const;

function Cell({ title, body, tone = "plain" }: { title: string; body: string; tone?: "plain" | "active" | "warn" }) {
  const style = tone === "active" ? "border-primary text-primary" : tone === "warn" ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : "border-border";
  return <div className={`border bg-background p-3 ${style}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span></div>;
}

export default function RethProviderValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6800, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame eyebrow="실무 경로 · Provider 변경 검증" title="같은 query를 flush·reorg·prune 경계에 반복해 mixed state를 찾습니다" description="빠른 정상 조회만 재는 대신 memory와 DB의 소유권이 바뀌는 순간과 실패 결과까지 기준 구현에 대조합니다." note="화면의 block 범위는 실험 구조를 설명하는 예시입니다. 대상 환경의 성능·복구 측정값은 아직 없습니다." canvasClassName="px-2 py-2 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only data-reth-provider-validation-scene={active} tabIndex={0} role="group" aria-label="Reth Provider 변경을 flush reorg prune 경계에서 검증하고 복구하는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">{SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}</div>
        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[15rem] content-center gap-2 sm:grid-cols-3">{[["BINARY", "v2.8.1 · SHA · features"], ["STORAGE", "V2 · prune · masking"], ["FIXTURE", "hash · root · account/slot"]].map(([a,b]) => <Cell key={a} title={a} body={b} tone="active" />)}</div> : null}
          {active === 1 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Latest", "memory head"], ["Retained", "H1000"], ["Historical", "H900"], ["Pending", "head+1"]].map(([a,b]) => <Cell key={a} title={a} body={b} tone="active" />)}</div><p className="border-y border-border py-3 text-center text-xs font-bold">Value · state root · proof · typed outcome를 golden receipt로 저장</p></div> : null}
          {active === 2 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-3 gap-2"><Cell title="직전" body="memory 996~1,000 · DB 995" /><Cell title="중간" body="memory 999~1,000 · DB 998" tone="active" /><Cell title="직후" body="memory empty · DB 1,000" /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center"><strong className="border border-border p-3 text-xs">같은 H1000 query</strong><span className="font-black text-primary">→</span><strong className="border border-primary p-3 text-xs">항상 같은 값·root</strong></div></div> : null}
          {active === 3 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid gap-3 sm:grid-cols-2"><Cell title="REORG" body="number 1,000 → 새 canonical hash · old hash는 명시적 정책" tone="warn" /><Cell title="PRUNE" body="history checkpoint 전 → StateAtBlockPruned" tone="warn" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">잘못된 branch나 보관하지 않은 state를 정상 None으로 반환하면 기각</p></div> : null}
          {active === 4 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5">{[["발견", "parity fail"], ["격리", "serving off"], ["보존", "frontiers"], ["복구", "rollback"], ["재진입", "full parity"]].map(([a,b], index) => <Cell key={a} title={a} body={b} tone={index === 0 ? "warn" : index === 4 ? "active" : "plain"} />)}</div><p className="text-center text-xs text-muted-foreground">Binary rollback · snapshot restore · verified chain rebuild 중 적용 범위에 맞는 경로 선택</p></div> : null}
          {active === 5 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">{[["정합성", "값·root·error"], ["복구", "restart·rollback"], ["비용", "CPU·I/O·cache"], ["서비스", "query p95/p99"]].map(([a,b]) => <Cell key={a} title={a} body={b} />)}</div><div className="grid grid-cols-3 gap-px bg-border p-px"><Cell title="STATUS" body="proposed" /><Cell title="채택" body="모든 gate + SLO" tone="active" /><Cell title="기각" body="mixed state 1건" tone="warn" /></div></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["조건", "기준선", "Flush", "장애", "복구", "결정"]} playLabel="Provider 검증 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
