export default function TaskPacketViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">TaskPacket — 구조화된 작업 명세</text>

        {/* 중앙 TaskPacket */}
        <rect x={110} y={54} width={340} height={246} rx={10}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={1.5} />
        <rect x={110} y={54} width={340} height={34} rx={10}
          fill="#3b82f6" fillOpacity={0.15} />
        <text x={280} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          TaskPacket
        </text>

        {/* 필드 카테고리 */}
        <g transform="translate(126, 100)">
          {/* Identity */}
          <text x={0} y={12} fontSize={10} fontWeight={700} fill="#3b82f6">Identity</text>
          <text x={76} y={12} fontSize={9} fill="var(--muted-foreground)">id · title · description</text>

          {/* Classification */}
          <text x={0} y={34} fontSize={10} fontWeight={700} fill="#8b5cf6">Classification</text>
          <text x={104} y={34} fontSize={9} fill="var(--muted-foreground)">priority · tags</text>

          {/* Goals */}
          <text x={0} y={60} fontSize={10} fontWeight={700} fill="#10b981">Goals</text>
          <text x={52} y={60} fontSize={9} fill="var(--muted-foreground)">description + completion_check (auto)</text>

          {/* Constraints */}
          <text x={0} y={82} fontSize={10} fontWeight={700} fill="#ef4444">Constraints</text>
          <text x={84} y={82} fontSize={9} fill="var(--muted-foreground)">NoTouchFiles, MaxChanges, ...</text>

          {/* Criteria */}
          <text x={0} y={104} fontSize={10} fontWeight={700} fill="#f59e0b">Acceptance</text>
          <text x={84} y={104} fontSize={9} fill="var(--muted-foreground)">수용 기준 체크리스트</text>

          {/* Assignment */}
          <text x={0} y={130} fontSize={10} fontWeight={700} fill="#06b6d4">Assignment</text>
          <text x={90} y={130} fontSize={9} fill="var(--muted-foreground)">team · worker</text>

          {/* Dependencies */}
          <text x={0} y={152} fontSize={10} fontWeight={700} fill="#ec4899">Dependencies</text>
          <text x={104} y={152} fontSize={9} fill="var(--muted-foreground)">depends_on · blocks</text>

          {/* Metadata */}
          <text x={0} y={178} fontSize={10} fontWeight={700} fill="#6b7280">Metadata</text>
          <text x={76} y={178} fontSize={9} fill="var(--muted-foreground)">created_by · deadline · duration</text>
        </g>

        <text x={280} y={320} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">LLM에게 명확한 scope 전달 · 자동 검증 가능</text>
      </svg>
    </div>
  );
}
