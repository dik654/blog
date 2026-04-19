import CommitMsmViz from './viz/CommitMsmViz';
import BatchCommitViz from './viz/BatchCommitViz';

export default function CommitMsm() {
  return (
    <section id="commit-msm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">커밋 = MSM: 다항식에서 곡선점으로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          KZG 커밋은 정의 자체가 MSM이다.<br />
          다항식의 계수 벡터가 스칼라, SRS의 G1 점 벡터가 기저가 된다.
          <strong>msm-gpu-impl</strong> 글에서 다룬 Pippenger 버킷 방식 GPU 커널을 그대로 호출하면 된다.
        </p>
        <p>
          차수 d인 다항식의 커밋은 (d+1)개 스칼라-점 쌍의 MSM이다.<br />
          PLONK 기준 d는 게이트 수 n과 같으므로 n = 2^22라면 약 400만 쌍의 MSM이다.<br />
          GPU에서 약 50~100ms에 완료되며, CPU 대비 20~50배 빠르다.
        </p>
        <CommitMsmViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">배치 커밋 전략</h3>
        <p>
          PLONK Round 1에서는 3개의 와이어 다항식을 동시에 커밋한다.<br />
          독립 MSM 3회보다 <strong>Batched MSM</strong>이 효율적이다.<br />
          같은 SRS를 공유하므로 버킷 테이블 구성 비용을 한 번만 지불하고, GPU 캐시 적중률도 높아진다.
        </p>
        <p>
          ICICLE이나 sppark 같은 라이브러리는 batch MSM API를 제공한다.<br />
          내부적으로 스칼라를 인터리브 배치하여 동일 SRS 점에 대한 메모리 접근을 합친다.
        </p>
        <BatchCommitViz />
      </div>
    </section>
  );
}
