import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dedup-contamination 해석문 — SD = √(J(1−J)/K).
 * J=0.8: K=128 ≈ 0.035, K=512 ≈ 0.018. J=0.5: K=128 ≈ 0.044, K=512 ≈ 0.022.
 */
const W = 360;
const H = 190;
const LEFT = 38;
const RIGHT = 350;
const TOP = 14;
const BASE = 160;
const K_MIN = 32;
const K_MAX = 512;
const SD_MAX = 0.09;

const sd = (j: number, k: number) => Math.sqrt((j * (1 - j)) / k);
const xOf = (k: number) => LEFT + ((k - K_MIN) / (K_MAX - K_MIN)) * (RIGHT - LEFT);
const yOf = (value: number) => BASE - (value / SD_MAX) * (BASE - TOP);
const SAMPLE_KS = Array.from({ length: 61 }, (_, index) => K_MIN + (index * (K_MAX - K_MIN)) / 60);
const curve = (j: number) => SAMPLE_KS.map((k) => `${xOf(k).toFixed(1)},${yOf(sd(j, k)).toFixed(1)}`).join(" ");

const SCENES = [
  { label: "K = 128", summary: "J 0.8에서 표준편차 ≈ 0.035", note: "J ≈ 0.8인 near-duplicate 후보에 해시 128개를 쓰면 추정치가 흔들리는 폭은 표준편차로 약 0.035입니다." },
  { label: "K = 512", summary: "4배 늘려 ≈ 0.018", note: "해시를 4배로 늘려도 표준편차는 절반 정도입니다. K의 제곱근에 반비례하기 때문입니다. 곡선은 눕지만 0에 닿지 않으므로 판정에는 threshold와 오차 범위를 함께 적어야 합니다." },
  { label: "J가 0.5에 가까우면", summary: "K 128: ≈ 0.044, K 512: ≈ 0.022", note: "같은 K에서도 J가 0.5에 가까울수록 한 번의 일치 시행이 갖는 분산이 커서 곡선이 위로 올라갑니다. J(1−J)가 0.16에서 0.25로 커진 결과입니다." },
] as const;

const MARKS: readonly (readonly { j: number; k: number }[])[] = [
  [{ j: 0.8, k: 128 }],
  [{ j: 0.8, k: 128 }, { j: 0.8, k: 512 }],
  [{ j: 0.5, k: 128 }, { j: 0.5, k: 512 }],
];

export default function MinHashErrorViz() {
  return (
    <SceneShell
      eyebrow="해시 개수와 오차"
      title="해시를 4배 늘려도 오차는 절반으로 줄어듭니다"
      description="가로는 해시 함수 개수 K, 세로는 표준편차, 즉 추정치가 참값 J 주변에서 흔들리는 폭입니다. 해시 함수끼리 독립이라는 가정의 식 √(J(1−J)/K)로 그렸습니다."
      ariaLabel="해시 함수 개수에 따라 MinHash 추정의 표준편차가 줄어드는 곡선"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          {[0, 0.03, 0.06, 0.09].map((tick) => (
            <text key={tick} x={LEFT - 5} y={yOf(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick === 0 ? "0" : tick.toFixed(2)}</text>
          ))}
          {[32, 128, 256, 512].map((tick) => (
            <text key={tick} x={xOf(tick)} y={BASE + 15} textAnchor={tick === 512 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick}</text>
          ))}
          <text x={LEFT + 34} y={TOP + 2} fontSize={11} fill="#64748b">표준편차</text>
          <text x={(LEFT + RIGHT) / 2} y={BASE + 28} textAnchor="middle" fontSize={11} fill="#64748b">해시 함수 개수 K</text>
          <polyline points={curve(0.8)} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={active === 2 ? 0.45 : 1} />
          {active === 2 && <polyline points={curve(0.5)} fill="none" stroke="#d97706" strokeWidth={1.25} />}
          <text x={xOf(300)} y={yOf(sd(0.8, 300)) + 16} fontSize={11} fontWeight={700} fill="#2563eb">J = 0.8</text>
          {active === 2 && <text x={xOf(300)} y={yOf(sd(0.5, 300)) - 8} fontSize={11} fontWeight={700} fill="#d97706">J = 0.5</text>}
          {MARKS[active].map(({ j, k }) => {
            const value = sd(j, k);
            const color = j === 0.5 ? "#d97706" : "#2563eb";
            return (
              <g key={`${j}-${k}`}>
                <line x1={xOf(k)} x2={xOf(k)} y1={BASE} y2={yOf(value)} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={xOf(k)} cy={yOf(value)} r={3.5} fill={color} />
                <text x={xOf(k) + (k === 512 ? -3 : 6)} y={yOf(value) - 8} textAnchor={k === 512 ? "end" : "start"} fontSize={12} fontWeight={700} fill={color}>≈ {value.toFixed(3)}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
