import LotusSceneShell from "./LotusSceneShell";

/**
 * 본문 대응: #scheduler ExplainedFormula — 120분에서 10+15+25+5+10+20=85분을 빼면 S=35분.
 * 마지막 장면은 S≤0 경계를 보이려고 prove만 60분으로 바꾼 가정(합계 120, S=0)이다.
 */
const WINDOW = 120;

// 색은 단계 하나하나가 아니라 장면이 묶는 세 무리(계산 쪽·체인 쪽·reserve)만 구분하고,
// 무리 이름은 막대 아래에 글자로 적습니다. 무리 안의 단계는 칸 순서와 아래 목록 순서가 같습니다.
const GROUPS = {
  compute: { name: "계산 쪽", color: "#2563eb" },
  chain: { name: "체인 쪽", color: "#475569" },
  reserve: { name: "reserve", color: "#d97706" },
} as const;

const STAGES = [
  { key: "q", name: "대기", minutes: 10, group: "compute" },
  { key: "r", name: "읽기", minutes: 15, group: "compute" },
  { key: "p", name: "증명", minutes: 25, group: "compute" },
  { key: "s", name: "제출", minutes: 5, group: "chain" },
  { key: "c", name: "확인", minutes: 10, group: "chain" },
  { key: "R", name: "reserve", minutes: 20, group: "reserve" },
] as const;

const SCENES = [
  { label: "남은 시간", summary: "t_close − t_now = 120분", shown: 0, prove: 25, note: "Pinned chain clock 기준으로 deadline close까지 120분이 남았다고 둡니다. 이 숫자는 산술 설명용이며 Filecoin protocol 상수가 아닙니다." },
  { label: "계산 쪽", summary: "10 + 15 + 25 = 50분", shown: 3, prove: 25, note: "대기(queue·lease) 10분, challenged sector 읽기 15분, proof 생성·검증 25분을 차례로 뺍니다. 평균 proof 시간은 이 중 한 칸일 뿐입니다." },
  { label: "체인 쪽", summary: "50 + 5 + 10 = 65분", shown: 5, prove: 25, note: "Message 준비·전송 5분과 inclusion·confirmation 대기 10분도 deadline 안에 들어가야 합니다." },
  { label: "reserve와 slack", summary: "65 + 20 = 85분 → S = 35분", shown: 6, prove: 25, note: "Retry·reorg·worker/storage fault를 위한 reserve 20분까지 빼면 남는 운영 여유 S는 35분입니다." },
  { label: "S ≤ 0", summary: "증명 60분이면 합계 120 → S = 0", shown: 6, prove: 60, note: "증명 단계만 60분으로 늘었다고 가정하면 합계가 120분이 되어 S=0입니다. S≤0이면 평균 proof가 빨라도 release할 수 없습니다." },
] as const;

const W = 360;
const LEFT = 12;
const RIGHT = W - 12;
const BAR_Y = 30;
const BAR_H = 28;
const x = (minute: number) => LEFT + (minute / WINDOW) * (RIGHT - LEFT);

export default function SlackBudgetViz() {
  return (
    <LotusSceneShell
      eyebrow="35분 slack 계산"
      title="120분짜리 막대에서 단계마다 칸을 떼어 내면 남는 것이 slack입니다"
      description="막대 전체가 deadline close까지 남은 120분입니다. 칸 하나가 한 단계의 소요 시간이고, reserve까지 모두 뺀 뒤 오른쪽에 남는 빈 칸이 slack S입니다. 색은 계산 쪽·체인 쪽·reserve 세 무리를 구분합니다. 숫자는 본문의 산술 예시입니다."
      note="실제 deadline과 stage 시간, 단계 겹침은 pinned network·scheduler에서 wall time으로 측정해야 합니다."
      ariaLabel="deadline까지 120분에서 대기·읽기·증명·제출·확인·reserve를 빼 slack 35분을 구하는 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const stages = STAGES.slice(0, scene.shown).map((stage) => (stage.key === "p" ? { ...stage, minutes: scene.prove } : stage));
        const starts = stages.map((_, index) => stages.slice(0, index).reduce<number>((sum, stage) => sum + stage.minutes, 0));
        const used = stages.reduce<number>((sum, stage) => sum + stage.minutes, 0);
        const slack = WINDOW - used;
        const groups = (Object.keys(GROUPS) as (keyof typeof GROUPS)[])
          .map((group) => {
            const members = stages.filter((stage) => stage.group === group);
            if (members.length === 0) return null;
            const start = starts[stages.indexOf(members[0])];
            const minutes = members.reduce<number>((sum, stage) => sum + stage.minutes, 0);
            return { group, start, minutes };
          })
          .filter((g): g is { group: keyof typeof GROUPS; start: number; minutes: number } => g !== null);
        const rowY = BAR_Y + BAR_H + 40;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 108`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={20} fontSize={13} fill="#64748b">0분</text>
              <text x={RIGHT} y={20} fontSize={13} fill="#64748b" textAnchor="end">120분 · close</text>
              <rect x={LEFT} y={BAR_Y} width={RIGHT - LEFT} height={BAR_H} fill="none" stroke="#94a3b8" strokeWidth={1} />
              {stages.map((stage, index) => (
                <g key={stage.key}>
                  <rect x={x(starts[index])} y={BAR_Y} width={x(stage.minutes) - LEFT} height={BAR_H} fill={GROUPS[stage.group].color} stroke="#ffffff" strokeWidth={1} />
                  {stage.minutes >= 10 && (
                    <text x={x(starts[index] + stage.minutes / 2)} y={BAR_Y + 19} fontSize={13} fontWeight={700} textAnchor="middle" fill="#ffffff">{stage.minutes}</text>
                  )}
                </g>
              ))}
              {groups.map((g) => (
                <g key={g.group}>
                  <line x1={x(g.start) + 1} x2={x(g.start + g.minutes) - 1} y1={BAR_Y + BAR_H + 5} y2={BAR_Y + BAR_H + 5} stroke={GROUPS[g.group].color} strokeWidth={1.25} />
                  <text x={x(g.start + g.minutes / 2)} y={BAR_Y + BAR_H + 18} fontSize={12} textAnchor="middle" fill={GROUPS[g.group].color}>{GROUPS[g.group].name}</text>
                </g>
              ))}
              {scene.shown >= 6 && (
                <>
                  <line x1={x(used)} x2={x(used)} y1={BAR_Y - 6} y2={BAR_Y + BAR_H + 6} stroke={slack > 0 ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
                  <text x={slack > 0 ? x(used + slack / 2) : RIGHT} y={rowY} fontSize={13} fontWeight={700} textAnchor={slack > 0 ? "middle" : "end"} fill={slack > 0 ? "#16a34a" : "#dc2626"}>
                    {slack > 0 ? `S = ${slack}분` : `S = ${slack}분 · release 불가`}
                  </text>
                </>
              )}
              <text x={LEFT} y={rowY} fontSize={13} fill="#64748b">{scene.shown === 0 ? "아직 뺀 단계 없음" : `사용 ${used}분`}</text>
              {scene.shown > 0 && scene.shown < 6 && (
                <text x={RIGHT} y={rowY} fontSize={13} textAnchor="end" fill="#64748b">{`남은 ${slack}분 · 아직 S 아님`}</text>
              )}
            </svg>
            <ul className="mx-auto mt-2 flex max-w-[600px] flex-wrap gap-x-4 gap-y-1 text-xs">
              {STAGES.map((stage, index) => (
                <li key={stage.key} className={`flex items-center gap-1.5 ${index < scene.shown ? "" : "opacity-30"}`}>
                  <span aria-hidden className="inline-block h-2.5 w-2.5" style={{ backgroundColor: GROUPS[stage.group].color }} />
                  {stage.name} {stage.key === "p" ? scene.prove : stage.minutes}분
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
