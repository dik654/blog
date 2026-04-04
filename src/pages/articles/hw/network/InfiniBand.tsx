import { motion } from 'framer-motion';

const generations = [
  { gen: 'FDR', rate: '56 Gbps', use: '레거시 HPC' },
  { gen: 'EDR', rate: '100 Gbps', use: '이전 세대 GPU 클러스터' },
  { gen: 'HDR', rate: '200 Gbps', use: 'DGX A100 (8x A100)' },
  { gen: 'NDR', rate: '400 Gbps', use: 'DGX H100 (8x H100)' },
];

const useCases = [
  { use: '블록체인 노드 (Reth/Geth)', need: '10G 이더넷 충분', reason: '블록 ~100KB, TX 전파 ~1KB' },
  { use: 'ML 학습 클러스터', need: 'InfiniBand NDR', reason: '텐서 병렬: GPU 간 GB/s 단위 통신' },
  { use: '분산 ZK 증명', need: '25G+ 이더넷', reason: '증명 조각 교환, 메모리 풀 공유' },
];

export default function InfiniBand() {
  return (
    <section id="infiniband" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">InfiniBand: GPU 클러스터 연결</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          InfiniBand는 GPU 클러스터 전용 인터커넥트입니다.<br />
          NVLink(노드 내 GPU 간)과 InfiniBand(노드 간)가 함께 DGX 스케일을 구성합니다.
        </p>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['세대', '대역폭', '대표 구성'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generations.map((g) => (
                <motion.tr key={g.gen} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{g.gen}</td>
                  <td className="border border-border px-3 py-2">{g.rate}</td>
                  <td className="border border-border px-3 py-2">{g.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">용도별 네트워크 선택</h3>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['용도', '필요 네트워크', '이유'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {useCases.map((u) => (
                <motion.tr key={u.use} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{u.use}</td>
                  <td className="border border-border px-3 py-2">{u.need}</td>
                  <td className="border border-border px-3 py-2">{u.reason}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
