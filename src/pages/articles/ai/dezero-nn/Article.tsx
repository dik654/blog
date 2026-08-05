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
import TrainingContractLab from './TrainingContractLab';
import { runtimeCodeRefs } from '../dezero-shared/runtimeCodeRefs';
import { CodeEvidence, Formula, Prose, SectionTitle } from '../dezero-shared/ArticleFrame';

export default function NnArticle({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <section id="overview" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="01"
          kicker="소유권 계약"
          promise="수식의 W와 b가 코드에서 정확히 한 parameter identity로 남고, 모델이 그것을 빠짐없이 열거하는 구조부터 세웁니다."
        >
          Layer는 계산만 하지 않는다. 학습할 상태의 소유자를 밝혀야 한다
        </SectionTitle>
        <QuestionLead
          question="Forward 값은 맞는데 optimizer가 어떤 weight는 두 번 바꾸고 어떤 weight는 전혀 바꾸지 않는다면 어느 경계가 잘못된 것일까?"
          answer="Layer의 parameter 열거와 optimizer의 identity 처리 경계가 잘못된 것이다. Model은 forward 실행 순서뿐 아니라 자신이 소유한 모든 Parameter handle을 안정된 순서로 노출해야 하며, 공유된 handle은 한 번만 update해야 한다."
        />
        <ConceptPrimer items={[
          {
            term: 'Parameter',
            meaning: 'Optimizer가 갱신할 trainable Value를 구분하는 wrapper다.',
            why: '일반 activation과 학습 상태를 같은 graph에서 계산하되 갱신 대상은 명확히 분리한다.',
          },
          {
            term: 'Layer',
            meaning: '입력 shape를 검사하고 output Value graph를 만드는 계산 단위다.',
            why: 'Forward와 parameter ownership을 함께 노출하는 최소 경계가 된다.',
          },
          {
            term: 'Parameter identity',
            meaning: '숫자가 같은지가 아니라 같은 allocation을 가리키는지다.',
            why: 'Weight tying처럼 한 parameter를 여러 경로에서 쓸 때 gradient는 합치고 update는 한 번만 해야 한다.',
          },
          {
            term: 'Optimizer state',
            meaning: 'Parameter별 gradient history나 moment를 보존하는 별도 상태다.',
            why: 'Adam 같은 optimizer는 parameter 순서 또는 stable id와 state의 대응을 끝까지 유지해야 한다.',
          },
        ]} />
        <Prose>
          <p>
            Rust trait가 parameter 누락을 컴파일 시점에 자동으로 잡아 주지는 않는다. 이 예제의
            <code>parameters()</code>를 사람이 잘못 구현하면 코드가 컴파일돼도 weight가 학습되지 않는다. 따라서 trait는
            책임을 표현하고, 실행 test가 “모든 layer parameter가 한 번씩 갱신되는가”를 검증해야 한다.
          </p>
          <p>
            이 글은 save/load, mixed precision, GPU device 이동까지 일반화하지 않는다. 앞 글에서 만든 scalar
            <code>Value</code> 위에 deterministic한 <code>Linear</code> 세 층을 쌓아 소유권, shape, loss와 한 SGD step의
            연결을 끝까지 실행하는 데 집중한다.
          </p>
        </Prose>
        <Misconception>
          Parameter 두 개의 data가 우연히 같다고 같은 parameter가 아니다. 반대로 같은 handle이 모델 목록에 두 번 나타나도
          두 parameter가 아니다. Optimizer는 값 비교가 아니라 stable identity로 중복을 제거해야 한다.
        </Misconception>
      </section>

      <section id="linear" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="02"
          kicker="Shape와 forward"
          promise="2→3→2→1 network의 각 경계에서 입력 길이를 확인하고 xW+b가 실제 autodiff graph를 만드는 과정을 읽습니다."
        >
          Linear의 첫 번째 일은 matrix multiply가 아니라 shape 계약 확인이다
        </SectionTitle>
        <Prose>
          <p>
            Batch를 생략한 한 sample에서 입력은 길이 <code>D_in</code>인 Value 배열이다. Weight는 개념적으로
            <code>D_in×D_out</code>, bias는 <code>D_out</code>이다. 이 예제는 broadcasting을 제공하지 않으므로 입력 길이가
            다르면 즉시 panic한다. 조용한 shape 보정은 작은 데모를 편하게 만들지만 뒤 layer에서 의미가 뒤틀린 오류를 늦게
            발견하게 한다.
          </p>
          <p>
            각 output feature는 bias Value에서 시작해 <code>x_i·W_ij</code>를 더한다. 새 연산을 위한 backward를
            Linear 안에 다시 쓰지 않는다. 앞 글의 <code>mul</code>과 <code>add</code>를 합성했기 때문에 gradient graph도
            같은 operation들로 자동 구성된다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{y_j}_{\text{j번째 출력 feature}}
            =
            \underbrace{b_j}_{\text{출력별 bias}}
            +
            \sum_{i=1}^{D_{\mathrm{in}}}
            \underbrace{x_i}_{\text{입력 feature}}
            \underbrace{W_{ij}}_{\text{i에서 j로 가는 weight}}
          `}
          meaning="각 output feature는 모든 input feature의 weighted sum에 자신의 bias를 더한다. 입력 길이와 weight의 첫 축이 다르면 이 합 자체가 정의되지 않으므로 forward 시작 전에 shape를 검사한다."
          symbols={[
            [String.raw`D_{\mathrm{in}}`, '입력 feature 수'],
            [String.raw`x_i`, 'i번째 입력 Value'],
            [String.raw`W_{ij}`, '입력 i가 출력 j에 미치는 trainable scale'],
            [String.raw`b_j`, '입력과 무관한 j번째 출력 offset'],
          ]}
        />
        <CodeEvidence
          codeKey="nn-linear"
          codeRef={runtimeCodeRefs['nn-linear']}
          onCodeRef={onCodeRef}
          title="Shape assert부터 xW+b graph 합성까지 한 구현에서 확인"
        >
          <code>Linear::forward</code>는 숫자 array를 따로 계산하지 않고 Parameter Value를 그대로 연산에 넣는다.
        </CodeEvidence>
      </section>

      <section id="activation" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="03"
          kicker="합성과 비선형성"
          promise="Layer 사이에 operation을 합성하는 법과, 이 예제에서 일부러 activation을 생략한 이유를 구분합니다."
        >
          자동 미분의 장점은 새 모델을 만들 때 backward를 다시 쓰지 않는 데 있다
        </SectionTitle>
        <Prose>
          <p>
            ReLU, sigmoid, tanh를 넣어도 원리는 같다. 각 함수가 output Value와 local backward 규칙을 제공하면 layer는
            forward graph만 조합한다. 다만 “sigmoid 출력은 항상 확률”은 틀리다. 값이 0과 1 사이일 뿐, 확률로 해석하려면
            loss와 데이터 생성 가정이 함께 필요하다. GELU도 모든 Transformer의 필수 표준이 아니라 모델 설계가 선택하는
            activation 중 하나다.
          </p>
          <p>
            실행 test의 2→3→2→1 network는 소유권과 update 순서만 격리하기 위해 activation을 생략했다. 그러면 세 Linear를
            합친 전체 함수는 여전히 Linear이므로 표현력 예제로는 부족하지만, 어느 parameter에 gradient가 가는지를 숫자로
            추적하기 쉽다. 비선형성의 필요는{' '}
            <InternalLink slug="activation-functions">활성화 함수</InternalLink>에서 별도 증명한다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{h}_{\text{다음 layer 입력}}
            =
            \underbrace{\phi}_{\text{비선형 변환}}
            \!\left(
              \underbrace{Wx+b}_{\text{Linear가 만든 pre-activation}}
            \right)
          `}
          meaning="Linear 결과에 nonlinear activation을 적용해야 여러 층을 쌓은 함수가 하나의 Linear map으로 접히지 않는다. Autodiff 관점에서는 φ도 입력과 output을 잇는 operation 하나다."
          symbols={[
            [String.raw`Wx+b`, 'activation 직전의 pre-activation'],
            [String.raw`\phi`, 'ReLU, sigmoid, tanh 같은 nonlinear operation'],
            [String.raw`h`, '다음 layer로 넘어가는 hidden representation'],
            ['합성', 'Linear와 activation의 backward를 따로 호출하지 않고 graph가 역순으로 연결'],
          ]}
        />
      </section>

      <section id="optimizer" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="04"
          kicker="Gradient 소비"
          promise="Gradient를 만드는 backward와 parameter data를 바꾸는 optimizer의 책임을 분리하고, 중복 handle을 한 번만 갱신합니다."
        >
          Backward는 기울기를 만들고 optimizer만 parameter를 바꾼다
        </SectionTitle>
        <Prose>
          <p>
            이 분리를 지키면 같은 gradient에 SGD, momentum, Adam을 바꿔 끼울 수 있다. SGD는 현재 gradient만 쓴다.
            Adam은 parameter별 1차·2차 moment를 유지하므로 더 강한 불변식이 필요하다. 단순 배열
            <code>m[i], v[i]</code>를 쓴다면 매 step의 parameter 순서가 같아야 한다. Production 구현에서는 stable
            parameter id에 state를 매핑하는 편이 layer 재배치에 안전하다.
          </p>
          <p>
            여기의 실행 코드는 상태 대응 문제를 숨기지 않기 위해 SGD만 완결한다. Adam의 lazy initialization,
            shape 변경과 checkpoint 직렬화는 이 글에서 구현하거나 설명했다고 주장하지 않는다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{\theta_{t+1}}_{\text{갱신된 parameter}}
            =
            \underbrace{\theta_t}_{\text{현재 data}}
            -
            \underbrace{\eta}_{\text{learning rate}}
            \underbrace{\nabla_\theta L}_{\text{backward가 누적한 gradient}}
          `}
          meaning="SGD는 현재 parameter data에서 loss가 가장 빠르게 증가하는 gradient 방향의 반대로 작은 step을 이동한다. 같은 parameter handle이 목록에 두 번 있어도 이 갱신은 한 번만 실행해야 한다."
          symbols={[
            [String.raw`\theta_t`, 't번째 step 직전 parameter 값'],
            [String.raw`\nabla_\theta L`, '현재 batch loss가 parameter에 남긴 gradient'],
            [String.raw`\eta`, '한 step의 이동 크기를 정하는 learning rate'],
            ['중복 제거', '동일 Rc allocation을 가리키는 Parameter는 한 번만 update'],
          ]}
        />
        <CodeEvidence
          codeKey="nn-unique"
          codeRef={runtimeCodeRefs['nn-unique']}
          onCodeRef={onCodeRef}
          title="Parameter identity로 zero_grad와 update의 중복을 제거"
        >
          같은 handle을 두 번 전달한 test에서 gradient는 2로 합쳐지지만 SGD data update는 한 번만 적용된다.
        </CodeEvidence>
        <CodeEvidence
          codeKey="nn-step"
          codeRef={runtimeCodeRefs['nn-step']}
          onCodeRef={onCodeRef}
          title="Optimizer는 graph를 만들지 않고 현재 data를 갱신"
        >
          Parameter enumeration 순서와 optimizer state가 연결되는 위치를 작은 SGD 구현에서 먼저 고정한다.
        </CodeEvidence>
      </section>

      <section id="training" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="05"
          kicker="완전한 한 step"
          promise="zero_grad → forward → loss → backward → step → 새 forward 순서를 실행하고, 손실이 실제로 감소하는지 확인합니다."
        >
          학습은 함수 목록이 아니라 상태가 바뀌는 순서다
        </SectionTitle>
        <Prose>
          <p>
            첫 단계는 이전 batch gradient를 지우는 일이다. 이를 빼면 새 gradient가 틀렸다기보다 “여러 batch를
            의도적으로 누적한다”는 다른 알고리즘이 된다. 다음으로 새 parameter data에서 forward와 loss graph를 만들고
            backward한다. Optimizer step 뒤에는 같은 output graph를 다시 읽지 않고 새 forward로 loss를 측정한다.
          </p>
          <p>
            MSE는 <code>sub → pow → add → div</code>의 합성이다. “회귀의 표준이라 항상 옳다”가 아니라 Gaussian noise와
            outlier cost에 관한 선택이다. 이 글에서는 작은 deterministic regression contract라서 MSE를 사용한다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{L_{\mathrm{MSE}}}_{\text{평균 제곱 오차}}
            =
            \frac{1}{N}
            \sum_{n=1}^{N}
            \underbrace{(\hat y_n-y_n)^2}_{\text{sample n의 제곱 오차}}
          `}
          meaning="예측과 target의 차이를 제곱해 부호를 없애고 큰 오차를 더 강하게 벌한 뒤 sample 수로 평균낸다. 이 구현에서는 기존 scalar operation만 합성하므로 별도 MSE backward 코드가 없다."
          symbols={[
            [String.raw`\hat y_n`, '모델이 만든 n번째 예측'],
            [String.raw`y_n`, 'n번째 target'],
            [String.raw`N`, '평균에 포함한 output 수'],
            ['제곱', '오차 부호를 없애고 큰 오차의 영향력을 키우는 선택'],
          ]}
        />
        <TrainingContractLab />
        <CodeEvidence
          codeKey="nn-tests"
          codeRef={runtimeCodeRefs['nn-tests']}
          onCodeRef={onCodeRef}
          title="2→3→2→1 전체 loop와 loss 감소를 실행 test로 확인"
        >
          Shape failure, 중복 parameter 갱신과 zero_grad까지 각각 독립 test로 남긴다.
        </CodeEvidence>
        <CapabilityCheck items={[
          'Layer의 forward 책임과 parameter ownership 책임을 구분할 수 있다.',
          '값이 같은 parameter와 identity가 같은 parameter를 구분할 수 있다.',
          'Linear의 input, weight, bias와 output shape를 계산할 수 있다.',
          'zero_grad, forward, backward, step의 순서를 재구성할 수 있다.',
          'Optimizer state가 parameter 순서에 묶일 때 생기는 위험을 설명할 수 있다.',
          '한 SGD step 뒤 loss를 새 graph에서 다시 측정해야 하는 이유를 말할 수 있다.',
        ]} />
        <StopRule>
          이 글은 scalar Value 배열과 SGD로 학습 상태의 경계를 증명한다. Tensor broadcasting, batch matrix kernel, Adam
          checkpoint와 GPU 실행까지 확장하지 않는다. 다음 글에서는 시간 state, 통계 축과 sparse lookup이 이 경계를
          어떻게 더 어렵게 만드는지 다룬다.
        </StopRule>
        <Prose>
          <p>
            앞의 graph 순회가 불명확하면{' '}
            <InternalLink slug="dezero-autodiff" learningPathId="ai-from-scratch-rust">
              자동 미분 엔진 구현
            </InternalLink>
            으로 돌아간다. 이어서{' '}
            <InternalLink slug="dezero-advanced" learningPathId="ai-from-scratch-rust">
              LSTM · 정규화 · Embedding 구현
            </InternalLink>
            에서 state와 axis를 추가한다.
          </p>
        </Prose>
        <SourceNotes sources={[
          {
            label: 'DeZero 공식 Layer 구현',
            href: 'https://github.com/oreilly-japan/deep-learning-from-scratch-3/blob/master/dezero/layers.py',
            note: 'Python 원전의 Layer, Parameter 탐색과 Linear 설계를 행동 참조로 사용했다.',
          },
          {
            label: 'Adam: A Method for Stochastic Optimization',
            href: 'https://arxiv.org/abs/1412.6980',
            note: '1차·2차 moment, bias correction과 parameter별 optimizer state의 원문.',
          },
          {
            label: 'Rust std::rc::Rc',
            href: 'https://doc.rust-lang.org/book/ch15-04-rc.html',
            note: 'Single-threaded shared ownership과 clone이 같은 allocation의 reference count를 늘리는 계약.',
          },
        ]} />
      </section>
    </>
  );
}
