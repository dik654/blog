import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

export default function HookRunnerViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">HookRunner — 3종 훅 이벤트</text>

        {/* Pre-tool */}
        <rect x={30} y={58} width={160} height={110} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={110} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">PreToolUse</text>
        <text x={110} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">도구 실행 전</text>
        <text x={110} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">차단 가능</text>
        <text x={110} y={144} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Allow/Deny/Prompt</text>

        {/* Post-tool */}
        <rect x={200} y={58} width={160} height={110} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={280} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">PostToolUse</text>
        <text x={280} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">도구 실행 후</text>
        <text x={280} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">경고·로깅만</text>
        <text x={280} y={144} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">차단 불가</text>

        {/* UserPrompt */}
        <rect x={370} y={58} width={160} height={110} rx={8}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={450} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">UserPromptSubmit</text>
        <text x={450} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사용자 입력 시</text>
        <text x={450} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">수정·거부 가능</text>
        <text x={450} y={144} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">modified_input</text>

        {/* 하단 응답 옵션 */}
        <rect x={30} y={186} width={500} height={72} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={206} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">4가지 응답 타입</text>

        <g transform="translate(50, 216)">
          {[
            { label: 'allow', color: '#10b981' },
            { label: 'deny', color: '#ef4444' },
            { label: 'prompt', color: '#f59e0b' },
            { label: 'skip', color: '#6b7280' },
          ].map((r, i) => (
            <g key={r.label} transform={`translate(${i * 118}, 0)`}>
              <rect x={0} y={0} width={106} height={30} rx={4}
                fill={r.color} fillOpacity={0.15} stroke={r.color} strokeWidth={0.8} />
              <text x={53} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={r.color}>{r.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
