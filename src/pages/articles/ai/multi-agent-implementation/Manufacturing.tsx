import ManufacturingViz from './viz/ManufacturingViz';

export default function Manufacturing() {
  return (
    <section id="manufacturing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">제조 도메인 적용 사례</h2>
      <div className="not-prose mb-8"><ManufacturingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">3개 에이전트 협업 구조</h3>
        <p className="leading-7">
          <strong>RAG Agent</strong> — 장비 매뉴얼 PDF, 과거 고장 이력, 정비 보고서를 VectorDB(FAISS 또는 Chroma)에 인덱싱.
          운영자 질문이 들어오면 top-k 관련 문서를 검색하여 컨텍스트로 전달한다.<br />
          <strong>Analysis Agent</strong> — 진동, 온도, 전류 센서 시계열 데이터를 pandas + scipy로 분석.
          이상 패턴 탐지, 임계값 초과 구간 식별, 통계적 이상 점수 계산.<br />
          <strong>Decision Agent</strong> — RAG 결과(매뉴얼 근거) + Analysis 결과(데이터 근거)를 종합하여
          "장비 정지 권고 / 예방 정비 스케줄 / 정상 운전 유지" 중 판단. 근거와 함께 보고서를 출력.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">로컬 LLM 연동 — Ollama</h3>
        <p className="leading-7">
          제조 데이터(센서값, 공정 파라미터, 불량률)는 기업 기밀.<br />
          OpenAI API 대신 <strong>Ollama</strong>(llama3, mistral)를 사내 GPU 서버에 배포하면 데이터 외부 전송이 없다.<br />
          LangGraph: <code>ChatOllama(model="llama3")</code>로 LLM을 교체.<br />
          CrewAI: <code>Agent(llm=ChatOllama(...))</code>로 에이전트별 모델을 지정할 수 있다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">비용과 성능 트레이드오프</h3>
        <p className="leading-7">
          API 비용이 0원인 대신, 로컬 모델은 GPT-4 대비 추론 품질이 낮을 수 있다.<br />
          보상 전략: RAG로 관련 문서를 충분히 제공하면 작은 모델도 정확한 판단이 가능.<br />
          GPU 서버 1대(RTX 4090 24GB)로 7B 모델 3개 에이전트를 교대 실행할 수 있다.<br />
          실시간 요구사항이 없는 보고서 생성 → 배치 처리로 GPU 활용률 극대화.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">보안 고려사항</h3>
        <p className="leading-7">
          <strong>네트워크 격리</strong> — Ollama 서버를 내부망에만 노출. 외부 API 호출 차단.<br />
          <strong>데이터 분류</strong> — 센서 원본 데이터는 Analysis Agent만 접근. Decision Agent는 요약 결과만 수신.<br />
          <strong>로깅</strong> — 모든 에이전트의 입출력을 로깅하여 감사 추적 가능. 제조업 규정 준수.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>해커톤 빠른 시작</strong> — CrewAI + Ollama 조합이 가장 빠르다.<br />
          1시간: Agent 3개 + Task 3개 + Crew 1개 정의. 2시간: VectorDB 인덱싱 + 테스트 질문. 3시간: 보고서 템플릿 + 데모.
        </p>
      </div>
    </section>
  );
}
