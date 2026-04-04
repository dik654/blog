import { motion } from 'framer-motion';

const rows = [
  { attr: '소켓', server: 'LGA 4677 (Xeon) / SP5 (EPYC)', desktop: 'LGA 1700 / AM5' },
  { attr: 'PCIe 레인', server: '80 (Xeon) / 128 (EPYC)', desktop: '20~24' },
  { attr: 'ECC 지원', server: '필수 (RDIMM)', desktop: '일부 (Ryzen PRO)' },
  { attr: 'TDP', server: '250~350W', desktop: '65~170W' },
  { attr: '코어 수', server: '최대 96코어 (EPYC)', desktop: '최대 24코어' },
];

export default function CPU() {
  return (
    <section id="cpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CPU: Xeon/EPYC vs Core/Ryzen</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버 CPU의 핵심 차이는 PCIe 레인 수와 ECC 메모리 지원입니다.<br />
          EPYC은 단일 소켓에 128 PCIe 레인을 제공해 다중 GPU 구성에 유리합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', '서버 (Xeon/EPYC)', '데스크톱 (Core/Ryzen)'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.attr}</td>
                  <td className="border border-border px-3 py-2">{r.server}</td>
                  <td className="border border-border px-3 py-2">{r.desktop}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
