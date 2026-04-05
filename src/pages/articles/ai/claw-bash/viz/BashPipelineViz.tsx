export default function BashPipelineViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">execute_bash() — 7단계 파이프라인</text>

        <defs>
          <marker id="bp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { label: '1. 입력 파싱', sub: 'BashCommandInput', color: '#3b82f6' },
          { label: '2. 6단계 검증', sub: 'BashValidator', color: '#ef4444' },
          { label: '3. 샌드박스 결정', sub: 'bubblewrap 가용성', color: '#8b5cf6' },
          { label: '4. 서브프로세스 실행', sub: 'tokio::process', color: '#f59e0b' },
          { label: '5. 타임아웃 감시', sub: '기본 120s', color: '#f59e0b' },
          { label: '6. 출력 절단', sub: 'stdout 8KB / stderr 4KB', color: '#10b981' },
          { label: '7. 결과 반환', sub: 'ToolOutput', color: '#10b981' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={90} y={50 + i * 38} width={380} height={32} rx={4}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.6} />
            <rect x={90} y={50 + i * 38} width={3} height={32} fill={step.color} rx={1} />
            <text x={108} y={70 + i * 38} fontSize={11} fontWeight={700}
              fill={step.color}>{step.label}</text>
            <text x={456} y={70 + i * 38} textAnchor="end" fontSize={9} fontFamily="monospace"
              fill="var(--muted-foreground)">{step.sub}</text>
            {i < 6 && (
              <line x1={280} y1={82 + i * 38} x2={280} y2={88 + i * 38}
                stroke="#3b82f6" strokeWidth={1} markerEnd="url(#bp-arr)" />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
