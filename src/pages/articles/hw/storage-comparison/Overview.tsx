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

        <h3 className="text-xl font-semibold mt-6 mb-3">Storage Protocol 진화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Storage Protocol 역사:

// 1. PATA (1986): 133 MB/s peak
// 2. SATA (2003): 150→300→600 MB/s
// 3. SAS (2004): 3→6→12→24 Gbps
// 4. NVMe (2011): PCIe-native
// 5. NVMe-oF (2016): network fabric
// 6. CXL (2019-): memory semantics

// 각 프로토콜 설계 당시 context:

// SATA (AHCI):
// - HDD 시대 설계
// - single I/O queue
// - 32 commands max
// - low bandwidth OK (HDD ~150 MB/s)
// - cost-optimized

// SAS:
// - enterprise HDD + SSD
// - dual-port (redundancy)
// - longer cables (data center)
// - higher reliability
// - SCSI command set

// NVMe:
// - SSD-native design
// - PCIe direct (no AHCI overhead)
// - 64K queues × 64K commands
// - microsecond latency
// - modern storage

// Performance comparison (sequential):
// SATA III: 550 MB/s
// SAS 12 Gbps: 1.1 GB/s
// SAS 24 Gbps: 2.4 GB/s
// NVMe PCIe 3.0 x4: 3.5 GB/s
// NVMe PCIe 4.0 x4: 7.0 GB/s
// NVMe PCIe 5.0 x4: 14.0 GB/s

// IOPS (random 4K):
// SATA: 90K
// SAS: 220K
// NVMe 4.0: 1.5M
// NVMe 5.0: 2.5M+

// Latency:
// SATA: 100-200 μs
// SAS: 50-100 μs
// NVMe: 10-20 μs

// Use cases:
// SATA: boot drives, cold storage, DVR
// SAS: enterprise HDD, dual-port
// NVMe: databases, caching, OS

// Blockchain typical:
// - Lotus state: NVMe (random I/O)
// - Reth DB: NVMe (hot state)
// - Filecoin sealing cache: NVMe (throughput)
// - Archive data: SATA HDD / SAS
// - Cold storage: HDD / tape`}
        </pre>
        <p className="leading-7">
          Protocol 진화: <strong>SATA (HDD era) → SAS (enterprise) → NVMe (SSD-native)</strong>.<br />
          NVMe: 1.5M IOPS, 10μs latency — 100x SATA.<br />
          blockchain: NVMe primary, SATA/SAS for cold storage.
        </p>
      </div>
    </section>
  );
}
