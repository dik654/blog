import { ActionBox, AlertBox } from '@/components/viz/boxes';

export default function DispatchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 350" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">handle_tool_use() — 5단계 파이프라인</text>

        <defs>
          <marker id="dp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 입력 */}
        <ActionBox x={20} y={55} w={140} h={46}
          label="LLM 응답"
          sub="tool_use block"
          color="#8b5cf6" />

        <line x1={160} y1={78} x2={184} y2={78} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#dp-arr)" />

        {/* 5단계 */}
        {[
          { label: '1. 권한 게이트', sub: 'Enforcer.check()', color: '#ef4444' },
          { label: '2. Pre-hook', sub: 'hooks.pre_tool()', color: '#f59e0b' },
          { label: '3. 디스패치', sub: 'execute_tool()', color: '#3b82f6' },
          { label: '4. Post-hook', sub: 'hooks.post_tool()', color: '#f59e0b' },
          { label: '5. 세션 로그', sub: 'log_tool_call()', color: '#10b981' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={184} y={58 + i * 52} width={192} height={40} rx={6}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
            <rect x={184} y={58 + i * 52} width={3} height={40} fill={step.color} rx={1} />
            <text x={280} y={77 + i * 52} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={step.color}>{step.label}</text>
            <text x={280} y={91 + i * 52} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{step.sub}</text>
            {i < 4 && (
              <line x1={280} y1={98 + i * 52} x2={280} y2={110 + i * 52}
                stroke="#3b82f6" strokeWidth={1} markerEnd="url(#dp-arr)" />
            )}
          </g>
        ))}

        {/* 출력 */}
        <ActionBox x={400} y={148} w={140} h={46}
          label="tool_result"
          sub="LLM에 반환"
          color="#10b981" />

        <line x1={376} y1={171} x2={400} y2={171} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#dp-arr)" />

        {/* Deny 경로 */}
        <AlertBox x={400} y={55} w={140} h={42}
          label="Deny 경로"
          sub="Error 반환"
          color="#ef4444" />
        <line x1={376} y1={72} x2={400} y2={72} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" markerEnd="url(#dp-arr)" />

        <text x={280} y={336} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">각 단계 독립 · Pre-hook abort 시 디스패치 스킵</text>
      </svg>
    </div>
  );
}
