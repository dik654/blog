import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import type { CodeRef } from '@/components/code/types';
import SequenceStateLab from './SequenceStateLab';
import { runtimeCodeRefs } from '../dezero-shared/runtimeCodeRefs';
import { CodeEvidence, Formula, Prose, SectionTitle } from '../dezero-shared/ArticleFrame';

export default function AdvancedArticle({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <section id="overview" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="01"
          kicker="새 책임들"
          promise="독립 sample을 처리하던 layer에 시간 state, 통계 축, 무작위 mask와 sparse index가 들어오면 무엇을 더 명시해야 하는지 정합니다."
        >
          Sequence layer에서는 값뿐 아니라 “어디까지 기억할지”도 입력이다
        </SectionTitle>
        <QuestionLead
          question="같은 tensor 연산이 맞더라도 sequence 경계, 정규화 축, dropout mode, 반복 token 처리가 틀리면 왜 학습 전체가 달라질까?"
          answer="이 네 요소는 수식 바깥의 실행 계약이기 때문이다. State를 reset할지 graph만 detach할지, B×T×D 중 어느 축에서 통계를 낼지, train/eval 중 어느 mode인지, 같은 row에 gradient를 더할지가 명시돼야 같은 모델을 재현할 수 있다."
        />
        <ConceptPrimer items={[
          {
            term: 'Recurrent state',
            meaning: '이전 time step에서 다음 step으로 넘기는 hidden h와 cell c다.',
            why: '값의 수명과 gradient graph의 수명을 따로 결정해야 한다.',
          },
          {
            term: 'Detach',
            meaning: '현재 state 숫자는 유지하되 이전 computation graph와의 연결을 끊는다.',
            why: '긴 stream에서 truncated BPTT 구간을 제한하면서 문맥 값은 이어간다.',
          },
          {
            term: 'Normalization axis',
            meaning: 'Mean과 variance를 계산할 tensor 차원이다.',
            why: 'B, T, D 중 무엇을 함께 평균내느냐가 모델의 정보 교환 범위를 바꾼다.',
          },
          {
            term: 'Sparse lookup',
            meaning: '큰 vocabulary matrix에서 token id가 가리키는 row만 읽는 연산이다.',
            why: '반복 id의 gradient를 같은 row에 합산하고 읽지 않은 row는 건드리지 않는다.',
          },
        ]} />
        <Prose>
          <p>
            입력 계약을 <code>x ∈ R^(B×T×D)</code>로 둔다. <code>B</code>는 독립 sequence의 batch,
            <code>T</code>는 time 또는 token position, <code>D</code>는 각 위치의 feature다. 이 세 축을 말하지 않고
            “마지막 축을 정규화한다”고만 하면 독자는 어떤 sample들이 통계를 공유하는지 복원할 수 없다.
          </p>
          <p>
            이 글의 LSTM은 교육용 scalar cell이며 official DeZero Python 동작을 참고한 Rust 재구성이다. LayerNorm과
            Embedding은 공식 DeZero 구현을 그대로 옮겼다고 주장하지 않고, 원 논문과 공식 PyTorch API가 제공하는
            행동 계약을 최소 예제로 분리한다.
          </p>
        </Prose>
      </section>

      <section id="rnn-vs-lstm" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="02"
          kicker="시간의 chain rule"
          promise="‘LSTM이 기울기 소실을 해결한다’는 구호 대신 cell path를 따라 곱해지는 항을 직접 계산합니다."
        >
          LSTM의 장점은 기울기를 1로 만드는 것이 아니라 보존량을 gate로 학습하는 데 있다
        </SectionTitle>
        <Prose>
          <p>
            단순 RNN의 hidden-to-hidden Jacobian은 recurrent weight와 activation derivative가 step마다 곱해진다.
            그 norm이 계속 1보다 작으면 멀리 갈수록 gradient가 작아지고, 크면 폭발한다. 특정 <code>0.7</code>을 근거 없이
            모든 RNN 경로에 대입하면 안 된다. 실제 크기는 weight spectrum, activation 상태와 입력 경로에 달려 있다.
          </p>
          <p>
            LSTM cell state의 직접 경로에서는 <code>∂c_t/∂c_(t-1)=f_t</code>다. 따라서 여러 step의 gradient는 forget
            gate의 곱이다. Gate가 필요한 기억에서 1에 가깝게 학습되면 더 오래 보존할 수 있지만 항상 1도 아니고 소실이
            수학적으로 사라지는 것도 아니다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{\frac{\partial c_T}{\partial c_t}}_{\text{cell 경로의 장기 기울기}}
            =
            \prod_{k=t+1}^{T}
            \underbrace{f_k}_{\text{k step의 forget gate}}
          `}
          meaning="Cell state의 직접 경로만 보면 각 step의 forget gate가 곱해진다. Gate가 1에 가까우면 기억과 gradient가 오래 남고 0에 가까우면 지워진다. LSTM은 이 보존율을 데이터에서 학습한다."
          symbols={[
            [String.raw`c_t,c_T`, '시작 step과 마지막 step의 cell state'],
            [String.raw`f_k`, '0과 1 사이의 k번째 forget gate'],
            [String.raw`\prod`, '시간을 지날 때 각 gate가 연속으로 곱해짐'],
            ['직접 경로', '다른 hidden·gate 의존 경로를 제외하고 cell-to-cell 연결만 본 값'],
          ]}
        />
        <Misconception>
          LSTM은 vanishing gradient를 완전히 제거하지 않는다. Forget gate가 계속 0.5라면 직접 cell gradient도
          <code>0.5^T</code>로 줄어든다. 핵심은 보존과 삭제의 비율을 고정 recurrent Jacobian 대신 학습 가능한 gate가
          조절한다는 점이다.
        </Misconception>
      </section>

      <section id="lstm" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="03"
          kicker="State lifecycle"
          promise="한 LSTM step의 입력·출력을 명시하고 reset과 detach를 서로 다른 연산으로 구현합니다."
        >
          State의 숫자 수명과 gradient graph 수명을 따로 관리한다
        </SectionTitle>
        <Prose>
          <p>
            독립 문서가 시작되면 이전 문서의 의미가 섞이지 않도록 <code>h</code>와 <code>c</code> 값을 0으로 reset한다.
            같은 긴 stream을 구간별로 학습할 때는 값은 이어가되 이전 구간 graph만 detach한다. Reset만 제공하고 detach가
            없으면 stream 전체 graph가 계속 자라며, detach를 reset처럼 쓰면 필요한 문맥까지 사라진다.
          </p>
          <p>
            이 예제는 state를 layer 내부의 숨은 mutable field로 두지 않고 <code>step(x,h,c)→(h_next,c_next)</code>로
            노출한다. 호출자가 sequence boundary를 소유하므로 test에서 reset과 detach의 차이를 직접 관찰할 수 있다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{c_t}_{\text{새 memory}}
            =
            \underbrace{f_t\odot c_{t-1}}_{\text{이전 memory 보존}}
            +
            \underbrace{i_t\odot \tilde c_t}_{\text{새 candidate 기록}},
            \qquad
            \underbrace{h_t}_{\text{외부로 보낼 state}}
            =
            \underbrace{o_t}_{\text{출력 gate}}
            \odot\tanh(c_t)
          `}
          meaning="Forget gate는 이전 cell 중 남길 양을, input gate는 새 candidate 중 기록할 양을, output gate는 cell에서 외부 hidden으로 보여줄 양을 정한다. 모두 element-wise 곱이며 scalar 예제에서는 보통 곱셈과 같다."
          symbols={[
            [String.raw`f_t`, '이전 cell state를 얼마나 보존할지 정하는 forget gate'],
            [String.raw`i_t`, '새 candidate를 얼마나 기록할지 정하는 input gate'],
            [String.raw`\tilde c_t`, '현재 입력과 이전 hidden으로 만든 새 memory 후보'],
            [String.raw`o_t`, '새 cell state 중 hidden으로 드러낼 양'],
          ]}
        />
        <CodeEvidence
          codeKey="sequence-lstm"
          codeRef={runtimeCodeRefs['sequence-lstm']}
          onCodeRef={onCodeRef}
          title="Scalar LSTM의 gate와 state 반환 순서를 실제 operation graph로 확인"
        >
          Cell state가 자동으로 영원히 보존된다는 가정을 두지 않고 모든 gate를 Value 연산으로 만든다.
        </CodeEvidence>
        <CodeEvidence
          codeKey="sequence-state"
          codeRef={runtimeCodeRefs['sequence-state']}
          onCodeRef={onCodeRef}
          title="detach는 값 유지, reset은 값 삭제"
        >
          두 함수가 같은 결과처럼 보이지 않도록 generation과 data를 각각 contract test에서 확인한다.
        </CodeEvidence>
      </section>

      <section id="normalization" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="04"
          kicker="통계 축"
          promise="B×T×D tensor에서 각 token 위치의 D feature만 정규화하고 gamma·beta가 담당하는 역할을 분리합니다."
        >
          γ=1, β=0은 affine identity이지 LayerNorm 전체의 identity가 아니다
        </SectionTitle>
        <Prose>
          <p>
            LayerNorm은 각 <code>(b,t)</code> 위치 안에서 <code>D</code> feature의 mean과 variance를 계산한다. 다른 batch
            sample이나 다른 time position과 통계를 공유하지 않는다. 그래서 batch 크기가 달라져도 같은 token 위치의
            정규화 정의는 변하지 않는다.
          </p>
          <p>
            <code>γ=1, β=0</code>으로 초기화하면 normalize된 값에 추가 scale과 offset을 주지 않을 뿐이다. 입력
            <code>[1,2,3]</code>은 mean 0, variance 약 1인 값으로 바뀌므로 원래 입력과 같지 않다. Epsilon은 분산이 매우
            작을 때 0으로 나누는 것을 막지만 지나치게 크면 실제 variance를 왜곡한다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{y_{btd}}_{\text{정규화된 feature}}
            =
            \underbrace{\gamma_d}_{\text{학습 scale}}
            \frac{
              \underbrace{x_{btd}-\mu_{bt}}_{\text{해당 위치의 중심화}}
            }{
              \sqrt{\underbrace{\sigma^2_{bt}}_{\text{D축 분산}}+\underbrace{\epsilon}_{\text{0 나눗셈 방지}}}
            }
            +
            \underbrace{\beta_d}_{\text{학습 offset}}
          `}
          meaning="각 batch b와 time t 위치에서 feature d들만 모아 mean μ와 variance σ²를 계산한다. 그 뒤 feature별 gamma와 beta가 필요한 scale과 offset을 다시 학습한다."
          symbols={[
            [String.raw`b,t,d`, 'batch, time, feature index'],
            [String.raw`\mu_{bt}`, '고정된 (b,t) 위치에서 D feature의 평균'],
            [String.raw`\sigma^2_{bt}`, '같은 D feature들의 분산'],
            [String.raw`\gamma_d,\beta_d`, 'feature별 trainable affine parameter'],
            [String.raw`\epsilon`, '분산이 0에 가까울 때 denominator를 안정화하는 작은 상수'],
          ]}
        />
        <CodeEvidence
          codeKey="sequence-layernorm"
          codeRef={runtimeCodeRefs['sequence-layernorm']}
          onCodeRef={onCodeRef}
          title="마지막 feature slice에서만 mean과 variance를 계산"
        >
          Scalar Value 배열 하나가 한 <code>(b,t)</code> 위치의 D축 slice라는 입력 계약을 코드와 본문에 함께 고정한다.
        </CodeEvidence>
      </section>

      <section id="dropout-embedding" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="05"
          kicker="무작위성과 희소성"
          promise="Dropout이 보존하는 기댓값과 Embedding이 반복 token gradient를 합치는 경로를 같은 autodiff 원리로 확인합니다."
        >
          Forward에서 선택한 mask와 row가 backward의 경로를 결정한다
        </SectionTitle>
        <Prose>
          <p>
            Inverted dropout은 train mode에서 Bernoulli mask를 뽑고 남은 값에 <code>1/(1-p)</code>를 곱한다. 한 번의
            output을 입력과 같게 만드는 것이 아니라 mask에 대한 기댓값을 같게 한다. Eval mode에서는 mask를 뽑지 않고
            입력을 그대로 보낸다. Dropout이 모든 데이터에서 overfitting을 막는다는 보장은 없으며 regularization 선택이다.
          </p>
          <p>
            Embedding은 materialized one-hot vector와 dense matrix multiply를 피하고 token id가 가리키는 row만 읽는다.
            <code>[4,1,4]</code>처럼 id가 반복되면 두 위치가 같은 row Value를 사용한다. Backward에서 row 4에 온 두
            contribution을 더해야 한다. 이는 별도 마법이 아니라 앞 글에서 만든 공유 DAG accumulation과 같은 규칙이다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{\tilde x}_{\text{train-mode output}}
            =
            \frac{
              \underbrace{m}_{\text{Bernoulli keep mask}}
              \odot
              \underbrace{x}_{\text{입력}}
            }{
              \underbrace{1-p}_{\text{keep 확률}}
            },
            \qquad
            \underbrace{\mathbb E_m[\tilde x]}_{\text{mask 평균 output}}
            =
            x
          `}
          latexCompact={String.raw`\begin{gathered}
            \underbrace{\tilde x=\dfrac{m\odot x}{1-p}}_{\text{keep한 값을 재조정}}\\[5pt]
            \underbrace{\mathbb E_m[\tilde x]=x}_{\text{평균 크기 보존}}
          \end{gathered}`}
          meaning="각 원소는 확률 1-p로 남고 남은 값은 1/(1-p)배 된다. 제거된 경우 0, 남은 경우 커진 값을 평균하면 원래 입력이 된다. 개별 forward가 아니라 mask에 대한 기대값 계약이다."
          symbols={[
            [String.raw`m`, '각 원소를 남길지 정하는 0 또는 1 mask'],
            [String.raw`p`, '원소를 제거할 확률'],
            [String.raw`1-p`, '원소를 보존할 확률'],
            [String.raw`\mathbb E_m`, '가능한 dropout mask들에 대해 평균'],
          ]}
        />
        <Formula
          latex={String.raw`
            \underbrace{\nabla W_r}_{\text{row r의 전체 gradient}}
            =
            \sum_{k:\,i_k=r}
            \underbrace{\nabla y_k}_{\text{token 위치 k에서 온 기여}}
          `}
          meaning="같은 token row r을 읽은 모든 위치 k의 gradient를 합한다. [4,1,4]에서 모든 upstream gradient가 1이면 row 4는 2, row 1은 1, 읽지 않은 row는 0이다."
          symbols={[
            [String.raw`W_r`, 'vocabulary embedding matrix의 r번째 row'],
            [String.raw`i_k`, 'sequence 위치 k의 token id'],
            [String.raw`y_k`, '위치 k에서 lookup한 embedding vector'],
            ['scatter-add', '선택된 row 위치로 gradient를 흩어 보내되 반복 row에서는 더하는 연산'],
          ]}
        />
        <SequenceStateLab />
        <CodeEvidence
          codeKey="sequence-dropout"
          codeRef={runtimeCodeRefs['sequence-dropout']}
          onCodeRef={onCodeRef}
          title="Dropout의 keep mask와 scale이 같은 graph를 만드는 코드"
        >
          Contract test는 p=0.5에서 output 0과 4의 평균이 input 2가 되는지 확인한다.
        </CodeEvidence>
        <CodeEvidence
          codeKey="sequence-embedding"
          codeRef={runtimeCodeRefs['sequence-embedding']}
          onCodeRef={onCodeRef}
          title="반복 token이 같은 row handle을 clone하는 lookup"
        >
          <code>[4,1,4]</code>의 row 4 gradient가 정확히 2로 누적되는 실행 test까지 연결된다.
        </CodeEvidence>
        <CapabilityCheck items={[
          'Reset과 detach가 state data와 graph 수명에 미치는 차이를 설명할 수 있다.',
          'LSTM cell 직접 경로의 gradient가 forget gate 곱임을 계산할 수 있다.',
          'B×T×D에서 LayerNorm의 통계 축을 표시할 수 있다.',
          'γ=1, β=0이어도 LayerNorm 전체가 identity가 아닌 이유를 말할 수 있다.',
          'Inverted dropout이 개별 값이 아닌 기댓값을 보존함을 계산할 수 있다.',
          '반복 token의 embedding gradient가 같은 row에 합산되는 경로를 추적할 수 있다.',
        ]} />
        <StopRule>
          이 구현 경로는 여기서 sequence state, normalization과 sparse lookup의 핵심 계약을 닫는다. Transformer 전체를
          이 scalar crate 안에 계속 붙이지 않는다. 다음에는 tensor shape와 attention을 별도 경로에서 읽는다.
        </StopRule>
        <Prose>
          <p>
            LSTM 자체를 더 깊게 읽으려면 <InternalLink slug="lstm">LSTM 구조</InternalLink>와{' '}
            <InternalLink slug="paper-lstm-1997">1997년 원 논문</InternalLink>으로 간다. 현대 sequence 모델로 이어가려면{' '}
            <InternalLink slug="attention-theory">Attention 이론</InternalLink>에서 query가 memory를 직접 검색하는
            방식으로 넘어간다.
          </p>
        </Prose>
        <SourceNotes sources={[
          {
            label: 'Long Short-Term Memory (1997)',
            href: 'https://gwern.net/doc/ai/nn/rnn/1997-hochreiter.pdf',
            note: 'Error flow와 constant error carousel을 제안한 원 논문. 현대 forget gate 표기와는 구분해 읽어야 한다.',
          },
          {
            label: 'Layer Normalization',
            href: 'https://arxiv.org/abs/1607.06450',
            note: '한 training case 내부 hidden unit 통계와 adaptive gain·bias를 정의한 원 논문.',
          },
          {
            label: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',
            href: 'https://jmlr.csail.mit.edu/papers/v15/srivastava14a.html',
            note: 'Dropout training과 model averaging 관점의 원문. 이 글은 inverted scaling 구현을 별도로 명시한다.',
          },
          {
            label: 'PyTorch Embedding API',
            href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.modules.sparse.Embedding.html',
            note: 'Lookup table의 공식 동작과 padding_idx, sparse gradient 등 production 옵션. 교육용 구현은 핵심 lookup만 다룬다.',
          },
        ]} />
      </section>
    </>
  );
}
