import { ActionBox } from '@/components/viz/boxes';

export default function EnforcerViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PermissionEnforcer — 5단계 판정 순서</text>

        <defs>
          <marker id="en-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 도구 호출 입력 */}
        <ActionBox x={20} y={118} w={100} h={46}
          label="execute_tool"
          sub="(name, input)"
          color="#8b5cf6" />

        <line x1={120} y1={141} x2={138} y2={141} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#en-arr)" />

        {/* 단계들 */}
        {[
          { n1: '1. Policy', n2: '평가', color: '#3b82f6' },
          { n1: '2. Mode', n2: '비교', color: '#8b5cf6' },
          { n1: '3. 경로', n2: '검증', color: '#f59e0b' },
          { n1: '4. Command', n2: 'intent', color: '#10b981' },
          { n1: '5. 차액', n2: '판정', color: '#ef4444' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={140 + i * 82} y={118} width={78} height={46} rx={4}
              fill={step.color} fillOpacity={0.15} stroke={step.color} strokeWidth={0.8} />
            <text x={140 + i * 82 + 39} y={137} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={step.color}>{step.n1}</text>
            <text x={140 + i * 82 + 39} y={152} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={step.color}>{step.n2}</text>
            {i < 4 && (
              <line x1={218 + i * 82} y1={141} x2={222 + i * 82} y2={141}
                stroke="#3b82f6" strokeWidth={1} markerEnd="url(#en-arr)" />
            )}
          </g>
        ))}

        {/* 결과 */}
        <rect x={70} y={200} width={140} height={48} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1} />
        <text x={140} y={222} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Allow</text>
        <text x={140} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">즉시 실행</text>

        <rect x={220} y={200} width={140} height={48} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1} />
        <text x={290} y={222} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Prompt</text>
        <text x={290} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사용자 확인</text>

        <rect x={370} y={200} width={140} height={48} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1} />
        <text x={440} y={222} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">Deny</text>
        <text x={440} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실행 거부</text>

        <text x={280} y={285} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">각 단계 실패 시 즉시 종료 (early exit) · 조기 Deny 반환</text>
      </svg>
    </div>
  );
}
