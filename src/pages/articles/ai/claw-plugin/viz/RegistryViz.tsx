import { ActionBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

export default function RegistryViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PluginRegistry — 발견 → 등록 → 활성화</text>

        <defs>
          <marker id="reg-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 검색 경로 */}
        <text x={280} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">3단계 검색 경로</text>

        <g transform="translate(30, 70)">
          <rect x={0} y={0} width={155} height={42} rx={4}
            fill="#6b7280" fillOpacity={0.1} stroke="#6b7280" strokeWidth={0.5} />
          <text x={77} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6b7280">시스템</text>
          <text x={77} y={32} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
            /etc/claw/plugins/
          </text>
        </g>

        <g transform="translate(202, 70)">
          <rect x={0} y={0} width={155} height={42} rx={4}
            fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.5} />
          <text x={77} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">사용자</text>
          <text x={77} y={32} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
            ~/.claw/plugins/
          </text>
        </g>

        <g transform="translate(374, 70)">
          <rect x={0} y={0} width={155} height={42} rx={4}
            fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.5} />
          <text x={77} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">프로젝트</text>
          <text x={77} y={32} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
            .claw/plugins/
          </text>
        </g>

        {/* 3단계 파이프라인 */}
        <ActionBox x={30} y={130} w={155} h={46}
          label="1. discover()"
          sub="매니페스트 스캔"
          color="#3b82f6" />

        <ActionBox x={202} y={130} w={155} h={46}
          label="2. try_register()"
          sub="이름 충돌 검사"
          color="#f59e0b" />

        <ActionBox x={374} y={130} w={155} h={46}
          label="3. enable()"
          sub="레지스트리 등록"
          color="#10b981" />

        <line x1={185} y1={153} x2={202} y2={153} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#reg-arr)" />
        <line x1={357} y1={153} x2={374} y2={153} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#reg-arr)" />

        {/* 조건 */}
        <AlertBox x={30} y={196} w={500} h={42}
          label="Opt-in 모델"
          sub="trusted_plugins 리스트에 있어야 enable()"
          color="#ef4444" />

        <text x={280} y={268} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">우선순위: 프로젝트 &gt; 사용자 &gt; 시스템</text>
        <text x={280} y={284} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">이름 충돌 시 더 높은 계층이 승리</text>
      </svg>
    </div>
  );
}
