import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loss-derivation Training 알고리즘 7행 — θ_ema ← m·θ_ema + (1−m)·θ, m=0.999.
 * θ는 한 숫자로 줄인 가상 궤적(가정). θ_ema는 그 궤적에 실제 m=0.999를 적용해 계산한다.
 */
const STEPS = 3000;
const M = 0.999;
const THETA = Array.from({ length: STEPS }, (_, k) => 0.2 + 0.6 * (1 - Math.exp(-k / 700)) + 0.07 * Math.sin(k / 9) + 0.05 * Math.sin(k / 31 + 1) + 0.04 * Math.sin(k / 4.3 + 2));
const EMA = THETA.reduce<number[]>((acc, value) => {
  acc.push(acc.length ? M * acc[acc.length - 1] + (1 - M) * value : value);
  return acc;
}, []);

const X0 = 16;
const X1 = 344;
const Y0 = 160;
const Y1 = 16;
const px = (k: number) => X0 + (k / (STEPS - 1)) * (X1 - X0);
const py = (v: number) => Y0 - v * (Y0 - Y1);
const pathOf = (series: readonly number[]) =>
  Array.from({ length: Math.floor(STEPS / 12) }, (_, i) => i * 12)
    .map((k, i) => `${i ? "L" : "M"}${px(k).toFixed(1)} ${py(series[k]).toFixed(1)}`)
    .join(" ");
const THETA_PATH = pathOf(THETA);
const EMA_PATH = pathOf(EMA);

const SCENES = [
  { label: "θ는 매 step 흔들림", summary: "θ ← θ − η∇loss", note: "gradient step마다 θ가 학습률 η만큼 움직입니다. 실제 θ는 weight 전체이지만 여기서는 숫자 하나로 줄여 그렸습니다(가정)." },
  { label: "θ_ema는 별도 buffer", summary: "m · θ_ema + (1−m) · θ", note: "m=0.999이면 매 step 이전 θ_ema를 0.999, 현재 θ를 0.001만큼 섞습니다. 한 step의 θ가 곧바로 크게 반영되지 않습니다." },
  { label: "sampling에는 θ_ema", summary: "학습 끝 → θ_ema를 사용", note: "여러 step을 평균한 θ_ema가 잡음 많은 θ보다 더 안정적인 sample을 만들므로 sampling에는 θ가 아니라 θ_ema를 씁니다." },
];

export default function EmaTrackViz() {
  return (
    <SceneShell
      eyebrow="학습 중 평균"
      title="흔들리는 θ 옆에 천천히 따라가는 θ_ema를 둡니다"
      description="θ는 network weight, θ_ema는 θ를 지수 이동 평균(EMA)한 사본입니다. 가로축은 gradient step 3000번, 세로 위치는 값의 크기입니다."
      note="θ 궤적은 모양을 보이려는 가상의 값입니다(가정). θ_ema는 이 궤적에 m=0.999를 실제로 적용해 계산했습니다. m=0.999~0.9999가 흔한 값입니다."
      ariaLabel="흔들리는 θ와 m=0.999 지수 이동 평균 θ_ema의 궤적"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 188" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          <text x={X0} y={Y0 + 18} fontSize={12} fill="currentColor">step 0</text>
          <text x={X1} y={Y0 + 18} textAnchor="end" fontSize={12} fill="currentColor">step 3000</text>
          <path d={THETA_PATH} fill="none" stroke="#94a3b8" strokeWidth={1} />
          <text x={px(250)} y={py(0.66)} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">θ</text>
          {active > 0 && <path d={EMA_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
          {active > 0 && <text x={px(1500)} y={py(EMA[1500]) + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">θ_ema</text>}
          {active === 2 && (
            <g>
              <circle cx={px(STEPS - 1)} cy={py(EMA[STEPS - 1])} r={4} fill="#2563eb" />
              <text x={px(STEPS - 1) - 8} y={py(EMA[STEPS - 1]) + 22} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">sampling에 사용</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
