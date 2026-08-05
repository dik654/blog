import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, InternalLink, Misconception, QuestionLead, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import { FeatureEvidenceViz, ReconstructionSparsityExplorer } from './sparse-autoencoder/viz/SAEExplorers';

export default function SparseAutoencoderArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">왜 뉴런 하나보다 feature direction을 찾을까?</h2>
        <QuestionLead
          question="특정 뉴런이 ‘법률’, ‘대문자 약어’, ‘의심’ 문맥에 모두 반응하면 그 뉴런은 무슨 개념일까?"
          answer="한 뉴런에 한 이름을 붙이기 어렵다. 모델은 유용한 특징을 activation 공간의 여러 방향에 겹쳐 표현할 수 있다. Sparse Autoencoder는 dense activation을 소수의 learned direction 합으로 다시 표현해 더 읽기 쉬운 feature 후보를 만든다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Activation</strong>은 한 input을 처리할 때 특정 layer와 position에서 나온 vector다. <strong>Feature</strong>는 여러 input에서 반복되는
            activation pattern을 설명하려고 선택한 방향 또는 latent variable이다. 뉴런은 coordinate 축이지만 feature는 여러 뉴런의 조합일 수 있다.
          </p>
          <p>
            <strong>Sparse Autoencoder(SAE)</strong>는 입력 activation <M>x</M>를 더 넓은 latent space로 보내고, 그중 소수만 켠 뒤 다시 원래 공간으로
            복원한다. “희소”는 한 input에서 활성 feature가 적다는 뜻이지, 각 feature가 반드시 한 인간 개념만 뜻한다는 보증이 아니다.
          </p>
        </div>
        <Misconception>SAE의 목표는 polysemantic neuron을 자동으로 완벽한 monosemantic concept로 바꾸는 것이 아니다. Reconstruction과 sparsity를 만족하는 유용한 dictionary를 학습하고, 각 feature의 의미와 causal role은 따로 검증한다.</Misconception>
      </section>

      <section id="residual-stream" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어느 activation에 SAE를 학습할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Residual stream은 모든 Transformer block이 읽고 쓰는 공용 vector다. SAE는 residual pre/post, attention output, MLP output처럼 명시한
            activation site의 sample을 모아 학습한다. Site가 다르면 feature가 답하는 질문도 달라진다. MLP output feature를 residual feature처럼
            해석하면 정보가 생성된 위치와 누적된 위치를 섞게 된다.
          </p>
          <p>
            같은 layer라도 token position과 dataset 분포가 중요하다. 코드 token만 모은 dictionary, 대화 전체를 모은 dictionary, 특정 언어가
            부족한 dictionary는 서로 다른 feature coverage를 갖는다. Feature catalog에는 model, layer, hook point, training corpus와 sparsity 설정이
            함께 필요하다.
          </p>
        </div>
      </section>

      <section id="polysemanticity" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Superposition은 왜 생길까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 input에서 모든 특징이 동시에 필요한 것은 아니다. 자주 함께 켜지지 않는 feature들은 고차원 공간의 거의 다른 방향을 공유해도 간섭이
            작다. <strong>Superposition hypothesis</strong>는 모델이 neuron 수보다 많은 feature를 이런 겹친 방향으로 표현할 수 있다는 가설이다.
          </p>
          <p>
            이 설명은 모든 polysemanticity의 단일 원인이 확정됐다는 뜻이 아니다. Dataset correlation, distributed representation, nonlinear gate와
            optimization도 관찰된 activation을 바꾼다. SAE는 superposition을 조사하는 도구이지 가설 자체의 자동 증명기가 아니다.
          </p>
        </div>
      </section>

      <section id="sae-architecture" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Sparse dictionary로 activation을 복원하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Encoder는 activation에서 latent feature strength <M>f(x)</M>를 만들고, decoder는 활성 feature direction의 합으로 <M>x</M>를 근사한다.</p>
          <div data-formula-pair>
            <M display>{String.raw`\underbrace{f(x)}_{\text{feature 세기}}=\operatorname{ReLU}\!\left(\underbrace{W_{\mathrm{enc}}x+b_{\mathrm{enc}}}_{\text{입력과 feature 방향을 대조}}\right)`}</M>
            <M display>{String.raw`\underbrace{\hat x}_{\text{복원한 activation}}=\underbrace{W_{\mathrm{dec}}f(x)}_{\text{켜진 feature 방향을 합산}}+b_{\mathrm{dec}}`}</M>
            <FormulaNote
              meaning="왜 더 넓은 latent를 쓰나: 원래 neuron 좌표보다 많은 candidate direction으로 겹친 feature를 분리할 여지를 만들기 위해서다. 왜 ReLU인가: 음수 값을 끄고 한 input에서 일부 feature만 양수로 활성화하는 간단한 희소 gate를 만들기 위해서다. Decoder 합은 feature가 원 activation을 얼마나 설명하는지 검사한다."
              symbols={[["x", '원 모델에서 수집한 d차원 activation'], ["f(x)", 'm차원 sparse latent, 보통 m이 d보다 큼'], ["W_{\\mathrm{enc}}", 'activation을 feature strength로 읽는 encoder'], ["W_{\\mathrm{dec}}", 'feature를 원 activation 방향으로 되돌리는 decoder'], ["\\hat x", 'SAE가 복원한 activation'] ]}
            />
          </div>
          <M display>{String.raw`\underbrace{\mathcal L}_{\text{SAE 학습 목표}}=\underbrace{\|x-\hat x\|_2^2}_{\text{원 activation을 보존}}+\underbrace{\lambda\|f(x)\|_1}_{\text{동시에 켜지는 feature 수와 크기를 억제}}`}</M>
          <FormulaNote
            meaning="왜 제곱 오차인가: 복원 vector가 원 activation의 각 좌표에서 얼마나 벗어났는지 연속적으로 벌점화하기 위해서다. 왜 L1인가: 작은 activation을 0으로 밀어 소수 feature만 켜지게 하는 압력을 주기 위해서다. 다만 L1은 feature 선택뿐 아니라 이미 켜진 feature의 세기에도 계속 비용을 매기므로 값을 체계적으로 작게 추정하는 shrinkage를 만든다. λ가 너무 작으면 feature가 빽빽하고, 너무 크면 중요한 정보까지 버린다."
            symbols={[["\\|x-\\hat x\\|_2^2", 'reconstruction error'], ["\\|f(x)\\|_1", 'feature activation 절댓값의 합'], ["\\lambda", 'reconstruction과 sparsity의 교환을 정하는 계수'] ]}
          />
          <p>
            이 shrinkage가 생기는 경로를 분리해서 보자. 실제로 필요한 feature라도 activation을 1만큼 키울 때마다 <M>\lambda</M> 비용이 늘어난다.
            Optimizer는 reconstruction을 조금 희생하더라도 그 세기를 낮추는 쪽으로 움직일 수 있고, decoder 합은 원 activation보다 작아지거나 decoder
            norm이 보상적으로 커질 수 있다. 즉 “어떤 direction을 켤까”라는 선택과 “선택한 direction을 얼마나 쓸까”라는 크기 추정이 한 벌점에
            묶인 것이 문제다.
          </p>
          <p>
            <strong>Gated SAE</strong>는 켤 direction을 고르는 gate와 켜진 direction의 크기 추정을 분리해 L1의 부작용이 magnitude까지 번지는
            범위를 줄인다. <strong>JumpReLU</strong>는 학습한 threshold를 넘은 feature만 통과시키고, <strong>Top-K SAE</strong>는 큰 activation
            K개를 직접 선택해 모든 magnitude에 같은 연속 벌점을 매기는 대신 활성 개수를 제어한다. 세 방식은 shrinkage를 서로 다른 지점에서
            완화하지만 자동으로 의미가 올바른 feature를 보장하지 않는다. 구조가 달라도 reconstruction, 실제 firing 수, dead feature, decoder norm과
            held-out interpretability를 함께 평가해야 한다.
          </p>
        </div>
        <ReconstructionSparsityExplorer />
      </section>

      <section id="feature-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Feature에 이름을 붙인 뒤 무엇을 검증할까?</h2>
        <FeatureEvidenceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Top-activating example은 feature label의 출발점이다. Anthropic은 2024년 Claude 3 Sonnet의 SAE에서 “Golden Gate Bridge” 언급과
            이미지에 반응하는 feature를 보고했고, 그 activation을 크게 올린 연구 데모 <strong>Golden Gate Claude</strong>에서 관련 없는 질문의
            답까지 다리 이야기로 이동하는 현상을 공개했다. 이는 특정 model과 feature에 대한 원문 사례이지, 모든 SAE feature가 같은 정도로
            단일 개념을 갖는다는 보증은 아니다. Bridge가 없는 관련 문맥, 다른 다리, 고유명사 일반에서 어떻게 반응하는지 보지 않으면 feature
            boundary를 모른다.
          </p>
          <p>
            자동 labeler가 만든 자연어 설명도 prediction이다. Activation example 일부만 보고 만든 label이 held-out activation을 얼마나 예측하는지,
            false positive와 false negative가 무엇인지 평가한다. Feature splitting은 한 개념이 여러 feature로 갈라진 경우, feature absorption은 한
            feature가 더 구체적인 feature가 설명할 pattern까지 흡수한 경우다.
          </p>
          <p>
            같은 model과 layer에 서로 다른 seed, dictionary width, sparsity penalty로 SAE를 두 번 학습하면 basis가 달라질 수 있다. 두 feature에
            사람이 같은 이름을 붙였다는 사실만으로 같은 circuit이라고 결론내리지 않는다. Decoder direction의 유사도, activation overlap, held-out
            examples와 원 모델 intervention effect가 함께 맞는지 확인한다.
          </p>
        </div>
      </section>

      <section id="feature-steering" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Feature steering은 인과 증거이면서도 왜 위험할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Decoder direction을 residual stream에 더하거나 feature activation을 고정하면 output behavior가 바뀔 수 있다. 관찰만 하던 단계에서 실제
            내부 상태를 조작했으므로 causal evidence가 강해진다. 그러나 매우 큰 계수는 training distribution에 없던 activation을 만들고 fluency,
            unrelated behavior와 안전 장치를 함께 망가뜨릴 수 있다.
          </p>
          <M display>{String.raw`\underbrace{h^{\prime}}_{\text{개입 뒤 상태}}=\underbrace{h}_{\text{원래 상태}}+\underbrace{\alpha d_i}_{\text{feature }i\text{ 방향으로 이동}}`}</M>
          <FormulaNote
            meaning="왜 direction을 더하나: 해당 feature가 표현하는 activation 성분을 인위적으로 키웠을 때 output이 예측대로 변하는지 시험하기 위해서다. α를 여러 크기와 양·음 방향으로 sweep해야 단일 과도한 개입의 우연을 피할 수 있다."
            symbols={[["h", '원 모델 residual activation'], ["d_i", 'SAE feature i의 decoder direction'], ["\\alpha", 'steering strength'], ["h^{\\prime}", '개입 후 downstream layer에 전달되는 state'] ]}
          />
          <p>
            좋은 steering 실험은 목표 행동 변화, dose-response, 반대 방향 개입, random direction, unrelated task regression을 함께 측정한다. “행동이
            변했다”만으로 feature label이 완전하거나 안전한 control knob라고 말하지 않는다.
          </p>
        </div>
      </section>

      <section id="limitations" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SAE가 놓치는 것을 어떻게 표시할까?</h2>
        <div className="not-prose border-y border-border">
          {[
            ['Reconstruction error', '복원하지 못한 activation 성분은 feature 설명 밖에 남는다.'],
            ['Dead feature', '학습 뒤 거의 켜지지 않아 의미와 유용성을 평가할 수 없다.'],
            ['Feature splitting', '한 사람이 생각하는 개념이 문맥·형태에 따라 여러 direction으로 갈라진다.'],
            ['Feature absorption', '한 feature가 여러 세부 pattern을 함께 설명해 label이 지나치게 넓어진다.'],
            ['Causal incompleteness', '잘 읽히는 feature가 downstream output에 실제로 쓰이는지 별도 patching이 필요하다.'],
          ].map(([label, detail], index) => <div key={label} className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[3rem_10rem_minmax(0,1fr)]"><code className="text-xs font-black text-muted-foreground">0{index + 1}</code><strong className="text-sm">{label}</strong><p className="text-sm leading-relaxed text-muted-foreground">{detail}</p></div>)}
        </div>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            여러 layer의 계산 경로까지 보려면 single-layer SAE만으로 부족하다. Skip/cross-layer transcoder와 attribution graph를 사용하고, 후보 feature를
            원 모델에서 patch해 확인하는 과정은 <InternalLink slug="llm-circuit-analysis" learningPathId="ai-llm-interpretability-current-first">Causal Circuit Analysis</InternalLink>에서 이어진다.
          </p>
          <p>
            Gemma Scope 2는 Gemma 3의 모든 layer에 SAE와 transcoder를 공개하고, 하나의 dictionary 안에서 여러 sparsity·width 절충을 읽는
            Matryoshka SAE와 block 안팎의 계산을 근사하는 skip·cross-layer transcoder를 함께 제공한다. 이는 도구 coverage가 넓어졌다는 뜻이지,
            feature label이나 replacement circuit이 자동으로 원 모델의 실제 algorithm이 된다는 뜻은 아니다. Hook site별 reconstruction, dead feature,
            downstream intervention과 distribution shift를 다시 측정한다.
          </p>
          <p>
            Feature를 만들기 전에 관찰 주소와 lens 차이가 막히면 <InternalLink slug="llm-interpretability-readouts" learningPathId="ai-llm-interpretability-current-first">Layer Readout</InternalLink>으로,
            residual stream에서 component의 read·write가 막히면 <InternalLink slug="paper-transformer-circuits-2021" learningPathId="ai-llm-interpretability-current-first">Transformer Circuits 2021</InternalLink>로 돌아간다.
            현재 도구 전체의 주장 범위를 다시 확인할 때는 <InternalLink slug="llm-interpretability-frontier" learningPathId="ai-llm-interpretability-current-first">2026 증거 지도</InternalLink>를 사용한다.
          </p>
        </div>
        <StopRule>
          Reconstruction·sparsity·held-out label evidence와 제한된 steering 효과를 설명할 수 있으면 SAE의 최소 바닥은 끝이다. 모든 feature를 인간 개념으로
          이름 붙이거나 dictionary가 activation 전체를 완전하게 설명할 때까지 기다리지 않는다.
        </StopRule>
        <CapabilityCheck items={['Neuron coordinate와 learned feature direction을 구분한다.', 'Reconstruction과 sparsity가 경쟁하는 이유를 설명한다.', 'Feature label을 가설로 취급하고 held-out 반례를 설계한다.', 'Steering effect와 feature completeness를 같은 주장으로 묶지 않는다.']} />
        <SourceNotes sources={[
          { label: 'Anthropic · Toy Models of Superposition', href: 'https://transformer-circuits.pub/2022/toy_model/index.html', note: 'Superposition hypothesis의 계산적 직관.' },
          { label: 'Anthropic · Towards Monosemanticity', href: 'https://transformer-circuits.pub/2023/monosemantic-features', note: 'Sparse feature dictionary의 초기 대규모 실험.' },
          { label: 'Anthropic · Scaling Monosemanticity (2024)', href: 'https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html', note: 'Claude 3 Sonnet에서 Golden Gate Bridge feature를 찾고 activation과 steering 범위를 측정한 원 논문.' },
          { label: 'Anthropic · Golden Gate Claude (2024)', href: 'https://www.anthropic.com/news/golden-gate-claude', note: '해당 feature의 세기를 올려 behavior 변화를 공개한 24시간 연구 데모와 그 한계.' },
          { label: 'Google DeepMind · Gemma Scope 2', href: 'https://deepmind.google/models/gemma/gemma-scope/', note: 'Gemma 3 전 layer SAE·transcoder, Matryoshka SAE와 skip·cross-layer 도구 범위.' },
          { label: 'Google DeepMind · Gated Sparse Autoencoders', href: 'https://deepmind.google/research/publications/88147/', note: 'Feature selection과 magnitude 추정의 분리.' },
        ]} />
      </section>
    </>
  );
}
