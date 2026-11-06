import SceneShell from "./SceneShell";
import { Arrow } from "./SvgBits";

/**
 * 본문 대응: #source — 2의 거듭제곱을 15로 나눈 나머지 1·2·4·8·1, 주기 4, 절반 지수 2, 값 4, 4−1=3, 4+1=5.
 * 앞 장면은 네 나머지의 고리이고, 뒤 장면은 점 15개를 3줄 5칸으로 늘어놓은 직사각형입니다.
 * (4−1)×(4+1)=4×4−1=16−1=15. 16을 15로 나눈 나머지가 1이라 1을 뺀 값이 15로 나누어떨어집니다.
 * 곱이 정확히 15인 것은 이 밑에서만입니다. 밑 11: 11²=121, 나머지 1 → 주기 2, 10×12=120=8×15, 최대공약수 5와 3.
 */
const W = 360;
const H = 260;
const CX = 180;
const CY = 128;
const R = 84;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const RING = [
  { value: 1, exponent: "2⁰", x: CX, y: CY - R },
  { value: 2, exponent: "2¹", x: CX + R, y: CY },
  { value: 4, exponent: "2²", x: CX, y: CY + R },
  { value: 8, exponent: "2³", x: CX - R, y: CY },
] as const;

const SCENES = [
  { label: "두 배씩", summary: "1 → 2 → 4 → 8", note: "15와 밑 2를 고른 사례입니다(가정). 앞의 수를 두 배 하면서 15로 나눈 나머지를 적습니다. 8까지는 15보다 작아 그대로입니다." },
  { label: "처음으로 돌아옴", summary: "8 × 2 = 16 → 나머지 1", note: "16을 15로 나누면 나머지가 1이라 출발점으로 돌아옵니다. 네 걸음이면 한 바퀴이므로 주기는 4입니다." },
  { label: "절반 지수", summary: "2² = 4", note: "주기의 절반인 2를 지수로 쓰면 고리 맞은편의 4에 닿습니다. 그 양옆의 수 4−1=3과 4+1=5가 다음 재료입니다." },
  { label: "15와 비교", summary: "최대공약수 3 · 5", note: "점 15개는 3줄 5칸으로 빈틈없이 놓입니다. 3과 15의 최대공약수는 3, 5와 15의 최대공약수는 5입니다." },
  { label: "왜 맞아떨어지나", summary: "4 × 4 − 1이 15로 나누어떨어짐", note: "3×5는 (4−1)×(4+1)이고, 이는 4×4−1입니다. 4×4=16은 15로 나눈 나머지가 1인 그 수입니다. 이번에는 곱이 정확히 15지만 보통은 15의 배수입니다(밑 11: 10×12=120=8×15). 그래서 최대공약수로 인수를 꺼냅니다. 이 부분은 일반 컴퓨터에서 하는 후처리입니다." },
] as const;

function Ring({ active }: { active: number }) {
  const closes = active >= 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {RING.map((node, index) => {
        const next = RING[(index + 1) % 4];
        const last = index === 3;
        if (last && !closes) return null;
        const dx = next.x - node.x;
        const dy = next.y - node.y;
        const len = Math.hypot(dx, dy);
        const pad = 25;
        return (
          <g key={node.value}>
            <Arrow x1={node.x + (dx / len) * pad} y1={node.y + (dy / len) * pad} x2={next.x - (dx / len) * pad} y2={next.y - (dy / len) * pad} color={last ? AMBER : GRAY} />
            {!last && (
              <text x={(node.x + next.x) / 2 + (index === 2 ? -16 : 16)} y={(node.y + next.y) / 2 + (index === 0 ? -6 : 16)} textAnchor="middle" fontSize={12} fill={GRAY}>
                ×2
              </text>
            )}
          </g>
        );
      })}
      {closes && (
        <text x={CX - R / 2 - 18} y={CY - R / 2 - 10} textAnchor="end" fontSize={13} fontWeight={700} fill={AMBER}>
          ×2 = 16 → 1
        </text>
      )}
      {RING.map((node) => {
        const halfway = active === 2 && node.value === 4;
        return (
          <g key={node.value}>
            <circle cx={node.x} cy={node.y} r={22} fill={halfway ? BLUE : "#94a3b81a"} stroke={halfway ? BLUE : FAINT} strokeWidth={1} />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={halfway ? "#ffffff" : GRAY}>
              {node.value}
            </text>
            <text x={node.x + (node.x > CX ? 28 : node.x < CX ? -28 : 28)} y={node.y + (node.x === CX ? 5 : -18)} textAnchor="middle" fontSize={12} fill={GRAY}>
              {node.exponent}
            </text>
          </g>
        );
      })}
      {active >= 1 && (
        <text x={CX} y={CY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={active === 2 ? BLUE : GRAY}>
          {active === 2 ? "4 걸음의 절반" : "주기 4"}
        </text>
      )}
      {active === 2 && (
        <g>
          <text x={CX - 84} y={CY + R + 6} textAnchor="middle" fontSize={15} fontWeight={700} fill={AMBER}>3 = 4−1</text>
          <text x={CX + 84} y={CY + R + 6} textAnchor="middle" fontSize={15} fontWeight={700} fill={AMBER}>5 = 4+1</text>
        </g>
      )}
    </svg>
  );
}

function Rectangle({ active }: { active: number }) {
  const gap = 42;
  const x0 = CX - gap * 2;
  const y0 = 66;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={CX} y={y0 - 34} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>한 줄에 5칸</text>
      <text x={x0 - 28} y={y0 + gap + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={AMBER}>3줄</text>
      {Array.from({ length: 15 }, (_, index) => {
        const col = index % 5;
        const row = Math.floor(index / 5);
        return <circle key={index} cx={x0 + col * gap} cy={y0 + row * gap} r={13} fill={`${BLUE}33`} stroke={BLUE} strokeWidth={1} />;
      })}
      {[0, 1, 2].map((row) => (
        <rect key={row} x={x0 - 18} y={y0 + row * gap - 18} width={gap * 4 + 36} height={36} rx={8} fill="none" stroke={AMBER} strokeWidth={1} />
      ))}
      <text x={CX} y={H - 20} textAnchor="middle" fontSize={15} fontWeight={700} fill={GRAY}>
        {active === 3 ? "점 15개 = 3 × 5" : "(4−1) × (4+1) = 16 − 1 = 15"}
      </text>
    </svg>
  );
}

export default function FactorFromPeriodViz() {
  return (
    <SceneShell
      eyebrow="고리에서 인수로"
      title="나머지의 고리가 닫히면 15가 3과 5로 나뉩니다"
      description="고리의 숫자는 2의 거듭제곱을 15로 나눈 나머지입니다. 화살표 한 번이 두 배 한 번입니다."
      ariaLabel="2의 거듭제곱 나머지 고리에서 주기 4를 찾고 4−1과 4+1로 15를 3과 5로 나누는 과정"
      scenes={SCENES}
      render={(active) => (active < 3 ? <Ring active={active} /> : <Rectangle active={active} />)}
    />
  );
}
