export default function MainContractsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 460" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">주요 컨트랙트 — Pool + Token + Oracle + Strategy</text>

        <defs>
          <marker id="mc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>

        {/* Pool.sol — 중앙 허브 */}
        <rect x={160} y={42} width={200} height={194} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1.5} />
        <rect x={160} y={42} width={200} height={30} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} />
        <rect x={160} y={62} width={200} height={10}
          fill="#8b5cf6" fillOpacity={0.15} />
        <text x={260} y={62} textAnchor="middle" fontSize={13} fontWeight={700} fill="#8b5cf6">
          Pool.sol
        </text>

        <text x={260} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
          메인 진입점
        </text>

        {/* Pool.sol 함수 리스트 — 충분한 간격 */}
        {[
          { y: 102, fn: 'supply()' },
          { y: 122, fn: 'withdraw()' },
          { y: 142, fn: 'borrow()' },
          { y: 162, fn: 'repay()' },
          { y: 182, fn: 'liquidationCall()' },
          { y: 202, fn: 'flashLoan()' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={172} y={f.y - 12} width={176} height={16} rx={3}
              fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={0.4} />
            <text x={182} y={f.y} fontSize={10} fontWeight={600} fill="var(--foreground)">
              ├── {f.fn}
            </text>
          </g>
        ))}

        {/* 토큰 컨트랙트 (왼쪽) */}
        <text x={85} y={276} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Token Contracts
        </text>
        {[
          { y: 286, label: 'AToken.sol', desc: '예치 토큰 (이자 누적)', color: '#10b981' },
          { y: 340, label: 'VariableDebtToken', desc: '변동 이자 부채', color: '#f59e0b' },
          { y: 394, label: 'StableDebtToken', desc: '고정 이자 (폐지 중)', color: '#6b7280' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={20} y={t.y} width={160} height={44} rx={6}
              fill={t.color} fillOpacity={0.08} stroke={t.color} strokeWidth={0.8}
              strokeDasharray={i === 2 ? '3 2' : undefined} />
            <text x={100} y={t.y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={t.color}>
              {t.label}
            </text>
            <text x={100} y={t.y + 34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {t.desc}
            </text>
          </g>
        ))}

        {/* Oracle & Strategy (오른쪽) */}
        <text x={435} y={276} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Oracle &amp; Strategy
        </text>
        {[
          { y: 286, label: 'AaveOracle.sol', desc: 'Chainlink 래퍼', color: '#3b82f6' },
          { y: 340, label: 'InterestRateStrategy', desc: '이자율 계산', color: '#06b6d4' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={340} y={t.y} width={160} height={44} rx={6}
              fill={t.color} fillOpacity={0.08} stroke={t.color} strokeWidth={0.8} />
            <text x={420} y={t.y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={t.color}>
              {t.label}
            </text>
            <text x={420} y={t.y + 34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {t.desc}
            </text>
          </g>
        ))}

        {/* 연결선 — Pool → 각 컨트랙트 */}
        <line x1={160} y1={140} x2={180} y2={308} stroke="#6b7280" strokeWidth={0.8} strokeDasharray="2 2" markerEnd="url(#mc-arr)" />
        <line x1={160} y1={172} x2={180} y2={362} stroke="#6b7280" strokeWidth={0.8} strokeDasharray="2 2" markerEnd="url(#mc-arr)" />
        <line x1={160} y1={192} x2={180} y2={416} stroke="#6b7280" strokeWidth={0.8} strokeDasharray="2 2" markerEnd="url(#mc-arr)" />
        <line x1={360} y1={140} x2={340} y2={308} stroke="#6b7280" strokeWidth={0.8} strokeDasharray="2 2" markerEnd="url(#mc-arr)" />
        <line x1={360} y1={172} x2={340} y2={362} stroke="#6b7280" strokeWidth={0.8} strokeDasharray="2 2" markerEnd="url(#mc-arr)" />

        {/* 하단 설명 */}
        <text x={260} y={452} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Pool은 단일 진입점 · Token/Oracle/Strategy는 모듈화된 컴포넌트
        </text>
      </svg>
    </div>
  );
}
