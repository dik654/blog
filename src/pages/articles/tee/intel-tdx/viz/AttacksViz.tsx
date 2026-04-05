export default function AttacksViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 310" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDX 공격 모델 & 완화</text>

        {/* Attack categories */}
        {[
          { y: 40, title: 'Physical', color: '#ef4444',
            attacks: [
              { name: 'Cold Boot', status: '방어', note: 'MKTME 암호화' },
              { name: 'DRAM Probe', status: '방어', note: 'AES-XTS + TDX 1.5 MAC' },
              { name: 'Bus Snooping', status: '방어', note: 'PRM 내부 전송' },
              { name: 'Rowhammer', status: '부분', note: 'ECC 의존 · 무결성 MAC 도움' },
            ]},
          { y: 110, title: 'Host Software', color: '#f59e0b',
            attacks: [
              { name: 'VMM → TD 메모리', status: '방어', note: 'KeyID 분리 · PAMT' },
              { name: 'Replay (old cipher)', status: 'TDX 1.5', note: 'Cryptographic Integrity' },
              { name: 'SEAMCALL abuse', status: '방어', note: '상태 머신 검사' },
              { name: 'EPT remap', status: '방어', note: 'S-EPT · Guest accept' },
            ]},
          { y: 180, title: 'Side Channels', color: '#8b5cf6',
            attacks: [
              { name: 'Spectre/Meltdown', status: '패치', note: 'ucode + IBRS/STIBP' },
              { name: 'MDS/L1TF', status: '패치', note: 'L1D flush on SEAMRET' },
              { name: 'Cache timing', status: '부분', note: 'LLC 공유 — 앱 레벨 완화' },
              { name: 'Power analysis', status: '범위 밖', note: 'TDX 위협 모델 제외' },
            ]},
          { y: 250, title: 'TD Internal', color: '#10b981',
            attacks: [
              { name: 'Malicious Guest OS', status: '범위 밖', note: 'TD 소유자 책임' },
              { name: 'TDVMCALL response', status: '앱', note: 'TLS·dm-crypt로 검증' },
              { name: 'DoS from Host', status: '허용', note: '가용성은 보장 안 함' },
              { name: 'Debug bit set', status: '정책', note: 'Verifier가 거부' },
            ]},
        ].map((cat, i) => (
          <g key={i}>
            <rect x={20} y={cat.y} width={440} height={60} rx={6}
              fill={cat.color} fillOpacity={0.08} stroke={cat.color} strokeWidth={1} />
            <text x={28} y={cat.y + 14} fontSize={9} fontWeight={700} fill={cat.color}>
              {cat.title}
            </text>
            {cat.attacks.map((a, j) => (
              <g key={j} transform={`translate(${95 + j * 95}, ${cat.y + 6})`}>
                <rect x={0} y={0} width={90} height={18} rx={3}
                  fill={cat.color} fillOpacity={0.15} stroke={cat.color} strokeWidth={0.5} />
                <text x={45} y={9} textAnchor="middle" fontSize={7} fontWeight={600} fill={cat.color}>
                  {a.name}
                </text>
                <text x={45} y={17} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">
                  {a.status}
                </text>
                <text x={45} y={31} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">
                  {a.note}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
