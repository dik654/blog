export default function AbsorbInternalsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">absorb() 내부 — 담보 이전 + 부채 리셋</text>

        <defs>
          <marker id="ai-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Before state */}
        <rect x={20} y={44} width={150} height={120} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} />
        <text x={95} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          Before (user)
        </text>
        <text x={32} y={84} fontSize={10} fill="var(--muted-foreground)">principal</text>
        <text x={158} y={84} textAnchor="end" fontSize={10} fontWeight={700} fill="#ef4444">-10,500</text>
        <line x1={32} y1={90} x2={158} y2={90} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={32} y={104} fontSize={10} fill="var(--muted-foreground)">WETH</text>
        <text x={158} y={104} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">5</text>
        <line x1={32} y1={110} x2={158} y2={110} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={32} y={124} fontSize={10} fill="var(--muted-foreground)">WBTC</text>
        <text x={158} y={124} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">0.1</text>
        <line x1={32} y1={130} x2={158} y2={130} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={32} y={144} fontSize={10} fontWeight={700} fill="#ef4444">HF</text>
        <text x={158} y={144} textAnchor="end" fontSize={10} fontWeight={700} fill="#ef4444">0.87 ＜ 1</text>
        <text x={95} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">청산 가능</text>

        {/* 화살표 */}
        <line x1={176} y1={104} x2={206} y2={104} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ai-arr)" />
        <text x={191} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">absorb</text>

        {/* 실행 단계 */}
        <rect x={212} y={44} width={126} height={120} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={275} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          absorbInternal
        </text>
        <text x={220} y={82} fontSize={9} fill="var(--muted-foreground)">① isLiquidatable?</text>
        <text x={220} y={96} fontSize={9} fill="var(--muted-foreground)">② for each asset:</text>
        <text x={228} y={110} fontSize={8.5} fill="var(--muted-foreground)">balance → 0</text>
        <text x={228} y={122} fontSize={8.5} fill="var(--muted-foreground)">totalReserves +=</text>
        <text x={220} y={138} fontSize={9} fill="var(--muted-foreground)">③ principal 재설정</text>
        <text x={220} y={152} fontSize={9} fill="var(--muted-foreground)">④ absorber 보상</text>

        <line x1={344} y1={104} x2={374} y2={104} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ai-arr)" />

        {/* After state */}
        <rect x={380} y={44} width={120} height={120} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <text x={440} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          After (user)
        </text>
        <text x={390} y={84} fontSize={10} fill="var(--muted-foreground)">principal</text>
        <text x={490} y={84} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">0</text>
        <line x1={390} y1={90} x2={490} y2={90} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={390} y={104} fontSize={10} fill="var(--muted-foreground)">WETH</text>
        <text x={490} y={104} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">0</text>
        <line x1={390} y1={110} x2={490} y2={110} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={390} y={124} fontSize={10} fill="var(--muted-foreground)">WBTC</text>
        <text x={490} y={124} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">0</text>
        <line x1={390} y1={130} x2={490} y2={130} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={390} y={144} fontSize={10} fontWeight={700} fill="#10b981">포지션</text>
        <text x={490} y={144} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">종료</text>
        <text x={440} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">완전 청산</text>

        {/* Protocol reserves 변화 */}
        <text x={260} y={196} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">프로토콜 totalReserves 변화</text>

        <rect x={20} y={208} width={235} height={92} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={137} y={228} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          Before
        </text>
        <text x={32} y={248} fontSize={10} fill="var(--muted-foreground)">reserves[WETH]</text>
        <text x={242} y={248} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">120</text>
        <text x={32} y={266} fontSize={10} fill="var(--muted-foreground)">reserves[WBTC]</text>
        <text x={242} y={266} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">1.5</text>
        <text x={32} y={286} fontSize={10} fill="var(--muted-foreground)">USDC reserves</text>
        <text x={242} y={286} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">50,000</text>

        <rect x={265} y={208} width={235} height={92} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={382} y={228} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          After
        </text>
        <text x={277} y={248} fontSize={10} fill="var(--muted-foreground)">reserves[WETH]</text>
        <text x={487} y={248} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">125 (+5)</text>
        <text x={277} y={266} fontSize={10} fill="var(--muted-foreground)">reserves[WBTC]</text>
        <text x={487} y={266} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">1.6 (+0.1)</text>
        <text x={277} y={286} fontSize={10} fill="var(--muted-foreground)">USDC reserves</text>
        <text x={487} y={286} textAnchor="end" fontSize={10} fontWeight={700} fill="#ef4444">39,500 (-10.5K)</text>

        {/* 핵심 원리 */}
        <rect x={20} y={316} width={480} height={56} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={336} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          핵심: 프로토콜이 "임시 buyer" 역할
        </text>
        <text x={260} y={354} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          user 담보를 totalReserves로 이전 · 부채는 USDC reserves 차감하여 상환
        </text>
        <text x={260} y={368} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          이후 buyCollateral()로 담보 → USDC 재환전 (할인 판매)
        </text>
      </svg>
    </div>
  );
}
