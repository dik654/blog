import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function CircleArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">USDC 시스템 — Circle &amp; Reserve</text>

        {/* Circle Entity */}
        <ModuleBox x={140} y={40} w={200} h={45}
          label="Circle Internet Financial"
          sub="Regulated Money Transmitter"
          color="#3b82f6" />

        {/* Reserve Account */}
        <rect x={40} y={110} width={400} height={90} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <text x={240} y={128} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">Reserve Account ($60B+)</text>

        <DataBox x={55} y={140} w={115} h={45}
          label="Treasury Bills"
          sub="80% · BlackRock MMF"
          color="#10b981" />
        <DataBox x={180} y={140} w={115} h={45}
          label="Cash"
          sub="10% · BNY Mellon"
          color="#10b981" />
        <DataBox x={305} y={140} w={120} h={45}
          label="Repo Agreements"
          sub="10% · overnight"
          color="#10b981" />

        {/* 연결선: Circle → Reserves */}
        <line x1={240} y1={85} x2={240} y2={110} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2" />

        {/* USDC Contracts (multi-chain) */}
        <rect x={40} y={220} width={400} height={60} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1} />
        <text x={240} y={238} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#8b5cf6">USDC Smart Contracts (15+ 체인)</text>

        <g transform="translate(55, 250)">
          {['Ethereum', 'Solana', 'Base', 'Arbitrum', 'Polygon', 'Avalanche'].map((chain, i) => (
            <g key={chain} transform={`translate(${i * 62}, 0)`}>
              <rect x={0} y={0} width={58} height={22} rx={4}
                fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={0.5} />
              <text x={29} y={14} textAnchor="middle" fontSize={7} fontWeight={600}
                fill="#8b5cf6">{chain}</text>
            </g>
          ))}
        </g>

        {/* Circle → Contracts */}
        <line x1={240} y1={200} x2={240} y2={220} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 2" />
        <text x={285} y={213} fontSize={7} fill="#8b5cf6">1:1 mint</text>
      </svg>
    </div>
  );
}
