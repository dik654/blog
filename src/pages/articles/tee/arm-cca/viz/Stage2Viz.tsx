export default function Stage2Viz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Realm Stage 2 — IPA → PA 변환 + GPT</text>

        <defs>
          <marker id="s2-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* VA */}
        <rect x={20} y={45} width={85} height={50} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
        <text x={62} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">VA</text>
        <text x={62} y={77} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Realm App 주소</text>
        <text x={62} y={88} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">0xffff_8000_0000</text>

        <line x1={105} y1={70} x2={130} y2={70} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#s2-arr)" />
        <text x={117} y={65} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">S1</text>

        {/* IPA */}
        <rect x={135} y={45} width={95} height={50} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={182} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">IPA</text>
        <text x={182} y={77} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Realm 게스트 PA</text>
        <text x={182} y={88} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">0x40_1234_5000</text>

        <line x1={230} y1={70} x2={255} y2={70} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#s2-arr)" />
        <text x={242} y={65} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">S2</text>

        {/* PA */}
        <rect x={260} y={45} width={95} height={50} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={307} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">PA</text>
        <text x={307} y={77} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">실제 물리 주소</text>
        <text x={307} y={88} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">0x8_0000_0000</text>

        <line x1={355} y1={70} x2={380} y2={70} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#s2-arr)" />
        <text x={367} y={65} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">GPT</text>

        {/* GPT */}
        <rect x={385} y={45} width={75} height={50} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.2} />
        <text x={422} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">GPC</text>
        <text x={422} y={77} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">PAS 검사</text>
        <text x={422} y={88} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Realm?</text>

        {/* Stages */}
        <rect x={20} y={115} width={440} height={130} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />

        <text x={240} y={132} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          3단계 변환 체인
        </text>

        <text x={35} y={150} fontSize={8} fontWeight={700} fill="#10b981">
          Stage 1 (Realm Guest OS 관리)
        </text>
        <text x={35} y={161} fontSize={7} fill="var(--muted-foreground)">
          · VA → IPA · VTTBR_EL1 (Realm 커널 페이지 테이블)
        </text>

        <text x={35} y={178} fontSize={8} fontWeight={700} fill="#3b82f6">
          Stage 2 (RMM 관리 via RTT)
        </text>
        <text x={35} y={189} fontSize={7} fill="var(--muted-foreground)">
          · IPA → PA · VSTTBR_EL2 (Realm Stage 2) + RIPAS 검사
        </text>
        <text x={35} y={200} fontSize={7} fill="var(--muted-foreground)">
          · Protected IPA → Realm granule만 매핑 가능
        </text>

        <text x={35} y={217} fontSize={8} fontWeight={700} fill="#ef4444">
          GPC (Granule Protection Check, 하드웨어)
        </text>
        <text x={35} y={228} fontSize={7} fill="var(--muted-foreground)">
          · PA가 Realm PAS인지 자동 검증 · GPF 발생 시 EL3
        </text>
      </svg>
    </div>
  );
}
