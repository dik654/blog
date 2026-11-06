/**
 * 본문 대응: #case·#need·#mechanism — 자산, 빚, 자기 몫, 대출 한도를 같은 축에 올린다.
 * 위 줄 = 자산을 한도와 남겨 둔 여유로 나눔. 아래 줄 = 같은 자산을 빚과 자기 몫으로 나눔.
 * 빚이 한도선을 넘은 부분이 부족액이다.
 */
const X0 = 62;
const UNIT = 2.9; // 1억 원 = 2.9 단위, 100억 원까지 그린다
const ROW_H = 30;
const ROW1_Y = 28;
const ROW2_Y = 72;

const round2 = (value: number) => Math.round(value * 100) / 100;
const fmt = (value: number) => String(round2(value));
const px = (value: number) => X0 + value * UNIT;

function Segment({ from, to, y, fill, text, name }: { from: number; to: number; y: number; fill: string; text: string; name: string }) {
  const width = (to - from) * UNIT;
  if (width <= 0) return null;
  const value = fmt(to - from);
  return (
    <g>
      <rect x={px(from)} y={y} width={width} height={ROW_H} fill={fill} />
      <text x={px(from) + width / 2} y={y + 19.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={text}>
        {width >= name.length * 11 + value.length * 7 + 8 ? `${name} ${value}` : value}
      </text>
    </g>
  );
}

function Stat({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-border/70 px-0.5 py-1 text-center">
      <span className="block text-[11px] leading-4 text-muted-foreground">{label}</span>
      <span className={`block whitespace-nowrap font-mono text-xs font-bold sm:text-sm ${alert ? "text-red-700 dark:text-red-400" : ""}`}>{value}</span>
    </div>
  );
}

export default function LedgerBars({
  asset,
  debt,
  ratio,
  showLimit = true,
  ghostAsset,
}: {
  asset: number;
  debt: number;
  ratio: number;
  showLimit?: boolean;
  /** 조치 전 자산 크기를 점선으로 남긴다. */
  ghostAsset?: number;
}) {
  const limit = round2(asset * ratio);
  const covered = showLimit ? Math.min(debt, limit) : debt;
  const short = showLimit ? round2(Math.max(debt - limit, 0)) : 0;
  const limitX = Math.min(px(limit), 300);
  return (
    <div className="min-w-0">
      <svg viewBox="0 0 360 136" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`자산 ${fmt(asset)}억 원, 빚 ${fmt(debt)}억 원, 자기 몫 ${fmt(asset - debt)}억 원${showLimit ? `, 한도 ${fmt(limit)}억 원, 부족 ${fmt(short)}억 원` : ""}`}>
        <text x={0} y={ROW1_Y + 19.5} fontSize={11} fontWeight={700} fill="#64748b">자산</text>
        <text x={0} y={ROW2_Y + 12} fontSize={11} fontWeight={700} fill="#64748b">빚과</text>
        <text x={0} y={ROW2_Y + 26} fontSize={11} fontWeight={700} fill="#64748b">자기 몫</text>
        {showLimit ? (
          <>
            <Segment from={0} to={limit} y={ROW1_Y} fill="#475569" text="#ffffff" name="빌려주는 몫" />
            <Segment from={limit} to={asset} y={ROW1_Y} fill="#cbd5e1" text="#334155" name="여유" />
          </>
        ) : (
          <Segment from={0} to={asset} y={ROW1_Y} fill="#475569" text="#ffffff" name="자산" />
        )}
        <Segment from={0} to={covered} y={ROW2_Y} fill="#b45309" text="#ffffff" name={short > 0 ? "한도 안 빚" : "빚"} />
        <Segment from={covered} to={covered + short} y={ROW2_Y} fill="#dc2626" text="#ffffff" name="부족" />
        <Segment from={debt} to={asset} y={ROW2_Y} fill="#15803d" text="#ffffff" name="자기 몫" />
        {ghostAsset !== undefined && (
          <>
            <rect x={px(0)} y={ROW1_Y} width={ghostAsset * UNIT} height={ROW_H} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <rect x={px(0)} y={ROW2_Y} width={ghostAsset * UNIT} height={ROW_H} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
          </>
        )}
        {showLimit && (
          <>
            <line x1={px(limit)} x2={px(limit)} y1={16} y2={ROW2_Y + ROW_H + 6} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={limitX} y={11} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{`한도 ${fmt(limit)} = 자산의 ${Math.round(ratio * 100)}%`}</text>
          </>
        )}
        <line x1={X0} x2={px(100)} y1={ROW2_Y + ROW_H + 12} y2={ROW2_Y + ROW_H + 12} stroke="#94a3b8" strokeWidth={1} />
        {[0, 50, 100].map((tick) => (
          <text key={tick} x={px(tick)} y={ROW2_Y + ROW_H + 26} textAnchor={tick === 100 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick === 100 ? "100억" : tick}</text>
        ))}
      </svg>
      <div className="mx-auto mt-2 grid max-w-[560px] grid-cols-5 gap-1.5">
        <Stat label="자산" value={fmt(asset)} />
        <Stat label="빚" value={fmt(debt)} />
        <Stat label="자기 몫" value={fmt(asset - debt)} />
        <Stat label="한도" value={showLimit ? fmt(limit) : "−"} />
        <Stat label="부족" value={showLimit ? fmt(short) : "−"} alert={short > 0} />
      </div>
    </div>
  );
}
