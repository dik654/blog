export default function GetAmountsOutViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">getAmountsOut — 경로 출력량 순차 계산</text>

        <defs>
          <marker id="gao-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={56} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          getAmountOut 공식 (0.3% 수수료)
        </text>
        <text x={260} y={84} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          Δy = 997·Δx·reserveOut / (1000·reserveIn + 997·Δx)
        </text>

        {/* 경로 순차 계산 */}
        <text x={260} y={120} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">경로 [DAI, WETH, USDC, WBTC] 계산 예시</text>

        {[
          {
            x: 20,
            from: 'DAI',
            to: 'WETH',
            input: '1000',
            output: '0.331',
            color: '#f59e0b',
          },
          {
            x: 152,
            from: 'WETH',
            to: 'USDC',
            input: '0.331',
            output: '989',
            color: '#10b981',
          },
          {
            x: 284,
            from: 'USDC',
            to: 'WBTC',
            input: '989',
            output: '0.0153',
            color: '#8b5cf6',
          },
          {
            x: 416,
            from: '최종',
            to: 'WBTC',
            input: '',
            output: '0.0153',
            color: '#3b82f6',
            final: true,
          },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={136} width={124} height={76} rx={6}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8}
              strokeDasharray={s.final ? undefined : undefined} />
            <text x={s.x + 62} y={156} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
              {s.from} → {s.to}
            </text>
            {s.input && (
              <>
                <text x={s.x + 12} y={176} fontSize={9} fill="var(--muted-foreground)">in:</text>
                <text x={s.x + 112} y={176} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">
                  {s.input}
                </text>
              </>
            )}
            <text x={s.x + 12} y={194} fontSize={9} fill="var(--muted-foreground)">out:</text>
            <text x={s.x + 112} y={194} textAnchor="end" fontSize={10} fontWeight={700} fill={s.color}>
              {s.output}
            </text>
            {!s.final && (
              <line x1={s.x + 124} y1={174} x2={s.x + 132} y2={174}
                stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#gao-arr)" />
            )}
          </g>
        ))}

        {/* 결과 */}
        <rect x={20} y={228} width={480} height={44} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={260} y={247} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          입력 1000 DAI → 출력 0.0153 WBTC (3홉)
        </text>
        <text x={260} y={262} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          amounts = [1000, 0.331, 989, 0.0153] 배열 반환
        </text>

        {/* 주의 */}
        <text x={260} y={292} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">view 함수 — 프론트엔드에서 오프체인 실행 (가스 0)</text>
        <text x={260} y={308} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">경로 비교·슬리피지 계산에 필수</text>
      </svg>
    </div>
  );
}
