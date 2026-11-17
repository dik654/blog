import SceneShell from "./SceneShell";

/**
 * 본문 대응: #domain-shift — negative transfer 예.
 * target accuracy 0.82→0.84, source regression accuracy 0.90→0.75, 운영 guardrail 0.88.
 */
const TARGET = [0.82, 0.84] as const;
const SOURCE = [0.9, 0.75] as const;
const GUARD = 0.88;

const SCENES = [
  { label: "적응 전", summary: "target 0.82 · source 0.90", note: "Adaptation 전에 두 평가축의 기준값과 운영 guardrail 0.88을 먼저 적어 둡니다. 이때 source regression 0.90은 선 위에 있습니다." },
  { label: "target 축", summary: "0.82 → 0.84 (+0.02)", note: "Target accuracy만 보면 adaptation이 성공한 것처럼 보입니다." },
  { label: "source 축", summary: "0.90 → 0.75 (−0.15)", note: "같은 adaptation 뒤 source regression accuracy는 0.75로 떨어져 guardrail 0.88 아래로 내려갑니다." },
  { label: "판정", summary: "배포 후보 아님", note: "중요한 평가축이 기준선보다 악화됐으므로 negative transfer입니다. Target이 올랐어도 받을 수 없고, 그래서 rollback threshold는 adaptation 전에 정해 둡니다." },
] as const;

const W = 360;
const H = 190;
const X0 = 40;
const X1 = 330;
const LO = 0.7;
const HI = 0.95;
const x = (value: number) => X0 + ((value - LO) / (HI - LO)) * (X1 - X0);
const ROW_T = 62;
const ROW_S = 132;
const TICKS = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95] as const;

function Row({ y, label, before, after, showAfter, bad }: { y: number; label: string; before: number; after: number; showAfter: boolean; bad: boolean }) {
  const color = bad ? "#dc2626" : "#2563eb";
  return (
    <g>
      <text x={X0 - 32} y={y - 28} fontSize={11} fontWeight={700} fill="#475569">{label}</text>
      <line x1={X0} x2={X1} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={1} />
      <circle cx={x(before)} cy={y} r={5.5} fill="#ffffff" stroke="#64748b" strokeWidth={1.25} />
      <text x={x(before)} y={y + 19} textAnchor="middle" fontSize={10} fill="#64748b">전 {before.toFixed(2)}</text>
      <g opacity={showAfter ? 1 : 0}>
        <line x1={x(before)} x2={x(after)} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
        <circle cx={x(after)} cy={y} r={5.5} fill={color} />
        <text x={x(after)} y={y - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>후 {after.toFixed(2)}</text>
      </g>
    </g>
  );
}

export default function NegativeTransferGuardrailViz() {
  return (
    <SceneShell
      eyebrow="Negative transfer · 본문 예시 숫자"
      title="Target이 올라도 다른 평가축이 guardrail 아래로 떨어지면 받지 않습니다"
      description="Source regression은 원래(source) 쪽 능력을 다시 재는 평가 세트, guardrail은 운영에서 그 아래로 내려가면 안 되는 하한선입니다. 빈 원은 adaptation 전, 채운 원은 후의 accuracy입니다."
      ariaLabel="target accuracy 0.82에서 0.84, source regression accuracy 0.90에서 0.75, guardrail 0.88 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={x(GUARD)} x2={x(GUARD)} y1={ROW_S - 20} y2={ROW_S + 24} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={x(GUARD) + 4} y={ROW_S + 34} fontSize={10} fontWeight={700} fill="#b45309">guardrail {GUARD.toFixed(2)}</text>
          <Row y={ROW_T} label="target accuracy" before={TARGET[0]} after={TARGET[1]} showAfter={active >= 1} bad={false} />
          <Row y={ROW_S} label="source regression accuracy" before={SOURCE[0]} after={SOURCE[1]} showAfter={active >= 2} bad />
          <line x1={X0} x2={X1} y1={H - 14} y2={H - 14} stroke="#94a3b8" strokeWidth={1} />
          {TICKS.map((tick) => (
            <text key={tick} x={x(tick)} y={H - 2} textAnchor="middle" fontSize={10} fill="#64748b">{tick.toFixed(2)}</text>
          ))}
          <g opacity={active === 3 ? 1 : 0}>
            <rect x={X1 - 92} y={4} width={92} height={20} rx={4} fill="#ffffff" stroke="#dc2626" strokeWidth={1} />
            <text x={X1 - 46} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">배포 후보 제외</text>
          </g>
        </svg>
      )}
    />
  );
}
