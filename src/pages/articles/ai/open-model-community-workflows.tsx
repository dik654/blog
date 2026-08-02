import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { WorkflowManifestExplorer } from './open-model-core/viz/OpenModelExplorers';

export default function OpenModelCommunityWorkflowsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Workflow는 그림이 아니라 실행 가능한 주장이다</h2>
        <QuestionLead
          question="잘 나온 ComfyUI workflow JSON을 받으면 같은 결과를 재현할 수 있을까?"
          answer="JSON만으로는 부족하다. Loader가 가리키는 exact weight와 VAE, custom node commit, prompt rewriting, input preprocessing, dtype·offload, solver와 seed가 함께 고정되어야 한다. Workflow graph는 실행 순서를 보여 주고 manifest는 그 graph가 실제로 무엇을 실행했는지 증명한다."
        />
        <ConceptPrimer items={[
          { term: 'Execution graph', meaning: 'Tensor와 artifact가 node 사이를 어떤 순서로 이동하는지 나타낸 directed graph다.', why: 'Screenshot의 배치보다 data dependency를 읽는다.' },
          { term: 'Artifact', meaning: 'Model weight, VAE, adapter, input image와 output처럼 hash로 고정할 수 있는 파일이다.', why: '같은 이름의 다른 revision을 막는다.' },
          { term: 'Environment lock', meaning: 'Node·library·driver·kernel version과 runtime option을 기록한 실행 환경이다.', why: 'Graph가 같아도 code 변화로 결과가 달라지는 drift를 잡는다.' },
          { term: 'Manifest', meaning: 'Artifact, graph, environment, input transform와 sampling trace를 한 run에 묶은 기록이다.', why: '다른 사람이 같은 실패를 재현하고 고칠 수 있게 한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image와 Video branch는 이 글에서 다시 합류한다. 둘 다 loader, encoder, latent, denoiser, solver와 decoder를 호출하지만 node 이름과 tensor shape가 다르다.
            우리가 감사할 것은 화면에 놓인 box 수가 아니라 어떤 input이 어떤 code·weight를 거쳐 어떤 output을 만들었는가다.
          </p>
          <p>
            한국어 패키지 workflow에서 exact text가 갑자기 무너졌다고 하자. Model alias가 preview endpoint를 가리켰는지, prompt rewrite node가 바뀌었는지,
            VAE가 교체되었는지, seed와 schedule이 남아 있는지를 먼저 본다. 그래야 prompt 문제와 environment drift를 분리할 수 있다.
          </p>
        </div>
        <WorkflowManifestExplorer />
      </section>

      <section id="comfyui" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ComfyUI: Port type과 hidden dependency를 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            ComfyUI graph는 loader에서 시작해 model, text encoder와 VAE handle을 분리하고, conditioning과 latent를 sampler에 연결한 뒤 decoder로 보낸다.
            화면의 왼쪽·오른쪽 위치는 의미가 없고 edge가 data dependency를 정한다. 먼저 각 port의 type과 shape, device와 dtype를 적는다.
          </p>
          <ol>
            <li><strong>Loader:</strong> Checkpoint filename이 아니라 source, revision, file hash, config, license와 serialization format을 확인한다. Tensor-only <code>safetensors</code>를 우선하고, pickle 기반 <code>.ckpt</code>·<code>.pt</code>·<code>.pth</code>는 신뢰하지 않는 source에서 직접 load하지 않는다.</li>
            <li><strong>Encoder:</strong> Prompt rewrite, token limit, reference resize와 mask normalization을 확인한다.</li>
            <li><strong>Sampler:</strong> Model prediction type, solver, sigma schedule, steps, guidance, seed와 latent shape를 묶어 읽는다.</li>
            <li><strong>Decoder:</strong> 전용 VAE, tiling, color range와 video frame/audio decode를 확인한다.</li>
            <li><strong>Custom node:</strong> Repository URL, commit, Python dependency, downloaded model과 side effect를 확인한다.</li>
          </ol>
          <M display>{String.raw`\begin{aligned}
            R&=\left(
              \underbrace{G_r}_{\text{고정 graph}},
              \underbrace{A_h}_{\text{고정 artifact}}
            \right)\\
            I'&=\underbrace{T(I)}_{\text{resize·crop·mask}}\\
            y&=\operatorname{Eval}\!\left(
              R,I',
              \underbrace{S}_{\text{sampling 상태}},
              \underbrace{E}_{\text{실행 환경}}
            \right)
          \end{aligned}`}</M>
          <FormulaNote meaning="결과는 workflow JSON 하나의 함수가 아니다. Graph revision, artifact, input transform, sampling state와 실행 환경이 모두 같아야 같은 run을 주장할 수 있다." symbols={[[String.raw`R`, 'graph revision과 hash로 식별한 artifact 묶음'], [String.raw`I'=T(I)`, '실제로 model에 들어간 전처리 결과'], [String.raw`S`, 'seed·solver·schedule·guidance'], [String.raw`E`, 'dtype·device·node code가 포함된 실행 환경']]} />
          <Misconception>
            Missing node를 비슷한 이름의 node로 바꾸고 실행됐다고 해서 workflow를 복구한 것이 아니다. Input/output type뿐 아니라 algorithm과 default parameter가 같은지 검증해야 한다.
          </Misconception>
        </div>
      </section>

      <section id="diffusers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Diffusers: Pipeline 편의성 아래 component를 펼친다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Diffusers pipeline은 여러 component를 Python object 하나로 묶어 호출하기 쉽게 한다. 편리하지만 audit에서는 다시 펼쳐야 한다. `from_pretrained`가 받은 repository와
            revision, model index가 참조한 subfolder, tokenizer/text encoder, transformer 또는 U-Net, scheduler, VAE와 safety/postprocess를 기록한다.
          </p>
          <p>
            `enable_model_cpu_offload`, attention slicing, quantization config와 compile은 단순 performance option이 아니다. Peak VRAM, transfer order와 numerical path를 바꿀 수 있다.
            Generator를 어느 device에 만들었는지, input image가 어떤 range와 size로 변환됐는지, prompt embedding을 직접 넘겼는지도 결과 재현에 들어간다.
          </p>
          <p>
            API model은 local pipeline과 계약이 다르다. Preview endpoint는 내부 weight가 갱신될 수 있고, fixed endpoint는 reproducibility를 위해 snapshot을 제공할 수 있다.
            FLUX.2 공식 문서는 preview와 pinned endpoint를 이 목적으로 구분한다. API response의 model version, request body와 provider-side preprocessing을 가능한 범위에서 저장한다.
          </p>
          <CitationBlock source="Hugging Face Diffusers · loading pipelines" citeKey={1} href="https://huggingface.co/docs/diffusers/using-diffusers/loading">
            <p>Pipeline이 component와 configuration을 repository에서 불러오는 공식 실행 경로를 확인하는 자료다.</p>
          </CitationBlock>
          <CitationBlock source="FLUX.2 official documentation" citeKey={2} href="https://docs.bfl.ai/flux_2/flux2_overview">
            <p>Preview endpoint와 고정 snapshot endpoint를 품질 최신성 대 reproducibility 관점으로 구분한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="community-audit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">커뮤니티 Workflow를 채택하기 전 다섯 번 묻는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>출처:</strong> 누가, 어느 version의 model과 node를 위해 만들었고 license가 무엇인가?</li>
            <li><strong>숨은 다운로드:</strong> Custom node가 실행 중 어느 URL에서 code·weight를 받고 update하는가?</li>
            <li><strong>숨은 품질 pass:</strong> Base generation 뒤 upscale, detailer, face restore, interpolation과 color correction이 붙었는가?</li>
            <li><strong>숨은 비용:</strong> Quantization·offload·tiling 없이도 실행된 것처럼 peak VRAM과 latency를 생략했는가?</li>
            <li><strong>숨은 입력 변형:</strong> Prompt expansion, translation, resize·crop·mask feather가 UI 밖에서 일어나는가?</li>
            <li><strong>숨은 역직렬화:</strong> Weight가 tensor-only format인가, pickle opcode나 custom class import를 실행하는 loader인가?</li>
          </ol>
          <p>
            보안 감사도 필요하다. File hash는 받은 byte가 예상 artifact와 같다는 <em>integrity</em>만 확인하며 그 artifact가 무해하다는 뜻은 아니다.
            PyTorch 공식 문서는 <code>torch.load</code>가 unpickler를 사용하므로 신뢰하지 않는 source를 load하지 말라고 경고한다.
            가능하면 arbitrary Python object를 만들지 않는 <code>safetensors</code>를 사용한다. Legacy pickle checkpoint가 불가피하면 source를 별도 검증하고,
            network·secret이 없는 격리 환경에서 <code>weights_only=True</code>로 먼저 제한하되 이것도 denial-of-service나 downstream memory safety까지 보장하는 완전한 sandbox는 아니다.
            Custom node 역시 일반 Python code이므로 filesystem, network와 credential에 접근할 수 있다. Source와 commit을 pin하고 startup·install script와 dependency를 읽으며,
            production에서는 outbound network와 secret scope를 제한한다.
          </p>
          <p>
            품질 감사에서는 sample image를 그대로 믿지 않는다. Workflow의 base output과 각 후처리 단계 output을 따로 저장하고, node를 하나씩 끄는 ablation으로
            실제 향상이 어디서 왔는지 확인한다. Model comparison에서 postprocess를 섞으면 결론을 다른 model에 옮길 수 없다.
          </p>
        </div>
      </section>

      <section id="reproducibility" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">재현성은 같은 output 한 장보다 원인 추적 가능성이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GPU kernel, low precision과 nondeterministic operation 때문에 bit-for-bit output이 항상 가능하지는 않다. 그렇더라도 동일한 artifact와 graph로 같은 분포의 결과를 만들고,
            차이가 생겼을 때 어느 dependency가 바뀌었는지 찾을 수 있어야 한다. Manifest digest는 필요한 입력이 모두 닫혔는지 확인하는 식별자다.
          </p>
          <M display>{String.raw`\begin{aligned}
            d_{\text{system}}&=H\!\left(
              \underbrace{d_{\text{graph}}}_{\text{graph·code}}\parallel
              \underbrace{d_{\text{artifact}}}_{\text{weight·입력}}
            \right)\\
            d_{\text{run}}&=H\!\left(
              \underbrace{d_{\text{system}}}_{\text{실행 대상}}\parallel
              \underbrace{d_{\text{environment}}}_{\text{실행 환경}}\parallel
              \underbrace{d_{\text{sampling}}}_{\text{sampling 상태}}
            \right)
          \end{aligned}`}</M>
          <FormulaNote meaning="Run digest는 output image hash가 아니라 결과를 만든 graph, artifact, environment와 sampling state의 묶음을 식별한다. 하나라도 바뀌면 새 run으로 기록한다." symbols={[[String.raw`H`, '충돌 저항 hash 함수'], [String.raw`\parallel`, '필드를 정해진 순서로 직렬화해 결합'], [String.raw`d_{graph},d_{artifact}`, '실행 논리와 file artifact의 digest'], [String.raw`d_{environment},d_{sampling}`, 'runtime과 stochastic state의 digest']]} />
          <p>
            최소 산출물은 workflow 또는 script, lockfile·container digest, model manifest, input fixture, run log, raw output와 evaluation report다. 한국어 문구 suite라면
            OCR 결과와 사람이 확인한 line break·box layout을 함께 저장한다. Video라면 source image, frame timestamps, audio track와 temporal metrics를 포함한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'ComfyUI 화면 배치가 아니라 port type과 data dependency로 graph를 읽을 수 있다.',
          'Workflow JSON 밖의 model·node·preprocess·runtime dependency를 manifest에 담을 수 있다.',
          'API preview와 pinned endpoint, local weight revision의 reproducibility 경계를 구분할 수 있다.',
          'Community sample의 model 효과와 hidden postprocess 효과를 ablation으로 분리할 수 있다.',
        ]} />
        <LearningHandoff
          description="Community workflow의 산출물은 screenshot이나 JSON 하나가 아니라 안전하게 읽은 artifact, pinned code, environment, sampling state와 raw/base/final output을 묶은 run evidence다."
          items={[
            { label: '막히면', slug: 'open-model-workflow-parameters', title: 'Workflow Parameter Audit', reason: 'Preset 숫자가 model·solver·latent shape에 맞는지 seed set과 response curve로 다시 검증한다.' },
            { label: '막히면', slug: 'open-model-finetuning-theory', title: 'Open Model Finetuning', reason: 'Adapter·checkpoint의 학습 target, base revision과 evaluation evidence가 manifest에 포함됐는지 확인한다.' },
            { label: '적용하기', slug: 'animation-production-workflow', title: 'Animation Production Workflow', reason: '검증된 generation graph를 shot·identity·motion·audio·review gate가 있는 실제 제작 pipeline에 넣는다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'ComfyUI documentation', href: 'https://docs.comfy.org/', note: 'Node graph, workflow format와 official runtime 기준.' },
          { label: 'Diffusers documentation', href: 'https://huggingface.co/docs/diffusers/', note: 'Pipeline component, loading와 optimization option 기준.' },
          { label: 'FLUX.2 documentation', href: 'https://docs.bfl.ai/flux_2/flux2_overview', note: 'Preview와 fixed endpoint, open/API variant의 경계.' },
          { label: 'PyTorch · torch.load', href: 'https://docs.pytorch.org/docs/stable/generated/torch.load.html', note: 'Unpickler 기반 load와 신뢰하지 않는 source를 읽지 말라는 공식 보안 경고.' },
          { label: 'Hugging Face · safetensors', href: 'https://github.com/huggingface/safetensors', note: 'Pickle 대신 tensor를 안전하고 빠르게 배포하기 위한 공식 format·implementation.' },
        ]} />
      </section>
    </div>
  );
}
