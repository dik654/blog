export default function FlashAccountingViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Flash Accounting — 3홉 스왑 비교</text>

        {/* V3 흐름 (왼쪽) */}
        <text x={130} y={52} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#ef4444">V3: 매 swap마다 transfer</text>

        {[
          { label: 'A→B swap', transfer: 'transfer A', gas: '50K' },
          { label: 'B→C swap', transfer: 'transfer B', gas: '50K' },
          { label: 'C→D swap', transfer: 'transfer C', gas: '50K' },
          { label: 'final', transfer: 'transfer D', gas: '50K' },
        ].map((row, i) => {
          const y = 66 + i * 36;
          return (
            <g key={i}>
              <rect x={20} y={y} width={96} height={30} rx={4}
                fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.6} />
              <text x={68} y={y + 19} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
                {row.label}
              </text>
              <rect x={124} y={y} width={112} height={30} rx={4}
                fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.6} />
              <text x={180} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
                {row.transfer}
              </text>
              <text x={180} y={y + 26} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                {row.gas}
              </text>
            </g>
          );
        })}

        <rect x={20} y={214} width={216} height={44} rx={8}
          fill="#ef4444" fillOpacity={0.12} stroke="#ef4444" strokeWidth={1} />
        <text x={128} y={232} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          6개 transfer
        </text>
        <text x={128} y={248} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
          ~260K gas
        </text>

        {/* 구분선 */}
        <line x1={260} y1={44} x2={260} y2={268} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

        {/* V4 흐름 (오른쪽) */}
        <text x={390} y={52} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">V4: delta만 기록, 마지막 정산</text>

        {[
          { label: 'A→B swap', action: 'delta 기록', gas: 'TSTORE 100' },
          { label: 'B→C swap', action: 'delta 기록', gas: 'TSTORE 100' },
          { label: 'C→D swap', action: 'delta 기록', gas: 'TSTORE 100' },
          { label: 'settle', action: 'transfer A,D', gas: '100K' },
        ].map((row, i) => {
          const y = 66 + i * 36;
          return (
            <g key={i}>
              <rect x={280} y={y} width={96} height={30} rx={4}
                fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.6} />
              <text x={328} y={y + 19} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
                {row.label}
              </text>
              <rect x={384} y={y} width={116} height={30} rx={4}
                fill={i < 3 ? "#10b981" : "#f59e0b"} fillOpacity={0.1}
                stroke={i < 3 ? "#10b981" : "#f59e0b"} strokeWidth={0.6} />
              <text x={442} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={700}
                fill={i < 3 ? "#10b981" : "#f59e0b"}>
                {row.action}
              </text>
              <text x={442} y={y + 26} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                {row.gas}
              </text>
            </g>
          );
        })}

        <rect x={280} y={214} width={216} height={44} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1} />
        <text x={388} y={232} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          2개 transfer + 3 TSTORE
        </text>
        <text x={388} y={248} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          ~150K gas
        </text>

        {/* 절감 효과 */}
        <rect x={20} y={278} width={480} height={60} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={260} y={300} textAnchor="middle" fontSize={14} fontWeight={700} fill="#f59e0b">
          Flash Accounting로 42% 가스 절감
        </text>
        <text x={260} y={320} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">중간 토큰(B, C) 이동 없음 — delta만 추적 후 최종 정산</text>
      </svg>
    </div>
  );
}
