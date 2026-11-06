import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 10억 원, 대출 6%, 고정 4% 지급, 변동 6% 수취.
 * 6000만 − (6000만 − 4000만) = 4000만.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const GRAY = "#64748b";

const SCENES = [
  { label: "은행에 내는 이자", summary: "10억 원 × 6% = 6000만 원", arrows: "loan", bank: "6000만 냄", swap: "—", net: "—", note: "대출 원금 10억 원, 해당 1년의 대출 이자율 6%입니다. 대출 가산금리는 없다고 봅니다." },
  { label: "교환 계약의 두 지급", summary: "4000만 원 내고 6000만 원 받음", arrows: "gross", bank: "6000만 냄", swap: "4000만 냄 · 6000만 받음", net: "—", note: "같은 10억 원에 대해 회사는 4%를 지급하고 6%를 받습니다. 날짜와 계산 기간이 같다는 가정입니다." },
  { label: "차액만 남깁니다", summary: "6000만 − 4000만 = 2000만 원", arrows: "net", bank: "6000만 냄", swap: "2000만 순수취", net: "—", note: "같은 날 오가는 두 금액을 합치면 교환 상대가 회사에 2000만 원을 주는 셈입니다. 순수취는 받을 돈에서 낼 돈을 뺀 금액입니다." },
  { label: "회사에 남는 부담", summary: "6000만 − 2000만 = 4000만 원", arrows: "net", bank: "6000만 냄", swap: "2000만 순수취", net: "4000만 순지출", note: "합친 순지출은 4000만 원입니다. 10억 원은 이자를 계산하는 기준이라, 10억 원을 다시 받지 않아도 이 계산은 성립합니다." },
] as const;

function Actor({ x, name, sub }: { x: number; name: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={26} width={72} height={70} rx={6} fill="none" stroke={GRAY} strokeWidth={1} />
      <text x={x + 36} y={58} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>
        {name}
      </text>
      <text x={x + 36} y={76} textAnchor="middle" fontSize={10} fill={GRAY}>
        {sub}
      </text>
    </g>
  );
}

function Arrow({ x1, x2, y, color, label }: { x1: number; x2: number; y: number; color: string; label: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2 - dir * 6} ${y - 4} L${x2} ${y} L${x2 - dir * 6} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

function Cell({ title, value, strong = false }: { title: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-sm border border-border bg-background px-2 py-1.5">
      <dt className="text-[11px] text-muted-foreground">{title}</dt>
      <dd className={`text-xs leading-5 ${strong ? "font-bold text-[#2563eb]" : "font-semibold"}`}>{value}</dd>
    </div>
  );
}

export default function CashLegsViz() {
  return (
    <SceneShell
      eyebrow="현금 경로"
      title="회사는 은행에 내고, 교환 상대와는 차액을 주고받습니다"
      description="(가정) 화살표는 돈이 가는 방향이고, 금액은 1년 치 설명용 숫자입니다."
      ariaLabel="회사, 은행, 교환 상대 사이의 이자 지급과 순지출 계산"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 122" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              <Actor x={4} name="은행" sub="대출" />
              <Actor x={144} name="회사" sub="기존 빚 유지" />
              <Actor x={284} name="교환 상대" sub="별도 계약" />
              <Arrow x1={142} x2={78} y={60} color={BLUE} label="6000만" />
              {s.arrows === "gross" && (
                <>
                  <Arrow x1={218} x2={282} y={46} color={AMBER} label="4000만" />
                  <Arrow x1={282} x2={218} y={84} color={GREEN} label="6000만" />
                </>
              )}
              {s.arrows === "net" && <Arrow x1={282} x2={218} y={60} color={GREEN} label="2000만" />}
              <text x={180} y={116} textAnchor="middle" fontSize={11} fill={GRAY}>
                화살표는 이자뿐입니다. 10억 원은 이자 계산의 기준입니다
              </text>
            </svg>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              <Cell title="은행" value={s.bank} />
              <Cell title="교환 계약" value={s.swap} />
              <Cell title="합친 결과" value={s.net} strong />
            </dl>
          </div>
        );
      }}
    />
  );
}
