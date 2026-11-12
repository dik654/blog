import SceneShell from "./SceneShell";

/**
 * 본문 대응: #selection-feedback — 3절과 7절의 A·B 오답 수(가정).
 * train 800명: A 80 → 10%, B 120 → 15%
 * validation 200명: A 40 → 20%, B 30 → 15% → B 선택
 * test 200명: 고정한 B 44 → 22% (A는 test로 평가하지 않음)
 */
type Rate = { wrong: number; total: number } | null;

const STAGES: readonly { name: string; size: string; a: Rate; b: Rate }[] = [
  { name: "train", size: "800명", a: { wrong: 80, total: 800 }, b: { wrong: 120, total: 800 } },
  { name: "validation", size: "200명", a: { wrong: 40, total: 200 }, b: { wrong: 30, total: 200 } },
  { name: "test", size: "200명", a: null, b: { wrong: 44, total: 200 } },
];

const SCENES = [
  {
    label: "train에서는 A가 덜 틀립니다",
    summary: "A 80/800=10% · B 120/800=15%",
    note: "Train은 parameter를 배우는 데 쓴 첫 800명입니다. 여기서는 A의 오답률이 더 낮지만, 이 점수는 후보를 고르는 기준으로 미리 정한 값이 아닙니다.",
  },
  {
    label: "validation에서 순서가 뒤집힙니다",
    summary: "A 40/200=20% · B 30/200=15% → B",
    note: "Validation은 후보를 고르는 둘째 200명입니다. 미리 정한 기준이 ‘validation 오답률 최소’이므로 B를 선택합니다. Train 점수를 이유로 A로 바꾸면 기준을 바꾼 셈입니다.",
  },
  {
    label: "고정한 B만 test를 엽니다",
    summary: "B 44/200=22%",
    note: "B의 구조·학습 절차·판정 기준을 고정한 뒤에야 마지막 200명(test)을 엽니다. 관측 오답률은 22%이고, 선택에서 빠진 A는 test로 평가하지 않습니다. 이 22%를 보고 기준을 바꾸면 test도 선택에 쓴 자료가 됩니다.",
  },
] as const;

const MAX = 25;
const W = 360;
const LABEL_W = 92;
const BAR_X = LABEL_W;
const BAR_MAX = W - LABEL_W - 64;
const ROW_H = 22;
const GROUP_H = 2 * ROW_H + 26;
const H = STAGES.length * GROUP_H + 8;

const pct = (rate: { wrong: number; total: number }) => (rate.wrong / rate.total) * 100;

function Row({ y, who, rate, open, chosen, faded }: { y: number; who: string; rate: Rate; open: boolean; chosen: boolean; faded: boolean }) {
  const color = who === "A" ? "#64748b" : "#2563eb";
  const value = rate ? pct(rate) : 0;
  return (
    <g opacity={faded ? 0.45 : 1}>
      <text x={LABEL_W - 10} y={y + 15} textAnchor="end" fontSize="12" fontWeight={chosen ? 700 : 500} fill="currentColor">
        후보 {who}
      </text>
      <rect x={BAR_X} y={y + 3} width={BAR_MAX} height={ROW_H - 6} rx="3" fill="#94a3b8" opacity="0.15" />
      {open && rate ? (
        <>
          <rect x={BAR_X} y={y + 3} width={(value / MAX) * BAR_MAX} height={ROW_H - 6} rx="3" fill={color} />
          <text x={BAR_X + (value / MAX) * BAR_MAX + 6} y={y + 15} fontSize="12" fontWeight={chosen ? 700 : 500} fill="currentColor">
            {Math.round(value)}%
          </text>
        </>
      ) : (
        <text x={BAR_X + 8} y={y + 15} fontSize="11" fill="#94a3b8">
          {open ? "평가 대상 아님" : "아직 열지 않음"}
        </text>
      )}
    </g>
  );
}

export default function CandidateSelectionViz() {
  return (
    <SceneShell
      eyebrow="후보 선택 순서"
      title="train에서 앞선 A가 아니라 validation에서 앞선 B를 고릅니다"
      description="막대 길이는 각 묶음의 오답률(0–25%)입니다. 오답 수와 1,200명 분리는 글의 가정이며, 묶음은 위에서 아래 순서로만 엽니다."
      ariaLabel="train, validation, test 순서로 후보 A와 B의 오답률을 열어 B를 선택하고 test로 평가하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[520px]" role="img" aria-label="묶음별 후보 A와 B의 오답률 막대">
          {STAGES.map((stage, index) => {
            const top = index * GROUP_H;
            const open = index <= active;
            const current = index === active;
            const chosenB = index >= 1 && open;
            return (
              <g key={stage.name}>
                {current ? <rect x="0.5" y={top + 0.5} width={W - 1} height={GROUP_H - 6} rx="8" fill="none" stroke="#2563eb" strokeWidth="1" /> : null}
                <text x="10" y={top + 18} fontSize="12" fontWeight="700" fill="currentColor" opacity={open ? 1 : 0.5}>
                  {stage.name} · {stage.size}
                </text>
                {index === 1 && active >= 1 ? (
                  <text x={W - 10} y={top + 18} textAnchor="end" fontSize="11" fontWeight="700" fill="#2563eb">
                    기준: 오답률 최소 → B
                  </text>
                ) : null}
                <Row y={top + 22} who="A" rate={stage.a} open={open} chosen={false} faded={!current} />
                <Row y={top + 22 + ROW_H} who="B" rate={stage.b} open={open} chosen={chosenB && current} faded={!current} />
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
