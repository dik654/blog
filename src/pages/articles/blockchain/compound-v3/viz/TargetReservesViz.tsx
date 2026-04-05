export default function TargetReservesViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Target Reserves — 담보 재고 관리 사이클</text>

        <defs>
          <marker id="tr-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="tr-arr-g" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" />
          </marker>
        </defs>

        {/* 사이클 4단계 */}
        {/* Step 1: 청산 발생 */}
        <rect x={20} y={48} width={150} height={70} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} />
        <circle cx={40} cy={68} r={12} fill="#ef4444" />
        <text x={40} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">1</text>
        <text x={58} y={72} fontSize={11} fontWeight={700} fill="#ef4444">청산 발생</text>
        <text x={32} y={90} fontSize={9} fill="var(--muted-foreground)">absorb() 호출</text>
        <text x={32} y={104} fontSize={9} fill="var(--muted-foreground)">담보 → reserves</text>

        {/* Step 2: reserves 증가 */}
        <rect x={185} y={48} width={150} height={70} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <circle cx={205} cy={68} r={12} fill="#f59e0b" />
        <text x={205} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">2</text>
        <text x={223} y={72} fontSize={11} fontWeight={700} fill="#f59e0b">reserves 증가</text>
        <text x={197} y={90} fontSize={9} fill="var(--muted-foreground)">totalReserves[WETH] ↑</text>
        <text x={197} y={104} fontSize={9} fill="var(--muted-foreground)">목표 대비 초과 체크</text>

        {/* Step 3: storefront 판매 */}
        <rect x={350} y={48} width={150} height={70} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.8} />
        <circle cx={370} cy={68} r={12} fill="#8b5cf6" />
        <text x={370} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">3</text>
        <text x={388} y={72} fontSize={11} fontWeight={700} fill="#8b5cf6">할인 판매</text>
        <text x={362} y={90} fontSize={9} fill="var(--muted-foreground)">buyCollateral()</text>
        <text x={362} y={104} fontSize={9} fill="var(--muted-foreground)">차익거래자 매입</text>

        <line x1={170} y1={83} x2={185} y2={83} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#tr-arr)" />
        <line x1={335} y1={83} x2={350} y2={83} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#tr-arr)" />

        {/* Step 4: treasury 전송 */}
        <rect x={185} y={136} width={150} height={70} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <circle cx={205} cy={156} r={12} fill="#10b981" />
        <text x={205} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">4</text>
        <text x={223} y={160} fontSize={11} fontWeight={700} fill="#10b981">Treasury</text>
        <text x={197} y={178} fontSize={9} fill="var(--muted-foreground)">USDC 확보</text>
        <text x={197} y={192} fontSize={9} fill="var(--muted-foreground)">DAO 관리</text>

        <line x1={425} y1={118} x2={335} y2={156} stroke="#10b981" strokeWidth={1.3} markerEnd="url(#tr-arr-g)" />

        {/* Target 비교 */}
        <text x={260} y={232} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">reserves vs targetReserves 관계</text>

        <rect x={20} y={244} width={155} height={62} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.6} />
        <text x={97} y={262} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          reserves ＜ target
        </text>
        <text x={97} y={280} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          정상 운영
        </text>
        <text x={97} y={294} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          판매 대기
        </text>

        <rect x={185} y={244} width={155} height={62} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.6} />
        <text x={262} y={262} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          reserves ≈ target
        </text>
        <text x={262} y={280} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          균형 상태
        </text>
        <text x={262} y={294} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          이상적
        </text>

        <rect x={350} y={244} width={150} height={62} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={425} y={262} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          reserves ＞ target × SELL
        </text>
        <text x={425} y={280} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          초과분 DEX 매도
        </text>
        <text x={425} y={294} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          (DAO 실행)
        </text>
      </svg>
    </div>
  );
}
