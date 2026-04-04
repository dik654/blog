import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import MSMStepsViz from './viz/MSMStepsViz';
import { msmCode, nttCode, ecdsaCode, cudaSamplesCode } from './BlockchainGPUData';

export default function BlockchainGPU() {
  return (
    <section id="blockchain-gpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 GPU 가속 실전</h2>
      <div className="not-prose mb-8"><MSMStepsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">MSM (Multi-Scalar Multiplication)</h3>
        <p>
          ZK 증명 생성에서 가장 연산량이 큰 부분은 MSM(Multi-Scalar Multiplication, 다중 스칼라 곱)입니다.
          <br />
          이더리움의 precompile(BN254 pairing)에도 동일한 연산이 사용됩니다.
        </p>
        <CitationBlock source="Pippenger, On the evaluation of powers, 1980" citeKey={4} type="paper">
          <p className="italic">"The Pippenger algorithm reduces multi-scalar multiplication from O(n) to O(n / log n)."</p>
        </CitationBlock>
        <CodePanel title="Pippenger MSM GPU 병렬화" code={msmCode}
          annotations={[
            { lines: [1, 1], color: 'sky', note: 'MSM 공식' },
            { lines: [3, 6], color: 'amber', note: 'CPU 순차 vs GPU 병렬' },
            { lines: [16, 19], color: 'emerald', note: 'Pippenger 알고리즘 요약' },
          ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">NTT (Number Theoretic Transform)</h3>
        <CodePanel title="GPU NTT (Butterfly 연산)" code={nttCode}
          annotations={[
            { lines: [1, 5], color: 'sky', note: 'NTT = 유한체 위의 FFT' },
            { lines: [7, 14], color: 'emerald', note: 'Butterfly 연산 단계' },
            { lines: [16, 19], color: 'amber', note: 'CUDA 구현 고려사항' },
          ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">ECDSA 서명 검증 GPU 가속</h3>
        <CodePanel title="배치 ECDSA 검증" code={ecdsaCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'CPU 순차: ~100ms' },
            { lines: [7, 10], color: 'emerald', note: 'GPU 병렬: ~5ms' },
            { lines: [12, 19], color: 'amber', note: '주요 GPU 가속 라이브러리' },
          ]} />
        <CitationBlock source="Tian et al., gECC: GPU-accelerated ECC" citeKey={5} type="paper">
          <p className="italic">"gECC achieves 5.56x speedup for ECDSA verification on NVIDIA A100 GPUs."</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">cuda-samples 주요 예제</h3>
        <p>
          cuda-samples/ 블록체인 관련 예제:<br />
          Samples/0_Introduction/<br />
          vectorAdd/ # 기초: 벡터 덧셈 (병렬 패턴 이해)<br />
          matrixMul/ # 행렬 곱셈 (공유 메모리 타일링)<br />
          simpleCallback/ # 비동기 실행 패턴<br />
          Samples/2_Concepts_and_Techniques/<br />
          reduction/ # 리덕션 (버킷 합산에 활용)<br />
          shfl_scan/ # Warp-level 프리미티브<br />
          threadFenceReduction/ # 메모리 펜스<br />
          Samples/4_CUDA_Libraries/<br />
          batchedLabelMarkersAndLabelCompressionNPP/<br />
          conjugateGradient/ # 반복 솔버 (선형 시스템)
        </p>
      </div>
    </section>
  );
}
