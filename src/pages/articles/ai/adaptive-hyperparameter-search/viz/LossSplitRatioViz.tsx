import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 손실 0.40·0.25·0.20·0.35 를 경계 0.30 으로 나누고,
 * 가정한 밀도 P(l 0.30, g 0.05) → 6, Q(l 0.20, g 0.10) → 2 를 비교한다.
 * 밀도 값은 네 손실에서 계산되는 값이 아니라 본문의 가정이다.
 */
const LOSSES = [0.4, 0.25, 0.2, 0.35] as const;
const THRESHOLD = 0.3;
const CANDIDATES = [
  { name: "P", l: 0.3, g: 0.05 },
  { name: "Q", l: 0.2, g: 0.1 },
] as const;

const SCENES = [
  { label: "경계 0.30 으로 나눕니다", summary: "좋은 2개 · 나머지 2개", note: "손실은 작을수록 좋습니다. 0.30 보다 작은 0.25 와 0.20 이 좋은 무리, 0.40 과 0.35 가 나머지 무리입니다. 아래 칸은 아직 비어 있습니다." },
  { label: "후보 P 의 두 밀도", summary: "0.30 ÷ 0.05 = 6", note: "l 은 좋은 무리에서, g 는 나머지 무리에서 추정한 밀도입니다. 밀도는 그 설정 근처에 관측이 얼마나 몰려 있는지를 나타내는 값이며 성공 확률이 아닙니다. P 의 두 값은 가정입니다." },
  { label: "후보 Q 의 두 밀도", summary: "0.20 ÷ 0.10 = 2", note: "Q 는 좋은 무리 쪽 밀도 l 도 P 보다 낮고, 나머지 무리 쪽 밀도 g 는 더 높습니다. 그래서 비율이 2 로 작습니다. 두 값 모두 가정입니다." },
  { label: "비율이 큰 P 를 먼저", summary: "6 > 2 → P 먼저 실행", note: "이 규칙은 P 를 먼저 살펴봅니다. 실제 손실은 P 를 실행해 봐야 알며, P 가 더 나쁠 수도 있습니다." },
] as const;

const NUM_LEFT = 30;
const numX = (v: number) => NUM_LEFT + (v - 0.15) * 1000;
const BAR_MAX = 68;
const barW = (v: number) => (v / 0.3) * BAR_MAX;

export default function LossSplitRatioViz() {
  return (
    <SceneShell
      eyebrow="두 무리와 밀도 비율"
      title="손실 네 개를 두 무리로 나눈 뒤 후보마다 l ÷ g 를 비교합니다"
      description="위는 네 손실의 위치이고 아래는 두 후보의 밀도 막대입니다. l 은 좋은 무리에서, g 는 나머지 무리에서 추정한 밀도입니다. 손실 네 개와 경계, 밀도 값은 모두 본문의 가정입니다."
      ariaLabel="손실 네 개를 경계 0.30 으로 나누고 후보 P 와 Q 의 밀도 비율 6 과 2 를 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={numX(0.225)} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">좋은 무리</text>
          <text x={numX(0.375)} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">나머지 무리</text>
          <line x1={numX(0.15)} x2={numX(0.45)} y1={48} y2={48} stroke="#94a3b8" strokeWidth={1} />
          <line x1={numX(THRESHOLD)} x2={numX(THRESHOLD)} y1={22} y2={60} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
          <text x={numX(THRESHOLD)} y={74} textAnchor="middle" fontSize={10} fill="#dc2626">경계 0.30</text>
          <text x={numX(0.15)} y={74} textAnchor="start" fontSize={9} fill="#64748b">← 작을수록 좋음</text>
          {LOSSES.map((loss) => {
            const good = loss < THRESHOLD;
            return (
              <g key={loss}>
                <circle cx={numX(loss)} cy={48} r={5} fill={good ? "#2563eb" : "#94a3b8"} />
                <text x={numX(loss)} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={good ? "#2563eb" : "#475569"}>
                  {loss.toFixed(2)}
                </text>
              </g>
            );
          })}
          <line x1={10} x2={350} y1={86} y2={86} stroke="#e2e8f0" strokeWidth={1} />
          {CANDIDATES.map((cand, index) => {
            const x0 = 12 + index * 176;
            const shown = active === 3 || active === index + 1;
            const chosen = active === 3 && index === 0;
            const ratio = cand.l / cand.g;
            return (
              <g key={cand.name} opacity={active === 0 ? 0.25 : shown ? 1 : 0.35}>
                <rect x={x0} y={94} width={160} height={112} rx={8} fill="none" stroke={chosen ? "#2563eb" : "#cbd5e1"} strokeWidth={chosen ? 1.25 : 1} />
                <text x={x0 + 10} y={112} fontSize={12} fontWeight={700} fill="#475569">후보 {cand.name}</text>
                <text x={x0 + 10} y={133} fontSize={10} fill="#2563eb">l 좋은</text>
                <rect x={x0 + 52} y={124} width={active === 0 ? 0 : barW(cand.l)} height={12} rx={2} fill="#2563eb" />
                <text x={x0 + 150} y={133} textAnchor="end" fontSize={10} fill="#475569">{active === 0 ? "?" : cand.l.toFixed(2)}</text>
                <text x={x0 + 10} y={155} fontSize={10} fill="#64748b">g 나머지</text>
                <rect x={x0 + 52} y={146} width={active === 0 ? 0 : barW(cand.g)} height={12} rx={2} fill="#94a3b8" />
                <text x={x0 + 150} y={155} textAnchor="end" fontSize={10} fill="#475569">{active === 0 ? "?" : cand.g.toFixed(2)}</text>
                <text x={x0 + 10} y={184} fontSize={12} fontWeight={700} fill={chosen ? "#2563eb" : "#475569"}>
                  {active === 0 ? "l ÷ g = ?" : `l ÷ g = ${Math.round(ratio)}`}
                </text>
                <text x={x0 + 10} y={199} fontSize={9} fill="#64748b">{chosen ? "먼저 실행할 후보" : "밀도 값은 가정"}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
