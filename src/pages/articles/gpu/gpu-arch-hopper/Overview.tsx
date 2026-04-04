import { CitationBlock } from '@/components/ui/citation';

const generations = [
  { name: 'Kepler', year: 2012, node: '28nm' },
  { name: 'Maxwell', year: 2014, node: '28nm' },
  { name: 'Pascal', year: 2016, node: '16nm' },
  { name: 'Volta', year: 2017, node: '12nm' },
  { name: 'Turing', year: 2018, node: '12nm' },
  { name: 'Ampere', year: 2020, node: '7nm' },
  { name: 'Hopper', year: 2022, node: '4nm' },
];

const specRows = [
  ['SM 수', '20', '82', '132'],
  ['CUDA Cores / SM', '128', '128', '128'],
  ['총 CUDA Cores', '2560', '10496', '16896'],
  ['Tensor Cores', '-', '328 (3세대)', '528 (4세대)'],
  ['메모리', '8GB GDDR5X', '24GB GDDR6X', '80GB HBM3'],
  ['메모리 대역폭', '320 GB/s', '936 GB/s', '3.35 TB/s'],
  ['FP16 Tensor', '-', '312 TFLOPS', '989 TFLOPS'],
  ['FP8 Tensor', '-', '-', '1979 TFLOPS'],
  ['TDP', '180W', '350W', '700W'],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hopper vs 이전 세대 (GTX/Ampere)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NVIDIA GPU 아키텍처는 2012년 Kepler부터 약 2년 주기로 세대 교체를 거쳤습니다.
          <br />
          2022년 등장한 <strong>Hopper(H100)</strong>는 데이터센터 AI 학습 전용으로 설계된 최초의 아키텍처입니다.<br />
          이전 세대와 달리 그래픽 렌더링 유닛(RT Core)을 제거하고, AI 연산에 트랜지스터 예산을 집중했습니다.
        </p>

        <CitationBlock source="NVIDIA H100 Tensor Core GPU Architecture (Whitepaper)" citeKey={1} type="paper"
          href="https://resources.nvidia.com/en-us-tensor-core">
          <p className="italic">"H100 is the first GPU to introduce the Transformer Engine with FP8 precision,
          Thread Block Clusters, and the Tensor Memory Accelerator (TMA)."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">아키텍처 진화 타임라인</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {generations.map((g, i) => (
            <div key={g.name} className="flex items-center gap-1 text-sm">
              <span className={`px-2 py-1 rounded font-mono ${i === generations.length - 1 ? 'bg-emerald-500/15 text-emerald-400 font-bold' : 'bg-muted text-muted-foreground'}`}>
                {g.name} ({g.year})
              </span>
              {i < generations.length - 1 && <span className="text-muted-foreground/50">&rarr;</span>}
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">세대별 스펙 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">항목</th>
                <th className="border border-border px-4 py-2 text-left">GTX 1080 (Pascal)</th>
                <th className="border border-border px-4 py-2 text-left">RTX 3090 (Ampere)</th>
                <th className="border border-border px-4 py-2 text-left font-bold text-emerald-400">H100 (Hopper)</th>
              </tr>
            </thead>
            <tbody>
              {specRows.map(([label, pascal, ampere, hopper]) => (
                <tr key={label}>
                  <td className="border border-border px-4 py-2 font-medium">{label}</td>
                  <td className="border border-border px-4 py-2">{pascal}</td>
                  <td className="border border-border px-4 py-2">{ampere}</td>
                  <td className="border border-border px-4 py-2 font-semibold">{hopper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hopper의 3대 혁신</h3>
        <p className="leading-7">
          <strong>Tensor Memory Accelerator (TMA)</strong> -- 다차원 텐서를 하드웨어가 직접 복사합니다. 주소 계산이 불필요합니다.
          <br />
          <strong>Thread Block Cluster</strong> -- 블록 간 공유 메모리 접근이 가능한 새 계층입니다. GPC 단위로 블록을 묶습니다.
          <br />
          <strong>Transformer Engine</strong> -- FP8/FP16 혼합 정밀도를 자동 전환합니다. LLM 학습 처리량이 2배 증가합니다.
        </p>
      </div>
    </section>
  );
}
