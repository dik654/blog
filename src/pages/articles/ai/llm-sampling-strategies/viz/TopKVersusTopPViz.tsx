import SceneShell from "./SceneShell";

/**
 * 본문 대응: #top-p — 같은 top-k=2, top-p=0.8 을 T=0.5·원본·T=2 분포에 적용.
 * 누적: T=0.5 [0.769, 0.892, …] → p 2개 · 원본 [0.50, 0.70, 0.85, …] → 3개 · T=2 [0.340, 0.555, 0.741, 0.893, …] → 4개.
 * Top-k=2 는 세 분포 모두 A·B.
 */
const LETTERS = ["A", "B", "C", "D", "E"] as const;
const K = 2;
const P = 0.8;

const DISTS: readonly (readonly number[])[] = [
  [0.769, 0.123, 0.069, 0.031, 0.008],
  [0.5, 0.2, 0.15, 0.1, 0.05],
  [0.34, 0.215, 0.186, 0.152, 0.107],
];

const cumulative = (dist: readonly number[]) =>
  dist.reduce<number[]>((acc, value) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + value], []);
const fmtSum = (value: number) => value.toFixed(3).replace(/0$/, "");
const keptByP = (dist: readonly number[]) => cumulative(dist).findIndex((sum) => sum >= P - 1e-9) + 1;

const SCENES = [
  { label: "T=0.5 · 뾰족", summary: "top-k 2개 · top-p 2개", note: "A+B=0.892 가 이미 0.8 을 넘어 top-p 도 B 에서 멈춥니다. 뾰족한 분포에서는 두 규칙이 같은 A·B 를 남깁니다." },
  { label: "원본", summary: "top-k 2개 · top-p 3개", note: "A+B=0.70 은 0.8 에 못 미쳐 top-p 는 C 까지 더한 0.85 에서 멈춥니다. Top-k=2 는 C(0.15)가 B(0.20)와 큰 차이가 없어도 버립니다." },
  { label: "T=2 · 평평", summary: "top-k 2개 · top-p 4개", note: "평평해진 분포에서는 A+B+C=0.741 로도 부족해 top-p 가 D 까지 더한 0.893 에서 멈춥니다. Top-k=2 는 여전히 A·B 만 남깁니다." },
] as const;

const VW = 360;
const LEFT = 72;
const RIGHT = 332;
const BAR_H = 26;
const ROWS_Y = [34, 112] as const;
const VH = 176;
const xOf = (value: number) => LEFT + value * (RIGHT - LEFT);

function Row({ dist, kept, y, name }: { dist: readonly number[]; kept: number; y: number; name: string }) {
  const sums = cumulative(dist);
  const total = sums[kept - 1];
  return (
    <g>
      <text x={LEFT - 6} y={y + 17} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">{name}</text>
      {dist.map((value, index) => {
        const start = index === 0 ? 0 : sums[index - 1];
        const on = index < kept;
        const width = xOf(value) - LEFT;
        return (
          <g key={LETTERS[index]}>
            <rect
              x={xOf(start)}
              y={y}
              width={width}
              height={BAR_H}
              fill={on ? "#2563eb" : "none"}
              fillOpacity={on ? 0.3 : 0}
              stroke={on ? "#2563eb" : "#94a3b8"}
              strokeWidth={1}
              strokeDasharray={on ? undefined : "2 3"}
            />
            {width >= 14 && (
              <text x={xOf(start) + width / 2} y={y + 17} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? "#1e293b" : "#94a3b8"}>
                {LETTERS[index]}
              </text>
            )}
          </g>
        );
      })}
      <line x1={xOf(total)} x2={xOf(total)} y1={y - 4} y2={y + BAR_H + 4} stroke="#1e293b" strokeWidth={1.25} />
      <text x={Math.max(xOf(total), LEFT + 130)} y={y + BAR_H + 16} textAnchor="end" fontSize={11} fill="#334155">
        {kept}개 남김 · 누적 {fmtSum(total)}
      </text>
    </g>
  );
}

export default function TopKVersusTopPViz() {
  return (
    <SceneShell
      eyebrow="Top-k · top-p · 분포 모양"
      title="Top-k=2 는 늘 2개, top-p=0.8 은 분포 모양에 따라 2·3·4개를 남깁니다"
      description="막대 하나가 확률 1 전체이고, 칸 너비가 각 token 의 확률을 큰 순서로 이어 붙인 것입니다. 남긴 token 은 색칠, 버린 token 은 점선이며 세로선이 자른 지점의 누적 확률입니다. 세 분포는 본문의 T=0.5·원본·T=2 분포입니다."
      ariaLabel="T=0.5, 원본, T=2 분포에 top-k=2 와 top-p=0.8 을 적용했을 때 남는 token 수 비교"
      scenes={SCENES}
      render={(active) => {
        const dist = DISTS[active];
        return (
          <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={xOf(P)} x2={xOf(P)} y1={ROWS_Y[1] - 18} y2={ROWS_Y[1]} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={xOf(P)} y={ROWS_Y[1] - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">p = 0.8</text>
            <Row dist={dist} kept={K} y={ROWS_Y[0]} name="top-k=2" />
            <Row dist={dist} kept={keptByP(dist)} y={ROWS_Y[1]} name="top-p=0.8" />
            <text x={LEFT} y={20} fontSize={11} fill="#64748b">누적 0</text>
            <text x={RIGHT} y={20} textAnchor="end" fontSize={11} fill="#64748b">1.0</text>
          </svg>
        );
      }}
    />
  );
}
