import OptimizationViz from './viz/OptimizationViz';

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨텍스트 윈도우 최적화</h2>
      <div className="not-prose mb-8"><OptimizationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          컨텍스트 윈도우는 유한한 자원 — 200K 토큰이라도 무한하지 않음<br />
          각 소스에 토큰 예산을 배분하고, 임계값 도달 시 자동 압축하는 전략 필수
        </p>
        <p>
          <strong>"Lost in the Middle"</strong> — 긴 컨텍스트의 중간부에 놓인 정보는 LLM이 잘 참조하지 못하는 현상<br />
          중요 정보는 컨텍스트의 앞(시스템 프롬프트)이나 끝(최근 메시지)에 배치
        </p>
      </div>
    </section>
  );
}
