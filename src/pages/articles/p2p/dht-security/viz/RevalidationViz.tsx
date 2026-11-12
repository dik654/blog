import SceneShell from "./SceneShell";

/**
 * 본문 대응: #geth-defense 재검증 두 문단 — 목록별 다음 실행 시점은 [0, interval)에서 무작위,
 * 그때 목록의 노드 하나를 무작위 선택. 실패하면 livenessChecks = floor(checks ÷ 3), 0 이하면 삭제.
 * 응답하면 +1, endpoint가 그대로인 검증된 node는 slow 목록으로.
 * 첫 장면의 실행 시점·선택된 노드, 노드 이름과 목록 위치는 가정입니다.
 */
const FAST = "#d97706";
const SLOW = "#4f46e5";
const FAIL = "#dc2626";
const EMPTY = "#94a3b8";
const MUTED = "#64748b";

interface Tick {
  t: number;
  node: string;
}

const FAST_TICKS: readonly Tick[] = [
  { t: 1.4, node: "a" },
  { t: 3.9, node: "b" },
  { t: 4.6, node: "a" },
  { t: 6.8, node: "c" },
  { t: 9.5, node: "b" },
  { t: 10.1, node: "c" },
  { t: 12.7, node: "b" },
  { t: 14.2, node: "a" },
  { t: 16.9, node: "c" },
];
const SLOW_TICKS: readonly Tick[] = [
  { t: 5.2, node: "d" },
  { t: 12.9, node: "f" },
  { t: 17.5, node: "e" },
];

interface CounterScene {
  label: string;
  summary: string;
  note: string;
  name: string;
  before: number;
  after: number;
  formula: string;
  verdict: string;
  verdictColor: string;
  fast: readonly string[];
  slow: readonly string[];
  removed: string;
  moveFrom: "fast" | "slow" | null;
}

const COUNTER_SCENES: readonly CounterScene[] = [
  {
    label: "X(checks 6) 실패",
    summary: "floor(6 ÷ 3) = 2 → 유지",
    note: "X는 그동안 여섯 번 확인된 entry입니다. 이번 PING에 실패하면 장부가 3으로 나눈 정수값 2가 됩니다. 0보다 크므로 삭제하지 않고 fast 목록으로 옮겨 더 빨리 다시 확인합니다.",
    name: "X",
    before: 6,
    after: 2,
    formula: "floor(6 ÷ 3) = 2",
    verdict: "유지 · fast로",
    verdictColor: FAST,
    fast: ["a", "b", "c", "X"],
    slow: ["d", "e", "f"],
    removed: "",
    moveFrom: "slow",
  },
  {
    label: "X 한 번 더 실패",
    summary: "floor(2 ÷ 3) = 0 → 삭제",
    note: "두 번째 연속 실패에서 장부가 0이 되어 X는 버킷에서 빠집니다. 같은 버킷에 replacement가 있으면 그중 하나가 무작위로 승격합니다.",
    name: "X",
    before: 2,
    after: 0,
    formula: "floor(2 ÷ 3) = 0",
    verdict: "삭제",
    verdictColor: FAIL,
    fast: ["a", "b", "c"],
    slow: ["d", "e", "f"],
    removed: "X",
    moveFrom: null,
  },
  {
    label: "Y(checks 1) 실패",
    summary: "floor(1 ÷ 3) = 0 → 삭제",
    note: "한 번만 확인된 Y는 첫 실패만으로 장부가 0이 됩니다. X와 같은 실패 한 번이어도 쌓인 이력에 따라 결과가 갈립니다.",
    name: "Y",
    before: 1,
    after: 0,
    formula: "floor(1 ÷ 3) = 0",
    verdict: "삭제",
    verdictColor: FAIL,
    fast: ["a", "b", "c"],
    slow: ["d", "e", "f"],
    removed: "Y",
    moveFrom: null,
  },
  {
    label: "X가 응답하면 +1",
    summary: "2 + 1 = 3 → slow 목록",
    note: "첫 실패 뒤의 X(장부 2)가 다음 PING에 응답했다면 장부는 3이 됩니다. Endpoint가 바뀌지 않은 검증된 node이므로 slow 목록으로 돌아갑니다. Endpoint sequence가 높아졌다면 새 ENR을 요청합니다.",
    name: "X",
    before: 2,
    after: 3,
    formula: "2 + 1 = 3",
    verdict: "유지 · slow로",
    verdictColor: SLOW,
    fast: ["a", "b", "c"],
    slow: ["d", "e", "f", "X"],
    removed: "",
    moveFrom: "fast",
  },
];

const SCENES = [
  {
    label: "무작위 PING 시점",
    summary: "fast 간격 < 3초 · slow 간격 < 9초",
    note: "각 점이 PING 한 번입니다. 목록별 다음 실행 시점을 [0, interval)에서 무작위로 잡고, 그때 목록에서 노드 하나를 무작위로 고릅니다. 그래서 a가 검사되는 간격은 3.2초, 9.6초처럼 들쭉날쭉하고 ‘3초마다 a를 검사’하지 않습니다.",
  },
  ...COUNTER_SCENES.map(({ label, summary, note }) => ({ label, summary, note })),
] as const;

const W = 360;
const H = 220;
const T0 = 24;
const T1 = 344;
const tx = (t: number) => T0 + (t / 18) * (T1 - T0);

function Timeline() {
  const aTicks = FAST_TICKS.filter((tick) => tick.node === "a");
  return (
    <g>
      {[
        { y: 52, name: "fast 목록 (interval 3초)", list: "a · b · c", ticks: FAST_TICKS, color: FAST },
        { y: 132, name: "slow 목록 (interval 9초)", list: "d · e · f · g", ticks: SLOW_TICKS, color: SLOW },
      ].map((track) => (
        <g key={track.name}>
          <text x={T0} y={track.y - 26} fontSize={12.5} fontWeight={700} fill={track.color}>
            {track.name}
          </text>
          <text x={T1} y={track.y - 26} textAnchor="end" fontSize={12} fill={MUTED}>
            노드 {track.list}
          </text>
          <line x1={T0} x2={T1} y1={track.y} y2={track.y} stroke={EMPTY} strokeWidth={1} />
          {track.ticks.map((tick) => (
            <g key={`${track.name}-${tick.t}`}>
              <circle cx={tx(tick.t)} cy={track.y} r={4} fill={tick.node === "a" ? FAST : "none"} stroke={track.color} strokeWidth={1.25} />
              <text x={tx(tick.t)} y={track.y - 9} textAnchor="middle" fontSize={12.5} fontWeight={tick.node === "a" ? 700 : 400} fill={tick.node === "a" ? FAST : MUTED}>
                {tick.node}
              </text>
            </g>
          ))}
        </g>
      ))}
      {aTicks.slice(1).map((tick, index) => {
        const prev = aTicks[index];
        const mid = (tx(prev.t) + tx(tick.t)) / 2;
        return (
          <g key={`gap-${tick.t}`}>
            <path d={`M${tx(prev.t)} 64 V72 H${tx(tick.t)} V64`} fill="none" stroke={FAST} strokeWidth={1} />
            <text x={mid} y={86} textAnchor="middle" fontSize={12} fontWeight={700} fill={FAST}>
              a {(tick.t - prev.t).toFixed(1)}초
            </text>
          </g>
        );
      })}
      {[0, 3, 6, 9, 12, 15, 18].map((t) => (
        <text key={t} x={tx(t)} y={162} textAnchor="middle" fontSize={11.5} fill={MUTED}>
          {t}s
        </text>
      ))}
      <text x={T0} y={192} fontSize={12} fill={MUTED}>
        점 위치·고른 노드는 가정 · 간격은 interval 미만
      </text>
    </g>
  );
}

function Counter({ scene }: { scene: CounterScene }) {
  const unit = 22;
  const startX = 60;
  const lists = [
    { key: "fast" as const, title: "fast 목록", color: FAST, items: scene.fast, x: 14 },
    { key: "slow" as const, title: "slow 목록", color: SLOW, items: scene.slow, x: 190 },
  ];
  return (
    <g>
      <text x={14} y={22} fontSize={12.5} fontWeight={700} fill="currentColor">
        livenessChecks 장부
      </text>
      {(["이전", "이후"] as const).map((row, rowIndex) => {
        const count = rowIndex === 0 ? scene.before : scene.after;
        const y = 36 + rowIndex * 30;
        return (
          <g key={row}>
            <text x={14} y={y + 14} fontSize={12.5} fill={MUTED}>
              {scene.name} {row}
            </text>
            {Array.from({ length: 6 }, (_, index) => (
              <rect
                key={index}
                x={startX + index * (unit + 4)}
                y={y}
                width={unit}
                height={18}
                rx={3}
                fill={index < count ? (rowIndex === 0 ? MUTED : scene.verdictColor) : "none"}
                fillOpacity={index < count ? 0.5 : 0}
                stroke={index < count ? (rowIndex === 0 ? MUTED : scene.verdictColor) : EMPTY}
                strokeWidth={1}
                strokeDasharray={index < count ? undefined : "2 2"}
              />
            ))}
            <text x={W - 10} y={y + 14} textAnchor="end" fontSize={13} fontWeight={700} fill={rowIndex === 0 ? MUTED : scene.verdictColor}>
              {count}
            </text>
          </g>
        );
      })}
      <text x={startX} y={112} fontSize={13} fontWeight={700} fill="currentColor">
        {scene.formula}
      </text>
      <text x={W - 10} y={112} textAnchor="end" fontSize={13} fontWeight={700} fill={scene.verdictColor}>
        {scene.verdict}
      </text>
      {lists.map((list) => (
        <g key={list.key}>
          <rect x={list.x} y={130} width={156} height={62} rx={6} fill="none" stroke={list.color} strokeWidth={1} />
          <text x={list.x + 8} y={146} fontSize={12} fontWeight={700} fill={list.color}>
            {list.title}
            {scene.moveFrom && scene.moveFrom !== list.key ? `  ← ${scene.name} 도착` : ""}
          </text>
          {list.items.map((item, index) => (
            <g key={item}>
              <rect x={list.x + 8 + index * 36} y={158} width={30} height={24} rx={4} fill={item === scene.name ? list.color : "none"} fillOpacity={item === scene.name ? 0.18 : 0} stroke={item === scene.name ? list.color : EMPTY} strokeWidth={1} />
              <text x={list.x + 23 + index * 36} y={174} textAnchor="middle" fontSize={12.5} fontWeight={item === scene.name ? 700 : 400} fill={item === scene.name ? list.color : MUTED}>
                {item}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text x={14} y={210} fontSize={12} fill={scene.removed ? FAIL : MUTED}>
        {scene.removed ? `${scene.removed}는 두 목록과 버킷에서 빠집니다` : "노드 이름과 목록 위치는 가정입니다"}
      </text>
    </g>
  );
}

export default function RevalidationViz() {
  return (
    <SceneShell
      eyebrow="geth v1.17.10 재검증"
      title="PING 시점은 목록마다 무작위이고, 실패는 장부를 3으로 나눕니다"
      description="livenessChecks는 entry마다 쌓인 확인 횟수 장부입니다. 첫 장면은 시간축 위의 PING, 나머지는 한 entry의 장부와 그 entry가 놓인 목록(fast·slow)을 봅니다."
      note="실제 PING timeout과 packet loss 확률은 넣지 않았습니다. 일시적인 지연도 실패로 보일 수 있습니다."
      ariaLabel="fast와 slow 목록의 무작위 PING 시점과 livenessChecks 장부가 실패와 응답에 따라 바뀌는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <Timeline /> : <Counter scene={COUNTER_SCENES[active - 1]} />}
        </svg>
      )}
    />
  );
}
