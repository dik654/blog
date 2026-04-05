import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function PolicyArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PolicyEngine 아키텍처</text>

        <defs>
          <marker id="pa-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Engine */}
        <ModuleBox x={205} y={58} w={150} h={58}
          label="PolicyEngine"
          sub="30초 평가 루프"
          color="#8b5cf6" />

        {/* Inputs */}
        <DataBox x={30} y={62} w={130} h={48}
          label="PolicyRule[]"
          sub="YAML 선언"
          color="#3b82f6" />

        <DataBox x={400} y={62} w={130} h={48}
          label="Lane[]"
          sub="현재 상태 목록"
          color="#f59e0b" />

        <line x1={160} y1={86} x2={205} y2={86} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pa-arr)" />
        <line x1={400} y1={86} x2={355} y2={86} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pa-arr)" />

        {/* Evaluate */}
        <ActionBox x={205} y={140} w={150} h={46}
          label="evaluate_lane()"
          sub="규칙 매칭 → 액션"
          color="#10b981" />

        <line x1={280} y1={116} x2={280} y2={140} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pa-arr)" />

        {/* Actions */}
        <text x={280} y={216} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          6종 액션
        </text>

        <g transform="translate(20, 228)">
          {[
            { label: 'Transition', color: '#3b82f6' },
            { label: 'SpawnLane', color: '#10b981' },
            { label: 'MergeBranch', color: '#8b5cf6' },
            { label: 'Abandon', color: '#ef4444' },
            { label: 'Notify', color: '#f59e0b' },
            { label: 'RunCommand', color: '#6b7280' },
          ].map((action, i) => (
            <g key={action.label} transform={`translate(${i * 87}, 0)`}>
              <rect x={0} y={0} width={82} height={28} rx={3}
                fill={action.color} fillOpacity={0.15} stroke={action.color} strokeWidth={0.5} />
              <text x={41} y={19} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={action.color}>{action.label}</text>
            </g>
          ))}
        </g>

        <text x={280} y={292} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">first-match 정책 · 조건 만족 시 액션 실행 · 이벤트 로그</text>
      </svg>
    </div>
  );
}
