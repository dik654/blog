export default function TdLifecycleViz() {
  const steps = [
    { label: '1. MNG.CREATE', sub: 'TDR + hkid 할당', color: '#3b82f6' },
    { label: '2. MNG.KEYCONFIG', sub: 'MKTME 키 생성', color: '#3b82f6' },
    { label: '3. VP.CREATE', sub: 'vCPU 페이지 할당', color: '#8b5cf6' },
    { label: '4. MNG.INIT', sub: 'TD_PARAMS 설정', color: '#8b5cf6' },
    { label: '5. MEM.PAGE.ADD + MR.EXTEND', sub: '초기 이미지 측정', color: '#f59e0b' },
    { label: '6. MR.FINALIZE', sub: 'MRTD 확정 (불변)', color: '#ef4444' },
    { label: '7. VP.ENTER', sub: 'TD 실행 시작', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD 생성 7단계 (호스트 SEAMCALL)</text>

        <defs>
          <marker id="lc-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((step, i) => (
          <g key={i}>
            <rect x={40} y={40 + i * 35} width={400} height={28} rx={5}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
            <rect x={40} y={40 + i * 35} width={4} height={28} fill={step.color} rx={1} />
            <text x={55} y={58 + i * 35} fontSize={9.5} fontWeight={700} fontFamily="monospace"
              fill={step.color}>{step.label}</text>
            <text x={425} y={58 + i * 35} textAnchor="end" fontSize={8}
              fill="var(--muted-foreground)">{step.sub}</text>
            {i < 6 && (
              <line x1={240} y1={68 + i * 35} x2={240} y2={75 + i * 35}
                stroke="#3b82f6" strokeWidth={1} markerEnd="url(#lc-arr)" />
            )}
          </g>
        ))}

        <text x={240} y={293} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">FINALIZE 이전: 측정 변경 가능 · 이후: TD 실행 가능 (측정 불변)</text>
      </svg>
    </div>
  );
}
