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
import IllustriousEvidenceLab from './IllustriousEvidenceLab';

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

export default function IllustriousXLArticle() {
  return (
    <>
      <QuestionLead
        question="공식 카드가 짧은 파생 checkpoint를 깊게 설명하려면 빈칸을 커뮤니티 관행으로 채워도 될까?"
        answer={<>안 된다. <strong>SDXL에서 상속한 구조</strong>, <strong>v1.1 카드가 직접 말한 변경</strong>, <strong>직접 실험해야 할 workflow 가설</strong>을 분리해야 한다. 그래야 LoRA나 VAE가 만든 개선을 checkpoint 성능으로 잘못 귀속하지 않는다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'inherited contract', meaning: 'SDXL에서 이어지는 latent denoising, VAE와 license 경계.', why: '일반 SDXL 지식을 v1.1 고유 성과로 포장하지 않는다.' },
          { term: 'checkpoint delta', meaning: 'v1.0에서 v1.1로 이동하며 공식 카드가 명시한 변화.', why: '현재 글이 실제로 설명해야 할 모델 고유 범위를 잡는다.' },
          { term: 'ELO', meaning: '두 결과를 비교한 선호 판정이 누적된 상대 점수.', why: '표본과 비교 집합 밖으로 숫자를 과도하게 일반화하지 않는다.' },
          { term: 'workflow hypothesis', meaning: 'Tag, LoRA, VAE, sampler 조합이 좋을 것이라는 검증 전 가정.', why: '커뮤니티 관행과 공식 model fact를 분리한다.' },
          { term: 'regression set', meaning: '새 특화 능력을 얻으며 잃은 기존 능력을 찾는 고정 prompt 묶음.', why: '캐릭터 개선과 범용성 손실을 동시에 본다.' },
        ]}
      />
      <Misconception>
        현재 공식 v1.1 카드는 stabilization hyperparameter, character understanding, knowledge cutoff,
        color·anatomy·saturation 차이와 400 sample ELO를 말한다. 완전한 dataset, caption schema,
        optimizer, tag benchmark, LoRA 호환표나 merge recipe는 공개하지 않는다.
      </Misconception>

      <Milestone number="01" eyebrow="Evidence before folklore" title="파생 모델의 설명을 상속, 명시, 실험의 세 층으로 나눈다">
        <div id="evidence-layers" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Illustrious XL v1.1을 “anime model”이라는 한 문장으로 끝내면 얕다. 반대로 공개되지 않은
            dataset과 tag recipe까지 추정하면 깊어 보이지만 검증할 수 없다. 필요한 것은 정보량이 아니라
            각 문장의 owner를 붙이는 일이다.
          </p>
          <p>
            SDXL report가 설명한 U-Net·latent·VAE는 상속층이다. v1.1 카드가 말한 stabilization과
            ELO 변화는 명시층이다. Natural language와 tag 중 무엇이 더 잘 듣는지, 특정 LoRA가
            anatomy를 개선하는지는 실험층이다. 같은 결과 이미지 안에서도 이 세 층이 함께 작동한다.
          </p>
        </div>
        <IllustriousEvidenceLab />
      </Milestone>

      <Milestone number="02" eyebrow="Inherited SDXL runtime" title="바뀐 것은 denoising 골격이 아니라 그 골격이 학습한 분포다">
        <div id="inherited-runtime" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Illustrious v1.1도 clean image를 VAE latent <M>{'z_0'}</M>로 압축하고, noise가 섞인
            <M>{'z_t'}</M>에서 condition <M>{'c'}</M>를 보며 제거할 noise를 예측하는 SDXL
            runtime을 상속한다. 이 식은 모델 고유 발명이 아니라 비교 기준선이다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72}>{String.raw`\begin{aligned}
z_t&=\underbrace{\alpha_t z_0}_{\text{남겨 둔 illustration 신호}}+
\underbrace{\sigma_t\epsilon}_{\text{학습을 위해 더한 noise}}\\
\hat\epsilon&=\underbrace{\epsilon_\theta(z_t,t,c)}_{\text{조건을 보고 제거할 noise를 예측}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 Illustrious가 SDXL의 latent denoising 계약을 상속하며, checkpoint delta는 같은 계산 안의 weight가 어떤 이미지 분포를 더 잘 예측하도록 이동한 것임을 보여 준다."
            symbols={[
              [String.raw`z_0`, 'VAE가 clean image를 압축한 latent'],
              [String.raw`z_t`, 't 시점에 noise가 섞인 latent'],
              [String.raw`c`, 'Prompt를 text encoder가 만든 condition'],
              [String.raw`\epsilon_\theta`, 'SDXL 계열 denoiser weight를 가진 예측 함수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “분포가 바뀌었다”는 말은 캐릭터 얼굴과 의상만 외웠다는 뜻도, 모든 SDXL 능력이 좋아졌다는
            뜻도 아니다. 같은 입력 <M>{'z_t,t,c'}</M>에서 v1.1 weight가 내는 예측 방향이
            v1.0과 조금 달라졌다는 뜻이다. 그 차이가 character identity에 유리한지, 사진·복잡한
            배경·텍스트에서는 회귀인지 prompt set으로 확인해야 한다.
          </p>
          <p>
            따라서 U-Net attention과 CFG 전체는 이 글에서 다시 전개하지 않는다. 그 계산을 이해해야
            하면 Stable Diffusion 기준선으로 내려가고, 여기서는 v1.1 delta를 분리하는 데만 사용한다.
          </p>
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="What v1.1 actually states" title="46 ELO 차이는 신호이지만 원인과 범용성을 자동 증명하지 않는다">
        <div id="v11-delta" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            공식 카드는 v1.1이 v1.0에서 계속 학습됐고 stabilization을 위해 hyperparameter를
            조정했다고 말한다. 조금 더 나은 character understanding, 2024-07까지의 knowledge
            cutoff, color balance·anatomy·saturation의 작은 차이도 명시한다. 가장 구체적인 수치는
            400 sample response에서 v1.1 ELO 1617, v1.0 ELO 1571이다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.78}>{String.raw`\begin{aligned}
\Delta E&=\underbrace{1617}_{\text{v1.1 상대 선호 점수}}-
\underbrace{1571}_{\text{v1.0 상대 선호 점수}}=46\\
n&=\underbrace{400}_{\text{카드가 밝힌 sample response 범위}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 카드가 보고한 상대 점수 차이와 표본 범위를 함께 묶는다. 46이라는 차이는 해당 비교의 신호이지 모든 prompt·평가자·workflow에서의 절대 품질 증가량이 아니다."
            symbols={[
              [String.raw`\Delta E`, '공개 카드의 v1.1과 v1.0 ELO 차이'],
              [String.raw`n`, '카드가 밝힌 collected sample response 수'],
              ['ELO', '비교 집합과 선호 판정에 의존하는 상대 점수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 숫자만으로 “손가락이 항상 좋아졌다”, “tag prompt를 공식적으로 더 잘 따른다” 또는
            “LoRA merge에 더 강하다”고 말할 수 없다. Prompt 분포, 비교 image 수, rater protocol과
            confidence interval이 카드에 충분히 공개되지 않았기 때문이다.
          </p>
          <p>
            반대로 카드가 짧다고 아무것도 말할 수 없는 것은 아니다. Version identity, v1.0과의 관계,
            공개된 변화 방향, license와 숫자의 표본 범위는 명확히 남길 수 있다. 깊은 설명은 빈칸을
            채우는 것이 아니라 이 경계가 실험 설계를 어떻게 바꾸는지 보여 주는 일이다.
          </p>
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Controlled workflow" title="Prompt, adapter, merge를 한꺼번에 바꾸면 checkpoint 차이를 잃는다">
        <div id="controlled-workflow" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Tag prompt가 더 안정적일 수 있다는 커뮤니티 경험은 유용한 가설이다. 그러나 v1.1 카드가
            tag caption schema를 공개한 것은 아니다. 먼저 자연어와 tag 표현을 같은 seed·sampler·VAE로
            비교하고, 다음 실험에서만 adapter를 추가해야 한다.
          </p>
          <p>
            LoRA를 적용하면 실제 denoiser weight는 v1.1 checkpoint와 adapter 변화량의 합이 된다.
            이때 결과가 좋아졌다면 checkpoint, adapter와 strength를 분리하지 않고는 원인을 말할 수 없다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72} className="sm:hidden">{String.raw`\begin{gathered}
\underbrace{W_{\mathrm{run}}=W_{\mathrm{v1.1}}+\lambda BA}_{\text{checkpoint+LoRA}}\\[5pt]
\underbrace{\Delta y_{\mathrm{checkpoint}}\text{ 판정}}_{\text{나머지 workflow 고정}}\\[5pt]
\underbrace{seed,prompt,VAE}_{\text{입력·decoder 통제}}\\[3pt]
\underbrace{sampler,CFG}_{\text{sampling 통제}}
\end{gathered}`}</M>
          <M display minScale={0.72} className="hidden sm:block">{String.raw`\begin{aligned}
\underbrace{W_{\mathrm{run}}}_{\text{실행 weight}}
&=\underbrace{W_{\mathrm{v1.1}}}_{\text{checkpoint}}+
\underbrace{\lambda BA}_{\text{LoRA 변화}}\\[5pt]
\underbrace{\Delta y_{\mathrm{checkpoint}}\text{ 판정}}_{\text{checkpoint 차이만 비교}}
&\Longrightarrow\underbrace{seed,prompt,VAE,sampler,CFG\text{ 고정}}_{\text{나머지 workflow 통제}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 adapter를 붙인 결과가 v1.1 checkpoint 단독 출력이 아니며, checkpoint delta를 판정하려면 다른 workflow 변수를 고정해야 하는 이유를 보여 준다."
            symbols={[
              [String.raw`W_{\mathrm{v1.1}}`, '비교하려는 Illustrious XL v1.1 weight'],
              [String.raw`BA`, 'LoRA가 학습한 low-rank 변화량'],
              [String.raw`\lambda`, '실행 workflow가 정한 adapter strength'],
              [String.raw`W_{\mathrm{run}}`, '실제 denoising에 쓰이는 결합 weight'],
            ]}
          />
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {[
            ['01', 'Checkpoint만 비교', 'v1.0과 v1.1, 같은 prompt·seed·resolution·sampler·VAE.'],
            ['02', 'Prompt 표현 비교', 'v1.1을 고정하고 natural language와 tag만 바꾼다.'],
            ['03', 'Adapter 하나 추가', '이름·source·trigger·strength를 기록하고 한 개만 적용한다.'],
            ['04', '상호작용 확인', '필요할 때만 두 adapter를 조합하고 단독 결과와 나란히 둔다.'],
            ['05', 'Merge·full tune gate', '작은 개입으로 해결되지 않고 regression set이 준비됐을 때만 weight 자체를 바꾼다.'],
          ].map(([number, title, detail]) => (
            <div key={number} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xl font-black text-muted-foreground/45">{number}</span>
              <strong className="text-sm">{title}</strong>
              <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </Milestone>

      <Milestone number="05" eyebrow="Regression and stop rule" title="캐릭터 개선과 함께 무엇을 잃었는지도 같은 화면에서 본다">
        <div id="regression-stop" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Character identity test만 통과하면 특화 checkpoint에는 유리한 시험만 본 셈이다. 같은
            prompt set에 anatomy, pose 변화, color·saturation, 복잡한 composition, 일반 사물,
            photo-like image와 style transfer를 넣어야 한다. v1.1 카드가 직접 언급한 변화와
            상속한 범용성이 함께 보인다.
          </p>
          <p>
            각 결과는 exact checkpoint revision, prompt representation, negative prompt, seed,
            resolution, steps, sampler, scheduler, CFG, VAE, adapter와 merge recipe에 연결한다.
            이 manifest가 없으면 좋은 image를 발견할 수는 있어도 왜 좋아졌는지는 설명할 수 없다.
          </p>
        </div>
        <StopRule>
          공개되지 않은 v1.1 dataset·optimizer·tag schema를 추정하지 않는다. 모든 문장을 SDXL 상속,
          v1.1 카드 명시 또는 local experiment로 분류하고 checkpoint delta를 격리할 수 있으면
          최소 적응 판단 글로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          'SDXL 공통 구조와 Illustrious v1.1 고유 주장을 구분한다.',
          'v1.1 카드가 실제로 공개한 사실과 공개하지 않은 항목을 말한다.',
          'ELO 46 차이를 400 sample scope 밖으로 일반화하지 않는다.',
          'Tag·LoRA·merge 관행을 공식 사실이 아니라 검증할 가설로 둔다.',
          'Checkpoint 비교에서 seed, VAE, sampler와 adapter를 고정한다.',
          'Character 개선과 일반 능력 regression을 같은 protocol로 측정한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="stable-diffusion-open-models" learningPathId="ai-open-model-illustrious">SDXL 구현 기준선</InternalLink></span>
        <span>다음: <InternalLink slug="open-model-finetuning-theory" learningPathId="ai-open-model-illustrious">가장 작은 충분한 적응</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Illustrious XL v1.1 official model card', href: 'https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1', note: 'v1.0→v1.1 delta, knowledge cutoff, ELO와 SDXL license의 현재 1차 근거.' },
          { label: 'Stable Diffusion XL technical report', href: 'https://openreview.net/forum?id=di52zR8xgf', note: 'Latent denoising, larger U-Net, conditioning과 SDXL 상속 범위.' },
          { label: 'LoRA', href: 'https://arxiv.org/abs/2106.09685', note: 'Adapter를 base weight에 더하는 low-rank 변화량의 원리. v1.1 고유 학습 recipe는 아니다.' },
        ]}
      />
    </>
  );
}
