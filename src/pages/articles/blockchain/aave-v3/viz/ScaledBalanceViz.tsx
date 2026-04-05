export default function ScaledBalanceViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">aToken Scaled Balance — 인덱스 기반 이자</text>

        {/* 시작 */}
        <g transform="translate(20, 50)">
          <rect x={0} y={0} width={130} height={80} rx={8}
            fill="var(--card)" stroke="#3b82f6" strokeWidth={1} />
          <text x={65} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">t=0 (예치)</text>
          <line x1={10} y1={28} x2={120} y2={28} stroke="#3b82f6" strokeWidth={0.5} opacity={0.3} />
          <text x={10} y={42} fontSize={8} fill="var(--foreground)">deposit:</text>
          <text x={120} y={42} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">1000 USDC</text>
          <text x={10} y={55} fontSize={8} fill="var(--foreground)">index:</text>
          <text x={120} y={55} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">1.0</text>
          <text x={10} y={68} fontSize={8} fill="var(--foreground)">scaled:</text>
          <text x={120} y={68} textAnchor="end" fontSize={8} fontWeight={600} fill="#10b981">1000 / 1.0 = 1000</text>
        </g>

        {/* 화살표 */}
        <line x1={155} y1={90} x2={175} y2={90} stroke="var(--foreground)" strokeWidth={1.2} />

        {/* 6개월 후 */}
        <g transform="translate(175, 50)">
          <rect x={0} y={0} width={130} height={80} rx={8}
            fill="var(--card)" stroke="#f59e0b" strokeWidth={1} />
          <text x={65} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">t=6월</text>
          <line x1={10} y1={28} x2={120} y2={28} stroke="#f59e0b" strokeWidth={0.5} opacity={0.3} />
          <text x={10} y={42} fontSize={8} fill="var(--foreground)">index:</text>
          <text x={120} y={42} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">1.025</text>
          <text x={10} y={55} fontSize={8} fill="var(--foreground)">scaled:</text>
          <text x={120} y={55} textAnchor="end" fontSize={8} fontWeight={600} fill="#10b981">1000 (불변)</text>
          <text x={10} y={68} fontSize={8} fill="var(--foreground)">balance:</text>
          <text x={120} y={68} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">1025 USDC</text>
        </g>

        <line x1={310} y1={90} x2={330} y2={90} stroke="var(--foreground)" strokeWidth={1.2} />

        {/* 1년 후 */}
        <g transform="translate(330, 50)">
          <rect x={0} y={0} width={130} height={80} rx={8}
            fill="var(--card)" stroke="#10b981" strokeWidth={1} />
          <text x={65} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">t=1년</text>
          <line x1={10} y1={28} x2={120} y2={28} stroke="#10b981" strokeWidth={0.5} opacity={0.3} />
          <text x={10} y={42} fontSize={8} fill="var(--foreground)">index:</text>
          <text x={120} y={42} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">1.05</text>
          <text x={10} y={55} fontSize={8} fill="var(--foreground)">scaled:</text>
          <text x={120} y={55} textAnchor="end" fontSize={8} fontWeight={600} fill="#10b981">1000 (불변)</text>
          <text x={10} y={68} fontSize={8} fill="var(--foreground)">balance:</text>
          <text x={120} y={68} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">1050 USDC</text>
        </g>

        {/* 공식 */}
        <rect x={60} y={155} width={360} height={55} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={175} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">balanceOf(user) = scaled × index</text>
        <text x={240} y={192} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">scaled balance는 저장된 값 (불변)</text>
        <text x={240} y={204} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">index는 시간에 따라 증가 (이자 누적)</text>

        {/* 이점 */}
        <text x={240} y={235} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="#10b981">O(1) 이자 계산 · rebase 불필요 · ERC20 완전 호환</text>
        <text x={240} y={255} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">모든 사용자가 같은 index 사용 → storage 쓰기 1회로 전체 이자 업데이트</text>
      </svg>
    </div>
  );
}
