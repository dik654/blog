import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

export default function RecoveryFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">RecoveryEngine — 5단계 복구 흐름</text>

        <defs>
          <marker id="rf-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Failure input */}
        <AlertBox x={20} y={62} w={130} h={46}
          label="FailureInfo"
          sub="build log, error"
          color="#ef4444" />

        {/* Classify */}
        <ActionBox x={170} y={62} w={130} h={46}
          label="classify_failure"
          sub="9 카테고리"
          color="#f59e0b" />

        {/* Match recipe */}
        <ActionBox x={320} y={62} w={120} h={46}
          label="find_recipe"
          sub="매칭 선택"
          color="#3b82f6" />

        {/* Check limits */}
        <ActionBox x={460} y={62} w={80} h={46}
          label="check"
          sub="limits"
          color="#8b5cf6" />

        <line x1={150} y1={85} x2={170} y2={85} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />
        <line x1={300} y1={85} x2={320} y2={85} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />
        <line x1={440} y1={85} x2={460} y2={85} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />

        {/* Execute recipe */}
        <ActionBox x={180} y={140} w={200} h={46}
          label="recipe.execute()"
          sub="단계 순차 실행"
          color="#10b981" />

        <line x1={280} y1={108} x2={280} y2={140} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />

        {/* Outcomes */}
        <DataBox x={20} y={220} w={120} h={42}
          label="Succeeded"
          sub="정상 복구"
          color="#10b981" />
        <DataBox x={150} y={220} w={125} h={42}
          label="Partial"
          sub="일부 단계 성공"
          color="#f59e0b" />
        <DataBox x={285} y={220} w={125} h={42}
          label="Failed"
          sub="재시도 후 포기"
          color="#ef4444" />
        <AlertBox x={420} y={220} w={125} h={42}
          label="Escalated"
          sub="사람 개입 요청"
          color="#ef4444" />

        <line x1={210} y1={186} x2={80} y2={220} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={250} y1={186} x2={212} y2={220} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={310} y1={186} x2={347} y2={220} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={350} y1={186} x2={482} y2={220} stroke="var(--border)" strokeWidth={0.5} />

        <text x={280} y={298} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">재시도 한계: 레시피별 3회, Lane별 10회 · 60초 쿨다운</text>
      </svg>
    </div>
  );
}
