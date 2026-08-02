import MathFormula from '@/components/ui/math';
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
import { PredictiveRepresentationExplorer } from './world-model-core/viz/WorldModelExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function PredictiveWorldRepresentationsArticle() {
  return (
    <>
      <SpecialistEntry
        title="보이는 frame에서 미래에 필요한 숨은 상태를 남기는 글"
        description="World model 계보의 표현 학습 단계다. Pixel을 그대로 복원하는 방법과 미래를 예측하는 latent를 학습하는 방법을 비교하고, 한 장의 image가 physical state 전체일 수 없는 이유를 다룬다."
        prerequisites={[
          'Image와 video가 시간 순서가 있는 sensor observation임을 안다.',
          'Neural encoder가 입력을 더 짧은 vector 또는 token 표현으로 바꿀 수 있음을 안다.',
          'Robot의 미래는 위치, 속도와 접촉처럼 화면에 직접 안 보이는 변수에도 달라짐을 안다.',
        ]}
        links={[
          { slug: 'video-understanding', title: 'Video understanding', reason: 'Frame의 순서, event와 temporal evidence를 쉬운 예에서 먼저 배운다.' },
          { slug: 'rl-pomdp-state-estimation', title: '부분 관측과 state estimation', reason: 'Observation과 실제 state가 왜 다른지 확률 관점으로 잡는다.' },
        ]}
      />
      <section id="observation-not-state" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Camera frame은 세상 자체가 아니라 세상을 본 결과다</h2>
        <QuestionLead question="한 장의 image embedding만 있으면 robot이 필요한 physical state를 모두 알 수 있을까?" answer="아니다. Camera 뒤에 가려진 물체, 깊이, 마찰, gripper force처럼 영상에 직접 나타나지 않는 state가 있다. 여러 frame, proprioception과 이전 action을 합쳐도 완전한 state가 아니라 현재 증거로 가능한 state의 분포를 추정하는 것이다." />
        <ConceptPrimer items={[
          { term: 'Physical state sₜ', meaning: '물체 pose, velocity, contact와 robot joint처럼 미래를 결정하는 환경 변수다.', why: 'Sensor가 보여 주는 값과 실제 동역학 변수를 구분한다.' },
          { term: 'Observation oₜ', meaning: 'Camera image, depth, proprioception처럼 sensor에서 받은 값이다.', why: '같은 observation이 여러 hidden state에서 나올 수 있음을 인정한다.' },
          { term: 'Belief bₜ', meaning: '관측 history가 주어졌을 때 현재 state가 무엇일지 나타내는 확률 분포다.', why: '부분 관측에서 하나의 확정 vector만 믿지 않고 uncertainty를 남긴다.' },
          { term: 'Representation zₜ', meaning: '관측을 downstream prediction과 decision에 쓰기 쉽게 압축한 feature다.', why: 'Pixel 전체가 아니라 task에 중요한 변화와 관계를 계산한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>컵이 상자 뒤에 가려져도 바로 사라진 것은 아니다. 한 frame만 보면 “없다”와 “가려졌다”를 구분하기 어렵지만, 이전 video와 camera motion을 함께 보면 가능한 state를 좁힐 수 있다. World representation의 첫 책임은 가장 선명한 image를 만드는 것이 아니라 <strong>미래를 달리 만드는 hidden state를 잃지 않는 것</strong>이다.</p>
          <p>이때 latent vector 하나를 물리 state와 동일시하면 안 된다. Latent는 data와 objective가 요구한 정보만 보존한다. 학습에서 작은 object나 contact 변화가 중요하지 않았다면 embedding distance가 작아도 robot에게는 전혀 다른 state일 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{b_t(s)}_{\text{현재 state에 대한 믿음}}=\underbrace{p(s_t=s\mid o_{1:t},a_{1:t-1})}_{\text{관측·이전 행동 history로 갱신한 분포}}`}
          meaning="부분 관측에서는 현재 state 하나를 직접 안다고 가정하지 않고, 지금까지 본 관측과 이미 실행한 action으로 가능한 state의 확률을 갱신한다. 실제 neural model이 이 분포를 명시적으로 출력하지 않더라도 temporal latent가 어떤 uncertainty를 압축하는지 이 관점으로 감사할 수 있다."
          symbols={[[String.raw`b_t(s)`, '시점 t에 state가 s일 믿음'], [String.raw`s_t`, '직접 보이지 않을 수 있는 physical state'], [String.raw`o_{1:t}`, '현재까지의 sensor observation history'], [String.raw`a_{1:t-1}`, '현재 관측 전에 실행한 action history']]} />
        <Misconception>더 큰 vision encoder가 partial observability를 자동으로 없애지는 않는다. 입력에 없고 history에서도 식별할 수 없는 state는 parameter 수와 무관하게 하나로 확정할 수 없다.</Misconception>
      </section>

      <section id="prediction-target" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">무엇을 맞히게 하느냐가 representation의 내용을 정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Pixel reconstruction은 가려진 영역의 RGB 값을 맞힌다. 물체 경계와 texture를 보존하는 강한 신호지만, 조명 noise와 예측할 수 없는 세부도 같은 loss에 들어간다. 여러 가능한 미래 중 평균을 내면 motion이 흐려지거나 generative decoder가 큰 계산을 요구할 수 있다.</p>
          <p>Joint-embedding prediction은 target image나 video를 별도 encoder로 feature화한 뒤 그 feature를 맞힌다. Target encoder가 색의 작은 변화보다 object와 motion의 공통 구조를 가깝게 놓는다면 predictor는 그 구조에 계산을 집중할 수 있다. 대신 target encoder가 버린 정보는 predictor도 복원하지 못한다.</p>
        </div>
        <PredictiveRepresentationExplorer />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{N}_{\text{전체 video token 수}}&=\underbrace{T'}_{\text{시간 칸}}\underbrace{H'W'}_{\text{공간 patch 수}}\\[0.4em]\underbrace{N_{target}}_{\text{예측할 token 수}}&=\underbrace{\rho}_{\text{mask 비율}}\underbrace{N}_{\text{전체 token}}\end{aligned}`}
          meaning="Video를 시간과 공간 patch로 나누면 predictor의 기본 단위가 생긴다. Mask 비율이 높을수록 보이지 않는 target이 많아져 긴-range structure를 써야 하지만, context가 너무 적으면 여러 가능한 target을 하나의 정답으로 강제할 수 있다."
          symbols={[[String.raw`T'`, 'temporal tubelet 또는 sampled frame 수'], [String.raw`H',W'`, 'encoder feature map의 공간 크기'], [String.raw`N`, 'flatten한 spatiotemporal token 수'], [String.raw`\rho`, 'target으로 가린 token 비율'], [String.raw`N_{target}`, 'loss를 계산할 masked target token 수']]} />
      </section>

      <section id="jepa-objective" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">JEPA는 context에서 target representation을 예측한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Context encoder는 보이는 video patch를 처리한다. Predictor는 context feature와 어느 위치가 가려졌는지를 받아 target 위치의 feature를 예측한다. Target feature는 별도 target encoder가 전체 target region에서 계산한다. Loss는 RGB가 아니라 두 embedding의 차이다.</p>
          <p>여기서 stop-gradient는 target branch로 predictor loss의 gradient가 바로 흐르지 않게 한다. Target encoder는 context encoder의 exponential moving average로 천천히 따라간다. 이것은 두 branch가 동시에 같은 상수 vector로 움직여 loss를 쉽게 0으로 만드는 collapse를 막는 설계의 일부다. “Stop-gradient 하나면 항상 collapse가 없다”가 아니라 architecture, normalization과 data augmentation을 포함한 전체 recipe로 확인한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\hat z_j}_{\text{예측 target latent}}&=\underbrace{P_\theta(E_\phi(o_C),m_j)}_{\text{context와 target 위치로 예측}}\\[0.45em]\underbrace{z_j^+}_{\text{비교 target latent}}&=\underbrace{\operatorname{sg}(E_{\bar\phi}(o_{T_j}))}_{\text{target encoder·gradient 차단}}\\[0.45em]\underbrace{\mathcal L_{pred}}_{\text{masked latent loss}}&=\frac{1}{|M|}\sum_{j\in M}\underbrace{\|\hat z_j-z_j^+\|_1}_{\text{target feature 차이}}\end{aligned}`}
          meaning="보이는 context C에서 mask 위치 j의 target feature를 맞힌다. V-JEPA 2는 visual mask denoising을 representation 공간에서 수행한다. L1 또는 smooth loss의 작은 값은 target encoder가 정의한 feature를 잘 예측했다는 뜻이지 physical state 전체를 복원했다는 뜻은 아니다."
          symbols={[[String.raw`o_C`, '보이는 context region의 image·video'], [String.raw`o_{T_j}`, 'j번째 target region'], [String.raw`E_\phi`, 'context encoder'], [String.raw`E_{\bar\phi}`, 'EMA target encoder'], [String.raw`P_\theta`, 'masked target predictor'], [String.raw`M`, '예측할 mask target 집합']]} />
        <Formula
          latex={String.raw`\underbrace{\bar\phi\leftarrow\mu\bar\phi+(1-\mu)\phi}_{\text{target encoder를 천천히 갱신}}`}
          meaning="Target encoder parameter는 context encoder의 현재 parameter를 바로 복사하지 않고 momentum μ로 평균낸다. μ가 1에 가까우면 target이 안정적이지만 너무 늦게 따라오고, 작으면 target이 빠르게 바뀌어 predictor가 쫓아갈 기준이 흔들릴 수 있다."
          symbols={[[String.raw`\phi`, '학습 gradient로 갱신되는 context encoder parameter'], [String.raw`\bar\phi`, 'target encoder parameter'], [String.raw`\mu`, '이전 target을 유지하는 EMA momentum']]} />
      </section>

      <section id="temporal-state" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Video prediction은 시간 순서를 봐야 하지만 기억을 보장하지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Motion을 배우려면 같은 object가 여러 frame에서 어디로 이동했는지 연결해야 한다. Temporal tubelet과 position encoding은 “어느 token이 언제 왔는가”를 제공하고 predictor는 context 사이의 변화를 사용한다. V-JEPA 2가 action anticipation과 motion understanding에서 강한 것은 이 시간 구조를 representation target으로 학습한 결과다.</p>
          <p>하지만 training clip보다 훨씬 긴 시간에 object permanence가 유지된다고 자동으로 결론내릴 수 없다. 짧은 clip에서 높은 probe accuracy를 얻은 모델도 수분 뒤 다시 나타난 물체의 identity, count와 pose를 잊을 수 있다. Genie 3가 수분 수준의 visual consistency를 별도 capability로 강조하는 이유도 long-horizon memory가 독립 문제이기 때문이다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\hat z_M}_{\text{가려진 위치의 예측 latent}}=\underbrace{P_\theta\!\left(E_\phi(o_{\bar M}),\Delta_M\right)}_{\text{보이는 token과 mask 위치로 결정론적 예측}}`}
          meaning="V-JEPA 2의 기본 pretraining은 미래 전체의 확률분포를 생성하는 식이 아니라, 보이는 spatiotemporal token과 가린 위치 정보를 받아 target encoder의 masked latent를 맞히는 결정론적 예측이다. Mask M을 시간상 뒤쪽에만 두면 future prediction 실험이 되지만, 모든 mask가 미래를 뜻하는 것은 아니다. Action이 입력에 없으므로 후보 command 사이의 반사실적 결과도 이 식만으로는 비교하지 못한다."
          symbols={[[String.raw`M`, '예측 대상으로 가린 spatiotemporal token 위치'], [String.raw`\bar M`, 'encoder가 실제로 볼 수 있는 context 위치'], [String.raw`o_{\bar M}`, '보이는 video token'], [String.raw`\Delta_M`, 'predictor가 target 위치를 구분하도록 주는 mask 위치 정보'], [String.raw`\hat z_M`, '가린 위치에서 예측한 representation']]} />
      </section>

      <section id="action-free-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">관찰에서 배운 변화와 내가 일으킨 변화는 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Internet video에서 컵이 오른쪽으로 움직였다고 하자. 손이 밀었는지, table이 기울었는지, camera가 왼쪽으로 움직였는지 pixel만으로는 여러 설명이 가능하다. Observation-only predictor는 data에서 자주 함께 나타난 cue를 이용하지만 “이 action을 개입하면 같은 결과가 생긴다”는 causal contract를 갖지 않는다.</p>
          <p>V-JEPA 2의 중요한 연결은 action-free pretraining을 버리지 않고, frozen encoder 위에 action과 end-effector state를 받는 V-JEPA 2-AC predictor를 post-train한 것이다. 이것은 encoder가 완전한 action-equivariant state를 보장했다는 증명이 아니다. 실제로는 action-conditioned rollout과 robot planning evidence가 representation의 재사용 가능성을 보여 준다.</p>
          <p>다음 글인 <InternalLink slug="action-conditioned-world-dynamics">Action-Conditioned World Dynamics</InternalLink>에서 action을 video frame 사이에 배치하고, camera·base·effector 좌표와 teacher-forcing·rollout loss를 연결한다.</p>
        </div>
        <Misconception>Action anticipation benchmark는 보이는 사람의 다음 행동을 분류하는 문제일 수 있다. Agent가 선택한 control vector의 결과를 예측하는 forward dynamics와 같은 objective로 취급하지 않는다.</Misconception>
      </section>

      <section id="evaluation-transfer" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 representation은 하나의 probe가 아니라 transfer 경계로 검증한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>먼저 frozen feature에서 motion, object state와 action anticipation을 작은 probe가 읽을 수 있는지 본다. 그다음 action-conditioned predictor를 붙였을 때 같은 data budget에서 pixel model보다 multi-step latent error와 planning compute가 줄어드는지 비교한다. 마지막으로 train camera와 다른 view, object와 lighting에서 real closed-loop success가 유지되는지 본다.</p>
          <p>Camera가 25 cm 이동했을 때 성능이 떨어지면 두 원인을 분리한다. 첫째는 visual representation이 새로운 viewpoint에 약한 domain shift다. 둘째는 action이 camera frame에 묶여 있어 physical command가 달라진 calibration error다. Representation article은 첫 원인을 소유하고 두 번째는 dynamics article로 넘긴다.</p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['01', 'Feature probe', 'Frozen latent에서 motion·object·depth 관련 target을 읽는다.', 'Probe가 강하면 backbone 능력과 섞일 수 있다.'],
            ['02', 'Future prediction', 'Held-out clip의 masked·future latent를 예측한다.', 'Teacher-forced metric은 own-rollout drift를 숨긴다.'],
            ['03', 'Action post-training', '같은 action data budget에서 next-state와 short rollout을 비교한다.', '좌표·timestamp가 틀리면 representation과 무관하게 실패한다.'],
            ['04', 'Closed-loop transfer', '새 camera·object에서 goal task와 recovery를 반복한다.', '성공률만 보고 위험한 near-miss를 버리지 않는다.'],
          ].map(([index, title, evidence, caveat]) => <div key={index} className="grid gap-2 py-5 sm:grid-cols-[3rem_9rem_minmax(0,1fr)_minmax(0,1fr)]"><span className="font-mono text-xs font-black text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><span className="text-xs leading-relaxed text-muted-foreground">{evidence}</span><span className="text-xs leading-relaxed text-rose-700 dark:text-rose-300">{caveat}</span></div>)}
        </div>
        <StopRule>모든 self-supervised vision 논문을 읽지 않는다. Context·target·stop-gradient·EMA를 설명하고, action-free prediction이 보존하는 정보와 causal action contract의 차이를 판정하면 다음 단계로 올라간다.</StopRule>
        <CapabilityCheck items={[
          'Physical state, sensor observation, belief와 learned representation을 구분한다.',
          'Pixel reconstruction과 latent prediction이 최적화하는 오차를 비교한다.',
          'Context encoder, predictor, EMA target encoder와 mask의 실행 순서를 그린다.',
          'Stop-gradient/EMA collapse 방지와 autoregressive rollout drift를 서로 다른 failure로 설명한다.',
          'Action-free video prediction을 intervention model이나 robot policy로 확대하지 않는다.',
          '새 camera에서 visual domain shift와 action calibration error를 분리해 측정한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Meta AI · V-JEPA 2 paper', href: 'https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/', note: 'Visual mask denoising, 대규모 action-free video pretraining과 action-conditioned post-training의 1차 근거.' },
          { label: 'Meta AI · I-JEPA', href: 'https://ai.meta.com/research/publications/self-supervised-learning-from-images-with-a-joint-embedding-predictive-architecture/', note: 'Joint-embedding prediction, context·target encoder와 representation-space objective의 기반.' },
          { label: 'Google DeepMind · Genie 3', href: 'https://deepmind.google/models/genie/', note: 'Longer interactive visual consistency와 공개 limitation을 비교하는 공식 자료.' },
        ]} />
      </section>
    </>
  );
}
