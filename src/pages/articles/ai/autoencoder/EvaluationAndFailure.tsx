import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const evaluations = [
  ['새 샘플도 복원하는가?', 'validation reconstruction', 'train loss만 낮으면 memorization을 놓친다.'],
  ['latent가 task에 유용한가?', 'linear probe · retrieval', '좋은 pixel 복원이 의미 분리를 보장하지 않는다.'],
  ['정말 압축되는가?', 'code size · bitrate · latency', '차원 수만으로 실제 저장 비용을 설명할 수 없다.'],
  ['anomaly를 구분하는가?', 'AUROC · precision/recall', 'threshold와 anomaly validation set 없이 판단할 수 없다.'],
  ['변형에 안정적인가?', 'corruption별 성능', '학습하지 않은 noise와 shift에서 실패할 수 있다.'],
];

export default function EvaluationAndFailure() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reconstruction loss가 낮으면 학습에 성공한 걸까?</h2>
      <QuestionLead
        question="입력을 거의 똑같이 복원했다면 latent representation도 좋은 것 아닐까?"
        answer="아니다. 모델이 identity mapping을 외우거나 downstream task와 무관한 세부 정보를 보존했을 수 있다. 사용할 목적마다 별도의 validation metric이 필요하다."
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {evaluations.map(([question, metric, failure]) => (
          <div key={question} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-4">
            <p className="text-sm font-bold">{question}</p><p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{metric}</p><p className="text-xs leading-relaxed text-muted-foreground">{failure}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Anomaly detection의 함정</h3>
        <p>
          정상 데이터만 학습하면 anomaly의 reconstruction error가 높을 것이라고 기대한다. 그러나 capacity가 큰 decoder는
          보지 못한 anomaly도 잘 복원할 수 있고, 정상 데이터 안의 드문 패턴이 오히려 큰 error를 낼 수 있다. 실제 배포에서는
          anomaly가 포함된 validation set으로 score와 threshold를 고르고 class imbalance에 맞는 precision·recall을 본다.
        </p>
        <h3>Compression과 representation learning도 분리한다</h3>
        <p>
          latent tensor가 작아도 float precision과 entropy coding을 고려하지 않으면 실제 bit 수를 알 수 없다. 반대로
          representation learning에서는 복원 pixel 수보다 linear probe, retrieval, fine-tuning sample efficiency가 더 직접적인
          지표일 수 있다.
        </p>
      </div>
      <Misconception>
        autoencoder가 label 없이 학습된다는 사실만으로 모든 경우를 “비지도 학습”이라고 뭉뚱그리기보다, 입력에서 target을 만든 reconstruction self-supervision과 downstream evaluation을 구분하는 편이 정확하다.
      </Misconception>
    </section>
  );
}
