export default function RmiRsiViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">RMI vs RSI — Realm 호출 인터페이스</text>

        <defs>
          <marker id="ri-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Host side */}
        <rect x={20} y={45} width={130} height={55} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={85} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Host Hypervisor</text>
        <text x={85} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">EL2 (Non-secure)</text>
        <text x={85} y={89} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">KVM + rme.c</text>

        {/* RMM */}
        <rect x={180} y={30} width={120} height={85} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={240} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">RMM</text>
        <text x={240} y={61} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">EL2 (Realm)</text>
        <text x={240} y={74} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">tf-rmm</text>
        <text x={240} y={88} textAnchor="middle" fontSize={7} fontWeight={600} fill="var(--muted-foreground)">RMI handler</text>
        <text x={240} y={102} textAnchor="middle" fontSize={7} fontWeight={600} fill="var(--muted-foreground)">RSI handler</text>

        {/* Realm Guest */}
        <rect x={330} y={45} width={130} height={55} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={395} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Realm Guest</text>
        <text x={395} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">EL1 + EL0 (Realm)</text>
        <text x={395} y={89} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">Linux Realm kernel</text>

        {/* Arrows */}
        <line x1={150} y1={72} x2={180} y2={72} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#ri-arr)" />
        <text x={165} y={67} textAnchor="middle" fontSize={7} fontWeight={600} fill="#8b5cf6">RMI</text>
        <text x={165} y={85} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">SMC</text>

        <line x1={330} y1={72} x2={300} y2={72} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#ri-arr)" />
        <text x={315} y={67} textAnchor="middle" fontSize={7} fontWeight={600} fill="#8b5cf6">RSI</text>
        <text x={315} y={85} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">HVC</text>

        {/* Interface table */}
        <rect x={20} y={130} width={440} height={115} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={147} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          2가지 인터페이스 비교
        </text>

        <text x={40} y={165} fontSize={8} fontWeight={700} fill="#3b82f6">RMI — Realm Management Interface</text>
        <text x={40} y={178} fontSize={7} fill="var(--muted-foreground)">· 호출자: Host Hypervisor</text>
        <text x={40} y={189} fontSize={7} fill="var(--muted-foreground)">· 전송: SMC instruction (→ EL3 → RMM)</text>
        <text x={40} y={200} fontSize={7} fill="var(--muted-foreground)">· 역할: Realm 생성/파괴, 메모리 관리</text>
        <text x={40} y={211} fontSize={7} fontFamily="monospace" fill="#3b82f6">RMI_REALM_CREATE, RMI_DATA_CREATE, ...</text>

        <text x={260} y={165} fontSize={8} fontWeight={700} fill="#10b981">RSI — Realm Services Interface</text>
        <text x={260} y={178} fontSize={7} fill="var(--muted-foreground)">· 호출자: Realm Guest</text>
        <text x={260} y={189} fontSize={7} fill="var(--muted-foreground)">· 전송: HVC instruction (→ RMM)</text>
        <text x={260} y={200} fontSize={7} fill="var(--muted-foreground)">· 역할: 증명, 측정 확장, IPA 관리</text>
        <text x={260} y={211} fontSize={7} fontFamily="monospace" fill="#10b981">RSI_ATTESTATION_TOKEN, RSI_IPA_STATE_SET</text>

        <text x={240} y={233} textAnchor="middle" fontSize={7} fontStyle="italic" fill="var(--muted-foreground)">
          Host는 RMI만 호출 가능 · Realm은 RSI만 호출 가능 → 경계 명확
        </text>
      </svg>
    </div>
  );
}
