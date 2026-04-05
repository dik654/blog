import { ModuleBox } from '@/components/viz/boxes';

export default function SystemViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        {/* 중앙 — Vat (핵심 회계) */}
        <ModuleBox
          x={210} y={120}
          w={100} h={58}
          label="Vat.sol"
          sub="핵심 회계·Vault 상태"
          color="#3b82f6"
        />

        {/* 상단 왼쪽 — Spotter (가격) */}
        <ModuleBox
          x={50} y={42}
          w={100} h={58}
          label="Spotter.sol"
          sub="Oracle·청산 가격"
          color="#8b5cf6"
        />

        {/* 상단 오른쪽 — Jug (이자) */}
        <ModuleBox
          x={370} y={42}
          w={100} h={58}
          label="Jug.sol"
          sub="Stability Fee"
          color="#f59e0b"
        />

        {/* 하단 왼쪽 — Cat/Dog (청산) */}
        <ModuleBox
          x={50} y={200}
          w={100} h={58}
          label="Cat / Dog.sol"
          sub="청산 트리거·경매"
          color="#ef4444"
        />

        {/* 하단 오른쪽 — DAI (토큰) */}
        <ModuleBox
          x={370} y={200}
          w={100} h={58}
          label="DAI.sol"
          sub="ERC20·mint/burn"
          color="#10b981"
        />

        {/* 화살표 정의 */}
        <defs>
          <marker id="arrow-purple" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" opacity={0.8} />
          </marker>
          <marker id="arrow-orange" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#f59e0b" opacity={0.8} />
          </marker>
          <marker id="arrow-red" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" opacity={0.8} />
          </marker>
          <marker id="arrow-green" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" opacity={0.8} />
          </marker>
        </defs>

        {/* Spotter → Vat */}
        <line x1={150} y1={88} x2={210} y2={136}
          stroke="#8b5cf6" strokeWidth={1.4} opacity={0.7} markerEnd="url(#arrow-purple)" />
        {/* Jug → Vat */}
        <line x1={370} y1={88} x2={310} y2={136}
          stroke="#f59e0b" strokeWidth={1.4} opacity={0.7} markerEnd="url(#arrow-orange)" />
        {/* Cat → Vat */}
        <line x1={150} y1={212} x2={210} y2={166}
          stroke="#ef4444" strokeWidth={1.4} opacity={0.7} markerEnd="url(#arrow-red)" />
        {/* Vat → DAI */}
        <line x1={310} y1={166} x2={370} y2={212}
          stroke="#10b981" strokeWidth={1.4} opacity={0.7} markerEnd="url(#arrow-green)" />

        {/* 선 위 배경 pill + 라벨 */}
        <rect x={155} y={100} width={66} height={16} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={0.7} />
        <text x={188} y={111} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#8b5cf6">spot 갱신</text>

        <rect x={300} y={100} width={50} height={16} rx={8}
          fill="var(--card)" stroke="#f59e0b" strokeWidth={0.7} />
        <text x={325} y={111} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#f59e0b">drip()</text>

        <rect x={155} y={184} width={50} height={16} rx={8}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.7} />
        <text x={180} y={195} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#ef4444">grab()</text>

        <rect x={300} y={184} width={80} height={16} rx={8}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.7} />
        <text x={340} y={195} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#10b981">suck() / heal()</text>

        {/* 라벨 */}
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Maker Protocol — 핵심 컨트랙트</text>
        <text x={260} y={286} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">모든 경로가 Vat을 거침 — 중앙 원장(central ledger) 패턴</text>
      </svg>
    </div>
  );
}
