export default function TrustDecisionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">TrustDecision — 3단계 신뢰 수준</text>

        {/* 3 tier */}
        <rect x={30} y={60} width={160} height={160} rx={10}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.5} />
        <text x={110} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          FullyTrusted
        </text>
        <text x={110} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          모든 설정 적용
        </text>
        <text x={110} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ✓ hooks
        </text>
        <text x={110} y={134} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ✓ MCP 서버
        </text>
        <text x={110} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ✓ custom 슬래시
        </text>
        <text x={110} y={162} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ✓ 자동 실행
        </text>
        <text x={110} y={196} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">
          내 프로젝트
        </text>

        <rect x={200} y={60} width={160} height={160} rx={10}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={280} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          Restricted
        </text>
        <text x={280} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          플래그로 선별 제한
        </text>
        <text x={280} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          · NoHooks
        </text>
        <text x={280} y={134} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          · NoSlashCmds
        </text>
        <text x={280} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          · NoMcpServers
        </text>
        <text x={280} y={162} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          · NoAutoRun
        </text>
        <text x={280} y={196} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#f59e0b">
          외부 프로젝트
        </text>

        <rect x={370} y={60} width={160} height={160} rx={10}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.5} />
        <text x={450} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          Untrusted
        </text>
        <text x={450} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          실행 차단
        </text>
        <text x={450} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ✗ 모든 실행 금지
        </text>
        <text x={450} y={134} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ✗ 세션 시작 불가
        </text>
        <text x={450} y={196} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">
          /tmp, 외장 미디어
        </text>

        <text x={280} y={254} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">5단계 판정: 사용자 리스트 → 글로벌 패턴 → 이력 → 위험 신호 → Prompt</text>
      </svg>
    </div>
  );
}
