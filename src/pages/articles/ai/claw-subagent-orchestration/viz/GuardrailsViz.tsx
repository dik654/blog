export default function GuardrailsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Sub-agent Guardrails — 일탈 방지 메커니즘</text>

        {/* 4 guardrail layers */}
        {[
          { y: 50, title: 'Guard 1 · Token Budget Cap', desc: 'Worker별 max tokens 설정 · 초과 시 강제 종료', color: '#ef4444' },
          { y: 120, title: 'Guard 2 · Tool Allowlist', desc: 'Worker 타입별 허용 도구만 · Agent 재귀 금지', color: '#f59e0b' },
          { y: 190, title: 'Guard 3 · Scope Restriction', desc: 'Worker는 Main context 모름 · 명시적 prompt만', color: '#8b5cf6' },
          { y: 260, title: 'Guard 4 · Result Validation', desc: 'Worker 출력 format 검증 · 비정상 결과 거부', color: '#10b981' },
        ].map((g, i) => (
          <g key={i}>
            <rect x={30} y={g.y} width={500} height={58} rx={8}
              fill={g.color} fillOpacity={0.15} stroke={g.color} strokeWidth={1.8} />
            <text x={50} y={g.y + 25} fontSize={12} fontWeight={700} fill={g.color}>
              {g.title}
            </text>
            <text x={50} y={g.y + 45} fontSize={10} fill="var(--muted-foreground)">
              {g.desc}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
