/**
 * Filecoin sealing pipeline — PC1 → PC2 → C1 → C2 → 영구 보관.
 * 각 단계의 자원 (CPU · SSD · GPU · HDD) + Groth16 의 위치.
 */
export default function SealingPipelineViz() {
  const W = 720;
  const H = 360;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Filecoin sealing 파이프라인 — 자원 사용 시간선</text>

        {/* 입력 */}
        <g>
          <rect x={20} y={50} width={100} height={40} rx={5}
            fill="#94a3b8" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
          <text x={70} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">고객 데이터</text>
          <text x={70} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">32 GiB sector</text>
        </g>

        {/* PC1 */}
        <g>
          <rect x={140} y={50} width={120} height={140} rx={6}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={200} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">PreCommit1 (PC1)</text>
          <text x={200} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">SDR layered hash</text>
          {/* 자원 */}
          <text x={200} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">자원</text>
          <text x={200} y={122} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">CPU 단일 코어 (3~5 시간)</text>
          <text x={200} y={134} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">SSD ~512 GiB write</text>
          <text x={200} y={146} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">RAM 128 GiB+</text>
          <text x={200} y={172} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">병목: SSD IOPS</text>
        </g>

        {/* PC2 */}
        <g>
          <rect x={280} y={50} width={120} height={140} rx={6}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={340} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">PreCommit2 (PC2)</text>
          <text x={340} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Merkle tree hash</text>
          <text x={340} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">자원</text>
          <text x={340} y={122} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">GPU (10~30 분)</text>
          <text x={340} y={134} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">SSD read 위주</text>
          <text x={340} y={146} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">RAM 32 GiB+</text>
          <text x={340} y={172} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">병목: GPU 대기 큐</text>
        </g>

        {/* C1 */}
        <g>
          <rect x={420} y={50} width={120} height={140} rx={6}
            fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={480} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">Commit1 (C1)</text>
          <text x={480} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Vanilla proof 추출</text>
          <text x={480} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">자원</text>
          <text x={480} y={122} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">CPU 단일 (수 분)</text>
          <text x={480} y={134} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">SSD read</text>
          <text x={480} y={146} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">RAM 8 GiB</text>
          <text x={480} y={172} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">짧음, 다음 준비</text>
        </g>

        {/* C2 (Groth16) */}
        <g>
          <rect x={560} y={50} width={140} height={140} rx={6}
            fill="#ef4444" fillOpacity={0.10} stroke="#ef4444" strokeWidth={1.6} />
          <text x={630} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">Commit2 (C2)</text>
          <text x={630} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Groth16 SNARK 생성</text>
          <text x={630} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">자원</text>
          <text x={630} y={122} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">GPU 헤비 (1~2 시간)</text>
          <text x={630} y={134} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">RAM 256 GiB+</text>
          <text x={630} y={146} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">SSD scratch ~64 GB</text>
          <text x={630} y={172} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">병목: GPU 메모리</text>
        </g>

        {/* 화살표들 */}
        <g>
          <line x1={120} y1={70} x2={140} y2={70} stroke="#94a3b8" strokeWidth={1.2} />
          <polygon points="140,70 134,67 134,73" fill="#94a3b8" />
          <line x1={260} y1={70} x2={280} y2={70} stroke="#3b82f6" strokeWidth={1.2} />
          <polygon points="280,70 274,67 274,73" fill="#3b82f6" />
          <line x1={400} y1={70} x2={420} y2={70} stroke="#10b981" strokeWidth={1.2} />
          <polygon points="420,70 414,67 414,73" fill="#10b981" />
          <line x1={540} y1={70} x2={560} y2={70} stroke="#f59e0b" strokeWidth={1.2} />
          <polygon points="560,70 554,67 554,73" fill="#f59e0b" />
        </g>

        {/* 영구 보관 */}
        <g>
          <rect x={140} y={210} width={560} height={60} rx={6}
            fill="#06b6d4" fillOpacity={0.08} stroke="#06b6d4" strokeWidth={1.2} />
          <text x={420} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">영구 보관 (HDD 풀)</text>
          <text x={420} y={245} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">sealed sector (32 GiB) + cache (~10 GB) — JBOD 또는 ZFS / Ceph</text>
          <text x={420} y={258} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">SSD scratch 영역은 즉시 폐기 (다음 sector 봉인용으로 재사용)</text>
        </g>
        <g>
          <line x1={200} y1={190} x2={200} y2={210} stroke="#06b6d4" strokeWidth={1} />
          <line x1={340} y1={190} x2={340} y2={210} stroke="#06b6d4" strokeWidth={1} />
          <line x1={480} y1={190} x2={480} y2={210} stroke="#06b6d4" strokeWidth={1} />
          <line x1={630} y1={190} x2={630} y2={210} stroke="#06b6d4" strokeWidth={1} />
        </g>

        {/* 운영 메모 */}
        <text x={W / 2} y={295} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          한 sector 봉인 = 5~8 시간 · CPU/GPU/SSD 가 시간차로 점유 → 풀 설계로 throughput 극대화
        </text>
        <text x={W / 2} y={315} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          PC1 워커 (CPU heavy) · PC2/C2 GPU 풀 (3~5 PC1 마다 1 GPU) 으로 자원 점유 시간차 활용
        </text>
        <text x={W / 2} y={335} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          SSD 는 sealing scratch 만 사용, 최종 sealed sector 는 HDD 로 cold migration
        </text>
      </svg>
    </div>
  );
}
