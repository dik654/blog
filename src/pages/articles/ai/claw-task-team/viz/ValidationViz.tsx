export default function ValidationViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">3단계 검증 계층</text>

        <defs>
          <marker id="val-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          {
            stage: '1단계: 생성 시',
            fn: 'validate()',
            check: '스키마 · 일관성 · 순환 의존',
            color: '#3b82f6',
          },
          {
            stage: '2단계: 실행 시',
            fn: 'resolve_scope()',
            check: '권한 · 허용 파일 범위',
            color: '#f59e0b',
          },
          {
            stage: '3단계: 완료 시',
            fn: 'check_completion()',
            check: 'Goal completion_check 실행',
            color: '#10b981',
          },
        ].map((layer, i) => {
          const y = 62 + i * 76;
          return (
            <g key={i}>
              <rect x={30} y={y} width={500} height={60} rx={8}
                fill={layer.color} fillOpacity={0.1} stroke={layer.color} strokeWidth={1} />
              <rect x={30} y={y} width={4} height={60} fill={layer.color} rx={2} />
              <text x={52} y={y + 23} fontSize={11} fontWeight={700} fill={layer.color}>
                {layer.stage}
              </text>
              <text x={52} y={y + 44} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                {layer.fn}
              </text>
              <text x={520} y={y + 34} textAnchor="end" fontSize={9.5}
                fill="var(--muted-foreground)">{layer.check}</text>
              {i < 2 && (
                <line x1={280} y1={y + 60} x2={280} y2={y + 68}
                  stroke="#3b82f6" strokeWidth={1} markerEnd="url(#val-arr)" />
              )}
            </g>
          );
        })}

        <text x={280} y={300} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">각 단계 실패 원인 명확 → 사용자가 무엇을 고쳐야 할지 명확</text>
      </svg>
    </div>
  );
}
