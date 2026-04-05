import { motion } from 'framer-motion';

const metrics = [
  { metric: 'DWPD', desc: 'Drive Writes Per Day — 하루에 전체 용량을 몇 번 쓸 수 있는지', example: '3 DWPD × 3.84TB = 하루 11.5TB 쓰기' },
  { metric: 'PLP', desc: 'Power Loss Protection — 전력 손실 시 캐시 데이터를 NAND에 기록', example: '커패시터 백업으로 ~10ms 데이터 보호' },
  { metric: 'OP', desc: 'Over Provisioning — 여분 NAND로 수명·성능 유지', example: '엔터프라이즈: 28% OP (컨슈머: 7%)' },
];

export default function Enterprise() {
  return (
    <section id="enterprise" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">엔터프라이즈 SSD: 내구성(DWPD), 전력 손실 보호</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          엔터프라이즈 SSD는 컨슈머 대비 3~10배 높은 쓰기 내구성을 제공합니다.<br />
          DWPD, PLP, OP는 서버 SSD 선택의 핵심 지표입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['지표', '설명', '예시'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <motion.tr key={m.metric} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{m.metric}</td>
                  <td className="border border-border px-3 py-2">{m.desc}</td>
                  <td className="border border-border px-3 py-2">{m.example}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Enterprise SSD Metrics 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DWPD (Drive Writes Per Day):
//
// Calculation:
// total_writes_per_day = DWPD × capacity × warranty_years × 365
//
// Example (3 DWPD × 1.92 TB × 5 years):
// = 3 × 1.92 × 5 × 365
// = 10,512 TB written
// = 10.5 PB lifetime writes
//
// Consumer SSDs: 0.3 DWPD
// - 1 TB × 0.3 × 3 years × 365 = 330 TB
//
// Read-intensive: 1 DWPD
// - typical enterprise: databases, VMs
//
// Mixed-use: 3 DWPD
// - file servers, caching
//
// Write-intensive: 10 DWPD
// - transactional DBs, heavy logging
// - Filecoin PC1 sealing
//
// Ultra-endurance: 25+ DWPD
// - Optane P5800X
// - specialty workloads

// NAND flash endurance:
// - SLC: 100K P/E cycles
// - MLC: 10K P/E cycles
// - TLC: 1-3K P/E cycles
// - QLC: 500-1K P/E cycles
// - over-provisioning extends life

// Power Loss Protection (PLP):
//
// Problem:
// - SSD has DRAM cache
// - writes acknowledge when in cache
// - power loss → cache lost
// - corrupted transactions

// Solution: Capacitors
// - large tantalum caps on PCB
// - 5-15ms power reserve
// - enough to flush cache to NAND
// - ensures data durability

// PLP implementations:
// - Intel/Solidigm: power loss imminent (PLI)
// - Samsung: Backup Power Module
// - Kioxia: Power Loss Data Protection

// Consumer vs Enterprise PLP:
// Consumer SSDs:
// - no PLP typically
// - rely on file system journals
// - risk of corruption on outage
//
// Enterprise SSDs:
// - full PLP standard
// - tested reliability
// - critical for databases, filesystems

// Over-Provisioning (OP):
//
// Consumer: 7% OP
// - 1.024 TB raw → 1 TB usable
// - basic wear leveling
//
// Enterprise: 28% OP
// - 1.92 TB raw → 1.5 TB usable
// - enhanced performance
// - sustained write improvement
// - longer endurance

// Benefits:
// - spare blocks for wear leveling
// - steady-state performance
// - garbage collection efficiency
// - longer life

// Additional Enterprise Features:
// - End-to-End Data Protection (T10-PI)
// - Self-Encrypting Drives (SED)
// - FIPS 140-2 certification
// - multi-path I/O (dual-port SAS)
// - namespaces (multi-tenant)
// - SMART monitoring

// Practical SSD selection:
//
// Workload: Filecoin PC1 cache
// Writes: 352 GiB per sector
// Sectors/day: 10-20
// Daily writes: 3.5-7 TB
// Drive: 3.84 TB, 3 DWPD
// Lifetime: 5+ years
// Choice: Samsung PM1733 or similar

// Workload: Reth DB
// - random I/O, not heavy writes
// - 1 DWPD sufficient
// - IOPS important
// - $200-300/TB suitable`}
        </pre>
        <p className="leading-7">
          Enterprise SSD: <strong>DWPD 3-10x consumer, PLP capacitors, 28% OP</strong>.<br />
          lifetime writes: 10+ PB, 5년 warranty.<br />
          T10-PI, SED, FIPS 등 enterprise features.
        </p>
      </div>
    </section>
  );
}
