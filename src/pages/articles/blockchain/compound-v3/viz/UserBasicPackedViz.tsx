export default function UserBasicPackedViz() {
  const fields = [
    { label: 'principal', bytes: 13, type: 'int104', color: '#3b82f6', desc: 'base 잔액 (signed)' },
    { label: 'baseTrackingIndex', bytes: 8, type: 'uint64', color: '#8b5cf6', desc: '보상 index' },
    { label: 'baseTrackingAccrued', bytes: 8, type: 'uint64', color: '#f59e0b', desc: '누적 보상' },
    { label: 'assetsIn', bytes: 2, type: 'uint16', color: '#10b981', desc: '담보 bitmap' },
    { label: '_reserved', bytes: 1, type: 'uint8', color: '#6b7280', desc: '예약' },
  ];

  const totalWidth = 460;
  const totalBytes = 32;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">UserBasic — 32 byte packed storage (1 SLOAD)</text>

        {/* Storage Slot 시각화 */}
        <text x={260} y={50} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">1 Storage Slot = 32 bytes = 256 bits</text>

        <g transform="translate(30, 62)">
          {(() => {
            let offset = 0;
            return fields.map((f) => {
              const x = (offset / totalBytes) * totalWidth;
              const w = (f.bytes / totalBytes) * totalWidth;
              offset += f.bytes;
              return (
                <g key={f.label}>
                  <rect x={x} y={0} width={w} height={60} rx={4}
                    fill={f.color} fillOpacity={0.25} stroke={f.color} strokeWidth={1} />
                  <text x={x + w / 2} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={f.color}>
                    {f.bytes}B
                  </text>
                  <text x={x + w / 2} y={36} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
                    {f.type}
                  </text>
                  {f.bytes >= 8 && (
                    <text x={x + w / 2} y={50} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                      {f.label.length > 10 ? f.label.slice(0, 10) + '…' : f.label}
                    </text>
                  )}
                </g>
              );
            });
          })()}
          <rect x={0} y={0} width={totalWidth} height={60} rx={4}
            fill="transparent" stroke="var(--border)" strokeWidth={1} />

          {/* 바이트 표시 (0, 8, 16, 24, 32) */}
          {[0, 8, 16, 24, 32].map(b => (
            <g key={b}>
              <line x1={(b / totalBytes) * totalWidth} y1={64} x2={(b / totalBytes) * totalWidth} y2={68}
                stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={(b / totalBytes) * totalWidth} y={80} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{b}B</text>
            </g>
          ))}
        </g>

        {/* 필드 상세 설명 */}
        <text x={260} y={166} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">필드 상세</text>

        {fields.map((f, i) => {
          const y = 180 + i * 26;
          return (
            <g key={i}>
              <rect x={20} y={y} width={480} height={22} rx={4}
                fill={f.color} fillOpacity={0.08} stroke={f.color} strokeWidth={0.4} />
              <rect x={20} y={y} width={5} height={22} fill={f.color} rx={2} />
              <text x={38} y={y + 15} fontSize={10} fontWeight={700} fill={f.color}>{f.label}</text>
              <text x={200} y={y + 15} fontSize={9} fill="var(--muted-foreground)">{f.type} · {f.bytes}B</text>
              <text x={320} y={y + 15} fontSize={9} fill="var(--muted-foreground)">{f.desc}</text>
              <text x={494} y={y + 15} textAnchor="end" fontSize={9} fontWeight={700} fill="var(--foreground)">
                {Math.round((f.bytes / totalBytes) * 100)}%
              </text>
            </g>
          );
        })}

        {/* Gas 절감 */}
        <rect x={20} y={316} width={480} height={20} rx={4}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.6} />
        <text x={260} y={331} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          1 SLOAD (2,100 cold / 100 warm) · 전체 사용자 상태 1회 조회
        </text>
      </svg>
    </div>
  );
}
