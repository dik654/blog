/**
 * x402 — HTTP 402 응답으로 결제 요구 → on-chain settle → 재요청.
 */
export default function X402FlowViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">x402 — HTTP 402 Payment Required + on-chain micropayment</text>

        {/* Client */}
        <g>
          <rect x={20} y={60} width={130} height={60} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={85} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">Client (AI agent)</text>
          <text x={85} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">facilitator wallet</text>
          <text x={85} y={110} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">USDC · ETH 등</text>
        </g>

        {/* Step 1 */}
        <line x1={150} y1={90} x2={290} y2={90} stroke="#94a3b8" strokeWidth={1.4} />
        <polygon points="290,90 284,87 284,93" fill="#94a3b8" />
        <text x={220} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill="#94a3b8">1. GET /resource</text>

        {/* Server */}
        <g>
          <rect x={290} y={60} width={130} height={60} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1.4} />
          <text x={355} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Server (API)</text>
          <text x={355} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">x402 middleware</text>
          <text x={355} y={110} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">price: 0.001 USDC</text>
        </g>

        {/* Step 2 — 402 */}
        <line x1={290} y1={130} x2={150} y2={130} stroke="#ef4444" strokeWidth={1.4} />
        <polygon points="150,130 156,127 156,133" fill="#ef4444" />
        <text x={220} y={123} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">2. HTTP 402 + payment header</text>
        <text x={220} y={148} textAnchor="middle" fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">{'{ amount, recipient, chain, asset, nonce }'}</text>

        {/* Client signs + facilitator */}
        <g>
          <rect x={20} y={170} width={130} height={70} rx={6}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 2" />
          <text x={85} y={188} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#3b82f6">3. 결제 서명</text>
          <text x={85} y={202} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">EIP-3009</text>
          <text x={85} y={215} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">transferWithAuthorization</text>
          <text x={85} y={228} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">off-chain signature</text>
        </g>

        {/* Step 4 retry */}
        <line x1={150} y1={205} x2={290} y2={205} stroke="#10b981" strokeWidth={1.4} />
        <polygon points="290,205 284,202 284,208" fill="#10b981" />
        <text x={220} y={197} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">4. retry + X-PAYMENT header</text>

        {/* Facilitator */}
        <g>
          <rect x={460} y={170} width={150} height={120} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={535} y={190} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Facilitator</text>
          <text x={535} y={206} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">서명 검증</text>
          <text x={535} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">on-chain settle</text>
          <text x={535} y={234} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">batch / 즉시</text>
          <text x={535} y={258} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#f59e0b">Coinbase, CDP 등</text>
          <text x={535} y={272} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">자가 운영도 가능</text>
        </g>

        {/* Server → Facilitator */}
        <line x1={420} y1={205} x2={460} y2={205} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <polygon points="460,205 454,202 454,208" fill="#f59e0b" />
        <text x={440} y={199} textAnchor="middle" fontSize={8} fill="#f59e0b">verify</text>

        {/* Facilitator → blockchain */}
        <g>
          <rect x={620} y={140} width={80} height={50} rx={5}
            fill="#8b5cf6" fillOpacity={0.10} stroke="#8b5cf6" strokeWidth={1} />
          <text x={660} y={158} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#8b5cf6">Base · L2</text>
          <text x={660} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">USDC</text>
          <text x={660} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">$0.001 fee</text>
        </g>
        <line x1={580} y1={170} x2={620} y2={170} stroke="#8b5cf6" strokeWidth={1.2} />
        <polygon points="620,170 614,167 614,173" fill="#8b5cf6" />

        {/* Step 5 response */}
        <g>
          <rect x={290} y={310} width={130} height={50} rx={6}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={1.4} />
          <text x={355} y={328} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">5. HTTP 200 + data</text>
          <text x={355} y={344} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">결제 완료, 리소스 응답</text>
        </g>
        <line x1={355} y1={120} x2={355} y2={310} stroke="#10b981" strokeWidth={0.6} strokeDasharray="2 2" opacity={0.4} />

        {/* 화살표 client ← server */}
        <line x1={290} y1={335} x2={150} y2={335} stroke="#10b981" strokeWidth={1.4} />
        <polygon points="150,335 156,332 156,338" fill="#10b981" />
        <text x={220} y={328} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">delivered</text>
      </svg>
    </div>
  );
}
