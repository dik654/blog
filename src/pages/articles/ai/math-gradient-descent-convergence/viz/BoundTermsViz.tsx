import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 식 (9.17). f(4)=8, ‖∇f‖²=16, M=1.
 * t=0.5: 8 − 8 + 2 = 2. t=3: 8 − 48 + 72 = 32. 두 장면은 같은 세로축을 씁니다.
 */
const SCENES = [
  { label: "보폭 0.5", summary: "8 − 8 + 2 = 2", linear: 8, curve: 2, note: "직선으로 예측한 감소 8이 크고 곡선으로 인한 오차 여유는 2뿐입니다. 상한 2는 지금 점수 8보다 낮습니다." },
  { label: "보폭 3", summary: "8 − 48 + 72 = 32", linear: 48, curve: 72, note: "직선 감소는 보폭에 비례해 48이지만 오차 여유는 보폭의 제곱에 비례해 72로 더 커집니다. 상한 32는 지금 점수보다 높아 감소를 보장하지 않습니다." },
] as const;

const ZERO_Y = 112;
const PX = 2;
const COLS = [
  { x: 22, name: "지금 점수" },
  { x: 106, name: "선형 감소" },
  { x: 190, name: "오차 여유" },
  { x: 274, name: "상한" },
] as const;
const COL_W = 64;
const y = (value: number) => ZERO_Y - value * PX;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function BoundTermsViz() {
  return (
    <SceneShell
      eyebrow="식 (9.17)의 두 항"
      title="보폭이 커지면 오차 여유가 선형 감소를 앞지릅니다"
      description="원문 식에 f=x²/2, x=4, M=1을 넣은 값입니다. M은 기울기 변화의 상한이고 원문의 t는 여기서 보폭입니다. 두 장면의 세로축은 같습니다."
      ariaLabel="보폭 0.5와 3에서 선형 감소와 오차 여유가 상한을 만드는 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const afterLinear = 8 - scene.linear;
        const total = afterLinear + scene.curve;
        const bars = [
          { from: 0, to: 8, color: GRAY, text: "8" },
          { from: 8, to: afterLinear, color: BLUE, text: `−${scene.linear}` },
          { from: afterLinear, to: total, color: AMBER, text: `+${scene.curve}` },
          { from: 0, to: total, color: GRAY, text: `${total}` },
        ];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={10} x2={350} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={350} y={ZERO_Y - 4} textAnchor="end" fontSize={10.5} fill={GRAY}>0</text>
            {bars.map((bar, index) => {
              const col = COLS[index];
              const top = Math.max(bar.from, bar.to);
              const bottom = Math.min(bar.from, bar.to);
              return (
                <g key={col.name}>
                  <rect x={col.x} y={y(top)} width={COL_W} height={(top - bottom) * PX} fill={bar.color} opacity={0.8} />
                  <text x={col.x + COL_W / 2} y={y(top) - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={bar.color}>{bar.text}</text>
                  <text x={col.x + COL_W / 2} y={208} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>{col.name}</text>
                  {index < 3 && (
                    <line x1={col.x + COL_W} x2={COLS[index + 1].x} y1={y(bar.to)} y2={y(bar.to)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
