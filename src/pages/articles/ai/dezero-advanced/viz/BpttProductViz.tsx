import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rnn-vs-lstm 첫 문단 — BPTT에서 Jacobian이 계속 곱해져 gradient가 사라지거나 커진다.
 * 이 글의 고정 예제처럼 hidden dimension 1이면 Jacobian ∂hₜ/∂hₜ₋₁은 숫자 하나다.
 * 매 단계 같은 값 J를 가정: 0.5¹⁰ ≈ 0.00098, 1.5¹⁰ ≈ 57.7 (10단계·J 값은 가정).
 */
const STEPS = 10;
const SMALL = 0.5;
const LARGE = 1.5;
const powers = (base: number) => Array.from({ length: STEPS + 1 }, (_, k) => base ** k);
const SMALL_SERIES = powers(SMALL);
const LARGE_SERIES = powers(LARGE);

const fmt = (value: number) => (value >= 10 ? value.toFixed(1) : value >= 0.1 ? value.toFixed(2) : value.toFixed(5));

const SCENES = [
  {
    label: "한 단계 거꾸로",
    summary: "gradient × J",
    note: "BPTT(backpropagation through time)는 시간을 거슬러 한 시점씩 gradient를 넘깁니다. 기본 RNN이 hₜ = tanh(xW + hₜ₋₁U)이고 hidden이 1차원이면, hₜ에서 hₜ₋₁로 넘어갈 때 곱하는 Jacobian ∂hₜ/∂hₜ₋₁ = U·(1 − hₜ²)는 숫자 하나입니다. 여기서는 그 값을 J로 부릅니다.",
  },
  {
    label: "J = 0.5가 반복될 때",
    summary: "0.5¹⁰ ≈ 0.001",
    note: "매 시점 J가 0.5라고 가정하면 10시점 뒤에서 처음 시점까지 돌아온 gradient는 0.5를 10번 곱한 약 0.00098배입니다. 처음 입력에 대한 학습 신호가 거의 사라집니다.",
  },
  {
    label: "J = 1.5가 반복될 때",
    summary: "1.5¹⁰ ≈ 57.7",
    note: "J가 1.5이면 같은 10번의 곱이 약 57.7배가 되어 gradient가 커집니다. 한 번의 곱은 작은 차이지만 시퀀스가 길수록 반복 횟수만큼 벌어집니다. LSTM의 cell state 덧셈 경로는 이보다 gradient가 흐르기 쉬운 통로를 주지만 자동으로 모두 해결하지는 않습니다.",
  },
] as const;

const W = 360;
const H = 170;
const LEFT = 14;
const RIGHT = 14;
const BASE_Y = 132;
const TOP_Y = 24;
const BAR_W = 20;
const GAP = (W - LEFT - RIGHT - (STEPS + 1) * BAR_W) / STEPS;
const bx = (k: number) => LEFT + k * (BAR_W + GAP);

export default function BpttProductViz() {
  return (
    <SceneShell
      eyebrow="BPTT"
      title="같은 숫자를 시점 수만큼 곱하면 gradient가 사라지거나 커집니다"
      description="막대 하나가 '마지막 시점에서 k시점 거슬러 올라간 gradient 배율'입니다. 왼쪽이 마지막 시점(배율 1), 오른쪽 끝이 10시점 전입니다. 10시점과 J 값은 설명용 가정입니다."
      ariaLabel="hidden 1차원 RNN에서 Jacobian을 10번 곱할 때 gradient 배율이 줄거나 커지는 모습"
      scenes={SCENES}
      render={(active) => {
        const series = active === 2 ? LARGE_SERIES : SMALL_SERIES;
        const max = series.reduce<number>((m, v) => Math.max(m, v), 0);
        const shown = active === 0 ? 2 : STEPS + 1;
        const color = active === 2 ? "#d97706" : "#2563eb";
        const height = (v: number) => Math.max((v / max) * (BASE_Y - TOP_Y), 1);
        const labelled = new Set([0, 1, STEPS]);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {series.map((value, k) => {
              const visible = k < shown;
              return (
                <g key={k}>
                  {visible ? (
                    <rect x={bx(k)} y={BASE_Y - height(value)} width={BAR_W} height={height(value)} rx={2} fill={color} opacity={labelled.has(k) ? 0.9 : 0.55} />
                  ) : (
                    <rect x={bx(k)} y={BASE_Y - 6} width={BAR_W} height={6} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
                  )}
                  {visible && labelled.has(k) && (
                    <text x={bx(k) + BAR_W / 2} y={BASE_Y - height(value) - 5} textAnchor={k === STEPS ? "end" : "middle"} fontSize={11} fontWeight={700} fill={color}>
                      {active === 0 && k === 1 ? "J" : fmt(value)}
                    </text>
                  )}
                  {(k === 0 || k === 1 || k === STEPS) && (
                    <text x={bx(k) + BAR_W / 2} y={BASE_Y + 14} textAnchor={k === STEPS ? "end" : "middle"} fontSize={11} fill="#64748b">
                      {k === 0 ? "t=10" : k === STEPS ? "t=0" : "t=9"}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={LEFT} x2={W - RIGHT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT} y={H - 6} fontSize={11} fill="#64748b">
              {active === 0 ? "한 시점 거슬러 갈 때마다 J를 한 번 곱합니다" : `막대 높이는 이 장면의 최댓값 ${fmt(max)}에 맞춘 비율`}
            </text>
          </svg>
        );
      }}
    />
  );
}
