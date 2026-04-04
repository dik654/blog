import { motion } from 'framer-motion';

const specs = [
  { gpu: 'A100 SXM', cores: '6,912', vram: '80GB HBM2e', bw: '2,039 GB/s', tdp: '400W', feat: 'NVLink 600GB/s' },
  { gpu: 'H100 SXM', cores: '16,896', vram: '80GB HBM3', bw: '3,350 GB/s', tdp: '700W', feat: 'NVLink 900GB/s' },
];

export default function Datacenter() {
  return (
    <section id="datacenter" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터센터 GPU (A100, H100)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          데이터센터 GPU는 블로워 타입 냉각으로 서버 랙에 최적화되어 있습니다.<br />
          HBM 메모리는 GDDR 대비 대역폭이 2~3배 높아 MSM 같은 메모리 바운드 연산에 유리합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'CUDA 코어', 'VRAM', '대역폭', 'TDP', '특수 기능'].map(h => (
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
                  <td className="border border-border px-3 py-2">{s.feat}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
