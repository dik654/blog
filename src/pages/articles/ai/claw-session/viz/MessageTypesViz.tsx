export default function MessageTypesViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Session Message 타입 계층</text>

        {/* User message */}
        <rect x={30} y={50} width={165} height={100} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={112} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          User
        </text>
        <text x={112} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">role: user</text>
        <text x={112} y={106} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">content: Vec&lt;Block&gt;</text>
        <text x={112} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">text · tool_result</text>
        <text x={112} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">· image · pdf</text>

        {/* Assistant message */}
        <rect x={200} y={50} width={165} height={100} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.8} />
        <text x={282} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Assistant
        </text>
        <text x={282} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">role: assistant</text>
        <text x={282} y={106} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">content: Vec&lt;Block&gt;</text>
        <text x={282} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">text · tool_use</text>
        <text x={282} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">· thinking</text>

        {/* System message */}
        <rect x={370} y={50} width={160} height={100} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={450} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          System
        </text>
        <text x={450} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">prepended to req</text>
        <text x={450} y={106} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">prompt_builder</text>
        <text x={450} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">instructions</text>
        <text x={450} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">tool specs · memory</text>

        {/* Content Block types */}
        <rect x={30} y={170} width={500} height={188} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={192} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          ContentBlock 타입들
        </text>

        {[
          { label: 'Text', desc: '일반 텍스트', color: '#6366f1' },
          { label: 'ToolUse', desc: 'LLM → 도구 호출', color: '#10b981' },
          { label: 'ToolResult', desc: '도구 결과 → LLM', color: '#3b82f6' },
          { label: 'Thinking', desc: 'Extended thinking', color: '#8b5cf6' },
          { label: 'Image', desc: 'PNG/JPG 이미지', color: '#ec4899' },
          { label: 'Pdf', desc: 'PDF 문서', color: '#f97316' },
          { label: 'Document', desc: 'Text 문서', color: '#06b6d4' },
          { label: 'Redacted', desc: '민감 정보 제거', color: '#ef4444' },
        ].map((b, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 50 + col * 120;
          const y = 208 + row * 68;
          return (
            <g key={i}>
              <rect x={x} y={y} width={108} height={54} rx={5}
                fill={b.color} fillOpacity={0.15} stroke={b.color} strokeWidth={1.3} />
              <text x={x + 54} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={b.color}>
                {b.label}
              </text>
              <text x={x + 54} y={y + 40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {b.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
