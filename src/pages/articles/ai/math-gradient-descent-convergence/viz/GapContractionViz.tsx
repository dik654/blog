import SceneShell from "./SceneShell";

/**
 * 본문 대응: #convergence 둘째 문단. Δ=1, μ=2, L=8(가정).
 * 강한 볼록성: ‖∇f‖² ≥ 2μΔ = 4. 매끄러움: 감소 ≥ ‖∇f‖²/(2L) = 4/16 = 0.25. 잇기: 다음 오차 ≤ 0.75 = (1−μ/L)Δ.
 */
const SCENES = [
  { label: "강한 볼록성", summary: "‖∇f‖² ≥ 2μΔ = 4", lit: 1, note: "오차 Δ가 남아 있으면 기울기가 그만큼 작을 수 없다는 연결입니다. μ는 가장 평평한 방향의 최소 굽음입니다." },
  { label: "매끄러움", summary: "감소 ≥ ‖∇f‖²/(2L) = 0.25", lit: 2, note: "η=1/L로 움직이면 기울기가 클수록 점수가 많이 줄어든다는 보장입니다. L은 가장 급한 방향의 굽음 상한입니다." },
  { label: "둘을 이으면", summary: "다음 오차 ≤ (1−μ/L)Δ = 0.75", lit: 3, note: "μ와 L만 남고 기울기는 사라집니다. 이번 오차의 적어도 μ/L=1/4은 줄어든다는 뜻이고, 실제 감소는 이보다 클 수 있습니다." },
] as const;

const BOXES = [
  { x: 6, top: "오차 Δ", value: "1" },
  { x: 130, top: "‖∇f‖²", value: "≥ 4" },
  { x: 254, top: "감소량", value: "≥ 0.25" },
] as const;
const BOX_W = 100;
const BAR_X = 10;
const BAR_W = 340;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function GapContractionViz() {
  return (
    <SceneShell
      eyebrow="부등식 두 개를 잇기"
      title="오차가 크면 기울기가 크고, 기울기가 크면 보장되는 감소도 큽니다"
      description="Δ=1, μ=2, L=8로 둔 예입니다(가정). 전역 μ-강한 볼록, L-매끄러움, 정확한 기울기, η=1/L을 전제합니다. ‖∇f‖²는 기울기 크기의 제곱입니다."
      ariaLabel="강한 볼록성과 매끄러움을 이어 한 번의 오차 감소 상한을 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const lit = SCENES[active].lit;
        const steps = [
          { label: "× 2μ", name: "강한 볼록", on: lit >= 1, x: 106 },
          { label: "÷ 2L", name: "매끄러움", on: lit >= 2, x: 230 },
        ];
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {BOXES.map((box, index) => {
              const on = index <= lit - (lit === 3 ? 1 : 0);
              return (
                <g key={box.x} opacity={on ? 1 : 0.3}>
                  <rect x={box.x} y={20} width={BOX_W} height={48} rx={8} fill="none" stroke={on ? BLUE : GRAY} strokeWidth={1} />
                  <text x={box.x + BOX_W / 2} y={40} textAnchor="middle" fontSize={12} fill={GRAY}>{box.top}</text>
                  <text x={box.x + BOX_W / 2} y={58} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{box.value}</text>
                </g>
              );
            })}
            {steps.map((step) => (
              <g key={step.x} opacity={step.on ? 1 : 0.3}>
                <line x1={step.x + 1} x2={step.x + 18} y1={44} y2={44} stroke={BLUE} strokeWidth={1} />
                <polygon points={`${step.x + 24},44 ${step.x + 17},40.5 ${step.x + 17},47.5`} fill={BLUE} />
                <text x={step.x + 12} y={13} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{step.label}</text>
                <text x={step.x + 12} y={84} textAnchor="middle" fontSize={11} fill={GRAY}>{step.name}</text>
              </g>
            ))}
            <text x={BAR_X} y={110} fontSize={12} fontWeight={700} fill={GRAY}>이번 오차 Δ = 1을 칸으로 보면</text>
            <rect x={BAR_X} y={118} width={BAR_W} height={26} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {lit === 3 && (
              <>
                <rect x={BAR_X} y={118} width={BAR_W * 0.25} height={26} fill={AMBER} />
                <rect x={BAR_X + BAR_W * 0.25} y={118} width={BAR_W * 0.75} height={26} fill={BLUE} opacity={0.8} />
                <text x={BAR_X + BAR_W * 0.125} y={136} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">0.25</text>
                <text x={BAR_X + BAR_W * 0.625} y={136} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">다음 오차 ≤ 0.75</text>
                <text x={BAR_X} y={160} fontSize={11} fontWeight={700} fill={AMBER}>적어도 줄어드는 몫</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
