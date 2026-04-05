export default function DepthVsWidthViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">같은 함수 표현 — 얕은 광폭 vs 깊은 협폭</text>

        {/* ───── 좌: Shallow Wide ───── */}
        <text x={160} y={56} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
          얕은 광폭: 1 층 × 2ⁿ 뉴런
        </text>

        {/* 입력 */}
        <circle cx={45} cy={165} r={12} fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2} />
        <text x={45} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">x</text>

        {/* 16 은닉 뉴런 */}
        {Array.from({ length: 16 }, (_, i) => {
          const cy = 85 + i * 10;
          return (
            <g key={i}>
              <line x1={57} y1={165} x2={148} y2={cy} stroke="#ef4444" strokeWidth={0.4} opacity={0.5} />
              <circle cx={155} cy={cy} r={4} fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={1} />
              <line x1={162} y1={cy} x2={253} y2={165} stroke="#ef4444" strokeWidth={0.4} opacity={0.5} />
            </g>
          );
        })}

        {/* 출력 */}
        <circle cx={265} cy={165} r={12} fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={2} />
        <text x={265} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">y</text>

        {/* 파라미터 */}
        <rect x={40} y={260} width={230} height={52} rx={7}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1.2} />
        <text x={155} y={280} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">파라미터 수</text>
        <text x={155} y={300} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="var(--foreground)">
          2 × 2ⁿ = O(2ⁿ) 지수
        </text>

        {/* ───── 중앙: VS 구분선 ───── */}
        <line x1={325} y1={80} x2={325} y2={310} stroke="var(--border)" strokeDasharray="5 4" strokeWidth={1.2} />
        <rect x={302} y={170} width={46} height={28} rx={14}
          fill="var(--card)" stroke="var(--border)" strokeWidth={1.2} />
        <text x={325} y={189} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--muted-foreground)">vs</text>

        {/* ───── 우: Deep Narrow ───── */}
        <text x={485} y={56} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          깊은 협폭: n 층 × 고정 폭(2)
        </text>

        {/* 입력 */}
        <circle cx={365} cy={165} r={12} fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2} />
        <text x={365} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">x</text>

        {/* 4 은닉층, 각 층 2 뉴런 */}
        {[0, 1, 2, 3].map((layer) => {
          const x = 395 + layer * 48;
          return (
            <g key={layer}>
              <circle cx={x} cy={145} r={8} fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={1.5} />
              <circle cx={x} cy={185} r={8} fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={1.5} />
              {layer === 0 ? (
                <>
                  <line x1={376} y1={165} x2={388} y2={145} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
                  <line x1={376} y1={165} x2={388} y2={185} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
                </>
              ) : (
                <>
                  <line x1={x - 48 + 8} y1={145} x2={x - 8} y2={145} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
                  <line x1={x - 48 + 8} y1={145} x2={x - 8} y2={185} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
                  <line x1={x - 48 + 8} y1={185} x2={x - 8} y2={145} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
                  <line x1={x - 48 + 8} y1={185} x2={x - 8} y2={185} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
                </>
              )}
            </g>
          );
        })}

        {/* 마지막 층 → 출력 */}
        <line x1={595} y1={145} x2={605} y2={165} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />
        <line x1={595} y1={185} x2={605} y2={165} stroke="#10b981" strokeWidth={0.7} opacity={0.5} />

        <circle cx={615} cy={165} r={12} fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={2} />
        <text x={615} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">y</text>

        {/* 층 표시 */}
        {[0, 1, 2, 3].map((layer) => (
          <text key={layer} x={395 + layer * 48} y={212} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">
            L{layer + 1}
          </text>
        ))}

        {/* 파라미터 */}
        <rect x={370} y={260} width={255} height={52} rx={7}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.2} />
        <text x={497} y={280} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">파라미터 수</text>
        <text x={497} y={300} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="var(--foreground)">
          n × (2×2) = O(n) 선형
        </text>

        {/* 하단 메시지 */}
        <text x={320} y={332} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">Universal Approximation은 보장 — 지수 폭 vs 선형 깊이: 깊이가 압도적으로 효율적</text>
      </svg>
    </div>
  );
}
