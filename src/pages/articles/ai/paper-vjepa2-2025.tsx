import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
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
  VjepaEvidenceLab,
  VjepaStageLab,
  VjepaTrainingLab,
} from './paper-vjepa2-2025/viz/Vjepa2PaperLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[12px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperVjepa22025() {
  return (
    <>
      <SpecialistEntry
        eyebrow="현재 연구 논문 읽기"
        title="V-JEPA 2의 video 표현에서 robot planning까지 증거를 잇는 글"
        description="Video의 숨은 표현을 예측하는 단계와 action-conditioned robot predictor를 학습하는 단계를 분리해 읽는다. World model과 action 조건의 역할을 먼저 알면 논문의 claim 경계가 보인다."
        prerequisites={[
          'Pixel 복원과 latent representation 예측이 다른 학습 목표임을 안다.',
          '현재 state와 action이 다음 state를 바꾼다는 dynamics 관점을 안다.',
          '예측 model과 실제 action을 고르는 planner가 다른 구성요소임을 안다.',
        ]}
        links={[
          { slug: 'action-conditioned-world-dynamics', title: 'Action-conditioned world dynamics', reason: 'Action이 미래 예측을 갈라 놓는 이유를 먼저 배운다.' },
          { slug: 'world-model-planning-closed-loop', title: 'World model planning', reason: '예측을 goal, search와 feedback에 연결하는 실행 구조를 본다.' },
        ]}
      />
      <section id="research-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">행동 label 없는 video가 robot planning의 기반이 될 수 있을까?</h2>
        <QuestionLead
          question="다음 장면을 잘 예측하는 video encoder에 action vector만 붙이면 바로 robot world model이 될까?"
          answer="아니다. Action-free pretraining은 장면의 motion과 object state를 압축하는 표현을 만든다. 하지만 같은 현재 장면에서 왼쪽 command와 오른쪽 command가 어떤 다른 미래를 만드는지는 interaction data가 필요하다. V-JEPA 2는 큰 video data로 표현을 먼저 배우고 encoder를 얼린 뒤, 62시간보다 적은 DROID trajectory로 action-conditioned predictor만 학습해 두 문제를 분리한다."
        />
        <ConceptPrimer items={[
          {
            term: 'Joint embedding prediction',
            meaning: 'Pixel을 복원하지 않고 보이지 않는 video patch의 target representation을 예측한다.',
            why: 'Texture 전체보다 motion·object state에 유용한 latent를 학습하려는 기반 objective다.',
          },
          {
            term: 'Action-free model',
            meaning: 'Video의 관측 변화는 배우지만 robot command를 조건으로 받지 않는 predictor다.',
            why: '대규모 internet video는 많지만 정확한 robot action log가 없는 data 비대칭을 활용한다.',
          },
          {
            term: 'Action-conditioned model',
            meaning: '현재 latent, end-effector state와 command에서 future latent를 예측한다.',
            why: '후보 action마다 예상 결과가 달라져 planner가 command를 비교할 수 있다.',
          },
          {
            term: 'Model-predictive control',
            meaning: '여러 action sequence를 model 안에서 평가하고 첫 action만 실행한 뒤 다시 계획한다.',
            why: '긴 open-loop prediction을 믿지 않고 실제 camera feedback으로 model error를 매 step 보정한다.',
          },
        ]} />
        <VjepaStageLab />
        <Misconception>
          V-JEPA 2는 하나의 end-to-end robot policy가 아니다. V-JEPA 2 encoder, V-JEPA 2-AC predictor와
          CEM planner가 서로 다른 단계와 data를 가진다. 이 경계를 없애면 web video가 직접 action을
          supervision했다거나 planner가 학습된 policy라는 잘못된 설명이 된다.
        </Misconception>
      </section>

      <section id="action-free-pretraining" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보이지 않는 pixel 대신 보이지 않는 representation을 맞힌다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            V-JEPA 2는 2,200만 video, 100만 시간이 넘는 video를 포함한 data에서 시작한다. Video를
            2×16×16 tubelet token으로 나누고 일부를 drop한다. Context encoder는 남은 token만 처리하고
            predictor는 learnable mask token의 위치에서 target representation을 맞힌다. Target은 encoder
            weight의 exponential moving average인 teacher encoder가 full view에서 만든다.
          </p>
          <p>
            Stop-gradient는 target branch가 predictor를 따라 즉시 움직이지 않게 하고 EMA는 target을 천천히
            갱신한다. Loss는 masked patch prediction에만 적용된다. 연구는 data를 2M에서 22M video로, encoder를
            300M에서 1B 이상으로 늘리고 training을 90k에서 252k iteration으로 늘렸으며 마지막 decay 단계에서
            resolution과 clip length를 높였다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\hat z_y}_{\text{가린 위치의 예측}}
&=\underbrace{P_\phi(\Delta_y,E_\theta(x))}_{\text{보이는 patch로 예측}}\\
\underbrace{z_y^\star}_{\text{움직이지 않는 목표}}
&=\underbrace{\operatorname{sg}(E_{\bar\theta}(y))}_{\text{EMA teacher 출력}}\\
\underbrace{\mathcal L_{\rm JEPA}}_{\text{latent 예측 오차}}
&=\left\|\hat z_y-z_y^\star\right\|_1
\end{aligned}`}
          meaning="Masked view x의 보이는 patch를 online encoder가 읽고 predictor가 mask 위치 Δy의 representation을 낸다. Full view y를 EMA teacher가 encoding한 target에는 stop-gradient를 적용한다. RGB 복원 loss가 아니므로 어떤 pixel detail을 버리고 어떤 latent structure를 보존했는지는 downstream probe로 확인해야 한다."
          symbols={[
            [String.raw`\hat z_y`, '가려진 target 위치에서 predictor가 만든 latent'],
            [String.raw`z_y^\star`, 'Full view를 읽은 EMA teacher의 고정 target latent'],
            [String.raw`x`, '일부 spatiotemporal tubelet을 제거한 masked video view'],
            [String.raw`y`, 'Prediction target을 만들 full video view'],
            [String.raw`E_\theta`, 'Gradient로 update되는 online video encoder'],
            [String.raw`E_{\bar\theta}`, 'Online weight의 EMA로 천천히 갱신되는 target encoder'],
            [String.raw`\Delta_y`, '가려진 patch의 위치를 알려 주는 learnable mask token'],
            [String.raw`\operatorname{sg}`, 'Target branch로 gradient가 흐르지 않게 하는 stop-gradient'],
          ]}
        />
      </section>

      <section id="action-conditioned-training" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">16 frame에서 15개의 robot transition을 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            V-JEPA 2-AC는 DROID의 raw trajectory 약 23k개에서 4초 clip을 뽑는다. 4fps이므로 16개 frame이
            되고, 각 frame에는 robot base 기준 7D end-effector state가 붙는다. 앞 세 값은 Cartesian position,
            다음 세 값은 extrinsic Euler orientation, 마지막은 gripper state다. 이웃 state의 차이로 15개의
            7D action을 만든다.
          </p>
          <p>
            각 frame은 frozen ViT-g encoder에서 <strong>16×16×1408</strong> feature map이 된다. Action, state,
            flatten한 patch feature는 별도 affine projection으로 predictor width 1024에 들어간다. Predictor는
            약 300M parameters, 24 layers, 16 heads와 GELU를 쓰며 block-causal mask로 현재와 과거 time block만
            읽는다. Encoder는 이 post-training에서 움직이지 않는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{a_k}_{\text{7D action}}
&=\underbrace{s_{k+1}}_{\text{다음 7D 상태}}
-\underbrace{s_k}_{\text{현재 7D 상태}}\\
k&=1,\ldots,15
\end{aligned}`}
          meaning="16 frame의 연속 end-effector state에서 15개 delta action을 만든다. 이 7D 정의는 V-JEPA 2-AC의 실제 DROID instantiation이다. 다른 paper의 6D rotation representation이나 다른 robot action convention을 섞으면 source-faithful 재현이 아니다."
          symbols={[
            [String.raw`s_k`, 'Robot base 기준 position 3 + extrinsic Euler 3 + gripper 1'],
            [String.raw`a_k`, '이웃 frame 사이 end-effector state 변화 7D'],
            [String.raw`k=1,\ldots,15`, '16 frame clip에서 생기는 transition 수'],
            ['Robot base frame', 'Camera pixel 축이 아니라 command가 정의된 물리 좌표 기준'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\hat z_{k+1}}_{\text{다음 latent 예측}}
&=\underbrace{P_\phi((a_t,s_t,z_t)_{t\le k})}_{\text{지금까지의 action·state·latent}}\\
\underbrace{\mathcal L_{\rm TF}}_{\text{15개 전이의 평균 오차}}
&=\frac1{15}\sum_{k=1}^{15}
\left\|\hat z_{k+1}-\underbrace{z_{k+1}}_{\text{frozen encoder 목표}}\right\|_1
\end{aligned}`}
          meaning="Teacher forcing에서는 매 위치에 실제 encoder feature z를 다시 준다. Predictor는 지금까지의 action·pose·feature block을 읽고 다음 frame representation을 맞힌다. T=15는 16-frame clip 안의 모든 인접 transition을 뜻한다."
          symbols={[
            [String.raw`\hat z_{k+1}`, 'Predictor가 action과 현재 history에서 만든 다음-frame latent'],
            [String.raw`z_t=E(x_t)`, 'Frozen V-JEPA 2 encoder가 frame t에서 만든 feature map'],
            [String.raw`P_\phi`, 'Block-causal action-conditioned transformer predictor'],
            [String.raw`(a_t,s_t,z_t)_{t\le k}`, '현재까지 시간 순서로 interleave한 action·state·visual token'],
            [String.raw`\|\cdot\|_1`, 'Predicted feature map과 target feature map의 L1 distance'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{\mathcal L_{\rm AC}}_{\text{predictor 전체 loss}}=\underbrace{\mathcal L_{\rm TF}^{T=15}}_{\text{실제 latent 입력}}+\underbrace{\mathcal L_{\rm rollout}^{T=2}}_{\text{예측 latent를 한 번 되먹임}}`}
          meaning="실제 recipe의 rollout horizon은 T=2라 predictor를 한 recurrent step 통과해 final target과 비교한다. 논문 Figure 6의 T=4는 설명용 도식이다. T=15, T=2와 T=4를 하나의 training horizon으로 합치면 재현 설정이 달라진다."
          symbols={[
            [String.raw`\mathcal L_{\rm TF}^{T=15}`, '모든 인접 transition에 실제 feature를 넣는 teacher-forcing loss'],
            [String.raw`\mathcal L_{\rm rollout}^{T=2}`, '첫 prediction을 다음 입력으로 사용해 error accumulation을 줄이는 loss'],
            ['단순 합', '원문 Equation 4는 별도 λ 없이 두 loss를 더한다.'],
          ]}
        />
        <VjepaTrainingLab />
      </section>

      <section id="latent-planning" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Goal image와 가까워지는 action을 latent space에서 찾는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현재 frame과 goal image를 같은 frozen encoder로 바꾼다. 후보 action sequence를 predictor에 넣어
            horizon 뒤 latent를 상상하고 goal latent와 L1 distance를 energy로 쓴다. CEM은 처음에 action
            coordinate마다 Gaussian을 두고 여러 trajectory를 sample한 뒤 energy가 낮은 top-k의 평균과 분산으로
            proposal을 반복 갱신한다.
          </p>
          <p>
            Planner는 최종 sequence 전체를 open loop로 실행하지 않는다. 첫 action만 robot에 보내고 완료를
            기다린 뒤 새 frame을 관측해 다시 CEM을 수행한다. 논문의 Table 3 비교는 horizon 1이므로 이
            receding-horizon feedback가 특히 중요하다. 후보 action은 training support 밖의 큰 command를 피하려고
            원점 중심 L1 ball radius 0.075로 제한했다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\widehat z_{\text{상상 결과}}&=P_\phi(\hat a_{1:T};s_k,z_k)\\
\mathcal E_{\text{후보 비용}}(\hat a_{1:T})&=\|\widehat z_{\text{상상 결과}}-z_g\|_1
\end{aligned}`}
          meaning="현재 state에서 후보 action sequence를 실행했다고 model이 상상한 final representation을 goal representation과 비교한다. CEM은 이 식의 gradient를 직접 구하지 않고 sample·elite refit으로 낮은-energy action을 찾는다."
          symbols={[
            [String.raw`\hat a_{1:T}`, 'CEM이 제안한 horizon T의 7D action sequence'],
            [String.raw`s_k,z_k`, '현재 end-effector state와 current image latent'],
            [String.raw`z_g`, 'Goal image를 frozen encoder로 바꾼 target representation'],
            [String.raw`P_\phi`, 'Action sequence를 autoregressive rollout한 V-JEPA 2-AC predictor'],
            [String.raw`\|\cdot\|_1`, 'Imagined final state와 visual goal의 latent energy'],
          ]}
        />
      </section>

      <section id="evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Representation 점수와 robot 성공률을 한 주장으로 합치지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Action-free encoder는 motion understanding, action anticipation과 LLM alignment 뒤 video QA로
            평가했다. AC predictor와 planner는 DROID에 없던 두 lab의 Franka arm에서 reach, grasp, reach with
            object와 pick-and-place로 평가했다. 첫 결과는 representation에 정보가 있음을, 두 번째는 특정
            closed-loop stack에서 그 representation으로 action을 고를 수 있음을 지지한다.
          </p>
        </div>
        <VjepaEvidenceLab />
      </section>

      <section id="limits" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Camera, horizon과 goal 형식이 deployment 경계를 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            V-JEPA 2-AC는 camera calibration을 명시적으로 받지 않고 monocular RGB에서 action 축을 암묵적으로
            추론한다. Robot base가 화면에 보이지 않으면 축이 잘 정의되지 않아 실제 연구팀도 여러 camera
            위치를 수동으로 시도해 하나를 골랐다. “새 lab zero-shot”과 “camera pose에 robust”는 같은 주장이
            아니다.
          </p>
          <p>
            Horizon이 길어지면 autoregressive error가 누적되고 action trajectory search 공간은 지수적으로
            커진다. Pick-and-place에는 grasp와 object-near-goal의 sub-goal image 두 장, placed 상태의 final
            goal image 한 장을 사람이 제공했다. 또한 현재 목표는 image로만 지정하며 language goal은 future work다.
          </p>
        </div>
        <Misconception>
          Table 3의 16초 대 4분은 V-JEPA 2-AC가 800 samples, Cosmos가 80 samples를 쓴 비교다. Latent
          predictor가 훨씬 빠른 실용 결과는 분명하지만 sample 수가 같은 architecture-only speedup으로
          읽으면 안 된다.
        </Misconception>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원문을 닫고 일반 world-model 설계로 돌아간다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 원문의 7D DROID action은 하나의 robot instantiation이다. 여러 embodiment의 frame·unit·timestamp
            계약과 Cosmos식 action projection을 비교하려면
            <InternalLink slug="action-conditioned-world-dynamics">Action-Conditioned Dynamics</InternalLink>로
            돌아간다. CEM, constraint, uncertainty와 release loop를 일반화하려면
            <InternalLink slug="world-model-planning-closed-loop">World Model Planning · Closed Loop</InternalLink>에서
            이어 간다.
          </p>
        </div>
        <StopRule>
          Action-free JEPA objective, frozen encoder 위 AC predictor, 16 frame→15 transition, T=15와 T=2 loss,
          image-goal energy, CEM과 receding horizon, Table 2·3와 camera·goal limitation을 설명할 수 있으면
          V-JEPA 2 아래로 더 내려가지 않는다.
        </StopRule>
        <CapabilityCheck items={[
          'Action-free representation 학습과 action-conditioned transition 학습의 data와 module을 구분한다.',
          '16 frame·4fps clip에서 15개의 7D action을 만드는 과정을 설명한다.',
          'Teacher forcing T=15, rollout T=2와 Figure 6의 설명용 T=4를 혼동하지 않는다.',
          'Frozen encoder와 약 300M predictor 사이에서 gradient가 어디까지 흐르는지 말한다.',
          'Image-goal L1 energy, CEM sample-refit과 첫 action만 실행하는 MPC 순서를 복원한다.',
          'Table 3의 sample 수·latency·success rate를 함께 읽는다.',
          '새 lab 성공과 camera-position robustness를 별도 주장으로 평가한다.',
        ]} />
        <SourceNotes sources={[
          {
            label: 'V-JEPA 2 · arXiv',
            href: 'https://arxiv.org/abs/2506.09985',
            note: 'Stage-wise training, Equations 1~5, architecture, Tables 2~8와 limitations의 1차 근거.',
          },
          {
            label: 'Meta AI publication',
            href: 'https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/',
            note: '공식 연구 페이지와 publication record.',
          },
          {
            label: 'V-JEPA 2 code',
            href: 'https://github.com/facebookresearch/vjepa2',
            note: '공개 checkpoint, evaluation과 training configuration을 paper와 대조하는 source artifact.',
          },
          {
            label: 'DROID dataset',
            href: 'https://droid-dataset.github.io/',
            note: 'Action-conditioned post-training에 사용한 robot trajectory data의 수집·sensor·action 맥락.',
          },
          {
            label: 'Cosmos · Agarwal et al. (2025)',
            href: 'https://arxiv.org/abs/2501.03575',
            note: 'Table 3의 pixel-space action-conditioned video baseline과 fine-tuning 계보. V-JEPA 2의 architecture로 혼합하지 않는다.',
          },
        ]} />
      </section>
    </>
  );
}
