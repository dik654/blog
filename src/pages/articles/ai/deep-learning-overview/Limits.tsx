import { Misconception } from '@/components/learning/ArticleLearning';

const distinctions = [
  {
    title: '표현력',
    question: '모델이 필요한 함수를 표현할 용량과 구조를 가졌는가?',
    evidence: 'train loss의 도달 바닥, train·validation 동시 과소적합, width·depth ablation',
    failure: '너무 얕거나 좁은 구조, 필요한 비선형성·receptive field 부족',
  },
  {
    title: '최적화',
    question: '훈련 손실을 낮췄는가?',
    evidence: 'loss curve, gradient norm, 학습 안정성',
    failure: '발산, 느린 수렴, 잘못된 learning rate',
  },
  {
    title: '일반화',
    question: '보지 않은 데이터에도 통하는가?',
    evidence: 'validation/test 성능, calibration, 오류 분석',
    failure: '과적합, data leakage, 분포 변화',
  },
  {
    title: '시스템 효율',
    question: '필요한 시간과 자원 안에서 실행되는가?',
    evidence: '처리량, 지연, 메모리, 전력과 비용',
    failure: '메모리 부족, 통신 병목, 낮은 장치 활용률',
  },
];

export default function Limits() {
  return (
    <section id="limits" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습이 됐다는 말은 정확히 무엇을 뜻할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          훈련 손실이 내려갔다는 것은 주어진 파라미터와 데이터에서 최적화가 진행됐다는 신호다. 하지만 그것만으로
          새로운 데이터의 성능이나 실제 시스템의 유용성을 보장하지 않는다. 딥러닝 실험은 최소한 아래 네 문제를
          따로 측정해야 한다.
        </p>
        <p>Train loss가 계속 내려가는데 validation loss만 올라간다면 표현력이 전혀 없다는 증상보다 일반화 문제가 먼저 의심된다. 반대로 train과 validation이 함께 높은 바닥에서 멈추면 표현력과 최적화를 분리하는 capacity ablation이 필요하다.</p>
      </div>

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {distinctions.map((item, index) => (
          <div key={item.title} className="grid gap-3 py-5 sm:grid-cols-[2rem_8rem_1fr] sm:gap-5">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
            <h3 className="text-sm font-bold">{item.title}</h3>
            <div className="min-w-0 text-sm leading-relaxed">
              <p className="font-semibold">{item.question}</p>
              <p className="mt-1 text-muted-foreground"><strong className="text-foreground">관찰:</strong> {item.evidence}</p>
              <p className="mt-1 text-muted-foreground"><strong className="text-foreground">실패:</strong> {item.failure}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>데이터가 정의하지 않은 것은 모델도 자동으로 알지 못한다</h3>
        <p>
          모델은 훈련 데이터와 목적 함수가 보상한 패턴을 학습한다. 상관관계를 인과관계로 보장하지도 않고, 드문 상황을
          충분히 보지 못했다면 그 상황의 규칙을 안정적으로 추론한다고 기대할 수도 없다. 따라서 데이터 수집 기준,
          평가 분할, 실패 사례 분석은 모델 아키텍처와 같은 수준의 설계 문제다.
        </p>
      </div>

      <Misconception>
        “파라미터가 많고 train loss가 낮다”와 “배포 환경에서 정확하고 안전하다”는 같은 문장이 아니다. validation/test 분리, 분포 변화 점검, 문제별 평가가 별도로 필요하다.
      </Misconception>
    </section>
  );
}
