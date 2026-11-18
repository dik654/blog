import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 셋째 문단과 원장 ‘학습 한 회차의 I/O 예산’.
 * dataset read 128GB/s(가정: worker 128 × 1.0GB/s), checkpoint 8TB ÷ 120초 = 66.7GB/s,
 * NVIDIA guideline 12.5Gb/s × 128 = 1.6Tb/s = 200GB/s(별도 sizing 기준), headroom(가정) 필요치 ÷ 0.7.
 * 가로축의 burst 위치·간격은 본문에 없으므로 비례하지 않는 설명용 배치다.
 * 본문은 두 흐름이 같은 시간창에 겹치는지 확인하라고만 하므로, 3장면부터 왼쪽 burst = 겹치지 않는 경우(그 창에 read 없음),
 * 오른쪽 burst = 겹치는 경우로 두 가능성을 함께 그린다. read를 늘 깔아 두면 항상 겹친다고 읽히기 때문이다.
 */
const READ = 128 * 1.0;
const CKPT = (8 * 1000) / 120;
const GUIDE = (12.5 * 128) / 8;
const OVERLAP = READ + CKPT;
const HEAD = 0.7;
const fmt = (value: number) => value.toFixed(1);

const SCENES = [
  {
    label: "dataset read",
    summary: `${fmt(READ)}GB/s`,
    note: "(가정) worker 128개가 각각 1.0GB/s로 읽으면 128GB/s입니다. 이 장면은 read만 따로 그렸습니다.",
  },
  {
    label: "checkpoint burst",
    summary: `8TB ÷ 120초 ≈ ${fmt(CKPT)}GB/s`,
    note: "(가정) 8TB를 120초 안에 쓰려면 payload만 약 66.7GB/s입니다. 몇 분마다 오는지는 정하지 않았으므로 가로 위치는 설명용입니다.",
  },
  {
    label: "겹치면 더함",
    summary: `겹치면 ${fmt(OVERLAP)} · 안 겹치면 ${fmt(READ)}`,
    note: `오른쪽처럼 같은 시간창에 겹치면 payload만 ${fmt(OVERLAP)}GB/s, 왼쪽처럼 checkpoint 창에 read가 없으면 최고점은 read의 ${fmt(READ)}GB/s입니다. 어느 쪽인지는 workload trace로 확인하고, 여기에 network·metadata·보호 비용을 더합니다.`,
  },
  {
    label: "200GB/s 기준선",
    summary: `12.5Gb/s × 128 = 1.6Tb/s = ${fmt(GUIDE)}GB/s`,
    note: "점선은 NVIDIA의 GPU당 약 12.5Gb/s 지침을 128 GPU에 곱한 aggregate sizing 기준이며 workload 보장값이 아닙니다. 두 흐름을 이 선 하나로 덮지 않습니다.",
  },
  {
    label: "운영 여유",
    summary: `÷ 0.7 → ${fmt(OVERLAP / HEAD)} 또는 ${fmt(READ / HEAD)}`,
    note: `(가정) 목표 부하를 70% 이하로 두면 필요치를 0.7로 나눕니다. 겹치면 ${fmt(OVERLAP / HEAD)}GB/s, 안 겹치면 ${fmt(READ / HEAD)}GB/s이며 장애·rebuild·동시 job에서 다시 검산합니다.`,
  },
] as const;

const W = 360;
const H = 210;
const LEFT = 40;
const RIGHT = 350;
const BASE = 178;
const TOP = 24;
const MAX = 300;
const y = (value: number) => BASE - (value / MAX) * (BASE - TOP);
const BURSTS = [
  [150, 212],
  [278, 340],
] as const;

export default function IoBudgetOverlapViz() {
  return (
    <SceneShell
      eyebrow="학습 한 회차의 I/O 예산"
      title="dataset read와 checkpoint가 겹치는지에 따라 최고점이 달라집니다"
      description="세로축은 GB/s 처리량이고 0부터 비례합니다. 가로축은 시간 순서만 뜻하며 burst의 위치와 간격은 설명용입니다(가정). 셋째 장면부터 왼쪽 burst는 겹치지 않는 경우, 오른쪽은 겹치는 경우입니다."
      ariaLabel="dataset read 128GB/s와 checkpoint 66.7GB/s가 겹칠 때와 아닐 때의 처리량, 200GB/s 기준선, 70% 운영 여유"
      scenes={SCENES}
      render={(active) => {
        const showCkpt = active >= 1;
        const stacked = active >= 2;
        const showGuide = active >= 3;
        const showHead = active >= 4;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 100, 200, 300].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={RIGHT} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={y(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={4} y={TOP - 12} fontSize={10} fill="#64748b">GB/s</text>
            <text x={RIGHT} y={H - 6} textAnchor="end" fontSize={9} fill="#64748b">시간 →(비례 아님)</text>

            {/* dataset read */}
            <g opacity={active === 1 ? 0.25 : 1}>
            {(stacked
              ? [
                  [LEFT, BURSTS[0][0]],
                  [BURSTS[0][1], RIGHT],
                ]
              : [[LEFT, RIGHT]]
            ).map(([from, to]) => (
              <g key={from}>
                <rect x={from} y={y(READ)} width={to - from} height={BASE - y(READ)} fill="#2563eb" opacity={0.28} />
                <line x1={from} x2={to} y1={y(READ)} y2={y(READ)} stroke="#2563eb" strokeWidth={1.25} />
              </g>
            ))}
            {stacked && (
              <text x={(BURSTS[0][0] + BURSTS[0][1]) / 2} y={y(READ) + 12} textAnchor="middle" fontSize={9} fill="#64748b">read 없는 창</text>
            )}
            <text x={LEFT + 6} y={y(READ) + 14} fontSize={11} fontWeight={700} fill="#1d4ed8">{`dataset read ${fmt(READ)}`}</text>
            </g>

            {/* checkpoint bursts */}
            {BURSTS.map(([from, to], index) => {
              const onRead = stacked && index === 1;
              const bottom = onRead ? y(READ) : BASE;
              const top = onRead ? y(OVERLAP) : y(CKPT);
              return (
                <g key={index} opacity={showCkpt ? 1 : 0}>
                  <rect x={from} y={top} width={to - from} height={bottom - top} fill="#d97706" opacity={0.55} />
                  <rect x={from} y={top} width={to - from} height={bottom - top} fill="none" stroke="#b45309" strokeWidth={1} />
                  {(index === 0 || stacked) && (
                    <text x={(from + to) / 2} y={top + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#7c2d12">
                      {onRead ? `합 ${fmt(OVERLAP)}` : `저장 ${fmt(CKPT)}`}
                    </text>
                  )}
                  {index === 0 && (
                    <text x={(from + to) / 2} y={BASE + 12} textAnchor="middle" fontSize={9} fill="#64748b">120초</text>
                  )}
                </g>
              );
            })}

            {/* guideline */}
            <g opacity={showGuide ? 1 : 0}>
              <line x1={LEFT} x2={RIGHT} y1={y(GUIDE)} y2={y(GUIDE)} stroke="#475569" strokeWidth={1} strokeDasharray="5 3" />
              <text x={LEFT + 4} y={y(GUIDE) - 4} fontSize={10.5} fill="#334155">{`sizing 기준 ${fmt(GUIDE)} (보장 아님)`}</text>
            </g>

            {/* headroom */}
            <g opacity={showHead ? 1 : 0}>
              <line x1={BURSTS[1][0]} x2={BURSTS[1][1]} y1={y(OVERLAP / HEAD)} y2={y(OVERLAP / HEAD)} stroke="#dc2626" strokeWidth={1.25} />
              <line x1={(BURSTS[1][0] + BURSTS[1][1]) / 2} x2={(BURSTS[1][0] + BURSTS[1][1]) / 2} y1={y(OVERLAP / HEAD)} y2={y(OVERLAP)} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
              <text x={BURSTS[1][0] - 4} y={y(OVERLAP / HEAD) + 3} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#dc2626">{`÷0.7 → ${fmt(OVERLAP / HEAD)}`}</text>
              <line x1={LEFT + 8} x2={BURSTS[0][0] - 8} y1={y(READ / HEAD)} y2={y(READ / HEAD)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 2" />
              <text x={(LEFT + BURSTS[0][0]) / 2} y={y(READ / HEAD) + 12} textAnchor="middle" fontSize={10} fill="#dc2626">{`안 겹치면 ${fmt(READ / HEAD)}`}</text>
            </g>
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
