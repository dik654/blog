import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 절반씩 담은 바구니 분산 = 0.5²×0.2² + 0.5²×0.2² + 2×0.5×0.5×ρ×0.2×0.2.
 * = 0.01 + 0.01 + 0.02ρ. ρ=0 → 0.02, √0.02≈14.14%. ρ=1 → 0.04, 20%.
 * (가정) 중간값 ρ=0.5 → 0.03, √0.03≈17.32%.
 */
const SCENE_TUPLE = [
  { label: "상관 0", summary: "분산 0.02 → 변동성 약 14.14%", rho: 0, note: "A 몫 0.5²×0.2²=0.01과 B 몫 0.01에, 함께 움직이는 몫 2×0.5×0.5×ρ×0.2×0.2=0.02ρ가 더해집니다. ρ=0이면 이 몫이 0입니다. 합 0.02의 제곱근이 약 14.14%로, 개별 변동성 20%보다 낮습니다." },
  { label: "상관 0.5 (가정)", summary: "분산 0.03 → 변동성 약 17.32%", rho: 0.5, note: "본문에 없는 중간값을 넣어 보면 함께 움직이는 몫이 0.02×0.5=0.01이 되어 합이 0.03, 변동성은 약 17.32%입니다. 상관이 오를수록 바구니가 덜 상쇄됩니다." },
  { label: "상관 1", summary: "분산 0.04 → 변동성 20%", rho: 1, note: "늘 같은 방향으로 움직이면 함께 움직이는 몫이 0.02로 커져 합 0.04, 변동성 20%입니다. 두 자산을 섞어 얻던 상쇄 효과가 사라집니다." },
] as const;
const SCENES: readonly (typeof SCENE_TUPLE)[number][] = SCENE_TUPLE;

const W = 360;
const H = 228;
// 왼쪽: 분산 쌓기 막대
const BAR_X = 40;
const BAR_W = 64;
const BAR_BOTTOM = 186;
const BAR_TOP = 24;
const vy = (v: number) => BAR_BOTTOM - (v / 0.04) * (BAR_BOTTOM - BAR_TOP);
// 오른쪽: ρ에 따른 바구니 변동성 곡선
const G_LEFT = 196;
const G_RIGHT = 346;
const G_TOP = 24;
const G_BOTTOM = 186;
const gx = (rho: number) => G_LEFT + rho * (G_RIGHT - G_LEFT);
const gy = (vol: number) => G_BOTTOM - ((vol - 0.12) / (0.21 - 0.12)) * (G_BOTTOM - G_TOP);
const basketVol = (rho: number) => Math.sqrt(0.02 + 0.02 * rho);
const CURVE = Array.from({ length: 21 }, (_, i) => i / 20).map((rho) => `${gx(rho)},${gy(basketVol(rho))}`).join(" ");
const VOL_TICKS = [0.14, 0.17, 0.2] as const;

export default function BasketVarianceViz() {
  return (
    <SceneShell
      eyebrow="상관 하나의 무게"
      title="개별 변동성이 같아도 상관에 따라 바구니가 달라집니다"
      description="A·B 모두 연 변동성 20%, 절반씩 담은 3절의 바구니입니다. 상관(ρ)은 두 자산이 같은 방향으로 움직이는 정도로, 1이면 늘 같은 방향이고 0이면 선형 관계가 없습니다. 왼쪽은 바구니 분산을 세 몫으로 쌓은 막대, 오른쪽은 상관에 따른 바구니 변동성입니다."
      ariaLabel="상관 0, 0.5, 1에서 바구니 분산 0.02, 0.03, 0.04와 변동성 14.14, 17.32, 20퍼센트"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cross = 0.02 * scene.rho;
        const total = 0.02 + cross;
        const vol = Math.sqrt(total);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={BAR_X - 6} x2={BAR_X + BAR_W + 6} y1={vy(0.04)} y2={vy(0.04)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={BAR_X - 10} y={vy(0.04) + 4} textAnchor="end" fontSize={10} fill="#64748b">0.04</text>
            <text x={BAR_X - 10} y={vy(0.02) + 4} textAnchor="end" fontSize={10} fill="#64748b">0.02</text>
            <text x={BAR_X - 10} y={BAR_BOTTOM + 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
            <rect x={BAR_X} y={vy(0.01)} width={BAR_W} height={vy(0) - vy(0.01)} fill="#64748b" opacity={0.75} />
            <rect x={BAR_X} y={vy(0.02)} width={BAR_W} height={vy(0.01) - vy(0.02)} fill="#94a3b8" opacity={0.75} />
            {cross > 0 && <rect x={BAR_X} y={vy(total)} width={BAR_W} height={vy(0.02) - vy(total)} fill="#2563eb" opacity={0.75} className="transition-all duration-300 motion-reduce:transition-none" />}
            <text x={BAR_X + BAR_W / 2} y={(vy(0) + vy(0.01)) / 2 + 4} textAnchor="middle" fontSize={11} fill="#ffffff" fontWeight={700}>A 0.01</text>
            <text x={BAR_X + BAR_W / 2} y={(vy(0.01) + vy(0.02)) / 2 + 4} textAnchor="middle" fontSize={11} fill="#0f172a" fontWeight={700}>B 0.01</text>
            <text x={BAR_X + BAR_W + 8} y={cross > 0 ? (vy(0.02) + vy(total)) / 2 + 4 : vy(0.02) - 4} fontSize={10} fontWeight={700} fill="#2563eb">
              함께 {cross.toFixed(2)}
            </text>
            <text x={BAR_X + BAR_W / 2} y={BAR_TOP - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">합 {total.toFixed(2)}</text>
            <text x={BAR_X + BAR_W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">바구니 분산</text>

            {VOL_TICKS.map((tick) => (
              <g key={tick}>
                <line x1={G_LEFT} x2={G_RIGHT} y1={gy(tick)} y2={gy(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={G_LEFT - 4} y={gy(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{Math.round(tick * 100)}%</text>
              </g>
            ))}
            <line x1={G_LEFT} x2={G_RIGHT} y1={G_BOTTOM} y2={G_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.5, 1].map((rho) => (
              <text key={rho} x={gx(rho)} y={G_BOTTOM + 14} textAnchor="middle" fontSize={10} fill="#64748b">{rho}</text>
            ))}
            <text x={(G_LEFT + G_RIGHT) / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">상관 ρ</text>
            <polyline points={CURVE} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <line x1={gx(scene.rho)} x2={gx(scene.rho)} y1={gy(vol)} y2={G_BOTTOM} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={gx(scene.rho)} cy={gy(vol)} r={5} fill="#2563eb" />
            <text
              x={gx(scene.rho) + (scene.rho === 1 ? -8 : 8)}
              y={gy(vol) - 8}
              textAnchor={scene.rho === 1 ? "end" : "start"}
              fontSize={12}
              fontWeight={700}
              fill="#2563eb"
            >
              {(vol * 100).toFixed(2)}%
            </text>
          </svg>
        );
      }}
    />
  );
}
