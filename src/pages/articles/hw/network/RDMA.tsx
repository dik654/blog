import { motion } from 'framer-motion';

const compare = [
  { attr: '레이턴시', tcp: '~50us', rdma: '~1us' },
  { attr: 'CPU 사용', tcp: '높음 (커널 스택 통과)', rdma: '최소 (NIC 직접 처리)' },
  { attr: '대역폭 효율', tcp: '~60-70%', rdma: '~95%+' },
  { attr: '필요 NIC', tcp: '일반 이더넷', rdma: 'RoCE v2 또는 IB HCA' },
  { attr: '스위치 요구', tcp: '일반 스위치', rdma: 'ECN/PFC 지원 스위치 (RoCE)' },
];

export default function RDMA() {
  return (
    <section id="rdma" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RDMA & RoCE v2</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RDMA(Remote Direct Memory Access)는 원격 서버 메모리에 CPU 개입 없이 접근합니다.<br />
          RoCE v2는 일반 이더넷 위에서 RDMA를 구현한 프로토콜입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', '일반 TCP', 'RDMA/RoCE v2'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <motion.tr key={c.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{c.attr}</td>
                  <td className="border border-border px-3 py-2">{c.tcp}</td>
                  <td className="border border-border px-3 py-2">{c.rdma}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
