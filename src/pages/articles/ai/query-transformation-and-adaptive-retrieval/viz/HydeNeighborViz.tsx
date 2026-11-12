import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hyde — 질문 → 가상 답변 → 가상 답변의 임베딩 → 실제 문서 검색.
 * 점의 위치는 평면에 그린 모식(가정)이며, 이웃 수 2개도 가정이다.
 * 이웃은 아래 좌표에서 유클리드 거리로 실제 계산해 고른다.
 */
type Point = { x: number; y: number };

const RELEVANT: readonly Point[] = [
  { x: 240, y: 70 },
  { x: 262, y: 58 },
  { x: 275, y: 82 },
  { x: 252, y: 96 },
  { x: 290, y: 104 },
  { x: 226, y: 92 },
];
const OTHER: readonly Point[] = [
  { x: 60, y: 140 },
  { x: 88, y: 160 },
  { x: 40, y: 168 },
  { x: 318, y: 160 },
  { x: 296, y: 176 },
  { x: 140, y: 118 },
];
const DOCS: readonly Point[] = [...RELEVANT, ...OTHER];
const QUESTION: Point = { x: 44, y: 62 };
const HYPO: Point = { x: 258, y: 78 };
const NOTE_BOX = { x: 112, y: 22, w: 54, h: 50 };
const K = 2;

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const nearest = (from: Point, count: number) =>
  [...DOCS].sort((a, b) => dist(from, a) - dist(from, b)).slice(0, count);
const QUESTION_NEAREST = nearest(QUESTION, 1)[0];
const HYPO_NEAREST = nearest(HYPO, K);

const SCENES = [
  {
    label: "질문을 그대로 임베딩",
    summary: "① 질문",
    note: "짧은 질문이 문서 문체와 너무 다르면 질문 점이 관련 문서 무리에서 떨어져 있을 수 있습니다. 이 모식에서 질문에 가장 가까운 점(점선)은 다른 주제 문서입니다.",
  },
  {
    label: "가상 답변을 먼저 씀",
    summary: "② 질문 → 가상 답변",
    note: "언어 모델이 그럴듯한 답변 문서를 먼저 씁니다. 저자들도 인정하듯 잘못된 세부 내용이 들어갈 수 있습니다(빨간 점선 줄).",
  },
  {
    label: "가상 답변을 임베딩",
    summary: "③ 가상 답변 → 벡터",
    note: "저자들은 비지도 대조학습 인코더의 좁은 벡터 표현이 관련성 방향은 남기고 틀린 세부를 약하게 만든다고 설명합니다. 사실 검증이 아니라 검색 이웃을 찾기 위한 가정입니다.",
  },
  {
    label: "가까운 실제 문서 검색",
    summary: `④ 벡터 → 실제 문서 ${K}건`,
    note: "가상 답변의 점에서 가장 가까운 실제 문서를 찾습니다. 답의 근거는 이렇게 찾은 실제 문서이며, 가상 답변 문장 자체를 근거로 답해서는 안 됩니다.",
  },
] as const;

const W = 360;
const H = 200;
const DOC = "#94a3b8";
const ACCENT = "#d97706";
const Q_COLOR = "#334155";
const PICK = "#2563eb";
const FAIL = "#dc2626";
const MUTED = "#64748b";

export default function HydeNeighborViz() {
  return (
    <SceneShell
      eyebrow="HyDE · 검색 순서"
      title="가상 답변은 답이 아니라 실제 문서 근처로 가는 좌표로 쓰입니다"
      description="점 하나는 문장 하나의 임베딩(뜻이 비슷할수록 가깝게 놓이는 숫자 벡터)입니다. 회색 점은 실제 문서, 네모는 질문, 마름모는 가상 답변의 임베딩이며 위치와 찾는 문서 수 2건은 평면에 줄여 그린 모식(가정)입니다."
      ariaLabel="질문, 가상 답변, 가상 답변의 임베딩, 가까운 실제 문서 검색의 네 단계"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          <ellipse cx={258} cy={82} rx={52} ry={40} fill="none" stroke={DOC} strokeWidth={1} strokeDasharray="3 3" />
          <text x={258} y={136} textAnchor="middle" fontSize={11} fill={MUTED}>
            관련 문서 무리
          </text>
          <text x={8} y={194} fontSize={11} fill={MUTED}>
            다른 주제 문서
          </text>

          {active === 0 && (
            <line
              x1={QUESTION.x}
              y1={QUESTION.y}
              x2={QUESTION_NEAREST.x}
              y2={QUESTION_NEAREST.y}
              stroke={Q_COLOR}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {DOCS.map((d) => {
            const picked = active === 3 && HYPO_NEAREST.includes(d);
            return (
              <g key={`${d.x}-${d.y}`}>
                <circle cx={d.x} cy={d.y} r={4} fill={picked ? PICK : DOC} />
                {picked && <circle cx={d.x} cy={d.y} r={8} fill="none" stroke={PICK} strokeWidth={1.25} />}
              </g>
            );
          })}

          <rect x={QUESTION.x - 5} y={QUESTION.y - 5} width={10} height={10} fill={Q_COLOR} />
          <text x={QUESTION.x} y={QUESTION.y - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill={Q_COLOR}>
            질문
          </text>

          {active >= 1 && (
            <g>
              <line x1={QUESTION.x + 7} y1={QUESTION.y - 6} x2={NOTE_BOX.x - 4} y2={NOTE_BOX.y + 20} stroke={ACCENT} strokeWidth={1} />
              <text x={(QUESTION.x + NOTE_BOX.x) / 2} y={NOTE_BOX.y + 4} textAnchor="middle" fontSize={11} fill={ACCENT}>
                언어 모델
              </text>
              <rect x={NOTE_BOX.x} y={NOTE_BOX.y} width={NOTE_BOX.w} height={NOTE_BOX.h} rx={3} fill="none" stroke={ACCENT} strokeWidth={1} />
              {[0, 1, 2, 3].map((row) => (
                <line
                  key={row}
                  x1={NOTE_BOX.x + 7}
                  x2={NOTE_BOX.x + NOTE_BOX.w - (row === 3 ? 18 : 7)}
                  y1={NOTE_BOX.y + 11 + row * 10}
                  y2={NOTE_BOX.y + 11 + row * 10}
                  stroke={row === 2 ? FAIL : DOC}
                  strokeWidth={row === 2 ? 1.25 : 1}
                  strokeDasharray={row === 2 ? "3 2" : undefined}
                />
              ))}
              <text x={NOTE_BOX.x + NOTE_BOX.w / 2} y={NOTE_BOX.y + NOTE_BOX.h + 12} textAnchor="middle" fontSize={11} fill={ACCENT}>
                가상 답변
              </text>
            </g>
          )}

          {active >= 2 && (
            <g>
              <line
                x1={NOTE_BOX.x + NOTE_BOX.w + 2}
                y1={NOTE_BOX.y + 26}
                x2={HYPO.x - 8}
                y2={HYPO.y - 4}
                stroke={ACCENT}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <text x={192} y={36} textAnchor="middle" fontSize={11} fill={ACCENT}>
                임베딩
              </text>
              <polygon
                points={`${HYPO.x},${HYPO.y - 7} ${HYPO.x + 7},${HYPO.y} ${HYPO.x},${HYPO.y + 7} ${HYPO.x - 7},${HYPO.y}`}
                fill={ACCENT}
              />
            </g>
          )}

          {active === 3 &&
            HYPO_NEAREST.map((d) => (
              <line key={`n-${d.x}-${d.y}`} x1={HYPO.x} y1={HYPO.y} x2={d.x} y2={d.y} stroke={PICK} strokeWidth={1} />
            ))}
        </svg>
      )}
    />
  );
}
