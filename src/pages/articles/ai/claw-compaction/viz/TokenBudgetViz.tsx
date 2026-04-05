export default function TokenBudgetViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Token Budget — 200K 컨텍스트 활용</text>

        {/* Labels for top bar */}
        <text x={30} y={58} fontSize={10} fontWeight={700} fill="var(--foreground)">Context Window (200K)</text>
        <text x={530} y={58} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">claude-opus-4-6</text>

        {/* Context window bar */}
        <rect x={30} y={68} width={500} height={50} rx={4}
          fill="var(--muted)" stroke="var(--border)" strokeWidth={1} />

        {/* System prompt (~5K) */}
        <rect x={30} y={68} width={15} height={50}
          fill="#6366f1" fillOpacity={0.6} stroke="#6366f1" strokeWidth={1} />

        {/* Tools (~8K) */}
        <rect x={45} y={68} width={22} height={50}
          fill="#10b981" fillOpacity={0.6} stroke="#10b981" strokeWidth={1} />

        {/* Accumulated messages (~120K) */}
        <rect x={67} y={68} width={300} height={50}
          fill="#3b82f6" fillOpacity={0.6} stroke="#3b82f6" strokeWidth={1} />
        <text x={217} y={97} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">Messages accumulated (120K · 60%)</text>

        {/* Safety margin (~27K) */}
        <rect x={367} y={68} width={68} height={50}
          fill="#f59e0b" fillOpacity={0.4} stroke="#f59e0b" strokeWidth={1} />

        {/* Response reserve (~40K) */}
        <rect x={435} y={68} width={95} height={50}
          fill="#ec4899" fillOpacity={0.4} stroke="#ec4899" strokeWidth={1} />

        {/* Trigger threshold */}
        <line x1={367} y1={56} x2={367} y2={128} stroke="#ef4444" strokeWidth={2.5} strokeDasharray="4 2" />
        <text x={367} y={51} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">⚠ trigger at 70%</text>

        {/* Labels below bar */}
        <text x={37} y={135} fontSize={9} fill="var(--muted-foreground)">System 5K</text>
        <text x={56} y={145} fontSize={9} fill="var(--muted-foreground)">Tools 8K</text>
        <text x={400} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Safety 27K</text>
        <text x={482} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Response 40K</text>

        {/* Arrow */}
        <line x1={280} y1={165} x2={280} y2={190} stroke="#8b5cf6" strokeWidth={2} />
        <text x={280} y={182} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">compact</text>
        <polygon points="275,188 280,198 285,188" fill="#8b5cf6" />

        {/* Labels for bottom bar */}
        <text x={30} y={216} fontSize={10} fontWeight={700} fill="var(--foreground)">After compaction</text>

        {/* Compaction result bar */}
        <rect x={30} y={226} width={500} height={50} rx={4}
          fill="var(--muted)" stroke="var(--border)" strokeWidth={1} />

        <rect x={30} y={226} width={15} height={50}
          fill="#6366f1" fillOpacity={0.6} stroke="#6366f1" strokeWidth={1} />
        <rect x={45} y={226} width={22} height={50}
          fill="#10b981" fillOpacity={0.6} stroke="#10b981" strokeWidth={1} />

        {/* Summary */}
        <rect x={67} y={226} width={52} height={50}
          fill="#8b5cf6" fillOpacity={0.6} stroke="#8b5cf6" strokeWidth={1} />
        <text x={93} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">Summary</text>
        <text x={93} y={263} textAnchor="middle" fontSize={9} fill="#fff">20K</text>

        {/* Recent messages kept */}
        <rect x={119} y={226} width={78} height={50}
          fill="#3b82f6" fillOpacity={0.6} stroke="#3b82f6" strokeWidth={1} />
        <text x={158} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">Recent</text>
        <text x={158} y={263} textAnchor="middle" fontSize={9} fill="#fff">30K</text>

        {/* Free space */}
        <text x={363} y={255} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
          freed ~70K tokens
        </text>

        <text x={280} y={300} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">
          compaction = 최근 메시지 유지 + 과거 대화 20K summary로 압축
        </text>
      </svg>
    </div>
  );
}
