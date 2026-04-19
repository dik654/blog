import SingleOpenViz from './viz/SingleOpenViz';
import BatchOpenViz from './viz/BatchOpenViz';
import GpuPipelineViz from './viz/GpuPipelineViz';

export default function BatchOpening() {
  return (
    <section id="batch-opening" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Batch Opening 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          KZG의 진정한 강점은 <strong>batch opening</strong>이다.
          k개의 다항식을 같은 점 z에서 열 때, 랜덤 선형 결합으로 하나의 몫 다항식을 만들면
          증명이 G1 점 단 하나로 압축된다. 검증도 pairing 2회로 동일하다.
        </p>
        <SingleOpenViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Batch Opening: k개를 하나로</h3>
        <p>
          PLONK Round 5에서는 11개 이상의 다항식을 동시에 연다.<br />
          Fiat-Shamir로 챌린지 gamma를 추출한 뒤, 다항식을 gamma의 거듭제곱으로 선형 결합한다.<br />
          GPU에서는 계수별 스칼라곱과 벡터 덧셈이므로 O(k*n)에 완료된다.
        </p>
        <BatchOpenViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 파이프라인 전체 흐름</h3>
        <p>
          Step 6의 MSM이 전체 시간의 80% 이상을 차지한다.<br />
          Step 2의 선형 결합은 element-wise 연산이므로 GPU 메모리 대역폭에 바운드된다.<br />
          Step 5의 synthetic division은 순차적이지만 n개 Fp 곱셈-뺄셈으로 GPU에서도 빠르다.
        </p>
        <GpuPipelineViz />
      </div>
    </section>
  );
}
