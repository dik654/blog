import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">사이드채널 공격이란</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          사이드채널(Side-Channel) 공격은 암호화된 데이터 자체가 아니라,<br />
          실행 시간, 캐시 상태, 전력 소비 등 부수적 정보로 비밀을 유추합니다.<br />
          TEE의 메모리 암호화만으로는 방어할 수 없는 위협입니다.
        </p>
      </div>
    </section>
  );
}
