import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 학습용 변형. w=40, h=20(가정), block x=1·y=0.
 * 읽기: x=32+threadIdx.x<40, y=threadIdx.y<20 → 조각 행 0…19, 열 0…7.
 * 쓰기: ox=threadIdx.x<20, oy=32+threadIdx.y<40, tile[tx][ty] → 같은 칸. 예: tile[5][3] ← 입력 행 5·열 35 → 출력 행 35·열 5.
 */
const SCENES = [
  { label: "읽기 조건", summary: "x<w · y<h → 8열 × 20행", note: "이 block은 입력의 열 32…63, 행 0…31을 맡습니다. 그중 입력 범위 안인 열 32…39, 행 0…19만 읽어 조각의 왼쪽 위에 놓습니다." },
  { label: "모두 기다리기", summary: "barrier는 조건문 바깥", note: "조각의 나머지 칸은 채워지지 않습니다. 담당할 원소가 없는 thread도 조건문 바깥의 barrier를 실행해 다른 thread가 읽는 값의 준비를 기다립니다." },
  { label: "쓰기 조건", summary: "ox<h · oy<w", note: "출력 표는 너비 h=20, 높이 w=40입니다. 이 block은 출력의 행 32…63을 맡고, 그중 행 32…39·열 0…19만 씁니다. 범위를 벗어난 나머지 칸은 건드리지 않습니다." },
  { label: "왜 맞물리나", summary: "(5,35) → tile[5][3] → (35,5)", note: "쓰기 조건을 만족하는 값의 원래 좌표는 입력 행 ox·열 oy입니다. ox<h, oy<w는 그대로 읽기 조건이므로 쓰는 칸은 언제나 채워져 있습니다. 조각 전체가 채워졌다고 가정하는 다른 계산을 덧붙이면 경계를 따로 처리해야 합니다." },
] as const;

const IN_U = 1.55;
const IN_X = 6;
const Y0 = 34;
const TILE_X = 124;
const T = 3;
const OUT_X = 244;
const OUT_U = 1.55;

export default function BoundaryTileViz() {
  return (
    <SceneShell
      eyebrow="직사각형 표의 경계"
      title="범위를 벗어나는 block에서는 조각의 일부만 채워집니다"
      description="학습용 변형에 너비 40·높이 20과 block x=1·y=0을 넣은 가정입니다. 점선은 block이 맡은 32×32 범위, 실선은 표의 실제 범위입니다."
      ariaLabel="직사각형 표에서 읽기 조건과 쓰기 조건이 같은 칸을 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const marked = active === 3;
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={IN_X} y={20} fontSize={11} fontWeight={700} fill="#64748b">입력 40×20</text>
            <text x={TILE_X} y={20} fontSize={11} fontWeight={700} fill="#64748b">조각 32×32</text>
            <text x={OUT_X} y={20} fontSize={11} fontWeight={700} fill="#64748b">출력 20×40</text>

            <rect x={IN_X} y={Y0} width={40 * IN_U} height={20 * IN_U} fill="none" stroke="#64748b" strokeWidth={1} />
            <rect x={IN_X + 32 * IN_U} y={Y0} width={32 * IN_U} height={32 * IN_U} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <rect x={IN_X + 32 * IN_U} y={Y0} width={8 * IN_U} height={20 * IN_U} fill="#2563eb" fillOpacity={active === 0 || marked ? 0.45 : 0.2} />
            {marked && <circle cx={IN_X + 35.5 * IN_U} cy={Y0 + 5.5 * IN_U} r={2.5} fill="#d97706" />}

            <rect x={TILE_X} y={Y0} width={32 * T} height={32 * T} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <rect x={TILE_X} y={Y0} width={8 * T} height={20 * T} fill="#2563eb" fillOpacity={0.3} stroke="#2563eb" strokeWidth={1} />
            {active === 1 && <text x={TILE_X + 32 * T - 3} y={Y0 + 32 * T - 6} textAnchor="end" fontSize={10} fill="#64748b">채워지지 않음</text>}
            {active === 1 && <line x1={TILE_X - 6} x2={TILE_X + 32 * T + 6} y1={Y0 + 32 * T + 8} y2={Y0 + 32 * T + 8} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />}
            {active === 1 && <text x={TILE_X + 16 * T} y={Y0 + 32 * T + 21} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">block 전체 대기</text>}
            {marked && <circle cx={TILE_X + 3.5 * T} cy={Y0 + 5.5 * T} r={2.5} fill="#d97706" />}
            {marked && <text x={TILE_X + 8 * T + 4} y={Y0 + 5.5 * T + 4} fontSize={10} fontWeight={700} fill="#d97706">tile[5][3]</text>}

            <rect x={OUT_X} y={Y0} width={20 * OUT_U} height={40 * OUT_U} fill="none" stroke="#64748b" strokeWidth={1} />
            <rect x={OUT_X} y={Y0 + 32 * OUT_U} width={32 * OUT_U} height={32 * OUT_U} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            {active >= 2 && <rect x={OUT_X} y={Y0 + 32 * OUT_U} width={20 * OUT_U} height={8 * OUT_U} fill="#2563eb" fillOpacity={0.45} />}
            {marked && <circle cx={OUT_X + 5.5 * OUT_U} cy={Y0 + 35.5 * OUT_U} r={2.5} fill="#d97706" />}
            {marked && <text x={OUT_X} y={Y0 + 64 * OUT_U + 12} fontSize={10} fontWeight={700} fill="#d97706">행 35·열 5</text>}
            {marked && <text x={IN_X} y={Y0 + 40 * IN_U} fontSize={10} fontWeight={700} fill="#d97706">행 5·열 35</text>}
            <text x={IN_X} y={171} fontSize={10} fill="#64748b">파란 면적: 이 block이 실제로 다루는 칸</text>
          </svg>
        );
      }}
    />
  );
}
