import { motion } from 'framer-motion';

const rows = [
  { type: 'UDIMM', buf: '없음', maxCap: '~32GB', slots: '2 DIMM/채널', use: '데스크톱, 소규모 서버' },
  { type: 'RDIMM', buf: '레지스터 버퍼', maxCap: '~256GB', slots: '많은 DIMM 장착', use: '서버 표준 (256GB+)' },
  { type: 'LRDIMM', buf: '데이터 버퍼 + 레지스터', maxCap: '~512GB', slots: '최대 밀도', use: '대용량 서버 (768GB+)' },
];

export default function RDIMM() {
  return (
    <section id="rdimm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RDIMM vs UDIMM vs LRDIMM</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RDIMM은 레지스터 버퍼로 전기 신호를 재구동합니다.<br />
          이를 통해 1채널에 더 많은 DIMM을 장착할 수 있어 대용량 구성이 가능합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['타입', '버퍼', '최대 용량', '슬롯', '용도'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.type} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.type}</td>
                  <td className="border border-border px-3 py-2">{r.buf}</td>
                  <td className="border border-border px-3 py-2">{r.maxCap}</td>
                  <td className="border border-border px-3 py-2">{r.slots}</td>
                  <td className="border border-border px-3 py-2">{r.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">DIMM Type 상세 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DIMM Type 상세:

// UDIMM (Unbuffered DIMM):
// - direct connection to memory controller
// - no register buffering
// - lowest latency
// - cheapest per GB
// - capacity limit (~32 GB per DIMM)
// - consumer + workstation

// Electrical characteristics:
// - high current draw on CPU MC
// - limits DIMMs per channel
// - 2 DIMMs per channel max
// - stricter timing requirements

// Use cases:
// - Desktop
// - Laptop (SODIMM)
// - Small workstation
// - 32-128 GB total

// RDIMM (Registered DIMM):
// - register buffer on DIMM
// - buffers address/command signals
// - relieves memory controller
// - allows 8+ DIMMs per channel
// - slightly higher latency (+1 cycle)
// - server standard

// Buffering mechanism:
// - DIMM-side register
// - re-drives signals
// - better signal integrity
// - supports higher density

// Use cases:
// - Server (128 GB - 2 TB)
// - Workstation (high capacity)
// - database servers
// - virtualization hosts

// LRDIMM (Load Reduced DIMM):
// - buffers both address AND data
// - memory buffer (MB) chip
// - even higher density possible
// - higher latency
// - most expensive
// - highest capacity

// Load reduction:
// - data signals also buffered
// - reduces electrical load
// - enables 4+ ranks per DIMM
// - 256 GB DIMMs possible

// Use cases:
// - In-memory databases
// - SAP HANA
// - large virtualization
// - 1-6 TB systems
// - HPC

// Capacity scaling:

// Desktop:
// - 2 DIMM slots × 2 channels
// - 32 GB × 2 = 64 GB typical
// - 64 GB × 2 = 128 GB high-end

// Workstation:
// - 8 DIMM slots × 4-8 channels
// - 64 GB × 8 = 512 GB
// - DDR5 UDIMM/RDIMM

// Server (single-socket EPYC):
// - 12 channels × 2 DIMMs = 24 slots
// - 64 GB × 24 = 1.5 TB (RDIMM)
// - 128 GB × 24 = 3 TB (RDIMM)
// - 256 GB × 24 = 6 TB (LRDIMM)

// Server (dual-socket):
// - 24 channels × 2 = 48 slots
// - 128 GB × 48 = 6 TB
// - 256 GB × 48 = 12 TB (LRDIMM)

// Cost per GB (2024):
// UDIMM non-ECC: $3/GB
// UDIMM ECC: $4/GB
// RDIMM: $5-8/GB
// LRDIMM: $10-15/GB
// price scales with capacity

// Performance hierarchy:
// UDIMM > RDIMM > LRDIMM (speed)
// UDIMM < RDIMM < LRDIMM (capacity)
// trade-off by use case

// Intel/AMD support:
// - Xeon / EPYC: RDIMM + LRDIMM
// - Core i: UDIMM only
// - Ryzen: UDIMM + some RDIMM
// - Threadripper: RDIMM
// - motherboard determines

// Future: CXL Memory:
// - Compute Express Link
// - PCIe 5.0 based memory expansion
// - beyond DIMM slot limits
// - up to 32 TB per node
// - 2024+ enterprise
// - memory pooling/sharing`}
        </pre>
        <p className="leading-7">
          DIMM types: <strong>UDIMM (desktop) → RDIMM (server) → LRDIMM (enterprise)</strong>.<br />
          capacity scaling: 128 GB → 1.5 TB → 6 TB single-socket.<br />
          CXL memory가 2024+ 차세대 (32 TB+ per node).
        </p>
      </div>
    </section>
  );
}
