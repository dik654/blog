export default function MktmeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">MKTME — Per-TD 메모리 암호화</text>

        <defs>
          <marker id="mk-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* CPU */}
        <rect x={20} y={45} width={90} height={55} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={65} y={65} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">CPU</text>
        <text x={65} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">읽기 요청</text>
        <text x={65} y={92} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">PA=0x4000</text>

        {/* Memory Controller */}
        <rect x={150} y={40} width={180} height={65} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={240} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          Memory Controller (MKTME)
        </text>
        <text x={240} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          KeyID 추출 → 키 선택 → AES-XTS
        </text>
        <text x={240} y={88} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#f59e0b">
          [KeyID=3] → Key_TD3
        </text>

        <line x1={110} y1={72} x2={150} y2={72} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#mk-arr)" />

        {/* DRAM */}
        <rect x={370} y={45} width={90} height={55} rx={8}
          fill="#6b7280" fillOpacity={0.15} stroke="#6b7280" strokeWidth={1.2} />
        <text x={415} y={65} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6b7280">DRAM</text>
        <text x={415} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">암호문 저장</text>
        <text x={415} y={92} textAnchor="middle" fontSize={7} fontStyle="italic" fill="#ef4444">0xA3F...</text>

        <line x1={330} y1={72} x2={370} y2={72} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#mk-arr)" />

        {/* Key table */}
        <rect x={40} y={130} width={400} height={110} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">MKTME 키 테이블 (메모리 컨트롤러 내부)</text>

        {/* 키 엔트리 */}
        {[
          { kid: 0, desc: 'Host (TME 공유)', color: '#6b7280' },
          { kid: 1, desc: 'TD #1', color: '#3b82f6' },
          { kid: 2, desc: 'TD #2', color: '#10b981' },
          { kid: 3, desc: 'TD #3 ← 요청', color: '#f59e0b' },
          { kid: '...', desc: '최대 KeyID 수만큼', color: '#6b7280' },
        ].map((k, i) => (
          <g key={i} transform={`translate(55, ${165 + i * 14})`}>
            <rect x={0} y={0} width={60} height={12} rx={2}
              fill={k.color} fillOpacity={0.15} stroke={k.color} strokeWidth={0.4} />
            <text x={30} y={9} textAnchor="middle" fontSize={7} fontWeight={600} fontFamily="monospace" fill={k.color}>
              KeyID {k.kid}
            </text>
            <text x={75} y={9} fontSize={7} fill="var(--muted-foreground)">{k.desc}</text>
            <rect x={260} y={0} width={115} height={12} rx={2}
              fill={k.color} fillOpacity={0.1} />
            <text x={317} y={9} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill={k.color}>
              AES-XTS random key
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
