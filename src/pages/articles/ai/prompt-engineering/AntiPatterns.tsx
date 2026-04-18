import AntiPatternsViz from './viz/AntiPatternsViz';
import { AntiPatternListViz, TroubleshootViz } from './viz/AntiPatternsDetailViz';

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">흔한 안티패턴 목록</h3>
        <div className="not-prose mb-6"><AntiPatternListViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">트러블슈팅 가이드</h3>
        <div className="not-prose mb-6"><TroubleshootViz /></div>
        <p className="leading-7">
          요약 1: <strong>네거티브 프롬프트</strong>는 역효과 — 긍정형 전환 필수.<br />
          요약 2: <strong>과도한 지시</strong>가 오히려 성능 저하 — 상위 3개만.<br />
          요약 3: Hallucination 대응은 <strong>RAG + 명시적 "모른다" 허용</strong>.
        </p>
      </div>
    </section>
  );
}
