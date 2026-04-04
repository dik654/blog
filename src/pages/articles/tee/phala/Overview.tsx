import PhalaArchViz from './viz/PhalaArchViz';
import OverviewStepViz from './viz/OverviewStepViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 시스템 아키텍처'}</h2>
      <div className="not-prose mb-8">
        <PhalaArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Phala Network</strong>는 TEE 기반 오프체인 컴퓨팅 프로토콜입니다.<br />
          AI 에이전트를 위한 탈중앙화 실행 레이어를 제공합니다.<br />
          Substrate 블록체인 위에 Intel SGX 기반 TEE 워커를 연결하여
          기밀 스마트 컨트랙트(Phat Contract)를 실행합니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <OverviewStepViz />
      </div>
    </section>
  );
}
