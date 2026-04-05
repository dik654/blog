export default function FailureClassesViz() {
  const failures = [
    { name: 'BuildFailed',      sig: 'error[E', recipe: 'Fix compile errors',  color: '#ef4444' },
    { name: 'TestFailed',       sig: 'test result: FAILED', recipe: 'Rerun + LLM analyze', color: '#f97316' },
    { name: 'MergeConflict',    sig: '<<<<<<<', recipe: 'Rebase + resolve',    color: '#f59e0b' },
    { name: 'LintWarnings',     sig: 'warning:', recipe: 'Auto-fix or ignore', color: '#eab308' },
    { name: 'Timeout',          sig: 'SIGKILL after N ms', recipe: 'Retry w/ larger cap', color: '#06b6d4' },
    { name: 'PermissionDenied', sig: 'EACCES / deny', recipe: 'Escalate to user',  color: '#8b5cf6' },
    { name: 'LLMRefused',       sig: '&quot;I cannot&quot;', recipe: 'Reformulate task', color: '#ec4899' },
    { name: 'Stalled',          sig: 'no output N min', recipe: 'Force progress ping', color: '#6366f1' },
    { name: 'Unknown',          sig: '(none above)', recipe: 'Human review',     color: '#6b7280' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">FailureClass — 9종 실패 분류 + 복구 레시피</text>

        <text x={280} y={40} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          log signature → class → recovery recipe
        </text>

        {/* 9 failure cards — 3 columns × 3 rows */}
        {failures.map((f, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 24 + col * 176;
          const y = 54 + row * 96;
          return (
            <g key={i}>
              <rect x={x} y={y} width={168} height={88} rx={6}
                fill={f.color} fillOpacity={0.1} stroke={f.color} strokeWidth={1.4} />
              <rect x={x} y={y} width={4} height={88} fill={f.color} rx={1} />

              {/* Failure class name */}
              <text x={x + 14} y={y + 20} fontSize={11} fontWeight={700} fontFamily="monospace" fill={f.color}>
                {f.name}
              </text>

              {/* Signature section */}
              <text x={x + 14} y={y + 36} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">
                LOG SIGNATURE
              </text>
              <rect x={x + 10} y={y + 40} width={148} height={18} rx={3}
                fill="var(--muted)" opacity={0.5} />
              <text x={x + 16} y={y + 53} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                {f.sig.length > 20 ? f.sig.slice(0, 19) + '…' : f.sig}
              </text>

              {/* Recovery */}
              <text x={x + 14} y={y + 70} fontSize={8.5} fontWeight={700} fill={f.color}>
                RECOVERY →
              </text>
              <text x={x + 14} y={y + 82} fontSize={9} fill="var(--foreground)">
                {f.recipe.length > 22 ? f.recipe.slice(0, 21) + '…' : f.recipe}
              </text>
            </g>
          );
        })}

        {/* Bottom note */}
        <text x={280} y={350} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          classify_failure() → signature 매칭 → FailureClass 반환 → recipe 조회
        </text>
      </svg>
    </div>
  );
}
