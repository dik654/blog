import AiAnomalyTaxonomyViz from './viz/AiAnomalyTaxonomyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — AI 에이전트 / LLM 로그 이상 감지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          AI 시스템 이상은 <strong>전통 APM (latency · error · throughput) 으로 안 잡히는 영역</strong>이 핵심.
          <br />
          모델은 200 OK 로 응답하지만 hallucination · prompt injection · 무한 도구 루프 같은 행동 자체가 사고.
        </p>
      </div>

      <AiAnomalyTaxonomyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">기존 모니터링이 못 보는 영역</h3>
        <ul className="leading-7">
          <li><strong>의미적 이상</strong> — 문법은 OK 한데 답이 틀림. metric 으로 표현 어려움.</li>
          <li><strong>행동 이상</strong> — 에이전트가 같은 도구 100 회 반복. 단일 호출 로그로는 안 보임.</li>
          <li><strong>비용 폭증</strong> — 평소의 10x 토큰 사용. 청구서 도착 시 발견하면 늦음.</li>
          <li><strong>프롬프트 침해</strong> — 사용자 input 이 system prompt 우회 시도. 입력만 보면 평범.</li>
          <li><strong>모델 퇴화</strong> — 새 버전 deploy 후 정확도 -5%. A/B 비교 + eval set 필수.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>로그 종류와 수집</strong> — request log · trace · token usage · tool call · feedback signal.</li>
          <li><strong>이상 6 분류와 검출</strong> — 각 종류별 메트릭 + signature + 검출 방법.</li>
          <li><strong>Prompt injection 검출</strong> — 패턴 + classifier + canary token.</li>
          <li><strong>Agent loop 모니터링</strong> — recursion · token 폭증 · 도구 사용 패턴.</li>
          <li><strong>Cost · quota 알람</strong> — 사용자별 / endpoint 별 / 모델별 비용 추적.</li>
          <li><strong>도구 스택</strong> — Langfuse · Helicone · OpenLLMetry · 자가 호스팅 ELK.</li>
        </ol>
      </div>
    </section>
  );
}
