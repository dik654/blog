import SceneShell from "./SceneShell";

/**
 * 본문 대응: #contract — 순차적이라는 말은 코어 하나라는 뜻이 아니다.
 * 한 번의 제곱 안은 나눠 빠르게 할 수 있어도 제곱끼리의 의존 사슬은 남고, T는 초가 아니라 횟수다.
 * 막대 길이는 모두 모양을 보여 주는 가정이며 측정값이 아니다.
 */
const SCENES = [
  { label: "제곱이 사슬을 이룹니다", summary: "T=4 → 의존 단계 4개", note: "gᵢ를 제곱한 결과가 다음 단계의 입력입니다. g₂를 모르면 g₃를 계산할 수 없습니다." },
  { label: "한 번의 제곱 안은 나눌 수 있습니다", summary: "칸은 짧아져도 여전히 4칸", note: "한 번의 큰 연산 내부는 thread·SIMD·ASIC으로 더 빠르게 만들 수 있습니다. Chia 구현도 thread들이 한 번의 squaring에 필요한 일부 작업을 나눕니다. 그래도 칸은 네 개이고 순서도 그대로입니다." },
  { label: "칸끼리는 동시에 시작하지 못합니다", summary: "앞 결과가 없으면 대기", note: "코어를 늘려도 뒤 칸의 입력이 아직 없습니다. 다음 군 원소는 이전 squaring의 결과가 나온 뒤에야 시작할 수 있습니다." },
  { label: "T는 초가 아니라 횟수입니다", summary: "같은 T=4 · 다른 소요 시간", note: "같은 횟수라도 장비마다 걸리는 시간이 다를 수 있습니다. 실제 지연은 배포할 evaluator의 초당 반복 수를 따로 재서 정합니다." },
] as const;

const ACCENT = "#2563eb";
const STEPS = [0, 1, 2, 3];
const NAMES = ["g₀", "g₁", "g₂", "g₃", "g₄=y"];
const LANES = ["g₀→g₁", "g₁→g₂", "g₂→g₃", "g₃→g₄"];

export default function SequentialChainViz() {
  return (
    <SceneShell
      eyebrow="순차성의 뜻 · 막대 길이는 모양만(가정)"
      title="코어를 늘려도 칸의 수는 줄지 않습니다"
      description="칸 하나가 제곱 한 번이고 가로는 흐르는 시간입니다. 군은 곱셈을 해도 원소가 그 안에 머무는 계산 공간이며, 군 원소는 그 안의 값입니다."
      ariaLabel="제곱 사슬의 칸 수, 칸 내부 병렬화, 칸 사이 의존, 장비별 소요 시간"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 &&
            STEPS.map((step) => (
              <g key={step}>
                <rect x={20 + step * 80} y={56} width={76} height={44} rx={6} fill="#2563eb22" stroke={ACCENT} strokeWidth={1} />
                <text x={58 + step * 80} y={83} textAnchor="middle" fontSize={12} fill={ACCENT} fontWeight={700}>제곱 {step + 1}</text>
                <text x={20 + step * 80} y={120} textAnchor="middle" fontSize={12} fill="#64748b">{NAMES[step]}</text>
              </g>
            ))}
          {active === 0 && <text x={338} y={120} textAnchor="end" fontSize={12} fill="#64748b" fontWeight={700}>{NAMES[4]}</text>}

          {active === 1 && (
            <>
              <rect x={20} y={56} width={320} height={44} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" />
              <text x={338} y={48} textAnchor="end" fontSize={11} fill="#94a3b8">나누기 전 길이</text>
              {STEPS.map((step) => (
                <g key={step}>
                  <rect x={20 + step * 52} y={56} width={49} height={20} rx={4} fill="#2563eb22" stroke={ACCENT} strokeWidth={1} />
                  <rect x={20 + step * 52} y={80} width={49} height={20} rx={4} fill="#2563eb22" stroke={ACCENT} strokeWidth={1} />
                  <text x={20 + step * 52} y={120} textAnchor="middle" fontSize={12} fill="#64748b">{NAMES[step]}</text>
                </g>
              ))}
              <text x={228} y={120} textAnchor="middle" fontSize={12} fill="#64748b" fontWeight={700}>{NAMES[4]}</text>
              <text x={20} y={146} fontSize={12} fill={ACCENT} fontWeight={700}>칸 안에서만 두 줄로 나눔</text>
            </>
          )}

          {active === 2 &&
            LANES.map((lane, index) => (
              <g key={lane}>
                <text x={12} y={37 + index * 36} fontSize={12} fill="#64748b">코어 {index + 1}</text>
                <rect x={60} y={18 + index * 36} width={124} height={28} rx={6} fill={index === 0 ? "#2563eb22" : "none"} stroke={index === 0 ? ACCENT : "#dc2626"} strokeWidth={1} strokeDasharray={index === 0 ? undefined : "4 3"} />
                <text x={122} y={37 + index * 36} textAnchor="middle" fontSize={12} fontWeight={700} fill={index === 0 ? ACCENT : "#dc2626"}>{lane}</text>
                <text x={194} y={37 + index * 36} fontSize={12} fill={index === 0 ? ACCENT : "#dc2626"}>{index === 0 ? "계산 중" : `입력 g${"₀₁₂₃"[index]} 없음`}</text>
              </g>
            ))}

          {active === 3 &&
            [{ name: "장비 A", width: 60, y: 40 }, { name: "장비 B", width: 34, y: 96 }].map((row) => (
              <g key={row.name}>
                <text x={12} y={row.y + 21} fontSize={12} fill="#64748b">{row.name}</text>
                {STEPS.map((step) => (
                  <rect key={step} x={64 + step * (row.width + 3)} y={row.y} width={row.width} height={32} rx={4} fill="#2563eb22" stroke={ACCENT} strokeWidth={1} />
                ))}
                <text x={72 + 4 * (row.width + 3)} y={row.y + 21} fontSize={12} fontWeight={700} fill={ACCENT}>T=4</text>
              </g>
            ))}
        </svg>
      )}
    />
  );
}
