import SceneShell from "./SceneShell";
import VectorPath from "./VectorPath";

/**
 * 본문 대응: #case — 네 규칙의 방향으로 1, 2, 3, 4를 이어 붙이면 끝점이 결과입니다.
 * (10,0), (−2,2), (−2,0), (−2,−2). 입력이 모두 1이면 둘째 규칙의 끝점은 (0,0)입니다.
 */
type Way = "right" | "down" | "left" | "up";
const WAY: Record<Way, { dx: number; dy: number; glyph: string }> = {
  right: { dx: 1, dy: 0, glyph: "→" },
  down: { dx: 0, dy: -1, glyph: "↓" },
  left: { dx: -1, dy: 0, glyph: "←" },
  up: { dx: 0, dy: 1, glyph: "↑" },
};

const SCENES: { label: string; summary: string; note: string; ways: Way[]; values: number[]; end: string; stagger: number }[] = [
  { label: "규칙 1 · 돌리지 않음", summary: "1+2+3+4 → (10, 0)", ways: ["right", "right", "right", "right"], values: [1, 2, 3, 4], end: "(10, 0)", stagger: 0, note: "네 값이 모두 오른쪽을 향합니다. 길이가 그대로 쌓여 끝점은 가로 10, 세로 0입니다." },
  { label: "규칙 2 · 한 칸에 90도", summary: "1−3, −2+4 → (−2, 2)", ways: ["right", "down", "left", "up"], values: [1, 2, 3, 4], end: "(−2, 2)", stagger: 0, note: "한 칸마다 오른쪽에서 아래쪽으로 90도씩 돕니다. 왼쪽 3이 오른쪽 1을, 위 4가 아래 2를 넘어갑니다." },
  { label: "규칙 3 · 한 칸에 180도", summary: "1−2+3−4 → (−2, 0)", ways: ["right", "left", "right", "left"], values: [1, 2, 3, 4], end: "(−2, 0)", stagger: 13, note: "오른쪽과 왼쪽을 번갈아 가므로 세로는 생기지 않습니다. 같은 선을 오가는 화살표는 겹치지 않게 화면에서만 내려 그렸습니다." },
  { label: "규칙 4 · 한 칸에 270도", summary: "1−3, 2−4 → (−2, −2)", ways: ["right", "up", "left", "down"], values: [1, 2, 3, 4], end: "(−2, −2)", stagger: 0, note: "아래쪽으로 270도 돌면 위쪽을 향합니다. 규칙 2와 가로는 같고 세로 부호만 반대입니다." },
  { label: "입력이 모두 1이면", summary: "규칙 2 → (0, 0)", ways: ["right", "down", "left", "up"], values: [1, 1, 1, 1], end: "제자리 (0, 0)", stagger: 0, note: "오른쪽과 왼쪽, 위와 아래가 상쇄되어 출발점으로 돌아옵니다. 규칙 3과 4도 0이고 첫 합 4에만 값이 남습니다." },
];

export default function DirectionRulesViz() {
  return (
    <SceneShell
      eyebrow="회전 규칙"
      title="값을 화살표로 이어 붙이면 끝점이 그 규칙의 결과입니다"
      description="화살표 길이는 기록한 값, 방향은 규칙이 정합니다. 앞 화살표의 끝에서 다음 화살표를 시작하면 파란 끝점이 가로·세로 합입니다."
      ariaLabel="네 회전 규칙에서 값 1, 2, 3, 4를 이어 붙인 경로와 끝점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const steps = scene.ways.map((way, index) => ({
          dx: WAY[way].dx * scene.values[index],
          dy: WAY[way].dy * scene.values[index],
          label: active === SCENES.length - 1 ? "" : String(scene.values[index]),
        }));
        return (
          <div className="min-w-0">
            <VectorPath steps={steps} width={360} height={192} originX={104} originY={96} unit={22} stagger={scene.stagger} endLabel={scene.end} endBelow={active === 0} ariaLabel={`${scene.label}: ${scene.summary}`} />
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs leading-5">
              {scene.ways.map((way, index) => (
                <div key={index} className="rounded-lg border border-border bg-background px-1 py-1.5">
                  <span className="block text-muted-foreground">위치 {index}</span>
                  <span className="block font-semibold">{WAY[way].glyph} {scene.values[index]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
