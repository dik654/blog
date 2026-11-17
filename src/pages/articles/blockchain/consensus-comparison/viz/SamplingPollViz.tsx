import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evidence — sampling 계열은 작은 peer 표본을 여러 번 뽑아 선호와 confidence를 갱신하고,
 * sample size·threshold·연속 성공 횟수와 표본 전제가 결과의 일부다.
 * 표본 5, 문턱 4, 필요 연속 성공 3, 여섯 번의 poll 응답은 설명용 가정이다.
 * 문턱 4: 4,5,3,4,5,4 → 연속 1,2,0,1,2,3 → 여섯 번째에 결정.
 * 문턱 5: 성공은 2·5번째뿐 → 최대 연속 1 → 아직 결정 없음.
 */
const SAMPLE = 5;
const NEED = 3;
const AGREE = [4, 5, 3, 4, 5, 4] as const;

function streaks(threshold: number) {
  return AGREE.reduce<number[]>((acc, agree) => {
    const prev = acc.length ? acc[acc.length - 1] : 0;
    return [...acc, agree >= threshold ? prev + 1 : 0];
  }, []);
}
const STREAK_4 = streaks(4);
const STREAK_5 = streaks(5);

const SCENES = [
  { label: "Poll 1", summary: "A 4/5 → 연속 1", note: "노드는 현재 A를 선호합니다. 전체 참가자 대신 peer 5명을 뽑아 묻고, 4명 이상(문턱)이 A라고 답하면 이번 poll을 성공으로 셉니다. 4명이 A라 성공, 연속 성공 1입니다." },
  { label: "Poll 2", summary: "A 5/5 → 연속 2", note: "새로 뽑은 5명이 모두 A라고 답했습니다. 연속 성공 2입니다." },
  { label: "Poll 3", summary: "A 3/5 → 연속 0", note: "A가 3명뿐이라 문턱 4에 못 미칩니다. ‘연속’ 성공을 세므로 횟수가 0으로 돌아갑니다." },
  { label: "Poll 4~5", summary: "A 4/5, 5/5 → 연속 2", note: "다시 문턱을 넘는 poll이 두 번 이어져 연속 성공 2가 됩니다. 아직 필요한 3회에는 모자랍니다." },
  { label: "Poll 6", summary: "A 4/5 → 연속 3 → 결정", note: "세 번 연속 성공해 이 노드는 A로 로컬 결정을 내립니다. 이 결정은 이 노드의 판단이며, 오류 확률은 parameter와 표본 전제에 따라 달라집니다." },
  { label: "문턱만 5로", summary: "같은 응답 → 아직 결정 없음", note: "응답은 그대로 두고 문턱만 5로 바꾸면 성공은 2번째와 5번째 poll뿐이고 연속 성공은 1을 넘지 못합니다. 같은 network 응답이라도 parameter가 결과를 바꿉니다." },
] as const;

const SHOWN = [1, 2, 3, 5, 6, 6] as const;
const C_A = "#2563eb";
const C_OTHER = "#cbd5e1";

export default function SamplingPollViz() {
  return (
    <SceneShell
      eyebrow="반복 표본"
      title="한 번의 poll이 아니라 연속으로 문턱을 넘은 횟수가 결정을 만듭니다"
      description="열 하나가 poll 한 번, 점 하나가 뽑힌 peer 한 명입니다. 표본 5명, 문턱 4명, 필요 연속 성공 3회와 응답은 설명용 가정입니다."
      ariaLabel="sampling 계열에서 poll마다 연속 성공 횟수가 쌓이거나 0으로 돌아가는 과정과 문턱 변경의 효과"
      scenes={SCENES}
      render={(active) => {
        const shown = (SHOWN as readonly number[])[active];
        const strict = active === 5;
        const threshold = strict ? 5 : 4;
        const streak = strict ? STREAK_5 : STREAK_4;
        const current = streak[shown - 1];
        const decided = current >= NEED;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={18} fontSize={11} fill="#475569">
              표본 {SAMPLE} · 문턱 {threshold} · 필요 연속 {NEED} (가정)
            </text>
            <circle cx={262} cy={14} r={4} fill={C_A} />
            <text x={270} y={18} fontSize={11} fill="#475569">A</text>
            <circle cx={292} cy={14} r={4} fill={C_OTHER} />
            <text x={300} y={18} fontSize={11} fill="#475569">다른 선호</text>
            {AGREE.map((agree, poll) => {
              const x = 30 + poll * 56;
              const visible = poll < shown;
              const ok = agree >= threshold;
              return (
                <g key={poll} opacity={visible ? 1 : 0.25}>
                  <text x={x} y={42} textAnchor="middle" fontSize={11} fontWeight={poll === shown - 1 ? 700 : 400} fill="#334155">
                    {poll + 1}
                  </text>
                  {Array.from({ length: SAMPLE }, (_, peer) => (
                    <circle key={peer} cx={x} cy={58 + peer * 15} r={5} fill={visible ? (peer < agree ? C_A : C_OTHER) : "#e2e8f0"} />
                  ))}
                  {visible && (
                    <>
                      <text x={x} y={148} textAnchor="middle" fontSize={11} fill="#334155">
                        {agree}/{SAMPLE}
                      </text>
                      <text x={x} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>
                        {ok ? "✓" : "✕"}
                      </text>
                      <text x={x} y={184} textAnchor="middle" fontSize={11} fill="#475569">
                        {streak[poll]}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            <text x={2} y={184} fontSize={9} fill="#64748b">연속</text>
            <line x1={10} x2={350} y1={192} y2={192} stroke="#e2e8f0" strokeWidth={1} />
            <text x={10} y={208} fontSize={12} fontWeight={700} fill={decided ? "#15803d" : "#334155"}>
              {decided ? "연속 3회 도달 → A로 로컬 결정" : `연속 성공 ${current} / ${NEED} → 아직 결정 없음`}
            </text>
          </svg>
        );
      }}
    />
  );
}
