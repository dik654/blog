import LoraMatrixViz from './viz/LoraMatrixViz';

export default function LoRA() {
  return (
    <section id="lora" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LoRA: 저랭크 적응 행렬</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>LoRA(Low-Rank Adaptation)</strong> — 사전학습된 가중치 W를 고정하고,
          가중치 변화량 ΔW를 두 개의 저랭크 행렬 B와 A의 곱으로 표현한다.
          즉, W' = W + ΔW = W + BA.
        </p>
        <p>
          핵심 관찰: 사전학습된 LLM의 가중치는 과도하게 매개변수화(over-parameterized)되어 있고,
          fine-tuning 시 가중치 변화 ΔW는 실제로 저랭크(low-rank) 구조를 보인다.
          Hu et al.(2021)은 GPT-3 175B의 ΔW를 분석하여 실질적 랭크가 매우 낮음(r=1~4도 충분)을 실험적으로 확인했다.
        </p>
        <p>
          <strong>rank r의 선택</strong> — 표현력과 파라미터 수의 트레이드오프.
          r이 클수록 ΔW를 정밀하게 근사하지만 학습 파라미터가 늘어난다.
          실무에서는 r=8~16이 대부분의 태스크에 충분하며,
          복잡한 도메인 적응(의료, 법률)에서는 r=32~64를 사용하기도 한다.
        </p>
        <p>
          <strong>scaling factor α/r</strong> — LoRA의 출력에 α/r을 곱하여 학습률을 안정화한다.
          α를 r과 동일하게 설정하면 scale=1.0, α=2r이면 scale=2.0으로 LoRA의 영향이 더 강해진다.
          관례적으로 α = r 또는 α = 2r을 사용하고, r을 바꿀 때 α도 비례하여 조정한다.
        </p>
      </div>

      <div className="not-prose"><LoraMatrixViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">적용 위치 선택</h3>
        <p>
          Transformer의 어텐션 레이어에는 Q, K, V, O 4개 프로젝션 행렬이 있다.
          원 논문(Hu et al., 2021)에서는 q_proj와 v_proj에만 LoRA를 적용해도
          full fine-tuning의 97% 이상 성능을 달성했다.
        </p>
        <p>
          최근 실무에서는 모든 선형 레이어(q, k, v, o + FFN의 gate, up, down)에 적용하는 추세.
          적용 범위를 넓히면 표현력이 높아지지만 학습 파라미터도 비례하여 증가한다.
          7B 모델에서 전체 linear 적용 시 학습 파라미터는 약 20~40M(전체의 0.3~0.6%).
        </p>
        <p className="leading-7">
          핵심 1: LoRA는 <strong>W + BA</strong>라는 단순한 수식이 전부 — 구현이 매우 간결.<br />
          핵심 2: <strong>병합 후 추론 비용 증가 없음</strong> — vLLM, TGI 등과 즉시 호환.<br />
          핵심 3: 여러 태스크별 LoRA를 <strong>교체만으로 전환</strong> 가능 — 하나의 base 모델에 복수 어댑터.
        </p>
      </div>
    </section>
  );
}
