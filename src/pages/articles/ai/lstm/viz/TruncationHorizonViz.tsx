import LstmSceneShell from "./LstmSceneShell";

/**
 * 본문 대응: #cell-state 마지막 문단 — Truncated BPTT에서 state는 detach boundary를 넘어
 * 계속 전달되지만 gradient는 그 경계를 넘지 못한다. 8 step과 4 step 구간은 설명용 가정이다.
 */
const STEPS = 8;
const BOUNDARY = 4;
const W = 360;
const H = 168;
const LEFT = 22;
const GAP = (W - 2 * LEFT) / (STEPS - 1);
const sx = (step: number) => LEFT + (step - 1) * GAP;
const BOUNDARY_X = (sx(BOUNDARY) + sx(BOUNDARY + 1)) / 2;
const CELL_Y = 62;
const GRAD_Y = 112;

const SCENES = [
  { label: "앞으로: state", summary: "1 → 8 끝까지 전달", note: "Forward에서는 cell state가 detach boundary를 지나 step 8까지 그대로 이어집니다. Step 1의 입력이 step 8의 state에 영향을 줄 수 있습니다." },
  { label: "뒤로: gradient", summary: "8 → 5에서 멈춤", note: "Step 8의 loss에서 거꾸로 흐르는 gradient는 boundary에서 끊깁니다. Step 1–4의 계산은 이 loss로 학습되지 않습니다." },
  { label: "두 horizon", summary: "memory 8 step ≠ credit 4 step", note: "그래서 state가 닿는 inference memory horizon과 gradient가 닿는 training credit-assignment horizon을 따로 봐야 합니다. 이 그림에서는 각각 8 step과 4 step입니다." },
] as const;

export default function TruncationHorizonViz() {
  return (
    <LstmSceneShell
      eyebrow="Truncated BPTT"
      title="State는 경계를 넘어가지만 gradient는 경계에서 멈춥니다"
      description="원 하나가 한 timestep입니다. 8 step 길이와 4 step마다 자르는 경계는 그림을 위한 가정입니다. Detach boundary는 그 지점 이전으로 gradient를 보내지 않도록 계산 graph를 끊는 자리입니다."
      ariaLabel="truncated BPTT에서 state 전달과 gradient 전달 범위 비교"
      scenes={SCENES}
      render={(active) => {
        const showState = active !== 1;
        const showGrad = active !== 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id={`trunc-arrow-blue-${active}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#2563eb" /></marker>
              <marker id={`trunc-arrow-orange-${active}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d97706" /></marker>
            </defs>
            <line x1={BOUNDARY_X} x2={BOUNDARY_X} y1={20} y2={136} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
            <text x={BOUNDARY_X} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">detach boundary (가정)</text>
            {Array.from({ length: STEPS - 1 }, (_, index) => {
              const from = index + 1;
              return (
                <line key={`s-${from}`} x1={sx(from) + 10} x2={sx(from + 1) - 11} y1={CELL_Y} y2={CELL_Y} stroke="#2563eb" strokeWidth={1.25} markerEnd={`url(#trunc-arrow-blue-${active})`} opacity={showState ? 1 : 0.15} />
              );
            })}
            {Array.from({ length: STEPS - 1 }, (_, index) => {
              const to = index + 1;
              const crosses = to === BOUNDARY;
              const before = to < BOUNDARY;
              if (crosses || before) return null;
              return (
                <line key={`g-${to}`} x1={sx(to + 1) - 4} x2={sx(to) + 5} y1={GRAD_Y} y2={GRAD_Y} stroke="#d97706" strokeWidth={1.25} markerEnd={`url(#trunc-arrow-orange-${active})`} opacity={showGrad ? 1 : 0.15} />
              );
            })}
            {showGrad && <text x={BOUNDARY_X} y={GRAD_Y + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="#dc2626">×</text>}
            {Array.from({ length: STEPS }, (_, index) => {
              const step = index + 1;
              const learned = step > BOUNDARY;
              return (
                <g key={step}>
                  <circle cx={sx(step)} cy={CELL_Y} r={9} fill={showGrad && learned ? "#fef3c7" : "#ffffff"} stroke={showGrad && learned ? "#d97706" : "#64748b"} strokeWidth={1} />
                  <text x={sx(step)} y={CELL_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{step}</text>
                </g>
              );
            })}
            <text x={LEFT - 6} y={CELL_Y - 16} fontSize={11} fill="#2563eb">state →</text>
            <text x={sx(STEPS) + 8} y={GRAD_Y - 10} textAnchor="end" fontSize={11} fill="#d97706">← gradient (step 8 loss)</text>
            {active === 2 && (
              <g>
                <line x1={sx(1)} x2={sx(STEPS)} y1={148} y2={148} stroke="#2563eb" strokeWidth={1} />
                <text x={sx(1)} y={162} fontSize={11} fill="#2563eb">memory horizon 8 step</text>
                <line x1={sx(BOUNDARY + 1)} x2={sx(STEPS)} y1={140} y2={140} stroke="#d97706" strokeWidth={1.25} />
                <text x={sx(STEPS)} y={162} textAnchor="end" fontSize={11} fill="#d97706">credit horizon 4 step</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
