export default function PermissionResultViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PermissionEnforcer — 3가지 EnforcementResult</text>

        <defs>
          <marker id="pr-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={160} y={50} width={240} height={36} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={73} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          enforce_permission_check(tool, input)
        </text>

        <line x1={280} y1={88} x2={280} y2={108} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pr-arr)" />

        {/* 3 branches */}
        <line x1={280} y1={108} x2={105} y2={130} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#pr-arr)" />
        <line x1={280} y1={108} x2={280} y2={130} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#pr-arr)" />
        <line x1={280} y1={108} x2={455} y2={130} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#pr-arr)" />

        {/* Allow */}
        <rect x={22} y={132} width={165} height={110} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2} />
        <text x={105} y={155} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          Allow
        </text>
        <text x={105} y={178} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          즉시 실행
        </text>
        <line x1={40} y1={188} x2={170} y2={188} stroke="#10b981" strokeOpacity={0.3} strokeWidth={1} />
        <text x={105} y={206} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          AllowAll +
        </text>
        <text x={105} y={220} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          read-only tool
        </text>
        <text x={105} y={234} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          → execute now
        </text>

        {/* Deny */}
        <rect x={197} y={132} width={165} height={110} rx={8}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={2} />
        <text x={280} y={155} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
          Deny(reason)
        </text>
        <text x={280} y={178} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          실행 거부
        </text>
        <line x1={215} y1={188} x2={345} y2={188} stroke="#ef4444" strokeOpacity={0.3} strokeWidth={1} />
        <text x={280} y={206} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          ReadOnly +
        </text>
        <text x={280} y={220} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          write_file
        </text>
        <text x={280} y={234} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          → LLM retry
        </text>

        {/* Prompt */}
        <rect x={372} y={132} width={165} height={110} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2} />
        <text x={455} y={155} textAnchor="middle" fontSize={13} fontWeight={700} fill="#f59e0b">
          Prompt
        </text>
        <text x={455} y={178} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          사용자 Y/N
        </text>
        <line x1={390} y1={188} x2={520} y2={188} stroke="#f59e0b" strokeOpacity={0.3} strokeWidth={1} />
        <text x={455} y={206} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          WS-Write +
        </text>
        <text x={455} y={220} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          bash
        </text>
        <text x={455} y={234} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          → confirm dialog
        </text>

        {/* Footer */}
        <rect x={30} y={258} width={500} height={46} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={276} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          --dangerously-skip-permissions flag
        </text>
        <text x={280} y={293} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          모든 Prompt → Allow 변환 (CI/CD 자동화용)
        </text>
      </svg>
    </div>
  );
}
