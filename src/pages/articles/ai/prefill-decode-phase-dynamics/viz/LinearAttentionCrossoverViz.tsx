import SceneShell from "./SceneShell";

/**
 * 본문 대응: #long-context — dense 사례 P=7×10⁹, d=4096, N=32.
 * linear 2Pn, attention 2dNn(n+1). 교차 n* ≈ P/(dN) ≈ 53405.76.
 * 64K: 합 ≈ 2.0434 PFLOP → 989 TFLOP/s로 2.066 s. 128K: 6.3386 PFLOP → 6.409 s.
 * full 층 1/4: n* ≈ 213623 (축 밖).
 */
const P = 7e9;
const D = 4096;
const LAYERS = 32;
const RATE = 989e12;
const linear = (n: number) => 2 * P * n;
const attention = (n: number, layers: number) => 2 * D * layers * n * (n + 1);
const CROSS = P / (D * LAYERS);
const CROSS_QUARTER = P / (D * (LAYERS / 4));

const N_MAX = 140000;
const F_MAX = 5e15;
const PX0 = 44;
const PX1 = 340;
const PY0 = 184;
const PY1 = 18;
const sx = (n: number) => PX0 + (n / N_MAX) * (PX1 - PX0);
const sy = (f: number) => PY0 - (Math.min(f, F_MAX) / F_MAX) * (PY0 - PY1);
const pf = (f: number) => (f / 1e15).toFixed(3);

const SAMPLES = Array.from({ length: 57 }, (_, i) => (i / 56) * N_MAX);
const curve = (fn: (n: number) => number) =>
  SAMPLES.filter((n) => fn(n) <= F_MAX * 1.02)
    .map((n, i) => `${i === 0 ? "M" : "L"}${sx(n).toFixed(1)},${sy(fn(n)).toFixed(1)}`)
    .join(" ");
const LINEAR_PATH = curve(linear);
const ATTN_PATH = curve((n) => attention(n, LAYERS));
const ATTN_QUARTER_PATH = curve((n) => attention(n, LAYERS / 4));

const K64 = 65536;
const K128 = 131072;
const SUM64 = linear(K64) + attention(K64, LAYERS);
const SUM128 = linear(K128) + attention(K128, LAYERS);

const SCENES = [
  {
    label: "두 항이 같아지는 길이",
    summary: `n* ≈ ${CROSS.toFixed(2)}`,
    note: "linear 항(초록)은 위치 수에 비례해 직선으로, full causal attention 항(파랑)은 앞 위치 쌍을 세므로 n²에 가깝게 휘어 오릅니다. 두 주도항은 70억/(4096×32)≈53405.76위치 근처에서 같아집니다.",
  },
  {
    label: "64K = 65536위치",
    summary: `합 ≈ ${(SUM64 / 1e15).toFixed(4)} PFLOP → ${(SUM64 / RATE).toFixed(3)} s`,
    note: "교차 길이를 조금 넘은 64K에서는 attention 항이 linear 항보다 약간 큽니다. 두 항의 합 약 2.0434 PFLOP를 989 TFLOP/s로 나눈 계산 하한은 약 2.066초입니다. 실제 실행 측정이나 TTFT가 아닙니다.",
  },
  {
    label: "128K = 131072위치",
    summary: `합 ≈ ${(SUM128 / 1e15).toFixed(4)} PFLOP → ${(SUM128 / RATE).toFixed(3)} s`,
    note: "위치 수를 두 배로 늘리면 linear 항은 두 배지만 attention 항은 약 네 배가 됩니다. 합은 약 6.3386 PFLOP, 계산 하한은 약 6.409초입니다.",
  },
  {
    label: "full-attention 층만 1/4로",
    summary: `n* ≈ ${Math.round(CROSS_QUARTER).toLocaleString("en-US")} (축 밖)`,
    note: "다른 조건을 그대로 두고 full-attention 층만 1/4로 줄이면 attention 항(파랑 점선)이 1/4로 눕고 교차 길이는 약 213623위치로 옮겨 가 이 축을 벗어납니다. 바꾼 층의 local·linear 비용은 이 두 항에 없고 따로 남습니다.",
  },
] as const;

export default function LinearAttentionCrossoverViz() {
  return (
    <SceneShell
      eyebrow="긴 문맥의 두 연산 항"
      title="위치가 늘면 attention 항이 linear 항을 따라잡고 앞지릅니다"
      description="가로축은 입력 위치 수 n, 세로축은 연산량(PFLOP, 10¹⁵ FLOP)입니다. 초록 직선은 dense linear 주도항 2Pn, 파랑 곡선은 full causal attention의 유효 연산 2dNn(n+1)입니다. 16절의 dense 가정 P=70억·d=4096·N=32를 씁니다."
      ariaLabel="입력 길이에 따른 linear 연산 항과 attention 연산 항의 교차"
      scenes={SCENES}
      render={(active) => {
        const marker = active === 1 ? K64 : active === 2 ? K128 : null;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1, 2, 3, 4, 5].map((t) => (
              <g key={t}>
                <line x1={PX0} x2={PX1} y1={sy(t * 1e15)} y2={sy(t * 1e15)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={PX0 - 6} y={sy(t * 1e15) + 3.5} textAnchor="end" fontSize={10} fill="#64748b">{t}</text>
              </g>
            ))}
            <text x={PX0 - 6} y={10} textAnchor="end" fontSize={9.5} fill="#64748b">PFLOP</text>
            <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke="#94a3b8" strokeWidth={1} />
            {[
              { n: 0, t: "0" },
              { n: K64, t: "64K" },
              { n: K128, t: "128K" },
            ].map((tick) => (
              <g key={tick.t}>
                <line x1={sx(tick.n)} x2={sx(tick.n)} y1={PY0} y2={PY0 + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(tick.n)} y={PY0 + 15} textAnchor="middle" fontSize={10} fill="#64748b">{tick.t}</text>
              </g>
            ))}
            <text x={PX1} y={PY0 + 28} textAnchor="end" fontSize={10} fill="#64748b">입력 위치 수 n</text>

            <path d={LINEAR_PATH} fill="none" stroke="#0f766e" strokeWidth={1.25} />
            <path d={ATTN_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={active === 3 ? 0.3 : 1} />
            {active === 3 && <path d={ATTN_QUARTER_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />}
            <text x={sx(N_MAX) - 2} y={sy(linear(N_MAX)) - 6} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#0f766e">linear 2Pn</text>
            <text x={sx(98000)} y={sy(attention(98000, LAYERS)) + 2} textAnchor="end" dx={-6} fontSize={10.5} fontWeight={700} fill="#2563eb" opacity={active === 3 ? 0.4 : 1}>attention</text>

            {active === 0 && (
              <g>
                <line x1={sx(CROSS)} x2={sx(CROSS)} y1={sy(linear(CROSS))} y2={PY0} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(CROSS)} cy={sy(linear(CROSS))} r={3.5} fill="#d97706" />
                <text x={sx(CROSS)} y={sy(linear(CROSS)) - 30} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#d97706">≈ 53,406위치</text>
              </g>
            )}
            {marker !== null && (
              <g>
                <line x1={sx(marker)} x2={sx(marker)} y1={PY1} y2={PY0} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(marker)} cy={sy(linear(marker))} r={3.5} fill="#0f766e" />
                <circle cx={sx(marker)} cy={sy(attention(marker, LAYERS))} r={3.5} fill="#2563eb" />
                <text x={sx(marker) + 6} y={sy(linear(marker)) + 12} fontSize={10.5} fontWeight={700} fill="#0f766e">{pf(linear(marker))}</text>
                <text x={sx(marker) - 6} y={sy(attention(marker, LAYERS)) + (active === 2 ? 14 : -6)} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#2563eb">{pf(attention(marker, LAYERS))}</text>
              </g>
            )}
            {active === 3 && (
              <text x={PX1} y={PY0 - 8} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#2563eb">교차 ≈ 213,623 →</text>
            )}
          </svg>
        );
      }}
    />
  );
}
