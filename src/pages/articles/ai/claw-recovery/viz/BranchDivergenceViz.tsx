import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stale-branch "behind와 diverged를 구분한다".
 * 위 줄 = main, 아래 줄 = topic branch. merge-base(M)에서 갈라진다.
 * 장면 2와 3은 behind가 모두 3이지만 topic에만 있는 commit 수(ahead)가 0과 2로 다르다.
 * commit 개수는 모양을 보이기 위한 가정이다.
 */
const W = 360;
const H = 150;
const MAIN_Y = 48;
const TOPIC_Y = 112;
const BASE_X = [56, 100] as const;
const MB_X = 100;
const NEW_MAIN_X = [150, 196, 242] as const;
const TOPIC_X = [150, 196] as const;

const SCENES = [
  {
    label: "뒤처지지 않음",
    summary: "ahead 2 · behind 0",
    mainNew: 0,
    topicOwn: 2,
    note: "main이 merge-base 이후 움직이지 않았습니다. topic에만 있는 commit 2개(ahead)만 있고 main에서 빠진 commit(behind)은 없습니다.",
  },
  {
    label: "behind만 있음",
    summary: "ahead 0 · behind 3",
    mainNew: 3,
    topicOwn: 0,
    note: "main에 commit 3개가 새로 쌓였고 topic에는 자기 commit이 없습니다. topic은 main보다 3개 뒤처졌을 뿐 갈라지지는 않았습니다.",
  },
  {
    label: "diverged",
    summary: "ahead 2 · behind 3",
    mainNew: 3,
    topicOwn: 2,
    note: "behind는 장면 2와 똑같이 3입니다. 하지만 topic에만 있는 commit 2개가 merge-base 위에 따로 쌓여 두 줄이 갈라졌습니다. behind 수만 보면 두 장면을 구분하지 못하므로 ahead·behind와 merge-base를 모두 계산합니다.",
  },
] as const;

function Commit({ x, y, fill, stroke, label }: { x: number; y: number; fill: string; stroke: string; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill={fill} stroke={stroke} strokeWidth={1.25} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
        {label}
      </text>
    </g>
  );
}

export default function BranchDivergenceViz() {
  return (
    <SceneShell
      eyebrow="Ahead · behind"
      title="behind가 같아도 branch가 갈라졌는지는 다릅니다"
      description="원 하나가 commit 하나입니다. merge-base(M)는 두 branch가 마지막으로 공유한 commit이고, ahead는 topic에만 있는 commit 수, behind는 main에만 있어 topic에 빠진 commit 수입니다. commit 개수는 가정입니다."
      ariaLabel="main과 topic branch의 ahead, behind, merge-base를 세 장면으로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mainTipX = scene.mainNew > 0 ? NEW_MAIN_X[2] : MB_X;
        const topicTipX = scene.topicOwn > 0 ? TOPIC_X[1] : MB_X;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={MAIN_Y + 4} fontSize={12} fontWeight={700} fill="#64748b">main</text>
            <text x={4} y={TOPIC_Y + 4} fontSize={12} fontWeight={700} fill="#64748b">topic</text>
            <line x1={BASE_X[0]} x2={mainTipX} y1={MAIN_Y} y2={MAIN_Y} stroke="#94a3b8" strokeWidth={1} />
            {scene.topicOwn > 0 ? (
              <path d={`M ${MB_X} ${MAIN_Y} L ${TOPIC_X[0] - 24} ${TOPIC_Y} L ${TOPIC_X[1]} ${TOPIC_Y}`} fill="none" stroke="#2563eb" strokeWidth={1} />
            ) : (
              <line x1={MB_X} x2={MB_X} y1={MAIN_Y} y2={TOPIC_Y - 14} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            )}
            {BASE_X.map((x, i) => (
              <Commit key={`b${i}`} x={x} y={MAIN_Y} fill="#64748b" stroke="#475569" label={x === MB_X ? "M" : ""} />
            ))}
            <text x={MB_X} y={MAIN_Y - 18} textAnchor="middle" fontSize={11} fill="#475569">merge-base</text>
            {NEW_MAIN_X.slice(0, scene.mainNew).map((x, i) => (
              <Commit key={`m${i}`} x={x} y={MAIN_Y} fill="#d97706" stroke="#b45309" label={`n${i + 1}`} />
            ))}
            {TOPIC_X.slice(0, scene.topicOwn).map((x, i) => (
              <Commit key={`t${i}`} x={x} y={TOPIC_Y} fill="#2563eb" stroke="#1d4ed8" label={`t${i + 1}`} />
            ))}
            {scene.topicOwn === 0 && (
              <text x={MB_X} y={TOPIC_Y + 4} textAnchor="middle" fontSize={11} fill="#64748b">topic = M</text>
            )}
            <text x={mainTipX + 15} y={MAIN_Y + 4} fontSize={11} fill="#64748b">main 끝</text>
            {scene.topicOwn > 0 && <text x={topicTipX + 15} y={TOPIC_Y + 4} fontSize={11} fill="#64748b">topic 끝</text>}
            <g>
              <rect x={270} y={88} width={84} height={20} rx={4} fill="none" stroke="#2563eb" strokeWidth={1} />
              <text x={312} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">ahead {scene.topicOwn}</text>
              <rect x={270} y={118} width={84} height={20} rx={4} fill="none" stroke="#d97706" strokeWidth={1} />
              <text x={312} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">behind {scene.mainNew}</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
