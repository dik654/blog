import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

export default function MintBurnViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Mint / Burn 흐름</text>

        <defs>
          <marker id="mb-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
          <marker id="mb-arr-red" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#ef4444" />
          </marker>
        </defs>

        {/* Mint (상단) */}
        <text x={30} y={42} fontSize={10} fontWeight={700} fill="#10b981">MINT</text>

        <ActionBox x={30} y={50} w={85} h={35}
          label="파트너"
          sub="USD 입금"
          color="#3b82f6" />

        <ModuleBox x={135} y={48} w={90} h={40}
          label="Circle"
          sub="KYC 검증"
          color="#f59e0b" />

        <DataBox x={245} y={52} w={90} h={32}
          label="Compliance"
          sub="자금 출처 확인"
          color="#8b5cf6" />

        <ActionBox x={355} y={50} w={85} h={35}
          label="Contract"
          sub="mint(to, amt)"
          color="#10b981" />

        <line x1={115} y1={67} x2={135} y2={67} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#mb-arr)" />
        <line x1={225} y1={68} x2={245} y2={68} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#mb-arr)" />
        <line x1={335} y1={68} x2={355} y2={67} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#mb-arr)" />

        <text x={235} y={100} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">T+0 ~ T+1 · 최소 $100K (기관용)</text>

        {/* 구분선 */}
        <line x1={30} y1={125} x2={450} y2={125} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />

        {/* Burn (하단) */}
        <text x={30} y={150} fontSize={10} fontWeight={700} fill="#ef4444">BURN (환급)</text>

        <ActionBox x={30} y={155} w={85} h={35}
          label="사용자"
          sub="USDC 전송"
          color="#ef4444" />

        <ModuleBox x={135} y={153} w={90} h={40}
          label="Contract"
          sub="burn(amt)"
          color="#ef4444" />

        <DataBox x={245} y={157} w={90} h={32}
          label="Circle"
          sub="USD 준비"
          color="#f59e0b" />

        <ActionBox x={355} y={155} w={85} h={35}
          label="은행 계좌"
          sub="USD 입금"
          color="#10b981" />

        <line x1={115} y1={172} x2={135} y2={172} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#mb-arr-red)" />
        <line x1={225} y1={173} x2={245} y2={173} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#mb-arr-red)" />
        <line x1={335} y1={173} x2={355} y2={172} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#mb-arr-red)" />

        <text x={235} y={205} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">T+1 ~ T+2 · Wire transfer</text>

        {/* 백업 비율 */}
        <rect x={30} y={220} width={420} height={30} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={240} y={240} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
          totalSupply ≤ reserves 유지 (100%+ 백업)
        </text>
      </svg>
    </div>
  );
}
