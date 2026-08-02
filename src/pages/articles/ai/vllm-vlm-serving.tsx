import { CodeSidebar, CodeViewButton, useCodeSidebar, type CodeRef } from '@/components/code';
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
import { vllmTree } from './vllm-serving/fileTrees';
import apiServerPy from './vllm-serving/codebase/vllm/entrypoints/openai/api_server.py?raw';
import schedulerPy from './vllm-serving/codebase/vllm/v1/core/sched/scheduler.py?raw';
import requestPy from './vllm-serving/codebase/vllm/v1/request.py?raw';
import engineCorePy from './vllm-serving/codebase/vllm/v1/engine/core.py?raw';
import eaglePy from './vllm-serving/codebase/vllm/v1/spec_decode/eagle.py?raw';
import ServingDepthGuide from './llm-serving-ops/ServingDepthGuide';
import { MultimodalBudgetViz } from './vllm-runtime/viz/VllmRuntimeViz';

const codeRefs: Record<string, CodeRef> = {
  'vlm-render-state': {
    path: 'vllm/entrypoints/openai/api_server.py',
    code: apiServerPy,
    lang: 'python',
    highlight: [408, 460],
    annotations: [
      { lines: [413, 418], color: 'sky', note: 'render server는 engine 없이 전처리 파이프라인을 부트스트랩한다.' },
      { lines: [440, 443], color: 'emerald', note: 'renderer와 io_processor가 이미지/텍스트 입력을 모델 입력 형태로 정규화한다.' },
      { lines: [446, 460], color: 'amber', note: 'OpenAI serving render 객체가 chat template, tool parser, template kwargs를 함께 들고 간다.' },
    ],
    desc: 'VLM serving의 첫 경계는 API 요청을 곧장 GPU engine에 넣지 않고 render/io processor/input processor로 정규화하는 부분이다.',
  },
  'vlm-request-mm-features': {
    path: 'vllm/v1/request.py',
    code: requestPy,
    lang: 'python',
    highlight: [31, 76],
    annotations: [
      { lines: [39, 40], color: 'sky', note: 'streaming continuation도 mm_features와 prompt_token_ids를 분리해서 보존한다.' },
      { lines: [67, 69], color: 'emerald', note: 'Request는 prompt_embeds와 multimodal feature spec을 별도 입력으로 받는다.' },
    ],
    desc: '텍스트 토큰과 멀티모달 feature를 같은 request 객체에 넣되, 토큰 ids와 image/video feature spec을 분리해서 추적한다.',
  },
  'vlm-scheduler-budget': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [185, 211],
    annotations: [
      { lines: [187, 192], color: 'sky', note: '모델이 multimodal input을 지원할 때만 MultiModalBudget을 만든다.' },
      { lines: [203, 210], color: 'emerald', note: 'encoder compute budget과 cache size가 scheduler의 실제 제한값이 된다.' },
    ],
    desc: 'VLM batch는 텍스트 token budget만으로 충분하지 않다. 이미지 encoder 토큰과 cache budget을 같이 계산해야 한다.',
  },
  'vlm-no-partial-mm': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [1168, 1195],
    annotations: [
      { lines: [1173, 1176], color: 'sky', note: '이미 계산된 encoder input은 cache hit로 건너뛴다.' },
      { lines: [1178, 1186], color: 'amber', note: 'chunked multimodal input이 꺼져 있으면 이미지 항목 중간에서 자르지 않는다.' },
      { lines: [1187, 1193], color: 'violet', note: 'EAGLE shift가 있어도 multimodal item 시작 전으로 rollback한다.' },
    ],
    desc: '이미지 입력을 부분 schedule하면 feature/token 정렬이 깨질 수 있다. scheduler는 설정에 따라 multimodal item 경계를 보존한다.',
  },
  'vlm-mm-cache-reset': {
    path: 'vllm/v1/engine/core.py',
    code: engineCorePy,
    lang: 'python',
    highlight: [557, 570],
    annotations: [
      { lines: [557, 564], color: 'rose', note: '진행 중 요청이 있으면 multimodal cache reset은 내부 cache desync 위험을 경고한다.' },
      { lines: [566, 570], color: 'emerald', note: 'EngineCore/WorkerWrapperBase 양쪽 cache를 정리하는 debug 경계다.' },
    ],
    desc: 'VLM serving은 텍스트 KV cache 외에도 multimodal receiver cache를 가진다. reset은 운영 기능이 아니라 debug 경계로 다뤄야 한다.',
  },
  'vlm-eagle-fallback': {
    path: 'vllm/v1/spec_decode/eagle.py',
    code: eaglePy,
    lang: 'python',
    highlight: [1307, 1332],
    annotations: [
      { lines: [1307, 1318], color: 'amber', note: 'target이 multimodal이어도 draft model이 text-only이면 fallback한다.' },
      { lines: [1320, 1332], color: 'sky', note: 'Qwen/GLM OCR/VL 계열은 image token index를 target config에서 맞춘다.' },
    ],
    desc: 'Speculative decoding은 VLM에서 항상 같은 방식으로 켜지지 않는다. draft model의 multimodal 지원 여부와 image token index가 별도 경계다.',
  },
};

interface SectionProps {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

function RefButton({ codeKey, label, onCodeRef }: { codeKey: string; label: string; onCodeRef: SectionProps['onCodeRef'] }) {
  return <CodeViewButton label={label} onClick={() => onCodeRef(codeKey, codeRefs[codeKey])} />;
}

export default function VLLMVLMServingArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="같은 이미지 UUID를 다시 보내 encoder cache가 hit했다면, 그 요청의 text KV도 자동으로 재사용될까?"
          answer={<>아니다. Media identity는 image processor·encoder 결과를 찾는 key이고, prefix cache는 실제 token·model 조건에서 계산된 KV block identity를 찾는다. 둘은 다른 artifact와 수명을 가지므로 각각 hit/miss를 기록해야 한다.</>}
        />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">VLM serving 경계</h2>
          <div className="flex flex-wrap gap-2">
            <RefButton codeKey="vlm-render-state" label="Render state" onCodeRef={sidebar.open} />
            <RefButton codeKey="vlm-request-mm-features" label="Request feature" onCodeRef={sidebar.open} />
          </div>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            vLLM의 VLM serving은 텍스트 전용 serving에 이미지 입력만 붙인 구조가 아니다.
            OpenAI-compatible API 입구에서 renderer, IO processor, input processor를 거치고,
            engine request에는 <code>prompt_token_ids</code>, <code>prompt_embeds</code>, <code>mm_features</code>가 분리되어 들어간다.
          </p>
          <p>
            코어 단위로는 세 경계를 따로 본다. 첫째, 요청을 모델 입력으로 바꾸는 render/preprocess 경계.
            둘째, 이미지 encoder 토큰과 cache budget을 scheduler가 계산하는 경계.
            셋째, multimodal cache와 speculative decoding이 text-only 경로와 달라지는 runtime 경계다.
          </p>
          <p>
            따라서 “이미지 한 장은 몇 token인가?”라는 질문만으로는 부족하다. Raw media의 출처와 hash,
            model-specific resize·patch·placeholder contract, encoder output의 shape와 cache identity,
            decoder가 실제로 소비할 embedding 위치와 KV slot을 차례로 확인해야 한다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Media processor', meaning: '이미지를 resize·normalize하고 model이 기대하는 patch·placeholder 표현으로 바꾼다.', why: '같은 파일도 processor config가 다르면 embedding 위치와 입력 의미가 달라진다.' },
          { term: 'Encoder position', meaning: 'Vision encoder가 decoder에 전달할 feature 위치 하나다.', why: 'Raw pixel 수와 decoder text token 수를 직접 같다고 놓지 않게 한다.' },
          { term: 'Media cache identity', meaning: 'Content hash 또는 stable UUID로 전처리·encoder 결과를 찾는 key다.', why: 'Payload 생략 cache hit와 잘못된 media 재사용을 구분한다.' },
          { term: 'Placeholder alignment', meaning: 'Prompt 안의 media 자리와 실제 feature sequence가 대응하는 계약이다.', why: '이미지 feature 중간 chunking이나 잘못된 image token index가 정렬을 깨뜨린다.' },
        ]} />
        <MultimodalBudgetViz />
      </section>

      <section id="media-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Image token 수가 아니라 media payload의 소유자를 계산한다</h2>
        <M display>{String.raw`\underbrace{M_{\mathrm{media}}}_{\text{이미지 embedding 바이트}}=\underbrace{N_{\mathrm{media}}}_{\text{encoder 위치 수}}\underbrace{d_{\mathrm{model}}}_{\text{위치당 hidden 폭}}\underbrace{b}_{\text{값당 바이트}}`}</M>
        <FormulaNote
          meaning={'Processor가 만든 media position마다 decoder hidden width 크기의 embedding을 BF16으로 저장한다고 보는 payload 하한이다. 공유 fixture에서는 576 × 4,096 × 2 = 4,718,592 bytes = 4.5 MiB다. Processor object, allocator metadata, encoder activation과 workspace는 포함하지 않는다.'}
          symbols={[
            [String.raw`N_{\mathrm{media}}=576`, '이 글의 model-processor fixture가 만든 image embedding position 수'],
            [String.raw`d_{\mathrm{model}}=4096`, 'Decoder에 전달되는 embedding의 hidden width'],
            [String.raw`b=2`, 'BF16 embedding 값 하나의 byte 수'],
            [String.raw`M_{\mathrm{media}}`, 'Cache에 저장할 수 있는 embedding payload의 계산 하한'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>576은 모든 VLM의 규격이 아니다. 입력 resolution, dynamic tiling, video frame sampling과 model processor에 따라 position 수가 달라진다. 운영 로그에는 model revision, processor config, resize 결과, media count, position count와 dtype을 함께 남겨야 byte 계산이 재현된다.</p>
          <p>Media URL을 받는 API라면 성능보다 앞에 trust boundary가 있다. 허용 scheme·domain·redirect·private address를 제한하지 않으면 서버가 내부 주소를 대신 읽는 SSRF 통로가 될 수 있다. Stable UUID만 보내 payload를 생략하는 cache-hit 경로도, miss일 때 원본 media가 없으면 복구할 수 없다는 계약을 API가 명확히 해야 한다.</p>
        </div>
        <Misconception>Media UUID cache hit, encoder feature cache hit, decoder prefix KV hit는 같은 사건이 아니다. Media가 같아도 surrounding text, chat template, model revision 또는 processor가 바뀌면 decoder KV를 그대로 재사용할 수 없다.</Misconception>
      </section>

      <section id="render-preprocess" className="mb-16 scroll-mt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Render와 input processor</h2>
          <RefButton codeKey="vlm-render-state" label="api_server.py" onCodeRef={sidebar.open} />
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            render app state는 engine 없이도 chat template, renderer, IO processor를 초기화한다.
            이 레이어가 이미지 URL, binary payload, chat template, tool 옵션을 모델별 입력 포맷으로 바꾼다.
          </p>
          <p>
            따라서 VLM serving을 검증할 때는 “요청이 들어왔다”가 아니라 “전처리 결과가 모델이 기대하는 multimodal feature spec과 토큰열로 나뉘었는가”를 단위로 둬야 한다.
          </p>
        </div>
      </section>

      <section id="scheduler-budget" className="mb-16 scroll-mt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Multimodal scheduler budget</h2>
          <div className="flex flex-wrap gap-2">
            <RefButton codeKey="vlm-scheduler-budget" label="MM budget" onCodeRef={sidebar.open} />
            <RefButton codeKey="vlm-no-partial-mm" label="Chunk boundary" onCodeRef={sidebar.open} />
          </div>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            VLM 요청은 텍스트 token budget 외에 encoder compute budget과 encoder cache size를 차지한다.
            scheduler는 모델이 multimodal input을 지원하는지 확인한 뒤 <code>MultiModalBudget</code>을 만들고, encoder cache manager를 통해 이미 계산된 feature를 재사용한다.
          </p>
          <p>
            중요한 edge case는 multimodal item의 부분 scheduling이다.
            설정상 chunked multimodal input을 허용하지 않으면 scheduler는 이미지 feature 중간에서 잘라 넣지 않고 item 시작 전으로 rollback한다.
          </p>
        </div>
      </section>

      <section id="runtime-cache" className="mb-16 scroll-mt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Runtime cache와 speculative decode</h2>
          <div className="flex flex-wrap gap-2">
            <RefButton codeKey="vlm-mm-cache-reset" label="MM cache" onCodeRef={sidebar.open} />
            <RefButton codeKey="vlm-eagle-fallback" label="EAGLE fallback" onCodeRef={sidebar.open} />
          </div>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            EngineCore에는 multimodal cache reset 경계가 따로 있다.
            진행 중인 요청이 있을 때 cache를 지우면 내부 sender/receiver cache가 어긋날 수 있으므로, 운영 중 hot path가 아니라 debug와 장애 분석 단위로 다뤄야 한다.
          </p>
          <p>
            speculative decoding도 VLM에서는 text-only와 같지 않다.
            target model이 multimodal이어도 draft model이 image embedding을 지원하지 않으면 text-only mode로 떨어지고, Qwen/GLM OCR/VL 계열은 image token index 연결을 별도로 맞춘다.
          </p>
          <p>
            이 경계에서 <InternalLink slug="vllm-spec-decode">Speculative Decoding</InternalLink>의 commit 규칙은 유지되지만,
            proposer가 읽은 조건이 target과 같은지 별도 검증해야 한다. Draft가 media feature를 보지 못하면 image-grounded 구간의 acceptance와 latency가 달라질 수 있고,
            unverified lookahead를 media placeholder 경계 너머에 그대로 commit해서는 안 된다.
          </p>
        </div>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Runtime 경로를 닫는 산출물: media admission evidence</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>한 VLM request는 raw media 또는 trusted UUID, processor revision과 output shape, placeholder alignment, encoder cache hit/miss, encoder compute·cache budget, text token budget, <InternalLink slug="vllm-paged-attention">decoder KV block</InternalLink>과 final commit boundary를 한 trace에 남겨야 한다. 이 evidence가 있어야 느린 요청을 download, processor, encoder, scheduler queue, decoder와 output 단계로 분리할 수 있다.</p>
          <p>이로써 네 글의 handoff가 닫힌다. PagedAttention이 물리 KV 장부를 만들고, scheduler가 한 step의 작업 계획을 만들고, verifier가 token commit을 확정하며, VLM admission이 media state와 text state가 같은 요청에서 안전하게 만나는지 증명한다.</p>
        </div>
        <CapabilityCheck items={[
          'Processor position 수와 hidden dtype에서 media embedding payload 하한을 계산하고 runtime peak와 구분할 수 있다.',
          'Media cache, encoder budget, decoder KV, placeholder alignment와 URL security를 각각 독립된 failure owner로 추적할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'vLLM Multimodal Inputs', href: 'https://docs.vllm.ai/en/latest/features/multimodal_inputs/', note: 'Media input, content hash·UUID cache와 media URL security의 현재 공식 경계.' },
          { label: 'vLLM MultiModalConfig', href: 'https://docs.vllm.ai/en/latest/api/vllm/config/multimodal/', note: '현재 multimodal memory·cache 설정과 version-sensitive field.' },
          { label: 'vLLM Multimodal Cache API', href: 'https://docs.vllm.ai/en/latest/api/vllm/multimodal/cache/', note: 'Processor-side와 engine-side cache ordering의 현재 구현.' },
          { label: 'vLLM SchedulerConfig', href: 'https://docs.vllm.ai/en/latest/api/vllm/config/scheduler/', note: 'Encoder compute/cache budget과 multimodal chunk 설정의 현재 의미.' },
        ]} />
      </section>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ServingDepthGuide guideKey="vlm" />
      </div>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
