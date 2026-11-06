import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 기준금리가 얼마든 합친 부담은 고정 4%.
 * 은행 = 10억 × r, 스왑 순지급 = 4000만 − 10억 × r, 합계 = 4000만.
 * 가산금리 1%면 은행 = 10억 × (r + 1%), 합계 = 5000만.
 */
const W = 360;
const H = 180;
const LEFT = 42;
const RIGHT = 16;
const TOP = 12;
const BOTTOM = 148;
const R_MIN = 2;
const R_MAX = 6;
const Y_MAX = 8000;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const GRAY = "#64748b";

const xOf = (rate: number) => LEFT + ((rate - R_MIN) / (R_MAX - R_MIN)) * (W - LEFT - RIGHT);
const yOf = (won: number) => BOTTOM - (won / Y_MAX) * (BOTTOM - TOP);

interface Scene {
  label: string;
  summary: string;
  note: string;
  rate: number;
  spread: number;
  gaveUp: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "기준금리 6%", summary: "6000만 − 2000만 = 4000만", rate: 6, spread: 0, gaveUp: false, note: "처음 사례는 은행에 6000만 원을 내고 스왑에서 2000만 원을 순수취합니다. 원금·기준금리·기간이 같다는 조건이 깨지면 합계가 달라집니다." },
  { label: "기준금리 2%", summary: "2000만 + 2000만 = 4000만", rate: 2, spread: 0, gaveUp: false, note: "은행 이자는 2000만 원으로 줄지만 이번에는 스왑 상대에게 4000만−2000만=2000만 원을 냅니다. 합계는 다시 4000만 원입니다." },
  { label: "막은 것과 포기한 것", summary: "오르면 막고, 내려도 그대로", rate: 2, spread: 0, gaveUp: true, note: "두 선 사이가 스왑의 효과입니다. 6%에서는 2000만 원을 덜 내지만 2%에서는 2000만 원을 더 냅니다. 금리 상승을 막는 대가로 금리 하락의 이득도 포기합니다." },
  { label: "가산금리 1%가 있으면", summary: "7000만 − 2000만 = 5000만", rate: 6, spread: 1, gaveUp: false, note: "가산금리는 회사 신용에 붙은 추가 이율입니다. 첫 기간 은행에 7000만 원을 내고 스왑에서 2000만 원을 받아 순지출은 5000만 원입니다. 스왑이 이 비용까지 지워 주지는 않습니다." },
];

export default function FixedTotalViz() {
  return (
    <SceneShell
      eyebrow="금리가 움직일 때"
      title="은행 이자는 금리를 따라 움직여도 합친 부담은 평평합니다"
      description="(가정) 대출 10억 원, 고정 4%이고 금액은 1년 치입니다. 6%와 2% 사이의 선은 같은 계산을 다른 금리에 대입한 것입니다."
      ariaLabel="기준금리에 따른 은행 이자와 스왑을 합친 부담의 그래프"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const bankAt = (rate: number) => (rate + s.spread) * 1000;
        const total = 4000 + s.spread * 1000;
        const bank = bankAt(s.rate);
        const swapNet = 4000 - s.rate * 1000;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              {[0, 2000, 4000, 6000, 8000].map((won) => (
                <g key={won}>
                  <line x1={LEFT} x2={W - RIGHT} y1={yOf(won)} y2={yOf(won)} stroke={GRAY} strokeWidth={1} opacity={won === 0 ? 1 : 0.2} />
                  <text x={LEFT - 6} y={yOf(won) + 4} textAnchor="end" fontSize={10} fill={GRAY}>
                    {won === 0 ? "0" : `${won / 1000}천만`}
                  </text>
                </g>
              ))}
              {[2, 3, 4, 5, 6].map((rate) => (
                <text key={rate} x={xOf(rate)} y={BOTTOM + 15} textAnchor="middle" fontSize={10} fill={GRAY}>
                  {rate}%
                </text>
              ))}
              <text x={(LEFT + W - RIGHT) / 2} y={H - 2} textAnchor="middle" fontSize={10} fill={GRAY}>
                기준금리
              </text>
              {s.gaveUp && (
                <>
                  <polygon points={`${xOf(2)},${yOf(2000)} ${xOf(4)},${yOf(4000)} ${xOf(2)},${yOf(4000)}`} fill={AMBER} opacity={0.2} />
                  <polygon points={`${xOf(4)},${yOf(4000)} ${xOf(6)},${yOf(6000)} ${xOf(6)},${yOf(4000)}`} fill={GREEN} opacity={0.2} />
                  <text x={xOf(2.1)} y={yOf(4000) - 6} fontSize={10.5} fontWeight={700} fill={AMBER}>
                    포기한 이득
                  </text>
                  <text x={xOf(5.95)} y={yOf(4000) + 15} textAnchor="end" fontSize={10.5} fontWeight={700} fill={GREEN}>
                    막은 상승
                  </text>
                </>
              )}
              <line x1={xOf(2)} y1={yOf(bankAt(2))} x2={xOf(6)} y2={yOf(bankAt(6))} stroke={BLUE} strokeWidth={1.25} />
              <line x1={xOf(2)} y1={yOf(total)} x2={xOf(6)} y2={yOf(total)} stroke={AMBER} strokeWidth={1.25} />
              <line x1={xOf(s.rate)} x2={xOf(s.rate)} y1={TOP} y2={BOTTOM} stroke={GRAY} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={xOf(s.rate)} cy={yOf(bank)} r={4} fill={BLUE} />
              <circle cx={xOf(s.rate)} cy={yOf(total)} r={4} fill={AMBER} />
            </svg>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-[#2563eb]" /> 은행 이자 (기운 선)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-[#d97706]" /> 스왑까지 합친 순지출 (평평한 선)
              </li>
            </ul>
            <dl className="mt-2 grid grid-cols-3 gap-1 text-xs">
              <div className="rounded-sm border border-border bg-background px-2 py-1.5">
                <dt className="text-[11px] text-muted-foreground">은행에 냄</dt>
                <dd className="font-mono font-bold text-[#2563eb]">{bank}만</dd>
              </div>
              <div className="rounded-sm border border-border bg-background px-2 py-1.5">
                <dt className="text-[11px] text-muted-foreground">스왑</dt>
                <dd className="font-mono font-bold">{swapNet < 0 ? `${-swapNet}만 받음` : `${swapNet}만 냄`}</dd>
              </div>
              <div className="rounded-sm border border-border bg-background px-2 py-1.5">
                <dt className="text-[11px] text-muted-foreground">합계</dt>
                <dd className="font-mono font-bold text-[#d97706]">{total}만</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
