import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sampling-weights — 기대 기여 = 선택 확률 × 값 = 직사각형 넓이. θ=0, a=3·2·2·1.
 * 균등: 3/4, 1/2, 1/2, 1/4 → 2. q=(1/2,1/6,1/6,1/6): 3/2, 1/3, 1/3, 1/6 → 7/3.
 * 보정 g̃=(1.5,3,3,1.5): 원래 넓이로 복귀 → 2. 한 자료 q=0(가정, 1/2,1/4,1/4,0): 3/4+1/2+1/2=7/4.
 */
const SCENES = [
  { label: "같은 기회", summary: "3/4 + 1/2 + 1/2 + 1/4 = 2", note: "폭이 뽑힐 확률, 높이가 기울기입니다. 넓이가 그 자료의 기대 기여이고 다 더하면 전체 기울기 2입니다.", q: [1 / 4, 1 / 4, 1 / 4, 1 / 4], h: [3, 2, 2, 1], areas: ["3/4", "1/2", "1/2", "1/4"], w: ["1/4", "1/4", "1/4", "1/4"] },
  { label: "폭만 바꾸면", summary: "3/2 + 1/3 + 1/3 + 1/6 = 7/3", note: "첫 자료를 1/2, 나머지를 1/6로 뽑고 값은 그대로 두면(가정) 첫 자료의 넓이가 커져 목표 2가 아니라 7/3으로 기웁니다.", q: [1 / 2, 1 / 6, 1 / 6, 1 / 6], h: [3, 2, 2, 1], areas: ["3/2", "1/3", "1/3", "1/6"], w: ["1/2", "1/6", "1/6", "1/6"] },
  { label: "높이로 되돌리면", summary: "3/4 + 1/2 + 1/2 + 1/4 = 2", note: "중요도 보정은 값에 (목표 비중 1/4 ÷ 실제 확률)을 곱합니다. 폭이 커진 자료는 낮아지고 좁아진 자료는 높아져 넓이가 처음과 같아집니다. 좁은 칸의 높이가 커지는 것이 흔들림을 키울 수도 있습니다.", q: [1 / 2, 1 / 6, 1 / 6, 1 / 6], h: [1.5, 3, 3, 1.5], areas: ["3/4", "1/2", "1/2", "1/4"], w: ["1/2", "1/6", "1/6", "1/6"] },
  { label: "폭이 0이면", summary: "3/4 + 1/2 + 1/2 = 7/4", note: "넷째 자료를 전혀 뽑지 않으면(가정: 확률 1/2·1/4·1/4·0) 그 칸은 폭이 없어 어떤 배수로도 넓이 1/4을 만들 수 없습니다. 보정은 뽑히는 자료에만 작동합니다.", q: [1 / 2, 1 / 4, 1 / 4, 0], h: [1.5, 2, 2, 0], areas: ["3/4", "1/2", "1/2", ""], w: ["1/2", "1/4", "1/4", "0"] },
] as const;

const W = 360;
const X0 = 30;
const TOTAL = 310;
const BASE = 150;
const UNIT = 38;

export default function ImportanceAreaViz() {
  return (
    <SceneShell
      eyebrow="폭 × 높이 = 기대 기여"
      title="치우친 뽑기와 보정을 넓이로 맞춰 봅니다"
      description="θ=0의 네 자료입니다. 칸의 폭은 자료를 뽑을 확률, 높이는 쓰는 기울기 값, 넓이는 기대 기여입니다."
      ariaLabel="선택 확률과 기울기로 만든 직사각형 넓이의 합이 목표 2에서 벗어나고 보정으로 돌아오는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        let cursor = X0;
        return (
          <svg viewBox={`0 0 ${W} 200`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.q.map((q, index) => {
              const x = cursor;
              const w = q * TOTAL;
              cursor += w;
              const height = scene.h[index] * UNIT;
              const changed = active === 1 && index === 0;
              if (q === 0) {
                return (
                  <g key={index}>
                    <line x1={x} x2={x} y1={BASE} y2={BASE + 34} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                    <text x={x + 4} y={BASE + 46} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">자료 4 폭 0</text>
                  </g>
                );
              }
              return (
                <g key={index}>
                  <rect x={x} y={BASE - height} width={w} height={height} fill={changed ? "#d97706" : "#2563eb"} fillOpacity={0.28} stroke={changed ? "#d97706" : "#2563eb"} strokeWidth={1} />
                  <text x={x + w / 2} y={BASE - height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={changed ? "#b45309" : "#2563eb"}>{scene.areas[index]}</text>
                  <text x={x + w / 2} y={BASE - height - 5} textAnchor="middle" fontSize={11} fill="#64748b">높이 {scene.h[index]}</text>
                  <text x={x + w / 2} y={BASE + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">자료 {index + 1}</text>
                  <text x={x + w / 2} y={BASE + 30} textAnchor="middle" fontSize={11} fill="#64748b">폭 {scene.w[index]}</text>
                </g>
              );
            })}
            <line x1={X0} x2={X0 + TOTAL} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
