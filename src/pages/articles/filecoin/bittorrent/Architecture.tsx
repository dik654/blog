import SwarmFlowViz from './viz/SwarmFlowViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Swarm 아키텍처</h2>
      <div className="not-prose mb-8"><SwarmFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Seeder(완전한 파일 보유)로부터 조각 수신 시 수신자도 해당 조각을 다른 피어에게 공유<br />
          네트워크 전체 다운로드 속도 향상, 단일 서버 의존도 감소
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Tit-for-Tat 전략</h3>
        <p>
          Free-rider 방지를 위해 Tit-for-Tat(상호주의) 전략 사용<br />
          업로드 기여 많은 피어에게 우선 다운로드 대역폭 할당
        </p>
      </div>
    </section>
  );
}
