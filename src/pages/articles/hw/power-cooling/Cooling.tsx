import { motion } from 'framer-motion';

const methods = [
  { method: '블로워', dir: '전→후 직선 배기', pros: '서버 랙 에어플로 호환', cons: '소음 큼, 냉각 효율 보통' },
  { method: '오픈에어', dir: '히트싱크 + 팬 사방 확산', pros: '냉각 효율 높음, 저소음', cons: '서버 랙 부적합 (주변 과열)' },
  { method: 'AIO 수냉', dir: '라디에이터로 열 이동', pros: '고밀도 구성 가능', cons: '펌프 고장 위험, 유지보수' },
  { method: '커스텀 수냉', dir: '서버용 CoolIT/Asetek', pros: '최고 냉각 성능', cons: '높은 비용, 전문 설치 필요' },
];

export default function Cooling() {
  return (
    <section id="cooling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">냉각: 블로워 vs 오픈에어 vs 수냉</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          냉각 방식 선택은 서버 환경에서 가장 중요한 설계 결정입니다.<br />
          블로워는 랙 에어플로에 맞고, 오픈에어는 데스크톱 전용입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['냉각 방식', '열 방향', '장점', '단점'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <motion.tr key={m.method} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{m.method}</td>
                  <td className="border border-border px-3 py-2">{m.dir}</td>
                  <td className="border border-border px-3 py-2">{m.pros}</td>
                  <td className="border border-border px-3 py-2">{m.cons}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
