import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import { ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';
import NNCompositionViz from './viz/NNCompositionViz';

export default function NetworkOverview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">퍼셉트론 여러 개는 어떻게 하나의 함수가 될까?</h2>
      <QuestionLead
        question="뉴런을 많이 놓는 것과 층으로 연결하는 것은 무엇이 다를까?"
        answer="같은 층의 뉴런은 입력을 서로 다른 방향으로 바라보고, 다음 층은 그 결과를 다시 조합한다. 신경망은 뉴런 목록이 아니라 선형 변환과 비선형 변환을 순서대로 합성한 함수다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          퍼셉트론 하나는 입력 벡터에 가중치를 곱해 scalar 하나를 만든다. 뉴런 h개를 같은 층에 놓으면 각 뉴런의
          가중치를 행렬 W에 모아 h개의 출력을 한 번의 행렬곱으로 계산할 수 있다. 다음 층은 이 h개 값을 새로운 입력으로
          받는다. 이런 층의 반복이 multi-layer perceptron, 즉 MLP다.
        </p>
        <p>
          입력층은 보통 계산을 하지 않고 데이터의 shape를 이름 붙이는 경계다. 은닉층은 다음 층이 사용할 표현을 만들고,
          출력층은 회귀 값이나 분류 logits처럼 과제에 맞는 shape를 만든다. 각 층에서 중요한 질문은 “입력과 출력의
          shape가 무엇인가?”와 “선형 변환 뒤에 어떤 비선형성을 적용하는가?”다.
        </p>
      </div>

      <NNCompositionViz />
      <div data-formula-pair>
        <Math display>{String.raw`
\underbrace{Z^{(\ell)}}_{\text{활성화 전 선형 출력}}
=
\underbrace{A^{(\ell-1)}}_{\text{이전 층 표현}}
\underbrace{W^{(\ell)}}_{\text{입력 폭을 출력 폭으로 투영}}
+
\underbrace{b^{(\ell)}}_{\text{출력별 기준 이동}}
`}</Math>
        <Math display>{String.raw`
\underbrace{A^{(\ell)}}_{\text{다음 층에 전달할 표현}}
=
\underbrace{\phi^{(\ell)}\!\left(Z^{(\ell)}\right)}_{\text{비선형 활성화로 새 경계 생성}}
`}</Math>
        <FormulaNote
          meaning="이 글은 batch를 행에 두는 관례를 사용한다. 이전 층의 마지막 차원과 W의 첫 차원이 만나 사라지고, W의 둘째 차원이 새 특징 폭으로 남는다. 편향은 각 batch 행에 broadcast되고, 활성화 함수는 단순한 행렬곱 하나로 접히지 않는 새 표현을 만든다."
          symbols={[
            ['A^{(0)}=X', '네트워크에 들어온 batch 입력'],
            ['A^{(\\ell-1)}', 'l번째 층이 받는 이전 표현. 행은 배치의 샘플, 열은 이전 층의 특징이다.'],
            ['W^{(\\ell)}', '이전 층의 특징 수를 현재 층의 특징 수로 바꾸는 가중치 행렬이다.'],
            ['b^{(\\ell)}', '각 출력 특징의 기준점을 옮기는 편향. 배치의 모든 샘플에 같은 값이 더해진다.'],
            ['Z^{(\\ell)}', '활성화 함수를 적용하기 전 선형 출력'],
            ['A^{(\\ell)}', '비선형 활성화 뒤 다음 층에 전달하는 표현'],
          ]}
        />
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h3>왜 선형층 사이에 비선형성이 필요한가?</h3>
        <p>
          활성화 함수 없이 선형층 두 개를 연속 적용하면 가중치 두 개와 편향 두 개를 다시 묶어 선형층 하나로 쓸 수 있다.
          층 수는 늘었지만 만들 수 있는 결정 경계는 여전히 하나의 선형 경계다.
        </p>
      </div>
      <div data-formula-pair>
        <Math display>{String.raw`\begin{aligned}
\underbrace{W^*}_{\text{결합 가중치}}
&=W^{(1)}W^{(2)}
\\
\underbrace{b^*}_{\text{결합 편향}}
&=b^{(1)}W^{(2)}+b^{(2)}
\end{aligned}`}</Math>
        <Math display>{String.raw`
\underbrace{\left(XW^{(1)}+b^{(1)}\right)W^{(2)}+b^{(2)}}_{\text{활성화 없는 두 층}}
=
\underbrace{XW^*+b^*}_{\text{선형층 하나}}
`}</Math>
        <FormulaNote
          meaning="괄호를 전개하면 두 선형층은 새로운 가중치 W*와 편향 b*를 가진 선형층 하나와 완전히 같다. ReLU·sigmoid 같은 φ를 중간에 넣으면 φ(XW+b)를 행렬곱 밖으로 빼낼 수 없으므로 다음 층이 앞 층의 경계를 조합해 XOR 같은 비선형 구분을 만들 수 있다."
          symbols={[
            ['W^{(1)}W^{(2)}', '연속한 두 선형 투영을 하나로 합친 새 가중치'],
            ['b^{(1)}W^{(2)}+b^{(2)}', '첫 편향이 둘째 층을 통과한 효과와 둘째 편향을 합친 새 편향'],
            ['\\phi(XW+b)', '한 선형식으로 다시 접을 수 없게 만드는 비선형 변환'],
          ]}
        />
      </div>

      <ConceptPrimer
        items={[
          { term: 'Layer', meaning: '같은 입력을 받아 여러 출력을 함께 계산하는 연산 묶음이다.', why: '뉴런별 반복을 행렬곱 하나로 표현해 shape와 병렬 계산을 명확하게 한다.' },
          { term: 'Width', meaning: '한 층이 만드는 출력 특징의 수다.', why: '가중치 행렬의 출력 차원과 다음 층의 입력 차원을 결정한다.' },
          { term: 'Depth', meaning: '학습 가능한 변환을 몇 단계 합성하는지 나타낸다.', why: '표현을 몇 단계로 재조합할 수 있는지와 gradient 경로 길이를 바꾼다.' },
          { term: 'Logit', meaning: '분류 출력층이 확률로 바꾸기 전에 만드는 제약 없는 점수다.', why: '확률 변환과 손실 계산의 입력을 구분하게 한다.' },
        ]}
      />
    </section>
  );
}
