/**
 * Filecoin SP 부트스트랩 워크플로우 — 11 단계.
 */
export default function SpWorkflowViz() {
  const steps = [
    { n: '1', label: '인프라 사이징', sub: 'capacity → HDD · 워커 · GPU · 네트워크', color: '#3b82f6' },
    { n: '2', label: 'Lotus daemon 시작', sub: 'chain sync · snapshot import 권장', color: '#3b82f6' },
    { n: '3', label: 'Miner address 등록', sub: 'collateral 충전 · sector size 결정 (32/64 GiB)', color: '#10b981' },
    { n: '4', label: 'Storage 등록', sub: 'sealing scratch (NVMe) · 영구 보관 (HDD)', color: '#10b981' },
    { n: '5', label: 'Sealing 워커 분리 배치', sub: 'PC1 4 : GPU 1 비율 · 10 GbE 네트워크', color: '#f59e0b' },
    { n: '6', label: 'CC sector 첫 봉인', sub: 'pledge → 5~8 시간 → storage power 등록', color: '#f59e0b' },
    { n: '7', label: 'PoSt GPU 풀 셋업', sub: 'WindowPoSt 마감 보장 · 별 GPU 풀 권장', color: '#8b5cf6' },
    { n: '8', label: '모니터링 + 알람', sub: 'sealing throughput · WindowPoSt 성공률 · SSD wear', color: '#8b5cf6' },
    { n: '9', label: '백업 + 키 관리', sub: 'owner 콜드 + worker 백업 + sealed cache RAID', color: '#ec4899' },
    { n: '10', label: 'Deal 영업', sub: 'Filecoin Plus · snap deal · 수익 다양화', color: '#ec4899' },
    { n: '11', label: '정기 운영 + upgrade 대응', sub: '분기 Lotus 업그레이드 · 월 wear · 주 throughput', color: '#06b6d4' },
  ];

  const W = 720;
  const H = 500;
  const itemH = 36;
  const yStart = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Filecoin SP 부트스트랩 — 11 단계 표준 워크플로우</text>

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
          fill="var(--muted-foreground)">물리 인프라 + 소프트웨어 셋업이 동시 진행되는 영역</text>
      </svg>
    </div>
  );
}
