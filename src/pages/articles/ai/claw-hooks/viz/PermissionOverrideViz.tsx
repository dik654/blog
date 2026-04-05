export default function PermissionOverrideViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">훅 권한 병합 규칙 — 보안 불변성</text>

        {/* 허용 방향 */}
        <rect x={30} y={56} width={240} height={110} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={150} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          ✓ 허용 (강화 방향)
        </text>
        <g transform="translate(48, 90)">
          <text x={0} y={12} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
            Allow → Deny
          </text>
          <text x={0} y={28} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
            Allow → Prompt
          </text>
          <text x={0} y={44} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
            Prompt → Deny
          </text>
          <text x={0} y={62} fontSize={9} fontStyle="italic" fill="#10b981">
            엄격해지는 방향만 가능
          </text>
        </g>

        {/* 금지 방향 */}
        <rect x={290} y={56} width={240} height={110} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.2} />
        <text x={410} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          ✗ 금지 (약화 방향)
        </text>
        <g transform="translate(308, 90)">
          <text x={0} y={12} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
            Deny → Allow
          </text>
          <text x={0} y={28} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
            Prompt → Allow
          </text>
          <text x={0} y={44} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
            Deny → Prompt
          </text>
          <text x={0} y={62} fontSize={9} fontStyle="italic" fill="#ef4444">
            보안 약화 불가
          </text>
        </g>

        {/* 원칙 */}
        <rect x={30} y={186} width={500} height={96} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={208} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">핵심 보안 원칙</text>
        <text x={280} y={230} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#ef4444">
          &quot;악의적 훅이 시스템 보안을 약화시키지 못한다&quot;
        </text>
        <text x={280} y={250} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">
          기본 Enforcer가 Deny → 훅은 무조건 Deny (뒤집기 불가)
        </text>
        <text x={280} y={266} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">
          훅이 Allow 응답해도 base Deny 우선
        </text>
      </svg>
    </div>
  );
}
