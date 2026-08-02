/**
 * Filecoin SP 의 3 계층 스토리지 — Hot SSD scratch · Warm SSD cache · Cold HDD permanent.
 */
export default function StorageTiersViz() {
  const W = 720;
  const H = 360;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Filecoin 스토리지 3 계층 — Hot · Warm · Cold</text>

        {/* Hot — SSD scratch */}
        <g>
          <rect x={30} y={50} width={210} height={250} rx={8}
            fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1.4} />
          <text x={135} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">🔥 Hot — Sealing scratch</text>
          <text x={135} y={87} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">NVMe (PLP 엔터프라이즈)</text>

          {/* 데이터 흐름 */}
          <rect x={45} y={105} width={180} height={32} rx={4}
            fill="#ef4444" fillOpacity={0.18} stroke="#ef4444" strokeWidth={0.8} />
          <text x={135} y={120} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#ef4444">PC1 11 layer SDR</text>
          <text x={135} y={132} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">~512 GiB write / sector</text>

          <rect x={45} y={145} width={180} height={32} rx={4}
            fill="#ef4444" fillOpacity={0.18} stroke="#ef4444" strokeWidth={0.8} />
          <text x={135} y={160} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#ef4444">C2 Groth16 scratch</text>
          <text x={135} y={172} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">~64 GB / sector</text>

          {/* 메모 */}
          <text x={135} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">완료 시 즉시 폐기</text>
          <text x={135} y={219} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ 다음 sector 재사용</text>
          <text x={135} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">SSD wear 가속 영역</text>
          <text x={135} y={264} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">엔터프라이즈 NVMe 의무</text>
          <text x={135} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">TBW 14 PB+ (D7-P5510)</text>
        </g>

        {/* Warm — Sealed cache */}
        <g>
          <rect x={255} y={50} width={210} height={250} rx={8}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={360} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">🌡 Warm — Sealed cache</text>
          <text x={360} y={87} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">SAS/SATA SSD 또는 NVMe</text>

          <rect x={270} y={105} width={180} height={32} rx={4}
            fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={360} y={120} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#f59e0b">Merkle tree cache</text>
          <text x={360} y={132} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">~10 GB / sector</text>

          <rect x={270} y={145} width={180} height={32} rx={4}
            fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={360} y={160} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#f59e0b">PoSt challenge 응답</text>
          <text x={360} y={172} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">random read 요구</text>

          <text x={360} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">WindowPoSt 마감</text>
          <text x={360} y={219} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">30 분 내 응답 필수</text>
          <text x={360} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">자주 잘못 설계 영역</text>
          <text x={360} y={264} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">cache 가 HDD 면 fault</text>
          <text x={360} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RAID 보호 권장</text>
        </g>

        {/* Cold — HDD permanent */}
        <g>
          <rect x={480} y={50} width={210} height={250} rx={8}
            fill="#06b6d4" fillOpacity={0.08} stroke="#06b6d4" strokeWidth={1.4} />
          <text x={585} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">❄ Cold — Sealed data</text>
          <text x={585} y={87} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">HDD JBOD · ZFS RAIDZ2</text>

          <rect x={495} y={105} width={180} height={32} rx={4}
            fill="#06b6d4" fillOpacity={0.18} stroke="#06b6d4" strokeWidth={0.8} />
          <text x={585} y={120} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#06b6d4">Sealed sector data</text>
          <text x={585} y={132} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">32 또는 64 GiB / sector</text>

          <rect x={495} y={145} width={180} height={32} rx={4}
            fill="#06b6d4" fillOpacity={0.18} stroke="#06b6d4" strokeWidth={0.8} />
          <text x={585} y={160} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#06b6d4">영구 보관</text>
          <text x={585} y={172} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">deal 기간 + 그 이후</text>

          <text x={585} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">가장 큰 비용 영역</text>
          <text x={585} y={219} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">18~24 TB HDD 표준</text>
          <text x={585} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#06b6d4">RAIDZ2 + 월 scrub</text>
          <text x={585} y={264} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bit rot 자동 복구</text>
          <text x={585} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">손실 시 SectorTerminate</text>
        </g>

        {/* 흐름 화살표 */}
        <g>
          <line x1={240} y1={170} x2={255} y2={170} stroke="#94a3b8" strokeWidth={1.4} />
          <polygon points="255,170 249,167 249,173" fill="#94a3b8" />
          <line x1={465} y1={170} x2={480} y2={170} stroke="#94a3b8" strokeWidth={1.4} />
          <polygon points="480,170 474,167 474,173" fill="#94a3b8" />
          <text x={247} y={163} textAnchor="middle" fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">cold migration</text>
          <text x={472} y={163} textAnchor="middle" fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">data move</text>
        </g>

        {/* 결론 */}
        <text x={W / 2} y={328} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          한 sector 의 라이프 = NVMe scratch (5~8h) → Warm cache (영구) → Cold HDD (영구)
        </text>
        <text x={W / 2} y={345} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          SSD wear 의 ~95% 가 Hot scratch — 그 풀의 SSD 만 6 개월 단위 교체 schedule
        </text>
      </svg>
    </div>
  );
}
