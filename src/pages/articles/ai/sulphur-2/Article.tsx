import type { ReactNode } from 'react';
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
import SulphurClaimLedger from './SulphurClaimLedger';
import SulphurEvidenceRouteViz from './viz/SulphurEvidenceRouteViz';

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

export default function Sulphur2Article() {
  return (
    <>
      <QuestionLead
        question="공식 추론이 아직 coming soon인 파생 모델을 깊게 설명하려면 무엇부터 말해야 할까?"
        answer={<>성능 이야기가 아니라 <strong>현재 증거의 상한</strong>부터 말해야 한다. Sulphur 2 공식 카드는 LTX-2.3 기반, T2V·I2V 지원 주장, 배포 파일과 prompt enhancer 사용 단서를 주지만 완전한 training recipe와 official inference workflow는 아직 제공하지 않는다.</>}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 글은 <strong>2026년 7월 31일에 다시 확인한 owner-authored model card</strong>를 현재 snapshot으로 삼는다.
          같은 Hugging Face 페이지 안에서도 증거 owner는 하나가 아니다. SulphurAI가 직접 쓴 카드, Hugging Face가 repository
          artifact를 감지해 자동으로 만든 “Use this model” 안내, Lightricks의 upstream 문서, 사용자가 만든 community graph는
          서로 다른 책임과 검증 범위를 가진다.
        </p>
        <p>
          페이지 상단의 자동 안내에는 Diffusers·llama 계열 예시와 <code>qwen35</code>·<code>9B params</code> metadata가 보인다.
          이는 repository 안의 prompt enhancer artifact를 탐지한 결과로 읽을 수 있지만, Sulphur video model의 owner-maintained
          official inference를 증명하지 않는다. 특히 owner card는 enhancer의 정확한 base checkpoint 이름을 밝히지 않는다.
          따라서 자동 snippet을 실행 성공의 근거로 쓰거나 “공식 workflow가 공개됐다”고 해석하지 않는다.
        </p>
        <p>
          아래 흐름은 모델을 실행하는 순서가 아니라 <strong>주장을 만들기 전에 증거를 통과시키는 순서</strong>다.
          앞 단계의 owner와 version을 잃으면 뒤에서 만든 비교 결과가 좋아도 무엇이 달라졌는지 설명할 수 없다.
        </p>
      </div>
      <SulphurEvidenceRouteViz />
      <ConceptPrimer
        items={[
          { term: 'derivative checkpoint', meaning: '기존 upstream model을 출발점으로 다시 조정하거나 패키징한 배포물.', why: '새 architecture와 checkpoint delta를 구분한다.' },
          { term: 'upstream invariant', meaning: 'LTX-2.3에서 상속돼 Sulphur가 새로 증명할 필요가 없는 runtime 구조.', why: 'Dual-stream·VAE를 파생 모델의 독자 성과로 세지 않는다.' },
          { term: 'official inference', meaning: 'Model owner가 제공하고 유지하는 실행 경로와 설정.', why: 'Community workflow를 공식 지원처럼 표현하지 않는다.' },
          { term: 'claim ledger', meaning: '주장마다 출처 owner, 결론과 아직 미확인인 범위를 붙인 기록.', why: '짧은 카드의 빈칸을 마케팅·추정으로 채우지 않는다.' },
          { term: 'paired baseline', meaning: '같은 조건으로 upstream과 derivative output을 나란히 만드는 비교.', why: 'Checkpoint 외의 workflow 변수를 개선 원인에서 제외한다.' },
        ]}
      />
      <Misconception>
        공식 카드에는 125,000 clips, 500GB, 10초·24fps dataset, optimizer, loss나 trainable module이
        적혀 있지 않다. Prompt enhancer는 GGUF와 MMPROJ를 사용한다고만 명시하며 기반 LLM을 Qwen이라고
        밝히지 않는다.
      </Misconception>

      <Milestone number="01" eyebrow="Release gate" title="공식 추론 미공개 상태를 첫 화면에서 숨기지 않는다">
        <div id="claim-boundary" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            2026년 7월 31일에 확인한 Sulphur 2 card의 가장 중요한 현재 문장은 “official inference for the model is coming
            soon”이다. 이는 weight나 community workflow가 없다는 뜻이 아니다. Model owner가 검증하고
            유지하는 공식 실행 경로가 아직 완료되지 않았다는 뜻이다.
          </p>
          <p>
            따라서 지금의 실행 결과는 exact file과 third-party workflow revision을 붙인 local evidence다.
            “공식 Sulphur workflow로 재현했다”라고 부르면 support owner와 configuration source를
            잘못 표시하게 된다.
          </p>
          <p>
            Hugging Face의 library integration UI도 별도 계층이다. Platform이 repository file type을 보고 만든 시작 코드는
            빠른 탐색 단서일 수 있지만, owner가 video·audio output, VAE, upscaler, guider와 sampling contract를 검증한
            pipeline은 아니다. Owner card의 pending 문장을 platform-generated snippet이 덮어쓰지 못한다.
          </p>
        </div>
        <SulphurClaimLedger />
      </Milestone>

      <Milestone number="02" eyebrow="Inherited versus packaged" title="LTX-2.3 구조를 상속하고 Sulphur package identity만 추가한다">
        <div id="package-identity" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            공식 metadata는 <code>base_model: Lightricks/LTX-2.3</code>를 명시한다. 따라서 video·audio
            latent, text encoder, VAE, spatial upscaler, guider와 pipeline selection은 먼저 LTX-2.3
            글에서 이해한다. Sulphur 글의 질문은 그 위에서 어느 file과 delta를 추가했는가다.
          </p>
          <p>
            Card는 dev version의 BF16 또는 FP8-mixed 파일과 제공된 distill LoRA를 안내한다. 또 workflow에
            남아 있는 Sulphur LoRA path와 full-model path를 동시에 사용하지 말라고 경고한다. 이 문장만으로
            각 파일의 학습 관계를 재구성하지 말고, 실행 manifest에 실제 checkpoint와 adapter filename,
            hash, load order를 남긴다.
          </p>
          <p>
            Prompt enhancer도 별도 artifact다. Card가 밝힌 현재 사용법은 LM Studio의 지정 folder에
            GGUF와 MMPROJ를 넣고, system prompt 없이 text 또는 image와 text를 보내는 것이다. 기반 LLM
            checkpoint는 owner card에 명시되지 않았다. Hugging Face artifact metadata의 <code>qwen35</code> 표시는
            enhancer file의 감지된 architecture 단서로 기록할 수 있지만 exact base identity나 training provenance로 승격하지 않는다.
            Enhancer output을 사용하면 raw prompt following과 rewrite
            품질이 섞이므로 input과 output을 모두 보존한다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {[
            ['Upstream', 'LTX-2.3 checkpoint·pipeline·VAE·upscaler revision'],
            ['Derivative', 'Sulphur BF16 또는 FP8-mixed file name과 hash'],
            ['Adapter', 'Distill 또는 대안 LoRA file, strength와 load order'],
            ['Enhancer', 'GGUF·MMPROJ hash, raw input과 rewritten output'],
            ['Workflow', 'Community graph source, revision과 local modification'],
          ].map(([owner, identity]) => (
            <div key={owner} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
              <strong className="text-sm">{owner}</strong>
              <code className="break-words text-xs leading-6 text-muted-foreground [overflow-wrap:anywhere]">{identity}</code>
            </div>
          ))}
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="Unknowns stay visible" title="Full fine-tune과 training data 이야기는 재현 근거가 생길 때까지 보류한다">
        <div id="training-unknowns" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            별도 full-model file이 배포된다는 사실은 사용자가 base replacement처럼 load할 수 있음을
            보여 준다. 그러나 weight file의 크기만으로 모든 transformer parameter를 직접
            fine-tune했는지, adapter를 merge했는지, 일부 module만 업데이트했는지를 판정할 수 없다.
          </p>
          <p>
            “Full fine-tune”을 재현 가능한 기술 주장으로 만들려면 base revision, trainable module list,
            optimizer·learning rate, objective, dataset manifest, preprocessing, steps, hardware와 loss
            curve가 필요하다. 현재 card는 setup과 training instruction을 나중에 보강하겠다고 적는다.
            이 빈칸은 third-party 숫자로 대신 채우지 않는다.
          </p>
          <p>
            Weight가 하나의 큰 <code>safetensors</code> file로 배포됐다는 사실도 training method를 말해 주지 않는다.
            Adapter를 merge해 full checkpoint로 export했을 수도 있고, 일부 module만 update했을 수도 있으며, 모든 parameter를
            직접 학습했을 수도 있다. 세 경우는 runtime file 모양이 같아질 수 있으므로 file size와 이름만으로 구분할 수 없다.
          </p>
          <p>
            마찬가지로 uncensored는 content boundary에 관한 제품 성격이지 motion quality의 수학적
            지표가 아니다. Refusal이 적다는 주장과 anatomy, temporal coherence, source preservation,
            camera motion 개선을 별도 평가 축으로 둔다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['현재 말할 수 있음', 'LTX-2.3 기반, card가 주장한 task 범위, 안내된 파일과 pending 상태.'],
            ['현재 말할 수 없음', '정확한 trainable 범위, dataset 규모·구성, 비용과 품질 개선의 인과.'],
            ['추가되면 갱신', 'Official inference, training config, model owner의 versioned evaluation.'],
            ['계속 별도 보존', 'Community result, local benchmark와 third-party description의 provenance.'],
          ].map(([title, detail]) => (
            <div key={title} className="min-w-0 bg-background px-4 py-4">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Proposed local evidence" title="Upstream baseline과 derivative를 같은 비공식 graph에서 통제 비교한다">
        <div id="paired-evaluation" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Official inference가 없다고 평가를 멈출 필요는 없다. 다만 비교의 지위를 정확히 낮춘다.
            같은 versioned community graph에 upstream LTX-2.3과 Sulphur artifact를 번갈아 넣고 prompt,
            seed, condition image, resolution, frames, FPS, VAE, upscaler, sigma, guider와 precision을
            고정한다.
          </p>
          <p>
            먼저 enhancer를 끈 paired output을 만든다. 그다음 같은 checkpoint에서 enhancer만 켜
            rewrite 효과를 분리한다. Quality는 subject identity, limb·object permanence, camera motion,
            flicker, audio-video sync, I2V source preservation과 retry count로 나눈다. Peak VRAM과
            wall-clock도 같은 receipt에 넣는다.
          </p>
          <p>
            이 protocol이 보여 주는 것은 “해당 artifact와 해당 community graph에서 관찰한 delta”다.
            Model owner의 official benchmark나 training claim으로 승격하지 않는다. 나중에 official
            inference가 공개되면 같은 prompt manifest를 새 pipeline에서 다시 실행해 차이를 좁힌다.
          </p>
          <p>
            한 metric <M>{'m'}</M>의 local 차이를 쓰려면 비교 조건 <M>{'c'}</M>가 완전히 같아야 한다.
            여기서 <M>{'c'}</M>는 prompt와 seed뿐 아니라 condition image, frame 수, FPS, VAE, upscaler, guider,
            precision과 workflow revision까지 묶은 manifest다.
          </p>
        </div>
        <M display>{String.raw`\Delta_m(c)
=\underbrace{m(y_{\mathrm{Sulphur}};c)}_{\text{파생 출력의 측정값}}
-\underbrace{m(y_{\mathrm{LTX\text{-}2.3}};c)}_{\text{동일 조건 upstream 측정값}}`}</M>
        <FormulaNote
          meaning="왜 빼나: 같은 조건에서 upstream을 기준으로 제거하면 해당 manifest에서 파생 artifact를 바꿨을 때의 local 차이를 볼 수 있다. 왜 c를 양쪽에 똑같이 두나: prompt, seed, workflow, VAE, upscaler나 precision 중 하나라도 다르면 checkpoint 외의 변화가 Δ에 섞이기 때문이다. 이 값은 한 조건 묶음의 관측이지 보편적인 품질 우위를 증명하지 않는다."
          symbols={[
            ['\\Delta_m(c)', '조건 manifest c에서 metric m이 얼마나 달라졌는지 나타내는 local delta'],
            ['m', 'Identity, flicker, sync, source preservation, wall-clock처럼 하나씩 분리한 metric'],
            ['y_{\\mathrm{Sulphur}}', '기록한 Sulphur artifact 조합으로 생성한 output'],
            ['y_{\\mathrm{LTX\\text{-}2.3}}', '동일한 runtime 조건에서 upstream checkpoint로 생성한 baseline output'],
            ['c', 'Prompt·seed·input·frames·FPS·VAE·upscaler·guider·precision·workflow revision의 전체 묶음'],
          ]}
        />
        <StopRule>
          Filename, marketing page와 community article에서 training history를 복원하지 않는다. Official
          card fact, LTX-2.3 inherited contract, pending unknown과 local evidence를 분리할 수 있으면
          animation adaptation project로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          'Official inference가 현재 coming soon임을 첫 release gate로 확인한다.',
          'LTX-2.3 상속 구조와 Sulphur package delta를 구분한다.',
          'Prompt enhancer의 GGUF·MMPROJ fact와 미확인 base model을 분리한다.',
          'Full-model file을 full fine-tune recipe의 증거로 과대 해석하지 않는다.',
          '제3자 dataset 숫자와 품질 주장을 official model fact에서 제외한다.',
          'Upstream baseline과 derivative를 paired local protocol로 비교한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="ltx-23" learningPathId="ai-open-model-ltx">LTX-2.3 version·pipeline 기준선</InternalLink></span>
        <span>다음: <InternalLink slug="ltx-animation-project" learningPathId="ai-open-model-ltx">2D animation 최소 적응 실험</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Sulphur 2 official model card', href: 'https://huggingface.co/SulphurAI/Sulphur-2-base', note: 'Base model, task claim, package guidance, prompt enhancer와 official inference pending의 현재 1차 근거.' },
          { label: 'LTX-2.3 official repository', href: 'https://github.com/Lightricks/LTX-2', note: 'Sulphur가 상속하는 checkpoint, pipeline, upscaler와 trainer contract.' },
          { label: 'LTX-2.3 pipeline selection', href: 'https://docs.ltx.video/open-source-model/getting-started/overview', note: 'Upstream runtime 기준선. Community Sulphur graph를 official inference로 만들지 않는다.' },
        ]}
      />
    </>
  );
}
