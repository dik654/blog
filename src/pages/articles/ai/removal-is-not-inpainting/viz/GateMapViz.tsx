import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-stage-rejected — 다시 그리기에 여는 세 문(구멍 전체 / 경계 띠만 / 경계 띠 + 픽셀별 시작 시각)과
 * "어디를 바꿀지는 강제하지만 무엇을 그릴지는 강제하지 않는다"는 본문 설명.
 * 띠의 폭·위치와 셋째 문의 칸별 값 배치는 그림용 가정이다. 측정값은 본문 그대로(3D 93.2)만 쓴다.
 */
const SCENES = [
  {
    label: "문 1 · 구멍 전체",
    summary: "전용 망이 비운 자리 전부를 다시 그림",
    note: "첫 단계의 전용 망이 띠를 지운 자리(구멍)를 확산 모델이 통째로 다시 그릴 수 있습니다. 확산 모델이 단독으로 실패했던 방식과 같은 범위입니다.",
  },
  {
    label: "문 2 · 경계 띠만",
    summary: "이음새만 열고 안쪽은 잠금",
    note: "구멍 가장자리를 따라 좁은 띠만 다시 그릴 수 있게 열고, 구멍 안쪽은 전용 망의 결과를 그대로 둡니다.",
  },
  {
    label: "문 3 · 경계 띠 + 시작 시각",
    summary: "마스크 값 → 픽셀마다 다른 시작 시각",
    note: "경계 띠 안에서도 마스크 값으로 픽셀마다 다시 그리기를 시작하는 시각을 다르게 줍니다. 이론상으로는 경계만 보고 안쪽은 건드릴 수 없어야 합니다.",
  },
  {
    label: "어디는 정했지만 무엇은 못 정함",
    summary: "3D: 마스크 안 93.2 = 흰 띠를 새로 그림",
    note: "이 방식은 어디를 바꿀지는 강제하지만 무엇을 그릴지는 강제하지 않습니다. 경계 띠에서 시작한 생성이 안쪽으로 번질 여지가 남아 있었고, 그 여지를 \"여기 뭔가 있어야 한다\"는 사전지식이 채웠습니다.",
  },
] as const;

const W = 360;
const H = 200;
/** 인물 허리를 가로지르던 띠가 지워진 자리(구멍) — 그림용 */
const HOLE = { x: 70, y: 74, w: 220, h: 44 };
const RING = 10;
const OPEN = "#d97706";
const LOCK = "#64748b";
const SPILL = "#dc2626";
const MUTED = "#64748b";
/** 문 3의 칸별 시작 시각 음영 — 값 배치는 가정 */
const SHADES = [0.25, 0.45, 0.65, 0.85];

const STEP = 20;
const OUTER = { x: HOLE.x - RING, y: HOLE.y - RING, w: HOLE.w + 2 * RING, h: HOLE.h + 2 * RING };
const COLUMNS = Math.ceil(OUTER.w / STEP);
/** 경계 띠를 칸으로 나눈 좌표 — 위·아래 줄과 좌·우 끝 */
const RING_CELLS = [
  ...Array.from({ length: COLUMNS }, (_, c) => {
    const cx = OUTER.x + c * STEP;
    const w = Math.min(STEP, OUTER.x + OUTER.w - cx);
    return [
      { x: cx, y: OUTER.y, w, h: 2 * RING },
      { x: cx, y: HOLE.y + HOLE.h - RING, w, h: 2 * RING },
    ];
  }).flat(),
  { x: OUTER.x, y: HOLE.y + RING, w: 2 * RING, h: HOLE.h - 2 * RING },
  { x: HOLE.x + HOLE.w - RING, y: HOLE.y + RING, w: 2 * RING, h: HOLE.h - 2 * RING },
];

function RingCells() {
  return (
    <>
      {RING_CELLS.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill={OPEN} opacity={SHADES[i % SHADES.length]} />
      ))}
    </>
  );
}

export default function GateMapViz() {
  return (
    <SceneShell
      eyebrow="세 문의 자리"
      title="다시 그리기에 어디를 열어 주었나"
      description="가운데 사각형이 전용 망이 띠를 지운 자리(구멍)입니다. 주황 = 다시 그리기가 바꿀 수 있는 곳, 회색 빗금 = 잠근 곳. 띠의 폭과 위치는 그림용 가정입니다."
      ariaLabel="2단계 조합에서 다시 그리기에 여는 세 가지 문의 공간 배치"
      scenes={SCENES}
      render={(active) => {
        const ringOuter = OUTER;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <pattern id="gate-lock-hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1={0} y1={0} x2={0} y2={6} stroke={LOCK} strokeWidth={1} opacity={0.5} />
              </pattern>
            </defs>
            <rect x={20} y={20} width={320} height={150} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
            <text x={28} y={36} fontSize={11} fill={MUTED}>
              이미지
            </text>
            {active === 0 && <rect x={HOLE.x} y={HOLE.y} width={HOLE.w} height={HOLE.h} fill={OPEN} opacity={0.55} />}
            {active >= 1 && (
              <>
                <rect x={HOLE.x + RING} y={HOLE.y + RING} width={HOLE.w - 2 * RING} height={HOLE.h - 2 * RING} fill="url(#gate-lock-hatch)" />
                {active === 1 ? (
                  <path
                    d={`M${ringOuter.x},${ringOuter.y} h${ringOuter.w} v${ringOuter.h} h${-ringOuter.w} Z M${HOLE.x + RING},${HOLE.y + RING} v${HOLE.h - 2 * RING} h${HOLE.w - 2 * RING} v${-(HOLE.h - 2 * RING)} Z`}
                    fill={OPEN}
                    opacity={0.55}
                    fillRule="evenodd"
                  />
                ) : (
                  <RingCells />
                )}
              </>
            )}
            <rect x={HOLE.x} y={HOLE.y} width={HOLE.w} height={HOLE.h} fill="none" stroke="#0f172a" strokeWidth={1} strokeDasharray="4 3" />
            {active === 3 && (
              <>
                {[110, 180, 250].map((cx) => (
                  <g key={cx}>
                    <line x1={cx} y1={HOLE.y + 4} x2={cx} y2={HOLE.y + HOLE.h / 2 - 4} stroke={SPILL} strokeWidth={1.25} />
                    <path d={`M${cx - 3},${HOLE.y + HOLE.h / 2 - 8} L${cx},${HOLE.y + HOLE.h / 2 - 3} L${cx + 3},${HOLE.y + HOLE.h / 2 - 8}`} fill="none" stroke={SPILL} strokeWidth={1.25} />
                  </g>
                ))}
                <text x={HOLE.x + HOLE.w / 2} y={HOLE.y + HOLE.h / 2 + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={SPILL}>
                  안쪽으로 번짐 → 흰 띠
                </text>
              </>
            )}
            <text x={28} y={160} fontSize={11} fontWeight={700} fill={active === 3 ? SPILL : OPEN}>
              {active === 0 && "열린 곳: 구멍 전체"}
              {active === 1 && "열린 곳: 가장자리 띠 · 안쪽 잠금"}
              {active === 2 && "열린 곳: 가장자리 띠 · 칸마다 시작 시각 다름(배치 가정)"}
              {active === 3 && "정한 것은 시작 위치, 정하지 못한 것은 내용"}
            </text>
            <text x={HOLE.x} y={HOLE.y - RING - 6} fontSize={11} fill={MUTED}>
              구멍 = 전용 망이 띠를 지운 자리
            </text>
          </svg>
        );
      }}
    />
  );
}
