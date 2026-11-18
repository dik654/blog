import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째 문단 — 같은 평균 부도율이라도 함께 부도나는 정도가 커지면 구간별 위험이 달라진다(4·9절).
 * 설명용 가정: 똑같이 일어날 법한 세계 10개, 두 경우 모두 평균 누적손실 400만 원(1억 원의 4%).
 * 따로 부도: 10개 세계 모두 400만. 함께 부도: 9개 세계 0, 1개 세계 4,000만.
 * 구간 기대손실(세계 평균): 따로 = 0~3% 300만, 3~7% 100만, 7% 위 0 / 함께 = 30만, 40만, 330만.
 */
const TRANCHES = [
  { name: "0~3%", start: 0, size: 300, color: "#dc2626" },
  { name: "3~7%", start: 300, size: 400, color: "#d97706" },
  { name: "7% 위", start: 700, size: 9300, color: "#2563eb" },
] as const;

const SPREAD: readonly number[] = Array.from({ length: 10 }, () => 400);
const TOGETHER: readonly number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 4000];

const takenBy = (loss: number, start: number, size: number) => Math.min(Math.max(loss - start, 0), size);
const expected = (worlds: readonly number[]) =>
  TRANCHES.map((tranche) => worlds.reduce<number>((sum, loss) => sum + takenBy(loss, tranche.start, tranche.size), 0) / worlds.length);
const mean = (worlds: readonly number[]) => worlds.reduce<number>((sum, loss) => sum + loss, 0) / worlds.length;

const EXP_SPREAD = expected(SPREAD);
const EXP_TOGETHER = expected(TOGETHER);

const SCENES = [
  { label: "따로 부도나는 경우(가정)", summary: `10개 세계 모두 ${SPREAD[0]}만 원`, note: "세계 하나는 앞으로 일어날 수 있는 한 가지 결과입니다. 함께 부도나는 정도가 낮은 쪽을 단순화해, 모든 세계의 누적손실을 평균과 같은 400만 원으로 뒀습니다. 손실은 어느 세계에서든 0~3% 구간을 다 쓰고 3~7% 구간에서 멈춥니다." },
  { label: "함께 부도나는 경우(가정)", summary: `평균은 같은 ${mean(TOGETHER)}만 원`, note: "같은 경기·금리·원자재 충격을 함께 받는 쪽을 단순화했습니다. 9개 세계는 손실이 0이고, 1개 세계에서 여러 기업이 한꺼번에 무너져 4,000만 원을 잃습니다. 평균은 여전히 400만 원이지만 이번에는 7% 위 구간까지 손실이 닿습니다." },
  { label: "구간별 기대손실", summary: "7% 위 구간: 0 → 330만 원", note: "기대손실은 10개 세계의 구간 손실을 평균한 값입니다. 이 가정 숫자에서는 평균 손실이 같아도 7% 위 구간이 0에서 330만 원으로, 0~3% 구간이 300만 원에서 30만 원으로 바뀝니다. 4절의 “함께 부도나는 정도가 커지면 선순위 구간의 위험이 달라집니다”를 이 가정 숫자로 본 것입니다." },
] as const;

const W = 360;
const H = 190;
const LEFT = 44;
const RIGHT = 8;
const BASE = 166;
const TOP = 26;
const MAX = 4000;
const y = (amount: number) => BASE - (amount / MAX) * (BASE - TOP);
const SLOT = (W - LEFT - RIGHT) / 10;
const BAR_W = SLOT * 0.62;

function Worlds({ worlds, label }: { worlds: readonly number[]; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={label}>
      {[0, 300, 700, 4000].map((tick) => (
        <g key={tick}>
          <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} strokeDasharray={tick === 300 || tick === 700 ? "3 3" : undefined} strokeOpacity={tick === MAX ? 0.35 : 1} />
          {(tick === 0 || tick === MAX) && (
            <text x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">
              {tick === 0 ? "0" : "4,000만"}
            </text>
          )}
        </g>
      ))}
      <text x={LEFT - 6} y={y(700) - 3} textAnchor="end" fontSize={9} fill="#64748b">700만</text>
      {worlds.map((loss, index) => {
        const x = LEFT + index * SLOT + (SLOT - BAR_W) / 2;
        return (
          <g key={index}>
            {TRANCHES.map((tranche) => {
              const taken = takenBy(loss, tranche.start, tranche.size);
              if (taken <= 0) return null;
              return <rect key={tranche.name} x={x} y={y(tranche.start + taken)} width={BAR_W} height={y(tranche.start) - y(tranche.start + taken)} fill={tranche.color} opacity={0.8} />;
            })}
            <text x={x + BAR_W / 2} y={BASE + 14} textAnchor="middle" fontSize={9} fill="#64748b">{index + 1}</text>
          </g>
        );
      })}
      <text x={LEFT} y={12} textAnchor="start" fontSize={10} fill="#64748b">세계별 누적손실(원)</text>
    </svg>
  );
}

function ExpectedBars() {
  const scale = Math.max(...EXP_SPREAD, ...EXP_TOGETHER);
  return (
    <div className="space-y-3 py-2 text-xs sm:text-sm">
      {TRANCHES.map((tranche, index) => (
        <div key={tranche.name} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-bold" style={{ color: tranche.color }}>{tranche.name}</span>
          <div className="space-y-1">
            {[
              { tag: "따로", value: EXP_SPREAD[index] },
              { tag: "함께", value: EXP_TOGETHER[index] },
            ].map((row) => (
              <div key={row.tag} className="grid grid-cols-[2.25rem_minmax(0,1fr)_3.75rem] items-center gap-2">
                <span className="text-muted-foreground">{row.tag}</span>
                <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
                  <div className="h-full rounded-sm" style={{ width: `${(row.value / scale) * 100}%`, backgroundColor: tranche.color, opacity: row.tag === "따로" ? 0.5 : 0.9 }} />
                </div>
                <span className="text-right font-mono">{row.value}만</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CorrelationTrancheViz() {
  return (
    <SceneShell
      eyebrow="공동부도"
      title="평균 손실이 같아도 함께 부도나면 구간별 손실이 달라집니다"
      description="1억 원 지수가 맞을 수 있는 결과를 똑같이 일어날 법한 세계 10개로 단순화했습니다(가정). 막대 색은 그 손실을 받는 구간이며 빨강 0~3%, 주황 3~7%, 파랑 7% 위입니다. 점선은 300만·700만 원 경계입니다."
      ariaLabel="같은 평균 손실 400만 원에서 따로 부도와 함께 부도의 구간별 기대손실 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <Worlds key="spread" worlds={SPREAD} label="10개 세계 모두 누적손실 400만 원" />,
            <Worlds key="together" worlds={TOGETHER} label="9개 세계 0원, 1개 세계 4,000만 원" />,
            <ExpectedBars key="expected" />,
          ]}
        />
      )}
    />
  );
}
