import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "전체 지도",
  "Checkpoint",
  "검증된 block",
  "잔액 요청",
  "Proof 요청",
  "Root 대조",
  "검증된 응답",
] as const;

const NOTES = [
  "Helios에는 시작·동기화 때 만드는 trust path와 사용자의 JSON-RPC 요청을 처리하는 request path가 있습니다. 두 경로는 검증된 execution block hash와 state root에서 만납니다.",
  "Consensus client는 network가 맞는지 확인하고 trusted checkpoint C에서 bootstrap·update를 검증합니다. Checkpoint 출처 자체는 light-client protocol 바깥의 신뢰 시작점입니다.",
  "통과한 update만 LightClientStore의 optimistic·finalized header를 바꿉니다. Header 안의 execution payload가 block hash H와 state root R을 제공합니다.",
  "Wallet이 local JSON-RPC에 요청 q-7을 보냅니다. 예시는 주소 A의 잔액이며 block tag는 latest입니다. Node는 최신 block의 age를 먼저 확인합니다.",
  "Execution provider는 현재 검증된 block H를 얻고, 중앙 Execution RPC에 H를 정확히 지정해 A의 EIP-1186 account proof를 요청합니다.",
  "Helios는 응답의 account fields를 R에 대해 Merkle-Patricia proof로 검증합니다. Proof가 다른 root를 가리키면 잔액 숫자가 그럴듯해도 전체 요청을 거절합니다.",
  "검증을 통과한 balance 7 ETH를 q-7의 응답으로 돌려줍니다. 결과를 재현하려면 network·checkpoint·block hash H·state root R·proof outcome·Helios SHA를 함께 남겨야 합니다.",
] as const;

type NodeState = "idle" | "active" | "done" | "error";

function nodeState(active: number, start: number, end = start): NodeState {
  if (active < start) return "idle";
  if (active <= end) return "active";
  return "done";
}

function SystemNode({
  eyebrow,
  title,
  role,
  state,
  value,
}: {
  eyebrow: string;
  title: string;
  role: string;
  state: NodeState;
  value?: string;
}) {
  return (
    <div
      className={`min-w-0 border-l-2 bg-background px-2 py-2.5 transition-colors sm:px-3 ${
        state === "active"
          ? "border-primary bg-primary/[0.055]"
          : state === "done"
            ? "border-foreground/35"
            : state === "error"
              ? "border-destructive"
              : "border-border"
      }`}
    >
      <span className="block font-mono text-[8px] font-black tracking-wide text-muted-foreground">{eyebrow}</span>
      <strong className="mt-1 block break-keep text-[11px] leading-4 text-foreground sm:text-xs">{title}</strong>
      <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{role}</span>
      {value && <span className={`mt-1 block break-keep font-mono text-[9px] font-bold ${state === "active" || state === "done" ? "text-primary" : "text-muted-foreground"}`}>{value}</span>}
    </div>
  );
}

function Arrow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex min-w-0 flex-col items-center justify-center px-1 text-center ${active ? "text-primary" : "text-muted-foreground/60"}`}>
      <span className="font-mono text-base leading-none">→</span>
      <span className="mt-1 break-keep text-[8px] leading-3">{label}</span>
    </div>
  );
}

function MobileStep({
  number,
  title,
  body,
  active,
  done,
}: {
  number: number;
  title: string;
  body: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <li className={`grid grid-cols-[1.7rem_minmax(0,1fr)] gap-2 border-l-2 py-1.5 pl-2 ${active ? "border-primary bg-primary/[0.045]" : done ? "border-foreground/30" : "border-border"}`}>
      <span className={`font-mono text-[9px] font-black ${active ? "text-primary" : "text-muted-foreground"}`}>{String(number).padStart(2, "0")}</span>
      <div className="min-w-0">
        <strong className="block break-keep text-[11px] leading-4">{title}</strong>
        <span className="mt-0.5 block break-keep text-[9px] leading-4 text-muted-foreground">{body}</span>
      </div>
    </li>
  );
}

export default function HeliosTrustTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Helios 전체 지도 · 요청 q-7"
      title="검증된 block을 먼저 만들고, 잔액 proof를 그 block의 state root에 결속합니다"
      description="위쪽은 시작·동기화 때 유지하는 trust path이고, 아래쪽은 잔액 요청마다 실행하는 request path입니다. q-7은 설명용 요청 ID입니다."
      note="Balance 7 ETH와 C·H·R은 흐름을 설명하기 위한 값입니다. 구현 경계는 a16z/helios commit 43a8c9f3과 Ethereum consensus-specs v1.6.1, EIP-1186에 고정했습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-helios-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Checkpoint에서 검증된 block을 만든 뒤 잔액 proof를 검증하는 일곱 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-7 items-center justify-between border-b border-border px-1 md:hidden">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">{active + 1}/7</span>
        </div>

        <div className="hidden space-y-4 md:block">
          <section aria-label="Consensus trust path">
            <div className="mb-2 flex items-center justify-between gap-3">
              <strong className="font-mono text-[9px] tracking-wide text-muted-foreground">TRUST PATH · 시작과 12초 주기 update</strong>
              <span className="text-[9px] text-muted-foreground">결과 · 검증된 H와 R</span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_2.75rem_minmax(0,1fr)_2.75rem_minmax(0,1fr)_2.75rem_minmax(0,1fr)] items-stretch gap-px bg-border p-px">
              <SystemNode eyebrow="TRUST ANCHOR" title="Checkpoint C" role="Network·root 출처를 고정" state={nodeState(active, 1)} value="C" />
              <Arrow label="bootstrap" active={active >= 1} />
              <SystemNode eyebrow="UNTRUSTED INPUT" title="Consensus RPC" role="Bootstrap·update를 전달" state={nodeState(active, 1, 2)} value="header · branch · BLS" />
              <Arrow label="verify" active={active >= 2} />
              <SystemNode eyebrow="DECISION OWNER" title="Consensus client" role="Branch·BLS·period를 판정" state={nodeState(active, 2)} value="PASS / REJECT" />
              <Arrow label="apply" active={active >= 2} />
              <SystemNode eyebrow="AUTHORITATIVE LOCAL STATE" title="LightClient Store" role="Optimistic·finalized header 유지" state={nodeState(active, 2)} value="block H · root R" />
            </div>
          </section>

          <section aria-label="JSON-RPC request path">
            <div className="mb-2 flex items-center justify-between gap-3">
              <strong className="font-mono text-[9px] tracking-wide text-muted-foreground">REQUEST PATH · 요청마다 실행</strong>
              <span className="text-[9px] text-muted-foreground">같은 ID · q-7</span>
            </div>
            <div className="grid grid-cols-[minmax(0,.8fr)_2.25rem_minmax(0,1fr)_2.25rem_minmax(0,1.12fr)_2.5rem_minmax(0,1fr)_2.25rem_minmax(0,.9fr)] items-stretch gap-px bg-border p-px">
              <SystemNode eyebrow="CALLER" title="Wallet" role="주소 A의 잔액 요청" state={nodeState(active, 3, 6)} value={active >= 3 ? "q-7" : "대기"} />
              <Arrow label="local HTTP" active={active >= 3} />
              <SystemNode eyebrow="PUBLIC INTERFACE" title="Local JSON-RPC" role="Method·block tag를 수신" state={nodeState(active, 3, 6)} value="getBalance · latest" />
              <Arrow label="block H" active={active >= 4} />
              <SystemNode eyebrow="EXECUTION OWNER" title="Execution provider" role="Proof를 요청하고 root를 대조" state={nodeState(active, 4, 5)} value={active >= 5 ? "H 고정 · P 검증" : "H를 고정"} />
              <Arrow label="getProof" active={active >= 4} />
              <SystemNode eyebrow="UNTRUSTED INPUT" title="Execution RPC" role="Block H의 account proof 반환" state={nodeState(active, 4)} value="balance 7 · proof P" />
              <Arrow label="검증값" active={active >= 6} />
              <SystemNode eyebrow="OBSERVABLE END" title="q-7 응답" role="검증된 값과 block 문맥" state={nodeState(active, 6)} value={active >= 6 ? "7 ETH · PASS" : "대기"} />
            </div>
          </section>
        </div>

        <div className="mt-2 md:hidden">
          <div className="grid grid-cols-2 gap-px bg-border p-px text-center text-[9px] leading-4">
            <div className={`bg-background p-2 ${active <= 2 ? "text-primary" : "text-muted-foreground"}`}><strong className="block text-[10px]">Trust path</strong>시작·동기화</div>
            <div className={`bg-background p-2 ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}><strong className="block text-[10px]">Request path</strong>요청 q-7</div>
          </div>
          <ol className="mt-2 space-y-1">
            <MobileStep number={1} title="Checkpoint C" body="Network와 신뢰 시작 root를 고정합니다." active={active === 1} done={active > 1} />
            <MobileStep number={2} title="Consensus 검증" body="RPC의 branch·BLS·period를 검사해 H와 R을 Store에 둡니다." active={active === 2} done={active > 2} />
            <MobileStep number={3} title="Wallet → Local RPC" body="q-7이 주소 A와 latest tag를 보냅니다." active={active === 3} done={active > 3} />
            <MobileStep number={4} title="Execution proof 요청" body="Execution provider가 block H의 account proof를 요청합니다." active={active === 4} done={active > 4} />
            <MobileStep number={5} title="State root 대조" body="Proof P가 R에 balance 7을 결속하는지 확인합니다." active={active === 5} done={active > 5} />
            <MobileStep number={6} title="Response q-7" body="7 ETH와 H·R·PASS를 같은 결과로 돌려줍니다." active={active === 6} done={false} />
          </ol>
        </div>

        <section className="mt-3 border-y border-border bg-background px-2 py-2.5 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="break-keep text-xs">현재 판정</strong>
            <span className="font-mono text-[9px] font-bold text-primary">{active < 6 ? "검증 중" : "검증 완료"}</span>
          </div>
          <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{NOTES[active]}</p>
        </section>

        <AnimatedSceneControls
          labels={SCENES}
          controlLabels={["지도", "Checkpoint", "Block", "요청", "Proof", "대조", "응답"]}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="경로 재생"
        />
      </div>

      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
