export default function PromptCacheViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Prompt Cache — 4 마크 지점 &amp; 비용</text>

        {/* 마크 위치 시각화 */}
        <rect x={35} y={54} width={490} height={36} rx={4}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />

        {/* Markers */}
        <line x1={82} y1={48} x2={82} y2={96} stroke="#3b82f6" strokeWidth={2} />
        <text x={82} y={110} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#3b82f6">system</text>

        <line x1={164} y1={48} x2={164} y2={96} stroke="#8b5cf6" strokeWidth={2} />
        <text x={164} y={110} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#8b5cf6">tools</text>

        <line x1={326} y1={48} x2={326} y2={96} stroke="#f59e0b" strokeWidth={2} />
        <text x={326} y={110} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#f59e0b">old msgs</text>

        <line x1={490} y1={48} x2={490} y2={96} stroke="#10b981" strokeWidth={2} />
        <text x={490} y={110} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#10b981">current</text>

        <text x={58} y={76} fontSize={8.5} fill="var(--muted-foreground)">prompt</text>
        <text x={128} y={76} fontSize={8.5} fill="var(--muted-foreground)">tools</text>
        <text x={256} y={76} fontSize={8.5} fill="var(--muted-foreground)">old messages</text>
        <text x={430} y={76} fontSize={8.5} fill="var(--muted-foreground)">recent</text>

        {/* 가격 비교 */}
        <rect x={35} y={132} width={490} height={104} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={152} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Anthropic 캐시 단가</text>

        <g transform="translate(58, 166)">
          <rect x={0} y={0} width={140} height={58} rx={4}
            fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
          <text x={70} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
            cache_creation
          </text>
          <text x={70} y={38} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ef4444">
            1.25×
          </text>
          <text x={70} y={52} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
            1회성 비용
          </text>
        </g>

        <text x={245} y={198} fontSize={16} fontWeight={700} fill="var(--foreground)">+</text>

        <g transform="translate(268, 166)">
          <rect x={0} y={0} width={140} height={58} rx={4}
            fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
          <text x={70} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
            cache_read
          </text>
          <text x={70} y={38} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">
            0.1×
          </text>
          <text x={70} y={52} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
            적중 시 90% 절감
          </text>
        </g>

        <g transform="translate(432, 180)">
          <text x={0} y={10} fontSize={9.5} fontWeight={600} fill="var(--foreground)">손익분기:</text>
          <text x={0} y={28} fontSize={12} fontWeight={700} fill="#f59e0b">3회 재사용</text>
        </g>

        <text x={280} y={262} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          TTL 5분 · 실제 절감: 60-80%
        </text>
        <text x={280} y={280} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          대화형 에이전트에 특히 효과적
        </text>
      </svg>
    </div>
  );
}
