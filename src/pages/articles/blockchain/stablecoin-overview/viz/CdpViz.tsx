import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

export default function CdpViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Crypto-backed Stablecoin — 과담보 CDP</text>

        <defs>
          <marker id="cdp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Collateral */}
        <DataBox x={30} y={50} w={110} h={45}
          label="담보 예치"
          sub="10 ETH ($30,000)"
          color="#3b82f6" />

        {/* CDP (Vault) */}
        <ModuleBox x={180} y={45} w={120} h={55}
          label="CDP / Vault"
          sub="150% 담보비율"
          color="#8b5cf6" />

        {/* DAI output */}
        <ActionBox x={340} y={50} w={110} h={45}
          label="DAI 발행"
          sub="15,000 DAI"
          color="#10b981" />

        <line x1={140} y1={72} x2={180} y2={72} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#cdp-arr)" />
        <line x1={300} y1={72} x2={340} y2={72} stroke="#10b981" strokeWidth={1.2} markerEnd="url(#cdp-arr)" />

        {/* 계산 */}
        <rect x={30} y={120} width={420} height={50} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">담보비율 = 담보가치 / 부채</text>
        <text x={240} y={156} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">$30,000 / $15,000 = 200% (최소 150%)</text>

        {/* 가격 하락 시나리오 */}
        <AlertBox x={30} y={190} w={200} h={55}
          label="ETH 가격 하락"
          sub="$3,000 → $2,250"
          color="#ef4444" />
        <text x={130} y={240} textAnchor="middle" fontSize={8}
          fill="#ef4444">담보: $22,500 / 부채: $15,000 = 150%</text>

        <AlertBox x={250} y={190} w={200} h={55}
          label="청산 트리거"
          sub="담보비율 &lt; 150%"
          color="#ef4444" />
        <text x={350} y={240} textAnchor="middle" fontSize={8}
          fill="#ef4444">Auction 시작 → 담보 할인 매각</text>

        <text x={240} y={268} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">탈중앙 · 자본 효율 낮음 (150%+ 과담보)</text>
      </svg>
    </div>
  );
}
