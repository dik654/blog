import { motion } from 'framer-motion';

const compare = [
  { attr: '폼팩터', m2: '22×80mm 기판', u2: '2.5인치 금속', e1s: '5.9mm 두께 슬림' },
  { attr: '전력', m2: '~8W', u2: '~25W', e1s: '~25W (더 나은 열 분산)' },
  { attr: '핫스왑', m2: '불가', u2: '가능', e1s: '가능' },
  { attr: '내구성(DWPD)', m2: '0.3~1', u2: '3+', e1s: '3+' },
  { attr: '밀도', m2: '보통', u2: '보통', e1s: '높음 (1U에 32개)' },
  { attr: '주요 용도', m2: '데스크톱, 노트북', u2: '서버, 스토리지 어레이', e1s: '차세대 데이터센터' },
];

export default function E1S() {
  return (
    <section id="e1s" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">E1.S/E3.S: 차세대 데이터센터</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          E1.S는 OCP(Open Compute Project)에서 표준화한 차세대 폼팩터입니다.<br />
          1U 서버에 최대 32개를 장착할 수 있어 밀도와 전력 효율 모두 뛰어납니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', 'M.2', 'U.2', 'E1.S'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <motion.tr key={c.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{c.attr}</td>
                  <td className="border border-border px-3 py-2">{c.m2}</td>
                  <td className="border border-border px-3 py-2">{c.u2}</td>
                  <td className="border border-border px-3 py-2">{c.e1s}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
