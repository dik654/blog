import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training IWAE — w̄_K의 log 기대값은 K가 늘면 evidence에 다가가고, support gap은 남는다.
 * 계산용 장난감(가정): weight w는 0.2 또는 1.8이 같은 확률. E[w]=1 → log p(x)=0.
 * K개 중 k개가 1.8이면 평균은 (0.2(K−k)+1.8k)/K이고 그런 조합이 C(K,k)가지.
 * 마지막 장면: q가 놓친 영역의 evidence 0.25를 더해 p(x)=1.25, log≈0.223.
 */
const choose = (n: number, k: number): number =>
  Array.from({ length: k }, (_, i) => i).reduce<number>((acc, i) => (acc * (n - i)) / (i + 1), 1);

function outcomes(K: number) {
  return Array.from({ length: K + 1 }, (_, k) => ({ mean: (0.2 * (K - k) + 1.8 * k) / K, count: choose(K, k) }));
}

function bound(K: number) {
  return outcomes(K).reduce<number>((sum, row) => sum + row.count * Math.log(row.mean), 0) / 2 ** K;
}

const KS = [1, 2, 4, 8] as const;
const BOUNDS = KS.map(bound);
const FULL_EVIDENCE = Math.log(1.25);
const fmt = (value: number) => {
  const text = Math.abs(value).toFixed(3);
  return value < -0.0005 ? `−${text}` : text;
};

const SCENES = [
  { label: "K=1", summary: `bound ${fmt(BOUNDS[0])}`, k: 0, note: "한 번만 뽑으면 log 0.2≈−1.609와 log 1.8≈0.588의 평균입니다. E[w]=1의 log인 0보다 낮고, 이 값이 기본 ELBO에 해당합니다." },
  { label: "K=2", summary: `bound ${fmt(BOUNDS[1])}`, k: 1, note: "둘을 평균한 뒤 log를 취합니다. 네 조합 중 두 조합은 평균이 정확히 1이라 log가 0입니다." },
  { label: "K=4", summary: `bound ${fmt(BOUNDS[2])}`, k: 2, note: "평균이 1 근처인 조합이 늘어 bound가 더 다가갑니다. 일반적인 경향일 뿐, 계산량과 encoder gradient 특성도 달라지므로 항상 낫다는 뜻은 아닙니다." },
  { label: "K=8", summary: `bound ${fmt(BOUNDS[3])}`, k: 3, note: "평균 자체는 evidence의 unbiased estimator지만, concave한 log를 씌운 기대값은 log p(x)보다 작거나 같습니다. 그래서 0 아래에 머뭅니다." },
  { label: "q가 놓친 영역", summary: `log p(x)=${fmt(FULL_EVIDENCE)}에 못 닿음`, k: 3, note: "q가 probability 0을 둔 영역에 evidence 0.25가 더 있다면(가정) p(x)=1.25입니다. 그 영역은 sample되지 않아 위 끝이 0에 머물고 차이 0.223이 남습니다." },
] as const;

const W = 360;
const H = 84;
const LEFT = 16;
const RIGHT = W - 16;
const AXIS_MIN = -0.6;
const AXIS_MAX = 0.3;
const AXIS_Y = 52;
const px = (value: number) => LEFT + ((value - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (RIGHT - LEFT);
const TICKS = [-0.6, -0.3, 0, 0.3] as const;

export default function IwaeLadderViz() {
  return (
    <SceneShell
      eyebrow="K를 늘릴 때"
      title="평균을 낸 뒤 log를 취하면 bound가 evidence에 다가갑니다"
      description="장난감입니다(가정): weight w는 0.2나 1.8이 같은 확률이므로 p(x)=E[w]=1, log p(x)=0입니다. 칸은 K개 weight의 평균, ×숫자는 그 조합 수입니다."
      ariaLabel="sample 수 K에 따라 IWAE bound가 evidence에 다가가는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const K = KS[scene.k];
        const reached: readonly number[] = BOUNDS.slice(0, scene.k + 1);
        const current = BOUNDS[scene.k];
        const support = active === 4;
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 text-xs leading-5 sm:text-sm">
              <strong>K={K}의 평균 w</strong>
              <span className="text-muted-foreground">전체 {2 ** K}가지 조합</span>
            </div>
            <div className="mt-2 grid min-h-[4.75rem] grid-cols-3 content-start gap-1.5 sm:grid-cols-5">
              {K > 4 ? (
                <p className="col-span-full font-mono text-xs leading-5">
                  0.20 ×1 · 1.00 ×{choose(K, K / 2)} · 1.80 ×1 <span className="block font-sans text-muted-foreground">나머지 여섯 평균은 생략했습니다</span>
                </p>
              ) : (
                outcomes(K).map((row) => (
                  <div key={row.mean} className="rounded-md border border-border px-2 py-1 text-center font-mono text-xs leading-5">
                    {row.mean.toFixed(2)} <span className="text-muted-foreground">×{row.count}</span>
                  </div>
                ))
              )}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[560px]" role="img" aria-label={`K=${K} bound ${fmt(current)}`}>
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={px(tick)} x2={px(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="#64748b">{tick < 0 ? `−${Math.abs(tick)}` : tick}</text>
                </g>
              ))}
              {reached.map((value, index) => (
                <circle key={value} cx={px(value)} cy={AXIS_Y} r={index === scene.k ? 5 : 3} fill="#2563eb" fillOpacity={index === scene.k ? 1 : 0.4} />
              ))}
              <text x={px(current)} y={AXIS_Y - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{`K=${K}`}</text>
              <line x1={px(support ? FULL_EVIDENCE : 0)} x2={px(support ? FULL_EVIDENCE : 0)} y1={18} y2={AXIS_Y + 8} stroke="#dc2626" strokeWidth={1.25} />
              <text x={px(support ? FULL_EVIDENCE : 0)} y={14} textAnchor={support ? "end" : "middle"} fontSize={12} fontWeight={700} fill="#dc2626">log p(x)</text>
              {support && <rect x={px(0)} y={AXIS_Y - 6} width={px(FULL_EVIDENCE) - px(0)} height={12} fill="#d97706" fillOpacity={0.35} />}
              {support && <text x={(px(0) + px(FULL_EVIDENCE)) / 2} y={AXIS_Y - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">차이 {fmt(FULL_EVIDENCE)}</text>}
            </svg>
          </div>
        );
      }}
    />
  );
}
