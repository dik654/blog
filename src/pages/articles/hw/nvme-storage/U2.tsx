import { motion } from 'framer-motion';

const specs = [
  { attr: '크기', val: '2.5인치 (15mm 두께)' },
  { attr: '인터페이스', val: 'PCIe 4.0 x4 (U.2 커넥터, SFF-8639)' },
  { attr: '최대 순차 읽기', val: '~7 GB/s' },
  { attr: '전력', val: '~15-25W' },
  { attr: '내구성', val: '3+ DWPD (엔터프라이즈)' },
  { attr: '핫스왑', val: '서버 백플레인 지원' },
];

export default function U2() {
  return (
    <section id="u2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U.2: 서버/엔터프라이즈 (핫스왑, 전력)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          U.2는 2.5인치 금속 케이스로 열 분산이 뛰어나고 핫스왑을 지원합니다.<br />
          엔터프라이즈 등급(3+ DWPD)으로 봉인 같은 연속 쓰기 워크로드에 적합합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">U.2</th>
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
