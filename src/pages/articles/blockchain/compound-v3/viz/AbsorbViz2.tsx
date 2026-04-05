export default function AbsorbViz2() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Absorb — Compound V3 청산 메커니즘</text>

        <defs>
          <marker id="ab-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 1단계 */}
        <rect x={20} y={48} width={480} height={48} rx={6}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} />
        <circle cx={40} cy={72} r={14} fill="#ef4444" />
        <text x={40} y={78} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">1</text>
        <text x={62} y={68} fontSize={12} fontWeight={700} fill="#ef4444">User HF ＜ 1 감지</text>
        <text x={62} y={86} fontSize={10} fill="var(--muted-foreground)">
          담보 가치 하락 or 부채 증가로 청산 조건 진입
        </text>

        <line x1={40} y1={96} x2={40} y2={108} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ab-arr)" />

        {/* 2단계 */}
        <rect x={20} y={108} width={480} height={48} rx={6}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <circle cx={40} cy={132} r={14} fill="#f59e0b" />
        <text x={40} y={138} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">2</text>
        <text x={62} y={128} fontSize={12} fontWeight={700} fill="#f59e0b">absorb(account) 호출</text>
        <text x={62} y={146} fontSize={10} fill="var(--muted-foreground)">
          누구나 호출 가능 · 부채와 담보를 프로토콜이 흡수
        </text>

        <line x1={40} y1={156} x2={40} y2={168} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ab-arr)" />

        {/* 3단계 */}
        <rect x={20} y={168} width={480} height={48} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.8} />
        <circle cx={40} cy={192} r={14} fill="#8b5cf6" />
        <text x={40} y={198} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">3</text>
        <text x={62} y={188} fontSize={12} fontWeight={700} fill="#8b5cf6">프로토콜 잔고로 이동</text>
        <text x={62} y={206} fontSize={10} fill="var(--muted-foreground)">
          User 부채 0, 담보 0 · 프로토콜 담보 ↑, reserves ↓
        </text>

        <line x1={40} y1={216} x2={40} y2={228} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ab-arr)" />

        {/* 4단계 */}
        <rect x={20} y={228} width={480} height={48} rx={6}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <circle cx={40} cy={252} r={14} fill="#10b981" />
        <text x={40} y={258} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">4</text>
        <text x={62} y={248} fontSize={12} fontWeight={700} fill="#10b981">buyCollateral() — 2차 시장 판매</text>
        <text x={62} y={266} fontSize={10} fill="var(--muted-foreground)">
          프로토콜이 discount 가격에 담보 매도 · USDC 회수
        </text>

        {/* 주요 차이 */}
        <rect x={20} y={286} width={480} height={24} rx={4}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={303} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          Aave와 차이: 청산자가 담보 직접 받지 않음 → 프로토콜이 중개자 역할
        </text>
      </svg>
    </div>
  );
}
