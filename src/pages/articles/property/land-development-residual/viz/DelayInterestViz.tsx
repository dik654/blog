import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 50억 × 0.08 × 6/12 = 2억, 비용 70 + 2 = 72억.
 * 줄마다 눈금이 다릅니다. 윗줄은 50억, 가운데 줄은 1년치 4억, 아랫줄은 72억을 전체 폭에 맞춥니다.
 */
const W = 340;
const H = 222;
const X0 = 10;
const FULL = W - 2 * X0;
const LOAN_Y = 24;
const LOAN_H = 30;
const CELL_Y = 104;
const CELL_H = 30;
const COST_Y = 176;
const COST_H = 30;
const YEAR_W = (4 / 50) * FULL;
const CELL_W = FULL / 12;

const LOAN = "#64748b";
const YEAR = "#b45309";
const LATE = "#dc2626";
const TEXT = "#64748b";
const DIM = "#94a3b8";

const SCENES = [
  { label: "1년치 이자", summary: "50억 × 0.08 = 4억", note: "회수가 늦어지는 동안 대출 잔액 50억 원이 유지된다고 둡니다. 연 8%이므로 1년을 다 채우면 이자는 4억 원입니다." },
  { label: "늦어진 달만 세기", summary: "4억 × 6/12 = 2억", note: "4억 원은 12개월치입니다. 칸을 12개로 나누면 6개월 지연은 그중 6칸이라 2억 원입니다. 단리만 본 값이고 수수료·추가 관리비·복리는 제외한 (가정)입니다." },
  { label: "비용에 붙이기", summary: "70 + 2 = 72억", note: "이 2억 원이 비용 칸 끝에 붙어 합계가 72억 원이 됩니다. 이 뒤에 어느 칸이 줄어드는지는 무엇을 고정하느냐에 달렸고, 바로 앞 그림의 마지막 두 장면이 그 두 경우입니다." },
] as const;

function Stage({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      <text x={X0} y={LOAN_Y - 8} fontSize={13} fontWeight={700} fill={TEXT}>대출 잔액 50억</text>
      <text x={W - X0} y={LOAN_Y - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={YEAR}>8% = 1년 이자 4억</text>
      <rect x={X0} y={LOAN_Y} width={FULL - YEAR_W} height={LOAN_H} fill={LOAN} />
      <rect x={X0 + FULL - YEAR_W} y={LOAN_Y} width={YEAR_W} height={LOAN_H} fill={YEAR} />

      {step >= 1 && (
        <g>
          <line x1={X0 + FULL - YEAR_W} y1={LOAN_Y + LOAN_H} x2={X0} y2={CELL_Y} stroke={YEAR} strokeWidth={1} strokeDasharray="2 3" />
          <line x1={X0 + FULL} y1={LOAN_Y + LOAN_H} x2={X0 + FULL} y2={CELL_Y} stroke={YEAR} strokeWidth={1} strokeDasharray="2 3" />
          {Array.from({ length: 12 }, (_, month) => (
            <rect
              key={month}
              x={X0 + month * CELL_W + 1}
              y={CELL_Y}
              width={CELL_W - 2}
              height={CELL_H}
              fill={month < 6 ? LATE : "none"}
              stroke={month < 6 ? LATE : DIM}
              strokeWidth={1}
            />
          ))}
          <text x={X0} y={CELL_Y + CELL_H + 17} fontSize={13} fontWeight={700} fill={LATE}>늦어진 6개월 = 2억</text>
          <text x={W - X0} y={CELL_Y + CELL_H + 17} textAnchor="end" fontSize={13} fill={TEXT}>12칸 = 4억</text>
        </g>
      )}

      {step >= 2 && (
        <g>
          <rect x={X0} y={COST_Y} width={(70 / 72) * FULL} height={COST_H} fill={LOAN} />
          <rect x={X0 + (70 / 72) * FULL} y={COST_Y} width={(2 / 72) * FULL} height={COST_H} fill={LATE} />
          <text x={X0 + 10} y={COST_Y + 20} fontSize={13} fontWeight={700} fill="#ffffff">비용 70억</text>
          <text x={W - X0 - 16} y={COST_Y + 20} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">+ 이자 2억</text>
        </g>
      )}
    </svg>
  );
}

export default function DelayInterestViz() {
  return (
    <SceneShell
      eyebrow="지연 이자"
      title="50억 원, 8%, 6개월을 차례로 곱하면 비용에 붙는 2억 원이 나옵니다"
      description="줄마다 눈금이 다릅니다. 가운데 줄은 윗줄의 4억 원 칸을 12개월로 펼친 것입니다. 사업과 금액은 모두 (가정)입니다."
      ariaLabel="대출 잔액 50억 원에 연 8퍼센트와 6개월을 곱해 지연 이자 2억 원을 구하고 비용에 더하는 과정"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
