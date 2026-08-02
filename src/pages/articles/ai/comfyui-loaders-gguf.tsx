import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { LoaderManifestViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const decisions = [
  ['1 · Model family', '공식 model card와 ComfyUI template에서 denoiser architecture와 필요한 companion component를 확인한다.'],
  ['2 · Packaging', '통합 checkpoint인지, denoiser·text encoder·VAE가 분리된 bundle인지 확인한다.'],
  ['3 · Loader contract', '각 파일이 어느 loader에서 어떤 output type을 만드는지 확인한다. 이름이 비슷한 loader를 추측으로 고르지 않는다.'],
  ['4 · Precision plan', 'BF16·FP8·GGUF variant를 component별로 고르고 정적 weight 외 runtime headroom을 남긴다.'],
  ['5 · Smoke trace', '작은 resolution·batch 1로 load, text encode, 한 sampling, decode를 분리해 통과시킨다.'],
] as const;

const failureModes = [
  ['Dropdown에 파일이 없다', '파일 종류와 loader 검색 경로가 다르거나 refresh가 안 됐다.', 'folder·extra_model_paths·loader 문서를 확인한다.'],
  ['Load 직후 OOM', 'denoiser만 계산하고 text encoder·VAE·adapter·runtime buffer를 빠뜨렸다.', 'component별 peak 시점을 측정하고 offload/precision을 다시 고른다.'],
  ['Prompt가 엉뚱하게 반영된다', 'tokenizer·text encoder 조합 또는 conditioning node가 model family와 다르다.', '공식 template의 encoder 수와 type부터 대조한다.'],
  ['색·contrast가 다르다', '잘못된 VAE 또는 decode range·후처리 차이가 섞였다.', '같은 latent를 두 VAE로 decode해 경계를 격리한다.'],
  ['LoRA가 약하거나 깨진다', 'base architecture·target block 또는 quantized execution 지원이 다르다.', 'unpatched base를 기준으로 한 adapter ablation을 먼저 한다.'],
] as const;

export default function ComfyUILoadersGGUFArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <QuestionLead
          question="12GB VRAM에서 최신 모델을 실행할 때 가장 작은 파일만 고르면 되는가?"
          answer="아니다. Denoiser만 작아도 text encoder, VAE, adapter와 sampling activation이 함께 올라간다. 먼저 model family가 요구하는 component 조합을 고정하고, 그다음 각 component의 precision과 실행 배치를 정해야 한다."
        />
        <h2 className="mb-6 text-2xl font-bold">Loader는 파일 선택기가 아니라 component factory다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>같은 <code>.safetensors</code> 확장자 안에도 denoiser, VAE, LoRA가 들어갈 수 있다. 반대로 <strong>GGUF</strong>, 즉 llama.cpp에서 유래한 tensor·metadata container가 같아도 denoiser용 loader와 text encoder용 loader는 다른 output을 만든다. 파일명을 보고 연결하지 말고, loader가 무엇을 읽어 어떤 runtime object를 만드는지 본다.</p>
          <p>통합 checkpoint loader는 MODEL·CLIP·VAE를 한 번에 꺼내므로 입문에는 편하다. 하지만 분리형 model에서는 이 세 책임이 그대로 드러난다. 이때 node 수가 많다는 것은 pipeline이 복잡해진 것이 아니라 원래 다른 component였던 것을 명시적으로 선택한다는 뜻이다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Denoiser', meaning: 'Noise가 섞인 latent와 condition을 받아 다음 갱신 방향을 예측한다.', why: '파일 bundle의 가장 큰 weight인 경우가 많지만 pipeline 전체는 아니다.' },
          { term: 'Text encoder', meaning: 'Prompt token을 CONDITIONING embedding으로 바꾼다.', why: '모델이 학습한 encoder family와 달라지면 문자열이 같아도 조건 공간이 달라진다.' },
          { term: 'VAE', meaning: 'IMAGE와 LATENT를 오가는 codec이다.', why: 'Latent channel·scale과 decode 특성이 맞지 않으면 실행되더라도 결과가 틀릴 수 있다.' },
          { term: 'Precision variant', meaning: 'Weight를 BF16(16-bit 부동소수점), FP8(8-bit 부동소수점) 또는 quantized representation으로 저장·계산하는 선택이다.', why: 'Memory·속도·지원 kernel·품질의 trade-off이며 확장자만으로 결정할 수 없다.' },
          { term: 'Quantization', meaning: 'Weight나 activation을 더 적은 bit의 제한된 숫자 표현으로 근사하는 과정이다.', why: '파일은 작아져도 계산 때 복원 비용과 지원 kernel 조건이 생길 수 있다.' },
          { term: 'OOM·offload', meaning: 'OOM은 GPU memory 부족 오류이고, offload는 당장 쓰지 않는 tensor를 CPU memory 등으로 옮기는 정책이다.', why: '정적 파일 크기만으로 실행 가능 여부를 판단하지 않는다.' },
        ]} />
        <LoaderManifestViz />
      </section>

      <section id="component-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 component manifest를 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>새 model을 받으면 공식 ComfyUI template 또는 model 제공자의 workflow를 기준점으로 삼는다. Denoiser file, text encoder 개수와 family, VAE, 필요한 model sampling node를 적는다. Community AIO checkpoint나 repack은 그 기준 조합을 편리하게 포장한 variant일 수 있으므로, 원 component contract를 모르면 무엇이 포함됐는지 검증할 수 없다.</p>
          <p>Manifest에는 최소한 <code>role</code>, <code>architecture</code>, <code>filename</code>, <code>precision</code>, <code>hash</code>, <code>loader type</code>, <code>source</code>, <code>license</code>를 둔다. “FLUX용” 같은 한 줄 tag보다 이 필드가 중요한 이유는 같은 family 안에서도 development·distilled·edit variant와 encoder 구성이 다를 수 있기 때문이다.</p>
        </div>
        <Misconception>UI에서 MODEL type으로 연결된다고 올바른 model 조합이라는 뜻은 아니다. ComfyUI의 port type은 coarse contract다. Latent format, text encoder family, adapter target과 model-specific sampling 설정은 official template와 implementation 문서로 더 좁게 확인한다.</Misconception>
      </section>

      <section id="precision-budget" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정적 weight memory는 하한일 뿐이다</h2>
        <M display>{String.raw`\underbrace{M_{\mathrm{static}}}_{\text{정적 가중치 하한}}=\sum_i\underbrace{\frac{N_i b_i}{8}}_{\text{부품별 바이트 수}}`}</M>
        <FormulaNote
          meaning={'각 component의 parameter 수와 저장 bit 수를 byte로 바꾸어 더한다. 8로 나누는 이유는 bit 단위를 byte 단위로 환산하기 위해서다. 이 값은 weight만 센 하한이며 activation, workspace, graph cache, quantization metadata와 allocator 여유분은 포함하지 않는다.'}
          symbols={[
            [String.raw`M_{\mathrm{static}}`, 'Denoiser·text encoder·VAE·adapter 정적 weight를 합한 memory 하한'],
            [String.raw`N_i`, 'i번째 component의 parameter 수'],
            [String.raw`b_i`, 'i번째 component parameter 하나를 저장하는 bit 수'],
            [String.raw`/8`, 'bit를 byte로 바꾸는 단위 변환'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>12GB라는 숫자와 위 계산이 같아도 실행 가능하다는 뜻은 아니다. Sampling 중에는 latent activation과 attention workspace가 필요하고, high resolution·batch·ControlNet·여러 LoRA가 peak를 키운다. 또한 일부 quantized weight는 계산 시 더 넓은 dtype으로 <strong>dequantize</strong>, 즉 근사 정수를 연산용 숫자 표현으로 풀거나 전용 kernel이 쓰는 임시 buffer를 요구한다.</p>
          <p>현실적인 순서는 peak를 만드는 component를 찾고 precision을 낮추는 것이다. Denoiser, 큰 T5 계열 encoder, VAE 순으로 load·encode·sample·decode peak를 측정한다. 무조건 모든 component를 가장 낮게 양자화하면 오히려 지원하지 않는 kernel, 느린 CPU offload(GPU tensor를 CPU memory로 옮겼다가 다시 가져오는 실행)와 품질 저하가 한꺼번에 섞인다.</p>
        </div>
      </section>

      <section id="loader-decision" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Checkpoint, 분리형 loader, GGUF를 고르는 순서</h2>
        <div className="not-prose grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {decisions.map(([title, body], index) => (
            <div key={title} className={`min-w-0 bg-background px-4 py-4 ${decisions.length % 2 === 1 && index === decisions.length - 1 ? 'sm:col-span-2' : ''}`}>
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>GGUF는 낮은 bit weight를 담고 읽는 선택지이지, 어떤 architecture든 같은 loader로 실행하는 범용 스위치가 아니다. ComfyUI-GGUF처럼 해당 tensor layout을 해석하는 custom node가 필요하며, denoiser와 text encoder가 각각 다른 GGUF loader를 쓸 수 있다. LoRA와 custom op 지원도 그 runtime 구현 범위에 묶인다.</p>
          <p>Official template로 BF16 또는 지원되는 기본 precision을 먼저 smoke test하면 architecture wiring과 quantization 문제를 분리할 수 있다. 그다음 한 component씩 FP8·GGUF variant로 바꾸고 같은 seed·input에서 load time, peak memory, latency와 output drift를 기록한다.</p>
        </div>
      </section>

      <section id="failure-modes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증상보다 먼저 깨진 component를 찾는다</h2>
        <div className="not-prose overflow-hidden border border-border">
          {failureModes.map(([symptom, cause, action]) => (
            <div key={symptom} className="grid min-w-0 border-b border-border last:border-b-0 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]">
              <strong className="border-b border-border bg-muted/20 px-3 py-3 text-sm lg:border-b-0 lg:border-r">{symptom}</strong>
              <p className="min-w-0 border-b border-border px-3 py-3 text-sm leading-relaxed text-muted-foreground lg:border-b-0 lg:border-r">가능 원인: {cause}</p>
              <p className="min-w-0 px-3 py-3 text-sm leading-relaxed">분리 실험: {action}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 글의 출력은 <strong>검증된 component manifest와 memory budget</strong>이다. 이제 <InternalLink slug="comfyui-ksampler-parameters">sampling trajectory</InternalLink>에서 같은 runtime을 고정하고 seed·step·CFG·sampler·scheduler를 통제 실험한다.</p>
        </div>
        <CapabilityCheck items={[
          'Model card에서 denoiser·text encoder·VAE·adapter를 분리하고 loader output까지 manifest로 만들 수 있다.',
          '정적 weight 하한과 peak VRAM을 구분하며 한 component씩 precision variant를 검증할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ComfyUI · Models', href: 'https://docs.comfy.org/development/core-concepts/models', note: 'Model file 종류, loader, folder와 official template 확인 순서.' },
          { label: 'ComfyUI-GGUF', href: 'https://github.com/city96/ComfyUI-GGUF', note: 'GGUF denoiser·text encoder loader의 실제 구현 범위와 지원 주의점.' },
        ]} />
      </section>
    </div>
  );
}
