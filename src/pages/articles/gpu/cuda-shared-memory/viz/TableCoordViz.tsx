import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 64×64 표, 행을 차례로 저장. 행 37·열 3 → 37×64+3=2371, 출력 행 3·열 37 → 3×64+37=229.
 * 32×32 조각으로 나누면 왼쪽 아래 조각의 행 5·열 3입니다.
 */
const SIZE = 150;
const UNIT = SIZE / 64;
const LX = 16;
const RX = 194;
const Y0 = 28;

const SCENES = [
  { label: "입력의 자리", summary: "행 37 · 열 3", note: "가로와 세로가 각각 64칸인 표에서 값 하나를 고릅니다(가정). 번호는 0부터 시작하고 값은 7이라고 놓습니다." },
  { label: "입력 번호", summary: "37×64+3 = 2371", note: "행을 차례로 이어 저장하므로 앞에 꽉 찬 행 37개와 이 행의 앞 3칸이 먼저 놓입니다. 파란 면적을 세면 2371칸입니다." },
  { label: "출력의 자리", summary: "3×64+37 = 229", note: "행과 열을 바꾸면 행 3·열 37입니다. 앞에 꽉 찬 행 3개와 앞 37칸이 있어 번호는 229입니다. 값 7은 그대로 씁니다." },
  { label: "조각 안 좌표", summary: "전체 (37, 3) → 조각 (5, 3)", note: "32×32칸씩 나누면 행 37은 왼쪽 아래 조각에 들어가고 37−32=5이므로 조각 안에서는 행 5·열 3입니다. 전체 좌표와 조각 좌표를 구별해야 같은 값을 끝까지 찾습니다." },
] as const;

function Marker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill="#d97706" />
      <text x={x + 7} y={y + 4} fontSize={11} fontWeight={700} fill="#d97706">7</text>
    </g>
  );
}

function Filled({ x0, rows, cols }: { x0: number; rows: number; cols: number }) {
  return (
    <g>
      <rect x={x0} y={Y0} width={SIZE} height={rows * UNIT} fill="#2563eb" fillOpacity={0.2} />
      <rect x={x0} y={Y0 + rows * UNIT} width={cols * UNIT} height={UNIT} fill="#2563eb" fillOpacity={0.2} />
    </g>
  );
}

export default function TableCoordViz() {
  return (
    <SceneShell
      eyebrow="표와 번호"
      title="같은 값의 자리를 표 좌표, 저장 번호, 조각 좌표로 읽습니다"
      description="정사각형 하나가 64×64칸 표입니다. 위쪽이 행 0, 왼쪽이 열 0이며 저장 번호는 행을 왼쪽에서 오른쪽으로 이어 셉니다."
      ariaLabel="64칸 표에서 행 37 열 3의 값과 출력 자리, 저장 번호, 조각 좌표"
      scenes={SCENES}
      render={(active) => {
        const pointIn = { x: LX + (3 + 0.5) * UNIT, y: Y0 + (37 + 0.5) * UNIT };
        const pointOut = { x: RX + (37 + 0.5) * UNIT, y: Y0 + (3 + 0.5) * UNIT };
        const zoom = active === 3;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LX} y={18} fontSize={11} fontWeight={700} fill="#64748b">입력 표</text>
            <text x={RX} y={18} fontSize={11} fontWeight={700} fill="#64748b">{zoom ? "왼쪽 아래 조각 확대 (32×32)" : "출력 표"}</text>
            {active === 1 && <Filled x0={LX} rows={37} cols={3} />}
            {active === 2 && <Filled x0={RX} rows={3} cols={37} />}
            {active === 0 && (
              <g>
                <line x1={LX} x2={LX + SIZE} y1={pointIn.y} y2={pointIn.y} stroke="#2563eb" strokeWidth={1} />
                <line x1={pointIn.x} x2={pointIn.x} y1={Y0} y2={Y0 + SIZE} stroke="#2563eb" strokeWidth={1} />
              </g>
            )}
            {zoom && <rect x={LX} y={Y0 + 32 * UNIT} width={32 * UNIT} height={32 * UNIT} fill="#2563eb" fillOpacity={0.15} stroke="#2563eb" strokeWidth={1} />}
            {zoom && (
              <g>
                <line x1={LX + 32 * UNIT} x2={LX + 32 * UNIT} y1={Y0} y2={Y0 + SIZE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={LX} x2={LX + SIZE} y1={Y0 + 32 * UNIT} y2={Y0 + 32 * UNIT} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              </g>
            )}
            <rect x={LX} y={Y0} width={SIZE} height={SIZE} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <rect x={RX} y={Y0} width={SIZE} height={SIZE} fill={zoom ? "#2563eb" : "none"} fillOpacity={zoom ? 0.06 : 0} stroke={zoom ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
            {active !== 2 && <Marker x={pointIn.x} y={pointIn.y} />}
            {active === 2 && <Marker x={pointOut.x} y={pointOut.y} />}
            {active === 0 && <text x={LX + SIZE} y={pointIn.y - 4} textAnchor="end" fontSize={10} fill="#2563eb">행 37</text>}
            {active === 0 && <text x={pointIn.x + 3} y={Y0 + 11} fontSize={10} fill="#2563eb">열 3</text>}
            {zoom && (
              <g>
                <rect x={RX} y={Y0 + 5 * (SIZE / 32)} width={SIZE} height={SIZE / 32} fill="#2563eb" fillOpacity={0.2} />
                <rect x={RX + 3 * (SIZE / 32)} y={Y0} width={SIZE / 32} height={SIZE} fill="#2563eb" fillOpacity={0.2} />
                <Marker x={RX + 3.5 * (SIZE / 32)} y={Y0 + 5.5 * (SIZE / 32)} />
                <text x={RX + SIZE - 4} y={Y0 + 5 * (SIZE / 32) - 3} textAnchor="end" fontSize={10} fill="#2563eb">조각 행 5</text>
                <text x={RX + 3 * (SIZE / 32) + 10} y={Y0 + SIZE - 6} fontSize={10} fill="#2563eb">조각 열 3</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
