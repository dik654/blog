/**
 * WindowPoSt 24 시간 사이클 — 48 partition × 30 분 윈도우.
 */
export default function WindowPostViz() {
  const W = 720;
  const H = 320;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">WindowPoSt — 24 시간 / 48 partition / 30 분 윈도우</text>

        {/* 시간선 (24 hr) */}
        <g>
          <rect x={30} y={50} width={660} height={36} rx={4}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1} />
          {/* 48 partition tick */}
          {Array.from({ length: 48 }).map((_, i) => {
            const x = 30 + (660 / 48) * i;
            const isHour = i % 2 === 0;
            return (
              <g key={i}>
                <line x1={x} y1={50} x2={x} y2={isHour ? 90 : 86}
                  stroke="#3b82f6" strokeWidth={isHour ? 0.8 : 0.4} opacity={isHour ? 0.7 : 0.3} />
                {isHour && (
                  <text x={x} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                    {String(i / 2).padStart(2, '0')}h
                  </text>
                )}
              </g>
            );
          })}
          <text x={360} y={73} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
            48 partition windows (각 30 분)
          </text>
        </g>

        {/* 한 partition 의 내부 */}
        <g>
          <rect x={30} y={130} width={660} height={130} rx={6}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={360} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">한 partition 내부 (30 분 = 60 epoch)</text>

          {/* 단계들 */}
          <rect x={50} y={170} width={140} height={40} rx={4}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={0.8} />
          <text x={120} y={186} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">1. Challenge</text>
          <text x={120} y={200} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">random sector + leaf</text>

          <line x1={195} y1={190} x2={210} y2={190} stroke="#10b981" strokeWidth={1.2} />
          <polygon points="210,190 204,187 204,193" fill="#10b981" />

          <rect x={215} y={170} width={140} height={40} rx={4}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={0.8} />
          <text x={285} y={186} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">2. Cache read</text>
          <text x={285} y={200} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">SSD random IOPS</text>

          <line x1={360} y1={190} x2={375} y2={190} stroke="#10b981" strokeWidth={1.2} />
          <polygon points="375,190 369,187 369,193" fill="#10b981" />

          <rect x={380} y={170} width={140} height={40} rx={4}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={0.8} />
          <text x={450} y={186} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">3. Groth16 proof</text>
          <text x={450} y={200} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">GPU heavy</text>

          <line x1={525} y1={190} x2={540} y2={190} stroke="#10b981" strokeWidth={1.2} />
          <polygon points="540,190 534,187 534,193" fill="#10b981" />

          <rect x={545} y={170} width={130} height={40} rx={4}
            fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={1.2} />
          <text x={610} y={186} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">4. Submit</text>
          <text x={610} y={200} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">chain 마감 전</text>

          {/* 최대 sector */}
          <text x={360} y={235} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">최대 2349 sector / partition · 큰 SP 면 partition 수 ↑</text>
          <text x={360} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">못 맞추면 partition 전체 fault → 페널티</text>
        </g>

        {/* 결론 */}
        <text x={W / 2} y={285} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          GPU 풀 SLA 99.9%+ 유지 / cache 디스크 RAID 보호 / proving deadlines 추적
        </text>
        <text x={W / 2} y={302} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          마감 임박 + 섹터 복구 안 됨 → fault 선언 (페널티 작음, 복구 시 fault recovery)
        </text>
      </svg>
    </div>
  );
}
