/**
 * 슬래싱 다층 방어 — VC DB · Remote Signer · Doppelganger · DVT 의 4 층.
 */
export default function SlashingDefenseViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">슬래싱 다층 방어 — 한 층 뚫려도 다음 층이 잡는다</text>

        {/* 위협 */}
        <g>
          <rect x={20} y={50} width={130} height={50} rx={6}
            fill="#ef4444" fillOpacity={0.10} stroke="#ef4444" strokeWidth={1.4} />
          <text x={85} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">위협</text>
          <text x={85} y={84} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">double propose</text>
          <text x={85} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">double / surround vote</text>
        </g>

        {/* 화살표 */}
        <line x1={150} y1={75} x2={180} y2={75} stroke="#ef4444" strokeWidth={1.4} />
        <polygon points="180,75 174,72 174,78" fill="#ef4444" />

        {/* 4 층 방어 */}
        <g>
          <rect x={185} y={50} width={510} height={250} rx={8}
            fill="#10b981" fillOpacity={0.04} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />
          <text x={440} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">4 층 방어선</text>
        </g>

        {/* 1층 — VC 내장 DB */}
        <g>
          <rect x={205} y={82} width={470} height={48} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1.4} />
          <circle cx={225} cy={106} r={11}
            fill="#3b82f6" fillOpacity={0.25} stroke="#3b82f6" strokeWidth={1} />
          <text x={225} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">1</text>
          <text x={250} y={100} fontSize={11} fontWeight={700} fill="#3b82f6">VC 내장 DB (slashing_protection.json · EIP-3076)</text>
          <text x={250} y={120} fontSize={9} fill="var(--muted-foreground)">모든 클라이언트 기본 — 서명 이력 유지, 변조/손상 시 시작 거부</text>
        </g>

        {/* 2층 — 원격 서명자 */}
        <g>
          <rect x={205} y={138} width={470} height={48} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1.4} />
          <circle cx={225} cy={162} r={11}
            fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={1} />
          <text x={225} y={166} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">2</text>
          <text x={250} y={156} fontSize={11} fontWeight={700} fill="#10b981">원격 서명자 (Web3Signer · Dirk · Vouch)</text>
          <text x={250} y={176} fontSize={9} fill="var(--muted-foreground)">별 프로세스가 키 보유, 자체 슬래셔 DB 와 대조 후 서명 — VC 침해돼도 한 번 더 막음</text>
        </g>

        {/* 3층 — Doppelganger */}
        <g>
          <rect x={205} y={194} width={470} height={48} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1.4} />
          <circle cx={225} cy={218} r={11}
            fill="#f59e0b" fillOpacity={0.25} stroke="#f59e0b" strokeWidth={1} />
          <text x={225} y={222} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">3</text>
          <text x={250} y={212} fontSize={11} fontWeight={700} fill="#f59e0b">Doppelganger Detection (시작 시 2~3 epoch 청취)</text>
          <text x={250} y={232} fontSize={9} fill="var(--muted-foreground)">같은 키가 이미 활동 중이면 시작 거부 — 페일오버 사고 1 위 방어선</text>
        </g>

        {/* 4층 — DVT */}
        <g>
          <rect x={205} y={250} width={470} height={48} rx={6}
            fill="#8b5cf6" fillOpacity={0.10} stroke="#8b5cf6" strokeWidth={1.4} />
          <circle cx={225} cy={274} r={11}
            fill="#8b5cf6" fillOpacity={0.25} stroke="#8b5cf6" strokeWidth={1} />
          <text x={225} y={278} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">4</text>
          <text x={250} y={268} fontSize={11} fontWeight={700} fill="#8b5cf6">DVT — Distributed Validator (Obol Charon · SSV · Diva)</text>
          <text x={250} y={288} fontSize={9} fill="var(--muted-foreground)">BLS 임계값 서명 (m-of-n) — 키 자체를 분할, 단일 노드 fail 무영향</text>
        </g>

        {/* 결론 */}
        <text x={W / 2} y={325} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          액티브-액티브 절대 금지 / 마이그레이션 시 보호 DB 필수 동기화 / Doppelganger 항상 ON
        </text>
        <text x={W / 2} y={345} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          1000+ 검증자 동시 슬래싱 시 검증자당 최대 32 ETH 전부 burn 가능 (correlation penalty)
        </text>
        <text x={W / 2} y={362} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Lido / Staked.us / RockX 등 실 사고 — 1 층만 의지하면 마이그레이션 사고 시 슬래싱
        </text>
      </svg>
    </div>
  );
}
