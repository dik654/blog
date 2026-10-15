import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 목적지(같은 출발 IP, 목적 IP, 목적 포트)로 가는 출발 포트 28,232개를 칸 48개로 그린다.
 * 칸 하나 = 1초 동안 새로 연 연결 600개가 붙잡은 포트. 마지막 칸만 32개짜리 조각이다.
 * 한 mechanism: TIME_WAIT 60초 동안 포트가 돌아오지 않으므로 600/s × t가 28,232를 넘는 순간 connect가 실패한다.
 */
const TOTAL = 28232;
const PER_SECOND = 600;
const CELLS = Math.ceil(TOTAL / PER_SECOND); // 48
const SCENES = ["10초", "47초", "48초", "49~60초", "목적지 4개"] as const;

interface Scene {
  filled: number;
  failed: number;
  free: number;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    filled: 10,
    failed: 0,
    free: TOTAL - 6000,
    note: "10초 동안 연 연결 6,000개가 모두 끝났지만 먼저 끊은 클라이언트 쪽에 TIME_WAIT로 남아 포트 6,000개를 붙잡고 있습니다.",
  },
  {
    filled: 47,
    failed: 0,
    free: TOTAL - 47 * PER_SECOND,
    note: "47초에 28,200개가 찼습니다. 남은 포트는 32개뿐이고, 아직 어느 TIME_WAIT도 60초를 채우지 못했습니다.",
  },
  {
    filled: 48,
    failed: 568,
    free: 0,
    note: "48번째 초에는 처음 32개만 포트를 받고 나머지 568개는 connect()가 EADDRNOTAVAIL로 실패합니다. CPU는 한가해도 연결이 열리지 않습니다.",
  },
  {
    filled: 48,
    failed: 600,
    free: 0,
    note: "49~60번째 초는 풀리는 포트가 없어 600개 모두 실패합니다. 61번째 초에 다시 열리고 60초마다 되풀이되므로 평균은 초당 약 470개입니다.",
  },
  {
    filled: 15,
    failed: 0,
    free: TOTAL - 9000,
    note: "목적 IP를 4개로 나누면 4-tuple이 목적지마다 따로라 칸 묶음도 4개입니다. 한 묶음에는 초당 150개 × 60초 = 9,000개만 쌓입니다.",
  },
];

function Pool({ filled, compact = false }: { filled: number; compact?: boolean }) {
  return (
    <div
      className={`grid gap-0.5 ${compact ? "grid-cols-12" : "grid-cols-12 sm:grid-cols-16"}`}
      aria-hidden
    >
      {Array.from({ length: CELLS }, (_, index) => {
        const isFilled = index < filled;
        const isPartial = index === CELLS - 1;
        return (
          <div
            key={index}
            className="relative h-4 overflow-hidden rounded-[2px] border border-border bg-muted/40"
          >
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-500"
              style={{
                width: isFilled ? (isPartial ? `${(32 / PER_SECOND) * 100}%` : "100%") : "0%",
                backgroundColor: "#2563eb",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function PortPoolViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];
  const split = scene === 4;
  const held = split ? 9000 : Math.min(state.filled * PER_SECOND, TOTAL);

  return (
    <VizFrame
      eyebrow="Ephemeral port pool"
      title="초당 600개를 여는 클라이언트는 48초째 포트가 바닥납니다"
      description="칸 하나가 1초 동안 새로 연 연결 600개가 붙잡은 출발 포트입니다. 마지막 칸은 32개짜리 조각입니다. 진한 칸은 TIME_WAIT로 60초 동안 돌아오지 않습니다."
      note="같은 출발 IP·목적 IP·목적 포트로 가는 연결만 셉니다. 클라이언트가 먼저 끊는다고 가정했습니다. 연결이 열려 있는 시간은 60초에 비해 짧아 무시했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="출발 포트 풀이 TIME_WAIT로 차는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 min-h-[12.5rem] sm:min-h-[11.5rem]">
            {split ? (
              <div className="grid grid-cols-2 gap-3">
                {["10.0.0.11", "10.0.0.12", "10.0.0.13", "10.0.0.14"].map((ip) => (
                  <div key={ip} className="min-w-0">
                    <p className="mb-1 font-mono text-[10px] text-muted-foreground">{ip}:8080</p>
                    <Pool filled={state.filled} compact />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="mb-1 font-mono text-[10px] text-muted-foreground">10.0.0.11:8080 · 32768–60999</p>
                <Pool filled={state.filled} />
              </div>
            )}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">TIME_WAIT 포트</dt>
              <dd className="font-bold text-foreground">{held.toLocaleString()}{split ? " ×4" : ""}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">남은 포트</dt>
              <dd className="font-bold text-foreground">{state.free.toLocaleString()}{split ? " ×4" : ""}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">이번 초 실패</dt>
              <dd className="font-bold" style={{ color: state.failed > 0 ? "#dc2626" : undefined }}>
                {state.failed > 0 ? `${state.failed}개` : "0개"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">오류</dt>
              <dd className="font-bold text-foreground">{state.failed > 0 ? "EADDRNOTAVAIL" : "없음"}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
