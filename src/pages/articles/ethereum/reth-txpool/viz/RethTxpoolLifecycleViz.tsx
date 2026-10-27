import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["거래 도착", "검증", "서브풀", "Builder", "새 블록", "Reorg"] as const;
const NOTES = [
  "RPC나 P2P로 Alice의 T7·T8과 Bob의 T4가 들어옵니다. Pool 접수는 서명된 거래를 canonical block에 포함했다는 뜻이 아닙니다.",
  "Reth는 거래 자체와 fork·크기·gas 조건을 먼저 확인하고, latest state provider에서 sender nonce·balance·bytecode를 확인합니다. 잘못된 거래 Invalid와 provider 장애 Error는 모두 삽입하지 않지만 원인이 다릅니다.",
  "Alice의 canonical nonce가 7이고 다음 base fee가 42 gwei일 때 max fee 40인 T7은 검증을 통과해도 BaseFee에서 기다립니다. T8은 T7이 Pending이 아니므로 Queued이고, 조건을 모두 만족한 Bob T4는 Pending입니다.",
  "Ordering은 거래마다 effective tip priority를 계산하지만 nonce 의존성을 없애지 않습니다. Builder iterator는 Alice T7과 Bob T4처럼 sender별 현재 head만 비교하고, T7을 내보낸 뒤에야 T8을 해제합니다.",
  "새 canonical block이 T7을 포함하면 pool은 T7을 제거하고 Alice nonce·balance, 다음 base/blob fee를 반영해 T8을 다시 분류합니다. Fee 변화만으로도 BaseFee·Blob·Pending 사이를 오갈 수 있습니다.",
  "Reorg에서는 새 branch의 mined 거래와 account state를 먼저 반영합니다. Old branch에만 있던 T7은 예전 판정을 복사하지 않고 external admission 경로에서 현재 state와 blob sidecar를 다시 검증합니다.",
] as const;

function Cell({ title, body, tone = "plain" }: { title: string; body: string; tone?: "plain" | "active" | "warn" }) {
  const style = tone === "active" ? "border-primary text-primary" : tone === "warn" ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : "border-border";
  return <div className={`min-w-0 border bg-background p-3 ${style}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span></div>;
}

export default function RethTxpoolLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7600, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 경로 · Alice T7·T8과 Bob T4"
      title="한 거래가 검증에서 서브풀, builder와 reorg를 거칩니다"
      description="입구 검사만 떼어 보지 않고 같은 거래가 canonical head 변화에 따라 어떻게 다시 분류되는지 추적합니다."
      note="Nonce 7, base fee 42→20.5 gwei와 fee 값은 설명용 가정입니다. 상태 전이와 구현 경계는 Reth v2.8.1 source에 귀속합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-txpool-scene={active}
        tabIndex={0}
        role="group"
        aria-label="거래가 Reth TxPool에서 검증, 서브풀 분류, builder 선택과 reorg 재검증을 거치는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">
          {SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}
        </div>
        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-3 gap-2"><Cell title="Alice · T7" body="nonce 7 · max fee 40" tone="active" /><Cell title="Alice · T8" body="nonce 8 · T7 의존" /><Cell title="Bob · T4" body="nonce 4 · 독립 sender" /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Cell title="RPC · P2P" body="signed transaction 접수" /><span className="font-black text-primary">→</span><Cell title="TXPOOL" body="아직 canonical 아님" tone="warn" /></div></div> : null}
          {active === 1 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid gap-2 sm:grid-cols-2"><Cell title="STATELESS" body="type·fork·size·gas·fee fields·chain ID" /><Cell title="STATEFUL" body="latest sender nonce·balance·bytecode·blob" /></div><div className="grid grid-cols-3 gap-2"><Cell title="VALID" body="분류 입력과 함께 삽입" tone="active" /><Cell title="INVALID" body="거래 규칙 위반" tone="warn" /><Cell title="ERROR" body="state provider 실패" tone="warn" /></div></div> : null}
          {active === 2 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Cell title="PENDING" body="Bob T4 · 지금 실행 가능" tone="active" /><Cell title="BASEFEE" body="T7 · 40 < 42" tone="warn" /><Cell title="QUEUED" body="T8 · ancestor 대기" /><Cell title="BLOB" body="blob/base fee 또는 의존성 대기" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">Valid는 곧 Pending이 아닙니다 · 이유를 상태 비트로 보존</p></div> : null}
          {active === 3 ? <div className="grid min-h-[15rem] content-center gap-4"><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Cell title="INDEPENDENT HEADS" body="Alice T7 · Bob T4" tone="active" /><span className="font-black text-primary">→</span><Cell title="PRIORITY" body="effective tip 기준 비교" /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Cell title="T7 YIELDED" body="builder가 다음 후보로 받음" /><span className="font-black text-primary">→</span><Cell title="T8 UNLOCKED" body="같은 sender의 nonce 8" tone="active" /></div></div> : null}
          {active === 4 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-3 gap-2"><Cell title="MINED" body="T7 pool에서 제거" /><Cell title="ACCOUNT" body="Alice nonce 7 → 8" tone="active" /><Cell title="NEXT FEES" body="base·blob fee 갱신" /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Cell title="T8 BEFORE" body="T7 의존" /><span className="font-black text-primary">→</span><Cell title="T8 AFTER" body="새 sender head로 재평가" tone="active" /></div></div> : null}
          {active === 5 ? <div className="grid min-h-[15rem] content-center gap-3"><div className="grid grid-cols-2 gap-2"><Cell title="NEW BRANCH" body="새 mined set·changed accounts 먼저 반영" tone="active" /><Cell title="OLD-ONLY T7" body="reinsert 후보·예전 판정 폐기" tone="warn" /></div><div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2"><Cell title="복원" body="consensus tx·blob sidecar" /><span className="font-black text-primary">→</span><Cell title="재검증" body="external admission" /><span className="font-black text-primary">→</span><Cell title="재분류" body="현재 nonce·fee·balance" tone="active" /></div></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["접수", "검증", "분류", "선택", "Head", "Reorg"]} playLabel="거래 생명주기 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
