import PayloadSceneShell from "./PayloadSceneShell";

/**
 * 본문 대응: #resolve — 같은 job이 interval마다 현재 pool을 다시 읽어 후보를 만들고,
 * value가 더 크면 Best를 바꾸며, Aborted·attempt error는 Best를 유지하고, getPayload가 Best를 resolve한다.
 * 숫자: #candidate 공식 예시의 거래별 value A 63,000 · B 80,000 · C 120,000 gwei.
 * tick 1 pool {A,B} → 143,000, tick 2 pool {A,B,C} → 263,000 (C 도착 시점과 tick별 outcome은 가정).
 * tick 3: pool이 그대로면 다시 263,000. execution-selection.rs의 `!is_better_payload(best, total_fees)`에서
 * 263,000은 263,000보다 크지 않으므로 BuildOutcome::Aborted { fees, .. }(job-poll.rs: "skipped payload build of worse block").
 */
const AXIS_MAX = 300000;
const BASE_Y = 128;
const TOP_Y = 22;
const COLS = ["tick 1", "tick 2", "tick 3", "tick 4", "getPayload"] as const;
const COL_X = [52, 118, 184, 250, 318] as const;
const BAR_W = 34;

type Outcome = { value: number | null; tag: string; color: string };

const OUTCOMES: readonly Outcome[] = [
  { value: 143000, tag: "Better", color: "#2563eb" },
  { value: 263000, tag: "Better", color: "#2563eb" },
  { value: 263000, tag: "Aborted", color: "#64748b" },
  { value: null, tag: "error", color: "#dc2626" },
];
const BEST_AFTER = [143000, 263000, 263000, 263000] as const;

const SCENES = [
  {
    label: "tick 1",
    summary: "첫 후보 63,000 + 80,000 = 143,000 gwei",
    note: "Job이 생기면 첫 build가 바로 시작됩니다. 이때 pool에는 A·B만 있었다고 가정하면 후보 value는 143,000 gwei이고, 비어 있던(Missing) Best가 이 후보로 바뀝니다.",
    pool: "A · B",
    result: "아직 getPayload 호출 전",
  },
  {
    label: "tick 2",
    summary: "C 도착 · 263,000 > 143,000 → 교체",
    note: "같은 parent와 attributes를 유지한 채 다음 interval에 현재 pool을 다시 읽습니다. 그 사이 C가 들어왔다면(가정) 후보는 A·B·C, value는 263,000 gwei가 되고 기존 Best보다 크므로 교체됩니다.",
    pool: "A · B · C",
    result: "아직 getPayload 호출 전",
  },
  {
    label: "Aborted",
    summary: "다시 263,000 · 크지 않음 → Best 유지",
    note: "Pool이 그대로 A·B·C라면(가정) 이번 후보도 263,000 gwei입니다. 후보는 만들어졌지만 Best보다 크지 않으므로 Aborted로 끝나고 Best를 바꾸지 않습니다. Cached reads를 재사용하고 다음 tick을 기다립니다.",
    pool: "A · B · C",
    result: "아직 getPayload 호출 전",
  },
  {
    label: "Attempt error",
    summary: "Best 263,000 유지",
    note: "시도 자체가 오류로 끝나도 Best는 남습니다. 실패 metric을 남기고 다음 tick에 다시 시도합니다. 한 번의 실패가 job 전체를 끝내지 않습니다.",
    pool: "A · B · C",
    result: "아직 getPayload 호출 전",
  },
  {
    label: "같은 ID",
    summary: "getPayload → Best 263,000 gwei",
    note: "ID의 timestamp와 API version을 검사한 뒤, 여기서는 이미 만든 Best를 반환합니다. 정책에 따라 진행 중 build나 empty payload fallback이 반환될 수도 있고, 기본 Basic job은 resolve 뒤 active job에서 빠집니다.",
    pool: "—",
    result: "Best 반환 → active job에서 제거",
  },
  {
    label: "모르는 ID",
    summary: "getPayload → UnknownPayload",
    note: "Service에 그 ID가 없으면 UnknownPayload입니다. 다른 최신 job의 후보로 대신 답하지 않습니다.",
    pool: "—",
    result: "UnknownPayload · 다른 job으로 대체 안 함",
  },
] as const;

const vy = (value: number) => BASE_Y - (value / AXIS_MAX) * (BASE_Y - TOP_Y);
const fmt = (n: number) => n.toLocaleString("en-US");

function Timeline({ active }: { active: number }) {
  const shownTicks = Math.min(active + 1, 4);
  const resolved = active >= 4;
  const unknown = active === 5;
  const stepPoints = BEST_AFTER.slice(0, shownTicks).flatMap((best, i) => {
    const left = COL_X[i] - BAR_W / 2 - 4;
    const right = i + 1 < shownTicks || (resolved && !unknown) ? COL_X[i + 1] - BAR_W / 2 - 4 : COL_X[i] + BAR_W / 2 + 4;
    return [`${left},${vy(best)}`, `${right},${vy(best)}`];
  });
  return (
    <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={8} y={12} fontSize={9} fill="#64748b">후보 value (gwei)</text>
      {[0, 100000, 200000, 300000].map((tick) => (
        <g key={tick}>
          <line x1={26} x2={352} y1={vy(tick)} y2={vy(tick)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "2 3"} />
          <text x={24} y={vy(tick) + 3} textAnchor="end" fontSize={8} fill="#64748b">{tick === 0 ? "0" : `${tick / 1000}k`}</text>
        </g>
      ))}
      {OUTCOMES.slice(0, shownTicks).map((outcome, i) => (
        <g key={i}>
          {outcome.value !== null ? (
            <>
              <rect x={COL_X[i] - BAR_W / 2} y={vy(outcome.value)} width={BAR_W} height={BASE_Y - vy(outcome.value)} fill={outcome.color} opacity={i === active ? 0.9 : 0.45} rx={2} />
              <text x={COL_X[i]} y={vy(outcome.value) - 12} textAnchor="middle" fontSize={9} fontWeight={700} fill={outcome.color}>{fmt(outcome.value)}</text>
            </>
          ) : (
            <text x={COL_X[i]} y={BASE_Y - 8} textAnchor="middle" fontSize={9} fill={outcome.color}>후보 없음</text>
          )}
          <text x={COL_X[i]} y={BASE_Y + 26} textAnchor="middle" fontSize={9} fontWeight={700} fill={outcome.color}>{outcome.tag}</text>
        </g>
      ))}
      {stepPoints.length > 0 && <polyline points={stepPoints.join(" ")} fill="none" stroke="#d97706" strokeWidth={1.25} />}
      {resolved && (
        <g>
          {unknown ? (
            <>
              <rect x={COL_X[4] - 28} y={BASE_Y - 40} width={56} height={30} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" rx={3} />
              <text x={COL_X[4]} y={BASE_Y - 21} textAnchor="middle" fontSize={8} fontWeight={700} fill="#dc2626">Unknown</text>
            </>
          ) : (
            <>
              <rect x={COL_X[4] - BAR_W / 2} y={vy(263000)} width={BAR_W} height={BASE_Y - vy(263000)} fill="none" stroke="#d97706" strokeWidth={1.25} rx={2} />
              <text x={COL_X[4]} y={vy(263000) - 12} textAnchor="middle" fontSize={9} fontWeight={700} fill="#d97706">Best 반환</text>
            </>
          )}
        </g>
      )}
      {COLS.map((col, i) => (
        <text key={col} x={COL_X[i]} y={BASE_Y + 13} textAnchor="middle" fontSize={9} fill={i === Math.min(active, 4) ? "#0f172a" : "#64748b"} fontWeight={i === Math.min(active, 4) ? 700 : 400}>{col}</text>
      ))}
      <line x1={196} x2={214} y1={162} y2={162} stroke="#d97706" strokeWidth={1.25} />
      <text x={218} y={165} fontSize={9} fill="#d97706">job 안의 Best</text>
      <rect x={290} y={156} width={10} height={10} fill="#2563eb" opacity={0.7} rx={1} />
      <text x={304} y={165} fontSize={9} fill="#2563eb">이번 후보</text>
    </svg>
  );
}

export default function BestCandidateTimelineViz() {
  return (
    <PayloadSceneShell
      eyebrow="반복 build · 한 payload job"
      title="Job은 tick마다 후보를 새로 만들고, 더 큰 후보만 Best로 남깁니다"
      description="가로축은 같은 job의 build 시도(tick)와 getPayload, 세로축은 후보의 local value입니다. 거래별 value는 앞 공식의 예시이고, C의 도착 시점과 tick별 결과는 가정입니다."
      note="263,000 gwei는 설명용 local candidate value이며 현재 네트워크 수익 측정값이 아닙니다. Freeze와 deadline 종료는 표에 있는 대로 별도의 끝맺음입니다."
      ariaLabel="같은 payload job이 반복 build로 Best를 교체·유지하고 getPayload가 resolve하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="grid grid-cols-2 gap-px bg-border p-px text-[10px] leading-4 sm:text-xs">
            <div className="min-w-0 bg-background px-2 py-2">
              <strong className="block">이번 시도가 읽은 pool</strong>
              <span className="mt-1 block font-mono text-primary">{SCENES[active].pool}</span>
            </div>
            <div className="min-w-0 bg-background px-2 py-2">
              <strong className="block">getPayload 결과</strong>
              <span className={`mt-1 block break-keep ${active === 5 ? "font-bold text-red-700 dark:text-red-400" : active === 4 ? "font-bold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>{SCENES[active].result}</span>
            </div>
          </div>
          <Timeline active={active} />
        </div>
      )}
    />
  );
}
