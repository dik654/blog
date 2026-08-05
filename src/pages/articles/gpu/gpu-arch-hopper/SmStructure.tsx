import { CitationBlock } from '@/components/ui/citation';
import SmStructureViz from './viz/SmStructureViz';
import Fp8FormatViz from './viz/Fp8FormatViz';

const tcRows = [
  ['Volta (2017)', '1세대', 'FP16', '-', '-', '-'],
  ['Turing (2018)', '2세대', 'FP16', 'INT8/INT4', '-', '-'],
  ['Ampere (2020)', '3세대', 'FP16', 'INT8/INT4', 'TF32, BF16', '-'],
  ['Hopper (2022)', '4세대', 'FP16', 'INT8', 'TF32, BF16', 'FP8 (E4M3, E5M2)'],
];

export default function SmStructure() {
  return (
    <section id="sm-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SM 구조: FP8, Tensor Core 4세대</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Hopper SM은 4개의 프로세싱 블록으로 구성됩니다. 각 블록에 32개 FP32 코어, 16개 FP64 코어, 1개 4세대 Tensor Core가 포함됩니다.
          <br />
          L1 캐시와 공유 메모리를 합산한 크기가 <strong>256KB</strong>로, Ampere(192KB) 대비 33% 증가했습니다.
        </p>

        <SmStructureViz />

        <CitationBlock source="NVIDIA H100 Whitepaper -- SM Architecture" citeKey={2} type="paper"
          href="https://resources.nvidia.com/en-us-tensor-core">
          <p className="italic">"Each Hopper SM features 128 FP32 CUDA Cores, 4 fourth-generation Tensor Cores,
          and a 256 KB combined L1/shared memory — a 33% increase over A100."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Tensor Core 세대별 지원 정밀도</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['아키텍처', '세대', 'FP16', 'INT', 'TF32/BF16', 'FP8'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tcRows.map(([arch, gen, fp16, int8, tf32, fp8]) => (
                <tr key={arch}>
                  <td className="border border-border px-3 py-2 font-medium">{arch}</td>
                  <td className="border border-border px-3 py-2">{gen}</td>
                  <td className="border border-border px-3 py-2">{fp16}</td>
                  <td className="border border-border px-3 py-2">{int8}</td>
                  <td className="border border-border px-3 py-2">{tf32}</td>
                  <td className="border border-border px-3 py-2 font-semibold">{fp8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">FP8: E4M3 vs E5M2</h3>
        <p className="leading-7">
          Hopper가 도입한 FP8은 두 가지 포맷을 사용합니다.
          <strong>E4M3</strong>은 정밀도가 높아 순전파에 적합하고, <strong>E5M2</strong>는 동적 범위가 넓어 역전파 그래디언트에 적합합니다.
        </p>
        <Fp8FormatViz />
      </div>
    </section>
  );
}
