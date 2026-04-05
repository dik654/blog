export default function PermissionDecisionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Permission 판정 플로우 — Allow · Deny · Prompt</text>

        <defs>
          <marker id="pd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={200} y={46} width={160} height={36} rx={5}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          enforcer.check(name)
        </text>

        {/* lookup mode */}
        <line x1={280} y1={82} x2={280} y2={98} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pd-arr)" />
        <rect x={150} y={100} width={260} height={36} rx={5}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={280} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          lookup PermissionMode for tool
        </text>

        {/* Branch lines */}
        <line x1={220} y1={136} x2={110} y2={160} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pd-arr)" />
        <line x1={280} y1={136} x2={280} y2={160} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#pd-arr)" />
        <line x1={340} y1={136} x2={450} y2={160} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pd-arr)" />

        {/* ReadOnly branch */}
        <rect x={30} y={162} width={160} height={50} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={110} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">ReadOnly</text>
        <text x={110} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">read-only tools only</text>

        {/* WorkspaceWrite branch (default) */}
        <rect x={200} y={162} width={160} height={50} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={2} />
        <text x={280} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">WorkspaceWrite</text>
        <text x={280} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">default · writes ok</text>

        {/* DangerFullAccess branch */}
        <rect x={370} y={162} width={160} height={50} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.5} />
        <text x={450} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">DangerFullAccess</text>
        <text x={450} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">all allowed</text>

        {/* Results arrows */}
        <line x1={110} y1={212} x2={110} y2={240} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pd-arr)" />
        <line x1={280} y1={212} x2={280} y2={240} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pd-arr)" />
        <line x1={450} y1={212} x2={450} y2={240} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pd-arr)" />

        {/* Results */}
        <rect x={30} y={244} width={160} height={42} rx={6}
          fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" strokeWidth={1.5} />
        <text x={110} y={264} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">Deny</text>
        <text x={110} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bash/write 차단</text>

        <rect x={200} y={244} width={160} height={42} rx={6}
          fill="#f59e0b" fillOpacity={0.2} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={280} y={264} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Prompt</text>
        <text x={280} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사용자 Y/N 확인</text>

        <rect x={370} y={244} width={160} height={42} rx={6}
          fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={1.5} />
        <text x={450} y={264} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Allow</text>
        <text x={450} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">즉시 실행</text>

        {/* Footer note */}
        <rect x={30} y={302} width={500} height={28} rx={5}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={320} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          예: bash — ReadOnly(Deny) · WorkspaceWrite(Prompt) · Danger(Allow)
        </text>
      </svg>
    </div>
  );
}
