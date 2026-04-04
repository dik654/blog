import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nakamoto 최장 체인 합의</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          최장 체인 규칙은 Bitcoin에서 시작된 합의 메커니즘입니다.<br />
          가장 많은 작업 증명이 축적된 체인을 정식으로 채택합니다
        </p>
        <h3>핵심 아이디어</h3>
        <p className="leading-7">
          포크가 발생하면 채굴자들은 가장 긴 체인 위에서 작업합니다.<br />
          시간이 지나면 하나의 체인이 자연스럽게 승리합니다.<br />
          💡 사전 합의 없이 사후적으로 합의가 형성 — BFT와 정반대 접근
        </p>
      </div>
    </section>
  );
}
