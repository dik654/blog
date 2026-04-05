import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

export default function PsmViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">PSM — USDC ↔ DAI 1:1 교환</text>

        <defs>
          <marker id="psm-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
          <marker id="psm-arr-green" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#10b981" />
          </marker>
        </defs>

        {/* User */}
        <ActionBox x={30} y={120} w={110} h={54}
          label="Arbitrageur"
          sub="차익거래"
          color="#3b82f6" />

        {/* PSM */}
        <ModuleBox x={200} y={115} w={120} h={64}
          label="PSM-USDC"
          sub="수수료 0%"
          color="#8b5cf6" />

        {/* Result */}
        <DataBox x={380} y={125} w={120} h={44}
          label="DAI 발행"
          sub="또는 USDC 환급"
          color="#10b981" />

        <line x1={140} y1={147} x2={200} y2={147} stroke="#3b82f6" strokeWidth={1.6} markerEnd="url(#psm-arr)" />
        <line x1={320} y1={147} x2={380} y2={147} stroke="#10b981" strokeWidth={1.6} markerEnd="url(#psm-arr-green)" />

        {/* 시나리오 1: DAI > $1 */}
        <g transform="translate(30, 42)">
          <rect x={0} y={0} width={220} height={48} rx={6}
            fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={110} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
            DAI ＞ $1.00 (페그 초과)
          </text>
          <text x={110} y={35} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            USDC → DAI → DEX 매도
          </text>
        </g>

        {/* 시나리오 2: DAI < $1 */}
        <g transform="translate(270, 42)">
          <rect x={0} y={0} width={220} height={48} rx={6}
            fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
          <text x={110} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
            DAI ＜ $1.00 (페그 이하)
          </text>
          <text x={110} y={35} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            DEX → DAI 매수 → USDC 환급
          </text>
        </g>

        {/* 메커니즘 */}
        <rect x={30} y={200} width={460} height={54} rx={8}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={260} y={222} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#8b5cf6">내부: CDP with 101% ratio, USDC 담보, fee=0</text>
        <text x={260} y={240} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">차익거래자가 자연스럽게 페그 유지 → DAI ≈ $1</text>

        {/* 우려 */}
        <text x={260} y={278} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">트레이드오프: DAI 담보의 50%+ 가 USDC → 간접 중앙화</text>
      </svg>
    </div>
  );
}
