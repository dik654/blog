export default function BannedPatternsViz() {
  const patterns = [
    { cat: '루트 삭제',   pat: 'rm -rf /',                       risk: '복구 불가', color: '#ef4444' },
    { cat: '루트 삭제',   pat: 'rm -rf /*',                      risk: '복구 불가', color: '#ef4444' },
    { cat: 'Fork bomb',  pat: ':(){ :|:& };:',                  risk: '시스템 다운', color: '#dc2626' },
    { cat: '디스크 파괴', pat: '> /dev/sda',                     risk: '데이터 손실', color: '#ef4444' },
    { cat: '디스크 파괴', pat: 'dd if=/dev/zero of=/dev/sda',    risk: '디스크 와이프', color: '#ef4444' },
    { cat: '포맷',        pat: 'mkfs.*',                         risk: '파일시스템 파괴', color: '#ef4444' },
    { cat: '권한 파괴',   pat: 'chmod -R 777 /',                 risk: '보안 무력화', color: '#f97316' },
    { cat: '원격 실행',   pat: 'curl | sh',                      risk: 'MITM 공격', color: '#ea580c' },
    { cat: '원격 실행',   pat: 'wget | bash',                    risk: 'MITM 공격', color: '#ea580c' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">BANNED_PATTERNS — 9개 절대 차단 명령</text>

        <text x={280} y={42} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Prompt 없이 즉시 Deny — 정당한 사용 케이스 없음
        </text>

        {/* Pattern cards — 3 columns × 3 rows */}
        {patterns.map((p, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 24 + col * 176;
          const y = 58 + row * 96;
          return (
            <g key={i}>
              <rect x={x} y={y} width={168} height={88} rx={6}
                fill={p.color} fillOpacity={0.1} stroke={p.color} strokeWidth={1.5} />
              {/* Left stripe */}
              <rect x={x} y={y} width={4} height={88} fill={p.color} rx={1} />
              {/* Danger icon */}
              <circle cx={x + 22} cy={y + 18} r={8} fill={p.color} opacity={0.2} stroke={p.color} strokeWidth={1.5} />
              <text x={x + 22} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill={p.color}>!</text>
              {/* Category */}
              <text x={x + 38} y={y + 22} fontSize={10} fontWeight={700} fill={p.color}>
                {p.cat}
              </text>
              {/* Pattern (monospace) */}
              <rect x={x + 10} y={y + 32} width={148} height={22} rx={3}
                fill="var(--muted)" opacity={0.6} />
              <text x={x + 14} y={y + 47} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                {p.pat.length > 22 ? p.pat.slice(0, 21) + '…' : p.pat}
              </text>
              {/* Risk */}
              <text x={x + 14} y={y + 70} fontSize={9} fill="var(--muted-foreground)">
                결과:
              </text>
              <text x={x + 42} y={y + 70} fontSize={9} fontWeight={700} fill={p.color}>
                {p.risk}
              </text>
            </g>
          );
        })}

        {/* Bottom summary */}
        <rect x={24} y={350} width={512} height={22} rx={4}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={34} y={365} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          if cmd.contains(pattern) → Err(anyhow!(&quot;banned pattern: {`{}`}&quot;, pattern))
        </text>
      </svg>
    </div>
  );
}
