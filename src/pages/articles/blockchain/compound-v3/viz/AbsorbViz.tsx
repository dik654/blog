import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

export default function AbsorbViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Absorb + Storefront — Compound V3 청산</text>

        <defs>
          <marker id="ab-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Phase 1: Absorb */}
        <text x={115} y={45} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#ef4444">Phase 1: Absorb (absorber가 호출)</text>

        <ActionBox x={20} y={60} w={70} h={35}
          label="Absorber"
          sub="gas 지불"
          color="#3b82f6" />

        <ModuleBox x={100} y={58} w={100} h={40}
          label="Unhealthy User"
          sub="HF &lt; 1"
          color="#ef4444" />

        <ActionBox x={210} y={60} w={80} h={35}
          label="Protocol"
          sub="흡수"
          color="#f59e0b" />

        <line x1={90} y1={77} x2={100} y2={77} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#ab-arr)" />
        <line x1={200} y1={77} x2={210} y2={77} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#ab-arr)" />

        {/* 결과 표시 */}
        <DataBox x={20} y={110} w={270} h={30}
          label="✓ User 부채 청산 · 담보 → Protocol reserves"
          sub=""
          color="#10b981" />

        {/* 구분선 */}
        <line x1={30} y1={160} x2={450} y2={160} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />

        {/* Phase 2: Storefront */}
        <text x={240} y={180} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">Phase 2: Storefront (아무나 할인 매수)</text>

        <ModuleBox x={20} y={200} w={90} h={45}
          label="Protocol"
          sub="할인 담보 보유"
          color="#f59e0b" />

        <DataBox x={125} y={205} w={100} h={35}
          label="Discount Price"
          sub="시장가 × 0.97"
          color="#8b5cf6" />

        <ActionBox x={240} y={200} w={90} h={45}
          label="Buyer"
          sub="USDC 지불"
          color="#3b82f6" />

        <DataBox x={345} y={205} w={100} h={35}
          label="담보 수령"
          sub="+3% 차익"
          color="#10b981" />

        <line x1={110} y1={225} x2={125} y2={222} stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#ab-arr)" />
        <line x1={225} y1={222} x2={240} y2={222} stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#ab-arr)" />
        <line x1={330} y1={222} x2={345} y2={222} stroke="#10b981" strokeWidth={1.2} markerEnd="url(#ab-arr)" />

        {/* 핵심 차이 */}
        <rect x={20} y={260} width={440} height={30} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={240} y={278} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          Aave와 차이: 청산자 자본 불필요 · 2단계 분리로 자동화 용이
        </text>
      </svg>
    </div>
  );
}
