import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["전체 지도", "Checkpoint", "응답", "Header 대조", "Committee 대조", "Store 공개"] as const;

const NOTES = [
  "Bootstrap attempt b-17은 승인된 checkpoint C로 시작합니다. RPC가 보낸 header H·committee K·branch B를 두 번 검증한 뒤에만 첫 LightClientStore S1을 공개합니다.",
  "Client가 network와 checkpoint C를 고정합니다. Endpoint가 바뀌어도 b-17의 C는 그대로이며, C′를 쓰려면 새로운 신뢰 결정을 시작해야 합니다.",
  "Consensus RPC는 C를 key로 LightClientBootstrap을 반환합니다. H·K·B를 읽었다는 사실은 아직 이 셋을 신뢰해도 된다는 뜻이 아닙니다.",
  "Helios는 beacon header H의 hash-tree-root를 다시 계산해 C와 비교합니다. 다르면 committee branch를 보기 전에 응답을 거부합니다.",
  "HTR(K)와 branch B를 fork별 generalized index 순서로 접습니다. 마지막 값이 H의 state root R과 같을 때만 K가 H의 state에 포함됐다고 판정합니다.",
  "두 검사가 모두 통과하면 finalized H·optimistic H·current committee K를 한 LightClientStore S1에 넣습니다. 실패하면 기존 store를 그대로 둡니다.",
] as const;

type StageState = "idle" | "active" | "done";

function state(active: number, first: number, last = first): StageState {
  if (active < first) return "idle";
  if (active <= last) return "active";
  return "done";
}

function Stage({
  label,
  title,
  body,
  value,
  status,
}: {
  label: string;
  title: string;
  body: string;
  value: string;
  status: StageState;
}) {
  return (
    <div className={`min-w-0 border-l-2 px-3 py-3 ${status === "active" ? "border-primary bg-primary/[0.055]" : status === "done" ? "border-foreground/35 bg-background" : "border-border bg-background"}`}>
      <p className="font-mono text-[9px] font-black tracking-wide text-muted-foreground">{label}</p>
      <strong className="mt-1.5 block break-keep text-sm leading-5">{title}</strong>
      <p className="mt-1.5 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
      <p className={`mt-2 break-keep font-mono text-[9px] font-bold ${status === "idle" ? "text-muted-foreground" : "text-primary"}`}>{value}</p>
    </div>
  );
}

function Connector({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center justify-center text-center ${active ? "text-primary" : "text-muted-foreground/55"}`}>
      <span className="font-mono text-base">→</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function BootstrapTraceViz() {
  const scenes = useAnimatedScenes(LABELS.length, 7600, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Checkpoint 부트스트랩 · attempt b-17"
      title="C를 요청 key로 고정하고, H와 K를 검증한 뒤 Store S1을 만듭니다"
      description="같은 attempt ID를 따라가며 RPC 응답을 읽는 단계와 신뢰 상태를 바꾸는 단계를 구분합니다."
      note="C·H·K·B·R·S1은 아래 한 사례를 끝까지 추적하기 위한 식별자입니다. 실제 root와 public key 값은 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-bootstrap-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Checkpoint C에서 검증된 LightClientStore S1까지 이어지는 여섯 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {LABELS[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">b-17 · {active + 1}/6</span>
        </div>

        <div className="mt-3 hidden grid-cols-[minmax(0,1fr)_2rem_minmax(0,1.1fr)_2rem_minmax(0,1.15fr)_2rem_minmax(0,1fr)] items-stretch gap-px bg-border p-px md:grid">
          <Stage label="TRUST INPUT" title="Checkpoint C" body="Network와 신뢰 시작 root" value="mainnet · C" status={state(active, 1)} />
          <Connector label="C로 요청" active={active >= 1} />
          <Stage label="UNTRUSTED RESPONSE" title="Bootstrap H·K·B" body="헤더·위원회·Merkle 경로" value="GET bootstrap(C)" status={state(active, 2)} />
          <Connector label="두 검증" active={active >= 3} />
          <Stage label="DECISION OWNER" title="Header + branch 검증" body="HTR(H)=C, Fold(K,B)=R" value={active >= 4 ? "두 gate 통과" : "검사 대기"} status={state(active, 3, 4)} />
          <Connector label="원자 적용" active={active >= 5} />
          <Stage label="LOCAL STATE" title="Store S1" body="Finalized H · current K" value={active >= 5 ? "S1 공개" : "기존 store 유지"} status={state(active, 5)} />
        </div>

        <ol className="mt-3 space-y-1 md:hidden">
          {[
            ["Checkpoint C", "network와 승인된 root를 b-17에 고정"],
            ["Bootstrap H·K·B", "C를 key로 받아온 아직 신뢰하지 않은 응답"],
            ["Header gate", "HTR(H)가 C와 같은지 확인"],
            ["Committee gate", "HTR(K)와 B를 접어 H.state_root R과 대조"],
            ["Store S1", "두 gate가 통과한 H와 K만 함께 공개"],
          ].map(([title, body], index) => {
            const scene = index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : index === 3 ? 4 : 5;
            return (
              <li key={title} className={`grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-l-2 px-2 py-2 ${active === scene ? "border-primary bg-primary/[0.055]" : active > scene ? "border-foreground/30" : "border-border"}`}>
                <span className="font-mono text-[9px] font-black text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0"><strong className="block break-keep text-xs">{title}</strong><span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{body}</span></span>
              </li>
            );
          })}
        </ol>

        <div className="mt-3 border-y border-border px-2 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-xs">현재 판정</strong>
            <span className="font-mono text-[9px] font-bold text-primary">{active < 5 ? "검증 전·중" : "STORE READY"}</span>
          </div>
          <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{NOTES[active]}</p>
        </div>

        <AnimatedSceneControls
          labels={LABELS}
          controlLabels={["지도", "C", "응답", "Header", "Committee", "Store"]}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="부트스트랩 재생"
        />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </VizFrame>
  );
}
