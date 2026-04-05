export default function SmmuViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">SMMU v3.2 + RME — DMA 격리</text>

        <defs>
          <marker id="sm-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Device */}
        <rect x={20} y={45} width={110} height={60} rx={8}
          fill="#6b7280" fillOpacity={0.15} stroke="#6b7280" strokeWidth={1.2} />
        <text x={75} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6b7280">PCIe Device</text>
        <text x={75} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">NIC, GPU, NVMe</text>
        <text x={75} y={88} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">DMA write</text>
        <text x={75} y={100} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">StreamID=42</text>

        {/* SMMU */}
        <rect x={160} y={40} width={160} height={70} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={240} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">SMMUv3 (IOMMU)</text>
        <text x={240} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Stream Table Entry 조회</text>
        <text x={240} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">2단계 변환 (S1 + S2)</text>
        <text x={240} y={96} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#f59e0b">NSE 비트 확인</text>

        <line x1={130} y1={75} x2={160} y2={75} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#sm-arr)" />

        {/* GPT */}
        <rect x={350} y={40} width={110} height={70} rx={8}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.2} />
        <text x={405} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">GPC 검사</text>
        <text x={405} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">출력 PA의 PAS 조회</text>
        <text x={405} y={84} textAnchor="middle" fontSize={7} fill="#10b981">✓ NS→NS 접근 OK</text>
        <text x={405} y={96} textAnchor="middle" fontSize={7} fill="#ef4444">✗ NS→Realm 거부</text>

        <line x1={320} y1={75} x2={350} y2={75} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#sm-arr)" />

        {/* Scenarios */}
        <rect x={20} y={125} width={440} height={120} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={142} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          Realm DMA 시나리오
        </text>

        <text x={35} y={160} fontSize={8} fontWeight={700} fill="#3b82f6">[1] Normal World device → Realm 메모리</text>
        <text x={35} y={171} fontSize={7} fill="var(--muted-foreground)">
          · SMMU가 NS-IOVA → Realm PA 변환 시도 → GPC가 차단
        </text>
        <text x={35} y={182} fontSize={7} fill="var(--muted-foreground)">
          · 방어: 악성 firmware가 GPU/NIC 경유 Realm 훔쳐보기 방지
        </text>

        <text x={35} y={200} fontSize={8} fontWeight={700} fill="#10b981">[2] Realm → device (shared buffer)</text>
        <text x={35} y={211} fontSize={7} fill="var(--muted-foreground)">
          · Realm이 Unprotected IPA로 버퍼 표시 → RMM이 Stage 2 매핑
        </text>
        <text x={35} y={222} fontSize={7} fill="var(--muted-foreground)">
          · Device는 NS PA 접근 → 정상 동작 (virtio 등)
        </text>

        <text x={35} y={238} fontSize={7} fontStyle="italic" fill="var(--muted-foreground)">
          RME는 SMMU도 NSE 비트 지원 필요 — Confidential PCIe(CXL/CXI) 진행 중
        </text>
      </svg>
    </div>
  );
}
