import LstmSceneShell from "./LstmSceneShell";

/**
 * 본문 대응: #gates "Forget bias" — 다른 logit 기여가 0이면 bias 1에서 f=σ(1)≈0.731.
 * 같은 f가 20 step 이어지면 direct retention은 0.731^20≈0.0019.
 * 5 step 값 0.731^5≈0.21은 같은 숫자로 계산한 중간 지점이다.
 */
const F = 0.731;
const STEPS = 20;
const VALUES = Array.from({ length: STEPS }, (_, index) => F ** (index + 1));

const W = 360;
const H = 190;
const LEFT = 34;
const RIGHT = 10;
const BASE_Y = 160;
const TOP_Y = 18;
const SLOT = (W - LEFT - RIGHT) / STEPS;
const BAR_W = SLOT * 0.62;
const bx = (step: number) => LEFT + (step - 1) * SLOT + (SLOT - BAR_W) / 2;
const by = (value: number) => BASE_Y - value * (BASE_Y - TOP_Y);

const SCENES = [
  { label: "한 step", step: 1, summary: "f = σ(1) ≈ 0.731", note: "다른 logit 기여가 0이면 forget bias 1이 만드는 gate 값은 σ(1)≈0.731입니다. 한 step만 보면 이전 cell의 73%가 남는 꽤 큰 값입니다." },
  { label: "5 step", step: 5, summary: "0.731⁵ ≈ 0.21", note: "같은 f를 다섯 번 곱하면 약 0.21입니다. 매 step 남는 비율은 같아도 이미 줄어든 값에 다시 곱해져 막대가 빠르게 낮아집니다." },
  { label: "20 step", step: 20, summary: "0.731²⁰ ≈ 0.0019", note: "20번 곱하면 약 0.0019로 막대가 거의 보이지 않습니다. 초기 bias는 학습을 시작할 조건이지 원하는 memory horizon을 자동으로 보장하는 설정이 아닙니다." },
] as const;

export default function ForgetBiasDecayViz() {
  return (
    <LstmSceneShell
      eyebrow="Forget bias 1의 direct retention"
      title="한 step에 0.731이 남아도 20 step을 곱하면 0.0019만 남습니다"
      description="t번째 막대가 t step 뒤까지 남은 direct contribution 0.731ᵗ입니다. 세로축은 0에서 1입니다. 다른 logit 기여가 0이라 20 step 내내 같은 f가 나온다는 글의 가정을 따랐습니다."
      note="gate network를 지나는 다른 gradient 경로는 빼고 cell의 direct path만 셉니다."
      ariaLabel="forget gate 0.731을 1, 5, 20 step 곱했을 때 남는 비율"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={by(tick)} y2={by(tick)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "3 3"} />
                <text x={LEFT - 6} y={by(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            {VALUES.map((value, index) => {
              const step = index + 1;
              const isActive = step === scene.step;
              const reached = step <= scene.step;
              return (
                <rect
                  key={step}
                  x={bx(step)}
                  y={by(value)}
                  width={BAR_W}
                  height={Math.max(BASE_Y - by(value), 0.5)}
                  rx={1.5}
                  fill={isActive ? "#2563eb" : reached ? "#93c5fd" : "#cbd5e1"}
                />
              );
            })}
            <text x={bx(scene.step) + BAR_W / 2} y={Math.min(by(VALUES[scene.step - 1]) - 6, BASE_Y - 8)} textAnchor={scene.step > 15 ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#1d4ed8">
              {scene.summary.split("≈")[1]?.trim() ?? ""}
            </text>
            {[1, 5, 10, 15, 20].map((step) => (
              <text key={step} x={bx(step) + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={10} fill="#64748b">{step}</text>
            ))}
            <text x={W - RIGHT} y={BASE_Y + 28} textAnchor="end" fontSize={10} fill="#64748b">지난 step 수</text>
          </svg>
        );
      }}
    />
  );
}
