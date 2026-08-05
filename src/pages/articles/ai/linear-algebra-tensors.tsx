import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection } from './nlp-shared';
import {
  CoordinateFrameLab,
  ShapeContractionLab,
  SimilarityProjectionLab,
  TensorLayoutMemoryLab,
} from './linear-algebra-tensors/viz/LinearAlgebraLabs';

function ObjectsAndCoordinates() {
  return (
    <NlpSection
      id="objects-coordinates"
      marker="01"
      tone="teal"
      question="같은 화살표인데 좌표 숫자는 왜 달라질까?"
      title="대상, 축, 좌표를 먼저 분리한다"
    >
      <BeginnerOpening
        title="선형대수는 숫자표를 외우는 과목이 아니라, 방향과 변환을 숫자로 기록하는 언어입니다."
        description={<>AI의 image, 문장, robot pose는 모두 많은 숫자로 바뀐다. 중요한 것은 숫자 개수만이 아니라 각 칸이 무엇을 뜻하고, 어느 기준 방향에서 읽으며, 계산 뒤 어떤 방향으로 옮겨졌는지다.</>}
        familiarScene={<>지도에서 “[3, 2]로 가라”는 말만 들으면 출발점과 가로·세로 방향을 몰라 움직일 수 없다. 동쪽으로 3칸, 북쪽으로 2칸이라는 축과 기준이 붙어야 하나의 위치가 된다. Vector와 tensor도 같은 계약이 필요하다.</>}
        steps={[
          { label: '대상과 숫자 기록을 나눈다', detail: '실제 방향이나 상태와 그것을 특정 좌표계에서 적은 coordinate를 구분한다.' },
          { label: '각 축의 뜻과 shape를 붙인다', detail: 'Batch, token, channel, 공간처럼 배열의 각 axis가 무엇인지 적는다.' },
          { label: '변환이 보존하고 지우는 것을 본다', detail: '행렬이 입력 방향을 어떻게 섞고 projection과 similarity가 무엇을 측정하는지 따라간다.' },
        ]}
      />
      <QuestionLead
        question="[3, 2]는 그 자체로 하나의 vector일까?"
        answer="숫자 두 개만으로는 뜻이 완성되지 않는다. 어느 두 축의 좌표인지 붙여야 위치, 속도, 색, embedding 가운데 무엇을 기록한 것인지 알 수 있다. 선형대수의 첫 질문은 숫자가 아니라 축의 의미다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          scalar는 온도 한 값처럼 축이 없는 양이고, vector는 같은 대상을 여러 축으로 기록한
          좌표 묶음이다. RGB의 <code>[0.8, 0.2, 0.1]</code>은 red, green, blue 순서를
          알아야 색이 된다. 로봇 속도 <code>[1, 0, 0]</code>도 world frame인지 손목
          frame인지 모르면 어느 방향으로 움직이는지 정할 수 없다. 따라서 shape
          <code>[3]</code>은 원소 수만 말하고, <strong>세 축이 무엇인지는 별도 계약</strong>이다.
        </p>
        <p>
          기하학적 vector 자체와 그 vector를 기록한 coordinate도 다르다. 방 안의 화살표는
          가만히 있는데 자를 비스듬히 돌리면 가로·세로 눈금은 달라진다. 이때 변한 것은
          대상이 아니라 basis, 즉 좌표를 읽는 기준 방향이다. 반대로 자를 고정하고 화살표를
          돌리면 대상과 좌표가 함께 변한다. 이 구분이 robot frame change, Fourier basis,
          embedding projection의 공통 출발점이다.
        </p>
      </div>

      <ConceptPrimer items={[
        { term: 'Scalar', meaning: '크기 하나로 기록되는 양이다.', why: 'loss, temperature와 learning rate처럼 축이 없는 값부터 구분한다.' },
        { term: 'Vector', meaning: '한 대상을 여러 의미 축의 coordinate로 기록한 순서 있는 묶음이다.', why: '같은 shape라도 축의 뜻이 다르면 더하거나 비교할 수 없음을 안다.' },
        { term: 'Basis', meaning: 'coordinate 한 칸이 가리키는 기준 direction들의 집합이다.', why: '숫자가 바뀐 것과 실제 대상이 움직인 것을 분리한다.' },
        { term: 'Tensor', meaning: '0개 이상의 axis를 가진 regular grid의 수치 배열이다.', why: 'batch, token, channel, space 같은 여러 의미 축을 계산에 보존한다.' },
      ]} />

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{v}_{\text{기하학적 대상}}=\underbrace{\sum_{i=1}^{n}x_i e_i}_{\text{basis 방향을 coordinate만큼 합쳐 복원}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="v는 좌표계와 독립적으로 생각하는 대상이다. eᵢ는 basis의 i번째 기준 방향이고 xᵢ는 그 방향으로 얼마나 가는지를 기록한 coordinate다. 따라서 basis를 바꾸면 같은 v를 표현하는 xᵢ가 달라질 수 있다."
        symbols={[
          [String.raw`v`, '표현하려는 vector 자체'],
          [String.raw`e_i`, 'coordinate i가 가리키는 basis direction'],
          [String.raw`x_i`, 'eᵢ 방향으로 이동할 signed amount'],
          [String.raw`\sum`, 'basis direction들을 다시 하나의 vector로 합치는 연산'],
        ]}
      />

      <CoordinateFrameLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          위 실험의 basis는 서로 직각이고 길이가 1인 orthonormal basis다. 이런 basis를
          column으로 모은 행렬을 <code>E</code>라 하면 각 coordinate는 dot product
          <code>Eᵀv</code>로 읽고, <code>E(Eᵀv)</code>로 다시 world vector를 복원한다.
          일반 basis에서는 단순히 transpose만 곱할 수 없고 inverse 또는 dual basis가
          필요하다. 이 글은 가장 투명한 orthonormal 경우로 원리를 고정하고, 일반적인
          부분공간과 inverse 문제는 뒤의 분해 글로 넘긴다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-teal-500/30 bg-teal-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{[v]_E}_{\text{basis E에서 읽은 좌표}}=E^\top v,\qquad \underbrace{v}_{\text{같은 world vector}}=E[v]_E`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="E의 column이 orthonormal일 때 EᵀE=I다. Eᵀ는 world vector를 각 basis direction에 투영해 coordinate를 읽고, E는 그 coordinate를 direction들의 선형 결합으로 되돌린다."
        symbols={[
          [String.raw`[v]_E`, 'basis E에서 v를 기록한 coordinate vector'],
          [String.raw`E^\top v`, '각 basis column과 v의 dot product'],
          [String.raw`E[v]_E`, 'coordinate로 basis direction을 다시 합친 vector'],
          [String.raw`E^\top E=I`, 'basis가 서로 직교하고 모두 unit length라는 조건'],
        ]}
      />
    </NlpSection>
  );
}

function LinearCombinations() {
  return (
    <NlpSection
      id="linear-combinations"
      marker="02"
      tone="blue"
      question="행렬의 column은 왜 새로운 vector를 만드는 재료가 될까?"
      title="행렬은 direction을 섞는 규칙이다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          두 direction <code>a₁</code>, <code>a₂</code>가 있을 때
          <code>2a₁ - 0.5a₂</code>처럼 scalar를 곱해 더한 것을 linear combination이라
          한다. 행렬 <code>A</code>의 column을 이 direction들로 보면
          <code>Ax</code>는 coordinate <code>x</code>가 지시한 만큼 각 column을 섞어
          출력 vector 하나를 만드는 계산이다. 행렬은 숫자 표가 아니라
          <strong> 입력 coordinate를 출력 공간의 direction으로 번역하는 map</strong>이다.
        </p>
        <p>
          예를 들어 image의 한 pixel이 RGB 세 값을 가질 때, <code>A</code>의 column 세
          개는 red, green, blue 입력이 각각 출력 feature를 어느 direction으로 움직일지
          정한다. LLM의 embedding projection도 동일하다. 입력 feature 하나가 바뀌었을
          때 출력 hidden의 어느 coordinate들이 함께 바뀌는지가 해당 column에 들어 있다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{Ax}_{\text{출력 vector}}=\underbrace{x_1A_{:,1}+x_2A_{:,2}+\cdots+x_nA_{:,n}}_{\text{column direction의 선형 결합}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="입력 x의 j번째 coordinate는 A의 j번째 column을 얼마나 사용할지 정한다. 모든 scaled column을 합한 결과가 Ax다. 그래서 A의 column 수와 x의 원소 수가 같아야 한다."
        symbols={[
          [String.raw`A_{:,j}`, '입력 coordinate j가 출력에 만드는 direction'],
          [String.raw`x_j`, '그 direction을 사용할 signed amount'],
          [String.raw`n`, '입력 feature 수이자 A의 column 수'],
          [String.raw`Ax`, '모든 입력 feature가 섞인 출력 vector'],
        ]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">1 · direction을 정한다</p>
          <p className="mt-2 font-mono text-sm font-bold">A[:, j]</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">입력 feature j가 출력 공간을 어느 방향으로 움직일지 정한다.</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">2 · 양을 정한다</p>
          <p className="mt-2 font-mono text-sm font-bold">x[j]</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">현재 sample에서 그 direction을 얼마나 사용할지 정한다.</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">3 · 하나로 합친다</p>
          <p className="mt-2 font-mono text-sm font-bold">Σj x[j]A[:,j]</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">모든 feature의 기여를 더해 출력 vector 한 개를 만든다.</p>
        </div>
      </div>

      <StopRule>
        여기서는 column combination까지만 쓴다. 어떤 direction들이 독립인지, map이 지우는
        방향은 무엇인지, low-rank 근사가 무엇을 잃는지는{' '}
        <InternalLink slug="linear-algebra-decompositions">부분공간과 행렬 분해</InternalLink>에서
        rank, null space, SVD로 이어 간다.
      </StopRule>
    </NlpSection>
  );
}

function DotAndProjection() {
  return (
    <NlpSection
      id="dot-projection"
      marker="03"
      tone="violet"
      question="같은 dot product가 왜 score도 되고 similarity도 될까?"
      title="길이와 방향을 분해해 읽는다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          dot product는 같은 index의 원소를 곱해 모두 더한다. 계산만 보면 multiply and
          sum이지만, 기하학적으로는 한 vector가 다른 direction에 얼마나 놓였는지를 묻는다.
          결과가 양수면 같은 쪽 성분, 0이면 직각, 음수면 반대쪽 성분이 더 크다. 신경망
          neuron의 <code>wᵀx</code>는 입력이 weight direction과 얼마나 맞는지를 길이까지
          포함해 score로 만든다.
        </p>
        <p>
          그러나 dot에는 두 vector의 길이도 곱해진다. 방향이 같아도 embedding norm이
          10배면 dot score도 10배다. 방향만 비교하고 싶다면 두 vector를 unit norm으로
          나눈 cosine similarity를 쓴다. 반대로 norm 자체가 confidence, popularity,
          frequency 같은 유효한 신호라면 무조건 normalize하면 그 정보를 지운다. 어느
          metric이 “더 좋다”가 아니라 <strong>크기를 남길 질문인지 먼저 결정</strong>해야 한다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{\lVert x\rVert_2}_{\text{vector의 길이}}=\underbrace{\sqrt{\sum_{i=1}^{n}x_i^2}}_{\text{각 좌표의 제곱을 더한 뒤 제곱근}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="L2 norm은 좌표마다 부호가 달라도 길이가 상쇄되지 않도록 먼저 제곱하고, 직각인 축의 제곱 길이를 더한 뒤 다시 원래 단위로 돌아오도록 제곱근을 취한다. 예를 들어 x=(1,2,2)이면 √(1+4+4)=3이다."
        symbols={[
          [String.raw`x_i`, 'vector x의 i번째 coordinate'],
          [String.raw`x_i^2`, '방향 부호를 없애고 해당 축의 제곱 길이로 바꾼 값'],
          [String.raw`\sum_i`, '직교 coordinate 축의 제곱 길이를 모두 합치는 연산'],
          ['제곱근', '제곱된 단위를 원래 길이 단위로 되돌리는 연산'],
        ]}
      />

      <div className="not-prose my-6 grid min-w-0 gap-2">
        <div className="min-w-0 rounded-md border border-border p-3">
          <MathFormula display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{u^\top v}_{\text{길이와 방향을 함께 반영}}=\underbrace{\lVert u\rVert_2\lVert v\rVert_2}_{\text{두 vector의 크기}}\underbrace{\cos\theta}_{\text{방향 일치도}}`}
          </MathFormula>
        </div>
        <div className="min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-3">
          <MathFormula display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{\operatorname{comp}_{v}(u)}_{\text{v 방향의 signed 길이}}=\underbrace{\frac{u^\top v}{\lVert v\rVert_2}}_{\text{v를 unit direction으로 만들어 비교}}`}
          </MathFormula>
        </div>
        <div className="min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-3">
          <MathFormula display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{\operatorname{proj}_{v}(u)}_{\text{v 방향에 남는 vector}}=\underbrace{\frac{u^\top v}{\lVert v\rVert_2^2}}_{\text{v를 몇 배 쓸지 정하는 계수}}\,v`}
          </MathFormula>
        </div>
      </div>
      <FormulaNote
        meaning="첫 식은 dot을 두 길이와 방향 일치도로 분해한다. comp는 v를 unit direction으로 만든 뒤 그 방향의 signed 길이만 재므로 ‖v‖를 한 번 나눈다. proj의 coefficient는 원래 길이의 v를 몇 배 쓸지 정해야 하므로 ‖v‖²로 나누고 마지막에 v를 곱한다. 따라서 scalar projection, coefficient, vector projection은 서로 다른 출력이다."
        symbols={[
          [String.raw`\theta`, '두 nonzero vector 사이 각도'],
          [String.raw`\cos\theta`, '길이를 제거한 signed direction match'],
          [String.raw`\operatorname{comp}_v(u)`, 'v 방향으로 잰 u의 signed scalar length'],
          [String.raw`\frac{u^\top v}{\lVert v\rVert^2}`, '원래 v를 몇 배 해야 u의 평행 성분이 되는지 정하는 coefficient'],
          [String.raw`\operatorname{proj}_v(u)`, 'u를 v가 만든 선 위로 내린 vector projection'],
        ]}
      />

      <SimilarityProjectionLab />

      <Misconception>
        zero vector는 길이가 0이어서 방향이 없다. cosine 식의 분모도 0이므로 정의되지
        않는다. 구현에서 작은 epsilon을 더해 숫자를 만들 수는 있지만, 그 값이 새로운
        기하학적 방향을 만들어 주는 것은 아니다.
      </Misconception>
    </NlpSection>
  );
}

function LinearMaps() {
  return (
    <NlpSection
      id="linear-maps"
      marker="04"
      tone="amber"
      question="출력 원소 하나는 입력의 어느 값들을 모아 만들까?"
      title="행렬곱은 한 축을 합쳐 없애는 계산이다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>X:[B,D]</code>와 <code>W:[D,O]</code>를 곱하면 출력은
          <code>Y:[B,O]</code>다. batch <code>B</code>와 출력 feature <code>O</code>는
          결과 index에 남는다. 입력 feature <code>D</code>는 같은 위치끼리 곱한 뒤 합에
          들어가므로 사라진다. 이처럼 합으로 없애는 축을 contraction axis, 결과 index로
          남는 축을 free axis라고 부르면 큰 tensor도 같은 규칙으로 읽을 수 있다.
        </p>
        <p>
          행렬곱의 안쪽 dimension이 같아야 하는 이유도 여기 있다. 출력 한 칸을 만들
          때 <code>X[b,:]</code>와 <code>W[:,o]</code>를 elementwise로 짝지어야 하므로
          두 vector의 길이 <code>D</code>가 같아야 한다. 바깥 dimension
          <code>B,O</code>는 어떤 row와 output feature를 계산했는지 표시하므로 남는다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{Y_{bo}}_{\text{batch b의 출력 feature o}}=\underbrace{\sum_{d=1}^{D}X_{bd}W_{do}}_{\text{입력 feature d를 곱해 합침}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="b와 o는 output index에 남고 d만 Σ 안에서 사라진다. 그래서 [B,D]와 [D,O]를 곱한 결과는 [B,O]다. 이 한 줄을 읽을 수 있으면 matrix shape를 외우지 않고 검산할 수 있다."
        symbols={[
          [String.raw`b`, '결과에 남는 batch free axis'],
          [String.raw`o`, '결과에 남는 output-feature free axis'],
          [String.raw`d`, '곱한 뒤 합으로 사라지는 input-feature axis'],
          [String.raw`\sum_d`, '모든 입력 feature의 기여를 한 output scalar로 모으는 reduction'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          여기서 framework convention 하나를 반드시 분리해야 한다. 교재에서는
          <code>W:[D,O]</code>를 두고 <code>XW</code>라 쓰기 쉽다. PyTorch
          <code>nn.Linear(D,O)</code>는 parameter를 <code>weight=A:[O,D]</code>로
          저장하고 <code>XAᵀ+b</code>를 계산한다. 각 output neuron의 weight vector를
          한 row에 연속해 두는 저장·API 규약이다. 두 표기는 transpose 관계일 뿐
          output scalar의 곱셈은 같다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">교재에서 자주 쓰는 표기</p>
          <p className="mt-2 font-mono text-lg font-bold">Y = XW + b</p>
          <p className="mt-2 font-mono text-xs text-blue-700 dark:text-blue-300">W [D,O] · column o가 neuron o</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">X의 마지막 D와 W의 첫 D를 합친다.</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">PyTorch <code>nn.Linear</code> 저장 규약</p>
          <p className="mt-2 font-mono text-lg font-bold">Y = XAᵀ + b</p>
          <p className="mt-2 font-mono text-xs text-violet-700 dark:text-violet-300">weight A [O,D] · row o가 neuron o</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">입력 앞의 모든 <code>*</code> axis는 그대로 두고 마지막 D만 변환한다.</p>
        </div>
      </div>

      <Misconception>
        bias를 더한 <code>XAᵀ+b</code>는 엄밀히는 affine map이다. <code>b=0</code>일
        때만 원점을 원점으로 보내는 linear map 조건을 만족한다. 실무에서 “linear
        layer”라고 부르는 이름과 수학적 분류를 구분한다.
      </Misconception>
    </NlpSection>
  );
}

function TensorContraction() {
  return (
    <NlpSection
      id="tensor-contraction"
      marker="05"
      tone="green"
      question="batch·head·token 축이 늘어나도 같은 규칙을 쓸 수 있을까?"
      title="축에 이름을 붙이면 attention도 한 줄로 읽힌다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          tensor는 axis가 여러 개인 수치 배열이다. <code>[B,T,D]</code>라면
          <code>B</code>는 sample, <code>T</code>는 token 위치, <code>D</code>는 token
          하나의 feature다. <code>Linear(D,O)</code>는 마지막 <code>D</code>만
          contraction하고 앞의 <code>B,T</code>를 보존해 <code>[B,T,O]</code>를 만든다.
          batch가 추가됐다고 새로운 선형대수를 배우는 것이 아니라 같은 dot product를
          여러 독립 위치에서 반복한다.
        </p>
        <p>
          multi-head attention은 feature <code>D</code>를
          <code>H × D_h</code>로 나눈다. Query와 key가
          <code>[B,H,T,D_h]</code>라면 token pair score는 같은 batch와 head 안에서
          <code>D_h</code> 방향을 dot product해 만든다. Query token
          <code>t</code>와 key token <code>s</code>는 결과 index에 남아
          <code>[B,H,T,T]</code>가 된다. 이후 각 query row를 확률로 바꾸고 value의
          token 축을 가중합하면 <code>s</code>가 사라지고 value feature
          <code>D_h</code>가 다시 남는다.
        </p>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-2">
        <div className="min-w-0 rounded-md border border-border p-3">
          <MathFormula display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{S_{bhts}}_{\text{query t와 key s의 점수}}=\underbrace{\sum_{d=1}^{D_h}Q_{bhtd}K_{bhsd}}_{\text{head 안 feature 축으로 방향 비교}}`}
          </MathFormula>
        </div>
        <div className="min-w-0 rounded-md border border-green-500/30 bg-green-500/[0.04] p-3">
          <MathFormula display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{O_{bhtd}}_{\text{token t가 가져온 내용}}=\underbrace{\sum_{s=1}^{T}P_{bhts}V_{bhsd}}_{\text{key token 축을 확률로 가중합}}`}
          </MathFormula>
        </div>
      </div>
      <FormulaNote
        meaning="첫 식에서는 feature d가 사라지고 query token t와 key token s가 남아 token-pair score가 된다. 둘째 식에서는 key token s가 사라지고 value feature d가 남는다. 어떤 축을 합했는지가 연산의 의미다."
        symbols={[
          [String.raw`B`, '서로 섞지 않는 sample batch axis'],
          [String.raw`H`, '각자 다른 projection을 쓰는 attention-head axis'],
          [String.raw`T`, 'query 또는 key/value token 위치 수'],
          [String.raw`D_h`, 'head 하나 안에서 dot product하는 feature width'],
        ]}
      />

      <ShapeContractionLab />

      <div data-detection-output-shape className="not-prose my-6 border-y border-border py-5">
        <p className="text-[10px] font-black uppercase text-muted-foreground">Detection output</p>
        <p className="mt-2 font-mono text-sm font-black">[batch, objects, 4 + classes]</p>
        <div className="mt-4 grid gap-px bg-border sm:grid-cols-3">
          <div className="bg-background p-4"><p className="font-mono text-xs font-black">B = 2</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">서로 섞이지 않는 image 두 장</p></div>
          <div className="bg-background p-4"><p className="font-mono text-xs font-black">N = 300</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">image마다 확보한 candidate slot. 실제 객체 수와 같지 않다.</p></div>
          <div className="bg-background p-4"><p className="font-mono text-xs font-black">4 + C = 10</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">box 좌표 4개와 class logit 6개</p></div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          예를 들어 <code>[2,300,10]</code>은 객체가 600개라는 뜻이 아니다. 600개 slot 각각이 box와 class 후보를 내고, no-object class·score threshold·matching 같은 계약이 유효 객체를 가린다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 원리로 image tensor <code>[B,C,H,W]</code>에서는 channel과 두 spatial
          axis를, video <code>[B,F,C,H,W]</code>에서는 frame 축까지, detection
          <code>[B,N,4+C]</code>에서는 object candidate와 box/class feature를 구분한다.
          size만 적지 말고 <code>shape=[6,6,24]</code> 옆에
          <code>axes=[batch,token,hidden]</code>을 같이 기록해야 같은 숫자 크기의 축이
          우연히 충돌해도 오류를 찾을 수 있다.
        </p>
        <p>
          용어도 주의한다. tensor의 “rank”를 axis 개수라는 뜻으로 쓰는 문서가 있지만,
          matrix rank는 독립 direction 수라는 전혀 다른 개념이다. PyTorch에서는 axis
          개수를 <code>ndim</code>이라고 부르면 모호함을 줄일 수 있다. matrix rank,
          null space와 SVD는{' '}
          <InternalLink slug="linear-algebra-decompositions">부분공간과 행렬 분해</InternalLink>가
          맡는다.
        </p>
        <p>
          attention에서 score가 확률로 바뀌는 과정까지 이어 읽으려면{' '}
          <InternalLink slug="attention-theory">Attention: 검색·혼합의 원리</InternalLink>로
          올라간다. 여기서는 softmax를 다루지 않고 어떤 scalar들이 그 입력으로 만들어지는지만
          책임진다.
        </p>
      </div>
    </NlpSection>
  );
}

function Broadcasting() {
  return (
    <NlpSection
      id="broadcasting"
      marker="06"
      tone="blue"
      question="연산이 성공했는데도 왜 잘못된 축에 값이 더해질까?"
      title="Broadcastable과 의미상 올바름은 다르다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          broadcasting은 작은 tensor를 큰 tensor의 여러 위치에 개념적으로 반복해 같은
          elementwise operation을 적용한다. PyTorch와 NumPy의 기본 규칙은
          <strong> 오른쪽 끝 axis부터 정렬</strong>하는 것이다. 대응하는 두 size가
          같거나, 한쪽이 1이거나, 한쪽 axis가 없으면 확장할 수 있다. 예를 들어
          activation <code>[B,T,O]</code>에 bias <code>[O]</code>를 더하면 bias 앞에
          크기 1인 axis 두 개가 있다고 보고 모든 batch와 token에 같은 bias를 적용한다.
        </p>
        <p>
          위험한 경우는 error가 아니라 성공이다. activation이
          <code>[6,6,24]=[B,T,D]</code>이고 “sample별 offset”이라 생각한 tensor가
          <code>[6,24]</code>라 하자. 오른쪽에서 맞추면 <code>24→D</code>,
          <code>6→T</code>가 된다. 우연히 <code>B=T=6</code>이므로 연산은 성공하지만
          offset의 첫 축은 batch가 아니라 token에 붙는다. 원하는 뜻이 sample별이면
          <code>[B,1,D]</code>, token별이면 <code>[1,T,D]</code>로 singleton axis를
          명시해야 한다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {[
          {
            title: '출력 feature bias',
            left: '[B,T,D]',
            right: '[D]',
            aligned: '[B,T,D] + [1,1,D]',
            verdict: '성공 · 모든 위치에 같은 feature bias',
            tone: 'text-emerald-700 dark:text-emerald-300',
          },
          {
            title: 'sample별 offset을 명시',
            left: '[B,T,D]',
            right: '[B,1,D]',
            aligned: '[B,T,D] + [B,1,D]',
            verdict: '성공 · token axis만 반복',
            tone: 'text-emerald-700 dark:text-emerald-300',
          },
          {
            title: '같은 size가 숨긴 의미 충돌',
            left: '[6,6,24]',
            right: '[6,24]',
            aligned: '[B,T,D] + [—,T,D]',
            verdict: '연산 성공 · sample 의도는 실패',
            tone: 'text-red-700 dark:text-red-300',
          },
        ].map((item) => (
          <div key={item.title} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-sm font-bold">{item.title}</p>
              <p className={`mt-1 text-xs font-semibold ${item.tone}`}>{item.verdict}</p>
            </div>
            <p className="break-words font-mono text-xs font-bold">{item.left} + {item.right}</p>
            <p className="break-words font-mono text-xs text-muted-foreground">{item.aligned}</p>
          </div>
        ))}
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{(d_k=e_k)\ \lor\ (d_k=1)\ \lor\ (e_k=1)}_{\text{오른쪽에서 맞춘 각 axis가 만족해야 할 조건}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="각 trailing axis k에서 두 size가 같거나 한쪽이 1이어야 한다. 빠진 앞 axis는 size 1로 간주한다. 이 식은 operation 가능 여부만 판정하며, 두 axis의 의미가 같은지는 이름과 의도로 별도 검사해야 한다."
        symbols={[
          [String.raw`d_k,e_k`, '오른쪽에서 k번째로 대응하는 두 tensor의 axis size'],
          [String.raw`d_k=e_k`, '같은 size라 그대로 짝지을 수 있는 경우'],
          [String.raw`d_k=1`, '첫 tensor를 해당 axis로 반복할 수 있는 경우'],
          [String.raw`e_k=1`, '둘째 tensor를 해당 axis로 반복할 수 있는 경우'],
        ]}
      />

      <Misconception>
        “broadcasting은 data copy가 없다”는 문장을 모든 후속 operation까지 일반화하면 안
        된다. PyTorch의 <code>expand</code> view는 stride 0으로 storage를 공유할 수
        있지만, 뒤 operation이 값을 materialize하거나 dtype을 바꾸면 allocation이 생길
        수 있다. in-place operation은 원래 tensor의 shape를 바꿀 수도 없다.
      </Misconception>
    </NlpSection>
  );
}

function LayoutAndMemory() {
  return (
    <NlpSection
      id="layout-memory"
      marker="07"
      tone="amber"
      question="shape가 맞으면 GPU memory와 실행 비용도 같을까?"
      title="Shape 다음에는 stride, dtype, byte를 본다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          tensor의 shape는 각 axis에서 보이는 원소 수다. 그러나 실제 storage는 byte가
          일렬로 놓인 공간이고, stride는 한 axis에서 index를 1 늘릴 때 storage에서 몇
          원소를 건너뛸지 정한다. contiguous <code>[3,2,5]</code> tensor의 stride가
          <code>[10,5,1]</code>인 이유는 첫 axis 한 칸이 10개, 둘째 axis 한 칸이 5개,
          마지막 axis 한 칸이 1개를 건너기 때문이다.
        </p>
        <p>
          <code>permute</code>는 storage를 옮기지 않고 shape와 stride metadata만 바꾼
          view를 만들 수 있다. 그래서 빠르지만 non-contiguous layout이 된다.
          <code>view</code>는 새 shape가 기존 stride와 호환될 때만 같은 storage를 그대로
          해석한다. <code>reshape</code>는 가능하면 view를 반환하고 아니면 copy하므로,
          성능에 민감한 코드는 어느 쪽인지 가정하지 말고 profiler와
          <code>is_contiguous()</code>로 확인한다. 무엇보다 <code>reshape</code>는 원소
          순서만 보존할 뿐, batch와 head 같은 <strong>축의 의미를 자동으로 지켜 주지
          않는다</strong>.
        </p>
      </div>

      <TensorLayoutMemoryLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          memory의 첫 근사는 단순하다. 모든 axis size를 곱해 element 수를 구하고 dtype의
          bytes per element를 곱한다. <code>float32</code>는 보통 4 byte,
          <code>float16/bfloat16</code>은 2 byte, <code>int8</code>은 1 byte다.
          하지만 이것은 tensor payload다. 실제 peak memory에는 allocator block,
          alignment, temporary workspace, gradient, optimizer state, fragmentation이
          더해질 수 있다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{N_X}_{\text{전체 element 수}}=\underbrace{\prod_{i=1}^{n}d_i}_{\text{모든 axis size를 곱함}}`}
        </MathFormula>
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{\operatorname{bytes}(X)}_{\text{tensor 전체의 payload byte}}=\underbrace{N_X}_{\text{전체 element 수}}\underbrace{s_{\mathrm{dtype}}}_{\text{element 하나의 byte}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="shape의 각 axis size를 모두 곱하면 tensor가 가진 element 수가 된다. 여기에 dtype이 element 하나를 저장하는 byte를 곱하면 allocator와 workspace를 제외한 payload 하한을 얻는다."
        symbols={[
          [String.raw`d_i`, 'axis i의 size'],
          [String.raw`i`, '현재 곱하고 있는 axis index'],
          [String.raw`n`, 'tensor의 전체 axis 개수, 즉 ndim'],
          [String.raw`\prod`, '모든 axis size를 빠짐없이 곱하는 연산'],
          [String.raw`N_X`, 'shape의 모든 axis size를 곱해 얻은 전체 element 수'],
          [String.raw`s_{\mathrm{dtype}}`, '각 element가 차지하는 byte'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{\operatorname{KVBytes}}_{\text{cache payload 하한}}=\underbrace{B\,T\,L}_{\text{sample·token·layer 축을 곱한 크기}}\underbrace{c_{\mathrm{token}}}_{\text{token당 byte}}`}
        </MathFormula>
        <MathFormula display className="my-0 text-sm sm:text-base">
          {String.raw`\underbrace{c_{\mathrm{token}}}_{\text{token당 byte}}=\underbrace{2H_{\mathrm{kv}}D_h}_{\text{key·value feature 수}}\underbrace{s_{\mathrm{dtype}}}_{\text{원소당 byte}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="KV cache는 layer마다 key와 value 두 tensor를 저장한다. 따라서 batch와 sequence가 늘면 선형으로 커지고, KV head 수·head dimension·dtype byte에도 비례한다. 이 식은 payload 하한이지 runtime peak를 보장하는 식은 아니다."
        symbols={[
          [String.raw`B`, '동시에 cache를 유지하는 sequence batch 수'],
          [String.raw`T`, 'sequence마다 이미 처리한 token 수'],
          [String.raw`L`, 'KV를 저장하는 transformer layer 수'],
          [String.raw`c_{\mathrm{token}}`, '한 layer에서 token 하나의 key와 value를 저장하는 byte'],
          [String.raw`2H_{\mathrm{kv}}D_h`, 'key/value 두 장에 들어가는 token당 feature 수'],
          [String.raw`s_{\mathrm{dtype}}`, '각 element가 차지하는 byte'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이제 상위 글의 숫자가 읽힌다. Attention에서는 head와 token contraction을,
          Robot AI에서는 같은 vector의 frame coordinate를, on-device에서는 dtype과
          element 수를, serving에서는 token당 KV byte를 추적하면 된다. Image와 video에서는
          batch·frame·channel·height·width가 함께 곱해져 activation memory가 되고,
          segmentation mask도 <code>[B, N, H, W]</code>처럼 object 축 하나가 더 붙은
          tensor일 뿐 같은 shape 규칙을 따른다. Interpretability에서는 probe가 residual
          stream의 어느 direction을 읽는지, unembedding이 그 state를 vocabulary 방향으로
          어떻게 projection하는지를 같은 dot과 contraction 언어로 추적한다. On-device에서는
          그 payload가 곧 resident-memory budget의 출발점이 된다. 실제로 다음 질문이 생긴
          지점만 올라간다.
        </p>
        <ul>
          <li>
            좌표계를 3D pose와 homogeneous transform으로 확장하려면{' '}
            <InternalLink slug="robot-kinematics-coordinate-frames">Robot Kinematics와 Coordinate Frame</InternalLink>
          </li>
          <li>
            dtype를 줄일 때 scale·zero point와 정확도 손실을 보려면{' '}
            <InternalLink slug="quantization">양자화</InternalLink>
          </li>
          <li>
            KV tensor가 GPU 사이를 이동하는 runtime을 보려면{' '}
            <InternalLink slug="llm-disaggregated-serving">Disaggregated LLM Serving</InternalLink>
          </li>
          <li>
            frame·해상도 축이 video activation과 temporal memory로 이어지는 방식을 보려면{' '}
            <InternalLink slug="video-model-runtime">Video Model Runtime</InternalLink>
          </li>
          <li>
            probe·unembedding이 hidden state를 관찰 가능한 token score로 바꾸는 경계를 보려면{' '}
            <InternalLink slug="llm-interpretability-readouts">LLM Layer Readout</InternalLink>
          </li>
          <li>
            class·box·mask 출력의 tensor 축과 좌표 계약을 실제 vision system에 연결하려면{' '}
            <InternalLink slug="vision-system-contracts">Vision System 작업 계약</InternalLink>
          </li>
          <li>
            계산한 payload를 실제 device의 resident memory·latency budget으로 바꾸려면{' '}
            <InternalLink slug="efficient-inference-on-device">On-device 추론 효율화</InternalLink>
          </li>
        </ul>
      </div>

      <CapabilityCheck items={[
        '같은 vector와 달라진 coordinate를 basis 변화에서 구분한다.',
        'dot, cosine, scalar/vector projection이 길이에 어떻게 반응하는지 계산한다.',
        'matrix product에서 contraction axis와 output에 남는 free axis를 찾는다.',
        '교재 W[D,O]와 PyTorch weight[O,D]가 같은 계산임을 index로 보인다.',
        'attention의 [B,H,T,Dh] 축을 score와 value mixing까지 추적한다.',
        'broadcastable하지만 의미가 틀린 same-size axis collision을 찾는다.',
        'shape·stride·contiguous·view/copy 가능성을 서로 다른 계약으로 설명한다.',
        'shape와 dtype로 activation·KV-cache payload byte의 1차 하한을 계산한다.',
      ]} />

      <SourceNotes sources={[
        {
          label: 'Goodfellow et al. · Deep Learning Chapter 2',
          href: 'https://www.deeplearningbook.org/contents/linear_algebra.html',
          note: 'scalar/vector/matrix/tensor, matrix-product index, broadcasting, norm과 dot/cosine의 1차 교재 근거. 2026-07-30 대조.',
        },
        {
          label: 'MIT OpenCourseWare · 18.06SC Linear Algebra',
          href: 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/',
          note: 'coordinate, linear combination, projection과 matrix-as-map의 학습 순서를 대조했다.',
        },
        {
          label: 'PyTorch 2.13 · Linear',
          href: 'https://docs.pytorch.org/docs/2.13/generated/torch.nn.Linear.html',
          note: 'y=xAᵀ+b, input/output wildcard shape와 stored weight [out_features,in_features] 규약.',
        },
        {
          label: 'PyTorch 2.13 · matmul',
          href: 'https://docs.pytorch.org/docs/2.13/generated/torch.matmul.html',
          note: '마지막 두 axis의 matrix multiply와 앞 batch axis의 broadcast 규칙.',
        },
        {
          label: 'PyTorch 2.13 · Broadcasting semantics',
          href: 'https://docs.pytorch.org/docs/2.13/notes/broadcasting.html',
          note: 'trailing-axis 정렬, equal/1/missing 조건과 in-place shape 제한.',
        },
        {
          label: 'PyTorch 2.13 · Tensor Views',
          href: 'https://docs.pytorch.org/docs/2.13/tensor_view.html',
          note: 'view의 storage 공유, non-contiguous layout, reshape의 view/copy 경계와 stride 의미.',
        },
        {
          label: 'PyTorch 2.13 · Storage',
          href: 'https://docs.pytorch.org/docs/2.13/storage.html',
          note: 'storage byte, dtype, shape, stride와 offset이 tensor의 data·metadata 계약을 구성한다.',
        },
      ]} />
    </NlpSection>
  );
}

export default function LinearAlgebraTensorsArticle() {
  return (
    <>
      <ObjectsAndCoordinates />
      <LinearCombinations />
      <DotAndProjection />
      <LinearMaps />
      <TensorContraction />
      <Broadcasting />
      <LayoutAndMemory />
    </>
  );
}
