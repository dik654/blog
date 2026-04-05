export default function SessionStatsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SessionTracer — 세션 종료 시 요약</text>

        {/* 세션 요약 박스 */}
        <rect x={70} y={54} width={420} height={220} rx={10}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={1.5} />
        <rect x={70} y={54} width={420} height={32} rx={10}
          fill="#3b82f6" fillOpacity={0.15} />
        <text x={280} y={75} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Session Summary
        </text>

        <g transform="translate(92, 98)">
          <text x={0} y={14} fontSize={9.5} fontWeight={600} fill="var(--foreground)">Duration:</text>
          <text x={376} y={14} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">20m 15s</text>

          <text x={0} y={32} fontSize={9.5} fontWeight={600} fill="var(--foreground)">Tool calls:</text>
          <text x={376} y={32} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">142 (97.2% success)</text>

          <text x={0} y={50} fontSize={9.5} fontWeight={600} fill="var(--foreground)">Most used:</text>
          <text x={376} y={50} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="#3b82f6">read_file (45×)</text>

          <text x={0} y={68} fontSize={9.5} fontWeight={600} fill="var(--foreground)">Slowest:</text>
          <text x={376} y={68} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="#f59e0b">bash (avg 3.2s)</text>

          <text x={0} y={86} fontSize={9.5} fontWeight={600} fill="var(--foreground)">Cache hit:</text>
          <text x={376} y={86} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="#10b981">72%</text>

          <text x={0} y={104} fontSize={9.5} fontWeight={600} fill="var(--foreground)">Errors:</text>
          <text x={376} y={104} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="#ef4444">4 (LLM refused)</text>

          <line x1={0} y1={118} x2={376} y2={118} stroke="var(--border)" strokeWidth={0.5} />

          <text x={0} y={138} fontSize={11} fontWeight={700} fill="var(--foreground)">Cost:</text>
          <text x={376} y={138} textAnchor="end" fontSize={13} fontWeight={700} fill="#f59e0b">$0.4230</text>

          <text x={0} y={156} fontSize={8.5} fill="var(--muted-foreground)">
            input: $0.12 · output: $0.21 · cache: $0.09
          </text>
        </g>

        <text x={280} y={298} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">SessionEnd 이벤트로 Telemetry에 전송 → /status 슬래시 명령으로도 조회</text>
      </svg>
    </div>
  );
}
