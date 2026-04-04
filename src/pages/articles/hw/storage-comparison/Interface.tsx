import { motion } from 'framer-motion';

const rows = [
  { proto: 'SATA (AHCI)', queue: '1큐 x 32커맨드', bw: '~550 MB/s', conn: 'SATA 커넥터', latency: '~100us' },
  { proto: 'NVMe', queue: '64K큐 x 64K커맨드', bw: '~7 GB/s (PCIe 4.0 x4)', conn: 'M.2 / U.2 / PCIe', latency: '~10us' },
  { proto: 'SAS', queue: '듀얼 포트', bw: '~2.4 GB/s (12Gbps)', conn: 'SFF-8644', latency: '~50us' },
];

export default function Interface() {
  return (
    <section id="interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인터페이스: AHCI vs NVMe 큐 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SATA의 AHCI는 HDD 시대 설계입니다. 큐 1개에 커맨드 32개만 처리합니다.<br />
          NVMe는 PCIe에 직결되어 64K 큐로 I/O 병렬성을 극대화합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['프로토콜', '큐 구조', '최대 대역폭', '커넥터', '레이턴시'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.proto} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.proto}</td>
                  <td className="border border-border px-3 py-2">{r.queue}</td>
                  <td className="border border-border px-3 py-2">{r.bw}</td>
                  <td className="border border-border px-3 py-2">{r.conn}</td>
                  <td className="border border-border px-3 py-2">{r.latency}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
