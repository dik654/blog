import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

export default function LiquidationViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Health Factor &amp; 청산 흐름</text>

        {/* HF 바 */}
        <rect x={60} y={45} width={360} height={25} rx={4}
          fill="var(--muted)" opacity={0.3} />

        {/* 안전 구간 */}
        <rect x={60} y={45} width={120} height={25} fill="#10b981" opacity={0.3} rx={4} />
        {/* 주의 */}
        <rect x={180} y={45} width={80} height={25} fill="#f59e0b" opacity={0.3} />
        {/* 위험 */}
        <rect x={260} y={45} width={160} height={25} fill="#ef4444" opacity={0.3} rx={4} />

        {/* 라벨 */}
        <text x={120} y={62} textAnchor="middle" fontSize={8} fontWeight={700} fill="#10b981">안전 (HF &gt; 1.5)</text>
        <text x={220} y={62} textAnchor="middle" fontSize={8} fontWeight={700} fill="#f59e0b">주의</text>
        <text x={340} y={62} textAnchor="middle" fontSize={8} fontWeight={700} fill="#ef4444">청산 (HF &lt; 1)</text>

        {/* 눈금 */}
        <text x={60} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">0</text>
        <text x={180} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1.5</text>
        <text x={260} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1.0</text>
        <text x={420} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">∞</text>

        {/* 공식 */}
        <rect x={60} y={100} width={360} height={35} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={122} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">HF = Σ(collateral × liquidationThreshold) / totalDebt</text>

        {/* 청산 흐름 */}
        <text x={240} y={160} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">청산 시나리오</text>

        <defs>
          <marker id="liq-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 1. User */}
        <AlertBox x={30} y={175} w={100} h={35}
          label="1. User"
          sub="HF &lt; 1 (위험)"
          color="#ef4444" />

        {/* 2. Liquidator */}
        <ActionBox x={160} y={175} w={100} h={35}
          label="2. Liquidator"
          sub="liquidationCall()"
          color="#3b82f6" />

        {/* 3. Pool */}
        <ActionBox x={290} y={175} w={100} h={35}
          label="3. Pool"
          sub="검증 + 정산"
          color="#8b5cf6" />

        {/* 4. Bonus */}
        <DataBox x={420} y={178} w={50} h={30}
          label="보너스"
          sub="+5%"
          color="#10b981" />

        <line x1={130} y1={192} x2={160} y2={192} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#liq-arr)" />
        <line x1={260} y1={192} x2={290} y2={192} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#liq-arr)" />
        <line x1={390} y1={192} x2={420} y2={192} stroke="#10b981" strokeWidth={1.2} markerEnd="url(#liq-arr)" />

        {/* 청산 결과 */}
        <g transform="translate(30, 230)">
          <text x={0} y={10} fontSize={8} fontWeight={600} fill="var(--foreground)">청산자 수익:</text>
          <text x={0} y={22} fontSize={8} fill="var(--muted-foreground)">부채 상환 → 담보 + 5% bonus 획득</text>

          <text x={240} y={10} fontSize={8} fontWeight={600} fill="var(--foreground)">User 손실:</text>
          <text x={240} y={22} fontSize={8} fill="var(--muted-foreground)">담보 -5% (보너스만큼), 부채 감소</text>
        </g>

        {/* 50% 제한 */}
        <rect x={30} y={265} width={420} height={25} rx={4}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={240} y={282} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">
          한 번에 최대 50% 청산 (User 보호) · HF &lt; 0.95이면 100% 허용
        </text>
      </svg>
    </div>
  );
}
