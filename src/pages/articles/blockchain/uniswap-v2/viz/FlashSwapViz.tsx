export default function FlashSwapViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Flash Swap — 담보 없는 원자적 차입</text>

        <defs>
          <marker id="fs-arr" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="fs-arr-g" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" />
          </marker>
          <marker id="fs-arr-r" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* 1. 사용자 요청 */}
        <rect x={20} y={50} width={130} height={52} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={85} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          1. swap 호출
        </text>
        <text x={85} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          data ≠ empty
        </text>

        {/* 2. Pair 토큰 전송 */}
        <rect x={190} y={50} width={130} height={52} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={255} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          2. Pair → User
        </text>
        <text x={255} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          토큰 선 전송
        </text>

        {/* 3. Callback */}
        <rect x={360} y={50} width={140} height={52} rx={6}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={430} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          3. callback
        </text>
        <text x={430} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          uniswapV2Call(...)
        </text>

        <line x1={150} y1={76} x2={190} y2={76} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#fs-arr)" />
        <line x1={320} y1={76} x2={360} y2={76} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#fs-arr-g)" />

        {/* 4. 차익거래 */}
        <rect x={190} y={130} width={220} height={52} rx={6}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={300} y={152} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          4. 차익거래 실행
        </text>
        <text x={300} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          다른 DEX에서 매도 → 수익 획득
        </text>

        <line x1={430} y1={102} x2={400} y2={130} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#fs-arr)" />

        {/* 5. 상환 */}
        <rect x={190} y={208} width={220} height={52} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={300} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          5. 상환
        </text>
        <text x={300} y={248} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Pair에 원금 + 0.3% 수수료 전송
        </text>

        <line x1={300} y1={182} x2={300} y2={208} stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#fs-arr)" />

        {/* 6. k 검증 */}
        <rect x={20} y={208} width={150} height={52} rx={6}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
        <text x={95} y={228} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          6. k 검증
        </text>
        <text x={95} y={246} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          bal·bal ≥ k·1000²
        </text>

        <line x1={190} y1={234} x2={170} y2={234} stroke="#ef4444" strokeWidth={1.3} markerEnd="url(#fs-arr-r)" />

        {/* revert 경고 */}
        <rect x={430} y={208} width={80} height={52} rx={6}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
        <text x={470} y={228} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          실패 시
        </text>
        <text x={470} y={246} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          전체 revert
        </text>

        <line x1={410} y1={234} x2={430} y2={234} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />

        <text x={260} y={294} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">원자성 보장 — 상환 실패 = 트랜잭션 전체 revert (EVM 속성)</text>
        <text x={260} y={310} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">1~6 단계 모두 <tspan fontWeight={700} fill="#8b5cf6">1 트랜잭션</tspan>에서 실행</text>
      </svg>
    </div>
  );
}
