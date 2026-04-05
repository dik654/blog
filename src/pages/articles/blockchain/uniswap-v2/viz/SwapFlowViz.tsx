export default function SwapFlowViz() {
  const steps = [
    { n: 1, label: '토큰 선 전송', detail: 'amount0Out, amount1Out → to 주소', color: '#3b82f6' },
    { n: 2, label: 'callback 실행 (옵션)', detail: 'data ≠ empty → uniswapV2Call()', color: '#f59e0b' },
    { n: 3, label: 'balance 읽기', detail: 'balance0, balance1 ← ERC20.balanceOf(this)', color: '#8b5cf6' },
    { n: 4, label: 'amountIn 계산', detail: 'balance - (reserve - amountOut)', color: '#06b6d4' },
    { n: 5, label: 'k 검증', detail: 'bal0·1000 − in0·3 · bal1·1000 − in1·3 ≥ r0·r1·1000²', color: '#ef4444' },
    { n: 6, label: 'reserve 업데이트', detail: '_update(balance0, balance1)', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 420" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">swap() — 6단계 흐름 · "먼저 송금 후 검증"</text>

        <defs>
          <marker id="sf-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const y = 46 + i * 58;
          return (
            <g key={s.n}>
              {/* 단계 번호 */}
              <circle cx={40} cy={y + 22} r={15} fill={s.color} />
              <text x={40} y={y + 28} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                {s.n}
              </text>

              {/* 내용 박스 */}
              <rect x={68} y={y} width={432} height={46} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <text x={80} y={y + 20} fontSize={12} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={80} y={y + 38} fontSize={10} fill="var(--muted-foreground)">
                {s.detail}
              </text>

              {/* 화살표 */}
              {i < steps.length - 1 && (
                <line x1={40} y1={y + 37} x2={40} y2={y + 58}
                  stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#sf-arr2)" />
              )}
            </g>
          );
        })}

        {/* 왜 먼저 송금? */}
        <rect x={20} y={396} width={480} height={20} rx={4}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={411} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--muted-foreground)">
          "먼저 송금 후 검증" → Flash Swap 가능 · k 검증이 모든 안전성 보장
        </text>
      </svg>
    </div>
  );
}
