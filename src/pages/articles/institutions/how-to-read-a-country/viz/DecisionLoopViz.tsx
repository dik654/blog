import Arrow from "./Arrow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box 둘째 문단 — 규칙 결정 → 비용 → 생산·소비 → 돈과 표 → 다음 결정의 반복.
 */
const NODES = [
  { x: 14, y: 16, lines: ["규칙을 바꾸는", "결정"] },
  { x: 206, y: 16, lines: ["가게와 가계가", "내는 비용"] },
  { x: 206, y: 136, lines: ["생산과 소비"] },
  { x: 14, y: 136, lines: ["결과를 본 사람들의", "돈과 표"] },
] as const;
const NODE_W = 140;
const NODE_H = 56;

const SCENES = [
  { label: "결정", summary: "규칙이 바뀝니다", note: "출발은 규칙을 바꾸는 결정입니다." },
  { label: "비용", summary: "결정 → 비용", note: "그 결정이 가게와 가계가 내는 비용을 바꿉니다." },
  { label: "생산과 소비", summary: "비용 → 생산·소비", note: "바뀐 비용은 무엇을 얼마나 만들고 쓰는지를 바꿉니다." },
  { label: "돈과 표", summary: "결과 → 돈과 표", note: "달라진 결과를 본 사람들이 다시 돈과 표를 움직입니다." },
  { label: "다음 결정", summary: "한 줄이 아니라 고리입니다", note: "움직인 돈과 표가 다음 결정을 바꿉니다. 결과가 출발점으로 돌아오므로 한 방향의 순서로 끝나지 않습니다." },
] as const;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";

export default function DecisionLoopViz() {
  return (
    <SceneShell
      eyebrow="결정과 결과의 반복"
      title="결과가 다음 결정으로 돌아옵니다"
      description="네 칸이 차례로 서로를 바꿉니다. 마지막 화살표가 처음 칸으로 돌아오는 것을 보세요."
      ariaLabel="규칙 결정, 비용, 생산과 소비, 돈과 표가 고리를 이루는 그림"
      scenes={SCENES}
      render={(active) => {
        const arrows = [
          { x1: 154, y1: 44, x2: 206, y2: 44 },
          { x1: 276, y1: 72, x2: 276, y2: 136 },
          { x1: 206, y1: 164, x2: 154, y2: 164 },
          { x1: 84, y1: 136, x2: 84, y2: 72 },
        ];
        const currentNode = active === 4 ? 0 : active;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {arrows.map((a, i) => {
              const reached = i < active;
              return <Arrow key={i} {...a} color={i === active - 1 ? ACCENT : LINE} opacity={reached ? 1 : 0.3} />;
            })}
            {NODES.map((node, i) => {
              const seen = i <= active;
              const current = i === currentNode;
              return (
                <g key={i} opacity={seen ? 1 : 0.35}>
                  <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke={current ? ACCENT : LINE} strokeWidth={current ? 1.25 : 1} />
                  {node.lines.map((line, l) => (
                    <text
                      key={line}
                      x={node.x + NODE_W / 2}
                      y={node.y + NODE_H / 2 + 4 + (l - (node.lines.length - 1) / 2) * 17}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={current ? 700 : 500}
                      fill="currentColor"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
