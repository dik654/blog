import LogitViz from './viz/LogitViz';

export default function Logit() {
  return (
    <section id="logit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Logit Distillation: soft target 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Logit Distillation</strong> — 가장 기본적인 지식 증류 방법.<br />
          Teacher의 soft probability 분포를 Student가 모방하도록 학습.
          최종 출력층만 사용하므로 구현이 단순하고, 모든 분류 모델에 적용 가능.
        </p>

        <h3>Teacher의 Soft Target 생성</h3>
        <p>
          Teacher 모델이 입력 x에 대해 logit 벡터 <strong>z</strong>를 출력.<br />
          이를 Temperature T로 나눈 뒤 softmax 적용: <code>pᵢ = exp(zᵢ/T) / Σⱼ exp(zⱼ/T)</code>.<br />
          T=1이면 일반 softmax, T가 클수록 확률 분포가 평탄해져 클래스 간 관계 정보가 풍부해진다.
        </p>

        <h3>KL Divergence 손실</h3>
        <p>
          Teacher의 soft distribution <strong>p</strong>와 Student의 soft distribution <strong>q</strong>의 차이를 KL divergence로 측정.<br />
          <code>L_soft = T² · KL(p_T ∥ q_T)</code><br />
          <strong>T²를 곱하는 이유</strong>: Temperature를 높이면 softmax의 gradient가 1/T²만큼 작아짐.<br />
          T²를 곱해 gradient 크기를 보상해야 학습 속도가 유지된다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>T² 보상의 직관</strong>: T를 키우면 softmax 출력이 uniform에 가까워지면서 gradient도 작아진다.
            T²를 곱하지 않으면 soft loss의 학습 기여가 사실상 사라진다.
            Hinton 원 논문에서 이 보상이 핵심 디테일로 언급됨.
          </p>
        </div>

        <h3>Hard Loss와의 결합</h3>
        <p>
          Soft loss만으로는 정답 라벨의 정확한 분류 능력이 약해질 수 있다.<br />
          따라서 정답 라벨과의 Cross-Entropy(<strong>L_hard</strong>)도 함께 사용.<br />
          <code>L_total = α · L_hard + (1-α) · L_soft</code>
        </p>

        <h3>하이퍼파라미터 선택</h3>
        <p>
          <strong>α (가중치)</strong>: 보통 0.1~0.5. α가 작을수록 Teacher 의존도가 높아짐.<br />
          <strong>T (Temperature)</strong>: 4~20이 일반적. T가 너무 높으면 정보가 희석되고, 너무 낮으면 hard label과 차이가 없어짐.<br />
          실전 경험: α=0.1, T=4가 많은 벤치마크에서 좋은 출발점.
        </p>

        <h3>한계</h3>
        <p>
          최종 출력만 사용하므로, Teacher의 중간 레이어에 담긴 계층적 특징 정보는 전달되지 않는다.<br />
          Teacher-Student의 capacity gap(용량 격차)이 크면 soft target을 Student가 충분히 학습하지 못할 수 있다.
        </p>
      </div>

      <div className="not-prose mt-8">
        <LogitViz />
      </div>
    </section>
  );
}
