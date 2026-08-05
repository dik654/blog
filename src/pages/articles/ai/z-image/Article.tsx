import type { ReactNode } from 'react';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import ZImageContractLab from './ZImageContractLab';

const sourceRevision = '26f23eda626ffadda020b04ff79488e1d72004cd';
const sourceRoot = `https://github.com/Tongyi-MAI/Z-Image/blob/${sourceRevision}`;

function Milestone({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-20">
      <div className="not-prose mb-5 grid gap-2 border-b border-border pb-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
        <span className="font-mono text-3xl font-black text-muted-foreground/35">{number}</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function EvidenceLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
      <strong className="text-sm">{label}</strong>
      <div className="min-w-0 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{children}</div>
    </div>
  );
}

export default function ZImageArticle() {
  return (
    <>
      <QuestionLead
        question="Z-Image를 쓴다는 말만으로 어떤 모델을 몇 번 계산해 이미지를 만들었는지 알 수 있을까?"
        answer={<>알 수 없다. 현재 공개된 <strong>Z-Image Base</strong>와 <strong>Turbo</strong>는 denoising 횟수와 제어 계약이 다르고, README에 소개된 Omni-Base와 Edit은 검산 revision에서 아직 checkpoint가 공개되지 않았다. 이름보다 artifact, 실행 경로와 증거를 먼저 고정해야 한다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'checkpoint', meaning: '학습이 끝난 weight와 config의 특정 배포 산출물.', why: '같은 계열 이름 안에서도 실행 가능한 기능과 품질·비용이 달라진다.' },
          { term: 'NFE', meaning: 'Noise를 줄이는 network를 한 번 평가한 횟수.', why: '8 NFE와 50 NFE는 sampler UI 숫자가 아니라 핵심 계산 예산 차이다.' },
          { term: 'caption feature', meaning: 'Text encoder가 prompt를 tensor로 바꾼 현재 T2I code의 조건 입력.', why: '문자열 자체가 transformer에 바로 들어간다고 오해하지 않게 한다.' },
          { term: 'image VAE latent', meaning: 'Pixel image를 압축한 뒤 noise가 섞여 denoiser가 처리하는 tensor.', why: '해상도, VAE와 memory가 결과에 개입하는 위치를 찾는다.' },
          { term: 'release state', meaning: '소개됨, code에 존재함, checkpoint가 공개됨을 구분하는 상태.', why: '아직 받을 수 없는 변형을 실행한 것처럼 쓰는 재현 오류를 막는다.' },
        ]}
      />
      <Misconception>
        이 글은 공식 repository revision <code>{sourceRevision.slice(0, 12)}</code>을 기준으로 한다.
        README의 계열 설명과 현재 공개 T2I code가 관찰하게 하는 tensor path를 구분하며, 공개 예정인
        Edit·Omni checkpoint의 내부 동작을 현재 구현처럼 추정하지 않는다.
      </Misconception>

      <Milestone number="01" eyebrow="Artifact before architecture" title="먼저 실행 가능한 변형과 아직 설명만 있는 변형을 가른다">
        <div id="artifact-boundary" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            공식 Model Zoo에서 Z-Image는 하나의 파일명이 아니다. Base는 50 NFE의 생성용 foundation
            checkpoint이고, Turbo는 8 NFE로 trajectory를 압축한 증류 checkpoint다. 같은 표에 있는
            Omni-Base와 Edit은 목표가 설명돼 있지만 Hugging Face와 ModelScope 열이 모두
            <code>To be released</code>다.
          </p>
          <p>
            따라서 “Edit 결과가 좋다”는 showcase와 “현재 독자가 checkpoint를 받아 같은 입력으로
            재현할 수 있다”는 주장은 다르다. 첫 문장은 공개 소개 자료의 범위에서 말할 수 있다. 두 번째
            문장에는 download artifact, revision, 실행 code와 receipt가 필요하다.
          </p>
        </div>
        <ZImageContractLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Availability는 가장 먼저 통과해야 할 gate다. 사용할 수 없는 checkpoint를 workflow 문제로
            잘못 진단하면 독자는 node·VRAM·prompt를 계속 바꾸면서 존재하지 않는 실행 계약을 찾게 된다.
          </p>
        </div>
      </Milestone>

      <Milestone number="02" eyebrow="Current T2I tensor path" title="Prompt와 noisy latent가 refine, concat, transform을 거친다">
        <div id="t2i-token-path" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            현재 공개 T2I pipeline에서 prompt는 text encoder의 hidden state인 caption feature
            <M>{'c'}</M>가 된다. Image 쪽은 VAE latent에 noise가 섞인 <M>{'x_t'}</M>다.
            Transformer는 두 입력을 각각 refiner로 정리한 뒤 sequence 방향으로 이어 붙이고 같은
            block stack에서 혼합한다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72}>{String.raw`\begin{aligned}
s_0&=\Big[\underbrace{R_c(c)}_{\text{문맥을 정리한 caption feature}}\,;\,
\underbrace{R_x(x_t,t)}_{\text{시간 정보를 넣은 image latent}}\Big]\\
\hat v_t&=\underbrace{T_\theta(s_0,t)}_{\text{한 흐름에서 조건과 image를 섞는 S3-DiT}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 현재 공개 T2I 코드에서 관찰되는 두 입력이 각 refiner를 지나 하나의 sequence가 되고, transformer가 다음 latent 이동 방향을 예측하는 이유를 보여 준다."
            symbols={[
              [String.raw`c`, 'Text encoder가 prompt에서 만든 caption feature'],
              [String.raw`x_t`, 't 시점에 noise가 섞인 image VAE latent'],
              [String.raw`R_c,R_x`, '서로 다른 입력 분포를 unified block 전에 정리하는 refiner'],
              [String.raw`T_\theta`, '결합 sequence를 처리하는 S3-DiT transformer'],
              [String.raw`\hat v_t`, 'Solver가 다음 latent 상태를 계산할 때 쓰는 예측'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 README는 계열 수준에서 text, visual semantic, image VAE token을 sequence-level로
            결합한다고 설명한다. 그러나 검산한 T2I code entry에서는 caption feature와 image latent라는
            두 observable input branch가 보인다. 이 둘은 모순이라고 단정할 대상도, 보이지 않는 세 번째
            T2I module을 발명할 근거도 아니다. Family architecture와 현재 code path의 관찰 범위를
            나란히 적는 것이 정확하다.
          </p>
          <p>
            Single-stream은 출처가 다른 token이 같은 transformer block을 공유하면서 매 layer에서
            관계를 갱신한다는 뜻이다. 대가는 전체 sequence 길이에 따른 attention activation과 memory다.
            Denoiser parameter만 보고 VRAM을 예상하면 text encoder, VAE, latent 해상도와 buffer를 놓친다.
          </p>
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="Trajectory compression" title="Turbo의 8 NFE는 긴 경로를 더 짧게 배우게 한 결과다">
        <div id="base-turbo" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Diffusion·flow sampling은 현재 latent에서 network가 예측한 방향을 따라 여러 번 이동하는
            수치 적분으로 볼 수 있다. Base의 50 NFE와 Turbo의 8 NFE 차이는 같은 weight에 steps
            숫자만 바꾼 비교가 아니다. Turbo는 적은 평가에서도 쓸 만한 경로를 내도록 별도로 증류됐다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72}>{String.raw`\begin{aligned}
x_{k+1}&=x_k+\underbrace{h_k\,f_\theta(x_k,t_k,c)}_{\text{denoiser 한 번의 평가로 이동}}\\
\mathrm{NFE}&=\underbrace{\#\{f_\theta\ \text{호출}\}}_{\text{가장 큰 반복 계산 예산}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 한 step이 model evaluation과 solver 이동으로 구성되고, NFE를 줄이려면 적은 호출 안에 trajectory를 압축한 별도 학습 결과가 필요하다는 뜻이다."
            symbols={[
              [String.raw`x_k`, 'k번째 solver 위치의 image latent'],
              [String.raw`f_\theta`, '현재 latent와 condition에서 이동 방향을 예측하는 denoiser'],
              [String.raw`h_k`, 'Scheduler·solver가 정한 이번 이동 크기'],
              [String.raw`\mathrm{NFE}`, 'Denoiser를 실제 호출한 총 횟수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Base는 공식 표에서 CFG, negative prompt와 fine-tuning에 적합한 경로로 구분된다. Turbo는
            8 NFE와 빠른 반복이 목표이고 같은 표에서 CFG와 negative prompt가 비활성으로 표시된다.
            Base용 50-step workflow에 Turbo weight를 넣거나 Turbo 결과에 Base의 제어 가정을 적용하면
            모델 비교가 아니라 artifact·config 불일치를 측정한다.
          </p>
          <p>
            Vendor는 Turbo가 16GB consumer device에 맞고 H800에서 sub-second라고 설명한다. 이 수치는
            hardware, precision, compile, resolution과 warm-up 범위를 붙인 vendor claim이다. 내 장비의
            수치는 같은 조건을 기록한 local receipt가 생길 때 확정된다.
          </p>
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Evidence ownership" title="샘플의 미감보다 어느 단계가 결과를 만들었는지 추적한다">
        <div id="evidence-ledger" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            이미지 한 장은 checkpoint만의 출력이 아니다. Prompt enhancer가 문장을 바꿨는지, text
            encoder가 어떤 revision인지, VAE와 precision이 무엇인지, offload 때문에 CPU·RAM 대기가
            생겼는지, 후처리 upscaler가 디테일을 다시 만들었는지를 분리해야 한다.
          </p>
          <p>
            Bilingual text를 검증할 때는 prompt 원문과 enhancer 출력, rendered text의 정확도, layout,
            style을 따로 채점한다. 글자가 맞지만 위치가 틀린 결과와 위치는 맞지만 철자가 틀린 결과를
            하나의 “미감 점수”로 합치면 실패 owner를 잃는다.
          </p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          <EvidenceLine label="Artifact identity"><code>checkpoint · revision · hash · variant</code>를 남긴다.</EvidenceLine>
          <EvidenceLine label="Condition identity">원 prompt, enhancer 출력, language와 negative·guidance 상태를 보존한다.</EvidenceLine>
          <EvidenceLine label="Numerical path"><code>NFE · solver · scheduler · seed · resolution · precision</code>을 고정한다.</EvidenceLine>
          <EvidenceLine label="Component path">Text encoder, VAE, quantization, offload와 postprocess revision을 함께 적는다.</EvidenceLine>
          <EvidenceLine label="Machine receipt">GPU·VRAM·RAM, cold/warm latency, peak memory와 output manifest를 남긴다.</EvidenceLine>
        </div>
      </Milestone>

      <Milestone number="05" eyebrow="Finite floor" title="공개 T2I 계약을 재구성했으면 미공개 내부로 더 내려가지 않는다">
        <div id="verification-stop" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Z-Image를 이해했다는 기준은 모든 학습 dataset과 unpublished edit recipe를 아는 것이 아니다.
            Base와 Turbo를 목표에 맞게 고르고, current T2I token path를 설명하고, NFE와 component
            budget을 기록하며, 공개되지 않은 checkpoint를 실험 대상에서 제외할 수 있으면 충분하다.
          </p>
          <p>
            그다음 질문은 workflow 재현이다. 같은 manifest로 seed와 artifact를 고정한 뒤 prompt,
            NFE, precision 중 한 축만 바꿔야 실제 trade-off가 보인다.
          </p>
        </div>
        <StopRule>
          Omni-Base·Edit의 미공개 weight와 학습 내부를 추정하지 않는다. 현재 공개 Base·Turbo의 artifact,
          T2I path, NFE와 run receipt를 재구성할 수 있으면 community workflow 검증으로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          '계열 소개, 현재 code path와 checkpoint 공개 상태를 분리한다.',
          '현재 T2I code에서 caption feature와 image latent가 결합되는 순서를 설명한다.',
          'Base 50 NFE와 Turbo 8 NFE를 서로 다른 artifact 계약으로 다룬다.',
          'Edit·Omni-Base가 검산 revision에서 미공개임을 먼저 판정한다.',
          'Vendor latency·VRAM claim과 내 장비의 local measurement를 구분한다.',
          'Checkpoint 밖의 text encoder, VAE, precision과 offload를 manifest에 넣는다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="image-model-runtime" learningPathId="ai-open-model-z-image">Image Runtime 다섯 계약</InternalLink></span>
        <span>다음: <InternalLink slug="open-model-community-workflows" learningPathId="ai-open-model-z-image">Workflow 재현 검증</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Z-Image official README', href: `${sourceRoot}/README.md`, note: `검산 revision ${sourceRevision.slice(0, 12)}. Model Zoo, S3-DiT 계열 설명, Base·Turbo NFE와 release state.` },
          { label: 'Z-Image current T2I pipeline', href: `${sourceRoot}/src/zimage/pipeline.py`, note: 'Prompt encoding, caption feature, latent initialization, scheduler와 decode의 현재 실행 경로.' },
          { label: 'Z-Image transformer implementation', href: `${sourceRoot}/src/zimage/transformer.py`, note: 'Caption·image refiner, sequence concat와 transformer block의 code-observed boundary.' },
          { label: 'Z-Image technical report', href: 'https://arxiv.org/abs/2511.22699', note: '6B S3-DiT 계열, data·training lifecycle과 Turbo distillation의 1차 연구 문헌.' },
        ]}
      />
    </>
  );
}
