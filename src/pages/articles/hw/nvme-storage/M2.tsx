import { motion } from 'framer-motion';

const specs = [
  { attr: '크기', val: '22mm x 80mm (2280)' },
  { attr: '인터페이스', val: 'PCIe 4.0 x4 (최대 5.0 x4)' },
  { attr: '최대 순차 읽기', val: '~7 GB/s (PCIe 4.0)' },
  { attr: '전력', val: '~5-8W' },
  { attr: '내구성', val: '~0.3-1 DWPD (컨슈머)' },
  { attr: '히트싱크', val: '메인보드 부착 또는 별도 구매' },
];

export default function M2() {
  return (
    <section id="m2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">M.2: 컨슈머 표준 (2280, 히트싱크)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          M.2 2280은 가장 보편적인 NVMe 폼팩터입니다.<br />
          작은 기판에 컨트롤러와 NAND가 밀집되어 발열 관리가 중요합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">M.2 2280</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.attr}</td>
                  <td className="border border-border px-3 py-2">{s.val}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
