import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { AdaptationDecisionViz, ProductionContractViz } from './animation-production/viz/ProductionDecisionViz';

export default function AnimationProductionWorkflowArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 번 멋진 영상과 다시 만들 수 있는 장면은 다르다</h2>
        <BeginnerOpening
          title="영상 제작은 우연히 잘 나온 한 번을 고르는 일이 아니다"
          description={<>여기서 <strong>장면(shot)</strong>은 카메라가 이어서 보여 주는 짧은 영상 단위다. 영상 생성 모델은 글이나 참고 이미지를 받아 장면 후보를 만들지만, 매번 같은 인물·동작·카메라를 보존해 주지는 않는다.</>}
          familiarScene={<>단체 사진 한 장을 고를 때는 가장 잘 나온 사진만 찾으면 된다. 하지만 같은 캐릭터가 뛰고 착지하는 7초 장면을 제작하려면 첫 프레임부터 마지막 프레임까지 얼굴, 옷, 동작 순서와 카메라가 이어져야 한다.</>}
          steps={[
            { label: '목표를 장면으로 쪼갠다', detail: '누가 무엇을 하고 어느 순간을 강조할지 시간 순서로 적는다.' },
            { label: '바뀌면 안 될 것을 고정한다', detail: '얼굴, 의상, 선화, 카메라와 길이를 통과 조건으로 만든다.' },
            { label: '결과가 아니라 과정을 남긴다', detail: '입력, 모델 버전, 실패 위치와 수정 방법을 함께 기록한다.' },
          ]}
        />
        <QuestionLead
          question="최신 영상 생성 모델에 '멋진 2D 액션 장면'이라고 쓰고 가장 좋은 결과 하나를 고르면 제작이 끝날까?"
          answer="아니다. 멋져 보이는 한 후보와 반복해서 납품할 수 있는 장면은 다르다. 캐릭터 정체성, 선화, 동작의 박자, 카메라, 소리, 실행 비용과 사용 권리를 먼저 조건으로 고정해야 무엇을 고치고 무엇을 보존할지 결정할 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Shot contract', meaning: '한 장면이 반드시 지켜야 할 내용·시간·품질·권리 조건이다.', why: '좋은 느낌을 재현 가능한 통과 조건으로 바꾼다.' },
          { term: 'Invariant', meaning: '적응이나 후처리 뒤에도 바뀌면 안 되는 속성이다.', why: 'Style을 고치다가 identity와 timing을 잃는 회귀를 잡는다.' },
          { term: 'Intervention', meaning: 'Prompt, control, LoRA, full tune, postprocess처럼 결과를 바꾸는 한 개입이다.', why: '원인과 효과를 연결해 다음 실험을 정한다.' },
          { term: 'Release evidence', meaning: '결과 영상뿐 아니라 manifest, metric, failure와 권리 근거를 묶은 기록이다.', why: '다른 기계와 다음 version에서 같은 판단을 재현한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            7초짜리 도약 장면을 만든다고 하자. 초반 anticipation, 한 장의 smear, 착지 순간 impact, 이후 settle이 읽혀야 한다.
            캐릭터의 얼굴·의상·소품은 유지되어야 하고 camera는 고정이어야 한다. 이때 “anime style”은 목표의 일부일 뿐이다. Model이 선화는 잘 그려도
            camera가 흔들리거나 impact가 사라지면 shot은 실패다.
          </p>
          <p>
            그래서 제작 경로는 model leaderboard가 아니라 아래 일곱 결정을 따라간다. 최신 모델이 추가되어도 contract·baseline·data·condition·adaptation·temporal finishing·release라는
            계약은 남는다. 특정 model은 이 계약을 실행하는 후보이지 학습 경로의 뼈대가 아니다.
          </p>
        </div>
        <ProductionContractViz />
      </section>

      <section id="acceptance-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">성공을 한 점수가 아니라 hard gate 묶음으로 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 내용 계약을 적는다. 누가 무엇을 하고, 어느 순간이 강조되고, camera와 audio가 어떻게 움직이는지 쓴다. 다음으로 보존 계약을 적는다.
            캐릭터 identity, line language, palette, 대사 timing처럼 바뀌면 안 되는 축이다. 마지막으로 운영 계약을 적는다. 허용 GPU, 최대 latency,
            model·dataset license와 source provenance가 여기에 속한다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \operatorname{Release}(y)&=
              \underbrace{\mathbf 1[q_{\text{identity}}\ge \tau_i]}_{\text{캐릭터 보존}}\cdot
              \underbrace{\mathbf 1[q_{\text{motion}}\ge \tau_m]}_{\text{동작 의도}}\\
              &\quad\cdot\underbrace{\mathbf 1[c_{\text{runtime}}\le B]}_{\text{계산 예산}}
              \cdot\underbrace{\mathbf 1[r_{\text{rights}}=1]}_{\text{권리 확인}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Release는 평균 품질이 높다는 뜻이 아니다. 하나라도 반드시 지켜야 할 gate가 닫히면 결과를 내보내지 않는다. Threshold는 프로젝트별로 정하고 version과 함께 기록한다."
            symbols={[
              [String.raw`q_{identity}`, '얼굴·의상·소품이 시간축에서 유지되는 정도'],
              [String.raw`q_{motion}`, 'anticipation·smear·impact 같은 동작 의도가 읽히는 정도'],
              [String.raw`\tau_i`, 'identity gate를 통과하기 위해 필요한 최소 점수'],
              [String.raw`\tau_m`, 'motion gate를 통과하기 위해 필요한 최소 점수'],
              [String.raw`c_{runtime}`, 'peak VRAM, wall time 또는 비용처럼 제한한 실행 자원'],
              [String.raw`B`, '프로젝트가 허용한 runtime 자원의 최대 상한'],
              [String.raw`r_{rights}`, 'dataset, weight와 output 사용 조건을 모두 확인했으면 1인 gate'],
            ]}
          />
          <p>
            곱셈은 “권리가 확인되지 않아도 품질 95점이면 출시” 같은 평균의 함정을 막는다. 반대로 모든 지표를 hard gate로 만들면 실험이 멈춘다.
            따라서 치명 조건과 개선 조건을 나눈다. Identity 붕괴와 권리 미확인은 hard gate, 약한 background detail은 soft score처럼 운영한다.
          </p>
          <Misconception>Animation 품질은 realism의 반대말이 아니다. 의도된 과장과 우연한 붕괴를 구분하는 별도 계약이다.</Misconception>
          <CitationBlock source="AniMatrix: An Anime Video Generation Model that Thinks in Art, Not Physics" citeKey={1} href="https://arxiv.org/abs/2605.03652">
            <p>AniMatrix는 animation을 Style, Motion, Camera, VFX의 production variable로 구조화하고, 의도된 deformation과 pathological collapse를 구분하는 문제를 제기한다. 공개 준비 중인 artifact를 이미 재현 가능하다고 확대하지 않는다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="baseline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">데이터를 모으기 전에 base failure를 먼저 잰다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “데이터셋이 먼저”라는 말은 절반만 맞다. 실제 프로젝트에서는 사용할 수 있는 base checkpoint와 inference graph를 먼저 고정하고,
            작은 closed set, 즉 같은 조건으로 반복 실행하는 검증용 shot 묶음을 돌려 실패를 분류해야 한다. Base가 이미 style을 만족하는데 무작정 style data를 모으면 필요 없는 LoRA를 만들 수 있다.
          </p>
          <p>Baseline은 최소 다음을 고정한다.</p>
          <ol>
            <li>model, VAE(video를 압축 latent와 pixel 사이에서 변환하는 모듈), text encoder(prompt를 model이 읽는 embedding으로 바꾸는 모듈)의 revision과 license</li>
            <li>T2V(text-to-video)·I2V(image-to-video)·V2V(video-to-video)처럼 무엇을 시작 조건으로 쓰는지, prompt·negative prompt와 reference</li>
            <li>seed, frame·resolution·FPS, sampler(노이즈를 줄이는 수치 절차)·steps(그 절차의 반복 횟수)·guidance(text 지시를 따르는 힘), dtype(계산 숫자의 정밀도)·offload(GPU에 없던 tensor를 CPU로 옮기는 정책)</li>
            <li>raw decode와 interpolation·upscale·encode 전후 artifact</li>
            <li>처음 실패한 frame, 실패 축과 재현 횟수</li>
          </ol>
          <pre><code>{`shot: leap_01
acceptance: [identity, fixed_camera, readable_impact, commercial_rights]
runtime: {model_revision, vae_revision, seed, frames, fps, steps, dtype}
first_failure:
  frame: 73
  stage: native_decode
  owner: identity_persistence
  evidence: face changes before interpolation`}</code></pre>
          <p>
            이 trace가 있어야 “보간이 얼굴을 망쳤다”와 “native generation에서 이미 얼굴이 바뀌었다”를 구분한다. 최신 video runtime의 tensor·memory 경계는
            <InternalLink slug="video-model-runtime">Video Model Runtime</InternalLink>에서 내려가 확인한다.
          </p>
        </div>
      </section>

      <section id="intervention" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">가장 작은 개입으로 원인을 좁힌다</h2>
        <AdaptationDecisionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 사다리는 모든 단계를 의무적으로 실행하라는 뜻이 아니다. 가중치를 바꾸기 전에 더 작은 개입으로 원인이 해결되는지 확인하라는 증거 순서다.
            먼저 motion verb와 sampling을 고친다. 그래도 골격·camera path가 무너지면 pose·edge·depth 같은 structural control을 시험한다. 구조는 이미 맞고
            character style만 반복해서 부족하면 그때 LoRA 후보가 된다. Base의 motion prior 자체가 목표 domain을 놓치고 control과 작은 adapter로도 회복되지 않을 때에야
            충분한 video data와 full adaptation을 검토한다.
          </p>
          <p>
            이 순서는 비용만 아끼기 위한 것이 아니다. Intervention이 작을수록 실패의 원인을 설명하기 쉽고 base 능력을 보존하기 쉽다. Full fine-tuning은
            마지막 수단이 아니라 별도의 증거 수준을 요구하는 선택이다. 더 많은 data, <strong>retention set</strong>(적응 뒤에도 base의 기존 능력이 남았는지 확인하는 보존용 예제 묶음), checkpoint rollback과 권리 검토가 필요하다.
          </p>
          <StopRule>Animation을 이해하기 위해 모든 video generation 논문을 거슬러 내려가지 않는다. 현재 shot의 실패를 설명할 수 있는 condition, temporal state, adaptation과 evaluation 계약에서 멈춘다.</StopRule>
        </div>
      </section>

      <section id="reading-route" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나머지 다섯 글은 제작 단계가 아니라 판단 책임으로 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><InternalLink slug="animation-video-dataset">데이터셋 계약</InternalLink>: failure를 가르칠 clip, time, group split과 provenance를 만든다.</li>
            <li><InternalLink slug="animation-captioning">캡션·조건 신호</InternalLink>: 관측 사실과 연출 의도를 분리하고 자동 caption 오류를 검수한다.</li>
            <li><InternalLink slug="animation-lora-training">적응·제어</InternalLink>: Prompt, structural control, LoRA와 full tune의 책임을 구분한다.</li>
            <li><InternalLink slug="animation-fps-vfi">시간 표현</InternalLink>: drawing cadence, display FPS, VFI와 motion blur를 분리한다.</li>
            <li><InternalLink slug="animation-video-evaluation">평가·릴리스</InternalLink>: closed/open set, hard gate, runtime·rights manifest로 결과를 닫는다.</li>
          </ol>
          <p>
            실제 실행에서는 앞뒤를 왕복한다. Baseline에서 caption 오류를 발견하면 dataset보다 caption을 먼저 고칠 수 있고, VFI failure가 원인이면 training 없이 temporal finishing만 바꾼다.
            학습 순서는 공통 언어를 만드는 순서이며 모든 프로젝트의 고정 waterfall이 아니다.
          </p>
        </div>
        <CapabilityCheck items={[
          '모델 이름 없이도 한 animation shot의 hard gate와 soft score를 작성할 수 있다.',
          '데이터 수집 전에 base runtime과 earliest failure를 고정해야 하는 이유를 설명할 수 있다.',
          'Prompt, structural control, LoRA와 full tune 중 가장 작은 개입을 선택할 수 있다.',
          '품질, runtime과 rights를 한 release decision으로 묶되 서로 다른 evidence로 유지할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'AniMatrix paper', href: 'https://arxiv.org/abs/2605.03652', note: 'Animation production taxonomy, dual-channel conditioning과 deformation-aware evaluation의 최신 연구 근거.' },
          { label: 'AnimationBench paper', href: 'https://arxiv.org/abs/2604.15299', note: 'Animation-specific quality dimensions와 closed/open-set evaluation의 근거.' },
          { label: 'LTX-2 official trainer', href: 'https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer', note: 'Dataset preprocessing, LoRA·full·IC-LoRA를 실제 실행하는 공개 사례.' },
        ]} />
      </section>
    </div>
  );
}
