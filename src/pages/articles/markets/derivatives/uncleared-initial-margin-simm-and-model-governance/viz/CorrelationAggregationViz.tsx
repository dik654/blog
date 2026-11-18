import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가중 민감도 6과 4, 상관 0.25 → √(6²+4²+2×0.25×6×4)=√64=8, 단순 합 10.
 * 그림 비유: 두 화살표 사이 각도의 코사인을 상관으로 두면 이어 붙인 화살표 길이가 같은 식이 된다.
 * 상관 1 → 같은 방향, 길이 10. 상관 0.25 → 각도 약 75.5°, b=(1.0, 3.873), 합 (7, 3.873), 길이 8.
 */
const A = 6;
const B = 4;
const RHO = 0.25;
const UNIT = 24;
const OX = 30;
const OY = 150;
const BX = B * RHO;
const BY = B * Math.sqrt(1 - RHO * RHO);

const SCENES = [
  { label: "단순 합: 같은 방향으로 이으면", summary: "6 + 4 = 10", rho: 1, note: "두 위험이 늘 함께 움직인다고 보면(상관 1, 가정) 두 화살표가 한 줄로 이어져 길이가 10입니다. 같은 식에 상관 1을 넣어도 √(36+16+48)=√100=10이 됩니다." },
  { label: "상관 0.25: 덜 함께 움직입니다", summary: "교차항 2×0.25×6×4 = 12", rho: RHO, note: "상관을 0.25로 두면 두 번째 화살표가 꺾입니다. 제곱 36과 16은 그대로이고, 둘이 함께 움직이는 몫인 교차항만 48에서 12로 줄어듭니다." },
  { label: "합 64의 제곱근", summary: "√(36+16+12) = √64 = 8", rho: RHO, note: "세 항을 더하면 64, 제곱근은 8입니다. 단순 합 10보다 2 작고, 이 차이가 위험을 함께 묶을 때 생기는 포트폴리오 효과입니다. 실제 SIMM의 위험가중치·버킷 공식은 아닌 교육용 집계입니다." },
] as const;

function Term({ label, value, on, strong = false }: { label: string; value: string; on: boolean; strong?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-1.5 text-center text-xs leading-5 ${on ? (strong ? "border-blue-600" : "border-border") : "border-dashed border-border/50 opacity-50"}`}>
      <span className="block text-muted-foreground">{label}</span>
      <span className={`block font-mono font-bold ${strong ? "text-blue-700 dark:text-blue-300" : ""}`}>{value}</span>
    </div>
  );
}

export default function CorrelationAggregationViz() {
  return (
    <SceneShell
      eyebrow="상관을 넣은 집계"
      title="6과 4를 같은 방향으로 이으면 10, 상관 0.25로 꺾으면 8입니다"
      description="화살표 길이가 가중 민감도(위험요인별 민감도에 가중치를 곱한 값)입니다. 두 화살표 사이 각도는 상관을 코사인으로 바꾼 그림 비유입니다(cos 75.5° ≈ 0.25). 숫자 6·4·0.25는 3절의 가정입니다."
      ariaLabel="가중 민감도 6과 4를 상관 1이면 길이 10, 상관 0.25이면 길이 8로 묶는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bent = scene.rho !== 1;
        const bx = bent ? BX : B;
        const by = bent ? BY : 0;
        const tipX = OX + (A + bx) * UNIT;
        const tipY = OY - by * UNIT;
        const total = bent ? 8 : 10;
        const showTotal = !bent || active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 320 176" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={OX} x2={OX + 10 * UNIT} y1={OY + 12} y2={OY + 12} stroke="#e2e8f0" strokeWidth={1} />
              <line x1={OX + 10 * UNIT} x2={OX + 10 * UNIT} y1={OY + 6} y2={OY + 18} stroke="#94a3b8" strokeWidth={1} />
              <text x={OX + 10 * UNIT} y={OY + 24} textAnchor="middle" fontSize={9} fill="#64748b">단순 합 10</text>
              <line x1={OX} x2={OX + A * UNIT} y1={OY} y2={OY} stroke="#475569" strokeWidth={1.25} />
              <polygon points={`${OX + A * UNIT},${OY} ${OX + A * UNIT - 7},${OY - 4} ${OX + A * UNIT - 7},${OY + 4}`} fill="#475569" />
              <text x={OX + (A * UNIT) / 2} y={OY - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">6</text>
              <line x1={OX + A * UNIT} y1={OY} x2={tipX} y2={tipY} stroke="#d97706" strokeWidth={1.25} />
              <circle cx={tipX} cy={tipY} r={3} fill="#d97706" />
              <text x={(OX + A * UNIT + tipX) / 2 + (bent ? 10 : 0)} y={(OY + tipY) / 2 - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">4</text>
              {bent && (
                <text x={OX + A * UNIT + 16} y={OY - 6} fontSize={9} fill="#92400e">≈75.5°</text>
              )}
              {bent && (
                <line x1={OX} y1={OY} x2={tipX} y2={tipY} stroke="#2563eb" strokeWidth={1.25} strokeDasharray={showTotal ? undefined : "4 3"} />
              )}
              {showTotal && (
                <text x={bent ? (OX + tipX) / 2 - 12 : OX + 8 * UNIT} y={bent ? (OY + tipY) / 2 - 8 : OY - 22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1d4ed8">
                  길이 {total}
                </text>
              )}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2">
              <Term label="6²" value="36" on />
              <Term label="4²" value="16" on />
              <Term label={`2×${bent ? "0.25" : "1"}×6×4`} value={bent ? "12" : "48"} on />
              <Term label="합" value={bent ? "64" : "100"} on={!bent || active === 2} />
              <Term label="제곱근" value={String(total)} on={!bent || active === 2} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
