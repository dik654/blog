import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 100개 대출이 흩어져 흔들릴 때와 같은 충격에 함께 흔들릴 때.
 * 대출 1건 = 1억 원, 못 갚으면 회수 0, 8건과 35건은 모두 설명용 가정이며 확률이 아니다.
 * 8은 3절, 35는 7절의 손실 사례, 30은 후순위 10 + 중순위 20이다.
 */
const SCATTERED = new Set([3, 17, 28, 41, 56, 62, 79, 94]);
const SCENES = [
  { label: "서로 다르게 흔들릴 때", summary: "못 갚은 8건 · 30억 완충 안", count: 8, lines: ["못 갚은 대출 8건", "손실 8억 원", "완충 30억 원 안에서 끝"], note: "대출들이 서로 다른 산업과 지역에서 독립적으로 흔들리면 손실이 이렇게 흩어질 수 있습니다." },
  { label: "같은 충격에 함께 흔들릴 때", summary: "못 갚은 35건 · 선순위까지 5억", count: 35, lines: ["못 갚은 대출 35건", "손실 35억 원", "선순위까지 5억 원"], note: "모두 같은 주택 가격과 고용시장에 의존하면 경기 충격에 함께 못 갚을 수 있습니다. 평상시 평균 부도율만 보고는 30억 원의 완충이 충분하다고 결론낼 수 없습니다." },
] as const;

const CELL = 15;
const GRID_X = 10;
const GRID_Y = 4;
const GAUGE_X = 10;
const GAUGE_Y = 168;
const GAUGE_UNIT = 3.4;
const SEGMENTS = [
  { name: "후순위 10", from: 0, size: 10, opacity: 0.42 },
  { name: "중순위 20", from: 10, size: 20, opacity: 0.28 },
  { name: "선순위 70", from: 30, size: 70, opacity: 0.16 },
];
const RED = "#dc2626";
const TEXT = "#64748b";

export default function CorrelatedDefaultViz() {
  return (
    <SceneShell
      eyebrow="동시 부도"
      title="못 갚은 건수가 몰리면 30억 원의 완충을 넘을 수 있습니다"
      description="칸 하나가 대출 1건입니다. 1건을 1억 원, 못 갚으면 회수 0으로 단순화했고, 8건과 35건은 한 번의 결과를 가정한 예로 확률도 평균도 아닙니다. 완충은 선순위보다 먼저 손실을 받는 후순위 10억 원과 중순위 20억 원입니다."
      ariaLabel="대출 100건 중 못 갚은 건수와 손실이 닿는 트랜치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const isBad = (index: number) => (active === 0 ? SCATTERED.has(index) : index < scene.count);
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: 100 }, (_, index) => (
              <rect
                key={index}
                x={GRID_X + (index % 10) * CELL}
                y={GRID_Y + Math.floor(index / 10) * CELL}
                width={CELL - 2}
                height={CELL - 2}
                rx={2}
                fill={isBad(index) ? RED : "#64748b"}
                fillOpacity={isBad(index) ? 0.85 : 0.18}
              />
            ))}
            {scene.lines.map((line, row) => (
              <text key={line} x={180} y={50 + row * 26} fontSize={row === 2 ? 12 : 13} fontWeight={700} fill={row === 2 ? (active === 1 ? RED : TEXT) : TEXT}>{line}</text>
            ))}
            {SEGMENTS.map((segment) => (
              <g key={segment.name}>
                <rect x={GAUGE_X + segment.from * GAUGE_UNIT} y={GAUGE_Y} width={segment.size * GAUGE_UNIT} height={18} fill="#64748b" fillOpacity={segment.opacity} stroke={TEXT} strokeWidth={1} />
              </g>
            ))}
            <rect x={GAUGE_X} y={GAUGE_Y + 4} width={scene.count * GAUGE_UNIT} height={10} fill={RED} fillOpacity={0.85} />
            <text x={GAUGE_X} y={GAUGE_Y + 34} fontSize={10} fill={TEXT}>후순위 10</text>
            <text x={GAUGE_X + 20 * GAUGE_UNIT} y={GAUGE_Y + 34} textAnchor="middle" fontSize={10} fill={TEXT}>중순위 20</text>
            <text x={GAUGE_X + 100 * GAUGE_UNIT} y={GAUGE_Y + 34} textAnchor="end" fontSize={10} fill={TEXT}>선순위 70</text>
            <text x={GAUGE_X + 30 * GAUGE_UNIT + 4} y={GAUGE_Y - 4} fontSize={10} fontWeight={700} fill={TEXT}>완충 30 끝</text>
            <line x1={GAUGE_X + 30 * GAUGE_UNIT} x2={GAUGE_X + 30 * GAUGE_UNIT} y1={GAUGE_Y - 12} y2={GAUGE_Y + 22} stroke={TEXT} strokeWidth={1.25} />
          </svg>
        );
      }}
    />
  );
}
