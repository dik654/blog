import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications — 손실 스케일링은 작은 값이 머무는 범위를 조정하지만 이미 버린 차이를 되찾지는 않는다.
 * 2⁻²⁴는 남고 2⁻²⁵는 0이 되는 FP16 자리(본문 실행 결과)를 재사용합니다. 기울기 2⁻²⁵과 배율 2는 설명용 가정입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 184;
const X0 = 60;
const X1 = 210;
const XH = (X0 + X1) / 2;
const Y = 118;

function Ruler({ value, stored, tone, text }: { value: "half" | "one"; stored: "zero" | "one"; tone: string; text: string }) {
  const from = value === "half" ? XH : X1;
  const to = stored === "zero" ? X0 : X1;
  return (
    <g>
      <line x1={24} x2={W - 24} y1={Y} y2={Y} stroke="#94a3b8" strokeWidth={1} />
      {[{ x: X0, name: "0" }, { x: X1, name: "2⁻²⁴" }].map((slot) => (
        <g key={slot.name}>
          <line x1={slot.x} x2={slot.x} y1={Y - 10} y2={Y + 10} stroke={BLUE} strokeWidth={1.25} />
          <text x={slot.x} y={Y + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{slot.name}</text>
        </g>
      ))}
      <circle cx={from} cy={Y - 52} r={5} fill="var(--background)" stroke={tone} strokeWidth={1.25} />
      <path d={`M ${from} ${Y - 47} L ${to} ${Y - 12}`} fill="none" stroke={tone} strokeWidth={1.25} />
      <circle cx={to} cy={Y} r={5.5} fill={tone} />
      <text x={from} y={Y - 64} textAnchor="middle" fontSize={13} fontWeight={700} fill={tone}>{text}</text>
    </g>
  );
}

const CHIPS = [
  ["저장값", "1"],
  ["×2", "2"],
  ["÷2", "1"],
] as const;

const SCENES = [
  { label: "배율 없이", summary: "2⁻²⁵ → 0", note: "FP16에서 2⁻²⁵은 0과 2⁻²⁴의 가운데라 0으로 저장됩니다. 작은 기울기가 사라지는 경우입니다." },
  { label: "손실에 2를 곱하면", summary: "2⁻²⁵ × 2 = 2⁻²⁴ · 남음", note: "손실에 배율을 곱하면 기울기에도 같은 배율이 곱해집니다. 2⁻²⁴는 자리와 겹쳐 남습니다. 값이 머무는 범위를 옮긴 것입니다." },
  { label: "되돌릴 때의 형식", summary: "÷2 → FP16이면 다시 0", note: "같은 FP16에 되돌린 값을 저장하면 다시 2⁻²⁵이라 0입니다. 그래서 되돌리고 누산하는 값을 어느 형식에 두는지 따로 확인합니다." },
  { label: "이미 버린 차이", summary: "1 → 2 → 1 · δ 없음", note: "1+δ를 1로 저장한 뒤라면 배율을 곱했다 나눠도 1입니다. 저장하면서 버린 차이는 어느 칸에도 없어 되찾지 못합니다." },
] as const;

export default function LossScalingViz() {
  return (
    <SceneShell
      eyebrow="손실 스케일링이 하는 일"
      title="배율은 값의 자리를 옮길 뿐 버린 차이를 돌려주지 않습니다"
      description="손실 스케일링은 손실에 배율을 곱한 뒤 기울기를 되돌리는 방법입니다. 눈금은 0 옆의 FP16 자리이고 기울기 2⁻²⁵과 배율 2는 설명용 가정입니다."
      note="저장 자리의 산술이며 특정 프레임워크의 배율 정책이나 학습 결과를 측정한 것이 아닙니다."
      ariaLabel="손실 스케일링 전후의 FP16 저장과 이미 버린 차이"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Ruler value="half" stored="zero" tone={RED} text="2⁻²⁵" />}
          {active === 1 && <Ruler value="one" stored="one" tone={BLUE} text="2⁻²⁵ × 2" />}
          {active === 2 && <Ruler value="half" stored="zero" tone={AMBER} text="2⁻²⁴ ÷ 2" />}
          {active === 3 && (
            <g>
              <text x={W / 2} y={34} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>1+δ를 저장한 순간 δ는 사라짐</text>
              {CHIPS.map(([name, value], index) => {
                const x = 20 + index * 106;
                return (
                  <g key={name}>
                    <text x={x + 43} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{name}</text>
                    <rect x={x} y={80} width={86} height={42} rx={4} fill="none" stroke={BLUE} strokeWidth={1.25} />
                    <text x={x + 43} y={107} textAnchor="middle" fontSize={15} fontWeight={700} fill={BLUE}>{value}</text>
                    {index < 2 && <path d={`M ${x + 87} 101 H ${x + 105}`} fill="none" stroke={GRAY} strokeWidth={1} />}
                  </g>
                );
              })}
              <text x={W / 2} y={154} textAnchor="middle" fontSize={12} fill={GRAY}>정확한 값 1+δ로 돌아가지 않음</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
