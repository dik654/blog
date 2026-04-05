export default function MevLiquidationViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">청산 Bot 경쟁 — MEV 관점</text>

        <defs>
          <marker id="mv-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 5단계 bot 실행 흐름 */}
        <text x={260} y={46} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">청산 Bot 실행 파이프라인</text>

        {[
          { n: 1, label: '멤풀 모니터링', desc: '가격 변동·오라클 업데이트 감지', color: '#3b82f6' },
          { n: 2, label: 'HF < 1 스캔', desc: '전체 user 포지션 off-chain 조회', color: '#f59e0b' },
          { n: 3, label: '청산 기회 포착', desc: '수익성 계산 (bonus - gas)', color: '#8b5cf6' },
          { n: 4, label: '청산 tx 전송', desc: 'Flashbots · gas war · priority fee', color: '#ef4444' },
          { n: 5, label: 'DEX 즉시 매도', desc: '담보 → USDC (flash swap 활용)', color: '#10b981' },
        ].map((s, i) => {
          const y = 60 + i * 46;
          return (
            <g key={s.n}>
              <circle cx={44} cy={y + 18} r={14} fill={s.color} />
              <text x={44} y={y + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">
                {s.n}
              </text>
              <rect x={72} y={y} width={428} height={36} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.6} />
              <text x={86} y={y + 16} fontSize={11} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={86} y={y + 30} fontSize={9} fill="var(--muted-foreground)">
                {s.desc}
              </text>
              {i < 4 && (
                <line x1={44} y1={y + 32} x2={44} y2={y + 46}
                  stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#mv-arr)" />
              )}
            </g>
          );
        })}

        {/* 경쟁 현실 */}
        <text x={260} y={310} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">경쟁 현실</text>

        {[
          { x: 20, label: '평균 수익', value: '0.5-2%', desc: '대부분 gas+MEV', color: '#ef4444' },
          { x: 180, label: 'Top operators', value: 'Top 10', desc: '수익 80% 독점', color: '#f59e0b' },
          { x: 340, label: 'Flash loan', value: '자본 0', desc: '대형 청산 가능', color: '#10b981' },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y={322} width={160} height={50} rx={6}
              fill={item.color} fillOpacity={0.08} stroke={item.color} strokeWidth={0.6} />
            <text x={item.x + 12} y={340} fontSize={10} fontWeight={700} fill={item.color}>
              {item.label}
            </text>
            <text x={item.x + 148} y={340} textAnchor="end" fontSize={12} fontWeight={700} fill="var(--foreground)">
              {item.value}
            </text>
            <text x={item.x + 12} y={358} fontSize={9} fill="var(--muted-foreground)">
              {item.desc}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
