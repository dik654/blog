import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 폼팩터가 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NVMe 스토리지 <strong>3가지 폼팩터 비교</strong>.<br />
          M.2 (consumer), U.2 (server), E1.S (datacenter).<br />
          form factor = cooling + density + power + durability.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">NVMe 폼팩터 결정 요소</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// NVMe Form Factor 핵심 결정 요소:

// 1. Cooling:
// - M.2: small PCB, limited heat dissipation
// - U.2: metal chassis, good cooling
// - E1.S: slim + airflow optimized
// - thermal throttling risk

// 2. Power budget:
// - M.2: 5-8W
// - U.2: 15-25W
// - E1.S: 20-25W (efficient)
// - higher power = faster NAND

// 3. Density (per U):
// - M.2: 4-8 per 2U server
// - U.2: 24-36 per 2U
// - E1.S: 32+ per 1U
// - density = $ / TB efficiency

// 4. Durability (DWPD):
// - M.2 consumer: 0.3-1 DWPD
// - M.2 enterprise: 1-3 DWPD
// - U.2 enterprise: 3-10 DWPD
// - write-heavy workloads need high DWPD

// 5. Hot-swap:
// - M.2: no (requires server downtime)
// - U.2: yes (front-access slots)
// - E1.S: yes (modern datacenters)

// 6. Cost:
// - M.2 consumer: $80-120/TB
// - M.2 enterprise: $150-250/TB
// - U.2 enterprise: $200-400/TB
// - E1.S: $250-500/TB (new)

// Protocol stack:
// Physical → PCIe lanes (4 typically)
// Protocol → NVMe (not AHCI)
// Queue depth → 64K × 64K commands
// IOPS → 1M+ random reads

// Evolution:
// - 2013: M.2 2280 introduced
// - 2014: U.2 (SFF-8639)
// - 2019: E1.L / E1.S specs (OCP)
// - 2021: E3.S introduced
// - 2024: PCIe 5.0 widespread

// Performance (PCIe 4.0 x4):
// - sequential read: 7 GB/s
// - sequential write: 6.8 GB/s
// - random read: 1.5M IOPS
// - random write: 1.3M IOPS
// - latency: <100 μs

// PCIe 5.0 (2024):
// - sequential: 12-14 GB/s
// - IOPS: 2M+
// - double bandwidth
// - similar latency

// Filecoin SP considerations:
// - PC1 sealing: heavy sequential write
// - DWPD 3+ recommended
// - U.2 typical choice
// - 1-2 TB per drive`}
        </pre>
        <p className="leading-7">
          NVMe 결정: <strong>cooling + power + density + DWPD + hot-swap</strong>.<br />
          M.2 (consumer $80/TB) → U.2 (enterprise $300/TB) → E1.S (density).<br />
          PCIe 4.0: 7GB/s, PCIe 5.0: 14GB/s.
        </p>
      </div>
    </section>
  );
}
