import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { InternalLink, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const designs = [
  { title: 'Undercomplete', shape: String.raw`d_z<d_x`, pressure: '차원 자체로 정보량 제한', benefit: '단순하고 해석하기 쉬운 시작점', risk: '너무 작으면 중요한 정보도 잃는다.' },
  { title: 'Overcomplete', shape: String.raw`d_z\ge d_x`, pressure: '차원만으로는 제한 없음', benefit: '넓은 표현 공간을 사용할 수 있다.', risk: '제약이 없으면 identity 복사를 배울 수 있다.' },
  { title: 'Regularized', shape: String.raw`\text{noise}\;\cdot\;\text{sparsity}\;\cdot\;\text{masking}`, pressure: '학습 task나 penalty로 제한', benefit: '넓은 code에서도 불변 구조를 유도한다.', risk: '어떤 구조가 유용한지는 제약 설계에 달렸다.' },
];

export default function BottleneckRepresentation() {
  return (
    <section id="bottleneck" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Bottleneck이 있으면 핵심 의미가 자동으로 남을까?</h2>
      <QuestionLead
        question="latent dimension만 작게 만들면 모델이 사람이 원하는 의미를 압축할까?"
        answer="작은 code는 복사하기 어렵게 만들 뿐, 무엇을 보존할지는 reconstruction loss와 데이터가 결정한다. 배경 pixel을 정확히 맞추는 것이 class 의미보다 loss를 더 줄인다면 모델은 배경을 우선할 수 있다."
      />
      <div className="not-prose my-8 grid gap-3 lg:grid-cols-3">
        {designs.map((design) => (
          <div key={design.title} className="min-w-0 rounded-md border border-border p-4">
            <p className="text-base font-bold">{design.title}</p>
            <div className="mt-2 text-xs font-bold text-blue-600"><Math>{design.shape}</Math></div>
            <dl className="mt-5 space-y-3 text-xs">
              <div><dt className="text-muted-foreground">학습 압력</dt><dd className="mt-1 font-semibold leading-relaxed">{design.pressure}</dd></div>
              <div><dt className="text-muted-foreground">장점</dt><dd className="mt-1 leading-relaxed">{design.benefit}</dd></div>
              <div><dt className="text-muted-foreground">실패 조건</dt><dd className="mt-1 leading-relaxed">{design.risk}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Representation은 task에 대해 평가해야 한다</h3>
        <p>
          좋은 reconstruction과 좋은 representation은 같은 목표가 아니다. Code에서 class를 선형 분류하려는지, 유사한
          샘플을 검색하려는지, anomaly를 구분하려는지에 따라 필요한 정보가 다르다. 따라서 latent dimension은 compression
          ratio뿐 아니라 downstream metric과 validation reconstruction을 함께 보며 고른다.
        </p>
        <h3>Linear autoencoder와 PCA의 관계</h3>
        <p>
          선형 encoder·decoder와 squared error 등 특정 조건에서 최적 linear autoencoder가 찾는 부분공간은 PCA의 주성분
          부분공간과 연결된다. 하지만 latent 좌표 자체가 PCA 좌표와 항상 동일한 것은 아니며, 비선형층을 넣었다고 유용한
          manifold가 자동으로 발견되는 것도 아니다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/[0.05] p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\min \mathbb{E}\|x-\hat x\|_2^2}_{\text{k차원 선형 복원의 최소 오차}}=\underbrace{\sum_{i=k+1}^{d}\lambda_i}_{\text{버린 covariance 방향의 분산 합}}`}</Math></div>
      <FormulaNote
        meaning="covariance eigenvalue가 4와 1인 2차원 데이터에서 1차원 linear autoencoder는 분산 4인 방향을 보존하고 분산 1인 방향을 버린다. 따라서 최적 평균 제곱 복원 오차는 1이다."
        symbols={[
          [String.raw`k`, 'latent가 보존할 선형 부분공간의 차원'],
          [String.raw`d`, '입력 공간의 차원'],
          [String.raw`\lambda_i`, 'covariance의 i번째 eigenvalue, 즉 해당 방향의 분산'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 관계의 SVD·eigenvalue 기반은 <InternalLink slug="linear-algebra-decompositions">행렬 분해 글</InternalLink>에서,
          autoencoder 논문의 최소 역사 뼈대는 <InternalLink slug="paper-autoencoder-2006">2006 deep autoencoder 논문 글</InternalLink>에서 선택적으로 내려가 확인한다.
        </p>
      </div>
      <Misconception>
        “노이즈는 패턴이 없으니 bottleneck에서 자연히 제거된다”는 보장은 없다. vanilla autoencoder는 학습 분포의 noise까지 복원할 수 있다. Noise 제거를 원하면 noisy input에서 clean target을 맞히는 denoising objective처럼 목표를 명시해야 한다.
      </Misconception>
    </section>
  );
}
