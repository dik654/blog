export default function GasEfficiencyViz() {
  const reasons = [
    {
      title: '1. 단일 컨트랙트',
      desc: '계정 상태 조회 단순화',
      detail: 'storage slot 통합 · cross-contract call 제거',
      color: '#3b82f6',
      saving: '~30%',
    },
    {
      title: '2. Packed Storage',
      desc: '여러 변수 하나의 slot',
      detail: 'userBasic: principal + assetsIn + baseTrackingIndex',
      color: '#10b981',
      saving: '~20%',
    },
    {
      title: '3. 최적화된 수학',
      desc: '필요한 계산만 수행',
      detail: 'presentValue/principalValue 함수로 단순화',
      color: '#f59e0b',
      saving: '~15%',
    },
    {
      title: '4. Fallback 제거',
      desc: '복잡한 분기 로직 제거',
      detail: 'V2의 다중 자산 routing 코드 제거',
      color: '#8b5cf6',
      saving: '~10%',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Gas 효율성 — 4가지 절감 원인</text>

        {/* 연산별 가스 비교 바 */}
        <text x={260} y={46} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">연산별 가스 비용 (V2 vs V3)</text>

        {[
          { op: 'supply', v2: 150, v3: 100 },
          { op: 'borrow', v2: 250, v3: 150 },
          { op: 'repay', v2: 150, v3: 100 },
          { op: 'liquidate', v2: 300, v3: 200 },
        ].map((row, i) => {
          const y = 58 + i * 32;
          return (
            <g key={i}>
              <text x={56} y={y + 15} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">
                {row.op}
              </text>
              <rect x={64} y={y + 4} width={(row.v2 / 320) * 240} height={11} rx={2}
                fill="#ef4444" fillOpacity={0.4} stroke="#ef4444" strokeWidth={0.6} />
              <text x={64 + (row.v2 / 320) * 240 + 4} y={y + 13} fontSize={9} fontWeight={700} fill="#ef4444">
                V2 {row.v2}K
              </text>
              <rect x={64} y={y + 18} width={(row.v3 / 320) * 240} height={11} rx={2}
                fill="#10b981" fillOpacity={0.4} stroke="#10b981" strokeWidth={0.6} />
              <text x={64 + (row.v3 / 320) * 240 + 4} y={y + 27} fontSize={9} fontWeight={700} fill="#10b981">
                V3 {row.v3}K
              </text>
              <rect x={380} y={y + 8} width={48} height={18} rx={4}
                fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={0.6} />
              <text x={404} y={y + 21} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                -{Math.round(((row.v2 - row.v3) / row.v2) * 100)}%
              </text>
            </g>
          );
        })}

        {/* 4가지 절감 원인 */}
        <text x={260} y={204} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">절감 원인 분해</text>

        {reasons.map((r, i) => {
          const x = 20 + (i % 2) * 250;
          const y = 218 + Math.floor(i / 2) * 78;
          return (
            <g key={i}>
              <rect x={x} y={y} width={238} height={68} rx={6}
                fill={r.color} fillOpacity={0.08} stroke={r.color} strokeWidth={0.8} />
              <rect x={x + 190} y={y + 8} width={40} height={18} rx={4}
                fill={r.color} fillOpacity={0.2} stroke={r.color} strokeWidth={0.6} />
              <text x={x + 210} y={y + 21} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.color}>
                {r.saving}
              </text>
              <text x={x + 14} y={y + 21} fontSize={11} fontWeight={700} fill={r.color}>{r.title}</text>
              <text x={x + 14} y={y + 38} fontSize={10} fontWeight={600} fill="var(--foreground)">{r.desc}</text>
              <text x={x + 14} y={y + 55} fontSize={9} fill="var(--muted-foreground)">{r.detail}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
