export default function SeamLevelsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">CPU 권한 레벨 — SEAM 포함</text>

        {/* SEAM (최상위) */}
        <rect x={40} y={45} width={400} height={45} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={60} y={65} fontSize={11} fontWeight={700} fill="#8b5cf6">SEAM Mode</text>
        <text x={60} y={81} fontSize={8} fill="var(--muted-foreground)">TD Module · P-SEAMLDR · SEAMRR 전용 메모리</text>
        <text x={420} y={70} textAnchor="end" fontSize={9} fontWeight={600} fill="#8b5cf6">최상위</text>

        {/* VMX Root */}
        <rect x={40} y={100} width={400} height={45} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.2} />
        <text x={60} y={120} fontSize={11} fontWeight={700} fill="#ef4444">VMX Root (Hypervisor)</text>
        <text x={60} y={136} fontSize={8} fill="var(--muted-foreground)">KVM, Hyper-V · TD 메모리 접근 불가</text>
        <text x={420} y={125} textAnchor="end" fontSize={9} fontWeight={600} fill="#ef4444">Ring -1</text>

        {/* VMX Non-Root */}
        <rect x={40} y={155} width={400} height={45} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={60} y={175} fontSize={11} fontWeight={700} fill="#10b981">VMX Non-Root (Guest)</text>
        <text x={60} y={191} fontSize={8} fill="var(--muted-foreground)">Trust Domain (TDX 보호) · 일반 VM</text>
        <text x={420} y={180} textAnchor="end" fontSize={9} fontWeight={600} fill="#10b981">Ring 0-3</text>

        {/* Transitions */}
        <defs>
          <marker id="sl-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        <text x={240} y={222} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
          CPU 명령 (모드 전환)
        </text>

        <g transform="translate(30, 230)">
          <text x={0} y={12} fontSize={7.5} fontFamily="monospace" fontWeight={600} fill="#8b5cf6">SEAMCALL:</text>
          <text x={65} y={12} fontSize={7.5} fill="var(--muted-foreground)">VMX Root → SEAM (Host 요청)</text>

          <text x={240} y={12} fontSize={7.5} fontFamily="monospace" fontWeight={600} fill="#8b5cf6">SEAMRET:</text>
          <text x={295} y={12} fontSize={7.5} fill="var(--muted-foreground)">SEAM → VMX Root</text>

          <text x={0} y={26} fontSize={7.5} fontFamily="monospace" fontWeight={600} fill="#10b981">TDCALL:</text>
          <text x={55} y={26} fontSize={7.5} fill="var(--muted-foreground)">TD Guest → SEAM (Guest 요청)</text>

          <text x={240} y={26} fontSize={7.5} fontFamily="monospace" fontWeight={600} fill="#10b981">TDENTER:</text>
          <text x={300} y={26} fontSize={7.5} fill="var(--muted-foreground)">SEAM → TD Guest</text>
        </g>

        <text x={240} y={270} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Host와 Guest는 반드시 TD Module 경유 (직접 통신 불가)</text>
      </svg>
    </div>
  );
}
