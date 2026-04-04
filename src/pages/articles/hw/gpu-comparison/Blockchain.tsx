import { motion } from 'framer-motion';

const workloads = [
  { name: 'MSM (다중 스칼라 곱셈)', bottleneck: '메모리 대역폭', best: 'H100 (HBM3 3.35TB/s)', alt: '4090도 가능 (1TB/s)' },
  { name: 'NTT (수론 변환)', bottleneck: 'CUDA 코어 수', best: '5090 (21,760 코어)', alt: 'H100 (16,896 코어)' },
  { name: 'Filecoin 봉인 C2', bottleneck: 'VRAM + 연산', best: 'A100 80GB', alt: '4090 24GB (32GiB 섹터)' },
  { name: 'SHA256 해싱', bottleneck: 'TDP당 해시율', best: '4090 (450W)', alt: 'ASIC이 더 효율적' },
];

export default function Blockchain() {
  return (
    <section id="blockchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 워크로드별 선택</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          블록체인 워크로드마다 병목 지점이 다릅니다.<br />
          MSM은 메모리 대역폭, NTT는 연산량, 봉인은 VRAM이 핵심 지표입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['워크로드', '병목', '최적 GPU', '대안'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workloads.map((w) => (
                <motion.tr key={w.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{w.name}</td>
                  <td className="border border-border px-3 py-2">{w.bottleneck}</td>
                  <td className="border border-border px-3 py-2">{w.best}</td>
                  <td className="border border-border px-3 py-2">{w.alt}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
