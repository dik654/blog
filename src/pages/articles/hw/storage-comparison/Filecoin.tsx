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
      </div>
    </section>
  );
}
