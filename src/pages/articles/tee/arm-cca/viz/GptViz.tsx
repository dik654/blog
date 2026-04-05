export default function GptViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 270" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">GPT — Granule Protection Table</text>

        <defs>
          <marker id="gpt-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Access */}
        <rect x={20} y={40} width={130} height={55} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={85} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">CPU/DMA 접근</text>
        <text x={85} y={72} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">PA = 0x4000_0000</text>
        <text x={85} y={84} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">PAS = NS(Normal)</text>

        {/* GPT walk */}
        <rect x={180} y={35} width={140} height={65} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={250} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">GPT Walk</text>
        <text x={250} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">GPTBR_EL3 → L0 → L1</text>
        <text x={250} y={78} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">granule(16KB~1GB) 단위</text>
        <text x={250} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">소유 PAS 조회</text>

        <line x1={150} y1={68} x2={180} y2={68} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#gpt-arr)" />

        {/* Check */}
        <rect x={350} y={35} width={110} height={65} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
        <text x={405} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">PAS 일치?</text>
        <text x={405} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">접근 PAS == 소유 PAS</text>
        <text x={405} y={78} textAnchor="middle" fontSize={7} fill="#10b981">✓ 허용</text>
        <text x={405} y={90} textAnchor="middle" fontSize={7} fill="#ef4444">✗ GPF(Fault)</text>

        <line x1={320} y1={68} x2={350} y2={68} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#gpt-arr)" />

        {/* GPT structure */}
        <rect x={20} y={125} width={440} height={130} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={142} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          GPT 엔트리 PAS 값
        </text>

        {[
          { x: 35, label: 'GPT_NS', desc: 'Non-secure (Normal)', color: '#3b82f6' },
          { x: 125, label: 'GPT_SECURE', desc: 'Secure World', color: '#f59e0b' },
          { x: 225, label: 'GPT_REALM', desc: 'Realm World', color: '#10b981' },
          { x: 315, label: 'GPT_ROOT', desc: 'Root/Monitor only', color: '#ef4444' },
        ].map((e, i) => (
          <g key={i}>
            <rect x={e.x} y={155} width={85} height={22} rx={3}
              fill={e.color} fillOpacity={0.2} stroke={e.color} strokeWidth={0.6} />
            <text x={e.x + 42} y={170} textAnchor="middle" fontSize={7} fontWeight={700} fontFamily="monospace" fill={e.color}>
              {e.label}
            </text>
            <text x={e.x + 42} y={188} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">
              {e.desc}
            </text>
          </g>
        ))}

        <text x={240} y={210} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--foreground)">
          PAS 전환: Monitor(EL3)만 가능
        </text>
        <text x={240} y={224} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          SMC(GPT_DELEGATE) · SMC(GPT_UNDELEGATE)
        </text>
        <text x={240} y={238} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          예: Host가 메모리를 Realm에 delegate → GPT_NS → GPT_REALM
        </text>
      </svg>
    </div>
  );
}
