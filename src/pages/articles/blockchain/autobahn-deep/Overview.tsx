import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn 하이브리드 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Autobahn은 PBFT의 낮은 지연과 HotStuff의 확장성을 결합한<br />
          하이브리드 BFT 프로토콜입니다
        </p>
        <h3>핵심 설계</h3>
        <p className="leading-7">
          정상 상태에서는 PBFT 스타일 fast path로 2단계 커밋합니다.<br />
          리더 장애 시 HotStuff 스타일 slow path로 전환합니다.<br />
          💡 파이프라인으로 여러 합의 인스턴스를 동시 실행 → 처리량 극대화
        </p>
      </div>
    </section>
  );
}
