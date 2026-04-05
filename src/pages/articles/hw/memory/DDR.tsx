import { motion } from 'framer-motion';

const rows = [
  { attr: '전송 속도', ddr4: '3200 MT/s', ddr5: '5600 MT/s' },
  { attr: '전압', ddr4: '1.2V', ddr5: '1.1V' },
  { attr: '채널 구조', ddr4: '64비트 단일 채널', ddr5: '2 x 32비트 서브채널' },
  { attr: '뱅크 그룹', ddr4: '4개', ddr5: '8개' },
  { attr: '온다이 ECC', ddr4: '없음', ddr5: '있음 (DIMM 내부 보정)' },
  { attr: '최대 DIMM 용량', ddr4: '128GB', ddr5: '256GB (단일 DIMM)' },
];

export default function DDR() {
  return (
    <section id="ddr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DDR4 vs DDR5: 대역폭, 레이턴시, 채널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DDR5는 서브채널 분할로 실효 대역폭이 DDR4의 약 2배입니다.<br />
          온다이 ECC가 기본 탑재되어 DIMM 내부에서 1차 에러 보정을 수행합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', 'DDR4', 'DDR5'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.attr}</td>
                  <td className="border border-border px-3 py-2">{r.ddr4}</td>
                  <td className="border border-border px-3 py-2">{r.ddr5}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">DDR4 vs DDR5 기술 차이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DDR5 핵심 개선사항:

// 1. Sub-channel Architecture:
// DDR4: single 64-bit channel per DIMM
// DDR5: two 32-bit sub-channels per DIMM
// - independent addressing
// - 2x command/address bus
// - better parallelism
// - effective bandwidth ~2x

// 2. On-die ECC:
// - integrated in DDR5 DIMM
// - protects DRAM cell errors
// - transparent to CPU
// - not replacement for SECDED
// - reduces soft error rate

// 3. Power Management:
// DDR4: external PMIC on motherboard
// DDR5: PMIC on DIMM
// - better voltage regulation
// - per-DIMM tuning
// - lower power (1.1V vs 1.2V)
// - higher speeds possible

// 4. Higher Speeds:
// DDR4: 2133-3200 MT/s (standard)
// DDR4 OC: up to 5000 MT/s
// DDR5: 4800-5600 MT/s (launch)
// DDR5: 8000+ MT/s (overclocked)
// - near-doubling

// 5. Bank Groups:
// DDR4: 4 bank groups (4 banks each = 16)
// DDR5: 8 bank groups (4 banks each = 32)
// - more parallel access
// - better random I/O
// - reduced row conflicts

// 6. Capacity:
// DDR4: 16 Gb max density
// DDR5: 64 Gb max density
// - 4x per chip
// - larger DIMMs possible

// Bandwidth comparison:

// DDR4-3200:
// - per DIMM: 25.6 GB/s
// - dual-channel: 51.2 GB/s
// - 8-channel server: 205 GB/s

// DDR5-4800:
// - per DIMM: 38.4 GB/s
// - dual-channel: 76.8 GB/s
// - 8-channel server: 307 GB/s

// DDR5-5600:
// - per DIMM: 44.8 GB/s
// - dual-channel: 89.6 GB/s
// - 8-channel server: 358 GB/s

// Latency:
// DDR4 CL16: 10 ns
// DDR5 CL40: 14 ns
// - DDR5 higher nominal CL
// - but faster data rate
// - similar actual latency

// Workload implications:
//
// Memory-bound:
// - DDR5 significantly faster
// - MSM computations
// - large graph algorithms
// - database scans
//
// Latency-sensitive:
// - marginal gains
// - CPU caches matter more
// - DDR4 still competitive
//
// Cost:
// - DDR4: $3-5/GB (2024)
// - DDR5: $4-8/GB (2024)
// - converging

// Compatibility:
// - different slots (not interchangeable)
// - requires DDR5-compatible motherboard
// - Intel 12th gen+ (2021)
// - AMD Ryzen 7000+ (2022)
// - servers: Sapphire Rapids, Genoa+`}
        </pre>
        <p className="leading-7">
          DDR5: <strong>sub-channels + on-die ECC + higher speeds</strong>.<br />
          8-channel server: DDR4 205 GB/s → DDR5 358 GB/s.<br />
          Intel 12th+, AMD Ryzen 7000+, server 2023+.
        </p>
      </div>
    </section>
  );
}
