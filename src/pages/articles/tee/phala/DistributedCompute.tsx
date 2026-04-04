import DistributedViz from './viz/DistributedViz';
import DistributedStepViz from './viz/DistributedStepViz';

export default function DistributedCompute({ title }: { title?: string }) {
  return (
    <section id="distributed" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '분산 컴퓨팅 (클러스터 & 롤업)'}</h2>
      <div className="not-prose mb-8">
        <DistributedViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Phala는 <strong>클러스터(Cluster)</strong> 단위로 TEE 워커를 관리합니다.<br />
          여러 워커가 하나의 논리 그룹을 형성하고, 컨트랙트가 클러스터에 배포됩니다.<br />
          <strong>Offchain Rollup</strong>으로 TEE 실행 결과만 온체인에 기록하여 가스 비용을 절감합니다.<br />
          <strong>SideVM</strong>으로 비동기 보조 서비스를 실행합니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <DistributedStepViz />
      </div>
    </section>
  );
}
