import { AlertBox, ActionBox } from '@/components/viz/boxes';

export default function SymlinkEscapeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">심링크 이스케이프 공격 방어</text>

        {/* 공격 시나리오 */}
        <AlertBox x={30} y={56} w={240} h={52}
          label="공격 시나리오"
          sub="workspace/link → /etc/passwd"
          color="#ef4444" />

        {/* 1차 검증 (통과) */}
        <rect x={290} y={56} width={240} height={52} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1} />
        <text x={410} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          1차 검증: 문자열 비교
        </text>
        <text x={410} y={96} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          path.starts_with(workspace) → OK (우회)
        </text>

        {/* 2차 검증 (차단) */}
        <rect x={30} y={128} width={500} height={68} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={280} y={150} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          2차 검증: canonicalize() 호출
        </text>
        <text x={280} y={168} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          실제 경로 해석: workspace/link → /etc/passwd
        </text>
        <text x={280} y={184} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
          !canonical.starts_with(workspace) → Deny
        </text>

        {/* 3중 방어 */}
        <rect x={30} y={216} width={500} height={72} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={236} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">3중 방어 (Defense in depth)</text>

        <g transform="translate(48, 246)">
          <text x={0} y={12} fontSize={9} fontWeight={600} fill="#3b82f6">1. 문자열 검증:</text>
          <text x={98} y={12} fontSize={9} fill="var(--muted-foreground)">빠른 사전 차단 (90%)</text>

          <text x={250} y={12} fontSize={9} fontWeight={600} fill="#8b5cf6">2. canonicalize:</text>
          <text x={352} y={12} fontSize={9} fill="var(--muted-foreground)">심링크 해제</text>

          <text x={0} y={30} fontSize={9} fontWeight={600} fill="#ef4444">3. 샌드박스:</text>
          <text x={82} y={30} fontSize={9} fill="var(--muted-foreground)">커널 레벨 bind mount (bash 도구만)</text>
        </g>
      </svg>
    </div>
  );
}
