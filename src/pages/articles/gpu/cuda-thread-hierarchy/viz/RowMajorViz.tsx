import SceneShell from "./SceneShell";

/**
 * 본문 대응: #indexing-2d — 너비 5·높이 3, 행 2·열 3.
 * 2×5+3 = 13번, 13×4 = 52바이트. 너비와 높이를 바꾸면 2×3+3 = 9.
 * 행 여백의 칸 크기는 그림의 가정이며 숫자를 주지 않는다.
 */
const W = 5;
const H = 3;
const CELL = 21;
const PAD = 8;
const LEFT = 10;
const GRID_X = 118;
const GRID_Y = 22;
const GRID_CELL = 28;
const STRIP_Y = 150;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const INK = "#64748b";
const LINE = "#94a3b8";

interface Scene {
  label: string;
  summary: string;
  note: string;
  passed: number;
  target: number;
  targetColor: string;
  pitch: boolean;
  bytes: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "두 축을 각각 검사", summary: "행 2 < 3 · 열 3 < 5", passed: 0, target: 13, targetColor: BLUE, pitch: false, bytes: false, note: "행과 열은 둘 다 0부터 셉니다. 먼저 행 2가 높이 3보다 작은지, 열 3이 너비 5보다 작은지를 따로 검사합니다." },
  { label: "앞선 행을 건너뜀", summary: "2 × 5 = 10칸", passed: 10, target: -1, targetColor: BLUE, pitch: false, bytes: false, note: "메모리에는 행 경계 표시 없이 한 줄로 이어져 있습니다. 행 0과 행 1을 지나면 원소 5개씩 10칸을 건너뜁니다." },
  { label: "그 행 안에서 열만큼 이동", summary: "10 + 3 = 13번", passed: 10, target: 13, targetColor: BLUE, pitch: false, bytes: false, note: "행 2의 시작인 10번에서 열 번호 3만큼 더 가면 원소 13번입니다." },
  { label: "원소 번호와 바이트 위치", summary: "13 × 4 = 52바이트", passed: 13, target: 13, targetColor: AMBER, pitch: false, bytes: true, note: "원소 번호 13과 바이트 위치는 다릅니다. 원소 하나가 4바이트라면 시작점에서 52바이트 떨어져 있습니다." },
  { label: "행마다 여백이 있으면", summary: "행 간격을 그대로 사용", passed: 10, target: 13, targetColor: AMBER, pitch: true, bytes: false, note: "cudaMallocPitch처럼 행마다 여백이 있으면 52바이트 계산이 맞지 않습니다. 너비×원소 크기 대신 반환된 실제 행 간격을 씁니다. 빗금의 크기는 그림의 가정입니다." },
  { label: "너비와 높이를 바꾸면", summary: "2 × 3 + 3 = 9번 (오답)", passed: 6, target: 9, targetColor: RED, pitch: false, bytes: false, note: "너비 자리에 높이 3을 넣으면 9번을 가리킵니다. 위 표에서 9번은 행 1·열 4이므로 다른 칸입니다." },
];

function stripX(index: number, pitch: boolean) {
  const row = Math.floor(index / W);
  return LEFT + index * CELL + (pitch ? row * PAD : 0);
}

export default function RowMajorViz() {
  return (
    <SceneShell
      eyebrow="행 우선 저장"
      title="표의 행 2·열 3은 한 줄 메모리의 13번입니다"
      description="위는 너비 5·높이 3의 표이고 아래는 같은 칸이 메모리에 놓인 한 줄입니다. 칸 안의 숫자는 원소 번호입니다."
      ariaLabel="이차원 표의 칸을 일차원 메모리 번호와 바이트 위치로 바꾸는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fill = (index: number) => {
          if (index === scene.target) return scene.targetColor;
          if (index < scene.passed) return "#94a3b8";
          return "none";
        };
        const text = (index: number) => (index === scene.target || index < scene.passed ? "#ffffff" : INK);
        const lastX = stripX(14, scene.pitch) + CELL;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: W }, (_, col) => (
              <text key={col} x={GRID_X + col * GRID_CELL + GRID_CELL / 2} y={GRID_Y - 6} textAnchor="middle" fontSize={12} fill={INK}>열 {col}</text>
            ))}
            {Array.from({ length: H }, (_, row) => (
              <text key={row} x={GRID_X - 8} y={GRID_Y + row * GRID_CELL + 18} textAnchor="end" fontSize={12} fill={INK}>행 {row}</text>
            ))}
            {Array.from({ length: W * H }, (_, index) => {
              const x = GRID_X + (index % W) * GRID_CELL;
              const y = GRID_Y + Math.floor(index / W) * GRID_CELL;
              return (
                <g key={index}>
                  <rect x={x} y={y} width={GRID_CELL} height={GRID_CELL} fill={fill(index)} stroke={LINE} strokeWidth={1} />
                  <text x={x + GRID_CELL / 2} y={y + 18} textAnchor="middle" fontSize={12} fontWeight={index === scene.target ? 700 : 400} fill={text(index)}>{index}</text>
                </g>
              );
            })}
            <text x={LEFT} y={STRIP_Y - 8} fontSize={12} fill={INK}>메모리 한 줄</text>
            {Array.from({ length: W * H }, (_, index) => {
              const x = stripX(index, scene.pitch);
              return (
                <g key={index}>
                  <rect x={x} y={STRIP_Y} width={CELL} height={24} fill={fill(index)} stroke={LINE} strokeWidth={1} />
                  <text x={x + CELL / 2} y={STRIP_Y + 16} textAnchor="middle" fontSize={11} fontWeight={index === scene.target ? 700 : 400} fill={text(index)}>{index}</text>
                </g>
              );
            })}
            {scene.pitch && [0, 1, 2].map((row) => {
              const x = stripX(row * W + W - 1, true) + CELL;
              return (
                <g key={row}>
                  <rect x={x} y={STRIP_Y} width={PAD} height={24} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="2 2" />
                  <line x1={x} x2={x + PAD} y1={STRIP_Y + 24} y2={STRIP_Y} stroke={AMBER} strokeWidth={1} />
                </g>
              );
            })}
            {scene.pitch && (
              <text x={LEFT} y={STRIP_Y + 44} fontSize={12} fontWeight={700} fill={AMBER}>바이트 위치 = 행 × 행 간격 + 열 × 원소 크기</text>
            )}
            {scene.bytes && (
              <g>
                <line x1={LEFT} x2={stripX(13, false)} y1={STRIP_Y + 32} y2={STRIP_Y + 32} stroke={AMBER} strokeWidth={1} />
                <line x1={LEFT} x2={LEFT} y1={STRIP_Y + 26} y2={STRIP_Y + 38} stroke={AMBER} strokeWidth={1} />
                <line x1={stripX(13, false)} x2={stripX(13, false)} y1={STRIP_Y + 26} y2={STRIP_Y + 38} stroke={AMBER} strokeWidth={1} />
                <text x={(LEFT + stripX(13, false)) / 2} y={STRIP_Y + 52} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>앞선 13칸 × 4바이트 = 52바이트</text>
              </g>
            )}
            {!scene.pitch && !scene.bytes && scene.passed > 0 && (
              <g>
                <line x1={LEFT} x2={Math.min(stripX(scene.passed, false), lastX)} y1={STRIP_Y + 32} y2={STRIP_Y + 32} stroke={INK} strokeWidth={1} />
                <text x={LEFT} y={STRIP_Y + 50} fontSize={12} fill={INK}>{scene.target === 9 ? "2 × 3 = 6칸만 건너뜀" : "앞선 두 행 2 × 5 = 10칸"}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
