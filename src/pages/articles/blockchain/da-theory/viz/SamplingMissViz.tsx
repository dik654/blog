import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sampling — P_miss = (1−f)^s, f = 1/2·s = 10은 설명용 가정 → 1/1024 ≈ 0.0977%, 탐지 ≈ 99.9023%.
 * 막대 하나가 표본 수 s일 때의 놓칠 확률. 마지막 장면은 표본 독립성이 깨지면 이 곱셈을 쓸 수 없다는 전제.
 */
const F = 0.5;
const S_MAX = 10;
const MISS = Array.from({ length: S_MAX }, (_, index) => (1 - F) ** (index + 1));

const W = 360;
const H = 180;
const LEFT = 14;
const RIGHT = 346;
const TOP = 30;
const BASE = 146;
const SLOT = (RIGHT - LEFT) / S_MAX;
const BAR_W = SLOT * 0.62;
const bx = (index: number) => LEFT + index * SLOT + (SLOT - BAR_W) / 2;
const pct = (value: number) => `${(value * 100).toFixed(value < 0.01 ? 4 : value < 0.1 ? 2 : 1).replace(/\.?0+$/, "")}%`;

const SCENES = [
  { label: "표본 1개", shown: 1, summary: "1/2 = 50%", note: "숨긴 비율 f를 1/2로 둡니다(설명용 가정). 균등한 표본 하나가 숨기지 않은 곳에 떨어져 숨김을 놓칠 확률은 1−f = 1/2입니다." },
  { label: "표본 2개", shown: 2, summary: "1/2 × 1/2 = 25%", note: "두 표본이 서로 독립이면 둘 다 숨긴 곳을 비껴갈 확률은 1/2를 두 번 곱한 1/4입니다." },
  { label: "표본 3개", shown: 3, summary: "(1/2)³ = 12.5%", note: "표본을 하나 늘릴 때마다 놓칠 확률이 절반이 됩니다. 일정하게 빼는 것이 아니라 남은 값에 다시 1/2을 곱합니다." },
  { label: "표본 10개", shown: 10, summary: "(1/2)¹⁰ = 1/1,024 ≈ 0.0977%", note: "열 번 곱하면 1/1,024, 약 0.0977%입니다. 숨김을 찾아낼 확률은 약 99.9023%입니다. 10이라는 표본 수도 설명용이며 실제 프로토콜의 고정 매개변수가 아닙니다." },
  { label: "전제가 깨지면", shown: 10, summary: "이 곱셈을 쓸 수 없음", note: "같은 peer가 요청을 통제하거나 표본 위치가 공격자에게 미리 알려지면 균등하고 독립인 표본이라는 전제가 깨집니다. 그때는 (1−f)ˢ로 놓칠 확률을 계산할 수 없습니다." },
] as const;

export default function SamplingMissViz() {
  return (
    <SceneShell
      eyebrow="표본 누락 확률"
      title="숨긴 비율이 1/2이면 독립 표본 하나마다 놓칠 확률이 절반이 됩니다"
      description="막대 하나가 표본 수 s일 때 모든 표본이 숨긴 곳을 비껴갈 확률입니다. 숨긴 비율 f = 1/2과 표본 10개는 본문의 설명용 가정입니다."
      ariaLabel="숨긴 비율 1/2에서 표본 수가 늘 때 놓칠 확률이 절반씩 줄어드는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const broken = active === 4;
        const height = (value: number) => value * (BASE - TOP);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={TOP} y2={TOP} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={LEFT} y={TOP - 6} fontSize={10} fill="#64748b">100%</text>
            {MISS.map((value, index) => {
              const visible = index < scene.shown;
              const current = index === scene.shown - 1 && !broken;
              const labelled = visible && (index < 3 || index === S_MAX - 1);
              return (
                <g key={index}>
                  {visible ? (
                    <rect
                      x={bx(index)}
                      y={BASE - Math.max(height(value), 1)}
                      width={BAR_W}
                      height={Math.max(height(value), 1)}
                      rx={2}
                      fill={broken ? "#cbd5e1" : current ? "#2563eb" : "#93c5fd"}
                      fillOpacity={broken ? 0.6 : 0.9}
                    />
                  ) : (
                    <rect x={bx(index)} y={BASE - 1} width={BAR_W} height={1} fill="#e2e8f0" />
                  )}
                  {labelled && !broken && (
                    <text x={bx(index) + BAR_W / 2} y={BASE - Math.max(height(value), 1) - 5} textAnchor="middle" fontSize={index === S_MAX - 1 ? 8 : 9} fontWeight={700} fill={current ? "#2563eb" : "#64748b"}>
                      {pct(value)}
                    </text>
                  )}
                  <text x={bx(index) + BAR_W / 2} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">{index + 1}</text>
                </g>
              );
            })}
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={(LEFT + RIGHT) / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">표본 수 s</text>
            {broken && (
              <text x={(LEFT + RIGHT) / 2} y={(TOP + BASE) / 2} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">전제가 깨지면 이 막대들은 무효</text>
            )}
          </svg>
        );
      }}
    />
  );
}
