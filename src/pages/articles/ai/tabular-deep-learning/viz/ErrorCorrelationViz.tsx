import SceneShell from "./SceneShell";

/**
 * 본문 대응: #when-dl-wins — 두 모델이 같은 row에서 함께 틀리면 평균을 내도 오류가 잘 상쇄되지 않습니다.
 * validation row 6개의 오차는 설명용 가정입니다. 모델 A는 고정, 모델 B는 같은 오차 값들을 다른 row에 배치합니다.
 * 두 모델 RMSE는 모두 √(28/6) ≈ 2.16.
 * 같은 방향: ρ ≈ 0.93, 단순 평균 RMSE ≈ 2.12 · 상관 0: ρ = 0, 평균 RMSE ≈ 1.53 · 반대 방향: ρ ≈ −0.96, 평균 RMSE ≈ 0.29.
 */
const ERR_A: readonly number[] = [2, -1, 3, -2, 1, -3];
const CASES = [
  { label: "같은 방향으로 틀림", errB: [3, -2, 2, -1, 1, -3] as readonly number[] },
  { label: "상관이 0", errB: [-1, 2, 1, 3, -2, -3] as readonly number[] },
  { label: "반대 방향으로 틀림", errB: [-3, 1, -2, 2, -1, 3] as readonly number[] },
] as const;

const mean = (v: readonly number[]) => v.reduce<number>((s, x) => s + x, 0) / v.length;
const rmse = (v: readonly number[]) => Math.sqrt(mean(v.map((x) => x * x)));
function corr(a: readonly number[], b: readonly number[]): number {
  const ma = mean(a);
  const mb = mean(b);
  const cov = a.reduce<number>((s, x, i) => s + (x - ma) * (b[i] - mb), 0);
  const va = a.reduce<number>((s, x) => s + (x - ma) ** 2, 0);
  const vb = b.reduce<number>((s, x) => s + (x - mb) ** 2, 0);
  return cov / Math.sqrt(va * vb);
}

const RESULTS = CASES.map((c) => {
  const avg = ERR_A.map((x, i) => (x + c.errB[i]) / 2);
  return { ...c, avg, rho: corr(ERR_A, c.errB), avgRmse: rmse(avg) };
});
const SINGLE_RMSE = rmse(ERR_A);
const f2 = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

const NOTES = [
  "B가 A와 거의 같은 row에서 같은 부호로 틀립니다. 두 예측을 평균해도 오차가 거의 그대로 남아, 모델을 둘 운영하면서 얻는 것이 작습니다.",
  "한쪽이 크게 틀린 row에서 다른 쪽은 덜 틀리거나 반대로 틀리기도 해 평균 오차가 일부 상쇄됩니다.",
  "부호가 반대라 평균이 0 근처로 모입니다. 낮은 상관은 후보 신호일 뿐이며, 실제 blend gain과 latency·memory·monitoring 비용은 따로 측정합니다.",
] as const;

const SCENES = RESULTS.map((r, i) => ({
  label: r.label,
  summary: `ρ = ${f2(r.rho)} · 평균 RMSE ${r.avgRmse.toFixed(2)}`,
  note: NOTES[i],
}));

const W = 360;
const H = 190;
const ZERO_Y = 92;
const UNIT = 22;
const LEFT = 30;
const GROUP = (W - LEFT - 10) / ERR_A.length;
const BAR = 9;
const A_COLOR = "#64748b";
const B_COLOR = "#d97706";
const AVG_COLOR = "#2563eb";

function Bar({ x, value, color }: { x: number; value: number; color: string }) {
  const h = Math.abs(value) * UNIT;
  return <rect x={x} y={value >= 0 ? ZERO_Y - h : ZERO_Y} width={BAR} height={Math.max(h, 0.5)} rx={1.5} fill={color} />;
}

export default function ErrorCorrelationViz() {
  return (
    <SceneShell
      eyebrow="오차 상관과 평균"
      title="두 모델이 같은 row에서 함께 틀리면 평균을 내도 오차가 남습니다"
      description={`validation row 6개의 오차(정답 − 예측)는 설명용 가정입니다. A와 B는 같은 오차 값을 쓰므로 각자의 RMSE(오차 제곱 평균의 제곱근)는 모두 ${SINGLE_RMSE.toFixed(2)}이고, 장면마다 B가 어느 row에서 틀리는지만 바뀝니다. 파란 막대는 두 예측의 단순 평균이 남긴 오차이고, ρ는 두 오차 벡터의 상관계수(−1~1, 1에 가까울수록 같은 row에서 같은 방향으로 틀림)입니다.`}
      ariaLabel="두 모델의 row별 오차 상관에 따라 단순 평균 오차가 달라지는 세 경우"
      scenes={SCENES}
      render={(active) => {
        const r = RESULTS[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${r.label}: ${SCENES[active].summary}`}>
              {[-3, 3].map((v) => (
                <g key={v}>
                  <line x1={LEFT} x2={W - 10} y1={ZERO_Y - v * UNIT} y2={ZERO_Y - v * UNIT} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
                  <text x={LEFT - 6} y={ZERO_Y - v * UNIT + 4} textAnchor="end" fontSize={10} fill="#64748b">
                    {v > 0 ? "+3" : "−3"}
                  </text>
                </g>
              ))}
              <line x1={LEFT} x2={W - 10} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
              <text x={LEFT - 6} y={ZERO_Y + 4} textAnchor="end" fontSize={10} fill="#64748b">
                0
              </text>
              {ERR_A.map((a, i) => {
                const x0 = LEFT + i * GROUP + (GROUP - 3 * BAR - 4) / 2;
                return (
                  <g key={i}>
                    <Bar x={x0} value={a} color={A_COLOR} />
                    <Bar x={x0 + BAR + 2} value={r.errB[i]} color={B_COLOR} />
                    <Bar x={x0 + 2 * BAR + 4} value={r.avg[i]} color={AVG_COLOR} />
                    <text x={LEFT + i * GROUP + GROUP / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="#64748b">
                      row {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2 w-3 align-middle" style={{ backgroundColor: A_COLOR }} />모델 A 오차</span>
              <span><span className="mr-1 inline-block h-2 w-3 align-middle" style={{ backgroundColor: B_COLOR }} />모델 B 오차</span>
              <span><span className="mr-1 inline-block h-2 w-3 align-middle" style={{ backgroundColor: AVG_COLOR }} />단순 평균의 오차</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {[
                ["A 혼자", SINGLE_RMSE.toFixed(2)],
                ["B 혼자", rmse(r.errB).toFixed(2)],
                ["평균", r.avgRmse.toFixed(2)],
              ].map(([name, value]) => (
                <div key={name} className="rounded-lg border border-border px-2 py-2">
                  <span className="block text-muted-foreground">{name} RMSE</span>
                  <span className={`block font-mono text-sm font-bold ${name === "평균" ? "text-blue-700 dark:text-blue-400" : ""}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
