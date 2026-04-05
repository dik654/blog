import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

export default function CctpViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">CCTP — Burn &amp; Mint Cross-Chain</text>

        <defs>
          <marker id="cctp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Source Chain */}
        <rect x={20} y={40} width={150} height={160} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1} />
        <text x={95} y={58} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#3b82f6">Ethereum (Source)</text>

        <ActionBox x={35} y={75} w={120} h={35}
          label="1. burnUSDC"
          sub="1000 USDC burn"
          color="#3b82f6" />

        <DataBox x={35} y={120} w={120} h={30}
          label="MessageSent"
          sub="이벤트 발생"
          color="#8b5cf6" />

        <text x={95} y={175} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="#3b82f6">Native USDC -1000</text>

        {/* Attestation Service */}
        <ModuleBox x={185} y={100} w={110} h={60}
          label="Circle API"
          sub="Attestation 서비스"
          color="#f59e0b" />

        <text x={240} y={80} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">2. 감지 &amp; 서명</text>

        {/* Destination Chain */}
        <rect x={310} y={40} width={150} height={160} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <text x={385} y={58} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">Arbitrum (Destination)</text>

        <ActionBox x={325} y={75} w={120} h={35}
          label="3. receiveMessage"
          sub="서명 검증"
          color="#10b981" />

        <DataBox x={325} y={120} w={120} h={30}
          label="4. mint"
          sub="1000 USDC (recipient)"
          color="#10b981" />

        <text x={385} y={175} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="#10b981">Native USDC +1000</text>

        {/* 화살표들 */}
        <line x1={155} y1={130} x2={185} y2={130} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#cctp-arr)" />
        <line x1={295} y1={130} x2={325} y2={130} stroke="#10b981" strokeWidth={1.2} markerEnd="url(#cctp-arr)" />

        {/* 하단 설명 */}
        <rect x={20} y={215} width={440} height={50} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />

        <text x={85} y={232} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">v1:</text>
        <text x={220} y={232} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          15-30분 소요
        </text>

        <text x={85} y={252} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
          v2 Fast:
        </text>
        <text x={220} y={252} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          8-20초 완료
        </text>

        <text x={380} y={242} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">
          브리지 공격 리스크 제거
        </text>
      </svg>
    </div>
  );
}
