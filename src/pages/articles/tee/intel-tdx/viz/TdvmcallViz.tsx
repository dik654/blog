export default function TdvmcallViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDVMCALL — Guest→Host Hypercall 흐름</text>

        <defs>
          <marker id="tv-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* TD Guest */}
        <rect x={20} y={40} width={130} height={70} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={85} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">TD Guest</text>
        <text x={85} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Linux kernel</text>
        <text x={85} y={86} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">read(fd, ...)</text>
        <text x={85} y={98} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#10b981">→ __tdx_hypercall</text>

        {/* TD Module */}
        <rect x={180} y={40} width={120} height={70} rx={8}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.5} />
        <text x={240} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">TD Module (SEAM)</text>
        <text x={240} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">R10=hypercall std</text>
        <text x={240} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">레지스터 필터링</text>
        <text x={240} y={98} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">exit_reason 설정</text>

        {/* Host VMM */}
        <rect x={330} y={40} width={130} height={70} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={395} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Host VMM (KVM)</text>
        <text x={395} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">handle_tdvmcall()</text>
        <text x={395} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">실제 I/O 수행</text>
        <text x={395} y={98} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">결과 buffer에 기록</text>

        {/* Arrows */}
        <line x1={150} y1={75} x2={180} y2={75} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#tv-arr)" />
        <line x1={300} y1={75} x2={330} y2={75} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#tv-arr)" />

        {/* Return */}
        <line x1={330} y1={95} x2={300} y2={95} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#tv-arr)" strokeDasharray="3 2" />
        <line x1={180} y1={95} x2={150} y2={95} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#tv-arr)" strokeDasharray="3 2" />

        {/* Subtypes */}
        <rect x={20} y={135} width={440} height={150} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={152} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          TDVMCALL subtype 카탈로그
        </text>

        {[
          { x: 35, y: 165, label: 'GetQuote', desc: 'DCAP attestation quote 요청', color: '#8b5cf6' },
          { x: 35, y: 185, label: 'SetupEventNotify', desc: 'host→TD 이벤트 채널', color: '#8b5cf6' },
          { x: 35, y: 205, label: 'MapGPA', desc: 'Private ↔ Shared 전환', color: '#f59e0b' },
          { x: 35, y: 225, label: 'ReportFatalError', desc: 'TD panic 알림', color: '#ef4444' },
          { x: 240, y: 165, label: 'CPUID', desc: 'Host가 CPUID 중재', color: '#3b82f6' },
          { x: 240, y: 185, label: 'WRMSR/RDMSR', desc: 'MSR 가상화', color: '#3b82f6' },
          { x: 240, y: 205, label: 'IO (in/out)', desc: 'virtio 포트 I/O', color: '#10b981' },
          { x: 240, y: 225, label: 'HLT/MWAIT', desc: 'vCPU 유휴 대기', color: '#6b7280' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y - 10} width={90} height={16} rx={3}
              fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={0.5} />
            <text x={s.x + 45} y={s.y + 1} textAnchor="middle" fontSize={7} fontWeight={600} fontFamily="monospace" fill={s.color}>
              {s.label}
            </text>
            <text x={s.x + 95} y={s.y + 1} fontSize={7} fill="var(--muted-foreground)">{s.desc}</text>
          </g>
        ))}

        <text x={240} y={268} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
          GHCI 표준(Intel TDX Guest-Host Communication Interface) 정의
        </text>
      </svg>
    </div>
  );
}
