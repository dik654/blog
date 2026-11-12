import SceneShell from "./SceneShell";

/**
 * 본문 대응: MeasureFirst.tsx — rho = mean_dist(variants) / mean_dist(others).
 * 거리 숫자는 모두 설명용 가정. 비율 0.55·0.22는 위 ProbeViz의 예시 값과 같게 맞췄다.
 * 후보 A: 변형 5.0·6.0·5.5 → 평균 5.5, 다른 상품 9·10·11 → 평균 10 → 0.55.
 * 후보 B: 변형 2.0·2.4·2.2 → 평균 2.2, 다른 상품 9·10·11 → 평균 10 → 0.22.
 */
const VARIANT_NAMES = ["밝기", "크롭", "압축"] as const;
const OTHER_NAMES = ["상품 2", "상품 3", "상품 4"] as const;
const VARIANT_ANGLES = [-70, 60, 160] as const;
const OTHER_ANGLES = [200, 335, 100] as const;
const OTHERS = [9, 10, 11] as const;
const CANDIDATES = {
  A: [5.0, 6.0, 5.5],
  B: [2.0, 2.4, 2.2],
} as const;

const mean = (values: readonly number[]) => values.reduce<number>((sum, v) => sum + v, 0) / values.length;

const W = 320;
const H = 290;
const CX = 160;
const CY = 118;
const UNIT = 8.5;

const ORIGIN = "#0f172a";
const VARIANT = "#2563eb";
const OTHER = "#94a3b8";
const RATIO = "#d97706";

const SCENES = [
  {
    label: "같은 상품의 변형본",
    summary: "후보 A · 5.0 · 6.0 · 5.5 → 평균 5.5",
    note: "검은 점은 상품 1의 원본 사진 벡터, 파란 점은 같은 상품을 밝기·크롭·압축으로 바꾼 사진의 벡터입니다. 같은 상품이니 가까울수록 좋습니다. 실제 벡터는 수백 차원이라 평면에 옮긴 모식도이고 거리는 가정입니다.",
    cand: "A",
    showOthers: false,
  },
  {
    label: "다른 상품까지의 거리",
    summary: "9 · 10 · 11 → 평균 10",
    note: "회색 점은 다른 상품의 사진입니다. 같은 원본에서 이들까지의 평균 거리를 함께 잽니다.",
    cand: "A",
    showOthers: true,
  },
  {
    label: "후보 A의 비율",
    summary: "ρ = 5.5 ÷ 10 = 0.55",
    note: "변형본 평균 거리를 다른 상품 평균 거리로 나눈 값이 변형 민감도 비 ρ입니다. 0.55는 촬영 조건만 바꿔도 다른 상품까지 거리의 절반 넘게 밀려난다는 뜻입니다.",
    cand: "A",
    showOthers: true,
  },
  {
    label: "후보 B의 비율",
    summary: "ρ = 2.2 ÷ 10 = 0.22",
    note: "같은 사진을 후보 B로 뽑았을 때 변형본이 원본 가까이 모인다고 두었습니다. 다른 상품까지의 거리는 비교를 쉽게 하려고 A와 같은 9·10·11로 둔 가정입니다. ρ가 작을수록 뒤의 선택 점수에서 빼는 감점 λρ(λ는 서비스 조건에 따라 사람이 정하는 가중치)도 작아집니다.",
    cand: "B",
    showOthers: true,
  },
] as const;

const polar = (distance: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * distance * UNIT, y: CY + Math.sin(rad) * distance * UNIT };
};

export default function VariantRatioViz() {
  return (
    <SceneShell
      eyebrow="변형 민감도 비"
      title="변형본이 다른 상품보다 얼마나 가까운지를 비율로 잽니다"
      description="한 점이 사진 한 장의 벡터이고, 선 옆 숫자가 원본에서의 거리입니다. 거리와 배치는 모두 설명용 가정입니다."
      ariaLabel="원본 사진에서 변형본과 다른 상품까지의 평균 거리 비"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const variants: readonly number[] = CANDIDATES[scene.cand];
        const variantMean = mean(variants);
        const otherMean = mean(OTHERS);
        const showRatio = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={16} fontSize={12} fontWeight={700} fill="#475569">후보 {scene.cand}의 벡터 공간</text>
            {scene.showOthers &&
              OTHERS.map((distance, index) => {
                const p = polar(distance, OTHER_ANGLES[index]);
                const mid = polar(distance / 2, OTHER_ANGLES[index]);
                const perp = ((OTHER_ANGLES[index] + 90) * Math.PI) / 180;
                return (
                  <g key={OTHER_NAMES[index]}>
                    <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={OTHER} strokeWidth={1} strokeDasharray="3 3" />
                    <circle cx={p.x} cy={p.y} r={5} fill={OTHER} />
                    <text x={p.x} y={p.y + (p.y > CY ? 16 : -9)} textAnchor="middle" fontSize={12} fill="#64748b">{OTHER_NAMES[index]}</text>
                    <text x={mid.x + Math.cos(perp) * 11} y={mid.y + Math.sin(perp) * 11 + 4} textAnchor="middle" fontSize={12} fill="#64748b">{distance}</text>
                  </g>
                );
              })}
            {variants.map((distance, index) => {
              const p = polar(distance, VARIANT_ANGLES[index]);
              const label = polar(Math.max(distance + 1.9, 4.8), VARIANT_ANGLES[index]);
              return (
                <g key={VARIANT_NAMES[index]}>
                  <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={VARIANT} strokeWidth={1.25} />
                  <circle cx={p.x} cy={p.y} r={4.5} fill={VARIANT} />
                  <text x={label.x} y={label.y + 4} textAnchor="middle" fontSize={12} fill="#1d4ed8">
                    {VARIANT_NAMES[index]} {distance.toFixed(1)}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={6} fill={ORIGIN} />
            <text x={CX - 11} y={CY - 7} textAnchor="end" fontSize={12} fontWeight={700} fill={ORIGIN}>원본</text>

            <line x1={8} x2={W - 8} y1={238} y2={238} stroke="#e2e8f0" strokeWidth={1} />
            <text x={56} y={258} textAnchor="middle" fontSize={11} fill="#1d4ed8">변형본 평균</text>
            <text x={56} y={278} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1d4ed8">{variantMean.toFixed(1)}</text>
            <text x={160} y={258} textAnchor="middle" fontSize={11} fill="#64748b">다른 상품 평균</text>
            <text x={160} y={278} textAnchor="middle" fontSize={14} fontWeight={700} fill="#64748b">{scene.showOthers ? otherMean.toFixed(0) : "?"}</text>
            <text x={264} y={258} textAnchor="middle" fontSize={11} fill={RATIO}>ρ = 앞 ÷ 뒤</text>
            <text x={264} y={278} textAnchor="middle" fontSize={14} fontWeight={700} fill={RATIO}>{showRatio ? (variantMean / otherMean).toFixed(2) : "?"}</text>
          </svg>
        );
      }}
    />
  );
}
