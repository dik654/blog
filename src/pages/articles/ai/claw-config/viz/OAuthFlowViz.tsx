export default function OAuthFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 350" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">OAuth 2.0 + PKCE — 인증 흐름</text>

        <defs>
          <marker id="oa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { label: '1. PKCE 생성', sub: 'code_verifier (random 64자)', color: '#3b82f6' },
          { label: '2. SHA256 challenge', sub: 'code_challenge = SHA256(verifier)', color: '#8b5cf6' },
          { label: '3. 콜백 서버 시작', sub: 'localhost:임의포트/callback', color: '#f59e0b' },
          { label: '4. 브라우저 오픈', sub: 'auth URL + challenge', color: '#10b981' },
          { label: '5. 사용자 인증', sub: 'Claude.ai 로그인', color: '#10b981' },
          { label: '6. auth_code 수신', sub: 'callback HTTP request', color: '#f59e0b' },
          { label: '7. 토큰 교환', sub: 'verifier 전송 → access/refresh', color: '#3b82f6' },
          { label: '8. 토큰 저장', sub: '~/.claw/tokens.json (600)', color: '#10b981' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={45} y={48 + i * 34} width={470} height={28} rx={4}
              fill={step.color} fillOpacity={0.08} stroke={step.color} strokeWidth={0.6} />
            <rect x={45} y={48 + i * 34} width={3} height={28} fill={step.color} rx={1} />
            <text x={62} y={66 + i * 34} fontSize={10} fontWeight={700} fill={step.color}>
              {step.label}
            </text>
            <text x={502} y={66 + i * 34} textAnchor="end" fontSize={9} fontFamily="monospace"
              fill="var(--muted-foreground)">{step.sub}</text>
          </g>
        ))}

        <text x={280} y={338} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">PKCE: 중간 탈취된 code로 토큰 획득 불가 (verifier 모름)</text>
      </svg>
    </div>
  );
}
