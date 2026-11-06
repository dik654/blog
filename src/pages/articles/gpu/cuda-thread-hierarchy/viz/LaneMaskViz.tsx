import LaneStrip from "./LaneStrip";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #warp-runtime — 짝수 번호만 덧셈을 하면 홀수 lane은 그 명령에 참여하지 않는다.
 * block 64 threads = 32×2 → warp 2개. thread 37 = 32 + 5 → 두 번째 warp의 lane 5.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";

const SCENES = [
  { label: "lane마다 자기 값과 주소", summary: "같은 명령 · lane 32개", note: "명령을 함께 진행해도 lane마다 자기 값과 주소를 갖습니다. 칠한 칸은 이 명령에 참여하는 lane입니다." },
  { label: "짝수 번호만 덧셈", summary: "참여 16 · 불참 16", note: "같은 warp에서 짝수 번호만 덧셈을 한다면 홀수 lane은 그 명령에 참여하지 않습니다. 빈칸의 lane이 틀린 것이 아니라 자기 조건을 지킨 것입니다." },
  { label: "갈라진 경로를 나눠 실행", summary: "경로마다 한 줄", note: "홀수 쪽에 할 일이 따로 있다면(가정) 두 경로를 나눠 실행하는 비용이 생길 수 있습니다. 비용이 생겨도 각자의 조건을 지킨 결과는 올바를 수 있습니다." },
  { label: "block 안 번호로 lane 찾기", summary: "37 = 32 + 5 → lane 5", note: "Block 64 threads는 warp 두 개입니다. Thread 37은 앞의 32개를 지나 5칸 더 간 자리여서 두 번째 warp의 lane 5입니다. 이 규칙은 block 안의 선형 번호에 적용합니다." },
] as const;

function Row({ title, colorOf, ring }: { title: string; colorOf: (lane: number) => string | null; ring?: number | null }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold">{title}</p>
      <LaneStrip colorOf={colorOf} ring={ring ?? null} />
    </div>
  );
}

export default function LaneMaskViz() {
  return (
    <SceneShell
      eyebrow="Lane과 조건"
      title="같은 warp여도 조건에 따라 일부 lane만 명령에 참여할 수 있습니다"
      description="가로 한 줄이 한 warp의 32 lane이고 왼쪽 끝이 lane 0입니다. 칠한 칸이 참여하는 lane, 빈칸이 참여하지 않는 lane입니다."
      ariaLabel="warp lane의 조건별 참여와 thread 37의 lane 위치"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <div className="space-y-3">
              <Row title="첫 번째 warp · thread 0–31" colorOf={() => "#94a3b8"} />
              <Row title="두 번째 warp · thread 32–63" colorOf={(lane) => (lane === 5 ? "#dc2626" : BLUE)} ring={5} />
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">빨간 칸: thread 37 · 두 번째 warp의 lane 5. 이 장면의 색은 참여 여부가 아니라 위치 표시입니다.</p>
            </div>
          );
        }
        return (
          <div className="space-y-3">
            <Row title={active === 0 ? "한 warp · 한 명령" : "덧셈 명령 · 짝수 lane"} colorOf={(lane) => (active === 0 || lane % 2 === 0 ? BLUE : null)} />
            {active === 2 ? <Row title="다른 경로의 명령 · 홀수 lane (가정)" colorOf={(lane) => (lane % 2 === 1 ? AMBER : null)} /> : <div className="invisible"><Row title="자리" colorOf={() => null} /></div>}
            <p className="text-xs leading-6 text-muted-foreground">{active === 0 ? "lane 0부터 lane 31까지 모두 같은 명령을 진행" : active === 1 ? "lane 0, 2, 4 … 30만 덧셈" : "한 줄이 명령 하나이므로 줄이 늘어납니다"}</p>
          </div>
        );
      }}
    />
  );
}
