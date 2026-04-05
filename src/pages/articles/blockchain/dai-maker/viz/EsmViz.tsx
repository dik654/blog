export default function EsmViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Emergency Shutdown Module (ESM) — 최후 장치</text>

        <defs>
          <marker id="esm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* Trigger 조건 */}
        <rect x={20} y={40} width={480} height={76} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={260} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          Trigger 조건 — 극한 상황
        </text>
        {[
          { x: 40, label: 'Oracle 동작 불가', icon: '⚠' },
          { x: 200, label: '거버넌스 공격', icon: '⚡' },
          { x: 360, label: '해킹/버그 탐지', icon: '💥' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={72} width={140} height={36} rx={4}
              fill="var(--card)" stroke="#ef4444" strokeWidth={0.6} />
            <text x={t.x + 70} y={94} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
              {t.label}
            </text>
          </g>
        ))}

        {/* 실행 단계 */}
        <text x={260} y={140} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">4단계 실행 (MKR 보유자 50K MKR 예치)</text>

        {[
          { n: 1, label: 'ESM.fire()', desc: 'MKR 50K 예치 → 호출', color: '#ef4444' },
          { n: 2, label: 'Vault 중단', desc: '모든 Vault frob() 차단', color: '#f59e0b' },
          { n: 3, label: '담보 가치 고정', desc: '마지막 Oracle 가격 사용', color: '#8b5cf6' },
          { n: 4, label: 'Pro-rata 환급', desc: 'DAI 보유자에게 담보 분배', color: '#10b981' },
        ].map((s, i) => {
          const x = 20 + i * 120;
          return (
            <g key={s.n}>
              <rect x={x} y={152} width={115} height={68} rx={6}
                fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={0.8} />
              <circle cx={x + 18} cy={172} r={11} fill={s.color} />
              <text x={x + 18} y={177} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">{s.n}</text>
              <text x={x + 35} y={176} fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={x + 8} y={196} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>

              {i < 3 && (
                <line x1={x + 115} y1={186} x2={x + 120} y2={186}
                  stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#esm-arr)" />
              )}
            </g>
          );
        })}

        {/* Pro-rata 환급 예시 */}
        <rect x={20} y={236} width={480} height={106} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={254} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Pro-rata 환급 예시</text>

        {/* 시스템 상태 */}
        <rect x={36} y={266} width={212} height={60} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={46} y={282} fontSize={10} fontWeight={700} fill="var(--foreground)">시스템 상태</text>
        <text x={46} y={298} fontSize={10} fill="var(--muted-foreground)">Total DAI:</text>
        <text x={238} y={298} textAnchor="end" fontSize={10} fontWeight={700} fill="#f59e0b">5B DAI</text>
        <text x={46} y={314} fontSize={10} fill="var(--muted-foreground)">Total collateral:</text>
        <text x={238} y={314} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">$8B</text>

        {/* 개별 환급 */}
        <rect x={272} y={266} width={212} height={60} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={282} y={282} fontSize={10} fontWeight={700} fill="var(--foreground)">User A 환급</text>
        <text x={282} y={298} fontSize={10} fill="var(--muted-foreground)">보유: 1,000 DAI</text>
        <text x={282} y={314} fontSize={10} fontWeight={700} fill="#10b981">1,000 × (8/5) = $1,600</text>

        <text x={260} y={362} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">단 한 번도 실행된 적 없음 — "최후 보루"로만 존재</text>
      </svg>
    </div>
  );
}
