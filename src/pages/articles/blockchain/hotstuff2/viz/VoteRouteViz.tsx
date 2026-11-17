import Hs2SceneShell from "./Hs2SceneShell";

/**
 * 본문 대응: #two-phase — n=4, t=1에서 B20의 첫 표는 view 20의 주 노드로,
 * C20(B20)에 대한 두 번째 표는 view 21의 주 노드로 갑니다.
 * 어느 세 복제본의 표가 먼저 모이는지는 설명용 가정입니다.
 * 두 정족수 {R0,R1,R2}, {R1,R2,R3}의 겹침 = 3 + 3 − 4 = 2 = t+1.
 */
const SCENES = [
  { label: "B20 제안", summary: "주 노드 20 → 복제본 4대", note: "View 20의 주 노드가 Alice의 송금을 담은 B20을 네 복제본 모두에게 보냅니다. 주 노드도 복제본 가운데 하나지만, 역할을 보이려고 칸을 따로 그렸습니다." },
  { label: "첫 표 3개", summary: "3 = 2t+1 (n=4, t=1)", note: "R0·R1·R2의 첫 번째 표가 view 20의 주 노드에게 돌아옵니다. 서로 다른 복제본 3대의 표가 모이면 블록 인증서 C20(B20)이 됩니다. R3의 표는 늦게 도착했다고 가정했습니다." },
  { label: "인증서 방송과 잠금", summary: "C20(B20) → 4대 모두 lock", note: "주 노드가 C20(B20)을 prepare 메시지로 방송합니다. 이를 검증한 복제본은 B20을 잠급니다(lock). lock은 이보다 낮은 인증서를 단 제안에는 투표하지 않겠다는 기록입니다." },
  { label: "두 번째 표는 다음 주 노드로", summary: "vote2 3개 → C20(C20(B20))", note: "두 번째 표는 블록이 아니라 C20(B20)을 다시 인증하며, view 20이 아니라 view 21의 주 노드에게 갑니다. 3개가 모이면 이중 인증서가 됩니다. 이번에는 R0의 표가 늦었다고 가정했습니다." },
  { label: "B21 제안과 B20 커밋", summary: "Δ 대기 없이 B21", note: "View 21의 주 노드는 직전 view의 이중 인증서를 들고 B20을 잇는 B21을 바로 제안합니다. 복제본은 제안에 담긴 이중 인증서가 가리키는 B20을 커밋합니다." },
  { label: "두 정족수가 겹치는 자리", summary: "3 + 3 − 4 = 2 = t+1", note: "첫 표 집합 Q1은 R0·R1·R2, 두 번째 표 집합 Q2는 R1·R2·R3입니다. 네 대 중 세 대씩 고르면 적어도 두 대가 겹칩니다. 최대 t=1대가 잘못 행동해도 겹친 두 대 중 한 대는 정상 복제본입니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const IDLE = "#94a3b8";
const SUB = "#64748b";

const REPLICA_X = 130;
const REPLICA_W = 100;
const REPLICA_H = 40;
const REPLICA_Y: readonly number[] = [12, 66, 120, 174];
const L20 = { x: 4, y: 90, w: 84, h: 56 };
const L21 = { x: 272, y: 90, w: 84, h: 56 };

type Route = { from: "L20" | "L21" | number; to: "L20" | "L21" | number };

const ROUTES: readonly (readonly Route[])[] = [
  [0, 1, 2, 3].map((r) => ({ from: "L20" as const, to: r })),
  [0, 1, 2].map((r) => ({ from: r, to: "L20" as const })),
  [0, 1, 2, 3].map((r) => ({ from: "L20" as const, to: r })),
  [1, 2, 3].map((r) => ({ from: r, to: "L21" as const })),
  [0, 1, 2, 3].map((r) => ({ from: "L21" as const, to: r })),
  [],
];

const REPLICA_STATE: readonly (readonly string[])[] = [
  ["B20 받음", "B20 받음", "B20 받음", "B20 받음"],
  ["vote1 보냄", "vote1 보냄", "vote1 보냄", "표 늦음 (가정)"],
  ["lock B20", "lock B20", "lock B20", "lock B20"],
  ["lock B20 · 표 늦음", "lock B20 · vote2", "lock B20 · vote2", "lock B20 · vote2"],
  ["B20 커밋", "B20 커밋", "B20 커밋", "B20 커밋"],
  ["Q1", "Q1 · Q2", "Q1 · Q2", "Q2"],
];

const L20_STATE: readonly (readonly [string, string])[] = [
  ["B20 제안", "parent B19"],
  ["vote1 3개", "= 2t+1"],
  ["C20(B20)", "방송"],
  ["C20(B20)", "vote2 안 받음"],
  ["C20(B20)", "vote2 안 받음"],
  ["Q1", "R0·R1·R2"],
];

const L21_STATE: readonly (readonly [string, string])[] = [
  ["아직", "할 일 없음"],
  ["아직", "할 일 없음"],
  ["아직", "할 일 없음"],
  ["vote2 3개", "C20(C20(B20))"],
  ["B21 제안", "+ 이중 인증서"],
  ["Q2", "R1·R2·R3"],
];

function anchor(node: Route["from"], side: "toward-left" | "toward-right") {
  if (node === "L20") return { x: L20.x + L20.w, y: L20.y + L20.h / 2 };
  if (node === "L21") return { x: L21.x, y: L21.y + L21.h / 2 };
  const y = REPLICA_Y[node] + REPLICA_H / 2;
  return { x: side === "toward-left" ? REPLICA_X : REPLICA_X + REPLICA_W, y };
}

function Arrow({ route }: { route: Route }) {
  const leftSide = route.from === "L20" || route.to === "L20";
  const side = leftSide ? "toward-left" : "toward-right";
  const a = anchor(route.from, side);
  const b = anchor(route.to, side);
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const head = 6;
  const p1 = `${b.x},${b.y}`;
  const p2 = `${b.x - head * Math.cos(angle - 0.45)},${b.y - head * Math.sin(angle - 0.45)}`;
  const p3 = `${b.x - head * Math.cos(angle + 0.45)},${b.y - head * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BLUE} strokeWidth={1.25} />
      <polygon points={`${p1} ${p2} ${p3}`} fill={BLUE} />
    </g>
  );
}

function involved(active: number, node: Route["from"]) {
  return ROUTES[active].some((route) => route.from === node || route.to === node);
}

function LeaderBox({ box, name, lines, on }: { box: typeof L20; name: string; lines: readonly [string, string]; on: boolean }) {
  const cx = box.x + box.w / 2;
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={on ? BLUE : IDLE} strokeWidth={on ? 1.25 : 1} />
      <text x={cx} y={box.y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{name}</text>
      <text x={cx} y={box.y + 32} textAnchor="middle" fontSize={10.5} fontWeight={on ? 700 : 400} fill={on ? BLUE : SUB}>{lines[0]}</text>
      <text x={cx} y={box.y + 46} textAnchor="middle" fontSize={10} fill={on ? BLUE : SUB}>{lines[1]}</text>
    </g>
  );
}

function Picture({ active }: { active: number }) {
  const quorum = active === SCENES.length - 1;
  return (
    <svg viewBox="0 0 360 226" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {quorum && (
        <g>
          <path d={`M${REPLICA_X - 6} ${REPLICA_Y[0]} h-4 V${REPLICA_Y[2] + REPLICA_H} h4`} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={REPLICA_X - 14} y={REPLICA_Y[0] + 8} textAnchor="end" fontSize={11} fontWeight={700} fill={BLUE}>Q1</text>
          <path d={`M${REPLICA_X + REPLICA_W + 6} ${REPLICA_Y[1]} h4 V${REPLICA_Y[3] + REPLICA_H} h-4`} fill="none" stroke={AMBER} strokeWidth={1.25} />
          <text x={REPLICA_X + REPLICA_W + 14} y={REPLICA_Y[3] + REPLICA_H - 2} fontSize={11} fontWeight={700} fill={AMBER}>Q2</text>
        </g>
      )}
      {ROUTES[active].map((route) => (
        <Arrow key={`${route.from}-${route.to}`} route={route} />
      ))}
      <LeaderBox box={L20} name="주 노드 20" lines={L20_STATE[active]} on={involved(active, "L20") || quorum} />
      <LeaderBox box={L21} name="주 노드 21" lines={L21_STATE[active]} on={involved(active, "L21") || quorum} />
      {REPLICA_Y.map((y, r) => {
        const overlap = quorum && (r === 1 || r === 2);
        const on = involved(active, r) || overlap;
        return (
          <g key={y}>
            <rect
              x={REPLICA_X}
              y={y}
              width={REPLICA_W}
              height={REPLICA_H}
              rx={8}
              fill={overlap ? BLUE : "none"}
              fillOpacity={overlap ? 0.1 : 0}
              stroke={on ? BLUE : IDLE}
              strokeWidth={on ? 1.25 : 1}
            />
            <text x={REPLICA_X + REPLICA_W / 2} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">R{r}</text>
            <text x={REPLICA_X + REPLICA_W / 2} y={y + 31} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? BLUE : SUB}>
              {REPLICA_STATE[active][r]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function VoteRouteViz() {
  return (
    <Hs2SceneShell
      eyebrow="n=4, t=1 · 표가 가는 곳"
      title="첫 표는 지금 주 노드로, 두 번째 표는 다음 주 노드로 갑니다"
      description="가운데 네 칸이 복제본 R0~R3입니다. C20(B20)은 B20에 대한 서로 다른 표 3개를 묶은 블록 인증서, C20(C20(B20))은 그 인증서를 다시 인증한 이중 인증서입니다. 어느 복제본의 표가 늦는지는 설명용 가정입니다."
      ariaLabel="HotStuff-2에서 B20의 첫 표와 두 번째 표가 이동하는 경로와 두 정족수의 겹침"
      scenes={SCENES}
      render={(active) => <Picture active={active} />}
    />
  );
}
