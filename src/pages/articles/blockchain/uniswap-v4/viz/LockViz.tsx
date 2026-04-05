export default function LockViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">unlock() 패턴 — Atomic Operation 진입점</text>

        <defs>
          <marker id="lock-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="lock-arr-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* 1-3 단계 */}
        <rect x={20} y={48} width={110} height={44} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={75} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">1. User</text>
        <text x={75} y={84} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">unlock(data)</text>

        <rect x={150} y={48} width={140} height={44} rx={6}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={220} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">2. PoolManager</text>
        <text x={220} y={84} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">unlock 플래그 ON</text>

        <rect x={310} y={48} width={140} height={44} rx={6}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={380} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">3. callback</text>
        <text x={380} y={84} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">user 컨트랙트</text>

        <line x1={130} y1={70} x2={150} y2={70} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#lock-arr)" />
        <line x1={290} y1={70} x2={310} y2={70} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#lock-arr)" />

        {/* 4. Operations */}
        <rect x={40} y={110} width={440} height={110} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} strokeDasharray="4 3" />
        <text x={260} y={130} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          4. 연속 Operation (delta만 누적)
        </text>

        {[
          { x: 55, label: 'swap()', delta: '-A, +B' },
          { x: 170, label: 'modifyLiq()', delta: '-B, -C' },
          { x: 285, label: 'swap()', delta: '-B, +D' },
          { x: 400, label: '...', delta: '' },
        ].map((op, i) => (
          <g key={i}>
            <rect x={op.x} y={142} width={90} height={40} rx={4}
              fill={i === 3 ? '#6b7280' : '#3b82f6'} fillOpacity={0.1}
              stroke={i === 3 ? '#6b7280' : '#3b82f6'} strokeWidth={0.6} />
            <text x={op.x + 45} y={160} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={i === 3 ? '#6b7280' : '#3b82f6'}>{op.label}</text>
            <text x={op.x + 45} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {op.delta}
            </text>
          </g>
        ))}

        <text x={260} y={204} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">각 op은 currencyDelta[token] 업데이트만</text>
        <text x={260} y={216} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">실제 토큰 이동 없음 (transient storage)</text>

        {/* 5. Settle */}
        <rect x={190} y={240} width={140} height={40} rx={6}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1} />
        <text x={260} y={258} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          5. settle / take
        </text>
        <text x={260} y={273} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          delta 정산 → 실제 transfer
        </text>

        <line x1={260} y1={220} x2={260} y2={240} stroke="#10b981" strokeWidth={1.3} markerEnd="url(#lock-arr)" />

        {/* 6. 검증 */}
        <rect x={20} y={240} width={150} height={40} rx={6}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
        <text x={95} y={258} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          6. 검증
        </text>
        <text x={95} y={273} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          모든 delta == 0?
        </text>

        <line x1={190} y1={260} x2={170} y2={260} stroke="#ef4444" strokeWidth={1.3} markerEnd="url(#lock-arr-red)" />

        <rect x={350} y={240} width={150} height={40} rx={6}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
        <text x={425} y={258} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          delta ≠ 0
        </text>
        <text x={425} y={273} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          CurrencyNotSettled
        </text>

        <line x1={330} y1={260} x2={350} y2={260} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />

        <text x={260} y={304} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">원자적: 모든 delta를 0으로 만들지 못하면 전체 revert</text>
      </svg>
    </div>
  );
}
