export default function ModeLayersViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PermissionMode 3단계 (엄격도 ↑)</text>

        {/* ReadOnly */}
        <rect x={40} y={60} width={480} height={56} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
        <text x={64} y={86} fontSize={11} fontWeight={700} fill="#10b981">ReadOnly</text>
        <text x={170} y={86} fontSize={10} fill="var(--muted-foreground)">코드 탐색·리뷰 · 읽기만</text>
        <text x={170} y={104} fontSize={9} fill="var(--muted-foreground)">read_file, grep, glob ✓ · write, bash ✗</text>

        {/* WorkspaceWrite */}
        <rect x={40} y={128} width={480} height={56} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={64} y={154} fontSize={11} fontWeight={700} fill="#f59e0b">WorkspaceWrite</text>
        <text x={200} y={154} fontSize={10} fill="var(--muted-foreground)">일반 개발 (기본값)</text>
        <text x={200} y={172} fontSize={9} fill="var(--muted-foreground)">write, edit ✓ · bash은 Prompt</text>

        {/* DangerFullAccess */}
        <rect x={40} y={196} width={480} height={56} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.2} />
        <text x={64} y={222} fontSize={11} fontWeight={700} fill="#ef4444">DangerFullAccess</text>
        <text x={210} y={222} fontSize={10} fill="var(--muted-foreground)">CI/자동화 · 모든 도구</text>
        <text x={210} y={240} fontSize={9} fill="var(--muted-foreground)">--dangerously-skip-permissions</text>
      </svg>
    </div>
  );
}
