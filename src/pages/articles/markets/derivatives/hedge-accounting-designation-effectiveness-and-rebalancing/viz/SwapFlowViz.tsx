import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 첫 문단(1절 숫자) — 변동금리 차입 100억, 그중 80억에 변동 수취·고정 지급 스왑, 금리 3%→4%.
 * 단순 계산: 차입 이자 3억→4억(+1억), 스왑 변동 수취 2.4억→3.2억(+0.8억), 순증가 0.2억(2,000만 원).
 * 스왑의 고정금리는 본문에 없으므로 숫자를 적지 않는다. 고정 지급은 금리가 변해도 그대로라 증가분에서 빠진다.
 */
const LOAN = 100;
const SWAP = 80;
const RATES = [3, 4] as const;
const eok = (value: number) => `${Number(value.toFixed(2))}억`;
const interest = (rate: number) => (LOAN * rate) / 100;
const received = (rate: number) => (SWAP * rate) / 100;

const SCENES = [
  {
    label: "금리 3%일 때",
    summary: `이자 ${eok(interest(3))} · 스왑 수취 ${eok(received(3))}`,
    note: `스왑은 정한 원금(명목금액)에 대해 서로 다른 이자를 바꿔 내는 계약입니다. 회사는 차입 100억 원의 변동 이자 ${eok(interest(3))}을 은행에 내고, 스왑 80억 원에서는 변동 이자 ${eok(received(3))}을 받는 대신 계약 때 정한 고정 이자를 냅니다. 고정금리 숫자는 본문에 없어 적지 않았습니다.`,
  },
  {
    label: "금리 4%로 오르면",
    summary: `이자 ${eok(interest(4))} · 스왑 수취 ${eok(received(4))}`,
    note: `금리가 1%포인트 오르면 은행에 내는 이자는 ${eok(interest(4))}으로 ${eok(interest(4) - interest(3))} 늘고, 스왑에서 받는 변동 이자도 ${eok(received(4))}으로 ${eok(received(4) - received(3))} 늡니다. 스왑에서 내는 고정 이자는 그대로입니다.`,
  },
  {
    label: "늘어난 몫만 보면",
    summary: `+${eok(interest(4) - interest(3))} − ${eok(received(4) - received(3))} = +${eok(interest(4) - interest(3) - (received(4) - received(3)))}`,
    note: "고정 이자는 두 시점에 같으니 증가분에서 빠집니다. 차입 비용 증가 1억 원 가운데 스왑 80억 원분인 8,000만 원이 상쇄되고 2,000만 원이 남습니다. 80억÷100억=80%가 3절의 헤지비율입니다. 날짜·이자 계산 방식·신용 스프레드 차이는 뺀 단순 계산입니다.",
  },
] as const;

const W = 360;
const H = 124;
const BOX_W = 72;
const BOX_H = 40;
const BANK_X = 6;
const FIRM_X = (W - BOX_W) / 2;
const CP_X = W - BOX_W - 6;
const BOX_Y = 64;

function Node({ x, title, sub }: { x: number; title: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={6} fill="none" stroke="#475569" strokeWidth={1} />
      <text x={x + BOX_W / 2} y={BOX_Y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{title}</text>
      <text x={x + BOX_W / 2} y={BOX_Y + 31} textAnchor="middle" fontSize={9} fill="#64748b">{sub}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, color, label, dim = false }: { x1: number; x2: number; y: number; color: string; label: string; dim?: boolean }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g opacity={dim ? 0.35 : 1}>
      <line x1={x1} x2={x2 - dir * 5} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2},${y} L${x2 - dir * 6},${y - 4} L${x2 - dir * 6},${y + 4} Z`} fill={color} />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function SwapFlowViz() {
  return (
    <SceneShell
      eyebrow="이자가 오가는 길"
      title="금리가 오르면 은행에 더 내고, 스왑에서 더 받습니다"
      description="1절의 숫자입니다: 변동금리 차입 100억 원, 그중 80억 원에 변동금리를 받고 고정금리를 내는 스왑, 금리 3%→4%. 화살표는 연 이자가 흐르는 방향이고, 아래 줄은 고정 이자를 뺀 회사의 순부담입니다(단순 계산)."
      ariaLabel="은행, 회사, 스왑 상대방 사이의 이자 흐름과 금리 상승 때 순부담 2,000만 원 증가"
      scenes={SCENES}
      render={(active) => {
        const rate = RATES[active === 0 ? 0 : 1];
        const delta = active === 2;
        const loanLabel = delta ? `+${eok(interest(4) - interest(3))}` : eok(interest(rate));
        const recvLabel = delta ? `+${eok(received(4) - received(3))}` : eok(received(rate));
        const rows = RATES.map((r) => ({ rate: r, net: interest(r) - received(r) }));
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <Node x={BANK_X} title="은행" sub="차입 100억" />
              <Node x={FIRM_X} title="회사" sub={`금리 ${rate}%`} />
              <Node x={CP_X} title="스왑 상대방" sub="명목 80억" />
              <Arrow x1={FIRM_X} x2={BANK_X + BOX_W} y={BOX_Y + 20} color="#dc2626" label={loanLabel} />
              <text x={(FIRM_X + BANK_X + BOX_W) / 2} y={BOX_Y + 38} textAnchor="middle" fontSize={9} fill="#64748b">변동 이자 지급</text>
              <Arrow x1={CP_X} x2={FIRM_X + BOX_W} y={BOX_Y + 8} color="#16a34a" label={recvLabel} />
              <Arrow x1={FIRM_X + BOX_W} x2={CP_X} y={BOX_Y + 32} color="#64748b" label="" dim={delta} />
              <text x={(FIRM_X + BOX_W + CP_X) / 2} y={BOX_Y + 50} textAnchor="middle" fontSize={9} fill="#64748b">
                {delta ? "고정 이자: 변화 없음" : "고정 이자(본문에 금리 없음)"}
              </text>
              <text x={(FIRM_X + BOX_W + CP_X) / 2} y={BOX_Y - 12} textAnchor="middle" fontSize={9} fill="#64748b">변동 이자 수취</text>
              <text x={W / 2} y={22} textAnchor="middle" fontSize={10} fill="#64748b">
                {delta ? "금리 3% → 4%에서 늘어난 몫" : `연 이자 · 금리 ${rate}%`}
              </text>
            </svg>
            <div className="mx-auto mt-2 max-w-[560px] space-y-1.5 font-mono text-xs leading-5 sm:text-sm">
              {rows.map((row, index) => (
                <div key={row.rate} className={`flex flex-wrap justify-between gap-x-3 transition-opacity duration-300 motion-reduce:transition-none ${index <= active ? "opacity-100" : "opacity-25"}`}>
                  <span className="text-muted-foreground">금리 {row.rate}% 순부담</span>
                  <span>{eok(interest(row.rate))} − {eok(received(row.rate))} = {eok(row.net)} + 고정 이자</span>
                </div>
              ))}
              <div className={`flex flex-wrap justify-between gap-x-3 border-t border-border pt-1.5 font-bold transition-opacity duration-300 motion-reduce:transition-none ${delta ? "opacity-100" : "opacity-25"}`}>
                <span>차이</span>
                <span className="text-primary">+{eok(rows[1].net - rows[0].net)} (2,000만 원)</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
