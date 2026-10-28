import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["전체 지도", "입력", "Context", "Branch", "BLS", "Store"] as const;

const NOTES = [
  "Update u-8193은 아직 신뢰하지 않는 입력입니다. Helios는 Store T0의 committee와 header를 검증 기준으로 씁니다. Context, branch, BLS를 모두 통과한 뒤에만 Store T1을 만듭니다.",
  "T0은 finalized slot 8,191과 current K0·next K1을 보관합니다. u-8193의 attested·finalized slot은 8,192이고 signature slot은 8,193입니다. 참여 bit 342개와 next committee K2도 함께 제시합니다.",
  "현재 slot 8,200 >= signature 8,193 > attested 8,192 >= finalized 8,192인지 확인합니다. Signature period는 1이고 T0에 next K1이 있으므로 period 0의 다음 범위로 연결됩니다.",
  "Finality branch는 finalized header를 attested state에 묶고, next-committee branch는 K2를 같은 state에 묶습니다. 둘 중 하나라도 다르면 u-8193은 이 단계에서 거부됩니다.",
  "Signature period가 1이므로 K0가 아니라 K1의 set bit 342개를 집계합니다. Fork context는 signature slot−1인 8,192에서 고릅니다. 이 값과 genesis root로 signing root를 만들어 aggregate signature를 검증합니다.",
  "342×3=1,026은 512×2=1,024 이상이고 finalized slot 8,192는 더 새롭습니다. Memory Store T1의 finalized·optimistic header가 8,192로 전진합니다. Current K1과 next K2도 함께 반영됩니다.",
] as const;

type StageState = "idle" | "active" | "done";

function stageState(active: number, first: number, last = first): StageState {
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
    <div
      className={`min-w-0 border-l-2 px-3 py-3 ${
        status === "active"
          ? "border-primary bg-primary/[0.055]"
          : status === "done"
            ? "border-foreground/35 bg-background"
            : "border-border bg-background"
      }`}
    >
      <p className="font-mono text-[9px] font-black tracking-wide text-muted-foreground">{label}</p>
      <strong className="mt-1.5 block break-keep text-sm leading-5">{title}</strong>
      <p className="mt-1.5 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
      <p className={`mt-2 break-keep font-mono text-[9px] font-bold ${status === "idle" ? "text-muted-foreground" : "text-primary"}`}>
        {value}
      </p>
    </div>
  );
}

function Connector({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center justify-center text-center ${active ? "text-primary" : "text-muted-foreground/55"}`}>
      <span className="font-mono text-base">→</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function ConsensusTraceViz() {
  const scenes = useAnimatedScenes(LABELS.length, 8200, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Consensus update · u-8193"
      title="T0의 검증 기준으로 update를 확인하고 Store를 T1으로 바꿉니다"
      description="한 update를 따라가며 검증 통과와 Store 변경을 분리합니다. 342개 참여 bit는 BLS 검증의 충분조건이 아니라 Store 적용 단계의 2/3 경계입니다."
      note="Slot과 ID는 검증 순서를 보여 주기 위한 고정 사례입니다. Root·public key·signature 값은 실제 네트워크 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-consensus-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Update u-8193이 Store T0을 T1로 바꾸는 여섯 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {LABELS[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">u-8193 · {active + 1}/6</span>
        </div>

        <div className="mt-3 hidden grid-cols-[minmax(0,1.05fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1.05fr)] items-stretch gap-px bg-border p-px md:grid">
          <Stage
            label="INPUT"
            title="T0 + u-8193"
            body="기존 Store와 아직 신뢰하지 않는 update"
            value="T0: K0·K1 · U: 342 bits"
            status={stageState(active, 1)}
          />
          <Connector label="slot과 period 검사" active={active >= 2} />
          <Stage
            label="CONTEXT"
            title="시간·period"
            body="8,200 ≥ 8,193 > 8,192"
            value={active >= 2 ? "K1 선택 가능" : "검사 대기"}
            status={stageState(active, 2)}
          />
          <Connector label="Merkle branch 검사" active={active >= 3} />
          <Stage
            label="PROOF"
            title="Finality·K2 branch"
            body="두 대상을 attested state에 결속"
            value={active >= 3 ? "BRANCH OK" : "검사 대기"}
            status={stageState(active, 3)}
          />
          <Connector label="집계 서명 검사" active={active >= 4} />
          <Stage
            label="SIGNATURE"
            title="K1 · BLS"
            body="342 public keys와 signing root"
            value={active >= 4 ? "SIGNATURE OK" : "검사 대기"}
            status={stageState(active, 4)}
          />
          <Connector label="검증된 update 적용" active={active >= 5} />
          <Stage
            label="LOCAL STATE"
            title="Store T1"
            body="Finalized 8,192 · current K1 · next K2"
            value={active >= 5 ? "T1 반영됨" : "T0 유지"}
            status={stageState(active, 5)}
          />
        </div>

        <ol className="mt-3 space-y-1 md:hidden">
          {[
            ["T0 + u-8193", "T0의 K0·K1과 update의 342 bits·K2"],
            ["Context", "시간 순서와 signature period 1을 확인해 K1 선택"],
            ["Merkle branch", "Finalized header와 K2를 attested state에 결속"],
            ["BLS", "K1의 set-bit 공개키와 signing root로 signature 확인"],
            ["Store T1", "2/3와 더 새로운 finality를 확인해 K1·K2 반영"],
          ].map(([title, body], index) => {
            const scene = index + 1;
            return (
              <li
                key={title}
                className={`grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-l-2 px-2 py-2 ${
                  active === scene
                    ? "border-primary bg-primary/[0.055]"
                    : active > scene
                      ? "border-foreground/30"
                      : "border-border"
                }`}
              >
                <span className="font-mono text-[9px] font-black text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <strong className="block break-keep text-xs">{title}</strong>
                  <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{body}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-3 border-y border-border px-2 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-xs">현재 판정</strong>
            <span className="font-mono text-[9px] font-bold text-primary">{active < 5 ? "T0 UNCHANGED" : "T1 APPLIED"}</span>
          </div>
          <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{NOTES[active]}</p>
        </div>

        <AnimatedSceneControls
          labels={LABELS}
          controlLabels={["지도", "입력", "Context", "Branch", "BLS", "Store"]}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="Consensus update 재생"
        />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </VizFrame>
  );
}
