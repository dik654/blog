import { ActionBox, ModuleBox } from '@/components/viz/boxes';

export default function EnterExitViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD Enter / Exit — 3가지 탈출 경로</text>

        <defs>
          <marker id="ee-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Host */}
        <ModuleBox x={20} y={50} w={120} h={45}
          label="Host (KVM)"
          sub="VMX Root"
          color="#ef4444" />

        {/* TD Module */}
        <ModuleBox x={180} y={50} w={120} h={45}
          label="TD Module"
          sub="SEAM mode"
          color="#8b5cf6" />

        {/* TD Guest */}
        <ModuleBox x={340} y={50} w={120} h={45}
          label="TD Guest"
          sub="VMX Non-Root"
          color="#10b981" />

        {/* Enter flow */}
        <line x1={140} y1={70} x2={180} y2={70} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ee-arr)" />
        <text x={160} y={62} textAnchor="middle" fontSize={7} fill="#3b82f6">TDH.VP.ENTER</text>

        <line x1={300} y1={70} x2={340} y2={70} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#ee-arr)" />
        <text x={320} y={62} textAnchor="middle" fontSize={7} fill="#10b981">TDENTER</text>

        {/* Exit paths */}
        <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          3가지 Exit 경로
        </text>

        {/* Async */}
        <rect x={20} y={145} width={140} height={55} rx={6}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={90} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
          1. Async Exit
        </text>
        <text x={90} y={176} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          외부 IRQ, NMI
        </text>
        <text x={90} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          exit_reason: INTR
        </text>

        {/* EPT Violation */}
        <rect x={170} y={145} width={140} height={55} rx={6}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <text x={240} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
          2. EPT Violation
        </text>
        <text x={240} y={176} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          페이지 미매핑
        </text>
        <text x={240} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Host가 페이지 할당
        </text>

        {/* TDVMCALL */}
        <rect x={320} y={145} width={140} height={55} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={390} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          3. TDVMCALL
        </text>
        <text x={390} y={176} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          의도적 Host 요청
        </text>
        <text x={390} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          I/O, MSR, CPUID
        </text>

        {/* 공통 */}
        <rect x={40} y={215} width={400} height={65} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={233} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
          공통: TD Module이 레지스터 save/filter
        </text>
        <text x={240} y={249} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          ✓ GPR (RAX-R15) 필터링 후 Host에 노출
        </text>
        <text x={240} y={261} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          ✓ XMM/YMM/ZMM 저장 후 zeroize (leak 방지)
        </text>
        <text x={240} y={273} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          ✓ Host는 exit_reason + 지정된 정보만 수신
        </text>
      </svg>
    </div>
  );
}
