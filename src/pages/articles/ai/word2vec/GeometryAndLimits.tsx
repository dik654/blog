import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const checks = [
  ['Nearest neighbor', '비슷한 context 분포의 단어가 가까운가?', 'frequency와 corpus domain의 영향을 함께 본다.'],
  ['Analogy', '관계 offset이 다른 단어 쌍에도 유지되는가?', '검색 방식과 benchmark 구성에 민감하다.'],
  ['Downstream task', '고정 vector가 분류·검색에 실제 도움을 주는가?', 'task split에서 baseline과 비교한다.'],
  ['Bias audit', '성별·인종·직업 관계가 해로운 연상을 강화하는가?', 'data와 metric을 공개하고 완화 후 성능도 측정한다.'],
];

export default function GeometryAndLimits() {
  return (
    <section id="geometry-limits" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">가까운 vector는 정말 같은 의미일까?</h2>
      <QuestionLead
        question="cosine similarity가 높으면 두 단어가 동의어라고 결론 내려도 될까?"
        answer="아니다. 가까움은 학습 corpus와 objective 아래에서 context 분포가 비슷하다는 뜻이다. 관련어, 반의어, 같은 topic 단어도 가까울 수 있으므로 task에 맞게 평가해야 한다."
      />
      <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\cos(a,b)}_{\text{방향 유사도}}=\frac{\underbrace{a^\top b}_{\text{같은 방향 성분}}}{\underbrace{\lVert a\rVert_2\lVert b\rVert_2}_{\text{두 vector 크기로 정규화}}}`}</Math></div>
      <FormulaNote
        meaning="cosine은 vector 크기를 나누고 방향만 비교한다. 학습 과정의 dot product와 평가 시 cosine은 관련되지만 같은 score 계약은 아니며, normalization 여부를 명시해야 한다."
        symbols={[
          [String.raw`a,b`, '비교할 두 단어 embedding'],
          [String.raw`a^\top b`, '두 vector가 같은 방향 성분을 얼마나 공유하는지 나타내는 dot product'],
          [String.raw`\lVert a\rVert_2`, 'vector a의 Euclidean 크기'],
          [String.raw`\cos(a,b)`, '-1~1 범위의 방향 유사도'],
        ]}
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {checks.map(([metric, question, caution]) => (
          <div key={metric} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-4"><p className="text-sm font-bold">{metric}</p><p className="text-xs font-semibold leading-relaxed">{question}</p><p className="text-xs leading-relaxed text-muted-foreground">{caution}</p></div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Vector analogy는 무엇을 보여 주고 무엇을 숨길까?</h3>
        <p>
          `king - man + woman ≈ queen` 같은 예는 일부 관계가 비슷한 offset으로 정렬될 수 있음을 보여 준다. 그러나 corpus,
          언어 형태론, tokenization, 차원, 검색 규칙에 따라 결과가 달라지고 모든 의미 관계가 한 방향으로 분리되지는 않는다.
          인상적인 예 하나 대신 전체 analogy set과 nearest-neighbor error를 평가해야 한다.
        </p>
        <h3>Static embedding의 다의어 한계</h3>
        <p>
          “은행에서 돈을 찾다”와 “강둑에서 쉬다”의 bank가 같은 한 행을 사용한다. 서로 다른 의미의 context가 한 vector에
          평균되어 들어가므로 문장별 의미를 분리할 수 없다. 이것이 contextual encoder로 넘어가는 핵심 이유다.
        </p>
      </div>
      <Misconception>
        2D scatterplot에서 단어가 가까워 보이는 것은 원래 수백 차원 geometry를 PCA나 t-SNE로 투영한 결과다. 시각화의 이웃 관계가 원공간의 모든 거리와 cluster를 보존한다고 가정하면 안 된다.
      </Misconception>
    </section>
  );
}
