import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { CadenceDecisionViz } from './animation-production/viz/ProductionDecisionViz';

export default function AnimationFpsVfiArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FPS는 부드러움 점수가 아니라 시간을 표시하는 계약이다</h2>
        <QuestionLead
          question="24fps 결과를 48fps로 보간하면 animation 품질이 두 배 좋아질까?"
          answer="아니다. 표시 frame은 늘지만 새 drawing이 의도에 맞는지는 별도 문제다. On twos(한 drawing을 두 frame 유지하는 cadence)의 hold, smear와 한 frame짜리 impact 사이에 그럴듯한 중간 frame을 넣으면 더 부드러워 보여도 동작의 힘과 읽기 쉬운 silhouette가 사라질 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Display FPS', meaning: 'Player가 1초에 표시하는 frame 수다.', why: 'Duration과 encode·playback timing을 계산한다.' },
          { term: 'Drawing cadence', meaning: '서로 다른 pose·drawing이 실제로 바뀌는 배치 규칙이다.', why: '같은 frame을 유지한 hold를 결함으로 오해하지 않는다.' },
          { term: 'VFI', meaning: '두 관측 frame 사이의 보이지 않은 중간 frame을 추정하는 후처리다.', why: 'Model이 생성한 motion과 postprocess가 만든 motion을 분리한다.' },
          { term: 'Shutter interval', meaning: '한 frame의 노출이 시간축 motion을 누적하는 구간이다.', why: 'Motion blur와 frame interpolation을 같은 것으로 취급하지 않는다.' },
          { term: 'On twos', meaning: '한 drawing을 두 display frame 동안 유지하는 전통 cadence다.', why: '24fps 파일이 항상 초당 24개의 새 drawing을 뜻하지 않음을 보여 준다.' },
          { term: 'Key·smear·impact·settle', meaning: '핵심 pose, 빠른 이동을 과장한 그림, 충돌 강조 frame, 동작 뒤 안정되는 frame이다.', why: 'VFI가 보존해야 할 서로 다른 timing 역할을 구분한다.' },
        ]} />
        <CadenceDecisionViz />
      </section>

      <section id="timing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Timing은 언제, spacing은 얼마나 이동했는가다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Frame <M>{String.raw`k`}</M>가 표시되는 시간은 <M>{String.raw`k/f`}</M>다. 그러나 pose <M>{String.raw`p_k`}</M>가 같은 frame 동안 유지되면
            물체 속도는 단순한 “frame 수”로 읽을 수 없다. Animation의 spacing은 연속 pose 사이 위치 차이를 의도적으로 넓히거나 좁혀 acceleration과 emphasis를 만든다.
          </p>
          <M display>{String.raw`\begin{aligned}
            t_k&=\underbrace{\frac{k}{f_{\text{display}}}}_{\text{k번째 frame의 표시 시각}}\\
            \Delta p_k&=\underbrace{p_{k+1}-p_k}_{\text{두 drawing 사이 spacing}}\\
            \text{hold}_k&=\underbrace{\mathbf 1[p_{k+1}=p_k]}_{\text{pose를 의도적으로 유지한 구간}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Display FPS는 시계를 정하고 spacing은 pose 변화량을 정한다. 같은 24fps에서도 hold 길이와 drawing spacing을 다르게 두면 전혀 다른 motion rhythm이 된다."
            symbols={[
              [String.raw`t_k`, 'k번째 표시 frame의 timestamp'],
              [String.raw`f_{display}`, '파일·player가 사용하는 표시 FPS'],
              [String.raw`p_k`, '관심 point, skeleton 또는 drawing pose'],
              [String.raw`\Delta p_k`, '연속 drawing 사이의 위치·pose 변화량'],
            ]}
          />
          <p>
            Base generation manifest에는 requested frame 수·FPS와 실제 output timestamp를 모두 남긴다. 일부 runtime은 model이 생성하는 latent frame 규칙과 최종 encode FPS가 다르다.
            Frame duplication, temporal VAE padding, audio mux가 duration을 바꿀 수 있어 최종 MP4 metadata만 봐서는 원인을 알 수 없다.
          </p>
        </div>
      </section>

      <section id="vfi" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">VFI는 두 frame 사이의 관측되지 않은 상태를 추정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            VFI는 이전 frame <M>{String.raw`I_0`}</M>와 다음 frame <M>{String.raw`I_1`}</M>에서 중간 시각 <M>{String.raw`\alpha`}</M>의 image를 만든다.
            실제 방법은 bidirectional flow, visibility mask, feature synthesis와 refinement를 사용한다. 아래 식은 warp 기반 직관이다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \hat I_{\alpha}&=
              \underbrace{m_{\alpha}\odot \operatorname{warp}(I_0,F_{0\rightarrow\alpha})}_{\text{앞 frame에서 이동한 가시 영역}}\\
              &\quad+\underbrace{(1-m_{\alpha})\odot \operatorname{warp}(I_1,F_{1\rightarrow\alpha})}_{\text{뒤 frame에서 되돌린 가시 영역}}\\
            \alpha&\in\underbrace{(0,1)}_{\text{두 입력 frame 사이의 상대 시각}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="VFI는 이미 존재하는 두 frame 사이의 motion과 visibility를 추정한다. Smear와 impact가 의도된 특수 drawing인지 알지 못하면 두 모양을 평균적인 중간 상태로 연결해 연출을 약하게 만들 수 있다."
            symbols={[
              [String.raw`I_0,I_1`, '보간 전후의 관측 frame'],
              [String.raw`F_{0\to\alpha},F_{1\to\alpha}`, '각 입력에서 중간 시각으로 이동시키는 motion field'],
              [String.raw`\operatorname{warp}(I,F)`, 'Motion field F를 따라 image I의 pixel을 옮겨 중간 위치에서 다시 표본화하는 연산'],
              [String.raw`\odot`, 'Mask와 image를 같은 pixel 위치끼리 곱하는 원소별 곱'],
              [String.raw`m_\alpha`, '가려짐과 가시 영역을 섞는 mask'],
              [String.raw`\hat I_\alpha`, '새로 추정한 중간 frame'],
            ]}
          />
          <p>
            Animation은 평평한 색 영역과 선이 많아 texture 기반 correspondence가 약하고, 과장된 motion은 displacement가 크고 비선형이다. Smear는 물체의 실제 중간 형태가 아니라 속도와 힘을 전달하는 기호일 수 있다.
            그러므로 일반 실사 VFI metric이 높아도 line topology와 timing intent가 깨질 수 있다.
          </p>
          <CitationBlock source="Deep Animation Video Interpolation in the Wild" citeKey={1} href="https://arxiv.org/abs/2104.02495">
            <p>AnimeInterp는 animation VFI에서 texture가 부족한 color region과 크고 비선형적인 과장 motion을 별도 난점으로 정의하고 segment-guided matching과 recurrent flow refinement를 제안한다.</p>
          </CitationBlock>
          <CitationBlock source="Real-Time Intermediate Flow Estimation" citeKey={2} href="https://arxiv.org/abs/2011.06294">
            <p>RIFE는 temporal encoding과 intermediate flow를 이용해 arbitrary-time interpolation을 다룬다. 공식 구현의 최신 animation-oriented checkpoint 주장은 원 논문의 보편 보장과 구분한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="motion-blur" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Motion blur는 중간 frame 생성이 아니라 시간 적분이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이상적인 camera blur는 shutter가 열린 구간의 radiance를 한 frame에 누적한 결과로 볼 수 있다. VFI는 여러 discrete frame을 추가하지만 motion blur는 한 frame 내부에 시간 변화를 합친다.
            Animation smear는 둘과 또 다르다. Animator가 동작을 읽히게 하려고 만든 의도된 deformation이다.
          </p>
          <M display>{String.raw`\begin{aligned}
            B_k&=\underbrace{\frac{1}{\Delta t_s}\int_{t_k-\Delta t_s/2}^{t_k+\Delta t_s/2}L(\tau)\,d\tau}_{\text{shutter가 열린 시간의 빛을 한 frame에 누적}}\\
            \Delta t_s&=\underbrace{\rho/f_{\text{display}}}_{\text{shutter fraction으로 정한 노출 시간}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Motion blur는 한 exposure 안의 변화를 합친 것이고 VFI는 중간 image를 별도 frame으로 만든다. Smear drawing은 물리 적분 결과가 아니라 연출자가 설계한 pose일 수 있다."
            symbols={[
              [String.raw`B_k`, 'k번째 blur frame'],
              [String.raw`L(\tau)`, '시간 τ에서 camera가 받을 scene radiance'],
              [String.raw`\Delta t_s`, 'shutter가 열려 있는 시간'],
              [String.raw`\rho`, '한 frame interval 중 노출에 쓰는 비율'],
            ]}
          />
          <Misconception>Smear frame을 “나쁜 blur”로 자동 제거하지 않는다. Source cadence label과 shot intent가 먼저다.</Misconception>
        </div>
      </section>

      <section id="failure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Native·VFI·blur·encode를 단계별로 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>Native decode:</strong> Model이 낸 원 frame과 timestamp를 lossless image sequence로 저장한다.</li>
            <li><strong>Cadence map:</strong> Hold, key pose, smear, impact와 settle frame을 사람이 <strong>protected cadence marker</strong>로 표시한다. 이는 후처리 뒤에도 의도대로 남아야 하는 timing 표식이다.</li>
            <li><strong>VFI variants:</strong> 2× 결과를 일반 checkpoint와 animation-oriented checkpoint로 따로 만든다.</li>
            <li><strong>Blur variants:</strong> VFI 없이 shutter blur만, VFI 뒤 blur, 아무 처리 없음으로 분리한다.</li>
            <li><strong>Delivery encode:</strong> Codec, GOP, pixel format와 mux 뒤 frame timestamp·audio sync를 다시 잰다.</li>
          </ol>
          <p>Frame별 failure owner는 다음처럼 적는다.</p>
          <ul>
            <li><strong>Native부터 손이 붕괴:</strong> generation·conditioning·adaptation 문제</li>
            <li><strong>VFI에서만 선이 두 겹:</strong> correspondence·occlusion·interpolation 문제</li>
            <li><strong>Blur에서 impact가 약해짐:</strong> shutter 범위·compositing 문제</li>
            <li><strong>MP4에서만 timing이 밀림:</strong> encode timebase·frame rate conversion·mux 문제</li>
          </ul>
        </div>
        <StopRule>
          Native decode나 cadence map에서 이미 결함을 찾으면 VFI·blur·encode variant 비교를 멈추고 그 상류 owner를 먼저 고친다. 상류가 통과한 뒤 처음 새로 깨지는 단계만 다음 실험 대상으로 삼는다.
        </StopRule>
        <CapabilityCheck items={[
          'Display FPS와 drawing cadence를 같은 값으로 말하지 않는다.',
          'VFI, motion blur와 artist-authored smear가 각각 만드는 결과를 구분할 수 있다.',
          'Native decode부터 delivery encode까지 earliest temporal failure를 찾을 수 있다.',
          '48fps가 더 부드러워도 impact와 hold 의도를 해치면 reject할 수 있다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 <InternalLink slug="animation-video-evaluation">Evaluation·Release</InternalLink> 글에는 native·VFI·blur·encode variant와 earliest temporal failure를 넘긴다. 최종 평가는 이 단계별 evidence를 같은 manifest에서 비교한다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'AnimeInterp paper', href: 'https://arxiv.org/abs/2104.02495', note: 'Animation-specific interpolation의 textureless region과 exaggerated nonlinear motion 근거.' },
          { label: 'RIFE paper', href: 'https://arxiv.org/abs/2011.06294', note: 'Arbitrary-time intermediate flow estimation의 canonical mechanism.' },
          { label: 'RIFE official repository', href: 'https://github.com/hzwer/ECCV2022-RIFE', note: 'ECCV 2022 RIFE의 arbitrary timestep과 2×·4× 실행을 확인할 구현 근거.' },
          { label: 'Practical-RIFE', href: 'https://github.com/hzwer/Practical-RIFE', note: '공식 구현 저자가 안내하는 practical·anime-oriented model 계열과 checkpoint 경계.' },
        ]} />
      </section>
    </div>
  );
}
