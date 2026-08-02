/**
 * EL · CL · VC 분리 + Engine API JWT.
 * 세 프로세스 + JWT 인증 + 외부 인터페이스 (P2P, beacon API, validator).
 */
export default function EthNodeJwtViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">이더리움 노드 — EL · CL · VC + Engine API (JWT 인증)</text>

        {/* EL */}
        <g>
          <rect x={50} y={60} width={180} height={170} rx={8}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={140} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">Execution Layer</text>
          <text x={140} y={97} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Reth · Geth · Nethermind</text>

          {/* EL 컴포넌트 */}
          <rect x={65} y={110} width={150} height={22} rx={3}
            fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={140} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">EVM (revm · evmone)</text>
          <rect x={65} y={136} width={150} height={22} rx={3}
            fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={140} y={151} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">State DB (MDBX · Pebble)</text>
          <rect x={65} y={162} width={150} height={22} rx={3}
            fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={140} y={177} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">txpool · sync · RPC</text>

          {/* JSON-RPC 표시 */}
          <text x={140} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">JSON-RPC :8545</text>
          <text x={140} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">P2P :30303</text>
        </g>

        {/* CL */}
        <g>
          <rect x={270} y={60} width={180} height={170} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={360} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Consensus Layer</text>
          <text x={360} y={97} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Lighthouse · Prysm · Teku</text>

          <rect x={285} y={110} width={150} height={22} rx={3}
            fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={0.8} />
          <text x={360} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Beacon Chain (forkchoice)</text>
          <rect x={285} y={136} width={150} height={22} rx={3}
            fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={0.8} />
          <text x={360} y={151} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Attestation 집계</text>
          <rect x={285} y={162} width={150} height={22} rx={3}
            fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={0.8} />
          <text x={360} y={177} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Sync Committee · Blob</text>

          <text x={360} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Beacon API :5052</text>
          <text x={360} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">P2P :9000 (libp2p)</text>
        </g>

        {/* VC */}
        <g>
          <rect x={490} y={60} width={180} height={170} rx={8}
            fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={580} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Validator Client</text>
          <text x={580} y={97} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">또는 Web3Signer · Vouch</text>

          <rect x={505} y={110} width={150} height={22} rx={3}
            fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={580} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">BLS Signing Key</text>
          <rect x={505} y={136} width={150} height={22} rx={3}
            fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={580} y={151} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Slashing Protection DB</text>
          <rect x={505} y={162} width={150} height={22} rx={3}
            fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={580} y={177} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Doppelganger Detection</text>

          <text x={580} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">멀티 BN 연결 권장</text>
          <text x={580} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">분리 머신 + HSM</text>
        </g>

        {/* EL ↔ CL Engine API + JWT */}
        <g>
          <line x1={230} y1={150} x2={270} y2={150} stroke="#ef4444" strokeWidth={1.6} />
          <line x1={230} y1={150} x2={236} y2={147} stroke="#ef4444" strokeWidth={1.6} />
          <line x1={230} y1={150} x2={236} y2={153} stroke="#ef4444" strokeWidth={1.6} />
          <line x1={270} y1={150} x2={264} y2={147} stroke="#ef4444" strokeWidth={1.6} />
          <line x1={270} y1={150} x2={264} y2={153} stroke="#ef4444" strokeWidth={1.6} />
        </g>
        <g>
          <rect x={232} y={120} width={36} height={20} rx={3}
            fill="#ef4444" fillOpacity={0.18} stroke="#ef4444" strokeWidth={0.8} />
          <text x={250} y={134} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">JWT</text>
        </g>
        <text x={250} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Engine API</text>
        <text x={250} y={183} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">:8551</text>

        {/* CL ↔ VC */}
        <g>
          <line x1={450} y1={150} x2={490} y2={150} stroke="#10b981" strokeWidth={1.4} />
          <line x1={450} y1={150} x2={456} y2={147} stroke="#10b981" strokeWidth={1.4} />
          <line x1={450} y1={150} x2={456} y2={153} stroke="#10b981" strokeWidth={1.4} />
          <line x1={490} y1={150} x2={484} y2={147} stroke="#10b981" strokeWidth={1.4} />
          <line x1={490} y1={150} x2={484} y2={153} stroke="#10b981" strokeWidth={1.4} />
          <text x={470} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Beacon API</text>
          <text x={470} y={183} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">서명 요청</text>
        </g>

        {/* JWT 메모 */}
        <g>
          <rect x={50} y={258} width={400} height={50} rx={6}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
          <text x={250} y={278} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">JWT 인증 (32 byte hex secret 공유)</text>
          <text x={250} y={293} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">openssl rand -hex 32 &gt; jwt.hex (chmod 600)</text>
          <text x={250} y={304} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시계 1초 어긋나면 거부 — chrony 필수</text>
        </g>

        {/* MEV-Boost / Web3Signer */}
        <g>
          <rect x={490} y={258} width={180} height={50} rx={6}
            fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 2" />
          <text x={580} y={278} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">MEV-Boost (선택)</text>
          <text x={580} y={293} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">CL ↔ relay (외부 빌더)</text>
          <text x={580} y={304} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">multi-relay + local fallback</text>
        </g>

        {/* 운영 원칙 */}
        <text x={W / 2} y={335} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          운영 원칙 — VC 만큼은 별 머신 / 액티브-액티브 절대 금지 / 키와 출금 자격증명 분리 보관
        </text>
        <text x={W / 2} y={355} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Web3Signer/Dirk 같은 원격 서명자로 키와 VC 프로세스 분리 = 머신 죽어도 슬래싱 없이 페일오버
        </text>
      </svg>
    </div>
  );
}
