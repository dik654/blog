import { ActionBox, AlertBox } from '@/components/viz/boxes';

export default function PrePostFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 350" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Pre/Post Hook 흐름</text>

        <defs>
          <marker id="pph-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Flow steps */}
        <ActionBox x={200} y={54} w={160} h={34}
          label="LLM tool_use"
          sub=""
          color="#8b5cf6" />
        <line x1={280} y1={88} x2={280} y2={96} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pph-arr)" />

        <ActionBox x={200} y={98} w={160} h={34}
          label="1. Enforcer.check()"
          sub="기본 권한 게이트"
          color="#ef4444" />
        <line x1={280} y1={132} x2={280} y2={140} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pph-arr)" />

        <ActionBox x={200} y={142} w={160} h={34}
          label="2. PreToolUse hook"
          sub="사용자 커스텀 검증"
          color="#3b82f6" />
        <line x1={280} y1={176} x2={280} y2={184} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pph-arr)" />

        <ActionBox x={200} y={186} w={160} h={34}
          label="3. execute_tool()"
          sub="실제 도구 실행"
          color="#f59e0b" />
        <line x1={280} y1={220} x2={280} y2={228} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pph-arr)" />

        <ActionBox x={200} y={230} w={160} h={34}
          label="4. PostToolUse hook"
          sub="경고·로깅"
          color="#10b981" />
        <line x1={280} y1={264} x2={280} y2={272} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pph-arr)" />

        <ActionBox x={200} y={274} w={160} h={34}
          label="5. tool_result"
          sub="LLM 반환"
          color="#10b981" />

        {/* 차단 경로 */}
        <AlertBox x={400} y={137} w={140} h={44}
          label="Deny/Abort"
          sub="Pre만 가능"
          color="#ef4444" />
        <line x1={360} y1={159} x2={400} y2={159} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#pph-arr)" />

        <text x={30} y={159} textAnchor="start" fontSize={9} fill="var(--muted-foreground)">차단</text>
        <text x={30} y={247} textAnchor="start" fontSize={9} fill="var(--muted-foreground)">이후 차단 불가</text>

        <text x={280} y={336} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">Pre = 보안 게이트 · Post = 감사 로그</text>
      </svg>
    </div>
  );
}
