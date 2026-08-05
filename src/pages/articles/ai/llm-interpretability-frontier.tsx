import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
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
import { articlePath } from '@/lib/paths';
import {
  EvidenceLadderExplorer,
  JacobianLensPipelineViz,
  JSpaceDecompositionLab,
  JSpaceEvidenceLab,
  LayerRegimeExplorer,
} from './llm-interpretability-frontier/viz/InterpretabilityFrontierViz';

function RouteRow({ number, slug, title, question }: { number: string; slug: string; title: string; question: string }) {
  return (
    <Link
      to={articlePath('ai', slug)}
      className="group grid min-w-0 gap-2 border-b border-border px-1 py-5 transition-colors last:border-b-0 hover:bg-muted/20 sm:grid-cols-[3rem_11rem_minmax(0,1fr)_auto] sm:items-start sm:px-2"
    >
      <span className="font-mono text-xs font-black text-muted-foreground">{number}</span>
      <span className="text-sm font-black">{title}</span>
      <span className="text-sm leading-relaxed text-muted-foreground">{question}</span>
      <span className="hidden text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block">→</span>
    </Link>
  );
}

export default function LlmInterpretabilityFrontierArticle() {
  return (
    <>
      <section id="current-question" className="mb-16 scroll-mt-20">
        <div className="not-prose mb-5 flex items-end gap-4 border-b border-border pb-4">
          <span className="font-mono text-4xl font-black leading-none text-muted-foreground/45 sm:text-5xl">2026</span>
          <div className="min-w-0 pb-0.5">
            <p className="text-xs font-black uppercase text-muted-foreground">Interpretability frontier</p>
            <p className="mt-1 text-sm font-bold">읽히는 내부 상태에서 검증된 mechanism까지</p>
          </div>
        </div>
        <h2 className="mb-6 text-2xl font-bold">내부에서 흔적을 찾으면 답을 만든 이유까지 안 것일까?</h2>
        <BeginnerOpening
          title="읽힌 흔적과 실제로 사용한 이유는 다르다"
          description={<>언어 모델은 문장을 처리할 때 층마다 아주 긴 숫자 묶음을 남긴다. 해석 도구는 이 숫자에서 사람이 알아볼 수 있는 단어나 특징을 읽는다. 이렇게 <strong>읽어 낸 결과</strong>가 readout이고, 내부 숫자를 직접 바꾼 뒤 답이 달라지는지 보는 실험이 intervention이다.</>}
          familiarScene={<>학생의 풀이 메모에서 ‘마찰력’이라는 단어를 찾았다고 하자. 그 단어가 적혀 있다는 사실만으로 학생이 실제로 마찰력을 사용해 답을 냈다고 단정할 수는 없다. 해당 계산을 지웠을 때 답이 바뀌고, 관계없는 계산을 지웠을 때는 유지되는지 비교해야 원인에 더 가까워진다.</>}
          steps={[
            { label: '흔적을 읽는다', detail: '어느 층과 위치에서 어떤 정보가 보이는지 기록한다.' },
            { label: '같은 위치를 바꾼다', detail: '읽힌 방향을 넣거나 빼고 최종 답의 변화를 측정한다.' },
            { label: '다른 원인을 비교한다', detail: '무작위 방향과 다른 문장을 대조해 우연한 변화를 걷어낸다.' },
          ]}
        />
        <QuestionLead
          question="중간 layer에서 어떤 개념이 읽히고 그 방향을 바꾸자 최종 결론도 변했다면, 어디까지 실제 추론에 쓰인 개념이라고 말할 수 있을까?"
          answer="한 번의 readout이나 swap만으로는 부족하다. 무엇을 읽은 것인지 먼저 정의하고, 최종 답을 몰래 주입한 효과가 아닌지 layer timing으로 비교한다. 같은 크기의 다른 방향, random direction, 다른 prompt를 대조군으로 두고, 바꾼 개념이 다시 읽히는 경로까지 막았을 때도 효과의 구조가 유지돼야 주장 범위를 넓힐 수 있다."
        />
        <ConceptPrimer
          items={[
            { term: 'Residual stream', meaning: '각 token에서 attention과 MLP가 읽고 update를 더하는 공용 vector 통로다.', why: '어느 layer의 state를 읽고 바꾸는지 공통 좌표를 고정한다.' },
            { term: 'Readout', meaning: 'Activation을 사람이 읽을 token·feature·score로 바꾸는 분석용 map이다.', why: '읽힌 정보와 원 모델이 실제 사용한 계산을 분리한다.' },
            { term: 'Jacobian', meaning: '입력 vector를 조금 움직였을 때 downstream vector가 어느 방향으로 얼마나 변하는지 나타내는 국소 선형 map이다.', why: '중간 state가 미래 출력에 미치는 평균적인 방향을 만든다.' },
            { term: 'J-space', meaning: '적은 수의 J-lens token direction을 양수 계수로 합쳐 표현할 수 있는 activation 영역이다.', why: 'Vocabulary로 읽히는 작은 부분과 나머지 내부 표현을 분리한다.' },
            { term: 'Intervention', meaning: '내부 state를 직접 바꾸고 output metric 변화를 측정하는 실험이다.', why: '상관 관찰을 제한된 causal claim으로 올린다.' },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Mechanistic interpretability</strong>는 모델이 무엇을 출력했는지만 설명하지 않는다. 그 출력을 만든 내부 계산을 component,
            representation, connection과 intervention으로 복원하려 한다. 하지만 사람이 읽기 쉬운 표현과 원 모델의 실제 mechanism을 충실히
            재현한 설명은 같은 목표가 아니다.
          </p>
          <p>
            2026년의 변화는 hidden state에 더 그럴듯한 이름을 붙였다는 데 있지 않다. <strong>Jacobian lens</strong>는 중간 activation을
            vocabulary로 읽는 map을 downstream derivative에서 만들고, 같은 direction을 빼고 넣는 개입까지 연결했다. 연구진은 여기서 읽히는 작은
            영역을 <strong>J-space</strong>라 부르고 verbal report, 중간 추론, 여러 함수에 대한 재사용과 선택적 사용을 각각 실험했다.
          </p>
        </div>
      </section>

      <section id="evidence-ladder" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">관찰, 분해, attribution과 원인을 한 문장으로 섞지 않기</h2>
        <EvidenceLadderExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention map은 query가 어느 position의 value를 얼마나 섞었는지 보여 준다. Vocabulary lens는 중간 residual state에서 token 방향을
            읽는다. SAE는 dense activation을 적은 수의 learned direction으로 근사한다. 셋 모두 유용하지만 첫 결론은 <strong>무엇이 관찰되거나
            읽히는가</strong>이다.
          </p>
          <p>
            Attribution graph는 output으로 이어질 가능성이 큰 경로를 좁힌다. Activation patching은 clean run의 state를 corrupted run으로 옮겨
            behavior가 복구되는지 본다. 개입이 예상과 일치하면 causal evidence가 강해지지만, 한 prompt의 한 patch가 모델 전체의 보편적 circuit을
            증명하지는 않는다.
          </p>
        </div>
        <Misconception>
          “Interpretability tool이 표시했다”는 문장은 증거 종류가 빠져 있다. Attention weight인지, trained probe인지, sparse feature인지,
          replacement-model attribution인지, 원 모델 intervention인지 먼저 밝혀야 한다.
        </Misconception>
      </section>

      <section id="jacobian-lens" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Jacobian lens는 남은 Transformer를 어떻게 한 map으로 줄일까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Layer <M>{String.raw`\ell`}</M>의 position <M>t</M>에 있는 residual state를 <M>{String.raw`h_{\ell,t}`}</M>라 하자. 이 state는 남은
            attention과 MLP를 지난 뒤 현재 또는 미래 position <M>{String.raw`t'\ge t`}</M>의 분석 target residual
            <M>{String.raw`h_{\mathrm{target},t'}`}</M>에 영향을 준다. 한 prompt에서 계산한 Jacobian은 일반적인 전달 성질과 그 문맥에서 우연히
            사용된 경로를 함께 담는다. 그래서 원문은
            position 안팎과 여러 prompt에 걸쳐 Jacobian을 평균한다.
          </p>
        </div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
          <M display className="my-0 text-sm sm:text-base">
            {String.raw`\begin{aligned}
            \underbrace{J_\ell}_{\text{층 }\ell\text{의 평균 전달 사상}}
            &=
            \underbrace{\mathbb E_{\text{질문},\,t,\,t'\ge t}}_{\text{여러 문맥과 위치를 평균}}
            \\[-1mm]
            &\quad\left[
            \underbrace{\frac{\partial h_{\mathrm{target},t'}}{\partial h_{\ell,t}}}_{\substack{\text{중간 상태가}\\\text{target 상태에 주는 국소 변화}}}
            \right]
            \end{aligned}`}
          </M>
        </div>
        <FormulaNote
          meaning="왜 미분하나: 현재 activation을 조금 움직였을 때 미래 target residual이 변하는 국소 방향과 크기를 얻기 위해서다. 왜 미래 position t′까지 포함하나: 지금 position의 정보가 바로 다음 token뿐 아니라 뒤에 verbalize될 내용에도 영향을 줄 수 있기 때문이다. 왜 여러 prompt에서 평균하나: 한 context에만 나타난 사용 경로보다 반복되는 전달 좌표를 얻기 위해서다."
          symbols={[
            [String.raw`h_{\ell,t}`, 'Layer ℓ, source position t의 residual vector'],
            [String.raw`h_{\mathrm{target},t'}`, '분석 recipe가 고른 target layer, 현재 또는 미래 position t′의 residual vector'],
            [String.raw`J_\ell`, 'Layer ℓ에서 target residual 좌표로 가는 sample-averaged Jacobian'],
            ['경계', '평균 map은 특정 prompt의 정확한 비선형 forward pass가 아니다'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Target layer는 방법의 고정 상수가 아니라 recipe 선택이다. 공개된 Sonnet 4.5 기본 recipe는 마지막 block이 더하는 noise를 피하려고
            <strong> penultimate residual</strong>을 target <M>{String.raw`z`}</M>로 쓴다. Final residual을 쓰는 변형도 가능하지만, 어느 target을
            골랐는지와 그 선택을 바꿨을 때 readout이 유지되는지를 구현 기록에 남겨야 한다.
          </p>
        </div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
          <M display className="my-0 text-sm sm:text-base">
            {String.raw`\begin{aligned}
            \underbrace{\widetilde h_{\ell,t}}_{\text{최종 좌표의 근사}}
            &=
            \underbrace{J_\ell h_{\ell,t}}_{\text{남은 층의 평균 영향}}
            \\
            \underbrace{z_v}_{\text{토큰 }v\text{의 점수}}
            &=
            \left(
            \underbrace{W_U}_{\text{어휘 좌표 변환}}
            \underbrace{\operatorname{norm}(\widetilde h_{\ell,t})}_{\text{최종 층의 크기 규칙}}
            \right)_v
            \\
            \underbrace{p_\ell(v)}_{\text{중간 상태의 토큰 판독}}
            &=
            \underbrace{\operatorname{softmax}(z)_v}_{\text{점수를 토큰 분포로 정규화}}
            \end{aligned}`}
          </M>
        </div>
        <FormulaNote
          meaning="왜 Jℓ를 먼저 곱하나: 중간 layer와 final layer의 representation 좌표가 다르므로 남은 계산의 평균적인 변화를 반영한다. 왜 원 모델의 norm과 WU를 쓰나: final state가 실제 token logit으로 바뀌는 출력 계약을 그대로 재사용하기 위해서다. Softmax 결과는 token별 readout score이지, 그 token이 원인일 확률이나 모델의 완전한 생각일 확률이 아니다."
          symbols={[
            [String.raw`W_U`, 'Final residual direction을 vocabulary logit으로 바꾸는 unembedding matrix'],
            [String.raw`z_v`, '정규화와 unembedding 뒤 얻은 token v의 logit'],
            [String.raw`p_\ell(v)`, 'Layer ℓ activation을 token v 방향으로 읽은 normalized score'],
            ['Logit lens', 'Jℓ=I라고 두고 중간 state를 final coordinates로 바로 읽는 기준선'],
            ['Tuned lens', 'Output prediction을 맞추도록 layer별 affine map을 따로 학습하는 probe'],
          ]}
        />
        <JacobianLensPipelineViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Logit lens는 모든 layer가 final layer와 같은 좌표를 쓴다고 가정한다. Tuned lens는 layer별 predictor를 학습하지만 output을 잘 맞추는
            correlational objective가 중간 계산보다 답을 일찍 읽는 shortcut을 만들 수 있다. J-lens는 평균 derivative에서 map을 만들기 때문에
            downstream에 영향을 줄 방향을 직접 반영하지만, 여전히 <strong>평균된 1차 근사</strong>이다.
          </p>
          <p>
            따라서 J-lens 상위 token은 literal hidden sentence가 아니다. “이 activation이 여러 context에서 나중에 해당 token을 말하게 할
            잠재 방향과 정렬된다”가 더 정확한 읽기다. Lens family의 계산과 차이는 <InternalLink slug="llm-interpretability-readouts">Layer
            Readout</InternalLink>에서 단계별로 내려간다.
          </p>
          <p>
            평균 map은 만든 분포에도 묶인다. Prompt 형식, 언어, task 또는 model checkpoint가 바뀌면 평균 Jacobian이 포착한 전달 방향도 달라질
            수 있다. 따라서 한 corpus에서 만든 <M>{String.raw`J_\ell`}</M>를 다른 분포에 그대로 적용할 때는 readout 정확도와 intervention 효과를
            다시 측정해야 한다. 이 검증 없이 “layer의 보편 좌표”라고 부르면 분포 이동을 mechanism으로 오해한다.
          </p>
        </div>
      </section>

      <section id="j-space" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">J-space는 모델의 생각 전체가 아니라 어떤 작은 부분일까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            각 vocabulary token은 layer마다 residual stream 안의 J-lens direction 하나를 갖는다. Vocabulary 크기는 hidden width보다 크므로 이
            direction 집합은 <strong>overcomplete</strong>하다. 같은 activation을 여러 direction 조합으로 표현할 수 있어 일반적인 basis처럼
            유일한 좌표가 생기지 않는다.
          </p>
          <p>
            원문은 많은 direction을 모두 허용하지 않고, 최대 <M>k</M>개의 direction만 양수 계수로 골라 activation을 근사한다. 이렇게 얻는 sparse
            nonnegative component를 J-space 부분으로, 설명되지 않은 차이를 non-J-space 부분으로 둔다.
          </p>
        </div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
          <M display className="my-0 text-sm sm:text-base">
            {String.raw`\begin{aligned}
            \underbrace{\mathcal J_\ell^{(k)}}_{\text{층 }\ell\text{의 희소 J-공간}}
            =
            \Bigl\{\,
            &\sum_{i\in S}\alpha_i v_{\ell,i}
            \;\bigm|\;
            \\[-1mm]
            &\underbrace{\alpha_i\ge 0}_{\text{켜진 방향만 더함}},
            \quad
            \underbrace{|S|\le k}_{\text{방향 수를 제한}}
            \,\Bigr\}
            \end{aligned}`}
          </M>
        </div>
        <FormulaNote
          meaning="왜 sparse하게 고르나: overcomplete vocabulary direction을 제한 없이 쓰면 거의 모든 activation을 여러 방식으로 설명해 J-space가 의미 없는 전체 공간이 되기 때문이다. 왜 음수 계수를 막나: 한 concept direction을 반대로 쓰는 조합보다 현재 켜진 concept들의 양수 조합으로 local inventory를 읽기 위해서다. k는 자연법칙이 아니라 분석자가 정하는 근사 상한이며 원문은 보통 25 이하를 사용한다."
          symbols={[
            [String.raw`v_{\ell,i}`, 'Layer ℓ에서 token i가 verbalize될 잠재 방향'],
            [String.raw`\alpha_i`, '선택된 direction의 local activation coefficient'],
            [String.raw`S`, '현재 activation을 설명하기 위해 고른 token direction 집합'],
            [String.raw`k`, '허용할 nonzero direction 수'],
          ]}
        />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
          <M display className="my-0 text-sm sm:text-base">
            {String.raw`\begin{aligned}
            \underbrace{h_{\ell,t}}_{\text{전체 활성값}}
            &=
            \underbrace{\widehat h_{\ell,t}^{J}}_{\substack{\text{gradient pursuit가 찾은}\\\text{희소 근사}}}
            \\[-1mm]
            &\quad+
            \underbrace{\left(h_{\ell,t}-\widehat h_{\ell,t}^{J}\right)}_{h_{\ell,t}^{\mathrm{rem}}\;:\;\text{근사 뒤 남은 부분}}
            \end{aligned}`}
          </M>
        </div>
        <FormulaNote
          meaning="왜 두 부분으로 나누나: concept가 verbalizable direction에 있다는 사실만으로 그 direction이 특별한지 비교할 수 없기 때문이다. 같은 원래 vector의 J-space component와 remainder를 같은 크기로 개입해 어느 부분이 report와 reasoning을 더 강하게 바꾸는지 시험한다. Overcomplete direction의 union of cones는 볼록한 선형 부분공간이 아니므로 gradient pursuit가 전역적으로 가장 가까운 해나 유일한 해를 보장한다고 읽으면 안 된다."
          symbols={[
            [String.raw`\widehat h^J`, 'Gradient pursuit가 찾은 algorithmic sparse nonnegative approximation'],
            [String.raw`h^{\mathrm{rem}}`, '선택된 근사 뒤 남은 차이이며 모든 J-lens direction과 직교한다는 뜻은 아님'],
            ['비유일성', '다른 초기값·탐색 경로·k가 다른 유효 direction 조합을 찾을 수 있음'],
            ['일반 activation 관찰', '원문의 일반 residual activation 근사에서는 J-space 설명량이 layer별로 대체로 10% 아래였음'],
          ]}
        />
        <JSpaceDecompositionLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            작은 variance는 중요하지 않다는 뜻이 아니다. 앞의 10% 아래 수치는 일반 residual activation을 근사한 분포다. 이와 별도로 특정
            concept probe vector를 분해한 실험에서는 J-space 부분이 probe variance의 약 10–15%만 설명하는 경우에도 intermediate swap 효과의
            대부분을 운반할 수 있었다. 모집단과 분모가 다른 두 수치를 하나의 범위로 합치면 안 된다. <strong>얼마나 큰가</strong>와
            <strong>어떤 downstream function이 읽는가</strong>도 서로 다른 측정이다.
          </p>
        </div>
        <Misconception>
          J-space를 activation 전체의 low-dimensional basis로 부르면 안 된다. Token direction은 overcomplete하며, sparsity constraint가 있어야만
          제한된 union of cones가 된다. 대부분의 representation은 이 부분 밖에 남는다.
        </Misconception>
      </section>

      <section id="causal-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">읽은 개념이 실제 계산에 쓰였다는 증거를 어떻게 쌓을까?</h2>
        <JSpaceEvidenceLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>1. 말로 꺼낼 수 있는가</h3>
          <p>
            Sport를 생각한 뒤 말하게 하는 prompt에서 active concept coordinate를 다른 sport로 바꾸면 보고되는 단어가 바뀐다. 하지만 무조건 다음
            token에 그 단어를 밀어 넣는 steering과는 구분해야 한다. 원문은 user turn의 특정 position에 넣은 concept가 introspection을 요구하는
            순간에 주로 보고되고, 그 전에는 즉시 출력되지 않는 position control을 함께 본다.
          </p>
          <h3>2. 말하지 않은 중간값을 바꾸면 결론이 바뀌는가</h3>
          <p>
            Two-hop factual prompt에서 중간 concept를 같은 범주의 다른 concept로 swap하면 target answer가 바뀐다. 원문 보고값은 Haiku 4.5,
            Sonnet 4.5, Opus 4.5에서 각각 54%, 70%, 70%의 top-1 swap 성공이다. 성공하지 않은 trial도 있으므로 “J-space가 모든 reasoning을
            담당한다”는 결론은 아니다.
          </p>
          <p>
            가장 중요한 control은 intermediate direction 안에 answer direction이 우연히 섞였다는 반론이다. 원문은 중간 concept swap과 answer
            swap이 효과를 내는 layer depth를 비교했고, intermediate 효과가 median 약 17% 더 이르게 나타났다. 또 probe를 J-space 부분과 remainder로
            나누어 90개 prompt에서 swap하자 J-space 부분은 61%, remainder는 28%의 answer flip을 만들었다. Remainder가 downstream에서 다시
            J-space로 들어오지 못하게 clamp하면 6%로 내려갔다.
          </p>
          <h3>3. 같은 representation을 여러 함수가 읽는가</h3>
          <p>
            France direction을 China로 바꾼 뒤 capital, language, continent처럼 서로 다른 function을 적용한다. 같은 swap이 함수에 맞는 서로
            다른 결과를 만들면 answer vector 하나를 넣은 것이 아니라 공통 argument representation을 여러 downstream circuit이 읽었다는 증거가
            강해진다. 원문은 192개 trial 중 76개, 두 배 세기의 swap에서는 101개가 target answer를 top-1로 옮겼다. Source concept가 원래
            workspace에 약하게 load된 경우 실패가 몰렸으므로, 실패를 곧바로 concept 부재로 읽으면 안 된다.
          </p>
          <h3>4. 모든 계산이 이 영역을 거치는가</h3>
          <p>
            Spanish passage의 language direction을 French로 바꾸면 language report와 유연한 후속 추론은 French 기준으로 이동한다. 반면 fluent
            Spanish continuation과 중간 language switch 탐지는 그대로 수행될 수 있다. J-space는 모든 token 처리의 필수 버스가 아니라, 보고와
            새로운 조합이 필요한 일부 계산에 선택적으로 관여한다는 경계다.
          </p>
        </div>
        <CapabilityCheck
          title="이 실험을 직접 설계한다면"
          items={[
            'Intermediate swap과 answer swap의 효과가 나타나는 layer timing을 비교한다.',
            'J-space component와 same-norm non-J-space remainder를 별도로 개입한다.',
            'Remainder가 downstream에서 J-space로 재진입하지 못하도록 coordinate를 clamp한다.',
            'Inactive concept, random rotation, unrelated position과 held-out prompt를 대조군으로 둔다.',
          ]}
        />
      </section>

      <section id="layer-regimes" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">초기·중간·마지막 layer에서 같은 readout을 다르게 읽어야 하는 이유</h2>
        <LayerRegimeExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원문이 분석한 모델에서는 대략 첫 3분의 1까지 J-lens readout이 noisy하고 안정적인 추상 내용이 거의 보이지 않았다. 중간 layer band에서는
            concept가 position을 넘어 지속되고 swap과 flexible computation에 사용됐다. 마지막 몇 layer에서는 readout이 실제 next-token prediction과
            급격히 정렬되어 intermediate workspace보다 output을 준비하는 motor representation에 가까워졌다.
          </p>
          <p>
            이 경계는 여러 통계를 함께 보고 잡았다. Top-k token이 실제 next token과 맞는 비율, readout distribution의 kurtosis, position 사이
            top concept의 autocorrelation과 J-lens geometry의 유효 차원이 함께 변하는지 확인했다. 특정 모델에서 관찰된 <M>{String.raw`\sim L38-L92`}</M>를
            모든 Transformer의 고정 법칙으로 옮기면 안 된다.
          </p>
          <p>
            더 중요한 자기참조 경계가 있다. “초기 layer에서 J-lens가 아무것도 못 읽었다”는 사실은 “초기 layer에 의미 있는 정보가 없다”는 증명이
            아니다. J-lens 자체가 vocabulary에 연결된 평균 map이므로 vocabulary로 이름 붙이기 어려운 정보나 다른 geometry의 표현을 놓칠 수 있다.
          </p>
        </div>
      </section>

      <section id="frontier-tools" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2026년 해석 도구들은 같은 증거를 만들까?</h2>
        <div className="not-prose border-y border-border">
          {[
            ['Gemma Scope 2', 'Gemma 3 모든 layer에 SAE와 transcoder를 제공한다. Dense activation과 block 계산을 sparse feature로 근사하는 공개 dictionary 계열이다.', 'Feature가 많아져도 label, reconstruction과 원 모델 causal use는 따로 검증한다.'],
            ['Circuit Tracing', '원 MLP 일부를 cross-layer transcoder로 바꾼 replacement model에서 prompt별 feature attribution graph를 만든다.', 'Graph completeness, error node, perturbation faithfulness와 원 모델 patch가 필요하다.'],
            ['Jacobian lens', '평균 downstream Jacobian과 원 unembedding으로 residual direction을 vocabulary token에 연결한다.', 'Single-token naming, 평균 linearization과 context별 정확한 path의 손실이 남는다.'],
            ['Natural Language Autoencoder', 'Activation verbalizer가 target activation을 자연어 설명으로 바꾸고, activation reconstructor가 그 설명만으로 원 activation을 복원하도록 함께 학습한다.', '읽기 쉬운 문장은 literal thought transcript가 아니다. 설명 hallucination, reconstruction과 semantic fidelity를 독립 방법으로 확인한다.'],
            ['Train for interpretability', 'Weight-sparse Transformer처럼 학습 시점부터 연결 대부분을 0으로 제한해 작고 충분한 circuit이 나타나기 쉬운 모델을 만든다.', '작은 sparse model의 algorithmic task 결과다. Dense frontier model을 이미 해석했거나 같은 tradeoff가 scale된다는 증거는 아니다.'],
          ].map(([name, mechanism, boundary], index) => (
            <div key={name} className="grid min-w-0 gap-3 border-b border-border py-5 last:border-b-0 md:grid-cols-[3rem_10rem_minmax(0,1fr)_minmax(0,0.85fr)] md:gap-5">
              <span className="font-mono text-xs font-black text-muted-foreground">0{index + 1}</span>
              <strong className="text-sm">{name}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{mechanism}</p>
              <p className="text-sm leading-relaxed"><span className="font-bold">남는 경계.</span> {boundary}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Replacement model은 activation reconstruction error가 작아도 다른 algorithm으로 같은 출력을 흉내 낼 수 있다. Circuit Tracing 원문도
            이 <strong>mechanistic faithfulness</strong>를 보장하지 못하며 post-hoc perturbation으로 확인한다고 명시한다. Error node가 많이
            차지하는 prompt에서는 중요한 계산이 graph의 “dark matter”로 남을 수 있다.
          </p>
          <p>
            따라서 공개 feature dictionary, 읽기 쉬운 graph, 말이 되는 token trajectory는 서로 다른 evidence다. 어떤 tool을 쓰든 분석 대상,
            approximation error, control과 원 모델 behavior 변화를 함께 남겨야 한다.
          </p>
          <p>
            Natural Language Autoencoder와 weight-sparse training은 이 글의 필수 여섯 단계에 넣지 않는다. 전자는 사람이 읽는 설명 interface를
            넓히는 선택 심화이고, 후자는 dense checkpoint를 사후 분석하는 대신 학습 objective 자체를 바꾸는 독립 연구 분기다. 새 도구의 이름보다
            <strong> 무엇을 복원했고, 원 모델에서 무엇을 바꿨으며, 어떤 실패를 측정했는지</strong>로 비교한다.
          </p>
          <h3>어디까지 직접 재현할 수 있는가</h3>
          <p>
            J-lens 계산 절차와 공개 코드는 공개 weight 모델에서 다시 구현할 수 있다. Gemma Scope 2의 공개 dictionary도 같은 입력으로 feature
            activation과 reconstruction을 확인할 수 있다. 반면 proprietary Claude checkpoint에서 보고된 정확한 swap 성공률과 내부 activation은
            weight 접근 권한 없이는 독립 재현할 수 없다. 이 경우 가능한 일은 <strong>방법을 공개 모델에 이식하는 것</strong>이며, 원 논문의 숫자를
            재현했다고 쓰는 것은 아니다.
          </p>
        </div>
      </section>

      <section id="claim-boundaries" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">J-space 연구가 말하지 않은 것까지 말하지 않기</h2>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Single-token 경계', 'J-lens direction은 vocabulary token에 묶인다. “prompt injection” 같은 구는 여러 조각으로 보이고, multi-token concept는 template lens 같은 확장이 필요하다.'],
            ['관계 구조 경계', '도시·국가·수도 개념이 함께 읽혀도 셋의 역할과 관계를 bag-of-concepts만으로 복원하지 못한다.'],
            ['읽기 실패 경계', 'Noise, 평균 절차, tokenizer와 사람이 이름 붙이기 어려운 concept 때문에 해석 불가능한 readout도 남는다.'],
            ['분포 이동 경계', '한 prompt 분포에서 평균한 Jacobian은 다른 언어·task·checkpoint에서도 같은 readout과 개입 효과를 낸다는 보장이 없다.'],
            ['Global workspace 경계', '보고·reasoning·broadcast·selectivity라는 기능적 유사성을 보였지만, 뇌의 recurrent architecture나 의식 자체를 증명한 결과가 아니다.'],
          ].map(([label, detail], index) => (
            <div key={label} className="min-w-0 bg-background p-4 sm:p-5">
              <p className="font-mono text-[10px] font-black text-muted-foreground">LIMIT {index + 1}</p>
              <p className="mt-2 text-sm font-bold">{label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            특히 관계 결합은 별도 실험이 필요하다. 여러 concept가 동시에 읽힌다는 사실만으로 “어떤 대상의 어떤 속성”인지 연결한 역할 구조는 나오지
            않는다. Entity를 유지한 채 속성만 바꾸는 patch, 속성을 유지한 채 entity만 바꾸는 patch, 둘을 함께 바꾸는 interaction control을
            비교해야 bag-of-concepts와 bound relation을 구분할 수 있다.
          </p>
        </div>
        <StopRule>
          이 글의 최상단 결론은 “일부 LLM에서 vocabulary로 읽히는 작은 representation 집합이 verbal report와 일부 flexible reasoning에
          privileged causal role을 보였다”이다. “모델의 생각을 전부 읽었다” 또는 “의식을 증명했다”로 올라가지 않는다.
        </StopRule>
      </section>

      <section id="bounded-route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최신 결과에서 필요한 바닥과 구현으로 내려가기</h2>
        <div className="border-y border-border">
          <RouteRow number="01" slug="statistics-generalization" title="인과 검증 문해력" question="필요성·충분성, 대조군, 교란과 holdout을 먼저 구분해 관측된 feature를 원인으로 과대 해석하지 않는다." />
          <RouteRow number="02" slug="llm-interpretability-readouts" title="레이어 Readout" question="Hidden state, logit과 probability를 구분하고 Logit·Tuned·Jacobian lens의 map을 직접 계산한다." />
          <RouteRow number="03" slug="paper-transformer-circuits-2021" title="Attention Circuit 원문" question="Residual stream과 QK·OV 분해로 component가 무엇을 읽고 쓰는지 고전 기준점을 세운다." />
          <RouteRow number="04" slug="sparse-autoencoder" title="Sparse Feature" question="Dense activation을 sparse dictionary로 근사할 때 reconstruction·sparsity·labeling 손실을 계산한다." />
          <RouteRow number="05" slug="llm-circuit-analysis" title="Causal Circuit" question="Attribution 후보를 patching, ablation, clamping과 negative control로 원 모델에서 검증한다." />
        </div>
        <CapabilityCheck
          items={[
            'Logit, Tuned, Jacobian lens가 각각 어떤 downstream map을 가정하거나 학습하는지 설명한다.',
            'Overcomplete token direction에서 sparsity constraint가 없으면 J-space 정의가 무너지는 이유를 설명한다.',
            'Intermediate swap이 answer smuggling이 아니라는 layer·component·clamping control을 설계한다.',
            'Swap이 실패하면 source concept loading과 single-token vocabulary limit를 함께 점검한 뒤 표현 부재를 주장한다.',
            'J-space의 기능적 증거와 model consciousness 주장을 분리한다.',
          ]}
        />
        <SourceNotes
          sources={[
            { label: 'Anthropic · Verbalizable Representations Form a Global Workspace (2026)', href: 'https://transformer-circuits.pub/2026/workspace/index.html', note: 'J-lens 식, sparse J-space, report·reasoning·broadcast·selectivity 실험과 limitation의 원문.' },
            { label: 'Google DeepMind · Gemma Scope 2', href: 'https://deepmind.google/models/gemma/gemma-scope/', note: 'Gemma 3 전 layer SAE·skip/cross-layer transcoder와 공개 도구 범위.' },
            { label: 'Anthropic · Circuit Tracing Methods (2025)', href: 'https://transformer-circuits.pub/2025/attribution-graphs/methods.html', note: 'Cross-layer transcoder replacement model, error node, graph completeness와 mechanistic faithfulness.' },
            { label: 'Anthropic · A Toy Model of Mechanistic (Un)Faithfulness', href: 'https://transformer-circuits.pub/2025/faithfulness-toy-model/index.html', note: '정확한 output reconstruction과 동일한 내부 algorithm이 다른 이유를 보여 주는 경계 사례.' },
            { label: 'Anthropic · Natural Language Autoencoders (2026)', href: 'https://transformer-circuits.pub/2026/nla/index.html', note: 'Activation verbalizer·reconstructor, natural-language bottleneck, reconstruction 평가와 설명 hallucination·비용 경계.' },
            { label: 'OpenAI · Weight-Sparse Transformers Have Interpretable Circuits (2025)', href: 'https://openai.com/index/understanding-neural-networks-through-sparse-circuits/', note: '학습 단계의 weight sparsity, necessary·sufficient circuit과 작은 sparse model에서의 scale 한계.' },
          ]}
        />
      </section>
    </>
  );
}
