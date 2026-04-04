import { motion } from 'framer-motion';

const gpus = [
  { gpu: 'RTX 4090', tdp: '450W', cool: '오픈에어', note: '데스크톱/워크스테이션' },
  { gpu: 'RTX 5090', tdp: '575W', cool: '오픈에어', note: '데스크톱/워크스테이션' },
  { gpu: 'A100 SXM', tdp: '400W', cool: '블로워', note: '서버 랙 최적화' },
  { gpu: 'H100 SXM', tdp: '700W', cool: '블로워', note: '서버 랙 최적화' },
];

export default function TDP() {
  return (
    <section id="tdp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDP & 전력 소비: GPU별 실측</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TDP(Thermal Design Power)는 GPU가 최대 부하에서 방출하는 열량입니다.<br />
          냉각 시스템은 이 열을 처리할 수 있어야 합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'TDP', '냉각 타입', '적합 환경'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpus.map((g) => (
                <motion.tr key={g.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{g.gpu}</td>
                  <td className="border border-border px-3 py-2">{g.tdp}</td>
                  <td className="border border-border px-3 py-2">{g.cool}</td>
                  <td className="border border-border px-3 py-2">{g.note}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
