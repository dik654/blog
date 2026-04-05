import { ActionBox, AlertBox } from '@/components/viz/boxes';

export default function VaultLifecycleViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 600 400" className="w-full h-auto" style={{ maxWidth: 780 }}>
        <text x={300} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Vault 라이프사이클 — CDP 5단계</text>

        {/* 화살표 정의 */}
        <defs>
          <marker id="vl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="vl-arr-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" />
          </marker>
          <marker id="vl-arr-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" />
          </marker>
          <marker id="vl-arr-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>

        {/* Step 1 */}
        <ActionBox x={20} y={55} w={170} h={50}
          label="1. Open Vault"
          sub="dsproxy.open() → urn 생성"
          color="#3b82f6" />

        {/* Step 2 */}
        <ActionBox x={20} y={125} w={170} h={50}
          label="2. Lock Collateral"
          sub="ethJoin.join(10 ETH)"
          color="#10b981" />

        {/* Step 3 */}
        <ActionBox x={20} y={195} w={170} h={50}
          label="3. Draw DAI"
          sub="vat.frob() → 15,000 DAI"
          color="#f59e0b" />

        {/* 중앙 Vault 상태 — 타이틀 바 + 스택된 값 */}
        <rect x={225} y={120} width={220} height={140} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1} />
        <rect x={225} y={120} width={220} height={30} rx={8}
          fill="#8b5cf6" fillOpacity={0.14} />
        <rect x={225} y={140} width={220} height={10}
          fill="#8b5cf6" fillOpacity={0.14} />
        <text x={335} y={140} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#8b5cf6">Vault 상태 (urn)</text>

        {/* 스택 값 — 라벨/값 좌우 분리 */}
        <text x={238} y={172} fontSize={11} fontWeight={600}
          fill="var(--muted-foreground)">ink (담보)</text>
        <text x={432} y={172} textAnchor="end" fontSize={11} fontWeight={700}
          fill="#3b82f6">10 ETH</text>
        <line x1={238} y1={178} x2={432} y2={178}
          stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />

        <text x={238} y={200} fontSize={11} fontWeight={600}
          fill="var(--muted-foreground)">art (부채)</text>
        <text x={432} y={200} textAnchor="end" fontSize={11} fontWeight={700}
          fill="#f59e0b">15,000 DAI</text>
        <line x1={238} y1={206} x2={432} y2={206}
          stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />

        <text x={238} y={228} fontSize={11} fontWeight={600}
          fill="var(--muted-foreground)">담보비율</text>
        <text x={432} y={228} textAnchor="end" fontSize={13} fontWeight={700}
          fill="#10b981">200%</text>

        <text x={335} y={250} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">safe (＞ 150% 청산선)</text>

        {/* Step 4 (시간 경과) */}
        <ActionBox x={225} y={50} w={220} h={56}
          label="4. 시간 경과"
          sub="SF 누적 + 담보 가격 변동"
          color="#6b7280" />

        {/* Step 5a (정상) — 오른쪽으로 밀어 HF 라벨 공간 확보 */}
        <ActionBox x={520} y={130} w={72} h={60}
          label="5a. Repay"
          sub="정상 종료"
          color="#10b981" />

        {/* Step 5b (청산) */}
        <AlertBox x={520} y={210} w={72} h={60}
          label="5b. Liquidation"
          sub="Dog.bark()"
          color="#ef4444" />

        {/* 화살표: 1 → 2 → 3 */}
        <line x1={105} y1={105} x2={105} y2={125} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#vl-arr)" />
        <line x1={105} y1={175} x2={105} y2={195} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#vl-arr)" />

        {/* 3 → Vault 상태 */}
        <line x1={190} y1={218} x2={225} y2={195} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#vl-arr)" />

        {/* 4 → Vault 상태 */}
        <line x1={335} y1={106} x2={335} y2={120} stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#vl-arr-gray)" />

        {/* Vault → 5a (더 길어진 화살표) */}
        <line x1={445} y1={170} x2={520} y2={160} stroke="#10b981" strokeWidth={1.3} markerEnd="url(#vl-arr-green)" />

        {/* Vault → 5b (더 길어진 화살표) */}
        <line x1={445} y1={225} x2={520} y2={240} stroke="#ef4444" strokeWidth={1.3} markerEnd="url(#vl-arr-red)" />

        {/* 청산 조건 라벨 — 화살표 중앙에 배경 pill */}
        <rect x={452} y={154} width={50} height={16} rx={7}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.7} />
        <text x={477} y={165} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#10b981">HF ≥ 1</text>

        <rect x={450} y={225} width={54} height={16} rx={7}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.7} />
        <text x={477} y={236} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#ef4444">HF ＜ 1</text>

        {/* 시간 경과 세부 정보 — 별도 박스 */}
        <rect x={20} y={284} width={572} height={54} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={306} y={303} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">시간 경과에 따른 변화</text>
        <text x={165} y={323} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">부채 증가: art × rate (누적)</text>
        <text x={450} y={323} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">담보 가치: ETH 가격 × ink</text>

        {/* 범례 */}
        <text x={306} y={358} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">용어 정리</text>
        <text x={306} y={376} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">urn = Vault 식별자 · ink = 담보 양 · art = 정규화 부채</text>
        <text x={306} y={392} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">frob() = Vat 핵심 함수 (담보·부채 동시 조작) · HF = Health Factor</text>
      </svg>
    </div>
  );
}
