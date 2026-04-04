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
      </div>
    </section>
  );
}
