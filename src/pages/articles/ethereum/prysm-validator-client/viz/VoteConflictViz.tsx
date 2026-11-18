import SceneShell from "./SceneShell";

/**
 * 본문 대응: #slashing-protection — double vote(같은 target epoch의 다른 signing root)와
 * 양방향 surround(s1 < s2 < t2 < t1 또는 반대)를 epoch 축 위 source→target 구간으로 그린다.
 * 2→3은 V37 fixture의 source 2·target 3, 2→5/3→4/3→6은 본문 식의 예. 3→4가 기록이고 2→5가 새 vote인 장면은 방향을 뒤집은 가정.
 */
const W = 360;
const H = 176;
const AX_L = 44;
const STEP = 46;
const EPOCHS = [1, 2, 3, 4, 5, 6, 7] as const;
const ex = (epoch: number) => AX_L + (epoch - 1) * STEP;
const PAST_Y = 46;
const NEW_Y = 94;
const AXIS_Y = 128;

type Vote = { source: number; target: number; root: string };
type Verdict = "reject" | "notDouble" | "notSurround";

const SCENES: readonly { label: string; summary: string; past: Vote; next: Vote; verdict: Verdict; result: string; note: string }[] = [
  {
    label: "Double vote",
    summary: "target 3 · RB 기록 vs RA → 거절",
    past: { source: 2, target: 3, root: "RB" },
    next: { source: 2, target: 3, root: "RA" },
    verdict: "reject",
    result: "오류 반환 · submit까지 가지 않음",
    note: "기록은 target 3·root RB, 새 vote는 target 3·root RA입니다. Source·target이 같아도 root가 다르므로 오류를 돌리고 submit까지 가지 않습니다.",
  },
  {
    label: "같은 RA",
    summary: "target 3 · RA 기록 vs RA → double vote 아님",
    past: { source: 2, target: 3, root: "RA" },
    next: { source: 2, target: 3, root: "RA" },
    verdict: "notDouble",
    result: "같은 non-empty root → double vote 아님",
    note: "Signing root까지 같은 RA라면 같은 vote의 반복입니다. 같은 non-empty RA의 반복은 double vote로 보지 않습니다.",
  },
  {
    label: "기록이 감쌈",
    summary: "2 < 3 < 4 < 5 → surround",
    past: { source: 2, target: 5, root: "" },
    next: { source: 3, target: 4, root: "" },
    verdict: "reject",
    result: "surround → 거절",
    note: "기록 2→5 안에 새 3→4의 양 끝이 모두 들어갑니다. 같은 key가 서명했다면 기록이 새 vote를 surround합니다.",
  },
  {
    label: "새 vote가 감쌈",
    summary: "기록 3→4 · 새 2→5 (가정) → surround",
    past: { source: 3, target: 4, root: "" },
    next: { source: 2, target: 5, root: "" },
    verdict: "reject",
    result: "반대 방향 surround → 거절",
    note: "같은 두 구간을 뒤집어(가정) 새 vote가 바깥이 되어도 판정식이 양방향이라 surround입니다.",
  },
  {
    label: "교차",
    summary: "2→5와 3→6 → 어느 쪽도 감싸지 않음",
    past: { source: 2, target: 5, root: "" },
    next: { source: 3, target: 6, root: "" },
    verdict: "notSurround",
    result: "surround 아님 · target 5 ≠ 6",
    note: "2→5와 3→6은 교차하지만 어느 쪽도 감싸지 않고, target도 5와 6으로 다릅니다. 낮은 source·target 경계 검사는 그리지 않았습니다.",
  },
];

function Interval({ vote, y, color, label }: { vote: Vote; y: number; color: string; label: string }) {
  const x1 = ex(vote.source);
  const x2 = ex(vote.target);
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <circle cx={x1} cy={y} r={4} fill="none" stroke={color} strokeWidth={1.25} />
      <circle cx={x2} cy={y} r={4} fill={color} />
      <text x={x1} y={y - 10} fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function VoteConflictViz() {
  return (
    <SceneShell
      eyebrow="Local slashing DB · V37"
      title="DB는 새 vote 구간을 기록된 구간과 겹쳐 보고, 충돌하면 제출 전에 멈춥니다"
      description="가로축은 epoch, 한 vote는 source(빈 원)에서 target(찬 원)까지의 구간입니다. 위 줄은 DB 기록, 아래 줄은 방금 서명한 vote입니다."
      note="2→3은 이 글의 V37 fixture(source 2·target 3), 2→5·3→4·3→6은 본문 surround 식의 예입니다. 기록 3→4·새 2→5는 방향을 뒤집은 가정입니다."
      ariaLabel="Epoch 축 위의 source-target 구간으로 double vote와 surround vote 판정 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const color = scene.verdict === "reject" ? "#dc2626" : "#2563eb";
        const rootLabel = (vote: Vote) => `${vote.source}→${vote.target}${vote.root ? ` · ${vote.root}` : ""}`;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={PAST_Y + 4} fontSize={12} fill="#64748b">
              기록
            </text>
            <text x={4} y={NEW_Y + 4} fontSize={12} fill="#64748b">
              새 vote
            </text>
            <line x1={AX_L - 10} x2={ex(7) + 10} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {EPOCHS.map((epoch) => (
              <g key={epoch}>
                <line x1={ex(epoch)} x2={ex(epoch)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={ex(epoch)} y={AXIS_Y + 15} textAnchor="middle" fontSize={11} fill="#64748b">
                  {epoch}
                </text>
              </g>
            ))}
            <Interval vote={scene.past} y={PAST_Y} color="#64748b" label={rootLabel(scene.past)} />
            <Interval vote={scene.next} y={NEW_Y} color={color} label={rootLabel(scene.next)} />
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
              {scene.result}
            </text>
          </svg>
        );
      }}
    />
  );
}
