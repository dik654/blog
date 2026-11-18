import SceneShell from "./ForkIdSceneShell";

/**
 * 본문 대응: #validation 둘째 문단 — hash가 다를 때 원격 값이 로컬 과거 이력인지,
 * 로컬이 아는 future fork를 적용해 도달하는 값인지, 어느 쪽도 아닌지 가른다.
 * 본문 예시 schedule [5, 10]. 칸 = 그 높이 구간에서 광고하는 FORK_HASH.
 * G = CRC32(genesis), H₅ = fork 5까지, H₁₀ = fork 10까지 누산한 값.
 * 원격 next 7과 X는 설명용 가정값.
 */

const W = 360;
const H = 150;
const X0 = 24;
const STEP = 24;
const MAX_BLOCK = 13;
const LINE_Y = 80;
const SEG_TOP = 38;
const SEG_H = 24;
const bx = (block: number) => X0 + block * STEP;

const SEGMENTS = [
  { name: "G", from: 0, to: 5 },
  { name: "H₅", from: 5, to: 10 },
  { name: "H₁₀", from: 10, to: MAX_BLOCK },
] as const;

/** remoteSeg: -1 = 원격 없음, 0~2 = SEGMENTS 칸, 3 = 어느 칸에도 없는 값 */
const SCENES = [
  {
    label: "로컬이 계산해 둔 칸",
    summary: "로컬 head 12 · (H₁₀, 0)",
    localHead: 12,
    remoteSeg: -1,
    remoteNext: 0,
    local: "(H₁₀, 0)",
    remote: "아직 비교 전",
    verdict: "—",
    accept: null,
    note: "Schedule이 [5, 10]이면 genesis에서 각 fork 경계까지 CRC32를 이어 계산한 값은 G, H₅, H₁₀ 세 개입니다. Head 12인 로컬의 현재 값은 H₁₀이고 남은 fork가 없어 next는 0입니다. 다음 장면부터 원격 hash가 이 값과 다를 때를 봅니다.",
  },
  {
    label: "원격이 과거 칸에 있음",
    summary: "(H₅, 10) → 받아들임",
    localHead: 12,
    remoteSeg: 1,
    remoteNext: 10,
    local: "(H₁₀, 0)",
    remote: "(H₅, 10)",
    verdict: "원격 동기화 중",
    accept: true,
    note: "원격 hash H₅는 로컬이 head 5~9에서 광고하던 과거 값이고, 원격 next 10은 그 칸 바로 다음 로컬 fork와 같습니다. 원격이 아직 fork 10에 도달하지 않은 동기화 중 노드로 설명되므로 받아들입니다.",
  },
  {
    label: "과거 칸이지만 next가 다름",
    summary: "(H₅, 7) → 거절",
    localHead: 12,
    remoteSeg: 1,
    remoteNext: 7,
    local: "(H₁₀, 0)",
    remote: "(H₅, 7)",
    verdict: "설명 불가",
    accept: false,
    note: "H₅는 로컬의 과거 값이지만 그 칸 다음 로컬 fork는 10인데 원격은 7을 알립니다(7은 가정한 값). Head 12 뒤에 적용할 알려진 fork도 없어 로컬 schedule의 어느 위치로도 이 tuple을 설명할 수 없으므로 거절합니다.",
  },
  {
    label: "원격이 미래 칸에 있음",
    summary: "(H₁₀, 0) → 받아들임",
    localHead: 9,
    remoteSeg: 2,
    remoteNext: 0,
    local: "(H₅, 10)",
    remote: "(H₁₀, 0)",
    verdict: "로컬 동기화 중",
    accept: true,
    note: "이번에는 로컬이 head 9라 현재 값이 H₅입니다. 로컬이 알고 있는 future fork 10을 적용하면 H₁₀이 나오고 원격 값과 같습니다. 로컬이 뒤처진 상태로 설명되므로 받아들입니다.",
  },
  {
    label: "어느 칸에도 없음",
    summary: "(X, 0) → 거절",
    localHead: 12,
    remoteSeg: 3,
    remoteNext: 0,
    local: "(H₁₀, 0)",
    remote: "(X, 0)",
    verdict: "호환되지 않는 configuration",
    accept: false,
    note: "X는 G·H₅·H₁₀ 어느 것과도 다른 값입니다(가정). 예를 들어 genesis가 다르면 첫 값 G부터 달라집니다. 과거 칸에도 없고 head 12 뒤에 적용할 알려진 fork도 없으므로 거절합니다.",
  },
] as const;

function Card({ title, value, tone }: { title: string; value: string; tone?: "accept" | "reject" }) {
  const color =
    tone === "accept"
      ? "text-green-700 dark:text-green-400"
      : tone === "reject"
        ? "text-red-700 dark:text-red-400"
        : "text-foreground";
  return (
    <div className="min-w-0 bg-background px-2 py-1.5 sm:px-3">
      <div className="text-[10px] font-semibold text-muted-foreground sm:text-[11px]">{title}</div>
      <div className={`mt-1 break-keep font-mono text-xs font-bold leading-5 sm:text-sm ${color}`}>{value}</div>
    </div>
  );
}

export default function ForkIdPlacementViz() {
  return (
    <SceneShell
      eyebrow="Hash가 다를 때"
      title="원격 hash를 로컬 이력의 어느 칸에 놓을 수 있는지 봅니다"
      description="가로줄은 block 높이이고, 칸 하나는 그 높이 구간에서 로컬이 광고하는 FORK_HASH입니다. G는 genesis만 넣은 CRC32, H₅와 H₁₀은 fork 5와 10까지 누산한 값입니다. Schedule [5, 10]은 본문 예시이고, 원격 next 7과 값 X는 설명을 위해 가정했습니다."
      ariaLabel="로컬 fork schedule 위에 원격 Fork ID를 놓아 받아들일지 거절할지 정하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const headX = bx(scene.localHead);
        return (
          <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-5">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto h-auto w-full max-w-[350px]"
              role="img"
              aria-label={`${scene.label}: 로컬 ${scene.local}, 원격 ${scene.remote}, 판정 ${scene.verdict}`}
            >
              {SEGMENTS.map((segment, index) => {
                const future = segment.from > scene.localHead;
                const hit = scene.remoteSeg === index;
                return (
                  <g key={segment.name}>
                    <rect
                      x={bx(segment.from) + 1}
                      y={SEG_TOP}
                      width={bx(segment.to) - bx(segment.from) - 2}
                      height={SEG_H}
                      rx={4}
                      fill={hit ? "#fde68a" : future ? "#f8fafc" : "#e2e8f0"}
                      stroke={hit ? "#d97706" : "#94a3b8"}
                      strokeWidth={hit ? 1.25 : 1}
                      strokeDasharray={future ? "4 3" : undefined}
                    />
                    <text
                      x={(bx(segment.from) + bx(segment.to)) / 2}
                      y={SEG_TOP + 16}
                      textAnchor="middle"
                      fontSize={14}
                      fontWeight={700}
                      fill="#334155"
                    >
                      {segment.name}
                    </text>
                  </g>
                );
              })}
              {scene.localHead === 9 && (
                <text x={(bx(10) + bx(MAX_BLOCK)) / 2} y={SEG_TOP - 6} textAnchor="middle" fontSize={12} fill="#64748b">
                  알려진 미래
                </text>
              )}
              {scene.remoteSeg === 3 && (
                <text x={X0} y={20} fontSize={13} fontWeight={700} fill="#dc2626">
                  원격 X는 세 칸 어디에도 없음
                </text>
              )}
              {scene.remoteNext > 0 && (
                <g>
                  <line
                    x1={bx(scene.remoteNext)}
                    x2={bx(scene.remoteNext)}
                    y1={24}
                    y2={LINE_Y}
                    stroke="#d97706"
                    strokeWidth={1.25}
                    strokeDasharray="3 3"
                  />
                  <text x={bx(scene.remoteNext)} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">
                    원격 next {scene.remoteNext}
                  </text>
                </g>
              )}
              <line x1={X0} x2={bx(MAX_BLOCK)} y1={LINE_Y} y2={LINE_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, 5, 10].map((block) => (
                <g key={block}>
                  <line x1={bx(block)} x2={bx(block)} y1={LINE_Y - 4} y2={LINE_Y + 4} stroke="#64748b" strokeWidth={1} />
                  <text x={bx(block)} y={LINE_Y + 19} textAnchor="middle" fontSize={12} fill="#64748b">
                    {block === 0 ? "0" : `fork ${block}`}
                  </text>
                </g>
              ))}
              <path d={`M ${headX} ${LINE_Y + 24} l -6 10 h 12 z`} fill="#2563eb" />
              <text x={headX} y={LINE_Y + 54} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">
                로컬 head {scene.localHead}
              </text>
            </svg>
            <div className="mt-2 grid grid-cols-3 lg:mt-0 lg:grid-cols-1 gap-px bg-border p-px">
              <Card title="로컬 (hash, next)" value={scene.local} />
              <Card title="원격 (hash, next)" value={scene.remote} />
              <Card
                title="판정"
                value={scene.accept === null ? scene.verdict : scene.accept ? "받아들임" : "거절"}
                tone={scene.accept === null ? undefined : scene.accept ? "accept" : "reject"}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
