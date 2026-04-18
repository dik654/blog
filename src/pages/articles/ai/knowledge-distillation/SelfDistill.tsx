import SelfDistillViz from './viz/SelfDistillViz';

export default function SelfDistill() {
  return (
    <section id="self" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Self-Distillation & Born-Again Networks</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Self-Distillation</strong> — 외부 Teacher 없이, 모델 자기 자신(또는 이전 버전)이 Teacher 역할을 수행하는 증류 기법.<br />
          추가 대형 모델 학습 없이도 성능을 향상시킬 수 있다는 점에서 실전 가치가 높다.
        </p>

        <h3>Born-Again Networks</h3>
        <p>
          Furlanello et al.(2018)이 제안한 반복적 자기 증류 방법.<br />
          1세대 모델을 정상적으로 학습 → 이 모델을 Teacher로 삼아 <strong>동일 구조</strong>의 2세대 Student를 학습.<br />
          놀라운 발견: Student가 Teacher보다 <strong>더 나은 성능</strong>을 보이는 현상이 반복적으로 관찰됨.
        </p>
        <p>
          이 과정을 반복(2세대 → 3세대 → ...) 하면 성능이 점진적으로 향상.<br />
          수렴 후에는 추가 개선이 미미하지만, 2~3세대만으로도 유의미한 성능 향상을 얻을 수 있다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>왜 Student가 Teacher를 초월하는가?</strong><br />
            Soft target이 암묵적 정규화 효과를 제공하기 때문.
            Hard label은 [0, 1, 0]처럼 극단적이지만, soft target은 [0.05, 0.85, 0.10]처럼 부드럽다.
            이 부드러운 타깃이 모델의 과확신(overconfidence)을 방지하여 일반화 성능을 높인다.
          </p>
        </div>

        <h3>Deep Mutual Learning</h3>
        <p>
          Zhang et al.(2018): 사전학습 된 Teacher 없이, <strong>두 모델이 동시에</strong> 서로를 Teacher로 삼아 학습.<br />
          <code>L = L_CE(y, p₁) + KL(p₁ ∥ p₂) + KL(p₂ ∥ p₁)</code><br />
          두 모델이 서로의 확률 분포를 일치시키면서 학습하면, 독립 학습보다 <strong>두 모델 모두</strong> 성능이 향상.
        </p>
        <p>
          직관: 서로 다른 초기화에서 출발한 두 모델은 다른 local minimum으로 수렴하려 하지만,
          mutual KL이 이들을 중간 지점으로 끌어당기면서 더 나은 solution에 도달.
        </p>

        <h3>Label Smoothing과의 관계</h3>
        <p>
          <strong>Label smoothing</strong>: hard label [0, 1, 0]을 [ε/K, 1-ε, ε/K]로 변환. K=클래스 수, ε=smoothing 파라미터.<br />
          Self-distillation의 soft target과 효과가 유사 — 둘 다 과확신 방지 + 일반화 향상.
        </p>
        <p>
          Tang et al.(2020)의 분석: label smoothing은 <strong>self-distillation의 특수 케이스</strong>로 해석 가능.<br />
          Label smoothing은 균등 분포(uniform)로 smoothing하지만,
          self-distillation은 모델 자신의 예측 분포로 smoothing — 더 정보가 풍부.
        </p>

        <h3>Be Your Own Teacher (BYoT)</h3>
        <p>
          Xu & Liu(2019): 하나의 네트워크 안에서 깊은 레이어가 얕은 레이어의 Teacher 역할.<br />
          네트워크의 중간 레이어에 보조 분류기를 붙이고, 최종 레이어의 soft target으로 학습.<br />
          추가 모델이나 반복 학습 없이 <strong>단일 학습 과정</strong>에서 self-distillation 효과를 얻는다.
        </p>

        <h3>실전 적용 가이드</h3>
        <p>
          <strong>비용 효율</strong>: 별도 Teacher 학습이 불필요 — 기존 파이프라인에 soft loss만 추가하면 됨.<br />
          <strong>정규화 효과</strong>: 과적합 위험이 있는 소규모 데이터셋에서 특히 효과적.<br />
          <strong>범용성</strong>: CNN, Transformer, BERT, ViT 등 아키텍처에 무관하게 일관된 성능 향상 보고.<br />
          Born-Again은 2~3세대 반복이면 충분하고, DML은 2개 모델이 최적의 비용-성능 비.
        </p>
      </div>

      <div className="not-prose mt-8">
        <SelfDistillViz />
      </div>
    </section>
  );
}
