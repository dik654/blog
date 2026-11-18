import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 셋째 문단 — CRR 나무 값이 칸 수를 늘릴수록 블랙숄즈 값 6.70으로 모인다.
 * (가정) S=K=100, T=2년, σ=20%, r=ln1.05, 유럽형 풋.
 * Δt=2÷N, u=e^{0.2√Δt}: N=2 → 1.2214, 10 → 1.0936, 100 → 1.0287, 1000 → 1.0090.
 * 나무 값 5.42·6.42·6.67·6.70, 블랙숄즈 6.70 → 차이 1.28·0.28·0.03·0.
 */
const POINT_TUPLE = [
  { n: "2", value: 5.42, dt: "1", u: "1.2214" },
  { n: "10", value: 6.42, dt: "0.2", u: "1.0936" },
  { n: "100", value: 6.67, dt: "0.02", u: "1.0287" },
  { n: "1,000", value: 6.7, dt: "0.002", u: "1.0090" },
] as const;
const POINTS: readonly (typeof POINT_TUPLE)[number][] = POINT_TUPLE;

const BS = 6.7;
const HAND = 6.29;

const SCENES = [
  { label: "2단계", summary: "5.42 · 블랙숄즈와 1.28 차이", shown: 1, note: "2년을 두 칸으로 나누면 한 칸이 1년이고 상승배수는 1.2214입니다. 이 나무의 풋 값 5.42는 블랙숄즈 값 6.70보다 1.28 낮습니다." },
  { label: "10단계", summary: "6.42 · 차이 0.28", shown: 2, note: "한 칸을 0.2년으로 줄이면 상승배수가 1.0936으로 1에 가까워집니다. 갈래는 작아지고 칸은 늘어 값이 6.42가 됩니다." },
  { label: "100단계", summary: "6.67 · 차이 0.03", shown: 3, note: "한 칸 0.02년, 상승배수 1.0287입니다. 차이가 0.03으로 줄었습니다." },
  { label: "1,000단계", summary: "6.70 · 블랙숄즈와 같음", shown: 4, note: "한 칸 0.002년에서 나무 값이 소수 둘째 자리까지 6.70이 되어 블랙숄즈 값과 같아집니다. 배수를 변동성에서 정했기 때문에 이렇게 한 값으로 모입니다." },
  { label: "6.29는 다른 나무입니다", summary: "1.2·0.8 손계산 나무", shown: 4, note: "3~4절의 유럽형 풋 6.29는 손계산을 위해 1.2·0.8을 고른 나무의 값이라 위 수열의 한 항이 아닙니다. 회색 점은 비교를 위해 옆 칸에 따로 둔 것입니다." },
] as const;

const W = 360;
const H = 196;
const LEFT = 44;
const RIGHT = 12;
const TOP = 18;
const BOTTOM = 160;
const Y_MIN = 5;
const Y_MAX = 7;
const SLOTS = 5;
const SLOT_W = (W - LEFT - RIGHT) / SLOTS;
const y = (value: number) => BOTTOM - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
const x = (slot: number) => LEFT + SLOT_W * (slot + 0.5);
const TICKS = [5, 5.5, 6, 6.5, 7] as const;

export default function CrrConvergenceViz() {
  return (
    <SceneShell
      eyebrow="칸을 잘게"
      title="나무를 촘촘히 할수록 6.70으로 모입니다"
      description="파란 점은 같은 유럽형 풋을 상승배수를 변동성에서 정하는 콕스·로스·루빈스타인 나무로 계산한 값, 가로 점선은 블랙숄즈 값 6.70입니다. 입력은 변동성 20%·금리 ln1.05·2년 만기·행사가 100(가정)이고, 가로 칸은 단계 수의 순서일 뿐 거리 비율이 아닙니다."
      ariaLabel="CRR 이항 나무 단계 수 2, 10, 100, 1000에서 풋 값이 블랙숄즈 6.70에 수렴하는 그래프"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const last = POINTS[scene.shown - 1];
        const showHand = active === SCENES.length - 1;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick.toFixed(1)}</text>
                </g>
              ))}
              <line x1={LEFT} x2={W - RIGHT} y1={y(BS)} y2={y(BS)} stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
              <text x={LEFT + 4} y={y(BS) - 5} fontSize={12} fill="#475569">블랙숄즈 6.70</text>
              <line x1={x(3.5)} x2={x(3.5)} y1={TOP} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
              {POINTS.map((point, index) => {
                const visible = index < scene.shown;
                return (
                  <g key={point.n} opacity={visible ? 1 : 0.15}>
                    {visible && index === scene.shown - 1 && !showHand && (
                      <line x1={x(index)} x2={x(index)} y1={y(point.value)} y2={y(BS)} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
                    )}
                    <circle cx={x(index)} cy={y(point.value)} r={4.5} fill="#2563eb" />
                    {visible && (
                      <text x={x(index)} y={y(point.value) + (point.value > 6.6 ? 18 : -9)} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">
                        {point.value.toFixed(2)}
                      </text>
                    )}
                    <text x={x(index)} y={BOTTOM + 16} textAnchor="middle" fontSize={12} fill="#64748b">{point.n}</text>
                  </g>
                );
              })}
              <g opacity={showHand ? 1 : 0.15}>
                <circle cx={x(4)} cy={y(HAND)} r={4.5} fill="none" stroke="#64748b" strokeWidth={1.25} />
                {showHand && (
                  <text x={x(4)} y={y(HAND) + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">6.29</text>
                )}
                <text x={x(4)} y={BOTTOM + 16} textAnchor="middle" fontSize={12} fill="#64748b">1.2·0.8</text>
              </g>
              <text x={x(1.5)} y={H - 4} textAnchor="middle" fontSize={12} fill="#64748b">단계 수 N</text>
              <text x={x(4)} y={H - 4} textAnchor="middle" fontSize={12} fill="#64748b">손계산</text>
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["한 칸 길이", showHand ? "1기간" : `${last.dt}년`],
                ["상승배수", showHand ? "1.2" : last.u],
                ["6.70과 차이", showHand ? "수열 밖" : (BS - last.value).toFixed(2)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-background px-2 py-2 text-center">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block font-mono text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
