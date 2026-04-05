import { motion } from 'framer-motion';

const specs = [
  { attr: '크기', val: '2.5인치 (15mm 두께)' },
  { attr: '인터페이스', val: 'PCIe 4.0 x4 (U.2 커넥터, SFF-8639)' },
  { attr: '최대 순차 읽기', val: '~7 GB/s' },
  { attr: '전력', val: '~15-25W' },
  { attr: '내구성', val: '3+ DWPD (엔터프라이즈)' },
  { attr: '핫스왑', val: '서버 백플레인 지원' },
];

export default function U2() {
  return (
    <section id="u2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U.2: 서버/엔터프라이즈 (핫스왑, 전력)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          U.2는 2.5인치 금속 케이스로 열 분산이 뛰어나고 핫스왑을 지원합니다.<br />
          엔터프라이즈 등급(3+ DWPD)으로 봉인 같은 연속 쓰기 워크로드에 적합합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">U.2</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.attr}</td>
                  <td className="border border-border px-3 py-2">{s.val}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">U.2 NVMe 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// U.2 NVMe SSD:

// 물리적 spec:
// - 2.5-inch metal enclosure
// - 15mm thickness (vs 7mm HDD)
// - SFF-8639 connector
// - 4 PCIe lanes
// - hot-swap compatible
// - front-accessible in server chassis

// 장점 over M.2:
// - better thermals (metal enclosure)
// - hot-swap capable
// - higher power budget (25W)
// - can drive faster NAND
// - sustained performance
// - enterprise durability

// Server integration:
// - SFF-8639 backplane
// - tool-less trays
// - indicator LEDs
// - RAID controllers
// - 24-36 drives in 2U chassis

// Enterprise features:
// - Power Loss Protection (PLP)
// - Multi-namespace support
// - NVMe-MI management
// - end-to-end data protection
// - higher DWPD (3-10)

// Power Loss Protection (PLP):
// - capacitors on board
// - ~50ms of power reserve
// - flushes write cache to NAND
// - prevents data loss on outage
// - critical for databases/filesystems

// Popular models (2024):
// - Samsung PM9A3 U.2: $250/TB
// - Intel D7-P5520: $280/TB
// - Kioxia CD8-V: $300/TB
// - Micron 9400 MAX: $400/TB (high DWPD)

// Capacities:
// - 960 GB, 1.92 TB, 3.84 TB, 7.68 TB
// - 15.36 TB (SSDs)
// - 30.72 TB (high-density)

// Use cases:
// ✓ Server storage
// ✓ Database servers
// ✓ Filecoin sealing
// ✓ Virtualization
// ✓ Storage arrays
// ✓ High-IOPS workloads

// Performance:
// Similar to enterprise M.2:
// - 7 GB/s sequential
// - 1.5M IOPS random
// - BUT: sustained performance
// - no thermal throttling
// - 100% duty cycle

// Filecoin SP scenario:
// PC1 sealing throughput:
// - 64-core CPU generates ~352 GiB per sector
// - writes to NVMe cache
// - needs 1-2 GB/s sustained
// - U.2 handles this easily
// - high DWPD survives years

// Downsides vs M.2:
// - more expensive ($250-400/TB)
// - requires U.2 backplane
// - not supported by most desktops
// - larger physical footprint
// - 25W power draw`}
        </pre>
        <p className="leading-7">
          U.2: <strong>2.5-inch, 25W, hot-swap, 3-10 DWPD</strong>.<br />
          Power Loss Protection (PLP capacitors) 내장.<br />
          $250-400/TB, Filecoin SP 표준, 100% duty cycle.
        </p>
      </div>
    </section>
  );
}
