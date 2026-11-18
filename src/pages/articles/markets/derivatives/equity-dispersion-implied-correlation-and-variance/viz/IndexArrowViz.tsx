import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 두 종목의 화살표가 지수 한 칸으로 모이는 그림.
 * 그림 약속: 화살표 길이 = 변동성(20%), 두 화살표 사이 각의 코사인 = 상관(90° → 0, 60° → 0.5).
 * 지수 화살표 = 0.5×A + 0.5×B = 두 화살표 끝을 잇는 선의 가운데. 길이 = 20%×cos(각/2)
 * → 90°: 20×0.7071 ≈ 14.14%, 60°: 20×0.8660 ≈ 17.32% (3절 산수와 같은 값).
 */
const STOCK_VOL = 20;
const PX_PER_PCT = 7.5;
const ORIGIN_X = 180;
const ORIGIN_Y = 222;

const SCENES = [
  {
    label: "상관 0: 제각각 움직임",
    summary: "지수 ≈ 14.14%",
    angle: 90,
    rho: "0",
    books: false,
    note: "두 화살표가 직각이면 상관 0으로 읽습니다. 지수는 비중 0.5씩 섞은 것이라 두 화살표 끝을 잇는 점선의 가운데까지 갑니다. 서로 다른 방향이 흔들림을 일부 지워 지수 화살표는 20%보다 짧은 약 14.14%입니다.",
  },
  {
    label: "상관 0.5: 같은 방향이 늘어남",
    summary: "지수 ≈ 17.32%",
    angle: 60,
    rho: "0.5",
    books: false,
    note: "두 화살표 길이는 그대로 20%이고 사이 각만 60°로 좁아졌습니다. 같은 방향의 움직임이 늘어 서로 지우는 부분이 줄고, 지수 화살표는 약 17.32%로 길어집니다.",
  },
  {
    label: "두 장부가 보는 화살표",
    summary: "개별 20%·20% ↔ 지수 17.32%",
    angle: 60,
    rho: "0.5",
    books: true,
    note: "개별 옵션 묶음은 회색 두 화살표(종목별 흔들림)를, 지수 옵션은 파란 화살표(합쳐진 흔들림)를 더 직접 반영합니다. 두 장부의 차이를 거래하려면 같은 만기와 비슷한 옵션 민감도로 맞춰야 합니다.",
  },
] as const;

function Arrow({ x2, y2, color, width }: { x2: number; y2: number; color: string; width: number }) {
  const dx = x2 - ORIGIN_X;
  const dy = y2 - ORIGIN_Y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const head = 9;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const points = `${x2},${y2} ${bx - uy * 4.5},${by + ux * 4.5} ${bx + uy * 4.5},${by - ux * 4.5}`;
  return (
    <g>
      <line x1={ORIGIN_X} y1={ORIGIN_Y} x2={bx} y2={by} stroke={color} strokeWidth={width} />
      <polygon points={points} fill={color} />
    </g>
  );
}

export default function IndexArrowViz() {
  return (
    <SceneShell
      eyebrow="화살표로 본 지수"
      title="같은 20% 두 개가 모이는 각도가 지수 길이를 바꿉니다"
      description="그림 약속: 화살표 길이가 변동성이고, 두 화살표 사이 각이 90°면 상관 0, 60°면 상관 0.5로 그립니다(각의 코사인 = 상관). 지수 화살표는 비중 0.5씩 섞은 결과입니다. 숫자는 3절의 가정과 같습니다."
      ariaLabel="길이 20퍼센트인 두 종목 화살표가 직각일 때 지수 14.14퍼센트, 60도일 때 17.32퍼센트로 모이는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const half = ((scene.angle / 2) * Math.PI) / 180;
        const r = STOCK_VOL * PX_PER_PCT;
        const ax = ORIGIN_X - r * Math.sin(half);
        const bx = ORIGIN_X + r * Math.sin(half);
        const tipY = ORIGIN_Y - r * Math.cos(half);
        const indexPct = STOCK_VOL * Math.cos(half);
        return (
          <div className="min-w-0">
            <svg viewBox="0 66 360 176" className="mx-auto block w-full max-w-md" role="img" aria-label={`사이 각 ${scene.angle}도, 지수 화살표 ${indexPct.toFixed(2)}퍼센트`}>
              <path
                d={`M ${ORIGIN_X - r} ${ORIGIN_Y} A ${r} ${r} 0 0 1 ${ORIGIN_X + r} ${ORIGIN_Y}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={1}
                strokeDasharray="3 4"
              />
              <text x={ORIGIN_X + r + 4} y={ORIGIN_Y - 6} fontSize={11} fill="#94a3b8" textAnchor="end">20% 선</text>
              <line x1={ax} y1={tipY} x2={bx} y2={tipY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <Arrow x2={ax} y2={tipY} color="#64748b" width={1.25} />
              <Arrow x2={bx} y2={tipY} color="#64748b" width={1.25} />
              <Arrow x2={ORIGIN_X} y2={tipY} color="#2563eb" width={1.25} />
              <circle cx={ORIGIN_X} cy={tipY} r={3} fill="#2563eb" />
              <text x={ax - 4} y={tipY - 8} fontSize={12} fill="#475569" textAnchor="middle">A 20%</text>
              <text x={bx + 4} y={tipY - 8} fontSize={12} fill="#475569" textAnchor="middle">B 20%</text>
              <text x={ORIGIN_X} y={tipY - 10} fontSize={12} fontWeight={700} fill="#2563eb" textAnchor="middle">지수 {indexPct.toFixed(2)}%</text>
              <path
                d={`M ${ORIGIN_X - 26 * Math.sin(half)} ${ORIGIN_Y - 26 * Math.cos(half)} A 26 26 0 0 1 ${ORIGIN_X + 26 * Math.sin(half)} ${ORIGIN_Y - 26 * Math.cos(half)}`}
                fill="none"
                stroke="#475569"
                strokeWidth={1}
              />
              <text x={ORIGIN_X} y={ORIGIN_Y + 15} fontSize={12} fontWeight={600} fill="#475569" textAnchor="middle">사이 각 {scene.angle}° · 상관 {scene.rho}</text>
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className={`rounded-md border px-2 py-2 ${scene.books ? "border-slate-500" : "border-border"}`}>
                <span className="block text-muted-foreground">{scene.books ? "개별 옵션 묶음이 보는 것" : "종목 화살표"}</span>
                <span className="font-mono text-sm font-bold">20% · 20%</span>
              </div>
              <div className={`rounded-md border px-2 py-2 ${scene.books ? "border-blue-600" : "border-border"}`}>
                <span className="block text-muted-foreground">{scene.books ? "지수 옵션이 보는 것" : "지수 화살표"}</span>
                <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">{indexPct.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
