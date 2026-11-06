import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture, #source-exchange — 입력 행 37의 열 0…31, 조각 행 5, 조각 열 3, 출력 행 3의 열 32…63.
 * 직접 쓰기는 37+64×lane이므로 출력 열 37의 행 0…31로 퍼집니다.
 */
const SCENES = [
  { label: "그대로 쓰면", summary: "32곳의 서로 다른 행", note: "작업 32개가 입력의 한 행을 나란히 읽고 그 순서대로 쓰면, 결과에서는 열 37의 위아래 32개 행으로 퍼집니다. 쓰기 요청이 흩어집니다." },
  { label: "가로로 놓기", summary: "입력 행 → 공동 공간 같은 행", note: "먼저 공동 공간의 같은 행에 놓습니다. 읽는 쪽에서는 옆 칸끼리 그대로입니다. 고른 값은 행 5·열 3입니다." },
  { label: "세로로 읽기", summary: "다른 작업 32개가 열 3을", note: "모든 값이 놓인 뒤 다른 작업들이 공동 공간을 세로로 읽습니다. 공동 공간은 조각의 32개 행으로 이미 채워져 있고, 쓰는 사람이 바뀌었습니다." },
  { label: "옆 칸으로 쓰기", summary: "출력 행 3의 연속 32칸", note: "세로로 읽은 값을 출력 행 3의 열 32…63에 나란히 씁니다. 결과에서 다시 옆 칸끼리 모였습니다. 고른 값은 이 중 열 37, 곧 229번입니다." },
] as const;

const OUTER = 100;
const TILE = 96;
const IN_X = 6;
const TILE_X = 132;
const OUT_X = 254;
const Y0 = 34;
const U = OUTER / 64;
const T = TILE / 32;

function Flow({ x, on, color }: { x: number; on: boolean; color: string }) {
  return <text x={x} y={Y0 + 54} textAnchor="middle" fontSize={15} fontWeight={700} fill={on ? color : "#94a3b8"} opacity={on ? 1 : 0.3}>→</text>;
}

export default function RowColumnViz() {
  return (
    <SceneShell
      eyebrow="작업 32개의 줄"
      title="가로로 놓고 세로로 읽으면 결과에서 다시 옆 칸이 됩니다"
      description="왼쪽 입력 표와 오른쪽 출력 표는 64×64칸, 가운데 공동 공간은 32×32칸입니다(가정). 진한 칸이 이번에 움직이는 줄이고 주황 점이 값 7입니다."
      ariaLabel="입력의 한 행, 공동 공간의 행과 열, 출력의 한 행 사이 이동"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={IN_X} y={20} fontSize={11} fontWeight={700} fill="#64748b">입력 표</text>
          <text x={TILE_X} y={20} fontSize={11} fontWeight={700} fill="#64748b">공동 공간</text>
          <text x={OUT_X} y={20} fontSize={11} fontWeight={700} fill="#64748b">출력 표</text>
          <rect x={IN_X} y={Y0} width={OUTER} height={OUTER} fill="none" stroke="#94a3b8" strokeWidth={1} />
          <rect x={TILE_X} y={Y0} width={TILE} height={TILE} fill={active >= 2 ? "#64748b" : "none"} fillOpacity={active >= 2 ? 0.12 : 0} stroke="#94a3b8" strokeWidth={1} />
          <rect x={OUT_X} y={Y0} width={OUTER} height={OUTER} fill="none" stroke="#94a3b8" strokeWidth={1} />
          {active <= 1 && <rect x={IN_X} y={Y0 + 37 * U} width={32 * U} height={Math.max(U, 2)} fill="#2563eb" />}
          {active <= 1 && <circle cx={IN_X + 3.5 * U} cy={Y0 + 37.5 * U + 0.5} r={2.5} fill="#d97706" />}
          {active === 1 && <rect x={TILE_X} y={Y0 + 5 * T} width={TILE} height={T} fill="#2563eb" />}
          {active === 1 && <circle cx={TILE_X + 3.5 * T} cy={Y0 + 5.5 * T} r={2.5} fill="#d97706" />}
          {active >= 2 && <rect x={TILE_X + 3 * T} y={Y0} width={T} height={TILE} fill="#2563eb" />}
          {active >= 2 && <circle cx={TILE_X + 3.5 * T} cy={Y0 + 5.5 * T} r={2.5} fill="#d97706" />}
          {active === 0 &&
            Array.from({ length: 32 }, (_, lane) => <rect key={lane} x={OUT_X + 37 * U} y={Y0 + lane * U} width={Math.max(U, 2)} height={Math.max(U * 0.6, 1)} fill="#dc2626" />)}
          {active === 0 && <circle cx={OUT_X + 37.5 * U + 0.3} cy={Y0 + 3.5 * U} r={2.5} fill="#d97706" />}
          {active === 3 && <rect x={OUT_X + 32 * U} y={Y0 + 3 * U} width={32 * U} height={Math.max(U, 2)} fill="#2563eb" />}
          {active === 3 && <circle cx={OUT_X + 37.5 * U} cy={Y0 + 3.5 * U + 0.5} r={2.5} fill="#d97706" />}
          <Flow x={119} on={active === 1} color="#2563eb" />
          <Flow x={241} on={active === 3} color="#2563eb" />
          {active <= 1 && <text x={IN_X} y={Y0 + OUTER + 16} fontSize={10} fill="#64748b">행 37 · 열 0…31</text>}
          <text x={TILE_X} y={Y0 + OUTER + 16} fontSize={10} fill="#64748b">{active === 0 ? "거치지 않음" : active === 1 ? "행 5 전체" : "열 3 전체"}</text>
          <text x={OUT_X} y={Y0 + OUTER + 16} fontSize={10} fill={active === 0 ? "#dc2626" : "#64748b"}>{active === 0 ? "열 37 · 행 0…31" : active === 3 ? "행 3 · 열 32…63" : "아직 쓰지 않음"}</text>
        </svg>
      )}
    />
  );
}
