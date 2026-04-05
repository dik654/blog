export default function JoinAdapterViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Join 어댑터 — 외부 자산 ↔ Vat 내부 표현</text>

        <defs>
          <marker id="ja-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="ja-arr-back" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* join() 흐름 — 상단 */}
        <text x={22} y={54} fontSize={12} fontWeight={700} fill="#10b981">join() — 담보 예치</text>

        {/* ETH */}
        <rect x={18} y={66} width={92} height={52} rx={6}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={1} />
        <text x={64} y={88} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#3b82f6">ETH</text>
        <text x={64} y={104} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">native 통화</text>

        {/* WETH deposit */}
        <rect x={140} y={66} width={110} height={52} rx={6}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <text x={195} y={88} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#f59e0b">WETH</text>
        <text x={195} y={104} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">deposit() wrap</text>

        {/* ETHJoin */}
        <rect x={280} y={66} width={110} height={52} rx={6}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={335} y={88} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#8b5cf6">ETHJoin</text>
        <text x={335} y={104} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">어댑터</text>

        {/* Vat.gem */}
        <rect x={420} y={66} width={92} height={52} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={466} y={88} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">Vat.gem</text>
        <text x={466} y={104} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">내부 담보</text>

        <line x1={110} y1={92} x2={140} y2={92} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ja-arr)" />
        <line x1={250} y1={92} x2={280} y2={92} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ja-arr)" />
        <line x1={390} y1={92} x2={420} y2={92} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ja-arr)" />

        {/* slip() 라벨 */}
        <rect x={382} y={48} width={46} height={16} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={0.7} />
        <text x={405} y={59} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#8b5cf6">slip()</text>

        {/* exit() 흐름 — 하단 */}
        <text x={22} y={154} fontSize={12} fontWeight={700} fill="#f59e0b">exit() — 담보 회수 (역방향)</text>

        <rect x={420} y={166} width={92} height={52} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={466} y={188} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">Vat.gem</text>
        <text x={466} y={204} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">내부 담보</text>

        <rect x={280} y={166} width={110} height={52} rx={6}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={335} y={188} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#8b5cf6">ETHJoin</text>
        <text x={335} y={204} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">어댑터</text>

        <rect x={140} y={166} width={110} height={52} rx={6}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <text x={195} y={188} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#f59e0b">WETH</text>
        <text x={195} y={204} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">withdraw() unwrap</text>

        <rect x={18} y={166} width={92} height={52} rx={6}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={1} />
        <text x={64} y={188} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#3b82f6">ETH</text>
        <text x={64} y={204} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">User 수령</text>

        <line x1={420} y1={192} x2={390} y2={192} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#ja-arr-back)" />
        <line x1={280} y1={192} x2={250} y2={192} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#ja-arr-back)" />
        <line x1={140} y1={192} x2={110} y2={192} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#ja-arr-back)" />

        <rect x={382} y={148} width={50} height={16} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={0.7} />
        <text x={407} y={159} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#8b5cf6">-slip()</text>

        {/* 어댑터 패턴 설명 — 여러 담보 자산 */}
        <text x={260} y={240} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">담보 자산별 Join 어댑터</text>

        {[
          { name: 'ETHJoin', asset: 'ETH', via: 'WETH wrap', decimals: 18, color: '#3b82f6' },
          { name: 'GemJoin-USDC', asset: 'USDC', via: 'ERC20 transfer', decimals: 6, color: '#06b6d4' },
          { name: 'GemJoin-WBTC', asset: 'WBTC', via: 'decimal 조정', decimals: 8, color: '#f59e0b' },
        ].map((a, i) => {
          const x = 20 + i * 166;
          return (
            <g key={a.name}>
              <rect x={x} y={254} width={158} height={68} rx={6}
                fill={a.color} fillOpacity={0.07} stroke={a.color} strokeWidth={0.8} />
              <text x={x + 79} y={274} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={a.color}>{a.name}</text>
              <text x={x + 79} y={290} textAnchor="middle" fontSize={10}
                fill="var(--foreground)">asset: {a.asset}</text>
              <text x={x + 79} y={304} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">{a.via}</text>
              <text x={x + 79} y={317} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">외부 {a.decimals}d → 내부 18d</text>
            </g>
          );
        })}

        <text x={260} y={348} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">decimals 차이를 Join에서 정규화 (WBTC 8→18, USDC 6→18)</text>
      </svg>
    </div>
  );
}
