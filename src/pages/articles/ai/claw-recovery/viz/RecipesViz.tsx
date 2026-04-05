export default function RecipesViz() {
  const recipes = [
    { name: 'build-failure-retry', trigger: 'BuildFailed', steps: 3, color: '#ef4444' },
    { name: 'merge-conflict-rebase', trigger: 'MergeConflict', steps: 4, color: '#f59e0b' },
    { name: 'test-failure-fix', trigger: 'TestFailed', steps: 3, color: '#8b5cf6' },
    { name: 'stalled-kick', trigger: 'Stalled', steps: 1, color: '#6b7280' },
  ];

  const stepTypes = [
    { label: 'Rebase', color: '#3b82f6' },
    { label: 'ResetToHead', color: '#ef4444' },
    { label: 'SendToLLM', color: '#8b5cf6' },
    { label: 'RerunCi', color: '#f59e0b' },
    { label: 'WaitForChange', color: '#6b7280' },
    { label: 'DeleteFiles', color: '#ef4444' },
    { label: 'RunCommand', color: '#10b981' },
    { label: 'ForkLane', color: '#06b6d4' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">RecoveryRecipe — 기본 레시피 + 8종 단계</text>

        {/* Recipes */}
        {recipes.map((recipe, i) => {
          const y = 54 + i * 38;
          return (
            <g key={recipe.name}>
              <rect x={20} y={y} width={520} height={32} rx={4}
                fill={recipe.color} fillOpacity={0.08} stroke={recipe.color} strokeWidth={0.6} />
              <rect x={20} y={y} width={3} height={32} fill={recipe.color} rx={1} />
              <text x={40} y={y + 14} fontSize={10} fontFamily="monospace" fontWeight={700}
                fill={recipe.color}>{recipe.name}</text>
              <text x={40} y={y + 27} fontSize={9} fill="var(--muted-foreground)">
                trigger: {recipe.trigger} · {recipe.steps} steps
              </text>
            </g>
          );
        })}

        {/* Step types */}
        <text x={280} y={226} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          RecoveryStep — 8가지 타입
        </text>

        <g transform="translate(20, 238)">
          {stepTypes.map((step, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            return (
              <g key={step.label} transform={`translate(${col * 130}, ${row * 34})`}>
                <rect x={0} y={0} width={124} height={28} rx={3}
                  fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.5} />
                <text x={62} y={18} textAnchor="middle" fontSize={9} fontWeight={600}
                  fontFamily="monospace" fill={step.color}>{step.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
