import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["조건 고정", "기준선", "입구 공격", "Head 변화", "복구", "결정"] as const;
const NOTES = [
  "Reth v2.8.1/SHA, ChainSpec, pool·replacement·local transaction 설정, head 일정, 거래 corpus, builder 조건과 장비 한도를 한 run ID에 고정합니다.",
  "오류 없는 기준 구현에서 transaction별 validation outcome, reason, subpool, replacement, builder-visible sequence와 memory 사용량을 기록합니다.",
  "Invalid signature·oversize·future nonce, 같은 nonce replacement flood, sender 집중과 blob sidecar pressure를 같은 순서로 주입합니다. 잘못된 거래가 들어가거나 메모리가 한도를 벗어나면 실패입니다.",
  "Base/blob fee 변동, mined removal, 얕은 reorg와 유지 범위를 넘는 head 점프를 재생합니다. 새 state에서 subpool·sender head·reinsert 결과가 기준선과 같아야 합니다.",
  "불일치를 발견하면 public admission과 propagation을 제한하고 raw corpus, head schedule, pool events와 metrics를 보존합니다. 이전 binary/config로 되돌린 뒤 canonical state에서 pool을 다시 만들고 builder parity를 확인합니다.",
  "Admission·ordering·reorg·bounded memory·restart·rollback을 통과한 run에서만 tx/s와 CPU·memory·builder wait를 비교합니다. 대상 환경 측정 전 상태는 proposed입니다.",
] as const;

function Cell({ title, body, tone = "plain" }: { title: string; body: string; tone?: "plain" | "active" | "warn" }) {
  const style = tone === "active" ? "border-primary text-primary" : tone === "warn" ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : "border-border";
  return <div className={`min-w-0 border bg-background p-3 ${style}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span></div>;
}

export default function RethTxpoolValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7600, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame className="scroll-mt-20" eyebrow="실무 경로 · TxPool 정책 변경 검증" title="같은 거래와 head 일정을 공격·reorg·restart까지 재생합니다" description="Admission 결과부터 builder가 실제로 본 순서까지 하나의 run receipt로 대조합니다." note="화면은 격리된 실험 순서입니다. 대상 노드의 처리량과 복구 시간은 아직 측정하지 않았습니다." canvasClassName="px-2 py-2 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only data-reth-txpool-validation-scene={active} tabIndex={0} role="group" aria-label="Reth TxPool 정책 변경을 공격 입력, head 변화와 reorg에서 검증하고 복구하는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">{SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}</div>
        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[15rem] content-center gap-2 sm:grid-cols-3"><Cell title="SOURCE" body="v2.8.1 · d763342…" tone="active" /><Cell title="POLICY" body="pool·bump·local·limits" tone="active" /><Cell title="FIXTURE" body="head schedule·tx corpus·builder" tone="active" /></div> : null}
          {active === 1 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Cell title="ADMISSION" body="outcome·reason" /><Cell title="STATE" body="subpool·dependency" /><Cell title="BUILDER" body="visible sequence" /><Cell title="RESOURCE" body="count·bytes·blob" /></div><p className="border-y border-primary/40 py-3 text-center text-xs font-bold text-primary">거래 hash별 golden receipt</p></div> : null}
          {active === 2 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Cell title="INVALID" body="signature·type·size" tone="warn" /><Cell title="GAP" body="future nonce chain" /><Cell title="REPLACE" body="same nonce flood" tone="warn" /><Cell title="PRESSURE" body="sender·blob bytes" tone="warn" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">Reason-coded reject·park·evict · memory bound 유지</p></div> : null}
          {active === 3 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-3 gap-2"><Cell title="REPRICE" body="base/blob fee up·down" /><Cell title="COMMIT" body="mined remove·nonce advance" /><Cell title="REORG" body="new state 후 old-only revalidate" tone="warn" /></div><p className="border-y border-primary/40 py-3 text-center text-xs font-bold text-primary">Subpool 이유·sender head·builder sequence parity</p></div> : null}
          {active === 4 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5">{[["발견", "parity/limit fail"], ["제한", "admission·propagation"], ["보존", "corpus·events"], ["복구", "binary·config rollback"], ["재진입", "builder parity"]].map(([title, body], index) => <Cell key={title} title={title} body={body} tone={index === 0 ? "warn" : index === 4 ? "active" : "plain"} />)}</div><p className="text-center text-xs text-muted-foreground">Pool은 canonical state의 대체 저장소가 아니므로 검증한 state에서 다시 구성</p></div> : null}
          {active === 5 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4"><Cell title="정확성" body="outcome·subpool·order" /><Cell title="안전" body="memory·restart·rollback" /><Cell title="비용" body="tx/s·CPU·RAM" /><Cell title="서비스" body="admission·builder wait" /></div><div className="grid grid-cols-3 gap-px bg-border p-px"><Cell title="STATUS" body="proposed" /><Cell title="채택" body="모든 gate 통과" tone="active" /><Cell title="기각" body="오분류·순서 위반 1건" tone="warn" /></div></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["조건", "기준선", "공격", "Head", "복구", "결정"]} playLabel="TxPool 검증 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
