import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜별 특성</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SATA vs NVMe vs SAS <strong>3가지 스토리지 프로토콜 비교</strong>.<br />
          엔터프라이즈 SSD 내구성 지표 + 블록체인 노드 선택 기준.<br />
          각 프로토콜의 best-fit workload 명확화.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로토콜 역사</h3>
        <ul className="leading-7">
          <li>1986 — PATA (133 MB/s peak)</li>
          <li>2003 — SATA (150 → 300 → 600 MB/s)</li>
          <li>2004 — SAS (3 → 6 → 12 → 24 Gbps)</li>
          <li>2011 — NVMe (PCIe-native)</li>
          <li>2016 — NVMe-oF (network fabric)</li>
          <li>2019~ — CXL (memory semantics)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">설계 컨텍스트</h3>
        <ul className="leading-7">
          <li><strong>SATA (AHCI)</strong> — HDD 시대 설계. I/O 큐 1 개, 최대 32 command. HDD ~150 MB/s 면 충분, 비용 최적화.</li>
          <li><strong>SAS</strong> — 엔터프라이즈 HDD + SSD. dual-port (redundancy), 긴 케이블 (데이터센터), 높은 신뢰성. SCSI command set.</li>
          <li><strong>NVMe</strong> — SSD 네이티브 설계. PCIe 직접 (AHCI 오버헤드 없음), 64K 큐 × 64K command, microsecond latency.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">순차 대역폭 비교</h3>
        <ul className="leading-7">
          <li>SATA III — 550 MB/s</li>
          <li>SAS 12 Gbps — 1.1 GB/s</li>
          <li>SAS 24 Gbps — 2.4 GB/s</li>
          <li>NVMe PCIe 3.0 x4 — 3.5 GB/s</li>
          <li>NVMe PCIe 4.0 x4 — 7.0 GB/s</li>
          <li>NVMe PCIe 5.0 x4 — 14.0 GB/s</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Random 4K IOPS</h3>
        <ul className="leading-7">
          <li>SATA — 90K</li>
          <li>SAS — 220K</li>
          <li>NVMe 4.0 — 1.5M</li>
          <li>NVMe 5.0 — 2.5M+</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Latency</h3>
        <ul className="leading-7">
          <li>SATA — 100~200 μs</li>
          <li>SAS — 50~100 μs</li>
          <li>NVMe — 10~20 μs</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용도</h3>
        <ul className="leading-7">
          <li>SATA — boot 드라이브, cold storage, DVR</li>
          <li>SAS — 엔터프라이즈 HDD, dual-port</li>
          <li>NVMe — DB, 캐싱, OS</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">블록체인 일반 구성</h3>
        <ul className="leading-7">
          <li>Lotus state — NVMe (random I/O)</li>
          <li>Reth DB — NVMe (hot state)</li>
          <li>Filecoin sealing cache — NVMe (throughput)</li>
          <li>Archive 데이터 — SATA HDD / SAS</li>
          <li>Cold storage — HDD / tape</li>
        </ul>
        <p className="leading-7">
          Protocol 진화: <strong>SATA (HDD era) → SAS (enterprise) → NVMe (SSD-native)</strong>.<br />
          NVMe: 1.5M IOPS, 10μs latency — 100x SATA.<br />
          blockchain: NVMe primary, SATA/SAS for cold storage.
        </p>
      </div>
    </section>
  );
}
