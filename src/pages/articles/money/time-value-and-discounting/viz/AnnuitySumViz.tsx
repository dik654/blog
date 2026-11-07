import SceneShell from "./SceneShell";

/**
 * 본문 대응: #annuity — 매기 같은 C의 현재가치가 등비수열의 합이고, T가 커지면 C/r로 수렴한다.
 * C=4천만 원, r=8%: T=3 10,308, T=10 26,840, T=30 45,031, 영원히 C/r=50,000 (만 원).
 * 대괄호 [1−(1+r)^(−T)]: 0.2062, 0.5368, 0.9006, →1.
 */
const C = 4000;
const R = 0.08;
const LIMIT = C / R;
const YEARS = 30;
const LEFT = 12;
const BAR_W = 8;
const GAP = 3;
const BASE = 104;
const K = 0.018;
const barX = (t: number) => LEFT + (t - 1) * (BAR_W + GAP);
const presentOf = (t: number) => C / (1 + R) ** t;

const SCENES = [
  { label: "3년만 들어오면", summary: "대괄호 0.2062 → 10,308만 원", T: 3, note: "위 그림의 사업에서 들어오는 돈의 현재가치입니다. 각 막대가 앞 막대를 1.08로 나눈 값이라 등비수열이고, 식 하나로 합이 나옵니다." },
  { label: "10년이면", summary: "대괄호 0.5368 → 26,840만 원", T: 10, note: "기간을 늘렸습니다(가정). 뒤의 막대일수록 낮아, 기간이 3배쯤 늘어도 합은 3배가 되지 않습니다." },
  { label: "30년이면", summary: "대괄호 0.9006 → 45,031만 원", T: 30, note: "30년째 막대는 4천만 원의 약 10%입니다(가정). 합은 윗선에 거의 닿았고 기간을 더 늘려도 보탤 몫이 얼마 남지 않습니다." },
  { label: "영원히 들어온다면", summary: "대괄호 → 1, 합 → C/r = 50,000만 원", T: 31, note: "대괄호가 1에 가까워지므로 합은 C/r로 수렴합니다. 끝없이 받아도 합이 무한히 커지지 않는다는 뜻입니다. 그림은 30년까지만 그렸고 나머지 막대는 생략했습니다." },
] as const;

export default function AnnuitySumViz() {
  return (
    <SceneShell
      eyebrow="연금의 합"
      title="막대가 끝없이 이어져도 합에는 윗선이 있습니다"
      description="막대는 매년 4천만 원(C)의 오늘 값(할인율 r=8%), 띠는 그 합입니다. 단위는 만 원입니다. 합은 대괄호 [1−(1+r)^(−T)]에 C/r을 곱한 값이고, T는 기간의 수입니다."
      ariaLabel="연금 현재가치의 합이 C 나누기 r로 수렴하는 과정"
      scenes={SCENES}
      render={(active) => {
        const T = SCENES[active].T;
        const sum = (C * (1 - (1 + R) ** -T)) / R;
        const filled = T > 30 ? LIMIT : sum;
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={14} fontSize={12} fill="#64748b">각 해의 4,000이 오늘 갖는 값</text>
            {Array.from({ length: YEARS }, (_, index) => {
              const t = index + 1;
              const h = presentOf(t) * K;
              const on = t <= T;
              return (
                <rect key={t} x={barX(t)} y={BASE - h} width={BAR_W} height={h} rx={1} fill={on ? "#2563eb" : "#94a3b8"} fillOpacity={on ? 0.75 : 0.18} />
              );
            })}
            <line x1={LEFT} x2={348} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[1, 10, 20, 30].map((t) => (
              <text key={t} x={barX(t) + BAR_W / 2} y={BASE + 13} textAnchor="middle" fontSize={11} fill="#64748b">{t}년</text>
            ))}
            <rect x={LEFT} y={132} width={336} height={14} rx={2} fill="#94a3b8" fillOpacity={0.14} stroke="#94a3b8" strokeWidth={1} />
            <rect x={LEFT} y={132} width={(filled / LIMIT) * 336} height={14} rx={2} fill="#2563eb" fillOpacity={0.75} />
            <text x={LEFT} y={163} fontSize={12} fontWeight={700} fill="#2563eb">합 {T > 30 ? "→ 50,000" : Math.round(sum).toLocaleString("en-US")}</text>
            <text x={348} y={163} textAnchor="end" fontSize={12} fill="#64748b">윗선 C/r = 50,000</text>
          </svg>
        );
      }}
    />
  );
}
