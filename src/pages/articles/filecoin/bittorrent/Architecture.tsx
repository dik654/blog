import SwarmFlowViz from "./viz/SwarmFlowViz";

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Swarm 아키텍처</h2>
      <div className="not-prose mb-8">
        <SwarmFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          완전한 파일을 가진 seeder가 초기 조각을 공급하지만, 조각을 받은
          leecher도 곧바로 그 조각을 다른 피어에게 업로드할 수 있다. 수신자가
          동시에 공급자가 되기 때문에 swarm의 참여가 늘수록 전송 경로가
          분산되고 단일 서버에 걸리는 부하도 줄어든다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Tit-for-Tat 전략</h3>
        <p>
          클라이언트는 자신에게 데이터를 잘 보내는 피어를 우선적으로
          unchoke하는 상호주의 전략을 사용한다. 다만 실제 구현에는 optimistic
          unchoke와 peer selection 정책도 함께 들어가므로, tit-for-tat을 단순한
          일대일 보상 규칙으로 이해하면 동작을 놓치기 쉽다.
        </p>
      </div>
    </section>
  );
}
