import LLMDistillViz from './viz/LLMDistillViz';

export default function LLMDistill() {
  return (
    <section id="llm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LLM 증류: DistilBERT에서 TinyLlama까지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대규모 언어 모델(LLM) 시대에서 지식 증류는 <strong>모델 경량화의 핵심 전략</strong>으로 자리잡았다.<br />
          BERT에서 시작된 직접 증류가 GPT 시대에는 데이터 증류로 진화.
        </p>

        <h3>DistilBERT: 최초의 성공적 LLM 증류</h3>
        <p>
          Sanh et al.(2019)이 제안. BERT-base(110M params, 12 layers) → DistilBERT(66M params, 6 layers).<br />
          크기 40% 감소, 추론 속도 60% 향상, 성능은 97% 유지.
        </p>
        <p>
          <strong>Triple loss</strong>로 학습:<br />
          1. <strong>MLM loss</strong> — Masked Language Modeling (원래 BERT 목적).<br />
          2. <strong>Distillation loss</strong> — Teacher의 soft target과 Student의 soft prediction의 KL divergence.<br />
          3. <strong>Cosine embedding loss</strong> — Teacher와 Student의 hidden state 방향을 일치시킴.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>레이어 초기화 트릭</strong>: Student의 6개 레이어를 Teacher의 짝수 레이어(0, 2, 4, 6, 8, 10)로 초기화.
            무작위 초기화 대비 수렴이 빠르고, 최종 성능도 더 높다.
            Teacher의 구조적 지식을 가중치로 직접 주입하는 셈.
          </p>
        </div>

        <h3>TinyLlama: 작은 모델 + 대규모 데이터</h3>
        <p>
          Zhang et al.(2024): Llama-2 아키텍처를 1.1B 파라미터로 축소, <strong>3 Trillion 토큰</strong>으로 학습.<br />
          일반적인 1B 모델의 학습량(수백 B 토큰)보다 10배 이상 많은 데이터를 사용.<br />
          Teacher의 출력을 직접 모방하는 것이 아니라, Teacher 수준의 데이터 커리큘럼으로 학습하는 <strong>데이터 증류</strong> 접근.
        </p>

        <h3>데이터 증류: Teacher가 학습 데이터를 생성</h3>
        <p>
          GPT-4 같은 대형 모델의 API로 대량의 합성 데이터를 생성 → 소형 모델이 이 데이터로 학습.<br />
          <strong>Alpaca</strong>: GPT-3.5가 생성한 52K instruction-following 데이터로 LLaMA-7B를 fine-tune.<br />
          <strong>Vicuna</strong>: ShareGPT의 사용자-GPT 대화 데이터로 LLaMA를 학습 — ChatGPT 성능의 90% 달성.
        </p>
        <p>
          데이터 증류의 장점: Teacher 모델의 가중치에 접근할 필요가 없음 — API 호출만으로 증류 가능.<br />
          단점: Teacher의 오류/편향이 데이터에 그대로 전파될 수 있음.
        </p>

        <h3>직접 증류 vs 간접 증류</h3>
        <p>
          <strong>직접 증류</strong>: Teacher의 logit/feature를 Student가 직접 학습. 모델 가중치 접근 필요.<br />
          <strong>간접 증류</strong>(데이터 증류): Teacher가 생성한 데이터로 Student 학습. API만 있으면 됨.<br />
          현대 LLM에서는 간접 증류가 주류 — 대부분의 proprietary 모델은 가중치를 공개하지 않기 때문.
        </p>

        <h3>LLM 증류의 법적/윤리적 이슈</h3>
        <p>
          GPT-4 등의 ToS(이용약관)는 출력을 경쟁 모델 학습에 사용하는 것을 금지하는 경우가 많다.<br />
          데이터 증류의 실용성은 높지만, 라이선스와 이용 정책을 반드시 확인해야 한다.
        </p>
      </div>

      <div className="not-prose mt-8">
        <LLMDistillViz />
      </div>
    </section>
  );
}
