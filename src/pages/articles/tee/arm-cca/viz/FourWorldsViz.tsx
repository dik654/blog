export default function FourWorldsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">ARMv9 4-World 아키텍처</text>

        {/* 4 worlds grid */}
        {[
          { x: 30, y: 45, w: 200, h: 85, title: 'Non-secure World', sub: 'NS=1, NSE=0',
            examples: 'Linux Host · Normal VMs', color: '#3b82f6' },
          { x: 250, y: 45, w: 200, h: 85, title: 'Secure World', sub: 'NS=0, NSE=0',
            examples: 'TrustZone OS · OP-TEE', color: '#f59e0b' },
          { x: 30, y: 145, w: 200, h: 85, title: 'Realm World', sub: 'NS=1, NSE=1',
            examples: 'Confidential VMs (Realms)', color: '#10b981' },
          { x: 250, y: 145, w: 200, h: 85, title: 'Root World', sub: 'NS=0, NSE=1',
            examples: 'Monitor (EL3) · TF-A', color: '#ef4444' },
        ].map((w, i) => (
          <g key={i}>
            <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={8}
              fill={w.color} fillOpacity={0.15} stroke={w.color} strokeWidth={1.5} />
            <text x={w.x + w.w/2} y={w.y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={w.color}>
              {w.title}
            </text>
            <text x={w.x + w.w/2} y={w.y + 34} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {w.sub}
            </text>
            <text x={w.x + w.w/2} y={w.y + 52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              {w.examples}
            </text>
            <text x={w.x + w.w/2} y={w.y + 68} textAnchor="middle" fontSize={7} fontStyle="italic" fill="var(--muted-foreground)">
              {i === 0 ? 'EL2: Host Hypervisor · EL1: Host OS · EL0: Apps'
                : i === 1 ? 'EL2: Secure Hyp · EL1: TEE OS · EL0: TAs'
                : i === 2 ? 'EL2: RMM · EL1: Realm OS · EL0: Realm Apps'
                : 'EL3 only — Monitor'}
            </text>
          </g>
        ))}

        {/* Center label */}
        <text x={240} y={137} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--foreground)">
          NS bit × NSE bit = 4 worlds (ARMv9-A RME)
        </text>
      </svg>
    </div>
  );
}
