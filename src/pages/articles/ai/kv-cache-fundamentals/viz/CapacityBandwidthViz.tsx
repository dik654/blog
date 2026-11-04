import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 실행이 가중치 100MB와 KV 100MB를 읽는 가정. 막대는 모두 200MB를 끝으로 하는 같은 척도다.
 * 한 mechanism: KV가 4분의 1이 되어도 줄어드는 몫은 전체 전송의 일부라 비율은 0.25가 아니라 0.625다.
 */
const WEIGHT = "#64748b";
const KV = "#2563eb";
const MAX_MB = 200;

const SCENES = [
  { label: "기준 · 200MB 읽기", step: 0, result: "100 + 100 = 200MB", note: "한 실행이 가중치와 KV를 100MB씩 읽는다고 둡니다." },
  { label: "공간에는 4배 담김", step: 1, result: "100MB에 4벌", note: "같은 기록이 25MB로 줄면 100MB 공간에 4벌 들어갑니다. 저장 공간 쪽에서는 정말 4배입니다." },
  { label: "전송은 125MB", step: 2, result: "100 + 25 = 125MB", note: "한 실행의 전송에서는 KV 몫만 75MB 줄어듭니다. 가중치 100MB는 그대로 읽습니다." },
  { label: "비율은 0.625", step: 3, result: "125 ÷ 200 = 0.625", note: "전송 시간만 전체를 지배한다는 조건을 더해도 예상 시간 비율은 0.625입니다." },
  { label: "0.25가 되는 조건", step: 4, result: "25 ÷ 100 = 0.25", note: "0.25는 가중치를 읽지 않아 KV만 전송하는 경우의 비율입니다. 이 사례의 조건과 다릅니다." },
] as const;

function Row({ name, weight, kv, total }: { name: string; weight: number; kv: number; total: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{name}</span>
        <span className="font-mono font-bold text-foreground">{total}</span>
      </div>
      <div className="mt-1 flex h-6 gap-0.5 rounded-sm border border-border p-px">
        {weight > 0 ? <span className="h-full rounded-sm" style={{ width: `${(weight / MAX_MB) * 100}%`, backgroundColor: WEIGHT }} /> : null}
        <span className="h-full rounded-sm" style={{ width: `${(kv / MAX_MB) * 100}%`, backgroundColor: KV }} />
      </div>
    </div>
  );
}

function Rooms() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">KV 공간 100MB에 담기는 기록</span>
        <span className="font-mono font-bold text-foreground">25MB × 4벌</span>
      </div>
      <div className="mt-1 h-6 rounded-sm border border-border p-px" style={{ width: "50%" }}>
        <div className="grid h-full grid-cols-4 gap-0.5">
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className="rounded-sm" style={{ backgroundColor: KV }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CapacityBandwidthViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const step = scene.step;

  return (
    <VizFrame
      eyebrow="공간과 전송"
      title="공간은 4배가 되어도 전송은 0.625배까지만 줄어듭니다"
      description="막대의 전체 폭이 200MB입니다. 회색은 가중치, 파란색은 KV입니다."
      note="가중치 100MB와 KV 100MB는 설명용 가정이며(가정), 계산·GPU 사이 통신·실행 준비 시간을 넣지 않은 전송량 비교입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV를 줄였을 때 저장 공간과 전송량의 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.result}</span>
          </div>
          <div className="mt-3 grid min-h-[9.5rem] content-start gap-3">
            <Row name="줄이기 전 전송" weight={100} kv={100} total="200MB" />
            {step === 1 ? <Rooms /> : null}
            {step === 2 || step === 3 ? <Row name="KV만 줄인 전송" weight={100} kv={25} total="125MB" /> : null}
            {step === 4 ? (
              <>
                <Row name="KV만 줄인 전송" weight={100} kv={25} total="125MB" />
                <Row name="가중치 없이 KV만 전송" weight={0} kv={25} total="25MB" />
              </>
            ) : null}
          </div>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
