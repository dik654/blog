import NttMappingViz from './viz/NttMappingViz';
import ParallelismViz from './viz/ParallelismViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cooley-Tukey NTT를 GPU에 매핑하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NTT(Number Theoretic Transform)는 <strong>유한체 위의 FFT</strong>다.<br />
          복소수 대신 소수체 Fp에서 단위근을 사용하며, 부동소수점 오차 없이 정확한 다항식 곱셈을 수행한다.<br />
          ZKP 증명 시스템에서 다항식 곱셈과 평가를 위해 핵심적으로 사용된다.
        </p>
        <NttMappingViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">스테이지 내 병렬성과 스테이지 간 의존성</h3>
        <p>
          핵심 관찰: 같은 스테이지 안의 n/2개 나비 연산은 서로 <strong>완전히 독립</strong>이다.<br />
          GPU의 수천 개 코어에 직접 매핑할 수 있다.<br />
          단, 다음 스테이지로 넘어가려면 이전 스테이지의 모든 결과가 필요하므로 <strong>배리어 동기화</strong>가 필수다.
        </p>
        <p>
          이 제약이 GPU 구현의 핵심 설계 결정을 만든다.<br />
          블록 내 동기화(__syncthreads)는 저렴하지만, 블록 간 동기화는 커널 재실행이 유일한 방법이다.<br />
          따라서 작은 stride 스테이지는 공유 메모리에서 한 번에, 큰 stride 스테이지는 글로벌 메모리에서 스테이지별로 실행한다.
        </p>
        <ParallelismViz />
      </div>
    </section>
  );
}
