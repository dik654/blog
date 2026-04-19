import MetricsViz from './viz/MetricsViz';
import RooflineViz from './viz/RooflineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">병렬 처리 성능 지표</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPU 커널의 성능을 평가하려면 세 가지 지표를 측정해야 한다.
          <strong>처리량(Throughput)</strong>, <strong>대역폭(Bandwidth)</strong>, <strong>지연(Latency)</strong>이다.<br />
          이 중 어느 것이 병목인지에 따라 최적화 방향이 완전히 달라진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3대 성능 지표</h3>
        <p>
          처리량은 초당 부동소수점 연산 횟수(GFLOPS)로 계산한다.<br />
          대역폭은 초당 메모리 전송량(GB/s)이다.<br />
          지연은 하나의 연산이 완료되기까지 걸리는 사이클 수를 의미한다.<br />
          GPU는 수천 개의 스레드를 동시에 실행하여 지연을 숨긴다(latency hiding).
        </p>
        <div className="not-prose mb-4"><MetricsViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Roofline 모델</h3>
        <p>
          커널이 <strong>Compute-bound</strong>인지 <strong>Memory-bound</strong>인지 판별하는 도구가 Roofline 모델이다.<br />
          핵심 개념은 <strong>Arithmetic Intensity(AI)</strong>로, 전송된 바이트당 수행한 부동소수점 연산 수를 뜻한다.
        </p>
        <p>
          AI가 Ridge Point(정점)보다 낮으면 메모리 대역폭이 병목이다.<br />
          이 경우 coalescing 최적화, 캐시 활용, 데이터 재사용을 늘려야 한다.<br />
          AI가 Ridge Point보다 높으면 연산 유닛이 병목이므로, 명령어 수준 최적화나 Tensor Core 활용이 필요하다.
        </p>
        <div className="not-prose mb-4"><RooflineViz /></div>
      </div>
    </section>
  );
}
