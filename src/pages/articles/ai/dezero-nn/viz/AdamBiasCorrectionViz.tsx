import SceneShell from "./SceneShell";

/**
 * 본문 대응: #optimizer — Adam의 moment는 0에서 시작해 초기값이 작게 추정되므로 bias correction을 적용한다.
 * 가정: β=0.9, 매 step gradient g=0.5로 일정(글의 SGD 예제 gradient 값을 빌림).
 * m_t = 0.9·m_(t−1) + 0.1·g = 0.5·(1 − 0.9^t) → t=1: 0.05, t=3: 0.1355, t=10: 0.3257(반올림).
 * 보정 m̂_t = m_t / (1 − 0.9^t) = 0.5.
 */
const BETA = 0.9;
const G = 0.5;
const STEPS = 10;
const M = Array.from({ length: STEPS }, (_, i) => G * (1 - BETA ** (i + 1)));

const SCENES: { label: string; summary: string; show: number; corrected: boolean; note: string }[] = [
  {
    label: "t=1: 첫 평균이 작음",
    summary: "m₁ = 0.1×0.5 = 0.05",
    show: 1,
    corrected: false,
    note: "m₀=0에서 시작하면 첫 step의 m은 gradient 0.5의 10%인 0.05입니다. 실제 gradient가 작아서가 아니라 0이라는 시작값이 평균에 섞였기 때문입니다.",
  },
  {
    label: "t=3: 아직 절반에 못 미침",
    summary: "m₃ = 0.1355",
    show: 3,
    corrected: false,
    note: "같은 gradient가 세 번 들어와도 m은 0.05 → 0.095 → 0.1355로 천천히 올라갑니다.",
  },
  {
    label: "t=10: 여전히 0.5 아래",
    summary: "m₁₀ ≈ 0.3257",
    show: 10,
    corrected: false,
    note: "열 번째 step에서도 m은 0.5×(1−0.9¹⁰) ≈ 0.3257입니다. gradient가 일정한 이 가정에서는 모자란 비율이 정확히 0.9ᵗ라서 미리 계산할 수 있습니다.",
  },
  {
    label: "bias correction",
    summary: "m̂ = m ÷ (1−0.9ᵗ) = 0.5",
    show: 10,
    corrected: true,
    note: "각 step의 m을 1−0.9ᵗ로 나누면 모든 step에서 0.5가 됩니다. 제곱 gradient의 이동평균 v도 0에서 시작하므로 같은 방식으로 보정합니다.",
  },
];

const W = 340;
const H = 170;
const LEFT = 30;
const BASE = 140;
const TOP = 24;
const BAR = 20;
const STEP_W = (W - LEFT - 10) / STEPS;
const y = (v: number) => BASE - (v / G) * (BASE - TOP);

function Chart({ show, corrected }: { show: number; corrected: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`step ${show}까지의 1차 moment ${corrected ? "보정 후" : "보정 전"}`}>
      <line x1={LEFT} x2={W - 6} y1={TOP} y2={TOP} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
      <text x={LEFT} y={TOP - 7} fontSize={10} fill="#64748b">실제 gradient 0.5</text>
      <line x1={LEFT} x2={W - 6} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <text x={LEFT - 6} y={BASE + 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
      {M.map((value, i) => {
        const x = LEFT + i * STEP_W + (STEP_W - BAR) / 2;
        const visible = i < show;
        const top = y(corrected ? G : value);
        const isLast = i === show - 1;
        return (
          <g key={i}>
            {visible && (
              <>
                <rect x={x} y={top} width={BAR} height={BASE - top} fill={corrected ? "#16a34a" : "#2563eb"} opacity={corrected ? 0.55 : 0.75} rx={2} />
                {corrected && <rect x={x + 4} y={y(value)} width={BAR - 8} height={BASE - y(value)} fill="#64748b" opacity={0.85} rx={2} />}
                {(isLast || i === 0) && !corrected && (
                  <text x={x + BAR / 2} y={top - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">
                    {value.toFixed(4).replace(/0+$/, "")}
                  </text>
                )}
              </>
            )}
            {!visible && <rect x={x} y={BASE - 2} width={BAR} height={2} fill="#cbd5e1" />}
            <text x={x + BAR / 2} y={BASE + 15} textAnchor="middle" fontSize={10} fill="#64748b">{i + 1}</text>
          </g>
        );
      })}
      <text x={W - 6} y={BASE + 28} textAnchor="end" fontSize={10} fill="#64748b">step t</text>
      {corrected && (
        <text x={W - 6} y={TOP - 7} textAnchor="end" fontSize={10} fontWeight={700} fill="#16a34a">보정 후 m̂ (회색은 보정 전 m)</text>
      )}
    </svg>
  );
}

export default function AdamBiasCorrectionViz() {
  return (
    <SceneShell
      eyebrow="Adam 초기 편향"
      title="0에서 시작한 이동평균은 처음 몇 step 동안 작게 나옵니다"
      description="1차 moment m은 gradient의 지수이동평균 m_t = β·m_(t−1) + (1−β)·g_t입니다. β=0.9와 매 step 같은 gradient 0.5는 그림을 위한 가정입니다."
      ariaLabel="Adam 1차 moment가 0에서 시작해 작게 추정되고 bias correction으로 0.5가 되는 네 장면"
      scenes={SCENES}
      render={(scene) => <Chart show={SCENES[scene].show} corrected={SCENES[scene].corrected} />}
    />
  );
}
