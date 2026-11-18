import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attestation-creation Slashing Protection — double vote(같은 target epoch)와
 * surround vote(source_a < source_b AND target_b < target_a)를 epoch 축 위 구간으로 그린다.
 * 기록 10→11은 글의 fixture(J10→T11). 9→12, 8→13, 11→12는 설명용 가정.
 */
const W = 360;
const H = 178;
const AX_L = 34;
const STEP = 58;
const EPOCHS = [8, 9, 10, 11, 12, 13] as const;
const ex = (epoch: number) => AX_L + (epoch - 8) * STEP;
const PAST_Y = 48;
const NEW_Y = 98;
const AXIS_Y = 132;

type Vote = { source: number; target: number };

const SCENES: readonly {
  label: string;
  summary: string;
  past: Vote;
  next: Vote | null;
  verdict: "none" | "reject" | "pass";
  pastLabel: string;
  nextLabel: string;
  focus: readonly number[];
  note: string;
}[] = [
  {
    label: "기록된 표",
    summary: "기록: source 10 → target 11",
    past: { source: 10, target: 11 },
    next: null,
    verdict: "none",
    pastLabel: "기록 J10→T11",
    nextLabel: "",
    focus: [],
    note: "Validator 17이 J10→T11 표에 서명하면 slashing protection DB에 그 source·target이 남습니다. 다음 서명 요청은 이 기록과 먼저 비교됩니다.",
  },
  {
    label: "Double vote",
    summary: "같은 target 11 · 다른 signing root → 거절",
    past: { source: 10, target: 11 },
    next: { source: 10, target: 11 },
    verdict: "reject",
    pastLabel: "기록 10→11",
    nextLabel: "새 요청 10→11, 다른 root",
    focus: [11],
    note: "뒤늦게 더 좋은 head를 받아 같은 target epoch 11에 내용이 다른 표를 만들면 signing root가 달라집니다. 같은 TargetEpoch에 다른 SigningRoot이므로 ErrDoubleVote로 거절합니다.",
  },
  {
    label: "새 표가 감쌈",
    summary: "9 < 10 이고 11 < 12 → 거절",
    past: { source: 10, target: 11 },
    next: { source: 9, target: 12 },
    verdict: "reject",
    pastLabel: "기록 10→11",
    nextLabel: "새 요청 9→12 (가정)",
    focus: [9, 12],
    note: "새 표의 source 9가 기록의 source 10보다 앞서고, 기록의 target 11이 새 target 12보다 앞섭니다. 새 구간이 기록 구간을 바깥에서 감싸므로 surround vote로 거절합니다.",
  },
  {
    label: "기록이 감쌈",
    summary: "기록 8→13 안에 새 10→11 → 거절",
    past: { source: 8, target: 13 },
    next: { source: 10, target: 11 },
    verdict: "reject",
    pastLabel: "다른 기록 8→13 (가정)",
    nextLabel: "새 요청 10→11",
    focus: [8, 13],
    note: "방향을 바꿔, 기록이 8→13이었다고 가정합니다. 8 < 10이고 11 < 13이므로 이번에는 과거 구간이 새 구간을 감쌉니다. 어느 쪽이 바깥이든 surround vote로 거절합니다.",
  },
  {
    label: "통과",
    summary: "11 → 12 · 겹침 조건 없음 → 서명",
    past: { source: 10, target: 11 },
    next: { source: 11, target: 12 },
    verdict: "pass",
    pastLabel: "기록 10→11",
    nextLabel: "새 요청 11→12 (가정)",
    focus: [],
    note: "Target 12는 기록의 target 11과 다르고, 어느 구간도 다른 구간을 바깥에서 감싸지 않습니다. 모든 검사를 통과하면 안전하다고 보고 서명하며, 이 표도 기록에 저장해 다음 요청의 비교 대상이 됩니다.",
  },
];

function Interval({ vote, y, color, label, dashed }: { vote: Vote; y: number; color: string; label: string; dashed?: boolean }) {
  const x1 = ex(vote.source);
  const x2 = ex(vote.target);
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <circle cx={x1} cy={y} r={4} fill="none" stroke={color} strokeWidth={1.25} />
      <circle cx={x2} cy={y} r={4} fill={color} />
      <text x={Math.min(x1, W - 150)} y={y - 10} fontSize={10.5} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function SlashingIntervalViz() {
  return (
    <SceneShell
      eyebrow="Slashing protection · validator 17"
      title="한 표는 source에서 target까지의 구간이고, DB는 새 구간을 과거 구간과 겹쳐 봅니다"
      description="가로축은 epoch입니다. 빈 원이 source, 찬 원이 target입니다. 위 줄은 DB에 남은 과거 표, 아래 줄은 지금 서명하려는 표입니다."
      note="기록 10→11은 이 글의 J10→T11 fixture입니다. 9→12, 8→13, 11→12는 판정 경계를 보이려는 가정입니다."
      ariaLabel="Epoch 축 위의 source-target 구간으로 double vote와 surround vote 판정 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const nextColor = scene.verdict === "reject" ? "#dc2626" : "#16a34a";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.focus.map((epoch) => (
              <line key={epoch} x1={ex(epoch)} x2={ex(epoch)} y1={28} y2={AXIS_Y} stroke="#d97706" strokeWidth={1} strokeDasharray="2 3" />
            ))}
            <text x={4} y={PAST_Y + 4} fontSize={10.5} fill="#64748b">기록</text>
            <text x={4} y={NEW_Y + 4} fontSize={10.5} fill="#64748b">새 표</text>
            <Interval vote={scene.past} y={PAST_Y} color="#2563eb" label={scene.pastLabel} />
            {scene.next ? (
              <Interval vote={scene.next} y={NEW_Y} color={nextColor} label={scene.nextLabel} dashed={scene.verdict === "reject"} />
            ) : (
              <text x={ex(10)} y={NEW_Y + 4} fontSize={10} fill="#94a3b8">아직 요청 없음</text>
            )}
            <line x1={AX_L - 10} x2={W - 12} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {EPOCHS.map((epoch) => (
              <g key={epoch}>
                <line x1={ex(epoch)} x2={ex(epoch)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={ex(epoch)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10.5} fill="#64748b">
                  {epoch}
                </text>
              </g>
            ))}
            <text x={W - 12} y={H - 6} textAnchor="end" fontSize={10.5} fontWeight={700} fill={scene.verdict === "none" ? "#64748b" : nextColor}>
              {scene.verdict === "none" ? "epoch" : scene.verdict === "reject" ? "서명 전에 거절" : "서명 후 기록에 저장"}
            </text>
          </svg>
        );
      }}
    />
  );
}
