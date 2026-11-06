import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — MW는 빠르기, MWh는 그 빠르기를 유지한 시간까지 합친 양.
 * 100 MW × 1시간 = 100 MWh, 50 MW × 2시간 = 100 MWh(가정한 비교), 80 MWh는 한 시간 내내 같은 출력이면 80 MW.
 */
const X0 = 50;
const HOUR = 130;
const BASE = 176;
const MW = 1.2;

const SCENES = [
  { label: "빠르기 × 시간", summary: "100 MW × 1시간 = 100 MWh", note: "MW는 순간에 얼마나 빠르게 전기를 만들거나 쓰는지입니다. 그 상태를 한 시간 유지하면 면적, 곧 에너지가 100MWh입니다." },
  { label: "같은 에너지, 다른 모양", summary: "50 MW × 2시간 = 100 MWh", note: "비교를 위해 고른 수입니다(가정). 빠르기가 절반이어도 두 배 오래 유지하면 MWh는 같습니다. 그래서 MW와 MWh를 따로 적습니다." },
  { label: "이 사례의 길 한도", summary: "한 시간의 공급 80 MWh", note: "길의 통과 한도가 그 한 시간의 공급을 80MWh로 제한합니다. 한 시간 내내 같은 출력이라고 보면(가정) 80 MW를 유지한 면적입니다." },
];

export default function PowerEnergyViz() {
  return (
    <SceneShell
      eyebrow="MW와 MWh"
      title="MW는 높이, MWh는 면적입니다"
      description="세로가 전력(MW), 가로가 시간입니다. 칠해진 면적이 에너지(MWh)입니다."
      ariaLabel="전력과 시간을 곱한 면적으로 에너지를 나타낸 그래프"
      scenes={SCENES}
      render={(active) => {
        const height = [100, 50, 80][active];
        const hours = active === 1 ? 2 : 1;
        const width = hours * HOUR;
        const top = BASE - height * MW;
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 50, 100].map((tick) => (
              <g key={tick}>
                <line x1={X0} x2={X0 + 2 * HOUR} y1={BASE - tick * MW} y2={BASE - tick * MW} stroke="#94a3b8" strokeWidth={1} opacity={tick === 0 ? 1 : 0.3} />
                <text x={X0 - 6} y={BASE - tick * MW + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={X0 - 6} y={36} textAnchor="end" fontSize={11} fill="#64748b">MW</text>
            {active === 2 && <rect x={X0} y={BASE - 100 * MW} width={HOUR} height={100 * MW} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />}
            {active === 2 && <text x={X0 + HOUR + 8} y={BASE - 100 * MW + 12} fontSize={11} fill="#64748b">만들 수 있는 100</text>}
            <rect x={X0} y={top} width={width} height={height * MW} fill="#2563eb" fillOpacity={0.25} stroke="#2563eb" strokeWidth={1} />
            <g textAnchor="middle" fontWeight={700} fill="#2563eb">
              <text x={X0 + width / 2} y={top + (height * MW) / 2 - 2} fontSize={12}>{height} MW × {hours}시간</text>
              <text x={X0 + width / 2} y={top + (height * MW) / 2 + 16} fontSize={13}>= {height * hours} MWh</text>
            </g>
            {[0, 1, 2].map((tick) => (
              <text key={tick} x={X0 + tick * HOUR} y={BASE + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
            ))}
            <text x={X0 + HOUR} y={BASE + 32} textAnchor="middle" fontSize={11} fill="#64748b">시간</text>
          </svg>
        );
      }}
    />
  );
}
