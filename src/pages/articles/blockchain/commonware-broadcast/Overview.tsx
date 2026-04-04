import ArchLayerViz from './viz/ArchLayerViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기존 브로드캐스트 문제 & 설계 목표</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          기존 블록체인: 리더가 전체 블록을 모든 검증자에게 전송
          <br />
          대역폭 낭비(중복 전송) · 리더 병목(단일 노드 의존) · 리더 비응답 시 전체 지연
        </p>
        <p className="leading-7">
          Commonware의 접근: <strong>합의와 전파를 완전 분리</strong>
          <br />
          3계층 — <code>Broadcaster</code> trait(전파 추상화) → <code>ordered_broadcast</code>(인증서 체인) → <code>Zoda</code>(DA 샤딩)
        </p>
      </div>
      <div className="not-prose mb-8"><ArchLayerViz /></div>
    </section>
  );
}
