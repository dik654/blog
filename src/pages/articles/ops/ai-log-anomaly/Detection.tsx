export default function Detection() {
  return (
    <section id="detection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. 로그 수집 + 이상 검출 방법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. 수집할 LLM 로그 종류</h3>
        <ul className="leading-7">
          <li><strong>Request / Response</strong> — input prompt · output completion · model · max_tokens · temperature.</li>
          <li><strong>Token usage</strong> — input_tokens · output_tokens · cache_read_tokens. 비용 + 모델 부하 핵심.</li>
          <li><strong>Latency 분해</strong> — TTFT (time to first token) · inter-token latency · total time. SSE streaming 시 별도.</li>
          <li><strong>Tool call</strong> — 어느 tool · 인자 · 결과. 에이전트 행동 분석.</li>
          <li><strong>Conversation trace</strong> — 같은 session 의 turn 시퀀스. context 길이 추적.</li>
          <li><strong>User feedback</strong> — thumbs up/down · 명시 평가 · implicit (다음 turn 의 redo 패턴).</li>
          <li><strong>Eval result</strong> — 표준 eval set 의 정확도 / consistency 점수.</li>
          <li><strong>Safety filter</strong> — refusal · toxicity · jailbreak 검출 결과.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. Model performance 검출</h3>
        <ul className="leading-7">
          <li><strong>p50 / p95 / p99 latency</strong> — Prometheus + Grafana 표준. 모델별 / endpoint 별 분리.</li>
          <li><strong>Error rate</strong> — 5xx · context length exceeded · safety refusal 분리.</li>
          <li><strong>Throughput</strong> — RPS · TPS (tokens per second). vLLM / TGI 의 batch 효율.</li>
          <li><strong>Eval CI</strong> — 매 모델 deploy 시 eval set 자동 실행. 정확도 -2% 이상이면 rollback.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. Input drift 검출</h3>
        <ul className="leading-7">
          <li><strong>Length 분포</strong> — 평소 input 평균 200 token, 갑자기 5000 token 비중 ↑ → 새 use case 또는 abuse 의심.</li>
          <li><strong>Language 분포</strong> — 사용자 한국어 / 영어 비율 변화. 봇 트래픽 (특정 언어) 의 신호.</li>
          <li><strong>Embedding drift</strong> — input embedding 의 분포 (centroid shift, KL divergence). 의미적 변화 검출.</li>
          <li><strong>특수 token 빈도</strong> — control character · zero-width space · unicode confusable 갑자기 증가 → injection 의심.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. Output anomaly 검출</h3>
        <ul className="leading-7">
          <li><strong>Refusal rate</strong> — &quot;I cannot ...&quot; 시작 응답 비율. 갑자기 ↑ 면 input 변화 또는 모델 정렬 변경.</li>
          <li><strong>Hallucination 신호</strong> — RAG 시스템에선 source citation 없는 응답 비율. fact-check API 자동 검증.</li>
          <li><strong>Token repetition</strong> — 같은 token / phrase 반복 (모델 perplexity 깨짐 신호).</li>
          <li><strong>Length anomaly</strong> — 짧게 답해야 하는 query 에 매번 max_tokens 까지 출력 → routing / prompt 문제.</li>
          <li><strong>User feedback 추적</strong> — endpoint 별 thumbs down 비율 / day. baseline 대비 spike.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-5. Cost / token 폭증 검출</h3>
        <ul className="leading-7">
          <li><strong>사용자별 일일 token</strong> — 평소의 10x → 자동 한도 또는 alert.</li>
          <li><strong>endpoint별 cost</strong> — 새 기능 deploy 후 평균 cost / call 변화 추적.</li>
          <li><strong>cache hit rate</strong> — Anthropic prompt caching 의 cache_read_tokens / total. 70%+ 가 정상, 급락 시 prompt 변경 영향.</li>
          <li><strong>model routing</strong> — Haiku / Sonnet / Opus 비율. 비싼 모델로 routing 증가 시 비용 폭증.</li>
          <li><strong>알람 임계</strong> — 일일 예산의 50% / 80% / 100%. 100% 도달 시 자동 차단 (graceful degrade).</li>
        </ul>
      </div>
    </section>
  );
}
