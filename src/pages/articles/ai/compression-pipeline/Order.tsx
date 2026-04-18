import OrderViz from './viz/OrderViz';

export default function Order() {
  return (
    <section id="order" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">적용 순서: 프루닝 → 증류 → 양자화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          경량화 기법의 <strong>적용 순서</strong>가 최종 품질을 결정 —{' '}
          같은 기법 조합이라도 순서에 따라 Perplexity가 20% 이상 차이<br />
          핵심 원칙: <strong>정보가 풍부한 상태에서 판단</strong>하고, <strong>비가역적 변환은 마지막에</strong> 적용
        </p>
        <p>
          <strong>1단계: 프루닝</strong> — FP16 가중치의 magnitude(절대값 크기)를 기준으로 불필요한 뉴런/채널/어텐션 헤드 제거.{' '}
          FP16 정밀도에서만 0.0012 vs 0.0015 같은 미세한 차이를 구분 가능<br />
          Structured pruning(채널/헤드 단위)이 Unstructured(개별 가중치)보다 실제 속도 향상에 유리 —{' '}
          GPU는 정형화된 텐서 연산에 최적화되어 있기 때문
        </p>
        <p>
          <strong>2단계: 증류(선택)</strong> — 프루닝으로 손실된 정확도를 회복.{' '}
          원본(또는 더 큰) 모델을 Teacher로, 프루닝된 모델을 Student로 KL Divergence 기반 학습<br />
          Teacher의 soft label에는 hard label(정답)에 없는 <strong>dark knowledge</strong>(클래스 간 유사도)가 포함 —{' '}
          "고양이"를 맞추는 것뿐 아니라 "호랑이와 0.15, 개와 0.05만큼 유사"라는 정보<br />
          온도(T=4~8): softmax를 부드럽게 만들어 클래스 간 관계를 더 풍부하게 전달
        </p>
        <p>
          <strong>3단계: 양자화</strong> — 최종 FP16 가중치를 INT4/INT8로 변환.{' '}
          GPTQ/AWQ 같은 PTQ(Post-Training Quantization) 기법은 소량의 보정 데이터(128~256 샘플)로 양자화 오차를 최소화<br />
          양자화는 <strong>비가역적</strong> — 한번 INT4로 변환하면 FP16 정밀도로 복원 불가.{' '}
          그래서 반드시 마지막 단계에서 적용
        </p>
        <p>
          <strong>역순서가 실패하는 이유</strong>: 양자화 → 프루닝 시 INT4의 16개 이산값에서 magnitude 비교가 무의미(동점 다수 발생).{' '}
          양자화 → 증류 시 INT4 Teacher의 soft label에 양자화 노이즈가 포함되어 dark knowledge가 훼손
        </p>
      </div>
      <OrderViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          정리: 정보 보존 순서대로 — FP16에서 구조 판단(프루닝) → FP16에서 지식 전달(증류) → 마지막에 비트 축소(양자화)<br />
          증류 생략 판단: 프루닝 ≤10% + INT8이면 생략 가능, 프루닝 ≥30% + INT4이면 필수<br />
          대회 팁: Teacher가 없으면 self-distillation(프루닝 전 자기 자신이 Teacher) 활용
        </p>
      </div>
    </section>
  );
}
