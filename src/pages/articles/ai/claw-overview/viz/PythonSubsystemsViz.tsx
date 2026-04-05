export default function PythonSubsystemsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">20개 Python 서브시스템 인벤토리</text>
        <text x={280} y={40} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          원본 TypeScript 아카이브 모듈 구조를 미러링 · src/subsystems/
        </text>

        {/* 4 columns × 5 rows layout with proper spacing */}
        {[
          { name: 'conversation', desc: '대화 루프', color: '#ef4444' },
          { name: 'auth', desc: 'OAuth 2.0', color: '#f59e0b' },
          { name: 'tools', desc: '도구 레지스트리', color: '#10b981' },
          { name: 'mcp', desc: 'MCP 브릿지', color: '#3b82f6' },

          { name: 'session', desc: '세션 상태', color: '#8b5cf6' },
          { name: 'hooks', desc: 'pre/post exec', color: '#ec4899' },
          { name: 'permissions', desc: '권한 정책', color: '#06b6d4' },
          { name: 'compact', desc: '압축 엔진', color: '#84cc16' },

          { name: 'plugins', desc: '플러그인', color: '#f97316' },
          { name: 'commands', desc: '슬래시 cmd', color: '#6366f1' },
          { name: 'api', desc: 'API 클라이언트', color: '#14b8a6' },
          { name: 'telemetry', desc: '추적 · 비용', color: '#a855f7' },

          { name: 'policy', desc: '정책 엔진', color: '#db2777' },
          { name: 'recovery', desc: '복구 레시피', color: '#0ea5e9' },
          { name: 'tasks', desc: 'TaskPacket', color: '#d946ef' },
          { name: 'teams', desc: '팀 관리', color: '#f43f5e' },

          { name: 'cron', desc: '크론 스케줄', color: '#eab308' },
          { name: 'workers', desc: '워커 부트', color: '#22c55e' },
          { name: 'lsp', desc: 'LSP 통합', color: '#78716c' },
          { name: 'ui', desc: '터미널 렌더', color: '#94a3b8' },
        ].map((s, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 30 + col * 130;
          const y = 60 + row * 58;
          return (
            <g key={i}>
              <rect x={x} y={y} width={120} height={48} rx={5}
                fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={1.3} />
              <text x={x + 60} y={y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={s.color}>
                {s.name}
              </text>
              <text x={x + 60} y={y + 38} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {s.desc}
              </text>
            </g>
          );
        })}

        {/* Note at bottom */}
        <text x={280} y={368} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">
          각 서브시스템 = QueryEnginePort.query("namespace.key") 로 접근
        </text>
      </svg>
    </div>
  );
}
