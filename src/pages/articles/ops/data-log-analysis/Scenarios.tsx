export default function Scenarios() {
  return (
    <section id="scenarios" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 실전 분석 시나리오 5 종</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. AI 비용 폭증 분석</h3>
        <ol className="leading-7">
          <li><strong>가설</strong> — 어제 LLM 비용이 평소의 5x. 새 기능 deploy + 사용자 spike 둘 다 가능.</li>
          <li><strong>1차 쿼리</strong> — 일자별 cost SUM + endpoint 별 분포. 어느 endpoint 가 폭증?</li>
          <li><strong>2차 쿼리</strong> — 그 endpoint 의 일자별 호출 수 vs 평균 token. 호출 수 ↑ 인지 token ↑ 인지 분리.</li>
          <li><strong>3차 쿼리</strong> — 사용자별 분포. 한 사용자 폭증 (abuse) vs 전체 spike (정상 성장) 식별.</li>
          <li><strong>결과</strong> — 한 user 가 retry loop 로 100 회 → 한도 적용 + bug fix.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. AI 에이전트 무한 루프 분석</h3>
        <ol className="leading-7">
          <li><strong>가설</strong> — &quot;에이전트가 멈추지 않는다&quot; 보고. session 별 step 수 분포.</li>
          <li><strong>1차 쿼리</strong> — session 별 tool call 수 + 누적 token (위 SQL 패턴).</li>
          <li><strong>2차 쿼리</strong> — 30+ step session 의 tool 시퀀스. 같은 tool 반복 패턴 시각화.</li>
          <li><strong>3차 쿼리</strong> — 그 시퀀스의 input / output 비교. 모델이 같은 정보 반복 요청?</li>
          <li><strong>결과</strong> — RAG 도구가 빈 결과 반환 → 에이전트가 다시 같은 도구 호출. fix: empty result 시 graceful fallback.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. API 응답 지연 추적</h3>
        <ol className="leading-7">
          <li><strong>가설</strong> — p99 latency 가 30s → 5min 으로 spike.</li>
          <li><strong>1차 쿼리</strong> — 시간대별 p50/p99 latency. spike 정확한 시각.</li>
          <li><strong>2차 쿼리</strong> — 그 시간대의 endpoint 별 latency. 한 endpoint 만 vs 전체?</li>
          <li><strong>3차 쿼리</strong> — application log 의 stack trace + 외부 API 호출 시간 분리. DB 쿼리 vs 외부 API vs application code.</li>
          <li><strong>결과</strong> — 외부 LLM provider 의 timeout. fallback 모델 routing 추가.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. 네트워크 데이터 유출 의심 분석</h3>
        <ol className="leading-7">
          <li><strong>가설</strong> — outbound 트래픽 평소 100 MB/h → 5 GB/h. exfiltration 의심.</li>
          <li><strong>1차 쿼리</strong> — flow log 의 dst IP 별 byte 분포. 평소 안 가던 IP top 10.</li>
          <li><strong>2차 쿼리</strong> — 그 IP 의 reverse DNS · ASN · WHOIS · GeoIP. 의심 패턴?</li>
          <li><strong>3차 쿼리</strong> — 그 connection 의 source 호스트 / Pod / process. K8s NetworkPolicy log + Falco.</li>
          <li><strong>4차 쿼리</strong> — DNS query log 에서 같은 process 의 다른 도메인. C2 인프라 식별.</li>
          <li><strong>결과</strong> — 침해된 컨테이너 → 격리 + 포렌식.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. 사용자 행동 변화 분석 (product 결정용)</h3>
        <ol className="leading-7">
          <li><strong>가설</strong> — 신 기능 출시 후 retention 변화? funnel conversion 변화?</li>
          <li><strong>1차 쿼리</strong> — 기능 사용자 vs 미사용자 코호트. retention curve (D1 · D7 · D30).</li>
          <li><strong>2차 쿼리</strong> — 코호트별 평균 session length · DAU. 과제: confounding 통제 (사용자 자체 차이).</li>
          <li><strong>3차 쿼리</strong> — 같은 사용자의 before / after 비교 (자기 통제). 가장 신뢰할 수 있는 신호.</li>
          <li><strong>결과</strong> — D7 retention +5%. 통계 유의성 + 효과 크기 보고.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-6. 분석가 일하는 패턴 — 매일 / 매주 루틴</h3>
        <ul className="leading-7">
          <li><strong>매일 아침</strong> — 어제의 핵심 메트릭 (active users · cost · error rate) 한 번 본다.</li>
          <li><strong>주간</strong> — 주요 product 메트릭 + 의외 신호 깊이 파기 (1~2 시간 ad-hoc).</li>
          <li><strong>월간</strong> — postmortem · 분석 결과 정리 → 팀 공유. 대시보드 / runbook 갱신.</li>
          <li><strong>사고 대응</strong> — page 받으면 즉시 raw data 먼저 본다. 가설 → 쿼리 → 검증의 루프.</li>
          <li><strong>자동화</strong> — 같은 쿼리 3 회 작성 → 대시보드 / alert / cron 으로 자동화.</li>
        </ul>
      </div>
    </section>
  );
}
