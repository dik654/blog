import SceneShell from "./SceneShell";

/**
 * 본문 대응: #solver-budget — E_sample ≲ E_field + E_discretization(h,p), C_model = NFE × C_call.
 * 1차원 장난감(가정): 정답 field dx/dt = −x, 학습한 field dx/dt = −1.2x, x(0)=1, t=0→1.
 *   정답 끝값 e^−1 = 0.368, 학습 field의 정확한 끝값 e^−1.2 = 0.301 → field 오차 0.067
 *   Euler 4 step(4 NFE): (1−0.3)^4 = 0.240 → 이산화 0.061, 합계 0.128
 *   Euler 20 step(20 NFE): (1−0.06)^20 = 0.290 → 이산화 0.011, 합계 0.078
 */
const TRUE_RATE = 1;
const LEARNED_RATE = 1.2;
const TRUE_END = Math.exp(-TRUE_RATE);
const LEARNED_END = Math.exp(-LEARNED_RATE);

const euler = (steps: number) =>
  Array.from({ length: steps + 1 }, (_, i) => (1 - LEARNED_RATE / steps) ** i);
const E4 = euler(4);
const E20 = euler(20);

const f3 = (v: number) => v.toFixed(3);
const FIELD_GAP = TRUE_END - LEARNED_END;
const DISC4 = LEARNED_END - E4[4];
const DISC20 = LEARNED_END - E20[20];

const TOP = 20;
const BOTTOM = 250;
const Y_MIN = 0.2;
const vy = (v: number) => TOP + ((1 - v) / (1 - Y_MIN)) * (BOTTOM - TOP);

const SCENES = [
  {
    label: "정답 field",
    summary: `끝값 ${f3(TRUE_END)}`,
    note: "정답 velocity를 연속 시간으로 끝까지 따라간 경로입니다. 이 장난감은 diffusion field가 아니라 오차를 나누는 방법만 보이려는 1차원 예시입니다(가정).",
  },
  {
    label: "학습한 field",
    summary: `끝값 ${f3(LEARNED_END)} · field 오차 ${f3(FIELD_GAP)}`,
    note: "Network가 방향을 조금 틀리게 배운 field(가정)를 연속 시간으로 정확히 적분해도 정답과 0.067만큼 어긋납니다. Solver를 아무리 정밀하게 써도 이 몫은 남습니다.",
  },
  {
    label: "Euler 4 step",
    summary: `4 NFE · 끝값 ${f3(E4[4])}`,
    note: `점 하나가 network 호출 한 번입니다. 학습한 field의 정확한 경로보다 ${f3(DISC4)} 더 어긋나 합계 ${f3(FIELD_GAP + DISC4)}입니다.`,
  },
  {
    label: "Euler 20 step",
    summary: `20 NFE · 끝값 ${f3(E20[20])}`,
    note: `호출을 5배로 늘리면 이산화 몫은 ${f3(DISC20)}로 줄지만 field 오차 ${f3(FIELD_GAP)}는 그대로라 합계 ${f3(FIELD_GAP + DISC20)}입니다. 비용은 NFE × 호출당 비용이므로 호출당 비용이 같다면 5배입니다.`,
  },
] as const;

function GapBar({ x, from, to, color, label }: { x: number; from: number; to: number; color: string; label: string }) {
  return (
    <g>
      <line x1={x} x2={x} y1={vy(from)} y2={vy(to)} stroke={color} strokeWidth={1.25} />
      <line x1={x - 4} x2={x + 4} y1={vy(from)} y2={vy(from)} stroke={color} strokeWidth={1} />
      <line x1={x - 4} x2={x + 4} y1={vy(to)} y2={vy(to)} stroke={color} strokeWidth={1} />
      <text x={x + 8} y={(vy(from) + vy(to)) / 2 + 4} fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Chart({ active, width, className }: { active: number; width: number; className: string }) {
  const compact = width < 500;
  const left = compact ? 40 : 60;
  const right = compact ? width - 104 : 420;
  const tx = (t: number) => left + t * (right - left);
  const curve = (rate: number) =>
    Array.from({ length: 41 }, (_, i) => i / 40)
      .map((t, i) => `${i === 0 ? "M" : "L"}${tx(t).toFixed(1)} ${vy(Math.exp(-rate * t)).toFixed(1)}`)
      .join(" ");
  const poly = (values: readonly number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${tx(i / (values.length - 1)).toFixed(1)} ${vy(v).toFixed(1)}`).join(" ");
  const steps = active === 2 ? E4 : active === 3 ? E20 : null;
  const disc = active === 2 ? DISC4 : DISC20;
  const height = compact ? BOTTOM + 100 : BOTTOM + 40;
  const legendX = compact ? left - 30 : left + 170;
  const legendY = compact ? BOTTOM + 40 : TOP + 10;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <line x1={left} x2={right} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      <line x1={left} x2={left} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      {[1, 0.6, 0.2].map((v) => (
        <text key={v} x={left - 8} y={vy(v) + 4} textAnchor="end" fontSize={11} fill="#64748b">{v}</text>
      ))}
      <text x={left} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fill="#64748b">t=0</text>
      <text x={right} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fill="#64748b">t=1</text>
      <path d={curve(TRUE_RATE)} fill="none" stroke="#16a34a" strokeWidth={1.25} />
      {active >= 1 && (
        <>
          <path d={curve(LEARNED_RATE)} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 4" />
        </>
      )}
      {steps && (
        <>
          <path d={poly(steps)} fill="none" stroke="#ea580c" strokeWidth={1} />
          {steps.slice(0, -1).map((v, i) => (
            <circle key={i} cx={tx(i / (steps.length - 1))} cy={vy(v)} r={active === 2 ? 4 : 2.5} fill="#ea580c" />
          ))}
          <rect x={tx(1) - 3} y={vy(steps[steps.length - 1]) - 3} width={6} height={6} fill="#ea580c" />
        </>
      )}
      {active >= 1 && <GapBar x={right + 14} from={TRUE_END} to={LEARNED_END} color="#2563eb" label={`field ${f3(FIELD_GAP)}`} />}
      {steps && <GapBar x={right + 14} from={LEARNED_END} to={LEARNED_END - disc} color="#ea580c" label={`solver ${f3(disc)}`} />}
      <g transform={`translate(${legendX} ${legendY})`}>
        <text y={0} fontSize={11} fill="#16a34a">초록 실선 = 정답 · 끝값 {f3(TRUE_END)}</text>
        {active >= 1 && <text y={17} fontSize={11} fill="#2563eb">파랑 점선 = 학습 field · 끝값 {f3(LEARNED_END)}</text>}
        {steps && <text y={34} fontSize={11} fill="#ea580c">{`주황 = Euler ${steps.length - 1} step · 끝값 ${f3(steps[steps.length - 1])}`}</text>}
        {steps && <text y={51} fontSize={11} fill="#ea580c">● = network 호출 1회 · ■ = 끝값</text>}
      </g>
    </svg>
  );
}

export default function SolverErrorViz() {
  return (
    <SceneShell
      eyebrow="Field 오차와 solver 오차"
      title="Step을 늘리면 solver 몫만 줄고, 잘못 배운 방향의 몫은 남습니다"
      description="가로는 시간 t=0→1, 세로는 상태 x입니다. 정답 dx/dt=−x와 학습한 dx/dt=−1.2x는 설명용 가정입니다."
      ariaLabel="field 오차와 이산화 오차를 Euler 4 step, 20 step으로 비교"
      scenes={SCENES}
      render={(active) => (
        <>
          <Chart active={active} width={360} className="h-auto w-full sm:hidden" />
          <Chart active={active} width={600} className="mx-auto hidden h-auto w-full max-w-[680px] sm:block" />
        </>
      )}
    />
  );
}
