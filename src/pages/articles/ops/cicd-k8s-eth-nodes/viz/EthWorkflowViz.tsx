/**
 * 이더리움 신 검증자 추가 워크플로우 — 11 단계.
 */
export default function EthWorkflowViz() {
  const steps = [
    { n: '1', label: 'Mnemonic 생성 (오프라인)', sub: 'air-gap · 강철판 보관 · Shamir SSS', color: '#ef4444' },
    { n: '2', label: '키 생성 (validator + withdrawal)', sub: '0x01 자격증명 · withdrawal address 검증', color: '#ef4444' },
    { n: '3', label: '32 ETH Deposit', sub: 'beacon deposit contract · gas 시간 선택', color: '#3b82f6' },
    { n: '4', label: 'Activation queue 추적', sub: 'beaconcha.in · pending → active', color: '#3b82f6' },
    { n: '5', label: 'VC / Web3Signer 키 등록', sub: 'HA Web3Signer 면 PostgreSQL 공유 필수', color: '#10b981' },
    { n: '6', label: 'VC 시작 (doppelganger)', sub: '2~3 epoch 청취 · BN 다중 연결', color: '#10b981' },
    { n: '7', label: '첫 attestation 검증', sub: 'beaconcha.in · inclusion delay 1 슬롯', color: '#f59e0b' },
    { n: '8', label: 'MEV-Boost 통합 (선택)', sub: 'multi-relay + min_bid 튜닝 + local fallback', color: '#f59e0b' },
    { n: '9', label: '모니터링 + 알람', sub: 'Prometheus + Grafana + 외부 (beaconcha.in)', color: '#8b5cf6' },
    { n: '10', label: 'DR 페어 / DVT 셋업', sub: 'standby + 슬래싱 DB 동기화 / 또는 Obol·SSV', color: '#8b5cf6' },
    { n: '11', label: '첫 1주 효율 점검', sub: 'rated.network · 95%+ 목표 · 이상 신호 진단', color: '#06b6d4' },
  ];

  const W = 720;
  const H = 500;
  const itemH = 36;
  const yStart = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">신 검증자 추가 — 11 단계 표준 워크플로우</text>

        {steps.map((s, i) => {
          const y = yStart + i * (itemH + 4);
          return (
            <g key={s.n}>
              <circle cx={45} cy={y + itemH / 2} r={14}
                fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={1.4} />
              <text x={45} y={y + itemH / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={s.color}>{s.n}</text>

              <rect x={75} y={y} width={620} height={itemH} rx={5}
                fill={s.color} fillOpacity={0.05} stroke={s.color} strokeWidth={0.8} />
              <text x={88} y={y + 16} fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={88} y={y + 30} fontSize={9.5} fill="var(--muted-foreground)">{s.sub}</text>

              {i < steps.length - 1 && (
                <line x1={45} y1={y + itemH + 1} x2={45} y2={y + itemH + 4}
                  stroke={s.color} strokeWidth={1.5} />
              )}
            </g>
          );
        })}

        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic"
          fill="var(--muted-foreground)">한 단계라도 잘못하면 슬래싱 위험 또는 출금 영구 잠김</text>
      </svg>
    </div>
  );
}
