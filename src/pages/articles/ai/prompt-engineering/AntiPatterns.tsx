import AntiPatternsViz from './viz/AntiPatternsViz';

export default function AntiPatterns() {
  return (
    <section id="anti-patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안티패턴 & 트러블슈팅</h2>
      <div className="not-prose mb-8"><AntiPatternsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          과도한 지시 — 500+ 토큰 지시문은 핵심이 노이즈에 묻혀 오히려 성능 저하<br />
          모호한 역할 — "도움이 되는 어시스턴트" 대신 구체적 전문성과 행동 기준 명시
        </p>
        <p>
          네거티브 프롬프트 — "~하지 마"는 해당 개념을 활성화시켜 역효과<br />
          "개인정보 출력 금지" → "공개 가능 정보만 포함"으로 긍정형 전환<br />
          컨텍스트 오염 — 긴 대화에서 초기 지시 영향력 감소, 중요 지시 재주입 필요
        </p>
      </div>
    </section>
  );
}
