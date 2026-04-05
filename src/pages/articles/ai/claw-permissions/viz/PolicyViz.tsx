export default function PolicyViz() {
  const rules = [
    { matcher: 'write_file: .env*', action: 'Deny', color: '#ef4444', reason: '.env 수정 금지' },
    { matcher: 'read_file: **/*.pem', action: 'Deny', color: '#ef4444', reason: '개인 키 접근 금지' },
    { matcher: 'bash: rm -rf *', action: 'Deny', color: '#ef4444', reason: '대량 삭제 금지' },
    { matcher: 'bash: sudo *', action: 'Prompt', color: '#f59e0b', reason: 'sudo 확인' },
    { matcher: 'bash: *', action: 'Prompt', color: '#f59e0b', reason: '모든 bash 확인' },
    { matcher: '(default)', action: 'Allow', color: '#10b981', reason: '' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PermissionPolicy — first-match 규칙 평가</text>

        {/* 헤더 */}
        <rect x={20} y={48} width={520} height={28} fill="var(--muted)" rx={4} />
        <text x={180} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Matcher</text>
        <text x={380} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Action</text>
        <text x={490} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">평가 순서</text>

        {/* 규칙들 */}
        {rules.map((rule, i) => {
          const y = 84 + i * 36;
          return (
            <g key={i}>
              <rect x={20} y={y} width={520} height={32} rx={4}
                fill={rule.color} fillOpacity={0.05} stroke={rule.color} strokeWidth={0.5} />
              <rect x={20} y={y} width={3} height={32} fill={rule.color} rx={1} />

              <text x={40} y={y + 14} fontSize={9.5} fontWeight={600} fill="var(--foreground)">{rule.matcher}</text>
              <text x={40} y={y + 26} fontSize={8.5} fill="var(--muted-foreground)">{rule.reason}</text>

              <text x={380} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={rule.color}>{rule.action}</text>

              <text x={490} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">{i + 1}</text>
            </g>
          );
        })}

        <text x={280} y={316} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">구체적 → 일반적 순서 · 첫 매칭이 최종</text>
      </svg>
    </div>
  );
}
