import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rollout-ratio — (가정) 복제본 4개 × 초당 30건, 저녁 피크 초당 100건, 새벽 초당 50건.
 * 저녁 0개 내림 120 ≥ 100, 1개 내림 90 < 100 (10건 밀림). 새벽 2개 내림 60 > 50, 3개 내림 30 < 50 (산술).
 */
const PER_REPLICA = 30;
const REPLICAS = 4;
const AXIS_MAX = 130;

const X0 = 12;
const X1 = 308;
const sx = (value: number) => X0 + (value / AXIS_MAX) * (X1 - X0);

interface Scene {
  label: string;
  summary: string;
  down: number;
  arrival: number;
  when: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "저녁 피크, 갱신 전",
    summary: "4 × 30 = 120 ≥ 100",
    down: 0,
    arrival: 100,
    when: "저녁",
    note: "(가정) 복제본 네 개가 각각 초당 30건을 처리하고 저녁 피크에 초당 100건이 들어옵니다. 넷이 모두 살아 있으면 받을 수 있는 양이 들어오는 양보다 큽니다.",
  },
  {
    label: "저녁에 하나를 내리면",
    summary: "3 × 30 = 90 < 100 → 10건 밀림",
    down: 1,
    arrival: 100,
    when: "저녁",
    note: "그룹 단위 갱신은 복제본 하나를 통째로 내립니다. 남은 셋이 초당 90건까지만 받으므로 초당 10건이 밀립니다. 이 시간대에는 갱신을 시작할 수 없습니다.",
  },
  {
    label: "새벽에 둘을 내리면",
    summary: "2 × 30 = 60 > 50",
    down: 2,
    arrival: 50,
    when: "새벽",
    note: "새벽에 초당 50건이면 둘을 내려도 남은 둘이 60건을 받아 여유가 있습니다. 같은 갱신도 시간대에 따라 가능 여부가 바뀝니다.",
  },
  {
    label: "새벽에 셋을 내리면",
    summary: "1 × 30 = 30 < 50",
    down: 3,
    arrival: 50,
    when: "새벽",
    note: "같은 새벽이라도 셋을 내리면 남은 하나가 30건만 받아 모자랍니다. 한 번에 내릴 수 있는 수는 남는 처리량이 도착량보다 큰지로 정해집니다.",
  },
];

export default function RolloutCapacityViz() {
  return (
    <SceneShell
      eyebrow="갱신 중 남는 용량"
      title="남는 복제본의 처리량이 그 시간대 도착량보다 커야 갱신을 시작할 수 있습니다"
      description="막대 한 칸이 복제본 하나(초당 30건)이고 점선이 그 시간대에 들어오는 양입니다. 새로 뜬 복제본의 예열 시간과 실무의 여유 계수는 이 그림에 넣지 않았습니다."
      ariaLabel="복제본을 내린 수와 시간대에 따른 남는 처리량과 도착량 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const live = (REPLICAS - scene.down) * PER_REPLICA;
        const short = live < scene.arrival;
        return (
          <svg viewBox="0 0 320 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={16} fontSize={11} fontWeight={700} fill="#475569">
              {scene.when} · 복제본 {REPLICAS - scene.down}개가 서비스 중
            </text>
            {Array.from({ length: REPLICAS }, (_, index) => {
              const isDown = index >= REPLICAS - scene.down;
              const x = sx(index * PER_REPLICA) + 1;
              const w = sx(PER_REPLICA) - sx(0) - 2;
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={30}
                    width={w}
                    height={36}
                    rx={3}
                    fill={isDown ? "none" : "#059669"}
                    fillOpacity={0.18}
                    stroke={isDown ? "#94a3b8" : "#059669"}
                    strokeWidth={1}
                    strokeDasharray={isDown ? "4 3" : undefined}
                  />
                  <text x={x + w / 2} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={isDown ? "#94a3b8" : "#047857"}>
                    복제본 {index + 1}
                  </text>
                  <text x={x + w / 2} y={60} textAnchor="middle" fontSize={10} fill={isDown ? "#94a3b8" : "#047857"}>
                    {isDown ? "갱신 중" : "30건/초"}
                  </text>
                </g>
              );
            })}
            <line x1={sx(scene.arrival)} x2={sx(scene.arrival)} y1={68} y2={90} stroke={short ? "#dc2626" : "#2563eb"} strokeWidth={1.25} strokeDasharray="4 3" />
            <text
              x={sx(scene.arrival)}
              y={100}
              textAnchor={scene.arrival > 90 ? "end" : "middle"}
              fontSize={11}
              fontWeight={700}
              fill={short ? "#dc2626" : "#2563eb"}
            >
              도착 {scene.arrival}건/초
            </text>
            {short && (
              <rect x={sx(live)} y={72} width={sx(scene.arrival) - sx(live)} height={10} fill="#dc2626" fillOpacity={0.25} />
            )}
            <line x1={X0} x2={X1} y1={118} y2={118} stroke="#94a3b8" strokeWidth={1} />
            {[0, 30, 60, 90, 120].map((tick) => (
              <g key={tick}>
                <line x1={sx(tick)} x2={sx(tick)} y1={118} y2={122} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(tick)} y={134} textAnchor="middle" fontSize={10} fill="#64748b">
                  {tick}
                </text>
              </g>
            ))}
            <text x={X1} y={147} textAnchor="end" fontSize={10} fill="#64748b">
              초당 건수
            </text>
            <text x={X0} y={147} fontSize={11} fontWeight={700} fill={short ? "#dc2626" : "#059669"}>
              남는 처리량 {live} {short ? `< ${scene.arrival} · ${scene.arrival - live}건/초 부족` : `≥ ${scene.arrival}`}
            </text>
          </svg>
        );
      }}
    />
  );
}
