export default function CascadeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Config Cascade — 3단계 오버라이드</text>

        <defs>
          <marker id="cc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 3 layers */}
        <rect x={35} y={58} width={490} height={40} rx={6}
          fill="#6b7280" fillOpacity={0.1} stroke="#6b7280" strokeWidth={1} />
        <text x={52} y={82} fontSize={11} fontWeight={700} fill="#6b7280">1. 시스템</text>
        <text x={280} y={82} textAnchor="middle" fontSize={9.5} fontFamily="monospace"
          fill="var(--muted-foreground)">/etc/claw/config.json</text>

        <line x1={280} y1={98} x2={280} y2={106} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#cc-arr)" />

        <rect x={35} y={110} width={490} height={40} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={52} y={134} fontSize={11} fontWeight={700} fill="#3b82f6">2. 사용자</text>
        <text x={280} y={134} textAnchor="middle" fontSize={9.5} fontFamily="monospace"
          fill="var(--muted-foreground)">~/.claw/config.json</text>

        <line x1={280} y1={150} x2={280} y2={158} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#cc-arr)" />

        <rect x={35} y={162} width={490} height={40} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={52} y={186} fontSize={11} fontWeight={700} fill="#10b981">3. 프로젝트</text>
        <text x={280} y={186} textAnchor="middle" fontSize={9.5} fontFamily="monospace"
          fill="var(--muted-foreground)">./.claw/config.json</text>

        <line x1={280} y1={202} x2={280} y2={210} stroke="#f59e0b" strokeWidth={1.4} markerEnd="url(#cc-arr)" />

        <rect x={35} y={214} width={490} height={40} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1} />
        <text x={52} y={238} fontSize={11} fontWeight={700} fill="#f59e0b">4. 환경 변수</text>
        <text x={280} y={238} textAnchor="middle" fontSize={9.5} fontFamily="monospace"
          fill="var(--muted-foreground)">CLAW_PROVIDER, CLAW_MODEL, ...</text>

        <text x={516} y={82} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">일반적</text>
        <text x={516} y={238} textAnchor="end" fontSize={8.5} fill="#f59e0b">최우선</text>

        <text x={280} y={272} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">deep-merge · 하위 계층이 상위 덮어쓰기</text>
      </svg>
    </div>
  );
}
