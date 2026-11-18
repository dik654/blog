/**
 * 인구 1,000명당 출생·사망 막대 세 묶음과 그 차이(자연증가)를 그리는 공용 그림입니다.
 * shown까지의 묶음만 진하게 그리고, 그 뒤 묶음은 빈 자리로 남겨 장면마다 크기가 같습니다.
 */
export interface RateGroup {
  label: string;
  birth: number;
  death: number;
}

const W = 360;
const H = 206;
const BASE_Y = 168;
const TOP_Y = 26;
const MAX = 45;
const CENTERS = [62, 172, 282];
const BAR_W = 26;

const y = (value: number) => BASE_Y - (value / MAX) * (BASE_Y - TOP_Y);
const fmt = (value: number, decimals: number) => value.toFixed(decimals);

export default function RateBars({ groups, shown, decimals = 0, ariaLabel }: { groups: readonly RateGroup[]; shown: number; decimals?: number; ariaLabel: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#2563eb" }} />출생(왼쪽 막대)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#94a3b8" }} />사망(오른쪽 막대)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-0.5" style={{ backgroundColor: "#16a34a" }} />두 막대의 차이 = 자연증가(음수는 빨강 −)</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
        <text x={8} y={TOP_Y - 10} fontSize={10} fill="#64748b">1,000명당 명</text>
        {[0, 15, 30, 45].map((tick) => (
          <g key={tick}>
            <line x1={24} x2={W - 6} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={tick === 0 ? 1 : 0.5} strokeDasharray={tick === 0 ? undefined : "2 4"} opacity={tick === 0 ? 1 : 0.6} />
            <text x={20} y={y(tick) + 3} textAnchor="end" fontSize={9} fill="#64748b">{tick}</text>
          </g>
        ))}
        {groups.map((group, index) => {
          const cx = CENTERS[index];
          const on = index <= shown;
          const current = index === shown;
          const gap = group.birth - group.death;
          const gapColor = gap >= 0 ? "#16a34a" : "#dc2626";
          const bracketX = cx + 37;
          return (
            <g key={group.label}>
              <text x={cx} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fontWeight={current ? 700 : 400} fill={on ? (current ? "#2563eb" : "#64748b") : "#cbd5e1"}>{group.label}</text>
              {on ? (
                <g opacity={current ? 1 : 0.55}>
                  <rect x={cx - 30} y={y(group.birth)} width={BAR_W} height={BASE_Y - y(group.birth)} rx={2} fill="#2563eb" />
                  <rect x={cx + 4} y={y(group.death)} width={BAR_W} height={BASE_Y - y(group.death)} rx={2} fill="#94a3b8" />
                  <text x={cx - 17} y={y(group.birth) - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">{fmt(group.birth, decimals)}</text>
                  <text x={cx + 17} y={y(group.death) - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">{fmt(group.death, decimals)}</text>
                  <line x1={cx - 4} x2={bracketX} y1={y(group.birth)} y2={y(group.birth)} stroke={gapColor} strokeWidth={0.75} strokeDasharray="2 2" />
                  <line x1={cx + 30} x2={bracketX} y1={y(group.death)} y2={y(group.death)} stroke={gapColor} strokeWidth={0.75} strokeDasharray="2 2" />
                  <line x1={bracketX} x2={bracketX} y1={y(group.birth)} y2={y(group.death)} stroke={gapColor} strokeWidth={1.25} />
                  <text x={bracketX + 3} y={(y(group.birth) + y(group.death)) / 2 + 4} fontSize={11} fontWeight={700} fill={gapColor}>{`${gap >= 0 ? "+" : "−"}${fmt(Math.abs(gap), decimals)}`}</text>
                </g>
              ) : (
                <rect x={cx - 30} y={BASE_Y - 24} width={60} height={24} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={0.75} strokeDasharray="3 3" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
