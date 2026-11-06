import SceneShell from "./SceneShell";

/**
 * 본문 대응: #deployment — 효과가 절반이면 표본은 네 배. ExplainedFormula 의 식을 넓이로 그린다.
 * n = 2(1.96 + 0.84)²σ²/δ² = 15.68 ÷ (δ/σ)². 1 → 15.68, 1/2 → 62.72, 1/4 → 250.88, 1/8 → 1003.52.
 * 시작점 δ = σ 는 그림용 가정이다.
 */
const SCENES = [
  { label: "효과가 표준편차 1배", summary: "15.68 ÷ 1² ≈ 16개", side: 1, note: "유의수준 5%(우연을 차이로 오판할 위험), 검정력 80%(실제 차이를 잡아낼 확률)의 분위수 1.96과 0.84를 아래 식에 넣으면 2 × (1.96 + 0.84)² = 15.68입니다." },
  { label: "효과가 절반", summary: "15.68 ÷ (1/2)² ≈ 63개", side: 2, note: "효과를 절반으로 줄이면 한 변이 2배가 되고 넓이는 4배가 됩니다. 2배가 아니라 4배라는 점이 제곱 관계입니다." },
  { label: "효과가 1/4", summary: "15.68 ÷ (1/4)² ≈ 251개", side: 4, note: "효과를 다시 절반으로 줄이면 또 4배입니다. 처음과 비교하면 효과는 1/4인데 표본은 16배입니다." },
  { label: "효과가 1/8", summary: "15.68 ÷ (1/8)² ≈ 1,004개", side: 8, note: "효과 1/8에 표본 64배입니다. 감지하려는 효과가 작아질수록 표본이 이렇게 빠르게 불어나서 큰 서비스의 실험 하나가 수백만 사용자에 노출되기도 합니다." },
] as const;

const ROWS = [
  { side: 1, effect: "1배", n: "≈ 16" },
  { side: 2, effect: "1/2배", n: "≈ 63" },
  { side: 4, effect: "1/4배", n: "≈ 251" },
  { side: 8, effect: "1/8배", n: "≈ 1,004" },
] as const;

const UNIT = 22;
const X0 = 10;
const Y0 = 10;
const SIZE = UNIT * 8;
const GRID = Array.from({ length: 9 }, (_, index) => index * UNIT);

export default function SampleSquareViz() {
  return (
    <SceneShell
      eyebrow="효과와 표본 수"
      title="효과를 절반으로 잡으려면 표본은 네 배가 필요합니다"
      description="효과는 두 그룹의 평균 차이를 표준편차(지표가 흩어진 정도)로 나눈 값입니다. 칸 하나가 효과 1배일 때의 그룹당 표본이며, 1배 출발은 그림용 가정입니다."
      note="같은 분산과 큰 표본의 정규근사를 전제한 식의 값입니다."
      ariaLabel="감지하려는 효과가 절반이 될 때마다 필요한 표본이 네 배가 되는 넓이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const side = scene.side * UNIT;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={X0} y={Y0 + SIZE - side} width={side} height={side} fill="#2563eb" fillOpacity={0.32} />
            {GRID.map((offset) => (
              <g key={offset}>
                <line x1={X0 + offset} x2={X0 + offset} y1={Y0} y2={Y0 + SIZE} stroke="#94a3b8" strokeWidth={0.5} />
                <line x1={X0} x2={X0 + SIZE} y1={Y0 + offset} y2={Y0 + offset} stroke="#94a3b8" strokeWidth={0.5} />
              </g>
            ))}
            <rect x={X0} y={Y0 + SIZE - side} width={side} height={side} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <text x={206} y={26} fontSize={10.5} fill="#64748b">효과</text>
            <text x={350} y={26} textAnchor="end" fontSize={10.5} fill="#64748b">그룹당 표본</text>
            <line x1={206} x2={350} y1={32} y2={32} stroke="#94a3b8" strokeWidth={1} />
            {ROWS.map((row, index) => {
              const current = row.side === scene.side;
              return (
                <g key={row.side}>
                  {current && <rect x={200} y={38 + index * 30} width={154} height={26} rx={4} fill="#2563eb" fillOpacity={0.14} />}
                  <text x={206} y={56 + index * 30} fontSize={12} fontWeight={current ? 700 : 400} className="fill-foreground">{row.effect}</text>
                  <text x={350} y={56 + index * 30} textAnchor="end" fontSize={12} fontWeight={current ? 700 : 400} className="fill-foreground">{row.n}</text>
                </g>
              );
            })}
            <text x={206} y={176} fontSize={11} fontWeight={700} fill="#2563eb">효과 ÷2 → 한 변 ×2</text>
            <text x={206} y={191} fontSize={11} fontWeight={700} fill="#2563eb">넓이(표본) ×4</text>
          </svg>
        );
      }}
    />
  );
}
