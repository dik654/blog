import SceneShell from "./SceneShell";

/**
 * 본문 대응: #visibility — 네 corner→bbox→clip→visible ratio 순서와 개요의 세 질문.
 * Canvas 100×80, box (60,20)–(100,60). 회전 45°와 회전 중심(box 중심 80,40)은 그림을 위한 가정.
 * 45° 회전: 대각선 두 점 → (80,11.7)·(80,68.3) → 폭 0.
 * 네 corner → bbox (51.7,11.7)–(108.3,68.3), 56.6×56.6.
 * Clip x≤100 → 48.3×56.6, visible ratio 48.3/56.6 ≈ 0.85. 오른쪽 20px 이동 사례는 0.5.
 */
type Pt = readonly [number, number];

const CANVAS_W = 100;
const CANVAS_H = 80;
const CENTER: Pt = [80, 40];
const ANGLE = Math.PI / 4;
const CORNERS: readonly Pt[] = [
  [60, 20],
  [100, 20],
  [100, 60],
  [60, 60],
];

const rotate = ([x, y]: Pt): Pt => {
  const dx = x - CENTER[0];
  const dy = y - CENTER[1];
  return [CENTER[0] + dx * Math.cos(ANGLE) - dy * Math.sin(ANGLE), CENTER[1] + dx * Math.sin(ANGLE) + dy * Math.cos(ANGLE)];
};

const ROTATED = CORNERS.map(rotate);
const DIAG = [ROTATED[0], ROTATED[2]] as const;
const BX0 = Math.min(...ROTATED.map((p) => p[0]));
const BX1 = Math.max(...ROTATED.map((p) => p[0]));
const BY0 = Math.min(...ROTATED.map((p) => p[1]));
const BY1 = Math.max(...ROTATED.map((p) => p[1]));
const VIS_W = Math.min(BX1, CANVAS_W) - BX0;
const RATIO = VIS_W / (BX1 - BX0);

const S = 2.5;
const OX = 40;
const OY = 30;
const sx = (x: number) => OX + x * S;
const sy = (y: number) => OY + y * S;

const BLUE = "#2563eb";
const SLATE = "#64748b";
const GRID = "#94a3b8";
const RED = "#dc2626";
const AMBER = "#d97706";

const SCENES = [
  {
    label: "원래 box의 네 corner",
    summary: "(60,20)–(100,60)",
    note: "개요의 box입니다. 돌리지 않은 box는 왼쪽 위와 오른쪽 아래 두 점만으로도 다시 그릴 수 있습니다.",
  },
  {
    label: "대각선 두 점만 옮기면",
    summary: "bbox 폭 0 · 틀림",
    note: "45°로 돌리면(가정) 두 점이 모두 x=80에 놓여 감싸는 box의 폭이 0입니다. 회색 실선 마름모가 실제 object이고 폭이 있습니다. 회색 점선은 돌리기 전 box입니다.",
  },
  {
    label: "네 corner를 옮긴 뒤 bbox",
    summary: "bbox 56.6 × 56.6",
    note: "네 점을 같은 회전으로 옮기고 x·y의 min·max를 잡습니다. bbox는 점을 모두 감싸는 가장 작은 축 정렬 사각형입니다.",
  },
  {
    label: "Canvas로 clip",
    summary: `${(VIS_W).toFixed(1)} ÷ ${(BX1 - BX0).toFixed(1)} ≈ ${RATIO.toFixed(2)} → 유지`,
    note: "x=100 밖은 잘리고 세로는 다 남습니다. 남은 폭 100−51.7=48.3을 폭 56.6으로 나누면 keep threshold 0.6을 넘습니다.",
  },
  {
    label: "오른쪽 20px 이동 사례",
    summary: "20 ÷ 40 = 0.50 → 유지 안 함",
    note: "개요의 box (80,20)–(120,60)은 x=80–100만 남아 0.5입니다. Threshold 0.6에 못 미쳐 유지하지 않습니다.",
  },
] as const;

const poly = (pts: readonly Pt[]) => pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ");

export default function BoxCornerVisibilityViz() {
  return (
    <SceneShell
      eyebrow="네 corner → bbox → clip"
      title="회전한 box는 두 점이 아니라 네 점에서 다시 만듭니다"
      description="파란 점이 box corner, 바깥 회색 테두리가 100×80 canvas입니다. 회전 각도 45°와 회전 중심(box 중심)은 그림을 위한 가정이고, keep threshold 0.6은 개요의 질문에서 가져왔습니다."
      ariaLabel="box corner를 회전해 bbox를 만들고 canvas로 잘라 visible ratio를 구하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const shifted = active === 4;
        const rect = shifted
          ? { x0: 80, y0: 20, x1: 120, y1: 60 }
          : active >= 2
            ? { x0: BX0, y0: BY0, x1: BX1, y1: BY1 }
            : { x0: 60, y0: 20, x1: 100, y1: 60 };
        const visX1 = Math.min(rect.x1, CANVAS_W);
        const showClip = active >= 3;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 262" className="mx-auto block h-auto w-full max-w-[380px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={sx(0)} y={sy(0)} width={CANVAS_W * S} height={CANVAS_H * S} fill="none" stroke={GRID} strokeWidth={1} />
              <text x={sx(0)} y={sy(0) - 8} fontSize={11} fill={SLATE}>canvas 100×80 · (0,0)</text>
              {showClip && (
                <>
                  <rect x={sx(rect.x0)} y={sy(rect.y0)} width={(visX1 - rect.x0) * S} height={(rect.y1 - rect.y0) * S} fill={BLUE} opacity={0.16} />
                  <rect x={sx(CANVAS_W)} y={sy(rect.y0)} width={(rect.x1 - CANVAS_W) * S} height={(rect.y1 - rect.y0) * S} fill={RED} opacity={0.14} />
                  <line x1={sx(CANVAS_W)} x2={sx(CANVAS_W)} y1={sy(0)} y2={sy(CANVAS_H)} stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />
                  <text x={sx(CANVAS_W) - 4} y={sy(CANVAS_H) + 16} textAnchor="end" fontSize={11} fill={RED}>x=100에서 잘림</text>
                </>
              )}
              {active >= 1 && !shifted && (
                <rect x={sx(60)} y={sy(20)} width={40 * S} height={40 * S} fill="none" stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
              )}
              {active >= 1 && !shifted && <polygon points={poly(ROTATED)} fill="none" stroke={active === 1 ? SLATE : BLUE} strokeWidth={active === 1 ? 1 : 1.25} />}
              {active === 1 && (
                <>
                  <line x1={sx(DIAG[0][0])} y1={sy(DIAG[0][1])} x2={sx(DIAG[1][0])} y2={sy(DIAG[1][1])} stroke={RED} strokeWidth={1.25} />
                  {DIAG.map(([x, y], i) => (
                    <circle key={i} cx={sx(x)} cy={sy(y)} r={4} fill={AMBER} />
                  ))}
                  <text x={sx(DIAG[0][0]) + 8} y={sy(DIAG[0][1]) + 4} fontSize={11} fill={AMBER}>(80, 11.7)</text>
                  <text x={sx(DIAG[1][0]) + 8} y={sy(DIAG[1][1]) + 4} fontSize={11} fill={AMBER}>(80, 68.3)</text>
                  <text x={sx(DIAG[0][0]) - 6} y={sy(40) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={RED}>폭 0</text>
                </>
              )}
              {(active === 0 || active >= 2) && (
                <rect x={sx(rect.x0)} y={sy(rect.y0)} width={(rect.x1 - rect.x0) * S} height={(rect.y1 - rect.y0) * S} fill="none" stroke={BLUE} strokeWidth={1.25} strokeDasharray={active >= 2 && !shifted ? "6 3" : undefined} />
              )}
              {active === 0 &&
                CORNERS.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={3.5} fill={BLUE} />)}
              {active === 0 && (
                <>
                  <text x={sx(60) - 6} y={sy(20) - 6} textAnchor="end" fontSize={11} fill={BLUE}>(60,20)</text>
                  <text x={sx(100) - 6} y={sy(60) + 16} textAnchor="end" fontSize={11} fill={BLUE}>(100,60)</text>
                </>
              )}
              {active >= 2 && !shifted &&
                ROTATED.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={3.5} fill={BLUE} />)}
              {active === 2 && (
                <>
                  <text x={sx(BX0) - 4} y={sy(BY0) - 6} textAnchor="end" fontSize={11} fill={BLUE}>(51.7, 11.7)</text>
                  <text x={sx(BX1)} y={sy(BY1) + 16} textAnchor="end" fontSize={11} fill={BLUE}>(108.3, 68.3)</text>
                </>
              )}
              {shifted && (
                <>
                  <text x={sx(80)} y={sy(20) - 6} fontSize={11} fill={BLUE}>(80,20)</text>
                  <text x={sx(90)} y={sy(40) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>20</text>
                  <text x={sx(110)} y={sy(40) + 4} textAnchor="middle" fontSize={11} fill={RED}>20</text>
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
