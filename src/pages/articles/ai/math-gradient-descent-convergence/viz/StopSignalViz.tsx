import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stopping-boundary. f=x²/2, x₀=4.
 * η=0.5: 기울기 4,2,1,0.5. 허용오차 0.6이면 t=3(x=0.5, 점수 0.125). 한도 2를 먼저 두면 t=2(x=1, 점수 0.5).
 * η=0.000001: 이동 0.000004 ≤ 이동 허용오차 0.00001이라 멈추지만 기울기는 약 4.
 */
const SCENES = [
  { label: "기울기 허용오차 0.6", summary: "t=3, x=0.5 · 점수 오차 0.125", grads: [4, 2, 1, 0.5], stop: 3, line: 0.6, signals: [true, false, false], note: "기울기 1까지는 점선 위라 계속 가고, 0.5에서 처음 점선 아래로 내려와 멈출 수 있습니다." },
  { label: "반복 한도 2를 먼저 두면", summary: "t=2, x=1 · 점수 오차 0.5", grads: [4, 2, 1, 0.5], stop: 2, line: 0.6, signals: [false, false, true], note: "기울기 1은 아직 점선 위지만 횟수가 끝났습니다. 같은 경로인데 멈춘 이유가 달라 남은 오차도 다릅니다." },
  { label: "η=0.000001, 이동 허용오차 0.00001", summary: "이동 0.000004 · 기울기 약 4", grads: [4, 4, 4, 4], stop: 1, line: null, signals: [false, true, false], note: "이동이 0.000004라 작게 움직였다는 조건으로 멈춥니다(가정). 그러나 기울기는 약 4 그대로이고 0까지 거의 4 떨어져 있습니다." },
] as const;

const SIGNALS = ["기울기가 작음", "이동이 작음", "횟수 소진"] as const;
const BASE_Y = 128;
const PX = 26;
const COL_X = [34, 118, 202, 286];
const BAR_W = 44;
const AMBER = "#d97706";
const BLUE = "#2563eb";
const GRAY = "#64748b";

export default function StopSignalViz() {
  return (
    <SceneShell
      eyebrow="멈춘 이유"
      title="같은 멈춤이라도 어느 신호가 켜졌는지에 따라 뜻이 다릅니다"
      description="막대는 반복 t마다의 기울기 크기이고, 점선은 기울기 허용오차입니다. f=x²/2, x₀=4에서 허용오차와 한도는 예로 고른 값입니다(가정)."
      ariaLabel="기울기 허용오차, 반복 한도, 이동 허용오차로 멈출 때의 위치와 남은 오차"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const grads: readonly number[] = scene.grads;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={20} x2={350} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              {grads.map((grad, index) => {
                const height = grad * PX;
                const reached = index <= scene.stop;
                return (
                  <g key={index} opacity={reached ? 1 : 0.22}>
                    <rect x={COL_X[index]} y={BASE_Y - height} width={BAR_W} height={height} fill={index === scene.stop ? BLUE : GRAY} opacity={0.8} />
                    <text x={COL_X[index] + BAR_W / 2} y={BASE_Y - height - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={index === scene.stop ? BLUE : GRAY}>{active === 2 && index > 0 ? "약 4" : grad}</text>
                    <text x={COL_X[index] + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fontWeight={index === scene.stop ? 700 : 400} fill={index === scene.stop ? BLUE : GRAY}>t={index}{index === scene.stop ? " 멈춤" : ""}</text>
                  </g>
                );
              })}
              {scene.line !== null && (
                <>
                  <line x1={20} x2={350} y1={BASE_Y - scene.line * PX} y2={BASE_Y - scene.line * PX} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={350} y={BASE_Y - scene.line * PX - 4} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>0.6</text>
                </>
              )}
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SIGNALS.map((name, index) => {
                const on = scene.signals[index];
                return (
                  <div key={name} className={`rounded-lg border px-1 py-1.5 text-center text-xs leading-5 ${on ? "border-primary font-bold text-primary" : "border-dashed border-border text-muted-foreground"}`}>
                    <span className="block">{name}</span>
                    <span className="block">{on ? "● 이 신호로 멈춤" : "○ 아님"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
