export default function PoolKeyViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">PoolKey — 풀 고유 식별자 (5개 필드)</text>

        {/* PoolKey struct */}
        <rect x={80} y={48} width={360} height={190} rx={8}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={1.5} />
        <rect x={80} y={48} width={360} height={30} rx={8}
          fill="#3b82f6" fillOpacity={0.15} />
        <rect x={80} y={68} width={360} height={10}
          fill="#3b82f6" fillOpacity={0.15} />
        <text x={260} y={68} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">
          struct PoolKey
        </text>

        {[
          { label: 'Currency currency0', value: 'token0 address', color: '#10b981' },
          { label: 'Currency currency1', value: 'token1 address', color: '#10b981' },
          { label: 'uint24 fee', value: '수수료 tier (0-1M)', color: '#f59e0b' },
          { label: 'int24 tickSpacing', value: '자유 설정 가능', color: '#8b5cf6' },
          { label: 'IHooks hooks', value: 'hook 컨트랙트 (옵션)', color: '#ec4899' },
        ].map((f, i) => {
          const y = 96 + i * 28;
          return (
            <g key={i}>
              <rect x={94} y={y} width={10} height={10} rx={2} fill={f.color} />
              <text x={112} y={y + 9} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {f.label}
              </text>
              <text x={426} y={y + 9} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
                {f.value}
              </text>
            </g>
          );
        })}

        {/* PoolId 생성 */}
        <rect x={20} y={254} width={480} height={52} rx={8}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={260} y={274} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          PoolId = keccak256(abi.encode(poolKey))
        </text>
        <text x={260} y={293} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          5 필드 조합 → 32바이트 해시 → 풀 mapping의 키
        </text>
      </svg>
    </div>
  );
}
