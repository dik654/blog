import SceneShell from "./SceneShell";

/**
 * 본문 대응: #strategies Parameter isolation — Progressive Networks는 이전 column을 얼리고
 * 새 column을 추가하며, lateral connection으로만 이전 column의 feature를 참조한다.
 * 층 수 3은 그림을 위한 가정이다. column 수 = 학습한 task 수.
 */
const LAYERS = 3;
const COLS = 3;

const SCENES = [
  {
    label: "Task 1",
    summary: "column 1개",
    note: "첫 task는 column 하나(층 3개, 가정)로 학습합니다. 아직 다른 column이 없어 평범한 network와 같습니다.",
  },
  {
    label: "Task 2",
    summary: "column 1 동결 · column 2 추가",
    note: "Column 1은 값이 바뀌지 않게 얼립니다. 새 column 2만 학습하고, 파란 화살표(lateral connection)로 column 1의 각 층 feature를 column 2의 다음 층 입력으로 받아 참조만 합니다. 그래서 task 1의 parameter가 덮어써질 일이 없습니다.",
  },
  {
    label: "Task 3",
    summary: "column 3개 · 이전 두 column 모두 참조",
    note: "Task가 하나 늘 때마다 column도 하나 늘고, 새 column은 앞선 모든 column에서 lateral connection을 받습니다. forgetting을 구조로 막는 대가로 task 수만큼 parameter와 연산량이 늘어납니다.",
  },
] as const;

const W = 360;
const H = 216;
const COL_W = 64;
const BOX_H = 28;
const colX = (c: number) => 36 + c * 112;
const layerY = (l: number) => 160 - l * 56;

export default function ProgressiveColumnsViz() {
  return (
    <SceneShell
      eyebrow="Parameter isolation"
      title="Progressive Networks는 task마다 column을 하나씩 붙입니다"
      description="Parameter isolation은 task마다 다른 parameter를 써서 간섭을 아예 없애는 전략이고, Progressive Networks가 그 예입니다. 세로 기둥 하나가 한 task용 network(column)이고, 칸 하나가 층입니다. 회색 칸은 얼린 column, 파란 칸은 지금 학습하는 column입니다. 층 수 3은 그림을 위한 가정입니다."
      ariaLabel="Progressive Networks에서 task가 늘 때 column이 추가되고 이전 column이 동결되는 과정"
      scenes={SCENES}
      render={(active) => {
        const visible = active + 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id="pn-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 z" fill="#2563eb" />
              </marker>
            </defs>
            {Array.from({ length: COLS }, (_, c) => {
              const shown = c < visible;
              const training = c === active;
              const stroke = !shown ? "#cbd5e1" : training ? "#2563eb" : "#64748b";
              const fill = !shown ? "none" : training ? "#dbeafe" : "#e2e8f0";
              return (
                <g key={c} opacity={shown ? 1 : 0.5}>
                  {Array.from({ length: LAYERS }, (_, l) => (
                    <rect key={l} x={colX(c)} y={layerY(l)} width={COL_W} height={BOX_H} rx={4} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={shown ? undefined : "3 3"} />
                  ))}
                  {Array.from({ length: LAYERS - 1 }, (_, l) => (
                    <line key={l} x1={colX(c) + COL_W / 2} x2={colX(c) + COL_W / 2} y1={layerY(l)} y2={layerY(l + 1) + BOX_H} stroke={stroke} strokeWidth={1} />
                  ))}
                  <text x={colX(c) + COL_W / 2} y={206} textAnchor="middle" fontSize={11} fontWeight={700} fill={shown ? "#334155" : "#94a3b8"}>
                    column {c + 1}
                  </text>
                  <text x={colX(c) + COL_W / 2} y={layerY(LAYERS - 1) - 8} textAnchor="middle" fontSize={11} fill={shown ? (training ? "#2563eb" : "#475569") : "#94a3b8"}>
                    {!shown ? "아직 없음" : training ? "학습 중" : "동결"}
                  </text>
                </g>
              );
            })}
            {Array.from({ length: visible }, (_, target) =>
              Array.from({ length: target }, (_, source) =>
                Array.from({ length: LAYERS - 1 }, (_, l) => {
                  const x1 = colX(source) + COL_W;
                  const y1 = layerY(l) + BOX_H / 2;
                  const x2 = colX(target) - 2;
                  const skip = target - source > 1;
                  const y2 = layerY(l + 1) + BOX_H / 2 + (skip ? 7 : -5);
                  const gapY = layerY(l) - 14;
                  const d = skip
                    ? `M${x1},${y1} L${colX(source + 1) - 12},${gapY} L${x2 - 18},${gapY} L${x2},${y2}`
                    : `M${x1},${y1} L${x2},${y2}`;
                  return (
                    <path
                      key={`${source}-${target}-${l}`}
                      d={d}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={1}
                      strokeDasharray={skip ? "4 2" : undefined}
                      opacity={target === active ? 0.9 : 0.35}
                      markerEnd="url(#pn-arrow)"
                    />
                  );
                }),
              ),
            )}
          </svg>
        );
      }}
    />
  );
}
