export default function ThreatModelViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDX 위협 모델 — TCB 경계</text>

        {/* Hardware (TCB) */}
        <rect x={30} y={40} width={200} height={60} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={130} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          ✓ Intel CPU + SEAM
        </text>
        <text x={130} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          TD Module (Intel 서명)
        </text>
        <text x={130} y={88} textAnchor="middle" fontSize={7} fontStyle="italic" fill="#10b981">
          TCB 내부 (신뢰)
        </text>

        {/* TD VM (TCB) */}
        <rect x={250} y={40} width={200} height={60} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={350} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          ✓ Guest OS + App
        </text>
        <text x={350} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          TD 내부 전체
        </text>
        <text x={350} y={88} textAnchor="middle" fontSize={7} fontStyle="italic" fill="#10b981">
          사용자 신뢰
        </text>

        {/* 경계선 */}
        <line x1={30} y1={115} x2={450} y2={115}
          stroke="var(--foreground)" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={240} y={110} textAnchor="middle" fontSize={8} fontWeight={700}
          fill="var(--foreground)">TCB Boundary</text>

        {/* TCB 외부 */}
        <rect x={30} y={130} width={135} height={50} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.2} />
        <text x={97.5} y={150} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          ✗ Hypervisor
        </text>
        <text x={97.5} y={165} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          KVM, Hyper-V, ESXi
        </text>

        <rect x={172} y={130} width={135} height={50} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.2} />
        <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          ✗ Host OS / BMC
        </text>
        <text x={240} y={165} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          관리 SW
        </text>

        <rect x={314} y={130} width={136} height={50} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.2} />
        <text x={382} y={150} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          ✗ 물리 접근자
        </text>
        <text x={382} y={165} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          DMA, cold boot
        </text>

        {/* 공격자 능력 */}
        <rect x={30} y={195} width={420} height={70} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={214} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
          공격자 능력 (모두 TDX가 방어)
        </text>

        <g transform="translate(45, 222)">
          <text x={0} y={10} fontSize={7.5} fill="var(--muted-foreground)">• 하이퍼바이저 전체 제어 · VMCS 조작</text>
          <text x={215} y={10} fontSize={7.5} fill="var(--muted-foreground)">• TD 진입/탈출 시점 제어</text>
          <text x={0} y={24} fontSize={7.5} fill="var(--muted-foreground)">• DMA 물리 메모리 덤프</text>
          <text x={215} y={24} fontSize={7.5} fill="var(--muted-foreground)">• MMIO, Port I/O 관찰·수정</text>
          <text x={0} y={38} fontSize={7.5} fill="var(--muted-foreground)">• Cold boot (DRAM 리프레시 전)</text>
          <text x={215} y={38} fontSize={7.5} fill="var(--muted-foreground)">• Replay (옛 암호문 재주입)</text>
        </g>
      </svg>
    </div>
  );
}
