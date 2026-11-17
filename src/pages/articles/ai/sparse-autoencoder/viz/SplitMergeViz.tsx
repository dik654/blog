import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limitations — width와 seed만 바꾼 SAE들의 decoder direction cosine similarity와
 * example별 activation overlap을 비교해 대응·split·merge를 분류한다.
 * 가정: 2차원 반원 위 방향. 대응 A₁ 15° ↔ B₁ 25° (cos 10° ≈ 0.985),
 * split A₂ 90° → B₂ 70°·B₃ 110° (cos 20° ≈ 0.940), merge A₃ 140°·A₄ 170° → B₄ 155° (cos 15° ≈ 0.966).
 */
const A = [
  { name: "A₁", deg: 15, group: 0 },
  { name: "A₂", deg: 90, group: 1 },
  { name: "A₃", deg: 140, group: 2 },
  { name: "A₄", deg: 170, group: 2 },
];
const B = [
  { name: "B₁", deg: 25, group: 0 },
  { name: "B₂", deg: 70, group: 1 },
  { name: "B₃", deg: 110, group: 1 },
  { name: "B₄", deg: 155, group: 2 },
];
const cosDeg = (d: number) => Math.cos((d * Math.PI) / 180).toFixed(3);

const SCENES: { label: string; summary: string; note: string; group: number }[] = [
  {
    label: "한 방향끼리 대응",
    summary: `A₁ ↔ B₁ · cos ${cosDeg(10)}`,
    note: "두 SAE에서 방향이 거의 겹치는 feature가 한 쌍씩 짝을 이룹니다. 번호가 달라도 direction과 activation이 맞으면 같은 후보로 봅니다.",
    group: 0,
  },
  {
    label: "split",
    summary: `A₂ → B₂, B₃ · 각 cos ${cosDeg(20)}`,
    note: "SAE A의 feature 하나에 SAE B의 두 방향이 양옆에서 비슷하게 가깝습니다. 한 feature가 두 direction으로 갈라졌으므로 split으로 분류하고, A₂가 켜지던 example이 B₂와 B₃ 쪽으로 나뉘는지도 activation overlap으로 확인합니다.",
    group: 1,
  },
  {
    label: "merge",
    summary: `A₃, A₄ → B₄ · 각 cos ${cosDeg(15)}`,
    note: "SAE A의 두 feature가 SAE B에서는 그 사이의 한 방향으로 모였습니다. 여러 feature가 하나로 모였으므로 merge입니다.",
    group: 2,
  },
];

const CX = 180;
const CY = 168;
const R = 128;
const pt = (deg: number, r: number) => [CX + r * Math.cos((deg * Math.PI) / 180), CY - r * Math.sin((deg * Math.PI) / 180)] as const;

function Fan({ group }: { group: number }) {
  return (
    <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="두 SAE의 decoder direction을 반원 위에 겹친 그림">
      <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <line x1={CX - R - 6} x2={CX + R + 6} y1={CY} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
      {A.map((d) => {
        const on = d.group === group;
        const [x, y] = pt(d.deg, R - 6);
        const [lx, ly] = pt(d.deg, R + 10);
        return (
          <g key={d.name} opacity={on ? 1 : 0.25}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="#2563eb" strokeWidth={on ? 1.25 : 1} />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{d.name}</text>
          </g>
        );
      })}
      {B.map((d) => {
        const on = d.group === group;
        const [x, y] = pt(d.deg, R - 30);
        const [lx, ly] = pt(d.deg, R - 16);
        return (
          <g key={d.name} opacity={on ? 1 : 0.25}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="#d97706" strokeWidth={on ? 1.25 : 1} strokeDasharray="4 3" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">{d.name}</text>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={2.5} fill="#64748b" />
      <line x1={8} x2={26} y1={12} y2={12} stroke="#2563eb" strokeWidth={1.25} />
      <text x={30} y={16} fontSize={10} fill="#64748b">SAE A</text>
      <line x1={8} x2={26} y1={28} y2={28} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={30} y={32} fontSize={10} fill="#64748b">SAE B (width·seed 다름)</text>
    </svg>
  );
}

export default function SplitMergeViz() {
  return (
    <SceneShell
      eyebrow="feature stability"
      title="번호 대신 방향을 겹쳐 대응·split·merge를 가립니다"
      description="실선은 SAE A, 점선은 width와 seed만 바꾼 SAE B의 decoder direction입니다. 두 방향의 cosine similarity가 1에 가까울수록 같은 쪽을 가리킵니다. 2차원 반원과 각도는 그림을 위한 가정입니다."
      ariaLabel="두 SAE의 decoder direction을 겹쳐 대응, split, merge를 분류하는 세 장면"
      note="비교할 때는 model·hook·normalization과 sparsity 또는 LM loss recovery 조건을 맞춥니다."
      scenes={SCENES}
      render={(i) => <Fan group={SCENES[i].group} />}
    />
  );
}
