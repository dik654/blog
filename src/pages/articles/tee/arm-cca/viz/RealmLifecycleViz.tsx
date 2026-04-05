export default function RealmLifecycleViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Realm 생성 시퀀스 (Host → RMM → EL3)</text>

        <defs>
          <marker id="rl-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Steps */}
        {[
          { y: 45, title: 'Step 1: Granule Delegate', detail: 'Host → RMI_GRANULE_DELEGATE → RMM → SMC → EL3', color: '#3b82f6' },
          { y: 78, title: 'Step 2: Realm Create', detail: 'RMI_REALM_CREATE(rd, params) — RD 초기화, RIPAS 설정', color: '#10b981' },
          { y: 111, title: 'Step 3: RTT Create', detail: 'RMI_RTT_CREATE — Stage 2 테이블 할당 (계층별)', color: '#f59e0b' },
          { y: 144, title: 'Step 4: Data Create', detail: 'RMI_DATA_CREATE(rd, ipa, src) — 페이지 복사 + 측정', color: '#8b5cf6' },
          { y: 177, title: 'Step 5: Rec Create', detail: 'RMI_REC_CREATE — vCPU context 초기화', color: '#ef4444' },
          { y: 210, title: 'Step 6: Realm Activate', detail: 'RMI_REALM_ACTIVATE — 측정값 확정, 변경 금지', color: '#06b6d4' },
          { y: 243, title: 'Step 7: Rec Enter', detail: 'RMI_REC_ENTER — Realm 실행 시작', color: '#84cc16' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={20} y={s.y - 12} width={25} height={22} rx={4}
              fill={s.color} fillOpacity={0.2} stroke={s.color} strokeWidth={0.8} />
            <text x={32.5} y={3 + s.y - 1} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color}>
              {i + 1}
            </text>
            <rect x={55} y={s.y - 12} width={405} height={22} rx={4}
              fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={0.4} />
            <text x={65} y={s.y - 2} fontSize={8} fontWeight={700} fill={s.color}>
              {s.title}
            </text>
            <text x={65} y={s.y + 7} fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">
              {s.detail}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
