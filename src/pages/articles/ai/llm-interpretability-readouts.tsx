import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  AttentionCounterexampleExplorer,
  LayerReadoutExplorer,
  ReadoutClaimLab,
} from './llm-interpretability-readouts/viz/ReadoutExplorers';

export default function LlmInterpretabilityReadoutsArticle() {
  return (
    <>
      <SpecialistEntry
        title="Transformer 내부 측정값을 해석 주장으로 바꾸는 글"
        description="Attention map, hidden state와 logit을 읽는 방법을 비교하고, 관찰한 상관을 곧바로 원인이라고 부르지 않는 증거 경계를 세운다. 벡터와 Transformer layer의 기본 구조는 이미 안다고 가정한다."
        prerequisites={[
          'Token이 vector로 표현되고 residual stream을 따라 layer를 지난다는 뜻을 안다.',
          'Logit과 softmax가 다음 token 확률을 만드는 순서를 안다.',
          'Attention weight가 정보의 인과적 중요성과 같은 말이 아님을 구분할 준비가 되어 있다.',
        ]}
        links={[
          { slug: 'transformer-architecture', title: 'Transformer architecture', reason: 'Residual stream과 attention·MLP의 계산 위치를 먼저 잡는다.' },
          { slug: 'linear-algebra-tensors', title: '벡터와 tensor', reason: 'Hidden representation과 projection을 좌표 변화로 이해한다.' },
          { slug: 'probability-information-theory', title: '확률과 정보량', reason: 'Logit, softmax와 token 분포를 해석할 수학 기반을 보강한다.' },
        ]}
      />
      <section id="residual-stream" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Layer 안에서 무엇을 읽었다고 말해야 할까?</h2>
        <QuestionLead
          question="Attention map에 France가 크게 보이고 중간 layer의 top token이 Paris라면, 모델이 이미 Paris를 생각했다고 말해도 될까?"
          answer="아직 아니다. 먼저 원 모델의 어느 layer·position·component에서 어떤 tensor를 관찰했는지, 어떤 추가 map으로 token ranking을 만들었는지 분리해야 한다. Readout은 좋은 실험 후보를 만들지만 그 자체가 현재 출력의 원인은 아니다."
        />
        <ConceptPrimer
          title="이 글에서 계속 구분할 다섯 값"
          items={[
            {
              term: 'Residual state',
              meaning: 'layer와 token position마다 유지되는 공용 vector 상태다.',
              why: '여러 attention head와 MLP update가 누적되므로 state에 정보가 보여도 작성자를 바로 알 수 없다.',
            },
            {
              term: 'Component activation',
              meaning: '특정 head, MLP, neuron 또는 feature에서 관찰한 입력·출력 수치다.',
              why: '같은 layer 번호만으로는 pre/post residual과 component output을 구분할 수 없다.',
            },
            {
              term: 'Logit · distribution',
              meaning: 'logit은 token별 정규화 전 score이고, softmax 뒤에 합이 1인 distribution이 된다.',
              why: '중간 lens distribution과 원 모델의 실제 final distribution은 같은 기호로 쓰면 안 된다.',
            },
            {
              term: 'Selected token',
              meaning: 'distribution에서 greedy, sampling, top-k 같은 규칙으로 실제 선택된 token이다.',
              why: '확률이 가장 큰 후보와 실제 생성 결과, 사람이 붙인 concept 이름은 서로 다를 수 있다.',
            },
            {
              term: 'Jacobian · 작은 변화의 전달표',
              meaning: '입력 vector의 각 방향을 아주 조금 바꿨을 때 출력 vector의 각 방향이 얼마나 바뀌는지 모은 국소 선형 map이다.',
              why: 'J-lens는 한 layer의 작은 방향 변화가 뒤쪽 출력에 미칠 1차 영향을 읽되, 큰 변화와 강한 비선형 효과까지 보장하지 않는다.',
            },
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 관찰 주소를 고정한다. <M>{String.raw`r_{\ell,t}`}</M>라면 layer <M>{String.raw`\ell`}</M>,
            token position <M>t</M>의 residual state다. Attention output인지 MLP output인지,
            block 앞인지 뒤인지가 빠진 “layer 12 activation”은 재현할 수 없는 설명이다.
          </p>
          <p>
            아래는 전형적인 pre-norm decoder block의 순서다. 모델마다 norm 위치와 parallel
            branch가 다를 수 있으므로 실제 config와 code path를 함께 확인해야 한다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`
              \underbrace{r^{\mathrm{attn}}_{\ell,t}}_{\text{attention 뒤 상태}}
              =
              \underbrace{r_{\ell,t}}_{\text{이전 누적 상태}}
              +
              \underbrace{\mathrm{Attn}_{\ell}\!\left(\mathrm{Norm}_{\ell}^{A}(r_{\ell})\right)_t}_{\text{position 사이에서 읽고 쓴 update}}
            `}</M>
            <M display>{String.raw`
              \underbrace{r_{\ell+1,t}}_{\text{다음 block 상태}}
              =
              \underbrace{r^{\mathrm{attn}}_{\ell,t}}_{\text{MLP가 실제로 읽는 상태}}
              +
              \underbrace{\mathrm{MLP}_{\ell}\!\left(\mathrm{Norm}_{\ell}^{M}(r^{\mathrm{attn}}_{\ell,t})\right)}_{\text{같은 position에 더하는 update}}
            `}</M>
            <FormulaNote
              meaning="왜 두 단계로 쓰나: MLP는 block 입구의 r을 다시 읽는 것이 아니라 attention update가 더해진 상태를 읽는다. 왜 residual을 더하나: 여러 component가 공용 통로에 update를 누적하게 하려는 구조다. 따라서 최종 r만 관찰하면 정보의 존재는 볼 수 있어도 어느 head나 MLP가 새로 썼는지는 분리할 수 없다."
              symbols={[
                ['r_{\\ell,t}', 'layer ℓ, position t의 누적 residual state'],
                ['r^{\\mathrm{attn}}_{\\ell,t}', 'attention update가 반영된 중간 상태'],
                ['\\mathrm{Norm}^{A},\\mathrm{Norm}^{M}', '각 sublayer가 기대하는 scale로 입력을 맞추는 normalization'],
              ]}
            />
          </div>
          <p>
            Component의 작성 책임을 찾으려면 attention output, MLP output과 residual pre/post를
            따로 cache하고 같은 forward pass의 주소를 기록한다. 이 주소 체계가 이후 lens와
            intervention의 공통 좌표가 된다.
          </p>
        </div>
      </section>

      <section id="attention-map" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Attention은 어디를 보고, 무엇을 옮기고, 결과를 얼마나 바꿀까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Head <M>h</M>의 attention weight <M>{String.raw`a^{h}_{t,j}`}</M>는 query position
            <M>t</M>가 허용된 key position <M>j</M>의 value를 섞는 비율이다. 큰 weight는
            routing 후보를 알려 준다. 그러나 source가 운반하는 내용과 residual에 쓰는 방향은
            value projection과 output projection이 정한다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`
              \underbrace{y_t^h}_{\text{head가 residual에 쓰는 vector}}
              =
              \underbrace{W_O^h}_{\text{residual 방향으로 변환}}
              \sum_{j\le t}
              \underbrace{a^h_{t,j}}_{\text{routing 비율}}
              \underbrace{W_V^h r_{\ell,j}}_{\text{source가 운반하는 value}}
            `}</M>
            <M display>{String.raw`
              \underbrace{\Delta m^h_{y,y'}}_{\text{target }y\text{와 contrast }y'\text{의 margin 변화}}
              =
              \underbrace{(w_y-w_{y'})^\top}_{\text{두 token 방향의 차이}}
              \underbrace{y_t^h}_{\text{head output}}
            `}</M>
            <FormulaNote
              meaning="왜 softmax weight만 보지 않나: weight는 어디서 읽을지를 정하지만 무엇을 옮기는지는 value가 정한다. 왜 W_O를 곱하나: head 내부 vector가 residual stream의 어느 방향에 기록되는지 보기 위해서다. 왜 token 하나의 logit이 아니라 y와 y'의 차이를 보나: 특정 의사결정에 이 head가 어느 쪽으로 밀었는지 기준을 고정하기 위해서다. 이 direct contribution도 downstream layer의 간접 효과 전체는 아니다."
              symbols={[
                ['a^h_{t,j}', 'head h가 source j에 주는 attention weight'],
                ['W_V^h', 'source residual을 value content로 바꾸는 projection'],
                ['W_O^h', 'head value를 residual stream에 쓰는 projection'],
                ['w_y,w_{y\'}', 'unembedding에서 target과 contrast token의 row direction'],
              ]}
            />
          </div>
        </div>

        <AttentionCounterexampleExplorer />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Jain과 Wallace는 서로 매우 다른 attention 분포가 비슷한 예측을 만들 수 있음을
            보였다. Wiegreffe와 Pinter는 여기서 “attention은 항상 무의미하다”로 넘어가면
            안 되며, explanation 정의와 진단 protocol을 먼저 고정해야 한다고 반론했다.
            둘을 함께 읽으면 결론은 단순하다. Attention map은 <strong>routing 가설</strong>을
            만드는 관찰 도구다. Value, output과 counterfactual intervention 없이 완전한
            explanation으로 승격하지 않는다.
          </p>
        </div>
        <Misconception>
          Attention weight가 낮은 path도 큰 value를 운반할 수 있다. 반대로 높은 weight가
          residual과 target logit에 거의 영향을 주지 않을 수도 있다. “많이 봄”과 “답을
          바꿈”은 다른 측정이다.
        </Misconception>
      </section>

      <section id="logits-tokens" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실제 next-token 확률과 중간 readout은 무엇이 다를까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원 모델의 현재 forward pass는 마지막 residual state까지 모든 downstream layer를
            실행한 뒤 next-token distribution을 만든다. 이 값은 <M>{String.raw`p_{\mathrm{model}}`}</M>로
            쓴다.
          </p>
          <M display>{String.raw`
            \underbrace{p_{\mathrm{model}}(v\mid x)}_{\text{원 모델의 실제 next-token 확률}}
            =
            \operatorname{softmax}\!\left(
              \underbrace{W_U\,\mathrm{Norm}(r_{L,t})}_{\text{final vocabulary logits}}
            \right)_v
          `}</M>
          <FormulaNote
            meaning="왜 마지막 residual을 읽나: 이 값만 실제 downstream block을 모두 통과한 원 모델의 next-token 분포이기 때문이다. Norm은 final layer가 기대하는 scale로 맞추고, W_U는 residual 방향을 vocabulary별 logit으로 바꾸며, softmax가 이를 확률 분포로 정규화한다."
            symbols={[
              ['p_{\\mathrm{model}}', '원 모델이 실제 final state에서 만든 next-token distribution'],
              ['r_{L,t}', '마지막 layer L, 현재 position t의 residual state'],
              ['W_U', 'residual vector를 vocabulary logits로 바꾸는 unembedding matrix'],
            ]}
          />
          <p>
            Lens는 중간 state 뒤의 실제 layer들을 실행하는 대신, 선택한 map
            <M>{String.raw`T_\ell`}</M>을 붙여 vocabulary ranking을 만든다. 이 진단 분포는
            <M>{String.raw`q_\ell^T`}</M>로 따로 쓴다.
          </p>
          <M display>{String.raw`
            \underbrace{q_\ell^T(v\mid x)}_{\text{lens가 만든 진단용 readout}}
            =
            \operatorname{softmax}\!\left(
              W_U\,\mathrm{Norm}\!\left(
                \underbrace{T_\ell(r_{\ell,t})}_{\text{실제 downstream을 대신한 map}}
              \right)
            \right)_v
          `}</M>
          <FormulaNote
            meaning="왜 norm하나: final unembedding이 기대하는 activation scale과 geometry에 맞추기 위해서다. 왜 W_U를 곱하나: residual 방향을 vocabulary별 logit으로 바꾸기 위해서다. 왜 softmax하나: 상대 score를 합이 1인 ranking distribution으로 표시하기 위해서다. 하지만 q는 실제 downstream layer를 T로 대체했으므로 p_model과 같은 확률이 아니며 calibration도 별도로 검증해야 한다."
            symbols={[
              ['p_{\\mathrm{model}}', '원 모델이 실제 final state에서 만든 distribution'],
              ['q_\\ell^T', '중간 layer와 선택한 lens map으로 만든 진단용 distribution'],
              ['T_\\ell', 'identity, 학습한 affine translator 또는 평균 Jacobian map'],
              ['W_U', 'residual vector를 vocabulary logits로 바꾸는 unembedding matrix'],
            ]}
          />
          <p>
            Candidate token도 곧 완성된 개념은 아니다. BPE나 SentencePiece vocabulary에는
            공백이 붙은 조각, 단어 일부, byte fallback과 Unicode 관련 token이 섞인다.
            “prompt injection”처럼 여러 token으로 나뉘는 개념은 top token 하나로 관계와
            결합 구조를 보존할 수 없다. Vocabulary filtering과 top-k는 긴 ranking을 줄이는
            표시 규칙이지, 모델 내부 의미가 그 개수만큼만 존재한다는 증거가 아니다.
          </p>
        </div>
      </section>

      <section id="lens-family" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Logit, Tuned, Jacobian Lens는 어떤 map을 붙일까?</h2>
        <LayerReadoutExplorer />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Logit Lens: final 좌표를 그대로 적용하는 기준선</h3>
          <p>
            Logit Lens는 <M>{String.raw`T_\ell(r)=r`}</M>로 두고 final norm과 unembedding을
            바로 적용한다. 추가 학습이 없고 계산이 단순하다. 대신 초기 layer가 final layer와
            다른 covariance와 좌표를 사용하면 noisy하거나 편향된 token이 읽힐 수 있다.
          </p>
          <M display>{String.raw`
            \underbrace{T_\ell^{\mathrm{logit}}(r_{\ell,t})}_{\text{추가 변환 없음}}
            =
            \underbrace{r_{\ell,t}}_{\text{중간 residual을 그대로 사용}}
          `}</M>
          <FormulaNote
            meaning="왜 identity map을 쓰나: 원 모델의 final vocabulary 좌표로 중간 state를 가장 단순하게 직접 읽는 기준선이기 때문이다. 이 단순성 덕분에 새 probe의 학습 편향은 없지만, layer 사이 representation drift는 그대로 남는다."
            symbols={[
              ['T_\\ell^{\\mathrm{logit}}', 'Logit Lens가 downstream 대신 쓰는 identity map'],
              ['r_{\\ell,t}', '읽으려는 중간 residual state'],
            ]}
          />

          <h3>Tuned Lens: final distribution을 예측하도록 학습한 affine translator</h3>
          <p>
            Tuned Lens는 layer마다 <M>{String.raw`A_\ell,b_\ell`}</M>를 학습한다. 목표는
            freeze된 원 모델의 final output distribution을 distillation loss로 잘 예측하는
            것이다. 논문의 affine 식은 아래와 같다. 구현은 이 변환을 identity 주변에서
            학습하도록 residual parameterization을 사용할 수 있지만, 최종 map은 같은 affine
            family에 속한다.
          </p>
          <M display>{String.raw`
            \underbrace{T_\ell^{\mathrm{tuned}}(r_{\ell,t})}_{\text{layer별 학습 translator}}
            =
            \underbrace{A_\ell r_{\ell,t}}_{\text{회전·늘림·축소를 보정}}
            +
            \underbrace{b_\ell}_{\text{평균 shift를 보정}}
          `}</M>
          <FormulaNote
            meaning="왜 affine map을 학습하나: 중간 layer의 회전·scale·shift를 final layer가 기대하는 geometry에 맞추기 위해서다. 왜 final distribution을 teacher로 쓰나: 중간 state에서 미래 예측을 얼마나 복원할 수 있는지 측정하기 위해서다. 잘 맞는 probe는 정보의 decodability를 보여 주지만 원 모델이 A와 b를 실제 계산 경로로 쓴다는 뜻은 아니다."
            symbols={[
              ['A_\\ell', 'layer ℓ의 basis와 scale 차이를 보정하는 학습 matrix'],
              ['b_\\ell', 'layer별 평균 residual shift를 보정하는 bias'],
            ]}
          />
          <p>
            그렇다고 Tuned Lens가 causal evidence를 전혀 다루지 않은 것은 아니다. 원 논문의 causal basis extraction에서는 probe가 중요하다고 본
            basis와 원 모델 prediction에 영향이 큰 basis의 rank가 Pythia-410M layer 18 한 설정에서 높은 상관
            <M>{String.raw`\rho=0.89`}</M>을 보였다. 이는 “학습 probe는 언제나 shortcut”이라는 반례지만, 한 모델·층의 제한된 결과를 모든
            layer의 mechanistic faithfulness 보증으로 옮길 수는 없다. 새 checkpoint에서는 intervention과 held-out prompt로 다시 검증한다.
          </p>

          <h3>J-lens: 여러 문맥의 downstream sensitivity를 평균한 map</h3>
          <p>
            J-lens는 한 prompt의 Jacobian을 attribution처럼 그대로 표시하지 않는다.
            Source position <M>t</M>에서 현재와 미래 target position
            <M>{String.raw`t'\ge t`}</M>의 분석 target residual로 가는 Jacobian을 여러 prompt에 걸쳐 평균한다.
            이 평균은 재사용 가능한 vocabulary-disposed direction을 얻는 대신, 현재 prompt의
            정확한 비선형 경로를 버린다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`
              \underbrace{J_\ell}_{\text{layer별 평균 downstream map}}
              =
              \mathbb{E}_{\mathrm{prompt},\,t,\,t'\ge t}
              \left[
                \underbrace{\frac{\partial r_{\mathrm{target},t'}}{\partial r_{\ell,t}}}_{\text{작은 source 변화가 target state를 바꾸는 국소 map}}
              \right]
            `}</M>
            <M display>{String.raw`\begin{aligned}
z_{\ell,t}^{J}&=J_\ell r_{\ell,t} \quad \text{downstream 이동}\\
u_{\ell,t}^{J}&=\mathrm{Norm}(z_{\ell,t}^{J}) \quad \text{scale 정렬}\\
g_{\ell,t}^{J}&=W_Uu_{\ell,t}^{J} \quad \text{어휘 logit}\\
            q_\ell^{J}(v\mid x)&=\operatorname{softmax}(g_{\ell,t}^{J})_v
\end{aligned}`}</M>
            <FormulaNote
              meaning="왜 Jacobian을 쓰나: source activation의 작은 방향 변화가 downstream target state를 어느 방향으로 움직이는지 1차로 근사하기 위해서다. 왜 prompt와 position에 걸쳐 평균내나: 한 문맥의 우연한 사용보다 여러 문맥에서 verbal output에 영향을 줄 일반 성향을 얻기 위해서다. 그 대가로 현재 prompt의 exact attribution과 강한 비선형 효과를 보존하지 않는다. 왜 target residual을 따로 적나: target은 고정된 마지막 layer가 아니라 recipe 선택이며, 공개 Sonnet 4.5 기본 recipe는 마지막 block의 noise를 피하려고 penultimate residual z를 사용하기 때문이다. 왜 Jℓrℓ를 다시 norm·unembedding하나: 평균 map으로 target geometry에 옮긴 vector를 같은 vocabulary 좌표에서 읽기 위해서다."
              symbols={[
                ['J_\\ell', 'prompt·source·target position에 걸친 downstream Jacobian 평균'],
                ['t', '관찰한 source token position'],
                ['t\'', '현재 또는 미래의 output target position'],
                ['r_{\\mathrm{target},t\'}', '선택한 target layer의 residual; 기본 공개 recipe에서는 penultimate residual'],
                ['z_{\\ell,t}^{J}', 'layer ℓ의 source residual을 평균 downstream map으로 target geometry에 옮긴 vector'],
                ['u_{\\ell,t}^{J}', 'z의 scale을 final unembedding이 읽는 기준에 맞춘 normalized vector'],
                ['g_{\\ell,t}^{J}', 'normalized vector를 vocabulary 방향으로 투영한 softmax 이전 logit vector'],
                ['q_\\ell^J', 'J-lens가 만든 진단용 token distribution'],
              ]}
            />
          </div>
        </div>
        <Misconception>
          Lens에서 Paris가 top-1이라는 말은 “이 map 아래 Paris 방향이 가장 크게 읽힌다”는
          뜻이다. 모델이 내부에서 자연어 문장으로 Paris를 생각했고 그 문장을 숨겼다는 뜻은
          아니다.
        </Misconception>
      </section>

      <section id="claim-lab" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Readout을 봤다면 어느 문장까지 허용될까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            방법보다 증거 수준이 중요하다. 같은 J-lens token도 읽기만 했을 때, 한 번의
            swap이 output을 바꿨을 때, matched control과 held-out prompt까지 통과했을 때
            허용되는 문장이 다르다. 아래에서 방법과 증거를 각각 바꾸면 금지 문장과 다음
            실험도 함께 바뀐다.
          </p>
        </div>

        <ReadoutClaimLab />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            특히 no-effect는 조심해야 한다. 한 layer와 position을 patch했는데 답이 그대로라면
            그 개입에서 필요성을 확인하지 못한 것이다. 정보가 다른 position에 중복돼 있거나,
            backup head가 대신 쓰거나, downstream self-repair가 손상된 신호를 복원할 수 있다.
            Probe direction이 원 모델의 실제 feature와 어긋났을 가능성도 남는다.
          </p>
          <p>
            반대로 output이 바뀌어도 곧 완전한 mechanism은 아니다. 같은 norm의 random
            direction, reverse swap, unrelated task, clean/corrupted run과 held-out prompt를
            통과해야 intervention artifact를 줄일 수 있다. 그 뒤에도 결론은 “검사한 범위의
            mechanism component”에서 멈춘다.
          </p>
        </div>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음에는 무엇을 읽고 무엇을 바꿔야 할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention의 QK 선택과 OV write를 matrix path로 펼치려면
            {' '}<InternalLink slug="paper-transformer-circuits-2021">Transformer Circuits 2021</InternalLink>로 간다.
            2026년 J-lens와 J-space의 swap·clamping 주장을 원문 실험까지 읽으려면
            {' '}<InternalLink slug="llm-interpretability-frontier">현재 증거 지도</InternalLink>로 올라간다.
            Dense activation을 learned feature direction으로 나누려면
            {' '}<InternalLink slug="sparse-autoencoder">Sparse Autoencoder</InternalLink>를 고른다.
          </p>
          <p>
            실제 원 모델에서 clean/corrupted activation patching, ablation, backup path와
            self-repair를 검증하려면
            {' '}<InternalLink slug="llm-circuit-analysis">Causal Circuit Analysis</InternalLink>로 간다.
            Projection과 Jacobian 기호가 막히면
            {' '}<InternalLink slug="linear-algebra-tensors">선형대수와 Tensor Shape</InternalLink>를,
            softmax·entropy·KL이 막히면
            {' '}<InternalLink slug="probability-information-theory">확률과 정보 이론</InternalLink>을
            필요한 지점만 읽고 돌아온다.
          </p>
        </div>

        <StopRule>
          이 글은 readout의 관찰 계약에서 멈춘다. 모든 lens 변형을 나열하거나 SAE dictionary,
          J-space 전체 실험과 complete circuit을 한 글에 합치지 않는다. 새 도구도 읽는 map이나
          인과 검증 계약을 바꿀 때만 이 경로에 추가한다.
        </StopRule>

        <CapabilityCheck
          items={[
            'Residual state, component activation, logit, diagnostic distribution과 selected token을 구분한다.',
            'Attention weight, value content, output projection과 target logit contribution을 분리한다.',
            '원 모델의 p_model과 중간 lens의 q를 같은 확률로 읽지 않는다.',
            'Logit, Tuned, J-lens가 쓰는 map과 학습·평균 방식을 설명한다.',
            'Readout top token을 hidden sentence나 완전한 chain of thought로 부르지 않는다.',
            '한 patch의 no-effect를 representation 부재로 해석하지 않는다.',
            'Single intervention과 matched-control·holdout을 통과한 mechanism claim을 구분한다.',
          ]}
        />

        <SourceNotes
          sources={[
            {
              label: 'Elhage et al. · Transformer Circuits',
              href: 'https://transformer-circuits.pub/2021/framework/index.html',
              note: 'Residual stream과 attention의 QK·OV 회로 분해.',
            },
            {
              label: 'Jain & Wallace · Attention is not Explanation',
              href: 'https://arxiv.org/abs/1902.10186',
              note: '서로 다른 attention 분포와 비슷한 prediction을 이용한 explanation 반례.',
            },
            {
              label: 'Wiegreffe & Pinter · Attention is not not Explanation',
              href: 'https://arxiv.org/abs/1908.04626',
              note: 'Explanation 정의와 진단 protocol을 고정해야 한다는 반론과 검증 기준.',
            },
            {
              label: 'Belrose et al. · Tuned Lens',
              href: 'https://arxiv.org/abs/2303.08112',
              note: 'Layer별 affine translator와 distillation objective. Section 4.1·Figure 8은 Pythia-410M layer 18의 causal basis extraction에서 tuned-lens 영향과 원 모델 영향의 Spearman ρ=0.89를 보고한다.',
            },
            {
              label: 'Gurnee et al. · Jacobian Lens',
              href: 'https://transformer-circuits.pub/2026/workspace/index.html',
              note: '평균 downstream Jacobian, direct vocabulary readout과 prompt-specific causal 경계.',
            },
          ]}
        />
      </section>
    </>
  );
}
