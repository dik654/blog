export default function LaneContextViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">LaneContext — Pure Function 평가 입력</text>

        {/* 중앙 컨텍스트 */}
        <rect x={170} y={54} width={220} height={216} rx={10}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1.5} />
        <rect x={170} y={54} width={220} height={30} rx={10}
          fill="#8b5cf6" fillOpacity={0.15} />
        <text x={280} y={75} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          LaneContext
        </text>

        <g transform="translate(182, 94)">
          <text x={0} y={12} fontSize={9.5} fontWeight={600} fill="#3b82f6">lane_id:</text>
          <text x={196} y={12} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">LaneId</text>

          <text x={0} y={30} fontSize={9.5} fontWeight={600} fill="#3b82f6">lane_status:</text>
          <text x={196} y={30} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">LaneStatus</text>

          <text x={0} y={48} fontSize={9.5} fontWeight={600} fill="#10b981">last_build_status:</text>
          <text x={196} y={48} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">BuildStatus</text>

          <text x={0} y={66} fontSize={9.5} fontWeight={600} fill="#10b981">test_coverage:</text>
          <text x={196} y={66} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">f32</text>

          <text x={0} y={84} fontSize={9.5} fontWeight={600} fill="#10b981">lint_warnings:</text>
          <text x={196} y={84} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">usize</text>

          <text x={0} y={102} fontSize={9.5} fontWeight={600} fill="#f59e0b">failure_count:</text>
          <text x={196} y={102} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">u32</text>

          <text x={0} y={120} fontSize={9.5} fontWeight={600} fill="#f59e0b">status_changed_at:</text>
          <text x={196} y={120} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">DateTime</text>

          <text x={0} y={138} fontSize={9.5} fontWeight={600} fill="#ef4444">blocked_by:</text>
          <text x={196} y={138} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">Vec&lt;LaneId&gt;</text>

          <text x={98} y={162} fontSize={9} fontStyle="italic" fill="var(--muted-foreground)" textAnchor="middle">
            (모든 필드는 불변 스냅샷)
          </text>
        </g>

        {/* 소스 */}
        <text x={70} y={96} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          데이터 소스
        </text>
        <g transform="translate(20, 106)">
          <rect x={0} y={0} width={100} height={28} rx={3}
            fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.5} />
          <text x={50} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Lane state</text>
        </g>
        <g transform="translate(20, 144)">
          <rect x={0} y={0} width={100} height={28} rx={3}
            fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.5} />
          <text x={50} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">CI client</text>
        </g>
        <g transform="translate(20, 182)">
          <rect x={0} y={0} width={100} height={28} rx={3}
            fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.5} />
          <text x={50} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">git log</text>
        </g>

        {/* 출력 */}
        <text x={490} y={96} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          사용처
        </text>
        <g transform="translate(440, 106)">
          <rect x={0} y={0} width={100} height={28} rx={3}
            fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={0.5} />
          <text x={50} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">evaluate()</text>
        </g>
        <g transform="translate(440, 144)">
          <rect x={0} y={0} width={100} height={28} rx={3}
            fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={0.5} />
          <text x={50} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">테스트</text>
        </g>
        <g transform="translate(440, 182)">
          <rect x={0} y={0} width={100} height={28} rx={3}
            fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={0.5} />
          <text x={50} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">디버깅</text>
        </g>

        <text x={280} y={300} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">30초 TTL 캐시 · GitHub API rate limit 대응</text>
      </svg>
    </div>
  );
}
