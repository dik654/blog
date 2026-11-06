import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rate-limiting-algorithms — token bucket은 초당 10개 refill·최대 30개,
 * leaky bucket은 초당 1건·큐 5건(글의 두 예시 값). 요청 1건 = token 1개와
 * 도착 건수 15건·8건은 그림을 위한 가정이다.
 * 15 − 10 = 5건 막힘, 8 − 5 = 3건 넘침, 5 − 3 = 큐에 2건.
 */
const W = 360;
const H = 170;

const SCENES = [
  { label: "Token bucket · 가득 찬 통", summary: "남은 token 30 / 30", kind: "token", filled: 30, arrive: "0건", out: "0건", outHint: "도착 없음", drop: "", note: "칸 하나가 token 하나입니다. 통은 초당 10개씩 채워지고 30개에서 멈춥니다. 요청이 없는 동안 통이 차 있는 상태로 기다립니다." },
  { label: "Token bucket · 30건이 몰림", summary: "30건 즉시 통과 → 남은 token 0", kind: "token", filled: 0, arrive: "30건", out: "30건", outHint: "한꺼번에", drop: "", note: "통이 가득 차 있으면 순간적으로 30건까지 그대로 통과합니다. 평소 속도는 초당 10개인데 이 순간만 그 이상을 허용하는 것이 burst입니다." },
  { label: "Token bucket · 1초 뒤", summary: "+10개 → 10건 통과, 5건 막힘", kind: "token", filled: 0, arrive: "15건 (가정)", out: "10건", outHint: "채워진 만큼", drop: "막힘 5건", note: "1초 동안 10개가 채워졌으므로 15건이 와도 10건만 통과합니다. 통이 다시 비어 나머지 5건은 막힙니다. 몰림이 이어지면 초당 10건으로 돌아옵니다." },
  { label: "Leaky bucket · 8건이 몰림", summary: "5건 큐 대기, 3건 넘침", kind: "leaky", filled: 5, arrive: "8건 (가정)", out: "초당 1건", outHint: "고정 속도", drop: "넘침 3건", note: "이번에는 칸 하나가 큐에서 기다리는 요청 하나입니다. 큐에 5건까지 담고, 넘친 3건은 오류로 끝납니다." },
  { label: "Leaky bucket · 3초 뒤", summary: "3건 처리, 큐에 2건", kind: "leaky", filled: 2, arrive: "0건", out: "3건", outHint: "초당 1건씩", drop: "", note: "얼마나 몰렸든 초당 1건으로만 나갑니다. Token bucket이 쌓아 둔 만큼 한꺼번에 통과시킨 것과 달리, leaky bucket은 몰림을 대기 시간으로 바꿉니다." },
] as const;

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g stroke="#94a3b8" strokeWidth={1} fill="none">
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <path d={`M${x2 - 5} ${y - 4}L${x2} ${y}L${x2 - 5} ${y + 4}`} />
    </g>
  );
}

export default function BucketCompareViz() {
  return (
    <SceneShell
      eyebrow="두 가지 통"
      title="몰린 요청을 token bucket은 통과시키고 leaky bucket은 줄 세웁니다"
      description="Token bucket은 일정 속도로 token을 채우는 통에서 요청마다 token을 꺼내 쓰고, leaky bucket은 요청을 큐에 담아 고정된 속도로 흘려보냅니다. 값은 글의 예시이고 요청 1건이 token 1개를 쓴다고 둡니다(가정). 두 통의 값이 달라 처리량을 맞비교하는 그림은 아닙니다."
      ariaLabel="token bucket과 leaky bucket이 몰린 요청을 처리하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const token = scene.kind === "token";
        const total = token ? 30 : 5;
        const cells = Array.from({ length: total }, (_, index) => {
          const fromBottom = total - 1 - index;
          if (token) {
            const col = index % 6;
            const row = Math.floor(index / 6);
            return { x: 133 + col * 16, y: 46 + row * 16, w: 14, on: fromBottom < scene.filled };
          }
          return { x: 133, y: 46 + index * 16, w: 94, on: fromBottom < scene.filled };
        });
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={180} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">{token ? "초당 +10개 채움" : "요청을 담는 큐"}</text>
            {token && <path d="M180 19V38M176 33L180 38L184 33" stroke="#16a34a" strokeWidth={1} fill="none" />}
            <rect x={129} y={42} width={102} height={84} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {cells.map((cell, index) => (
              <rect key={index} x={cell.x} y={cell.y} width={cell.w} height={14} rx={2} fill={cell.on ? (token ? "#16a34a" : "#2563eb") : "none"} stroke={cell.on ? "none" : "#94a3b8"} strokeWidth={0.75} opacity={cell.on ? 0.9 : 0.5} />
            ))}
            <text x={180} y={142} textAnchor="middle" fontSize={11} fill="#64748b">{token ? "통 최대 30개" : "큐 최대 5건"}</text>
            <text x={180} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">{token ? `남은 token ${scene.filled}` : `대기 ${scene.filled}건`}</text>

            <text x={60} y={66} textAnchor="middle" fontSize={11} fill="#64748b">도착</text>
            <text x={60} y={88} textAnchor="middle" fontSize={scene.arrive.length > 4 ? 13 : 19} fontWeight={700} fill="#2563eb">{scene.arrive}</text>
            <Arrow x1={104} x2={126} y={84} />

            <Arrow x1={234} x2={256} y={84} />
            <text x={304} y={66} textAnchor="middle" fontSize={11} fill="#64748b">통과</text>
            <text x={304} y={88} textAnchor="middle" fontSize={scene.out.length > 4 ? 14 : 19} fontWeight={700} fill="#16a34a">{scene.out}</text>
            <text x={304} y={104} textAnchor="middle" fontSize={11} fill="#64748b">{scene.outHint}</text>
            {scene.drop && <text x={60} y={118} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">{scene.drop}</text>}
          </svg>
        );
      }}
    />
  );
}
