import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

export default function StabilityFeeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">SF &amp; DSR — Protocol Surplus 흐름</text>

        <defs>
          <marker id="sf-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
          <marker id="sf-arr-green" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#10b981" />
          </marker>
          <marker id="sf-arr-red" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#ef4444" />
          </marker>
        </defs>

        {/* 차입자 */}
        <ActionBox x={15} y={55} w={110} h={56}
          label="차입자"
          sub="DAI 부채 (SF 5%)"
          color="#ef4444" />

        {/* Jug */}
        <ModuleBox x={145} y={52} w={100} h={60}
          label="Jug.drip()"
          sub="SF 누적"
          color="#f59e0b" />

        {/* Vow (Surplus) */}
        <ModuleBox x={265} y={52} w={110} h={60}
          label="Vow"
          sub="Protocol Surplus"
          color="#8b5cf6" />

        {/* Flap Auction */}
        <ActionBox x={395} y={55} w={110} h={56}
          label="Flap Auction"
          sub="MKR buyback"
          color="#10b981" />

        <line x1={125} y1={82} x2={145} y2={82} stroke="#ef4444" strokeWidth={1.4} markerEnd="url(#sf-arr-red)" />
        <line x1={245} y1={82} x2={265} y2={82} stroke="#f59e0b" strokeWidth={1.4} markerEnd="url(#sf-arr)" />
        <line x1={375} y1={82} x2={395} y2={82} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#sf-arr)" />

        {/* DSR branch */}
        <DataBox x={265} y={160} w={110} h={48}
          label="Pot (DSR)"
          sub="5-8% APY"
          color="#10b981" />

        <ActionBox x={395} y={162} w={110} h={44}
          label="sDAI 보유자"
          sub="이자 수령"
          color="#3b82f6" />

        <line x1={320} y1={112} x2={320} y2={160} stroke="#10b981" strokeWidth={1.4} markerEnd="url(#sf-arr-green)" />
        <line x1={375} y1={184} x2={395} y2={184} stroke="#10b981" strokeWidth={1.4} markerEnd="url(#sf-arr-green)" />

        {/* 선 라벨 — 배경 pill */}
        <rect x={328} y={128} width={56} height={16} rx={8}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.7} />
        <text x={356} y={139} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#10b981">일부 배분</text>

        {/* MKR 소각 */}
        <rect x={395} y={224} width={110} height={44} rx={4}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={450} y={244} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">MKR burn</text>
        <text x={450} y={259} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">deflationary</text>

        <line x1={450} y1={112} x2={450} y2={224} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#sf-arr-red)" />

        {/* 공식 박스 */}
        <rect x={15} y={160} width={230} height={120} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={130} y={181} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">이자 공식</text>
        <text x={130} y={204} textAnchor="middle" fontSize={12}
          fill="var(--foreground)">rate[t] = rate[t-1] × (1+SF)^dt</text>
        <text x={130} y={224} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">rate는 곱셈 계수 (누적)</text>
        <text x={130} y={242} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">urn.art × rate = 실제 DAI 부채</text>
        <text x={130} y={266} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          SF ＞ DSR → spread (수익)
        </text>

        <text x={260} y={305} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">차입자가 낸 SF 이자 → Vow 누적 → Flap Auction → MKR 소각/DSR 배분</text>
      </svg>
    </div>
  );
}
