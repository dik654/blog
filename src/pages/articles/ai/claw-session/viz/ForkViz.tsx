export default function ForkViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Session Fork — 가설 탐색 분기</text>

        <defs>
          <marker id="fork-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Parent branch */}
        <line x1={50} y1={160} x2={230} y2={160} stroke="#3b82f6" strokeWidth={3} />
        {[72, 118, 164, 210].map((x, i) => (
          <circle key={i} cx={x} cy={160} r={6} fill="#3b82f6" />
        ))}
        <text x={140} y={142} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">
          Parent Session
        </text>

        {/* Fork point */}
        <circle cx={230} cy={160} r={9} fill="#f59e0b" stroke="var(--card)" strokeWidth={2} />
        <text x={230} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          fork()
        </text>

        {/* Fork A (success) */}
        <line x1={230} y1={160} x2={296} y2={106} stroke="#10b981" strokeWidth={2.5} />
        <line x1={296} y1={106} x2={460} y2={106} stroke="#10b981" strokeWidth={2.5} />
        {[328, 380, 432].map((x, i) => (
          <circle key={i} cx={x} cy={106} r={5} fill="#10b981" />
        ))}
        <text x={476} y={105} fontSize={9.5} fontWeight={600} fill="#10b981">시도 A</text>
        <text x={476} y={118} fontSize={8.5} fill="var(--muted-foreground)">성공 → merge</text>

        {/* Fork B (failed) */}
        <line x1={230} y1={160} x2={296} y2={218} stroke="#ef4444" strokeWidth={2.5} />
        <line x1={296} y1={218} x2={418} y2={218} stroke="#ef4444" strokeWidth={2.5} strokeDasharray="4 2" />
        {[328, 380].map((x, i) => (
          <circle key={i} cx={x} cy={218} r={5} fill="#ef4444" />
        ))}
        <text x={434} y={217} fontSize={9.5} fontWeight={600} fill="#ef4444">시도 B</text>
        <text x={434} y={230} fontSize={8.5} fill="var(--muted-foreground)">실패 → abandon</text>

        {/* Merge 화살표 */}
        <path d="M 460 106 Q 498 140 460 160" stroke="#10b981" strokeWidth={1.5}
          fill="none" markerEnd="url(#fork-arr)" strokeDasharray="3 2" />
        <text x={512} y={134} fontSize={9} fontWeight={600} fill="#10b981">merge</text>

        {/* 라벨 */}
        <text x={280} y={276} textAnchor="middle" fontSize={10.5} fontWeight={700}
          fill="var(--foreground)">상태 복제 비용 = clone() (O(n))</text>
        <text x={280} y={292} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">부모 세션 불변 · fork_checkpoint로 변경 감지</text>
      </svg>
    </div>
  );
}
