import SceneShell from "./SceneShell";

/**
 * 본문 대응: #diffusion-and-flow-heads의 flow matching 식.
 * A^τ = τA_t + (1−τ)ε 는 ε(τ=0)과 A_t(τ=1)를 잇는 직선 위의 점이고, 목표 velocity u = A_t − ε 에는 τ가 없다.
 * 그래서 직선 위 어느 점에서든 목표 화살표가 같다. 산술: A^τ + (1−τ)(A_t − ε) = A_t.
 * 실제 action chunk는 H×차원 개의 숫자지만 여기서는 평면 위 점 하나로 줄여 그린다(가정).
 */
const EPS = { x: 60, y: 165 };
const ANS = { x: 290, y: 45 };
const U = { x: ANS.x - EPS.x, y: ANS.y - EPS.y };
const TAUS = [0.3, 0.7] as const;
const ARROW = 0.25; // 화살표는 u를 0.25배로 줄여 그림(가정)
const lerp = (tau: number) => ({ x: EPS.x + tau * U.x, y: EPS.y + tau * U.y });

// 모델 예측 velocity(가정): 목표에서 조금 비껴 난 방향
const PRED = { x: 0.2 * U.x, y: 0.2 * U.y - 26 };

// 추론: 새 noise에서 Δτ = 0.1씩 10 step(가정: 같은 간격, 곧은 경로)
const NEW_EPS = { x: 40, y: 100 };
const GEN = { x: 282, y: 58 };
const STEPS = Array.from({ length: 11 }, (_, i) => ({
  x: NEW_EPS.x + (i / 10) * (GEN.x - NEW_EPS.x),
  y: NEW_EPS.y + (i / 10) * (GEN.y - NEW_EPS.y),
}));

const SCENES = [
  {
    label: "Noise와 정답 한 쌍",
    summary: "ε (τ=0) · A_t (τ=1)",
    note: "학습 재료는 정답 action chunk A_t와 같은 shape의 random noise ε입니다. τ는 0이면 noise, 1이면 정답인 보간 비율입니다.",
  },
  {
    label: "τ로 섞은 중간 상태",
    summary: "A^τ = τA_t + (1−τ)ε",
    note: "두 점을 τ 비율로 섞으면 둘을 잇는 직선 위의 점이 됩니다. τ=0.3은 noise 쪽, τ=0.7은 정답 쪽입니다(예시 값).",
  },
  {
    label: "목표 velocity",
    summary: "u = A_t − ε",
    note: "목표 u에는 τ가 없어 직선 위 어느 점에서든 같은 화살표입니다. 남은 (1−τ)만큼 이 방향으로 가면 정확히 A_t에 닿습니다.",
  },
  {
    label: "Loss: 예측과 목표의 차이",
    summary: "‖v_θ(A^τ, o_t) − u‖²",
    note: "Model은 A^τ와 관측 o_t를 보고 v_θ를 냅니다. 빨간 점선이 목표 u와의 차이이고 그 제곱이 벌점입니다(v_θ 방향은 가정).",
  },
  {
    label: "추론: 10 step 적분",
    summary: "새 noise → 10 step → action chunk",
    note: "추론 때는 정답이 없습니다. 새 noise에서 model이 낸 velocity를 따라 10 step 움직여 action chunk를 만듭니다(같은 간격·곧은 경로는 가정).",
  },
] as const;

function Arrow({ from, d, color, dashed = false }: { from: { x: number; y: number }; d: { x: number; y: number }; color: string; dashed?: boolean }) {
  const to = { x: from.x + d.x, y: from.y + d.y };
  const len = Math.hypot(d.x, d.y);
  const ux = d.x / len;
  const uy = d.y / len;
  const head = `${to.x},${to.y} ${to.x - 7 * ux - 4 * uy},${to.y - 7 * uy + 4 * ux} ${to.x - 7 * ux + 4 * uy},${to.y - 7 * uy - 4 * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={head} fill={color} />
    </g>
  );
}

export default function FlowMatchingPathViz() {
  return (
    <SceneShell
      eyebrow="Flow matching"
      title="정답과 noise를 잇는 직선 위에서, 정답 쪽으로 미는 화살표를 배웁니다"
      description="평면 위 점 하나가 action chunk 하나입니다. 회색 점이 noise ε, 파란 점이 정답 A_t, 화살표가 velocity(지금 점을 밀 방향과 크기)입니다."
      note="실제 action chunk는 H×차원 개의 숫자입니다(π0는 H=50). 점 위치, τ 값, v_θ 방향, 화살표 축척(u의 0.25배)은 설명용 가정입니다."
      ariaLabel="Flow matching에서 noise와 정답을 잇는 직선, 목표 velocity, loss, 10 step 추론"
      scenes={SCENES}
      render={(active) => {
        const training = active < 4;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {training && (
              <>
                <line x1={EPS.x} y1={EPS.y} x2={ANS.x} y2={ANS.y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={EPS.x} cy={EPS.y} r={5} fill="#94a3b8" />
                <text x={EPS.x} y={EPS.y + 20} textAnchor="middle" fontSize={11} fill="#475569">ε · τ=0</text>
                <circle cx={ANS.x} cy={ANS.y} r={5} fill="#2563eb" />
                <text x={ANS.x} y={ANS.y - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">A_t · τ=1</text>
              </>
            )}
            {active >= 1 && active <= 3 &&
              TAUS.filter((tau) => active <= 2 || tau === 0.3).map((tau) => {
                const p = lerp(tau);
                return (
                  <g key={tau}>
                    <circle cx={p.x} cy={p.y} r={4} fill="#0f172a" />
                    <text x={p.x - 8} y={p.y + 16} textAnchor="end" fontSize={11} fill="#0f172a">A^τ · τ={tau}</text>
                    {active >= 2 && <Arrow from={p} d={{ x: ARROW * U.x, y: ARROW * U.y }} color="#16a34a" />}
                  </g>
                );
              })}
            {active === 2 && <text x={ANS.x} y={ANS.y + 74} textAnchor="middle" fontSize={11} fill="#16a34a">두 점의 목표 u는 같다</text>}
            {active === 3 && (() => {
              const p = lerp(0.3);
              const target = { x: p.x + ARROW * U.x, y: p.y + ARROW * U.y };
              const pred = { x: p.x + PRED.x, y: p.y + PRED.y };
              return (
                <g>
                  <Arrow from={p} d={PRED} color="#7c3aed" />
                  <line x1={pred.x} y1={pred.y} x2={target.x} y2={target.y} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={pred.x - 4} y={pred.y - 8} textAnchor="middle" fontSize={11} fill="#7c3aed">v_θ (예측)</text>
                  <text x={target.x + 8} y={target.y + 14} fontSize={11} fill="#16a34a">u (목표)</text>
                  <text x={target.x + 8} y={target.y - 10} fontSize={11} fill="#dc2626">차이 → 벌점</text>
                </g>
              );
            })()}
            {active === 4 && (
              <>
                <polyline points={STEPS.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" stroke="#7c3aed" strokeWidth={1} />
                {STEPS.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={i === 0 || i === 10 ? 5 : 3} fill={i === 0 ? "#94a3b8" : i === 10 ? "#2563eb" : "#7c3aed"} />
                ))}
                <text x={NEW_EPS.x} y={NEW_EPS.y + 20} fontSize={11} fill="#475569">새 noise</text>
                <text x={GEN.x} y={GEN.y - 12} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">생성된 action chunk</text>
                <text x={180} y={170} textAnchor="middle" fontSize={11} fill="#7c3aed">점 사이 한 칸 = integration step 1회 · 모두 10회</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
