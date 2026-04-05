export default function TfRmmViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TF-RMM 런타임 아키텍처</text>

        {/* Top: entry points */}
        <rect x={20} y={40} width={210} height={35} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={125} y={55} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">RMI Dispatcher</text>
        <text x={125} y={68} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">runtime/core/handler.c</text>

        <rect x={250} y={40} width={210} height={35} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
        <text x={355} y={55} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">RSI Dispatcher</text>
        <text x={355} y={68} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">runtime/rsi/dispatcher.c</text>

        {/* Middle: core modules */}
        <rect x={20} y={90} width={440} height={95} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={107} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          Core Modules
        </text>

        {[
          { x: 30, label: 'granule.c', desc: 'GPT 갱신', color: '#f59e0b' },
          { x: 115, label: 'realm.c', desc: 'RD 관리', color: '#8b5cf6' },
          { x: 200, label: 'rec.c', desc: 'vCPU', color: '#ef4444' },
          { x: 285, label: 'rtt.c', desc: 'Stage 2', color: '#06b6d4' },
          { x: 370, label: 'measurement.c', desc: 'RIM/REM', color: '#10b981' },
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x} y={120} width={80} height={45} rx={4}
              fill={m.color} fillOpacity={0.15} stroke={m.color} strokeWidth={0.8} />
            <text x={m.x + 40} y={137} textAnchor="middle" fontSize={7.5} fontWeight={700} fontFamily="monospace" fill={m.color}>
              {m.label}
            </text>
            <text x={m.x + 40} y={153} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              {m.desc}
            </text>
          </g>
        ))}

        {/* Bottom: EL3 interface */}
        <rect x={20} y={195} width={440} height={35} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.2} />
        <text x={240} y={210} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          EL3 Interface — SMC to Monitor (TF-A)
        </text>
        <text x={240} y={222} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          lib/rmm_el3_ifc/ — GPT delegate, PSCI, attestation SMCs
        </text>
      </svg>
    </div>
  );
}
