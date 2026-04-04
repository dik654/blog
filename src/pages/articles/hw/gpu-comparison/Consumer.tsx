import { motion } from 'framer-motion';

const specs = [
  { gpu: 'RTX 4090', cores: '16,384', vram: '24GB GDDR6X', bw: '1,008 GB/s', tdp: '450W', cool: '오픈에어' },
  { gpu: 'RTX 5090', cores: '21,760', vram: '32GB GDDR7', bw: '1,792 GB/s', tdp: '575W', cool: '오픈에어' },
];

export default function Consumer() {
  return (
    <section id="consumer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨슈머 GPU (4090, 5090)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          컨슈머 GPU는 가격 대비 성능이 뛰어납니다.<br />
          단, 오픈에어 쿨링이라 서버 랙에 넣으면 냉각 문제가 발생합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'CUDA 코어', 'VRAM', '대역폭', 'TDP', '냉각'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.gpu}</td>
                  <td className="border border-border px-3 py-2">{s.cores}</td>
                  <td className="border border-border px-3 py-2">{s.vram}</td>
                  <td className="border border-border px-3 py-2">{s.bw}</td>
                  <td className="border border-border px-3 py-2">{s.tdp}</td>
                  <td className="border border-border px-3 py-2">{s.cool}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
