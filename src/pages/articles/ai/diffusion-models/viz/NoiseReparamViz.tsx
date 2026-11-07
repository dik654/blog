import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loss-derivation — 같은 분산 두 Gaussian의 KL = ‖μ̃−μ_θ‖²/(2σₜ²).
 * μ̃·μ_θ를 xₜ와 noise 식으로 쓰면 간격은 계수×(ε−ε_θ), 치환 후 w_t‖ε−ε_θ‖², w_t=1이면 L_ε.
 * 두 곡선의 위치와 간격은 그림용 가정이다.
 */
const SCENES = [
  { label: "모양이 같으면 간격만 남음", summary: "KL = ‖μ̃ − μ_θ‖² / (2σₜ²)", gap: "μ̃ − μ_θ", note: "정답 posterior와 model을 같은 분산의 Gaussian으로 두면 곡선 모양이 같습니다. KL은 두 평균 사이 간격의 제곱으로 정리됩니다." },
  { label: "간격을 noise로 다시 씀", summary: "μ̃ − μ_θ ∝ ε − ε_θ", gap: "ε − ε_θ에 비례", note: "x₀를 xₜ와 ε로 치환하면 μ̃는 ε로, model은 ε_θ로 같은 형태가 됩니다. xₜ 항은 지워지고 간격에는 두 noise의 차이만 남습니다." },
  { label: "계수를 1로 둠", summary: "w_t‖ε − ε_θ‖² → ‖ε − ε_θ‖²", gap: "그림의 간격은 그대로 · 계수 w_t만 1로", note: "남는 계수 w_t는 유도가 정한 값입니다. L_ε은 w_t를 전부 1로 둔 재가중치 버전이지, 유도에서 자동으로 나온 결과가 아닙니다." },
];

const BASE = 150;
const SD = 34;
const bell = (mean: number) =>
  Array.from({ length: 61 }, (_, i) => {
    const x = mean - 3 * SD + (i * SD) / 10;
    const y = BASE - 96 * Math.exp(-((x - mean) ** 2) / (2 * SD * SD));
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
const TRUE_MEAN = 150;
const MODEL_MEAN = 214;
const TRUE_PATH = bell(TRUE_MEAN);
const MODEL_PATH = bell(MODEL_MEAN);

export default function NoiseReparamViz() {
  return (
    <SceneShell
      eyebrow="왜 noise를 맞히는가"
      title="두 곡선의 간격이 결국 두 noise의 차이가 됩니다"
      description="파란 곡선은 정답 reverse 분포, 주황 곡선은 model의 reverse 분포입니다. 위치와 간격은 그림을 위한 값이며 측정값이 아닙니다(가정)."
      ariaLabel="같은 분산의 두 Gaussian 간격이 noise 예측 오차로 바뀌는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={20} x2={340} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <path d={TRUE_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
          <path d={MODEL_PATH} fill="none" stroke="#b45309" strokeWidth={1.25} />
          <text x={TRUE_MEAN} y={BASE + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">μ̃</text>
          <text x={MODEL_MEAN} y={BASE + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">μ_θ</text>
          <line x1={TRUE_MEAN} x2={TRUE_MEAN} y1={BASE} y2={40} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={MODEL_MEAN} x2={MODEL_MEAN} y1={BASE} y2={40} stroke="#b45309" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={TRUE_MEAN + 3} x2={MODEL_MEAN - 3} y1={40} y2={40} stroke="currentColor" strokeWidth={1} />
          <text x={(TRUE_MEAN + MODEL_MEAN) / 2} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{SCENES[active].gap}</text>
        </svg>
      )}
    />
  );
}
