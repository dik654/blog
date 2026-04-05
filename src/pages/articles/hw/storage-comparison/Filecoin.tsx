import { motion } from 'framer-motion';

const guide = [
  { use: 'PC1 봉인 캐시', proto: 'NVMe (U.2)', why: '32GiB × 11레이어 순차 쓰기 → 고속 순차 쓰기 필수' },
  { use: 'PC2 트리 캐시', proto: 'NVMe (M.2/U.2)', why: 'Merkle 트리 빌드 — GPU와 병렬 I/O' },
  { use: '봉인 완료 섹터 저장', proto: 'SAS JBOD', why: '읽기만 발생, 대용량 저비용 필요' },
  { use: 'Reth/Geth 상태 DB', proto: 'NVMe (M.2/U.2)', why: '랜덤 I/O 집중 → NVMe 레이턴시 필수' },
  { use: 'WindowPoSt 증명', proto: 'NVMe', why: '랜덤 읽기로 챌린지 응답 → IOPS 중요' },
];

export default function Filecoin() {
  return (
    <section id="filecoin" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 마이닝: 스토리지 선택 가이드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin 마이닝은 단계별로 스토리지 요구사항이 다릅니다.<br />
          봉인 캐시는 NVMe, 장기 저장은 SAS JBOD가 비용 효율적입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['용도', '권장 프로토콜', '이유'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.map((g) => (
                <motion.tr key={g.use} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{g.use}</td>
                  <td className="border border-border px-3 py-2">{g.proto}</td>
                  <td className="border border-border px-3 py-2">{g.why}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin SP Storage Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin SP Storage Tiers:

// Tier 1: Sealing Cache (NVMe)
// - PC1/PC2 working data
// - 352 GiB per sector (layers)
// - ~30 GiB per sector (tree R)
// - heavy sequential write
// - requires: NVMe U.2 2-4 TB
// - DWPD: 3+ minimum
// - sustained write: 2+ GB/s

// Tier 2: Staging (NVMe)
// - ProveCommit trees
// - tree_c, tree_r_last
// - ~60 GiB per sector
// - random access during proving
// - requires: NVMe M.2 or U.2
// - capacity: 10-30 TB

// Tier 3: Sealed Storage (HDD/SAS)
// - completed sectors (32 GiB each)
// - read-only access
// - WindowPoSt random reads
// - cost optimization
// - requires: SAS HDD 16+ TB
// - capacity: 100+ TB per server

// Tier 4: Archive (HDD/Tape)
// - cold data
// - rare access
// - bulk storage
// - cheapest per TB

// Typical SP server config:
// - CPU: AMD EPYC 9654 (96-core)
// - RAM: 512 GB DDR5 ECC
// - NVMe cache: 8× U.2 3.84TB = 30 TB
// - HDD storage: 36× SAS 20TB = 720 TB
// - GPU: 2× A100 80GB
// - total: ~$100K

// Scaling economics:
// - Small SP: 100-200 TB
// - Mid SP: 1-5 PB
// - Large SP: 10+ PB
// - Growth: horizontal (more servers)

// Performance requirements:
//
// PC1 I/O pattern:
// - sequential write ~2 GB/s
// - needs sustained performance
// - no thermal throttling allowed
//
// PC2 I/O pattern:
// - tree construction
// - sequential + random
// - GPU coordination
//
// C2 I/O pattern:
// - read input data
// - SNARK proof generation
// - minimal writes
//
// WindowPoSt I/O pattern:
// - random reads across sectors
// - ~1000 challenges per partition
// - need low latency
// - high IOPS

// Cost breakdown (per TB stored):
// NVMe (sealing): $300/TB amortized
// HDD (sealed): $15/TB
// Electricity: $0.1/TB/month
// Total: ~$50/TB-year

// Revenue:
// Storage deals: $0.50-2/TB/year
// Block rewards: varies
// FIL+ verified: 10x multiplier
// 2024 mainnet: ~$10-30/TB/year net

// ROI:
// Hardware: $100K
// Revenue: ~$30K-50K/year
// Payback: 2-3 years
// 5-year ROI: 100-250%`}
        </pre>
        <p className="leading-7">
          Filecoin SP: <strong>4-tier storage (NVMe cache → HDD archive)</strong>.<br />
          typical config: 30 TB NVMe + 720 TB SAS HDD + 2× A100.<br />
          $100K investment, 2-3 year payback, 100-250% 5-year ROI.
        </p>
      </div>
    </section>
  );
}
