import { ActionBox, DataBox } from '@/components/viz/boxes';

export default function PoolModelViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Aave Pool 모델 — P2Pool 대출</text>

        <defs>
          <marker id="pm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="pm-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* 중앙 Aave Pool — 타이틀 바 + 내부 컨텐츠 분리 */}
        <rect x={190} y={100} width={140} height={130} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1.2} />
        <rect x={190} y={100} width={140} height={28} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} />
        <rect x={190} y={118} width={140} height={10}
          fill="#8b5cf6" fillOpacity={0.15} />
        <text x={260} y={118} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          Aave Pool
        </text>

        <text x={260} y={146} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
          공유 유동성
        </text>

        {/* 내부 토큰 리스트 */}
        {[
          { y: 160, label: 'USDC', value: '$500M', color: '#06b6d4' },
          { y: 180, label: 'ETH', value: '$200M', color: '#3b82f6' },
          { y: 200, label: 'WBTC', value: '$80M', color: '#f59e0b' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={202} y={t.y} width={116} height={16} rx={3}
              fill={t.color} fillOpacity={0.1} stroke={t.color} strokeWidth={0.5} />
            <text x={210} y={t.y + 11} fontSize={9} fontWeight={700} fill={t.color}>{t.label}</text>
            <text x={310} y={t.y + 11} textAnchor="end" fontSize={9} fontWeight={600} fill="var(--foreground)">
              {t.value}
            </text>
          </g>
        ))}

        <text x={260} y={222} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          공유 이자율 적용
        </text>

        {/* 예치자들 (왼쪽) */}
        <text x={78} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Lenders
        </text>
        <ActionBox x={20} y={58} w={115} h={40}
          label="예치자 A"
          sub="100K USDC"
          color="#3b82f6" />
        <ActionBox x={20} y={108} w={115} h={40}
          label="예치자 B"
          sub="50 ETH"
          color="#3b82f6" />
        <ActionBox x={20} y={158} w={115} h={40}
          label="예치자 C"
          sub="..."
          color="#3b82f6" />

        {/* 차입자들 (오른쪽) */}
        <text x={442} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          Borrowers
        </text>
        <ActionBox x={385} y={58} w={115} h={40}
          label="차입자 X"
          sub="50K USDC"
          color="#ef4444" />
        <ActionBox x={385} y={108} w={115} h={40}
          label="차입자 Y"
          sub="20 ETH"
          color="#ef4444" />
        <ActionBox x={385} y={158} w={115} h={40}
          label="차입자 Z"
          sub="..."
          color="#ef4444" />

        {/* 화살표들 */}
        <line x1={135} y1={78} x2={190} y2={130} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#pm-arr)" />
        <line x1={135} y1={128} x2={190} y2={150} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#pm-arr)" />
        <line x1={135} y1={178} x2={190} y2={170} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#pm-arr)" />

        <line x1={330} y1={130} x2={385} y2={78} stroke="#ef4444" strokeWidth={1.3} markerEnd="url(#pm-arr-r)" />
        <line x1={330} y1={150} x2={385} y2={128} stroke="#ef4444" strokeWidth={1.3} markerEnd="url(#pm-arr-r)" />
        <line x1={330} y1={170} x2={385} y2={178} stroke="#ef4444" strokeWidth={1.3} markerEnd="url(#pm-arr-r)" />

        {/* 수익 토큰 */}
        <DataBox x={20} y={258} w={135} h={38}
          label="aToken"
          sub="이자 자동 누적"
          color="#10b981" />

        <DataBox x={365} y={258} w={135} h={38}
          label="VariableDebtToken"
          sub="부채 증가 (이자)"
          color="#f59e0b" />

        <text x={88} y={250} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
          받음 ↓
        </text>
        <text x={432} y={250} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
          받음 ↓
        </text>

        <text x={260} y={308} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">즉시 유동성 · 주문 매칭 불필요 · 공유 이자율</text>
      </svg>
    </div>
  );
}
