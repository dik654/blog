import DataFormatViz from './viz/DataFormatViz';

export default function Data() {
  return (
    <section id="data" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 데이터 준비 & 포맷</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 원칙</strong> — LoRA/QLoRA의 성능은 모델 크기나 하이퍼파라미터보다 학습 데이터 품질에 좌우된다.
          LIMA(2023) 논문은 1,000개의 고품질 예제만으로 GPT-4급 정렬이 가능함을 보여줬다.
          잡음이 많은 10만개보다 정제된 5,000개가 일관되게 더 좋은 결과를 낸다.
        </p>
        <p>
          <strong>Instruction 포맷</strong> — 대부분의 fine-tuning은 instruction-following 형태.
          Alpaca 포맷(instruction/input/output 3필드)과 ChatML 포맷(대화 턴 기반)이 양대 표준.
          모델의 기존 chat template에 맞추는 것이 핵심 — LLaMA 계열은 Alpaca, GPT 계열은 ChatML.
          포맷 불일치는 성능 저하의 가장 흔한 원인이다.
        </p>
        <p>
          <strong>도메인 데이터 수집</strong> — 자체 문서(PDF, DB, Wiki)에서 Q&A 쌍을 추출하고,
          길이 분포 확인(극단값 제거), 유사도 기반 중복 제거, 전문가 검수 또는 GPT-4 품질 평가를 거친다.
          답변 길이 50~2,000 토큰, perplexity 임계값 초과 제거, 유사도 0.9 이상 deduplicate가 기본 필터.
        </p>
        <p>
          <strong>합성 데이터 생성</strong> — Self-Instruct(Wang et al., 2022)는 소수의 seed 예제로부터
          GPT-4가 새로운 instruction-output 쌍을 대량 생성하는 방식.
          Evol-Instruct(WizardLM, 2023)는 기존 instruction의 난이도를 점진적으로 높여 복잡한 예제를 만든다.
          seed 데이터의 다양성이 합성 데이터 전체 품질을 결정하므로, seed 설계에 가장 많은 노력을 투입해야 한다.
        </p>
      </div>

      <div className="not-prose"><DataFormatViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 팁: 데이터 준비 체크리스트</h3>
        <p>
          1) 포맷 일관성 — 모든 예제가 동일한 템플릿 사용. 혼합 포맷은 모델 혼란 유발.<br />
          2) 답변 품질 — 모호한 답변, 사실 오류, 불완전한 답변 제거. GPT-4 judge로 0-5점 스코어링 후 3점 이하 제거.<br />
          3) 데이터 분포 — 태스크 유형(분류, 생성, QA, 번역 등)이 고르게 분포. 특정 유형 과집중은 다른 능력 퇴화(catastrophic forgetting) 유발.<br />
          4) 테스트 셋 분리 — 학습 데이터와 겹치지 않는 평가 셋 반드시 확보. 도메인 전문가가 직접 작성한 50~100개가 이상적.
        </p>
        <p className="leading-7">
          핵심 1: <strong>데이터 품질 &gt; 양</strong> — 1K 고품질이 100K 저품질을 압도.<br />
          핵심 2: <strong>포맷 일치</strong>가 성능의 기본 조건 — 모델의 chat template 확인 필수.<br />
          핵심 3: 합성 데이터는 <strong>seed 다양성</strong>이 전부 — seed 설계에 투자.
        </p>
      </div>
    </section>
  );
}
