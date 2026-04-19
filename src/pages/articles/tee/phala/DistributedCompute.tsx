import DistributedViz from './viz/DistributedViz';
import DistributedStepViz from './viz/DistributedStepViz';
import ClusterArchViz from './viz/ClusterArchViz';
import OffchainRollupViz from './viz/OffchainRollupViz';
import SideVMViz from './viz/SideVMViz';
import PhatBricksViz from './viz/PhatBricksViz';

export default function DistributedCompute({ title }: { title?: string }) {
  return (
    <section id="distributed" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '분산 컴퓨팅 (클러스터 & 롤업)'}</h2>
      <div className="not-prose mb-8">
        <DistributedViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">분산 컴퓨팅 모델</h3>
        <p>
          <strong>Cluster</strong>: TEE 워커의 논리 그룹 — 같은 키 공유, 같은 컨트랙트 실행<br />
          <strong>Offchain Rollup</strong>: TEE 실행 결과를 on-chain commit — 가스 절감<br />
          <strong>SideVM</strong>: 비동기 장기 실행 컨테이너 — 이벤트 구독, 스트리밍<br />
          <strong>Phat Bricks</strong>: 재사용 가능한 컴포넌트 라이브러리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cluster 아키텍처</h3>
      </div>
      <div className="not-prose my-6"><ClusterArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Offchain Rollup</h3>
      </div>
      <div className="not-prose my-6"><OffchainRollupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">SideVM — 장기 실행 컨테이너</h3>
      </div>
      <div className="not-prose my-6"><SideVMViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <DistributedStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Phat Bricks — 재사용 컴포넌트</h3>
      </div>
      <div className="not-prose my-6"><PhatBricksViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Phala의 Web3 AI 비전</p>
          <p>
            <strong>AI Agent Infrastructure</strong>:<br />
            - 2024 Phala 방향 전환: AI agent 플랫폼<br />
            - LLM inference를 TEE 안에서<br />
            - 개인 프롬프트·응답 기밀성<br />
            - Agent state persistence
          </p>
          <p className="mt-2">
            <strong>주요 통합</strong>:<br />
            - Fleek: Edge compute + Phala TEE<br />
            - Eliza AI framework: Phat Contract 지원<br />
            - Redpill: LLM gateway (Phala 기반)
          </p>
          <p className="mt-2">
            <strong>경쟁 분야</strong>:<br />
            - Ritual (Coinbase): 탈중앙 AI<br />
            - Bittensor: ML 모델 네트워크<br />
            - Phala 차별점: TEE privacy + Polkadot 생태계
          </p>
        </div>

      </div>
    </section>
  );
}
