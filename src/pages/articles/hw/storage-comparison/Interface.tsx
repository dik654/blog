import { motion } from 'framer-motion';

const rows = [
  { proto: 'SATA (AHCI)', queue: '1큐 x 32커맨드', bw: '~550 MB/s', conn: 'SATA 커넥터', latency: '~100us' },
  { proto: 'NVMe', queue: '64K큐 x 64K커맨드', bw: '~7 GB/s (PCIe 4.0 x4)', conn: 'M.2 / U.2 / PCIe', latency: '~10us' },
  { proto: 'SAS', queue: '듀얼 포트', bw: '~2.4 GB/s (12Gbps)', conn: 'SFF-8644', latency: '~50us' },
];

export default function Interface() {
  return (
    <section id="interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인터페이스: AHCI vs NVMe 큐 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SATA의 AHCI는 HDD 시대 설계입니다. 큐 1개에 커맨드 32개만 처리합니다.<br />
          NVMe는 PCIe에 직결되어 64K 큐로 I/O 병렬성을 극대화합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['프로토콜', '큐 구조', '최대 대역폭', '커넥터', '레이턴시'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.proto} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.proto}</td>
                  <td className="border border-border px-3 py-2">{r.queue}</td>
                  <td className="border border-border px-3 py-2">{r.bw}</td>
                  <td className="border border-border px-3 py-2">{r.conn}</td>
                  <td className="border border-border px-3 py-2">{r.latency}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">AHCI vs NVMe 큐 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AHCI (Advanced Host Controller Interface):
//
// Design (2004):
// - designed for HDDs
// - 1 queue × 32 commands
// - register-based communication
// - high CPU overhead
// - sequential access optimized
//
// Limitations with SSDs:
// - can't leverage parallelism
// - queue depth bottleneck
// - wasted SSD potential
// - sub-optimal latency
// - throughput capped

// NVMe Queue Architecture:
//
// Admin Queue (setup):
// - 1 queue pair
// - management commands
// - firmware updates
// - feature configuration
//
// I/O Queues (data):
// - up to 64K queue pairs
// - each with up to 64K commands
// - per-CPU dedicated queues
// - lock-free design
// - direct PCIe communication

// NVMe Command Path:
// 1. Application submits I/O
// 2. OS kernel places in queue
// 3. Writes to doorbell register
// 4. SSD controller reads command
// 5. DMA data transfer
// 6. Completion notification
// 7. Interrupt to CPU

// Performance implications:
//
// Queue depth scaling:
// AHCI QD32 max: ~90K IOPS
// NVMe QD32: ~250K IOPS
// NVMe QD256: ~1M IOPS
// NVMe QD4096: ~1.5M IOPS

// Latency breakdown:
// AHCI:
// - command processing: 30 μs
// - CPU overhead: 40 μs
// - SSD processing: 20 μs
// - total: ~90 μs
//
// NVMe:
// - command processing: 2 μs
// - CPU overhead: 5 μs
// - SSD processing: 10 μs
// - total: ~17 μs

// CPU efficiency:
// AHCI: 1 core saturates at 250K IOPS
// NVMe: 1 core handles 1.5M IOPS
// 6x more efficient

// Parallel scaling:
// NVMe scales with CPU cores:
// - 1 core: 1.5M IOPS
// - 4 cores: 5M IOPS
// - 8 cores: 10M IOPS
// - near-linear scaling

// Modern NVMe features:
// - ZNS (Zoned Namespaces): sequential-only zones
// - SGL (Scatter-Gather Lists): efficient DMA
// - Multi-stream: write hinting
// - Directives: QoS hints
// - CMB (Controller Memory Buffer)

// Kernel bypass (SPDK):
// - user-space NVMe driver
// - poll-mode (no interrupts)
// - near-hardware performance
// - used in storage systems

// NVMe-oF (over Fabrics):
// - NVMe over network
// - RDMA (RoCE, iWARP)
// - TCP
// - FC
// - enables disaggregated storage`}
        </pre>
        <p className="leading-7">
          NVMe: <strong>64K queues × 64K commands, per-CPU lock-free</strong>.<br />
          CPU efficiency 6x, latency 5x lower.<br />
          ZNS, SGL, NVMe-oF 등 현대 기능.
        </p>
      </div>
    </section>
  );
}
