import { ActionBox, AlertBox } from '@/components/viz/boxes';

export default function ReplLoopViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">REPL Loop — 사용자 입력 처리</text>

        <defs>
          <marker id="rl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Loop */}
        <ActionBox x={210} y={60} w={140} h={42}
          label="프롬프트 표시"
          sub='"> "'
          color="#3b82f6" />

        <line x1={280} y1={102} x2={280} y2={114} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#rl-arr)" />

        <ActionBox x={186} y={118} w={188} h={42}
          label="read_user_input()"
          sub="rustyline DefaultEditor"
          color="#8b5cf6" />

        <line x1={280} y1={160} x2={280} y2={172} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#rl-arr)" />

        {/* 분기 */}
        <ActionBox x={45} y={176} w={150} h={48}
          label="슬래시 명령?"
          sub="/로 시작"
          color="#f59e0b" />

        <ActionBox x={218} y={176} w={124} h={48}
          label="일반 입력"
          sub="LLM turn"
          color="#10b981" />

        <AlertBox x={365} y={176} w={150} h={48}
          label="Ctrl+D / /exit"
          sub="종료"
          color="#ef4444" />

        <line x1={232} y1={160} x2={120} y2={176} stroke="#f59e0b" strokeWidth={1.1} markerEnd="url(#rl-arr)" />
        <line x1={280} y1={160} x2={280} y2={176} stroke="#10b981" strokeWidth={1.1} markerEnd="url(#rl-arr)" />
        <line x1={328} y1={160} x2={440} y2={176} stroke="#ef4444" strokeWidth={1.1} markerEnd="url(#rl-arr)" />

        {/* 루프 백 */}
        <path d="M 120 224 Q 90 258 280 263 Q 280 263 280 102" stroke="#3b82f6" strokeWidth={1.1}
          fill="none" strokeDasharray="5 3" markerEnd="url(#rl-arr)" />
        <text x={92} y={256} fontSize={8.5} fill="var(--muted-foreground)">다시 loop</text>

        <path d="M 280 224 Q 280 258 280 263" stroke="#3b82f6" strokeWidth={1.1}
          fill="none" strokeDasharray="5 3" />

        <text x={280} y={290} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">멀티라인 입력: ``` ... ``` 블록</text>
      </svg>
    </div>
  );
}
