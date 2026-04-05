export default function CometPackedViz() {
  // UserBasic 32-byte packed layout
  const fields = [
    { label: 'principal', bytes: 13, color: '#3b82f6', desc: 'int104 (supply/borrow)' },
    { label: 'trackingIdx', bytes: 8, color: '#10b981', desc: 'uint64' },
    { label: 'trackingAcc', bytes: 8, color: '#8b5cf6', desc: 'uint64' },
    { label: 'assetsIn', bytes: 2, color: '#f59e0b', desc: 'uint16 bitmap' },
    { label: '_res', bytes: 1, color: '#6b7280', desc: 'uint8' },
  ];

  const totalBytes = 32;
  const barWidth = 400;
  const startX = 40;

  let currentX = startX;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">UserBasic — Packed Storage (1 slot = 32 bytes)</text>

        {/* 전체 slot 바 */}
        <rect x={startX} y={50} width={barWidth} height={40} rx={4}
          fill="var(--muted)" opacity={0.2} stroke="var(--border)" strokeWidth={0.5} />

        {/* 각 필드 */}
        {fields.map((field, i) => {
          const width = (field.bytes / totalBytes) * barWidth;
          const x = currentX;
          currentX += width;
          return (
            <g key={field.label}>
              <rect x={x} y={50} width={width} height={40}
                fill={field.color} fillOpacity={0.4} stroke={field.color} strokeWidth={0.8} />
              <text x={x + width / 2} y={68} textAnchor="middle" fontSize={8}
                fontWeight={700} fill="var(--foreground)">{field.label}</text>
              <text x={x + width / 2} y={80} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">{field.bytes}B</text>

              {/* 상세 설명 */}
              <text x={x + width / 2} y={107} textAnchor="middle" fontSize={6.5}
                fill={field.color} fontWeight={600}>{field.desc}</text>
            </g>
          );
        })}

        {/* 눈금 */}
        <text x={startX} y={45} fontSize={7} fill="var(--muted-foreground)">0</text>
        <text x={startX + barWidth} y={45} textAnchor="end" fontSize={7}
          fill="var(--muted-foreground)">256 bits</text>

        {/* 가스 효율 */}
        <rect x={60} y={130} width={360} height={60} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">1 SLOAD = 전체 사용자 상태 조회</text>
        <text x={240} y={166} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Cold: 2,100 gas · Warm: 100 gas</text>
        <text x={240} y={180} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">V3 대비 33-40% 가스 절감</text>
      </svg>
    </div>
  );
}
