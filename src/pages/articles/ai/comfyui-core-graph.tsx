import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { TypedDagViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const types = [
  ['MODEL', 'latent의 noise·velocity를 예측하는 denoiser 실행 객체', 'LoRA나 model sampling patch 뒤에는 새 MODEL output을 consumer까지 따라간다.'],
  ['CLIP', '문자열을 model이 사용할 embedding으로 바꾸는 text-encoding 책임', 'MODEL family와 맞는 tokenizer·encoder 조합인지 loader에서 확인한다.'],
  ['VAE', 'pixel IMAGE와 compressed LATENT 사이를 encode/decode하는 codec', 'IMAGE를 LATENT input에 바로 연결하지 않고 좌표·shape 경계를 명확히 한다.'],
  ['CONDITIONING', 'prompt·control·reference가 가공된 조건 자료구조', '문자열이 아니라 어느 encoder와 control을 거친 결과인지 추적한다.'],
  ['LATENT', 'sampler가 반복 갱신하는 압축 표현과 관련 metadata', '아직 화면에 저장할 pixel image가 아니므로 decode 경계를 찾는다.'],
  ['IMAGE / MASK', 'pixel tensor와 어느 위치를 바꿀지 나타내는 공간 선택', 'crop·resize 뒤 좌표와 해상도가 같은 공간인지 확인한다.'],
] as const;

const debugOrder = [
  ['1 · Consumer', '문제가 보이는 output node에서 시작한다. 최종 IMAGE를 누가 만들었는가?'],
  ['2 · Type', '그 node의 각 input이 요구한 type과 실제 source output을 대조한다.'],
  ['3 · Version', '같은 display name이라도 node type·package version과 input schema가 같은지 본다.'],
  ['4 · Invalidation', '마지막 실행 이후 어떤 widget·link·file이 바뀌어 cache가 무효화됐는지 찾는다.'],
  ['5 · Bypass', '한 condition branch씩 우회해 earliest divergence를 좁힌다. Never와 Bypass의 의미를 구분한다.'],
] as const;

export default function ComfyUICoreGraphArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <QuestionLead
          question="Canvas에서 왼쪽에 있는 node가 항상 먼저 실행되고, prompt를 바꾸면 graph 전체가 다시 도는가?"
          answer="아니다. 실행은 output이 요구하는 typed dependency를 따라 정렬되고, 이전 실행과 입력이 같은 node는 재사용될 수 있다. 화면 위치는 설명을 돕지만 실행 계약은 link와 input 변화에 있다."
        />
        <h2 className="mb-6 text-2xl font-bold">Core graph를 읽는 두 축</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>복잡한 workflow도 두 질문으로 줄일 수 있다. <strong>이 link는 어떤 type의 값을 전달하는가?</strong> 그리고 <strong>최종 output은 어느 upstream 값에 의존하는가?</strong> ComfyUI UI가 port 색을 다르게 보이는 이유는 장식이 아니라 서로 다른 자료형을 섞지 못하게 하기 위해서다.</p>
          <p>입문용 txt2img graph는 checkpoint에서 MODEL·CLIP·VAE를 꺼내고, CLIP이 prompt를 CONDITIONING으로 만들며, sampler가 MODEL·CONDITIONING·LATENT를 받아 새 LATENT를 만든 뒤 VAE가 IMAGE로 decode한다. 이것은 외울 node 목록이 아니라 타입 변환 사슬이다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Producer · consumer', meaning: 'Producer는 값을 만드는 upstream node이고, consumer는 그 값을 input으로 읽는 downstream node다.', why: 'Canvas의 좌우가 아니라 값이 만들어지고 사용되는 dependency 방향을 읽게 한다.' },
          { term: 'Typed link', meaning: 'source output과 consumer input의 자료형이 맞는 연결이다.', why: '상자가 비슷해 보여도 MODEL, CONDITIONING, LATENT와 IMAGE는 서로 교환할 수 없다.' },
          { term: 'Dependency closure', meaning: '목표 output을 계산하는 데 필요한 모든 upstream node 집합이다.', why: '고립된 node나 다른 output branch는 현재 실행에 필요하지 않을 수 있다.' },
          { term: 'Topological execution', meaning: 'consumer보다 producer가 먼저 준비되도록 dependency를 정렬한다.', why: 'canvas 좌표와 무관하게 올바른 데이터 준비 순서를 보장한다.' },
          { term: 'Cache invalidation', meaning: 'node input이 이전 실행과 달라졌을 때 저장된 결과를 버리는 판단이다.', why: 'prompt만 바꿀 때 loader까지 다시 실행되지 않는 이유를 설명한다.' },
        ]} />
      </section>

      <section id="type-contracts" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">여섯 타입의 책임</h2>
        <div className="not-prose overflow-hidden border border-border">
          {types.map(([name, meaning, check]) => (
            <div key={name} className="grid min-w-0 border-b border-border last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <code className="min-w-0 border-b border-border bg-muted/20 px-3 py-3 text-xs font-bold text-foreground sm:border-b-0 sm:border-r">{name}</code>
              <div className="min-w-0 px-3 py-3"><p className="text-sm leading-relaxed">{meaning}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">확인: {check}</p></div>
            </div>
          ))}
        </div>
        <Misconception>같은 색 port가 연결된다고 model architecture까지 호환된다는 뜻은 아니다. UI type은 거친 실행 범주다. 특정 denoiser와 text encoder·VAE의 latent convention이 맞는지는 다음 loader 단계에서 별도로 검증한다.</Misconception>
      </section>

      <section id="execution-order" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실행 순서는 dependency가 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Save Image를 target으로 보면 먼저 IMAGE가 필요하다. 그 IMAGE를 VAE Decode가 만든다면 LATENT와 VAE가 먼저 필요하고, LATENT를 sampler가 만든다면 MODEL·CONDITIONING·시작 LATENT가 더 먼저 필요하다. 이렇게 consumer 요구를 거꾸로 펼친 뒤 producer가 준비되는 순서로 실행한다.</p>
          <p>Dependency로 고정되지 않은 형제 node 사이의 순서는 믿지 않는다. 현재 backend는 graph를 dependency에 맞춰 정렬하지만, cache나 lazy evaluation과 구현 변경으로 독립 branch의 상대 순서는 달라질 수 있다. “A가 우연히 먼저 실행됐으니 B가 A의 side effect를 읽는다” 같은 custom node는 graph 계약을 깨뜨린다.</p>
        </div>
        <TypedDagViz />
      </section>

      <section id="cache-modes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Cache, Never, Bypass</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Prompt text만 바꾸면 text encode와 그 결과에 의존하는 sampler·decode는 다시 계산될 수 있지만, model filename이 같은 loader는 이전 결과를 재사용할 수 있다. 이것은 node가 무시된 것이 아니라 input identity가 같아서 계산을 생략한 것이다. 반대로 model file, LoRA strength, link source가 바뀌면 그 값을 소비하는 downstream이 무효화된다.</p>
          <p><strong>Never</strong>는 node가 값을 만들지 않으므로 downstream이 필요한 input을 잃을 수 있다. <strong>Bypass</strong>는 node 처리를 건너뛰고 가능한 원래 값을 다음으로 전달하려는 mode다. LoRA ablation에서 Bypass가 유용한 이유는 graph 연결을 뜯지 않고 weight patch 전 값을 consumer에 넘길 수 있기 때문이다.</p>
          <p>Lazy input은 선택되지 않은 branch의 upstream 계산을 피할 수 있지만 모든 custom node가 이를 사용한다고 가정하면 안 된다. 실행 trace에서 실제로 어떤 node가 실행·재사용·건너뜀 상태였는지 확인한다.</p>
        </div>
      </section>

      <section id="debugging" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">오른쪽 결과에서 왼쪽 원인으로</h2>
        <div className="not-prose grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {debugOrder.map(([title, body], index) => (
            <div key={title} className={`min-w-0 bg-background px-4 py-4 ${debugOrder.length % 2 === 1 && index === debugOrder.length - 1 ? 'sm:col-span-2' : ''}`}>
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>LoRA가 안 먹는다면 LoRA node가 canvas에 있는지 보지 않는다. KSampler의 MODEL input에서 거꾸로 올라가 패치된 MODEL output에 도달하는지 본다. Prompt가 일부 pass에만 반영된다면 각 sampler의 CONDITIONING source를 따로 추적한다. 결과에서 시작하면 보이는 node 수가 아니라 실제 dependency로 문제 공간이 줄어든다.</p>
          <p>이 글이 다음 단계에 넘기는 것은 <strong>target output의 typed dependency closure</strong>다. <InternalLink slug="comfyui-loaders-gguf">모델 부품과 loader 계약</InternalLink>에서 그 closure의 MODEL·CLIP·VAE가 실제로 함께 쓸 수 있는 component인지 확인한다.</p>
        </div>
        <CapabilityCheck items={[
          'MODEL·CLIP·VAE·CONDITIONING·LATENT·IMAGE 경계를 node 이름 없이 설명할 수 있다.',
          'Prompt 변경 뒤 일부 node만 재실행되는 이유를 dependency와 cache invalidation으로 추적할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ComfyUI · Nodes', href: 'https://docs.comfy.org/development/core-concepts/nodes', note: 'Node state, typed connection, input 변경 시 실행과 Never·Bypass 동작.' },
          { label: 'ComfyUI · Links', href: 'https://docs.comfy.org/development/core-concepts/links', note: 'Link가 data를 전달하고 type safety를 만드는 계약.' },
          { label: 'ComfyUI · Properties', href: 'https://docs.comfy.org/development/core-concepts/properties', note: 'Widget·input property와 strong typing의 의미.' },
          { label: 'ComfyUI · Execution model inversion', href: 'https://docs.comfy.org/development/comfyui-server/execution_model_inversion_guide', note: 'Dependency ordering, lazy evaluation과 node expansion 경계.' },
          { label: 'ComfyUI · Lazy evaluation', href: 'https://docs.comfy.org/custom-nodes/backend/lazy_evaluation', note: '선택되지 않은 lazy input upstream을 계산하지 않는 custom-node 계약.' },
        ]} />
      </section>
    </div>
  );
}
