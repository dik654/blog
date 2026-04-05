export default function IssuerStructureViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Fiat-backed 구조 — "금 본위제 디지털 버전"</text>

        <defs>
          <marker id="is-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
          <marker id="is-arr-g" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" />
          </marker>
          <marker id="is-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Issuer (중앙 상단) */}
        <rect x={200} y={44} width={120} height={50} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={260} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          Issuer
        </text>
        <text x={260} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Circle, Tether
        </text>

        {/* USD 예치 (왼쪽) */}
        <rect x={20} y={130} width={200} height={70} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={120} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          USD 예치 (은행)
        </text>
        <text x={120} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Treasury bills · Cash
        </text>
        <text x={120} y={186} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          BNY Mellon, CB 등
        </text>

        {/* 토큰 발행 (오른쪽) */}
        <rect x={300} y={130} width={200} height={70} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={400} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          토큰 발행 (블록체인)
        </text>
        <text x={400} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          USDC, USDT ERC20
        </text>
        <text x={400} y={186} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          1 토큰 = 1 USD (이론)
        </text>

        <line x1={230} y1={94} x2={140} y2={130} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#is-arr)" />
        <line x1={290} y1={94} x2={380} y2={130} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#is-arr)" />

        {/* Mint 흐름 (아래) */}
        <text x={260} y={228} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          Mint/Burn 사이클
        </text>

        {/* Mint 화살표 */}
        <rect x={20} y={242} width={480} height={38} rx={6}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={32} y={260} fontSize={10} fontWeight={700} fill="#10b981">Mint:</text>
        <text x={68} y={260} fontSize={10} fill="var(--foreground)">
          사용자 USD 입금 → Issuer
        </text>
        <text x={256} y={260} fontSize={10} fill="#6b7280">→</text>
        <text x={270} y={260} fontSize={10} fill="var(--foreground)">
          USDC mint → 사용자 지갑
        </text>
        <text x={32} y={274} fontSize={9} fill="var(--muted-foreground)">
          KYC 필수 · 1:1 백업 보장
        </text>

        {/* Burn 화살표 */}
        <rect x={20} y={288} width={480} height={38} rx={6}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.6} />
        <text x={32} y={306} fontSize={10} fontWeight={700} fill="#f59e0b">Burn:</text>
        <text x={68} y={306} fontSize={10} fill="var(--foreground)">
          사용자 USDC → Issuer
        </text>
        <text x={256} y={306} fontSize={10} fill="#6b7280">→</text>
        <text x={270} y={306} fontSize={10} fill="var(--foreground)">
          burn + USD 환급 (은행)
        </text>
        <text x={32} y={320} fontSize={9} fill="var(--muted-foreground)">
          환급 후 유통량 감소
        </text>
      </svg>
    </div>
  );
}
