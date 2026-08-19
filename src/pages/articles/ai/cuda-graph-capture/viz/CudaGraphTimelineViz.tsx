import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["eager", "capture", "replay"] as const;

const STEPS = 5;

export default function CudaGraphTimelineViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="Kernel launch timeline"
      title="같은 decode step을 매번 새로 launch할지, 한 번 녹화해 재생할지"
      description="Eager 실행은 매 step마다 CPU가 커널을 하나씩 다시 launch합니다. Capture는 그 launch 시퀀스를 한 번 녹화하고, replay는 녹화된 시퀀스를 그대로 재생해 launch overhead를 지웁니다."
      note="Replay가 건너뛰는 것은 GPU 연산이 아니라 CPU의 커널 launch 호출입니다 — 실제 kernel 실행 시간(파란 구간)은 그대로 남습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CUDA graph capture/replay 타임라인 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="space-y-3">
          <Row
            label="Eager"
            active={a === 0}
            detail="Step마다 CPU가 커널을 하나씩 launch — 매 step 오버헤드 발생"
          >
            {Array.from({ length: STEPS }, (_, i) => (
              <Segment key={i}>
                <span className="block h-6 w-3 shrink-0 bg-amber-400/70 dark:bg-amber-500/60" />
                <span className="block h-6 flex-1 bg-primary/40" />
              </Segment>
            ))}
          </Row>
          <Row
            label="Capture"
            active={a === 1}
            detail="처음 한 번, launch 시퀀스 전체를 녹화 — static input/output 주소를 이 시점에 고정"
          >
            <span
              className={`flex h-6 w-full items-center justify-center border ${a === 1 ? "border-primary" : "border-border"} border-dashed`}
            >
              <span className="text-[10px] font-bold text-muted-foreground">
                recording…
              </span>
            </span>
          </Row>
          <Row
            label="Replay"
            active={a === 2}
            detail="이후 같은 shape는 녹화된 시퀀스를 그대로 재생 — launch overhead(주황) 없음"
          >
            <span className="block h-6 w-full bg-primary/40" />
          </Row>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Ledger
            label="launch overhead"
            value="CPU가 커널마다 새로 issue하는 고정 비용"
            active={a === 0}
          />
          <Ledger
            label="static address"
            value="capture 때 기록한 input/output GPU 주소"
            active={a === 1}
          />
          <Ledger
            label="kernel exec"
            value="capture·replay 모두에서 그대로 남는 실제 연산 시간"
            active={a === 0 || a === 2}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Row({
  label,
  detail,
  active,
  children,
}: {
  label: string;
  detail: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`border px-4 py-3 ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black">{label}</p>
      </div>
      <div className="mt-2 flex items-center gap-1">{children}</div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function Segment({ children }: { children: ReactNode }) {
  return <span className="flex flex-1 items-center gap-0.5">{children}</span>;
}

function Ledger({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}
    >
      <p className="text-xs font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
