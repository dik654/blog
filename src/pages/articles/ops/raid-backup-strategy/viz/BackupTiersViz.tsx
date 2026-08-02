/**
 * 3-2-1 백업 규칙 시각화 — 3 copies · 2 media · 1 offsite.
 */
export default function BackupTiersViz() {
  const W = 720;
  const H = 360;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">3-2-1 백업 규칙 — 3 copies · 2 media · 1 offsite</text>

        {/* Production */}
        <g>
          <rect x={20} y={50} width={210} height={250} rx={8}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={125} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">1. Production (live)</text>
          <text x={125} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RAIDZ2 또는 RAID10</text>
          <rect x={40} y={105} width={170} height={50} rx={4}
            fill="#3b82f6" fillOpacity={0.18} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={125} y={125} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#3b82f6">disk fault tolerance</text>
          <text x={125} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">2 disk 동시 fail OK</text>
          <text x={125} y={170} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">RAID ≠ backup</text>
          <text x={125} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실수 삭제 · ransomware 대응 X</text>

          <text x={125} y={220} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">RTO / RPO</text>
          <text x={125} y={236} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RTO = 0 (즉시)</text>
          <text x={125} y={252} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RPO = 0</text>

          <text x={125} y={282} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">cost / TB</text>
          <text x={125} y={295} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">$30~$60 (HDD enterprise)</text>
        </g>

        {/* Local backup */}
        <g>
          <rect x={250} y={50} width={210} height={250} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={355} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">2. Local backup</text>
          <text x={355} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">NAS · TrueNAS · 별 chassis</text>

          <rect x={270} y={105} width={170} height={50} rx={4}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={0.8} />
          <text x={355} y={125} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">스냅샷 + 증분</text>
          <text x={355} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">ZFS send/recv · rsnapshot</text>

          <text x={355} y={170} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">매시간 / 매일 / 매주 retention</text>
          <text x={355} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실수 삭제 복구 가능</text>

          <text x={355} y={220} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">RTO / RPO</text>
          <text x={355} y={236} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RTO = 분~시간</text>
          <text x={355} y={252} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RPO = 시간</text>

          <text x={355} y={282} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">cost / TB</text>
          <text x={355} y={295} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">$15~$25 (HDD CMR/SMR)</text>
        </g>

        {/* Offsite */}
        <g>
          <rect x={480} y={50} width={220} height={250} rx={8}
            fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1.4} />
          <text x={590} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">3. Offsite (지리 분산)</text>
          <text x={590} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">S3 Glacier · B2 · 다른 datacenter</text>

          <rect x={500} y={105} width={180} height={50} rx={4}
            fill="#8b5cf6" fillOpacity={0.18} stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={590} y={125} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#8b5cf6">암호화 + immutable</text>
          <text x={590} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">restic · borg · object lock</text>

          <text x={590} y={170} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">화재 · 도난 · ransomware 대응</text>
          <text x={590} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시설 사고 시 마지막 보루</text>

          <text x={590} y={220} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">RTO / RPO</text>
          <text x={590} y={236} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RTO = 시간~일</text>
          <text x={590} y={252} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RPO = 일</text>

          <text x={590} y={282} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">cost / TB / month</text>
          <text x={590} y={295} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">$1~$6 + egress 비용</text>
        </g>

        {/* arrows */}
        <g>
          <line x1={230} y1={175} x2={250} y2={175} stroke="#94a3b8" strokeWidth={1.4} />
          <polygon points="250,175 244,172 244,178" fill="#94a3b8" />
          <line x1={460} y1={175} x2={480} y2={175} stroke="#94a3b8" strokeWidth={1.4} />
          <polygon points="480,175 474,172 474,178" fill="#94a3b8" />
        </g>

        <text x={W / 2} y={335} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          핵심 — RAID 는 backup 이 아니다 / 실수 삭제 · ransomware 는 다른 시점 사본만 막을 수 있음
        </text>
      </svg>
    </div>
  );
}
