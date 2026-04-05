export default function CurveWarsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Curve Wars — veCRV 거버넌스 경쟁 구조</text>

        <defs>
          <marker id="cw-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 프로젝트 (상단) */}
        <rect x={20} y={46} width={150} height={52} rx={6}
          fill="#ec4899" fillOpacity={0.1} stroke="#ec4899" strokeWidth={1} />
        <text x={95} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ec4899">
          프로젝트
        </text>
        <text x={95} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Frax, Lido, Convex ...
        </text>
        <text x={95} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          자기 풀에 CRV 유치 원함
        </text>

        {/* Bribes → Convex */}
        <rect x={200} y={46} width={150} height={52} rx={6}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={275} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Bribes 시장
        </text>
        <text x={275} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Votium, Hidden Hand
        </text>
        <text x={275} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          "내 gauge 투표 → 보상 지급"
        </text>

        {/* Convex */}
        <rect x={380} y={46} width={120} height={52} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.2} />
        <text x={440} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          Convex
        </text>
        <text x={440} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          veCRV 80% 독점
        </text>
        <text x={440} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          max lock 투표 대행
        </text>

        <line x1={170} y1={72} x2={200} y2={72} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#cw-arr)" />
        <line x1={350} y1={72} x2={380} y2={72} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#cw-arr)" />

        {/* 핵심 메커니즘 */}
        <text x={260} y={130} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Gauge Weight 투표 흐름</text>

        {[
          { n: 1, x: 20, label: 'CRV 매수/lock', desc: 'veCRV 획득', color: '#10b981' },
          { n: 2, x: 180, label: 'vote_for_gauge_weights', desc: 'gauge 투표', color: '#3b82f6' },
          { n: 3, x: 340, label: 'weekly CRV 분배', desc: 'gauge에 따라', color: '#f59e0b' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={146} width={140} height={56} rx={6}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
            <circle cx={s.x + 20} cy={174} r={12} fill={s.color} />
            <text x={s.x + 20} y={178} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">
              {s.n}
            </text>
            <text x={s.x + 88} y={168} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={s.x + 88} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {s.desc}
            </text>
            {i < 2 && (
              <line x1={s.x + 140} y1={174} x2={s.x + 180} y2={174}
                stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#cw-arr)" />
            )}
          </g>
        ))}

        {/* 결과 */}
        <rect x={20} y={224} width={480} height={68} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={244} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          결과 — "거버넌스 자본화"
        </text>
        <text x={36} y={264} fontSize={10} fill="var(--muted-foreground)">• Convex가 veCRV 80% 독점 → 메타거버넌스</text>
        <text x={36} y={279} fontSize={10} fill="var(--muted-foreground)">• Bribes 시장: 프로젝트가 cvxCRV 보유자에게 보상 지급</text>

        {/* ve 모델 채택 */}
        <rect x={20} y={302} width={480} height={30} rx={6}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={260} y={322} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          ve 모델 채택: Balancer(veBAL) · Frax(veFXS) · Aura(vlAURA)
        </text>
      </svg>
    </div>
  );
}
