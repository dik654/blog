import LaneStrip from "./LaneStrip";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — Warp는 block 경계를 넘어 합치지 않는다.
 * Thread 4개짜리 block 3개 → 부분 warp 3개. 한 줄 32 lane 중 4개 사용, 32−4 = 28개 빈 자리.
 */
const COLORS = ["#2563eb", "#d97706", "#16a34a"];

const SCENES = [
  { label: "block 세 개", summary: "4 × 3 = 12 threads", note: "Block마다 thread 네 개가 있습니다. 전체를 세면 12개여서 warp의 단위 32보다 작습니다." },
  { label: "이렇게 합치지 않습니다", summary: "warp 1개에 12개 → 아님", note: "전체 thread가 12개라는 이유로 warp 하나에 합쳐지지 않습니다. 빨간 점선은 일어나지 않는 그림이라는 표시입니다." },
  { label: "block마다 부분 warp", summary: "warp 3개 · 줄마다 4 / 32", note: "Warp는 block 경계를 넘어서 합치지 않으므로 block 하나가 부분 warp 하나가 됩니다. 줄마다 32−4 = 28 lane은 비어 있습니다. 작은 수는 위치를 설명하기 위한 가정이며 성능에 좋은 설정이라는 뜻은 아닙니다." },
] as const;

export default function PartialWarpViz() {
  return (
    <SceneShell
      eyebrow="Warp의 경계"
      title="Thread 12개는 warp 하나가 아니라 부분 warp 세 개로 실행됩니다"
      description="빈칸까지 보이는 가로 한 줄이 warp 하나의 32 lane이고, 칠한 칸이 thread가 들어간 lane입니다. 색은 어느 block의 thread인지를 뜻합니다."
      ariaLabel="thread 네 개짜리 block 세 개가 warp 세 개로 실행되는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 1) {
          return (
            <div className="space-y-3">
              <div className="rounded-lg border border-dashed border-red-600 p-2">
                <p className="mb-1 text-xs font-semibold text-red-700 dark:text-red-400">일어나지 않는 그림 · warp 하나에 세 block</p>
                <LaneStrip colorOf={(lane) => (lane < 12 ? (COLORS[Math.floor(lane / 4)] ?? null) : null)} />
              </div>
              <p className="text-xs leading-6 text-muted-foreground">앞의 네 칸은 block 0, 다음 네 칸은 block 1, 그다음 네 칸은 block 2입니다.</p>
            </div>
          );
        }
        return (
          <div className="space-y-3">
            {COLORS.map((color, block) => (
              <div key={color} className="rounded-lg border border-border/70 p-2">
                <p className="mb-1 text-xs font-semibold">
                  {active === 0 ? `Block ${block} · thread 4개` : `Warp ${block + 1} · block ${block}의 thread 4개 + 빈 lane 28개`}
                </p>
                <LaneStrip colorOf={(lane) => (lane < 4 ? color : null)} outline={active !== 0} />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
