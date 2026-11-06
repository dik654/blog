import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 매달 원금과 이자를 합친 지급액을 같게 만드는 방식.
 * 본문의 가정(1000만 원, 12개월, 월 0.5%)에 표준 상환 공식 지급액 = P×r÷(1−(1+r)^−n)을 적용한 계산입니다.
 * 지급액 860,664원, 이자는 남은 원금×0.5%, 나머지가 원금을 줄입니다.
 */
const PRINCIPAL = 10_000_000;
const RATE = 0.005;
const N = 12;
const PAYMENT = (PRINCIPAL * RATE) / (1 - (1 + RATE) ** -N);

const SCHEDULE = (() => {
  let balance = PRINCIPAL;
  return Array.from({ length: N }, () => {
    const interest = balance * RATE;
    const principal = PAYMENT - interest;
    balance -= principal;
    return { interest, principal, after: balance };
  });
})();
const TOTAL_INTEREST = SCHEDULE.reduce((sum, month) => sum + month.interest, 0);

const won = (value: number) => {
  const rounded = Math.round(value);
  const man = Math.floor(rounded / 10000);
  const rest = rounded % 10000;
  return `${man > 0 ? `${man}만` : ""}${rest > 0 ? rest : ""}원`;
};

const SCENES = [
  { label: "첫 달", summary: `이자 ${won(SCHEDULE[0].interest)} · 원금 ${won(SCHEDULE[0].principal)}`, note: `같은 지급액 ${won(PAYMENT)}에서 남은 원금 1000만 원의 이자 5만 원을 먼저 뺍니다. 나머지만 원금을 줄입니다.` },
  { label: "둘째 달", summary: `이자 ${won(SCHEDULE[1].interest)} · 원금 ${won(SCHEDULE[1].principal)}`, note: `원금이 줄어 이자가 작아지고, 지급액은 같으니 원금 몫이 그만큼 커집니다. 이자를 매길 원금은 ${won(SCHEDULE[0].after)}입니다.` },
  { label: "마지막 달", summary: `이자 ${won(SCHEDULE[11].interest)} · 원금 ${won(SCHEDULE[11].principal)}`, note: "지급액은 처음과 같지만 거의 전부가 원금으로 갑니다. 이자 띠가 달마다 얇아지는 것이 이 방식의 모양입니다." },
  { label: "세 방식의 총이자", summary: `60만 · ${won(TOTAL_INTEREST).replace("원", "")} · 32만5000원`, note: "같은 월 0.5%에서 원금이 천천히 줄수록 총이자가 커집니다. 원리금균등은 초반 원금 몫이 원금균등보다 작아 총이자가 조금 큽니다." },
] as const;

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const LEFT = 8;
const BASE = 150;
const FULL_H = 112;
const BAR_W = 22;
const GAP = (340 - LEFT * 2 - BAR_W * N) / (N - 1);
const bx = (index: number) => LEFT + index * (BAR_W + GAP);
const scale = (value: number) => (value / PAYMENT) * FULL_H;

function Totals() {
  const rows = [
    { name: "만기에 한 번에", value: 600000, tone: GRAY },
    { name: "매달 지급액 같게(원리금균등)", value: TOTAL_INTEREST, tone: ACCENT },
    { name: "매달 원금 같게(원금균등)", value: 325000, tone: GRAY },
  ];
  return (
    <g>
      {rows.map((row, index) => {
        const y = 28 + index * 44;
        return (
          <g key={row.name}>
            <text x={0} y={y - 6} fontSize={12} fontWeight={700} fill="currentColor">{row.name}</text>
            <rect x={0} y={y} width={(row.value / 600000) * 260} height={18} rx={3} fill={row.tone} opacity={0.85} />
            <text x={(row.value / 600000) * 260 + 6} y={y + 14} fontSize={12} fontWeight={700} fill={row.tone}>{won(row.value)}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function AmortizationSplitViz() {
  return (
    <SceneShell
      eyebrow="원리금균등"
      title="매달 같은 돈을 내도 이자와 원금의 몫은 달마다 바뀝니다"
      description="기둥 하나가 한 달의 지급액입니다. 윗부분 주황이 이자, 아랫부분 파랑이 원금을 줄이는 돈입니다."
      note={`본문의 1000만 원·12개월·월 0.5%에 표준 상환 공식을 적용해 계산한 값이며 지급액은 ${won(PAYMENT)}입니다. 중도상환 비용과 변동금리 재설정은 넣지 않았습니다.`}
      ariaLabel="원리금균등 상환의 달별 이자와 원금 구성, 세 상환 방식의 총이자"
      scenes={SCENES}
      render={(active) => {
        const focus = active === 0 ? 0 : active === 1 ? 1 : 11;
        return (
          <svg viewBox="0 0 340 172" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 3 ? (
              <Totals />
            ) : (
              <g>
                {SCHEDULE.map((month, index) => {
                  const on = index === focus;
                  const interestH = scale(month.interest);
                  return (
                    <g key={index} opacity={on ? 1 : 0.45}>
                      <rect x={bx(index)} y={BASE - FULL_H} width={BAR_W} height={interestH} fill={AMBER} />
                      <rect x={bx(index)} y={BASE - FULL_H + interestH} width={BAR_W} height={FULL_H - interestH} fill={ACCENT} />
                      <text x={bx(index) + BAR_W / 2} y={BASE + 15} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? "currentColor" : GRAY}>{index + 1}</text>
                    </g>
                  );
                })}
                <text x={focus <= 1 ? bx(focus) : bx(focus) + BAR_W} y={BASE - FULL_H - 8} textAnchor={focus <= 1 ? "start" : "end"} fontSize={13} fontWeight={700} fill={AMBER}>이자 {won(SCHEDULE[focus].interest)}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
