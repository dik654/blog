export default function OnceLockRegistriesViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">OnceLock Singletons — 6개 전역 레지스트리</text>

        {/* OnceLock lifecycle */}
        <rect x={30} y={50} width={500} height={78} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={50} y={72} fontSize={11} fontWeight={700} fill="#3b82f6">
          OnceLock 패턴 — std::sync (표준 라이브러리)
        </text>
        <text x={50} y={92} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          static REGISTRY: OnceLock&lt;T&gt; = OnceLock::new();
        </text>
        <text x={50} y={108} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          REGISTRY.get_or_init(T::new) → &amp;&apos;static T
        </text>
        <text x={50} y={122} fontSize={9} fill="var(--muted-foreground)">
          첫 호출 시 초기화 · 이후 락 경합 없음 · 프로세스 수명 = &apos;static
        </text>

        {/* 6 registries grid (3x2) */}
        {[
          { x: 30, y: 148, name: 'TaskRegistry', desc: '하위 태스크', color: '#f59e0b' },
          { x: 200, y: 148, name: 'TeamRegistry', desc: '에이전트 팀', color: '#8b5cf6' },
          { x: 370, y: 148, name: 'CronRegistry', desc: '스케줄러', color: '#ec4899' },
          { x: 30, y: 220, name: 'WorkerRegistry', desc: '병렬 실행', color: '#10b981' },
          { x: 200, y: 220, name: 'McpRegistry', desc: 'MCP 서버', color: '#06b6d4' },
          { x: 370, y: 220, name: 'LspRegistry', desc: '언어 서버', color: '#ef4444' },
        ].map((r, i) => (
          <g key={i}>
            <rect x={r.x} y={r.y} width={160} height={58} rx={6}
              fill={r.color} fillOpacity={0.15} stroke={r.color} strokeWidth={1.3} />
            <text x={r.x + 80} y={r.y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={r.color}>
              {r.name}
            </text>
            <text x={r.x + 80} y={r.y + 38} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {r.desc}
            </text>
            <text x={r.x + 80} y={r.y + 50} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
              global_*()
            </text>
          </g>
        ))}

        {/* Footer: lifecycle note */}
        <rect x={30} y={298} width={500} height={18} rx={4}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={311} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          프로세스 종료 = 모든 레지스트리 해제 — &quot;프로세스 = 세션&quot; 모델
        </text>
      </svg>
    </div>
  );
}
