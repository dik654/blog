import SceneShell from "./SceneShell";

/**
 * 본문 대응: #por ExplainedFormula — rho=0.2, 독립·균등 표본 k개.
 * 표본 하나가 남은 80%에서 나올 확률 0.8을 k번 곱한다 → 0.8, 0.64, 0.512, 0.4096, 0.32768.
 * k=5에서 놓칠 확률 ≈0.328, 탐지 확률 1−0.328 ≈ 0.672.
 */
const RHO = 0.2;
const MAX_K = 5;
const MISS = Array.from({ length: MAX_K }, (_, index) => (1 - RHO) ** (index + 1));

const SCENES = [
  {
    label: "표본 1개",
    summary: "놓칠 확률 0.8",
    k: 1,
    detect: false,
    note: "Block의 20%가 사라졌다면 표본 하나가 남아 있는 80%에서 나올 확률은 0.8입니다. 이때 prover는 정상으로 답하고 손실은 드러나지 않습니다.",
  },
  {
    label: "표본 2개",
    summary: "0.8 × 0.8 = 0.64",
    k: 2,
    detect: false,
    note: "두 표본이 독립이면 둘 다 남은 block에서 나올 확률은 0.8을 한 번 더 곱한 0.64입니다. 막대가 일정한 양이 아니라 매번 직전 값의 20%씩 줄어듭니다.",
  },
  {
    label: "표본 5개",
    summary: "0.8⁵ ≈ 0.328",
    k: 5,
    detect: false,
    note: "다섯 번 곱하면 0.512, 0.41을 거쳐 약 0.328입니다. 표본 5개짜리 audit의 PASS 한 번이 손실을 놓칠 확률이 약 32.8%라는 뜻입니다.",
  },
  {
    label: "뒤집어 보기",
    summary: "탐지 1 − 0.328 ≈ 0.672",
    k: 5,
    detect: true,
    note: "'다섯 개 모두 놓침'을 1에서 빼면 적어도 하나의 missing block을 뽑을 확률 약 0.672가 됩니다. 이 계산은 sampling만 다루며, 실제 PoR theorem은 encoding·authenticator·extractor 조건을 더합니다.",
  },
] as const;

const W = 360;
const H = 206;
const CELLS = 10;

export default function MissProbabilityViz() {
  return (
    <SceneShell
      eyebrow="PoR 표본 audit · 사라진 block 비율 ρ=0.2"
      title="표본을 늘릴 때마다 손실을 놓칠 확률에 0.8이 한 번씩 곱해집니다"
      description="위 띠는 block 20%가 사라진 상태를 10칸 중 2칸으로 줄여 그린 것입니다(가정). 아래 막대는 표본 k개가 모두 남은 block에서 나올 확률입니다. 표본은 독립·균등이라고 둡니다."
      ariaLabel="missing fraction 0.2에서 표본 수 1부터 5까지 손실을 놓칠 확률과 탐지 확률"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const stripCell = 24;
        const stripGap = 4;
        const stripW = CELLS * stripCell + (CELLS - 1) * stripGap;
        const sx = (W - stripW) / 2;
        const left = 40;
        const baseY = 172;
        const topY = 66;
        const slot = (W - left - 16) / MAX_K;
        const barW = slot * 0.55;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: CELLS }, (_, index) => {
              const missing = index >= CELLS - 2;
              return (
                <g key={index}>
                  <rect
                    x={sx + index * (stripCell + stripGap)}
                    y={8}
                    width={stripCell}
                    height={18}
                    rx={2}
                    fill={missing ? "#ffffff" : "#64748b"}
                    stroke={missing ? "#dc2626" : "#64748b"}
                    strokeWidth={1}
                    strokeDasharray={missing ? "3 2" : undefined}
                  />
                </g>
              );
            })}
            <text x={sx} y={42} fontSize={10} fill="#475569">남아 있는 80%</text>
            <text x={sx + stripW} y={42} textAnchor="end" fontSize={10} fontWeight={700} fill="#dc2626">사라진 20%</text>

            <line x1={left} x2={left} y1={topY} y2={baseY} stroke="#94a3b8" strokeWidth={1} />
            <text x={left - 6} y={topY + 4} textAnchor="end" fontSize={9} fill="#64748b">1</text>
            <text x={left - 6} y={baseY} textAnchor="end" fontSize={9} fill="#64748b">0</text>
            {MISS.map((p, index) => {
              const k = index + 1;
              const shown = k <= scene.k;
              const h = p * (baseY - topY);
              const x = left + index * slot + (slot - barW) / 2;
              const isLast = k === 5 && scene.detect;
              return (
                <g key={k}>
                  {isLast && (
                    <rect x={x} y={topY} width={barW} height={baseY - topY - h} fill="#ffffff" stroke="#dc2626" strokeWidth={1} />
                  )}
                  <rect x={x} y={baseY - h} width={barW} height={h} rx={2} fill={shown ? "#2563eb" : "#e2e8f0"} />
                  {shown && (
                    <text x={x + barW / 2} y={isLast ? topY + (baseY - topY - h) / 2 + 4 : baseY - h - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={isLast ? "#dc2626" : "#1e3a8a"}>
                      {isLast ? "0.672" : p.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}
                    </text>
                  )}
                  {isLast && (
                    <text x={x + barW / 2} y={baseY - h / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">0.328</text>
                  )}
                  <text x={x + barW / 2} y={baseY + 14} textAnchor="middle" fontSize={10} fill="#64748b">k={k}</text>
                </g>
              );
            })}
            <line x1={left} x2={W - 16} y1={baseY} y2={baseY} stroke="#94a3b8" strokeWidth={1} />
            <text x={left} y={baseY + 26} fontSize={9} fill="#64748b">
              {scene.detect ? "파란 칸 = 다 놓침 · 빨간 테두리 칸 = 적어도 하나 탐지" : "막대 = k개 모두 남은 block에서 나올 확률"}
            </text>
          </svg>
        );
      }}
    />
  );
}
