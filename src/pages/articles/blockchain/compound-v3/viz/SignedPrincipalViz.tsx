export default function SignedPrincipalViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Signed Principal — supply(+) / borrow(-)</text>

        {/* 숫자 축 */}
        <line x1={60} y1={130} x2={420} y2={130}
          stroke="var(--foreground)" strokeWidth={1.5} />

        {/* 0 마커 */}
        <circle cx={240} cy={130} r={4} fill="var(--foreground)" />
        <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">0</text>

        {/* 눈금 */}
        {[-30000, -15000, 0, 15000, 30000].map((v, i) => {
          const x = 60 + (i / 4) * 360;
          return (
            <g key={v}>
              <line x1={x} y1={125} x2={x} y2={135} stroke="var(--foreground)" strokeWidth={0.8} />
              <text x={x} y={150} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">{v}</text>
            </g>
          );
        })}

        {/* 음수 구간 (borrow) */}
        <rect x={60} y={80} width={180} height={40} fill="#ef4444" opacity={0.15} rx={4} />
        <text x={150} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          principal &lt; 0
        </text>
        <text x={150} y={114} textAnchor="middle" fontSize={8} fill="#ef4444">
          차입 상태 (이자 지불)
        </text>

        {/* 양수 구간 (supply) */}
        <rect x={240} y={80} width={180} height={40} fill="#10b981" opacity={0.15} rx={4} />
        <text x={330} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          principal &gt; 0
        </text>
        <text x={330} y={114} textAnchor="middle" fontSize={8} fill="#10b981">
          예치 상태 (이자 수령)
        </text>

        {/* 예시 User들 */}
        <circle cx={120} cy={130} r={6} fill="#ef4444" />
        <text x={120} y={170} textAnchor="middle" fontSize={7} fontWeight={600} fill="#ef4444">User A</text>
        <text x={120} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">-20,000</text>
        <text x={120} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">(차입 20K)</text>

        <circle cx={180} cy={130} r={6} fill="#ef4444" />
        <text x={180} y={170} textAnchor="middle" fontSize={7} fontWeight={600} fill="#ef4444">User B</text>
        <text x={180} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">-8,000</text>

        <circle cx={300} cy={130} r={6} fill="#10b981" />
        <text x={300} y={170} textAnchor="middle" fontSize={7} fontWeight={600} fill="#10b981">User C</text>
        <text x={300} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">+5,000</text>

        <circle cx={380} cy={130} r={6} fill="#10b981" />
        <text x={380} y={170} textAnchor="middle" fontSize={7} fontWeight={600} fill="#10b981">User D</text>
        <text x={380} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">+25,000</text>

        <text x={240} y={220} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          한 address는 동시에 supply &amp; borrow 불가 — 역할 명확
        </text>
      </svg>
    </div>
  );
}
