import { motion } from 'framer-motion';

const items = [
  { type: 'non-ECC', bits: '64비트 데이터', detect: '없음', correct: '없음', use: '데스크톱, 게임' },
  { type: 'ECC (SECDED)', bits: '64 + 8 패리티', detect: '2비트 감지', correct: '1비트 정정', use: '서버 필수' },
  { type: '온다이 ECC (DDR5)', bits: 'DIMM 내부 보정', detect: '내부 셀 에러', correct: '내부 자동 정정', use: 'DDR5 기본' },
];

export default function ECC() {
  return (
    <section id="ecc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECC: 에러 정정 (서버 필수, 왜?)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ECC(Error Correcting Code)는 SECDED 방식으로 1비트 에러를 자동 정정합니다.<br />
          서버에서 메모리 비트 플립은 블록 검증 실패, DB 손상 등 치명적 결과를 초래합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['타입', '데이터 구조', '감지', '정정', '용도'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <motion.tr key={it.type} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{it.type}</td>
                  <td className="border border-border px-3 py-2">{it.bits}</td>
                  <td className="border border-border px-3 py-2">{it.detect}</td>
                  <td className="border border-border px-3 py-2">{it.correct}</td>
                  <td className="border border-border px-3 py-2">{it.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ECC 메모리 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ECC (Error-Correcting Code) Memory:

// Soft Error 원인:
// - cosmic rays (alpha particles)
// - electrical noise
// - thermal fluctuations
// - voltage variations
// - higher altitude = more errors

// Error rates:
// - ~1 error per GB per year (sea level)
// - ~10 errors per GB per year (higher altitude)
// - 1 TB machine: ~1000-10000 errors/year
// - datacenters: measurable

// SECDED (Single Error Correct, Double Error Detect):
//
// Encoding:
// - 64-bit data + 8-bit parity
// - Hamming code + parity
// - 72 bits total per transfer
//
// Correction:
// - 1 bit flipped → corrected automatically
// - 2 bits flipped → detected, not corrected
// - 3+ bits → not guaranteed
//
// Hardware support:
// - ECC memory controller in CPU
// - RAS (Reliability, Availability, Serviceability)
// - reported via OS

// Advanced ECC:
// - ChipKill (IBM): full chip failure recovery
// - Intel SDDC: single device data correction
// - AMD SEV-SNP: extended protection
// - DDR5 on-die ECC: DIMM-level

// Corrupted Memory Consequences:

// Ethereum validator:
// - wrong signature → slashed
// - bad state → fork invalidated
// - costs: 32 ETH stake at risk
//
// Bitcoin full node:
// - wrong hash → chain fork
// - mining wasted work
// - trust violation
//
// Databases:
// - wrong query results
// - silent data corruption
// - backup integrity lost
//
// HPC/AI:
// - wrong training gradients
// - incorrect ML models
// - research invalidated

// ECC Performance:
// - 8 extra bits per 64 = 12.5% overhead
// - no speed penalty (parallel paths)
// - slight latency (~1 cycle)
// - reliability worth it

// ECC Support:

// CPU:
// - Intel Xeon: all support
// - Intel Core: some (W-series)
// - AMD Ryzen: all support (UDIMM)
// - AMD EPYC: all support
//
// Motherboard:
// - Server chipsets: standard
// - Workstation: W680, TRX40
// - Consumer: varies
//
// Memory:
// - look for "ECC" label
// - Kingston, Micron, Samsung brands
// - premium over non-ECC
// - 10-20% more expensive

// When ECC 필요:
// ✓ Servers (always)
// ✓ Workstations (recommended)
// ✓ Blockchain nodes (mandatory)
// ✓ Databases
// ✓ AI/ML training
// ✗ Gaming (unnecessary)
// ✗ Casual desktop use

// Cost analysis:
// - ECC premium: ~$10-20/16GB
// - single error prevented: priceless
// - data corruption recovery: $$$
// - downtime: $1000+/hour`}
        </pre>
        <p className="leading-7">
          ECC: <strong>1 bit 자동 정정, 2 bit 감지 (SECDED)</strong>.<br />
          12.5% bit overhead, no speed penalty.<br />
          server/blockchain/DB 필수, gaming 불필요.
        </p>
      </div>
    </section>
  );
}
