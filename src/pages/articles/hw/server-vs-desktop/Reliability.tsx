import { motion } from 'framer-motion';

const items = [
  { feat: 'ECC 메모리', why: '1비트 에러 자동 정정, 2비트 에러 감지', risk: '비트 플립 → 데이터 손상, 블록 검증 실패' },
  { feat: '이중 전원 (Redundant PSU)', why: 'PSU 1개 고장 시 나머지가 100% 부하 담당', risk: '단일 PSU 고장 = 전체 시스템 다운' },
  { feat: '핫스왑 디스크', why: 'RAID 구성에서 디스크 교체 시 무중단', risk: '서비스 중단 후 교체 → 다운타임' },
  { feat: '열 센서 + 팬 제어', why: 'BMC가 온도 모니터링, 팬 속도 자동 조절', risk: '과열 시 쓰로틀링 → 증명 시간 초과' },
];

export default function Reliability() {
  return (
    <section id="reliability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안정성: ECC, 핫스왑, 이중 전원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버 부품의 핵심 가치는 안정성입니다.<br />
          ECC 메모리, 이중 전원, 핫스왑 디스크는 24/7 운영의 기본 요건입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['기능', '서버 이점', '없을 때 위험'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <motion.tr key={it.feat} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{it.feat}</td>
                  <td className="border border-border px-3 py-2">{it.why}</td>
                  <td className="border border-border px-3 py-2 text-red-600 dark:text-red-400">{it.risk}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Reliability Features 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 핵심 Reliability Features:

// 1. ECC Memory (Error-Correcting Code):
// Problem:
// - cosmic rays flip bits
// - 1-2 errors per GB per year
// - large memory = more errors
// - 4 TB machine: ~4-8 errors/year
//
// ECC mechanism:
// - adds parity bits
// - Hamming code
// - SECDED: Single Error Correct, Double Error Detect
// - corrects single bit errors
// - detects double bit errors
//
// Without ECC:
// - silent data corruption
// - random crashes
// - incorrect computations
// - blockchain: invalid proofs
// - databases: corrupted records

// 2. Redundant PSUs:
// - 2+ PSUs working in parallel
// - 1+1 config (either alone can power)
// - hot-swappable
// - independent power circuits
// - survives PSU failure
//
// Economic math:
// - single PSU: $150, fails once per 5 years
// - downtime cost: $1000/hour
// - redundant PSU: $300, ~0% downtime risk
// - payback: 1 failure

// 3. Hot-swap Drives:
// - SAS/SATA/U.2 slots
// - tool-less removal
// - RAID rebuild online
// - no service interruption
// - critical for 24/7 uptime

// 4. BMC Monitoring:
// - continuous sensor polling
// - temperature, voltage, fans
// - alerts on anomalies
// - SNMP, email, webhook
// - datacenter integration

// 5. Thermal Management:
// - multiple zones
// - temperature-based fan curves
// - prevents throttling
// - predictive maintenance
// - fan failure redundancy

// 6. Fault Tolerance Stack:
// L1 (Component): ECC, RAID
// L2 (System): redundant PSU, hot-swap
// L3 (Network): dual NICs, LACP
// L4 (Application): clustering, failover
// L5 (Geographic): multi-datacenter

// Real-world failure rates (24/7 ops):
// - HDD: 1-3% annual failure
// - SSD: 0.5-2% annual failure
// - PSU: 1-3% annual failure
// - RAM: 2-6 errors/GB/year
// - Fan: 3-5% annual failure
// - CPU: <0.1% annual failure

// MTBF comparisons:
// Consumer: 50,000-100,000 hours
// Enterprise: 200,000-1,000,000 hours
// 2-10x better reliability

// Blockchain impact:
// - corrupt memory → invalid proof → slashing
// - PSU failure → missed PoSt → fault fee
// - disk failure → data loss → termination
// - each cost: $$$$
// - server reliability = financial protection`}
        </pre>
        <p className="leading-7">
          Reliability stack: <strong>ECC + redundant PSU + hot-swap + BMC + clustering</strong>.<br />
          MTBF 2-10x 차이 (50K → 1M hours).<br />
          blockchain: 1 hardware failure = slashing/termination → 경제적 파국.
        </p>
      </div>
    </section>
  );
}
