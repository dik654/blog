import SceneShell from "./SceneShell";

/**
 * 본문 대응: #grpo-process "긴 reasoning에서는 loss normalization도 학습 신호다".
 * 가정: 같은 group의 completion 2개, 길이 10 token과 100 token. 고정 최대 길이 L_max = 200.
 * sample-level: 각자 길이로 나눈 뒤 2개 평균 → token 무게 1/20 = 0.05, 1/200 = 0.005, completion 몫 0.5 · 0.5
 * group active token(DAPO): 110으로 나눔 → token 무게 1/110 ≈ 0.0091, 몫 10/110 ≈ 9% · 100/110 ≈ 91%
 * 고정 최대 길이(Dr. GRPO): 200으로 나눔 → token 무게 0.005, 몫 0.05 · 0.5
 * 막대: 가로 = token 수, 세로 = token 하나의 무게, 넓이 = completion 전체가 받는 몫.
 */
const SHORT = 10;
const LONG = 100;
const G = 2;
const L_MAX = 200;

const SCENES = [
  {
    label: "Original · sample별 길이로 나눔",
    short: 1 / (G * SHORT),
    long: 1 / (G * LONG),
    summary: "token 무게 0.05 vs 0.005",
    note: "자기 길이로 나눈 뒤 평균하면 두 completion이 0.5씩 같은 몫을 받아, 짧은 쪽 token 하나가 긴 쪽의 10배 무게를 갖습니다. DAPO가 문제 삼은 차이입니다.",
  },
  {
    label: "Group active token 수로 나눔",
    short: 1 / (SHORT + LONG),
    long: 1 / (SHORT + LONG),
    summary: "모든 token 1/110 ≈ 0.009",
    note: "DAPO처럼 group 전체 active token(padding을 뺀 실제 completion token) 110개로 나누면 token 무게가 모두 같고, 긴 completion이 약 91%를 차지합니다. 분모는 이번 group의 길이에 따라 바뀝니다.",
  },
  {
    label: "고정 최대 길이로 나눔",
    short: 1 / L_MAX,
    long: 1 / L_MAX,
    summary: "모든 token 1/200 = 0.005",
    note: "Dr. GRPO처럼 고정된 최대 길이로 나눠도 token 무게는 같습니다. 긴 답이 50 token이었다면 앞 방식의 분모는 60이 되지만 이 방식은 200 그대로입니다.",
  },
] as const;

const W = 360;
const H = 164;
const X0 = 70;
const BAR_W = 270;
const PX_PER_TOKEN = BAR_W / LONG;
const MAX_H = 60;
const PX_PER_WEIGHT = MAX_H / (1 / (G * SHORT));

function Row({ y, tokens, weight, label, color }: { y: number; tokens: number; weight: number; label: string; color: string }) {
  const h = Math.max(1.5, weight * PX_PER_WEIGHT);
  return (
    <g>
      <text x={X0 - 8} y={y - 4} textAnchor="end" fontSize={13} fontWeight={700} fill="#334155">{label}</text>
      <text x={X0 - 8} y={y + 10} textAnchor="end" fontSize={12} fill="#64748b">{tokens} token</text>
      <line x1={X0} x2={X0 + BAR_W} y1={y} y2={y} stroke="#cbd5e1" strokeWidth={1} />
      <rect x={X0} y={y - h} width={tokens * PX_PER_TOKEN} height={h} fill={color} />
      <text x={X0} y={y - h - 6} fontSize={12} fill="#334155">
        token당 {weight.toFixed(4)} · 몫 {(weight * tokens).toFixed(2)}
      </text>
    </g>
  );
}

export default function LossAggregationViz() {
  return (
    <SceneShell
      eyebrow="Loss aggregation"
      title="무엇으로 나누느냐가 긴 completion token의 무게를 바꿉니다"
      description="같은 group의 completion 두 개를 놓았습니다. 막대 가로는 token 수, 세로는 token 하나가 loss에 들어가는 무게, 넓이는 completion 전체가 받는 몫입니다. 길이 10·100 token과 최대 길이 200은 가정입니다."
      ariaLabel="sample별 길이 정규화, group active token 정규화, 고정 최대 길이 정규화에서 짧은·긴 completion의 token 무게 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${scene.label}: ${scene.summary}`}
          >
            <Row y={80} tokens={SHORT} weight={scene.short} label="짧은 답" color="#2563eb" />
            <Row y={150} tokens={LONG} weight={scene.long} label="긴 답" color="#d97706" />
          </svg>
        );
      }}
    />
  );
}
