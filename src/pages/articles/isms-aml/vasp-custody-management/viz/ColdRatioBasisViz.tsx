import SceneShell from "./SceneShell";

/**
 * 본문 대응: #asset-liability-control 둘째 문단.
 * 국내 80% 비율은 이용자 가상자산의 경제적 가치를 매일 산정해 상시 유지하는 경계이며, 수량비율·월말 snapshot으로 바꾸지 않는다.
 * 보유량·가격은 모두 가정: 자산 X 100개(콜드 90, 가격 1), 자산 Y 10개(콜드 7, 가격이 날마다 바뀜).
 * 수량: 97/110 = 88.2%. Y 가격 20인 날의 가치: 230/300 = 76.7%.
 * Y 가격 5·10·20·10·5 → 83.3%·80.0%·76.7%·80.0%·83.3%.
 * 세로축이 70%에서 시작하므로 막대 대신 점으로 그린다(막대 길이 비가 비율 차이를 부풀리지 않게).
 */
const X = { total: 100, cold: 90, price: 1 };
const Y = { total: 10, cold: 7 };
const Y_PRICES: readonly number[] = [5, 10, 20, 10, 5];
const PRICE_DAY = 2;

const valueRatio = (p: number) => (X.cold * X.price + Y.cold * p) / (X.total * X.price + Y.total * p);
const DAILY = Y_PRICES.map((p) => valueRatio(p) * 100);
const QTY_RATIO = ((X.cold + Y.cold) / (X.total + Y.total)) * 100;
const pct = (v: number) => `${v.toFixed(1)}%`;

const SCENES = [
  {
    label: "개수로 세면",
    summary: `콜드 97 / 110개 = ${pct(QTY_RATIO)}`,
    note: "콜드월렛에 있는 개수만 세면 88.2%로 80%를 넘는 것처럼 보입니다. 하지만 자산 X 한 개와 자산 Y 한 개의 값은 다릅니다. 수량비율은 이 차이를 지웁니다.",
  },
  {
    label: "경제적 가치로 세면",
    summary: `콜드 230 / 300 = ${pct(DAILY[PRICE_DAY])}`,
    note: "Y 한 개가 20인 날(가정)에 값으로 환산하면 X는 100 중 90, Y는 200 중 140이 콜드에 있습니다. 같은 보유량인데 비율은 76.7%로 80%에 못 미칩니다. 국내 기준은 이 경제적 가치 쪽입니다.",
  },
  {
    label: "매일 vs 월말",
    summary: "3일차 76.7% · 월말 83.3%",
    note: "보유량을 하나도 옮기지 않아도 Y 가격이 오르내리면 비율이 날마다 바뀝니다. 한 달을 5일로 줄여 그린 이 가정에서 마지막 날(월말) snapshot만 보면 83.3%로 통과하지만 3일차에는 80% 아래였습니다. 그래서 날마다 산정해 상시 유지하는 경계로 다룹니다.",
  },
] as const;

function SplitBar({ label, cold, total, scale }: { label: string; cold: number; total: number; scale: number }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-xs">
      <span className="font-semibold">{label}</span>
      <div className="flex h-4 min-w-0 overflow-hidden rounded-sm border border-border" style={{ width: `${(total / scale) * 100}%` }}>
        <div className="h-full" style={{ width: `${(cold / total) * 100}%`, backgroundColor: "#2563eb" }} />
        <div className="h-full flex-1" style={{ backgroundColor: "#cbd5e1" }} />
      </div>
      <span className="text-right font-mono">{cold} / {total}</span>
    </div>
  );
}

function Holdings({ byValue }: { byValue: boolean }) {
  const p = Y_PRICES[PRICE_DAY];
  const rows = byValue
    ? [
        { label: "자산 X", cold: X.cold * X.price, total: X.total * X.price },
        { label: "자산 Y", cold: Y.cold * p, total: Y.total * p },
      ]
    : [
        { label: "자산 X", cold: X.cold, total: X.total },
        { label: "자산 Y", cold: Y.cold, total: Y.total },
      ];
  const cold = rows.reduce<number>((s, r) => s + r.cold, 0);
  const total = rows.reduce<number>((s, r) => s + r.total, 0);
  const ratio = (cold / total) * 100;
  const pass = ratio >= 80;
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">{byValue ? "단위: 가치(가정) · Y 1개 = 20, X 1개 = 1" : "단위: 개수"}</p>
      {rows.map((r) => (
        <SplitBar key={r.label} label={r.label} cold={r.cold} total={r.total} scale={total} />
      ))}
      <SplitBar label="합계" cold={cold} total={total} scale={total} />
      <div className="relative mt-3 h-6 rounded-sm border border-border">
        <div className="h-full" style={{ width: `${ratio}%`, backgroundColor: pass ? "#16a34a" : "#dc2626" }} />
        <div className="absolute inset-y-0 border-l border-dashed" style={{ left: "80%", borderColor: "#0f172a" }} />
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="font-mono font-bold">콜드 비율 {pct(ratio)}</span>
        <span className="text-muted-foreground">점선 = 80% · {pass ? "넘음" : "못 미침"}</span>
      </div>
    </div>
  );
}

function Daily() {
  const W = 320;
  const H = 150;
  const base = 120;
  const top = 18;
  const min = 70;
  const max = 90;
  const y = (v: number) => base - ((v - min) / (max - min)) * (base - top);
  const pad = 30;
  const step = (W - pad) / DAILY.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="5일 동안 날마다 바뀌는 콜드 비율과 80% 기준선">
      <line x1={pad - 4} x2={W} y1={y(80)} y2={y(80)} stroke="#0f172a" strokeWidth={1} strokeDasharray="4 3" />
      <text x={2} y={y(80) + 4} fontSize={10} fill="#475569">80%</text>
      {DAILY.map((v, i) => {
        const cx = pad + step * i + step / 2;
        const pass = v >= 80 - 1e-9;
        return (
          <g key={i}>
            <line x1={cx} x2={cx} y1={y(v)} y2={base} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={cx} cy={y(v)} r={5} fill={pass ? "#16a34a" : "#dc2626"} />
            <text x={cx} y={y(v) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{v.toFixed(1)}</text>
            <text x={cx} y={base + 13} textAnchor="middle" fontSize={10} fill="#475569">{i + 1}일차</text>
            <text x={cx} y={base + 25} textAnchor="middle" fontSize={9} fill="#64748b">Y={Y_PRICES[i]}</text>
            {i === DAILY.length - 1 ? (
              <rect x={cx - 18} y={top - 6} width={36} height={base - top + 34} fill="none" stroke="#2563eb" strokeWidth={1} />
            ) : null}
          </g>
        );
      })}
      <text x={W - 1} y={top - 8} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">월말 snapshot</text>
      <line x1={0} x2={W} y1={base} y2={base} stroke="#94a3b8" strokeWidth={1} />
      <text x={2} y={10} fontSize={9} fill="#64748b">세로축 70%부터</text>
    </svg>
  );
}

export default function ColdRatioBasisViz() {
  return (
    <SceneShell
      eyebrow="콜드월렛 80%"
      title="같은 보유량도 무엇으로 세느냐에 따라 80%를 넘기도, 못 미치기도 합니다"
      description="파란 칸이 콜드월렛, 회색 칸이 그 밖(hot·warm)에 있는 몫입니다. 자산 X·Y의 수량과 가격은 모두 설명용 가정이며, 80%는 현재 국내 감독규정의 경제적 가치 기준이지 모든 국가의 값이 아닙니다."
      ariaLabel="수량비율, 경제적 가치 비율, 일별 비율과 월말 snapshot을 비교한 콜드월렛 80% 계산"
      scenes={SCENES}
      render={(active) => (active === 2 ? <Daily /> : <Holdings byValue={active === 1} />)}
    />
  );
}
