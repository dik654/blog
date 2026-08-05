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

        <h3 className="text-xl font-semibold mt-8 mb-3">4-tier 스토리지</h3>
        <ul className="leading-7">
          <li><strong>Tier 1 — Sealing Cache (NVMe)</strong> — PC1/PC2 작업 데이터. sector 당 352 GiB (layer) + ~30 GiB (tree R). heavy 순차 쓰기. NVMe U.2 2~4 TB, DWPD 3+, 지속 2+ GB/s.</li>
          <li><strong>Tier 2 — Staging (NVMe)</strong> — ProveCommit tree (tree_c, tree_r_last). sector 당 ~60 GiB. proving 중 random access. NVMe M.2 또는 U.2, 10~30 TB.</li>
          <li><strong>Tier 3 — Sealed Storage (HDD/SAS)</strong> — 완료 sector (32 GiB 단위). read-only, WindowPoSt random read. SAS HDD 16 TB+, 서버당 100+ TB.</li>
          <li><strong>Tier 4 — Archive (HDD/Tape)</strong> — cold 데이터, 드문 접근, 대량 저장, TB 당 최저가.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">전형적 SP 서버 구성</h3>
        <ul className="leading-7">
          <li>CPU — AMD EPYC 9654 (96-core)</li>
          <li>RAM — 512 GB DDR5 ECC</li>
          <li>NVMe cache — 8× U.2 3.84TB = 30 TB</li>
          <li>HDD 스토리지 — 36× SAS 20TB = 720 TB</li>
          <li>GPU — 2× A100 80GB</li>
          <li>총합 — ~$100K</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">스케일링 경제</h3>
        <ul className="leading-7">
          <li>Small SP — 100~200 TB</li>
          <li>Mid SP — 1~5 PB</li>
          <li>Large SP — 10+ PB</li>
          <li>성장 방식 — horizontal (서버 수 증가)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계별 I/O 패턴</h3>
        <ul className="leading-7">
          <li><strong>PC1</strong> — 순차 쓰기 ~2 GB/s. 지속 성능 필수, thermal throttling 불가.</li>
          <li><strong>PC2</strong> — tree 구축. 순차 + random 혼합. GPU 와 협조.</li>
          <li><strong>C2</strong> — 입력 read + SNARK proof 생성. 쓰기 최소.</li>
          <li><strong>WindowPoSt</strong> — sector 전체에 걸친 random read. partition 당 ~1,000 challenge. 낮은 latency + 높은 IOPS 필요.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">TB 당 비용</h3>
        <ul className="leading-7">
          <li>NVMe (sealing) — amortized $300/TB</li>
          <li>HDD (sealed) — $15/TB</li>
          <li>전기료 — $0.1/TB/month</li>
          <li>총합 — ~$50/TB-year</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">수익 구조</h3>
        <ul className="leading-7">
          <li>Storage deal — $0.50~$2/TB/year</li>
          <li>Block reward — 변동</li>
          <li>FIL+ verified — 10x 승수</li>
          <li>2024 mainnet 순수익 — ~$10~$30/TB/year</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">ROI</h3>
        <ul className="leading-7">
          <li>하드웨어 — $100K</li>
          <li>연 수익 — ~$30K~$50K</li>
          <li>payback — 2~3년</li>
          <li>5년 ROI — 100~250%</li>
        </ul>
        <p className="leading-7">
          Filecoin SP: <strong>4-tier storage (NVMe cache → HDD archive)</strong>.<br />
          typical config: 30 TB NVMe + 720 TB SAS HDD + 2× A100.<br />
          $100K investment, 2-3 year payback, 100-250% 5-year ROI.
        </p>
      </div>
    </section>
  );
}
