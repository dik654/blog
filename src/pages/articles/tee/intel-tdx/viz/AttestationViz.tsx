export default function AttestationViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDX DCAP Attestation 파이프라인</text>

        <defs>
          <marker id="at-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* TD */}
        <rect x={20} y={40} width={120} height={70} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={80} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">1. TD (workload)</text>
        <text x={80} y={73} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">TDG.MR.REPORT</text>
        <text x={80} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">REPORTDATA(64B)</text>
        <text x={80} y={98} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#10b981">TDREPORT_STRUCT</text>

        {/* Quote TD */}
        <rect x={170} y={40} width={140} height={70} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={240} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">2. Quote Enclave TD</text>
        <text x={240} y={73} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">(Service TD)</text>
        <text x={240} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">TDREPORT 검증</text>
        <text x={240} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">PCK로 ECDSA 서명</text>
        <text x={240} y={106} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#f59e0b">TDX_QUOTE</text>

        {/* Verifier */}
        <rect x={340} y={40} width={120} height={70} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={400} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">3. Verifier (Relying Party)</text>
        <text x={400} y={73} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">PCS에서 인증서 조회</text>
        <text x={400} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Quote 서명 검증</text>
        <text x={400} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">TCB·MRTD 정책 적용</text>

        {/* Arrows */}
        <line x1={140} y1={75} x2={170} y2={75} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#at-arr)" />
        <line x1={310} y1={75} x2={340} y2={75} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#at-arr)" />

        <text x={155} y={70} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">GetQuote</text>
        <text x={325} y={70} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">Quote bytes</text>

        {/* Quote structure */}
        <rect x={20} y={135} width={440} height={80} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={152} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          TDX Quote 구조 (v4 / v5)
        </text>

        {[
          { x: 35, label: 'Header', desc: 'version, att_key_type', color: '#6b7280' },
          { x: 115, label: 'TD Quote Body', desc: 'MRTD, RTMR, seam_svn', color: '#10b981' },
          { x: 210, label: 'Signature', desc: 'ECDSA P-256 (Attestation Key)', color: '#f59e0b' },
          { x: 330, label: 'Cert Chain', desc: 'QE→PCK→Intel Root CA', color: '#8b5cf6' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={165} width={f.x === 330 ? 120 : f.x === 210 ? 110 : f.x === 115 ? 85 : 70} height={30} rx={4}
              fill={f.color} fillOpacity={0.15} stroke={f.color} strokeWidth={0.8} />
            <text x={f.x + (f.x === 330 ? 60 : f.x === 210 ? 55 : f.x === 115 ? 42 : 35)} y={178}
              textAnchor="middle" fontSize={7.5} fontWeight={600} fill={f.color}>
              {f.label}
            </text>
            <text x={f.x + (f.x === 330 ? 60 : f.x === 210 ? 55 : f.x === 115 ? 42 : 35)} y={190}
              textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">
              {f.desc}
            </text>
          </g>
        ))}

        {/* TCB */}
        <rect x={20} y={235} width={440} height={75} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={252} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          TCB 구성 요소 (Verifier가 검사)
        </text>
        <text x={35} y={270} fontSize={7.5} fill="var(--muted-foreground)">
          · <tspan fontWeight={600}>CPU SVN</tspan> — 마이크로코드/ucode 버전
        </text>
        <text x={35} y={283} fontSize={7.5} fill="var(--muted-foreground)">
          · <tspan fontWeight={600}>TDX Module SVN (seam_svn)</tspan> — TD Module 바이너리 버전
        </text>
        <text x={35} y={296} fontSize={7.5} fill="var(--muted-foreground)">
          · <tspan fontWeight={600}>MRTD</tspan> — TD 초기 이미지 해시 (SHA-384)
        </text>
        <text x={260} y={270} fontSize={7.5} fill="var(--muted-foreground)">
          · <tspan fontWeight={600}>RTMR[0..3]</tspan> — 런타임 측정 체인
        </text>
        <text x={260} y={283} fontSize={7.5} fill="var(--muted-foreground)">
          · <tspan fontWeight={600}>ATTRIBUTES</tspan> — DEBUG, SEPT_VE_DIS 등
        </text>
        <text x={260} y={296} fontSize={7.5} fill="var(--muted-foreground)">
          · <tspan fontWeight={600}>XFAM</tspan> — XSAVE 기능 마스크
        </text>
      </svg>
    </div>
  );
}
