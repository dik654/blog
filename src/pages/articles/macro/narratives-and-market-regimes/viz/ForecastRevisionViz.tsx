import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 셋째 문단.
 * 전망 유지 (150+1875)÷1.08=1875. 첫해만 105 (105+1875)÷1.08≈1833.33(−41.67). 영구 105 (105+1312.5)÷1.08=1312.5(−562.5).
 */
const SCENES = [
  { label: "처음 전망", summary: "(150 + 1875) ÷ 1.08 = 1875", cash: 150, rest: 1875, today: 1875, note: "기준입니다. 1년 뒤 현금 150과 그 뒤 가치 1875를 합쳐 8%로 할인합니다." },
  { label: "첫해만 105로 낮을 때", summary: "(105 + 1875) ÷ 1.08 ≈ 1833.33", cash: 105, rest: 1875, today: 1833.33, note: "첫해 칸만 줄었습니다. 이후 매년 150이 가능하다고 여전히 믿는 경우라 그 뒤 가치 1875는 그대로이고, 오늘 가치는 약 41.67 낮아집니다." },
  { label: "앞으로도 매년 105로 바꿀 때", summary: "105 ÷ 0.08 = 1312.5", cash: 105, rest: 1312.5, today: 1312.5, note: "전망을 바꾸면 그 뒤 가치 칸이 1312.5로 함께 줄어 오늘 가치가 562.5 낮아집니다. 같은 실적 105라도 판단에 따라 오늘 가치가 1833.33과 1312.5로 갈립니다." },
] as const;

const X0 = 12;
const SCALE = 336 / 2025;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function ForecastRevisionViz() {
  return (
    <SceneShell
      eyebrow="같은 105, 다른 판단"
      title="첫해만 낮은 것과 앞으로 계속 낮은 것은 줄어드는 칸이 다릅니다"
      description="위 띠는 1년 뒤의 그 뒤 가치와 그해 현금, 아래 띠는 8%로 할인한 오늘 가치입니다. 150은 전망, 105는 가정한 관측 결과이며 같은 축척으로 그렸습니다."
      ariaLabel="첫해 실적만 낮을 때와 영구 전망을 낮출 때의 오늘 가치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const restW = scene.rest * SCALE;
        const cashW = scene.cash * SCALE;
        const todayW = scene.today * SCALE;
        const baseX = X0 + 1875 * SCALE;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={14} fontSize={12} fontWeight={700} fill={GRAY}>1년 뒤</text>
            <text x={X0 + restW + cashW} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>그해 현금 {scene.cash}</text>
            <rect x={X0} y={20} width={restW} height={28} fill="#64748b" opacity={0.7} />
            <text x={X0 + 8} y={39} fontSize={12} fontWeight={700} fill="#ffffff">그 뒤 가치 {scene.rest}</text>
            <rect x={X0 + restW} y={20} width={cashW} height={28} fill={AMBER} />
            <text x={X0} y={82} fontSize={12} fontWeight={700} fill={GRAY}>오늘 가치 (÷ 1.08)</text>
            <rect x={X0} y={88} width={todayW} height={28} fill={BLUE} opacity={0.8} />
            <text x={X0 + 8} y={107} fontSize={12} fontWeight={700} fill="#ffffff">{scene.today}</text>
            <line x1={baseX} x2={baseX} y1={78} y2={126} stroke={GRAY} strokeWidth={1} strokeDasharray="3 3" />
            <text x={baseX} y={140} textAnchor="end" fontSize={11} fill={GRAY}>점선: 처음 전망의 1875</text>
          </svg>
        );
      }}
    />
  );
}
