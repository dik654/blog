import { motion } from 'framer-motion';

const specs = [
  { attr: '크기', val: '22mm x 80mm (2280)' },
  { attr: '인터페이스', val: 'PCIe 4.0 x4 (최대 5.0 x4)' },
  { attr: '최대 순차 읽기', val: '~7 GB/s (PCIe 4.0)' },
  { attr: '전력', val: '~5-8W' },
  { attr: '내구성', val: '~0.3-1 DWPD (컨슈머)' },
  { attr: '히트싱크', val: '메인보드 부착 또는 별도 구매' },
];

export default function M2() {
  return (
    <section id="m2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">M.2: 컨슈머 표준 (2280, 히트싱크)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          M.2 2280은 가장 보편적인 NVMe 폼팩터입니다.<br />
          작은 기판에 컨트롤러와 NAND가 밀집되어 발열 관리가 중요합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">M.2 2280</th>
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

        <h3 className="text-xl font-semibold mt-6 mb-3">M.2 NVMe 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// M.2 NVMe SSD:

// 물리적 spec:
// - PCB board (not enclosed)
// - key M (PCIe x4)
// - common length: 2280 (22×80mm)
// - also: 2230, 2242, 2260, 22110
// - single-sided vs double-sided NAND

// Thermal challenges:
// - small surface area
// - controller hot (80°C+)
// - NAND hot (70°C)
// - sustained write throttles
// - burst performance OK

// Cooling solutions:
// - motherboard heatsink (common)
// - aftermarket heatsink ($10-50)
// - active fan (rare)
// - thermal pads critical
// - airflow matters

// Popular models (2024):
// Consumer:
// - Samsung 990 Pro: $100/TB
// - WD SN850X: $95/TB
// - Crucial T700: $110/TB
// - Sabrent Rocket 5: $120/TB
//
// Enterprise:
// - Samsung PM9A3: $180/TB
// - Micron 7450 PRO: $170/TB
// - Solidigm P44 Pro: $200/TB
// - DWPD: 1-3

// Use cases:
// ✓ Desktop OS drive
// ✓ Laptop storage
// ✓ Workstation scratch
// ✓ Gaming (fast loading)
// ✗ Server 24/7 sealing (thermal)
// ✗ High DWPD requirements
// ✗ Hot-swap needed

// Performance (typical):
// Sequential:
// - read: 7000 MB/s
// - write: 6800 MB/s
//
// Random (4K QD32):
// - read: 1.4M IOPS
// - write: 1.3M IOPS
//
// Latency:
// - read: 20-40 μs
// - write: 15-30 μs

// Sustained performance:
// - burst: full speed (30s)
// - SLC cache fills
// - falls to TLC speed (~1.5 GB/s)
// - QLC drops to ~500 MB/s

// Form factor sizes:
// 2230: 22×30mm (Steam Deck, laptops)
// 2242: 22×42mm (laptops)
// 2260: 22×60mm (rare)
// 2280: 22×80mm (standard)
// 22110: 22×110mm (enterprise)

// Power states:
// L0: active, full power (~8W)
// L0s: idle (~2W)
// L1: deeper idle (~0.5W)
// L1.2: power saving (~5mW)
// APST: automatic transitions`}
        </pre>
        <p className="leading-7">
          M.2: <strong>PCB form factor, thermal challenges, consumer-focused</strong>.<br />
          $80-200/TB, 7 GB/s burst, 1.5 GB/s sustained.<br />
          desktop/laptop primary, server 24/7 비적합.
        </p>
      </div>
    </section>
  );
}
