import { Link } from 'react-router-dom';
import {
  CapabilityCheck,
  ConceptPrimer,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath, coreItemPath } from '@/lib/paths';

type VllmUnit = {
  id: string;
  area: string;
  target: string;
  unit: string;
  evidence: string;
  guideHref: string;
  guideLabel: string;
  command: string;
  status: 'done' | 'doing' | 'todo';
};

type Coverage = {
  group: string;
  source: string;
  units: number;
  command: string;
  proof: string;
};

const stats = [
  ['코드베이스', 'vllm-project/vllm'],
  ['기준 시각', '2026-07-21 UTC'],
  ['관리 기준', '함수/메서드 + 검증 경계 + 확인 명령'],
  ['대상 범위', 'EngineCore, Scheduler, KV cache, sampler, API server'],
  ['코드 해설', '기능 단위별 직접 연결'],
];

const runtimeUnits: VllmUnit[] = [
  {
    id: 'VLLM-RUN-001',
    area: 'vllm/engine',
    target: 'EngineCore.step()',
    unit: 'schedule() → execute_model() → sample_tokens() → update_from_output() 순서가 한 step 안에서 유지된다.',
    evidence: 'vllm/v1/engine/core.py:378',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-engine-step'),
    guideLabel: '함수별 상세',
    command: "pytest tests/engine -k 'request or output or state' -q",
    status: 'done',
  },
  {
    id: 'VLLM-RUN-002',
    area: 'vllm/worker',
    target: 'GPUWorker.execute_model()',
    unit: 'scheduler_output.total_num_scheduled_tokens가 0보다 클 때만 forward path가 열리고, pipeline parallel tensor 수신 후 model_runner로 위임된다.',
    evidence: 'vllm/v1/worker/gpu_worker.py:759',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-worker-execute-model'),
    guideLabel: '함수별 상세',
    command: "pytest tests/worker tests/model_executor -k 'prefill or decode or metadata' -q",
    status: 'done',
  },
  {
    id: 'VLLM-RUN-003',
    area: 'vllm/sampling',
    target: 'Sampler.forward()',
    unit: 'logits에서 다음 token id를 뽑는 sampling contract가 grammar bitmask, temperature/top-p, stop 조건을 깨지 않는다.',
    evidence: 'vllm/v1/sample/sampler.py:67',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-sampler-forward'),
    guideLabel: '함수별 상세',
    command: "pytest tests -k 'sampling or stop or max_tokens' -q",
    status: 'todo',
  },
];

const schedulerUnits: VllmUnit[] = [
  {
    id: 'VLLM-SCH-001',
    area: 'vllm/scheduler',
    target: 'Scheduler.schedule()',
    unit: 'RUNNING 요청을 순회하며 num_new_tokens를 계산하고 token_budget을 초과하지 않는 batch만 만든다.',
    evidence: 'vllm/v1/core/sched/scheduler.py:341',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-scheduler-schedule'),
    guideLabel: '함수별 상세',
    command: "pytest tests/core tests/engine -k 'scheduler or budget' -q",
    status: 'done',
  },
  {
    id: 'VLLM-SCH-002',
    area: 'vllm/scheduler',
    target: 'Scheduler.schedule()',
    unit: 'num_computed_tokens와 num_tokens_with_spec 차이로 prefill/decode를 같은 token budget 모델에서 처리한다.',
    evidence: 'vllm/v1/core/sched/scheduler.py:376',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-scheduler-schedule'),
    guideLabel: '함수별 상세',
    command: "pytest tests -k 'chunked_prefill or prefill' -q",
    status: 'doing',
  },
  {
    id: 'VLLM-SCH-003',
    area: 'vllm/scheduler',
    target: 'Scheduler._preempt_request()',
    unit: '블록 부족 시 RUNNING request의 KV cache와 encoder cache를 해제하고 waiting queue 맨 앞으로 되돌린다.',
    evidence: 'vllm/v1/core/sched/scheduler.py:949',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-scheduler-preempt'),
    guideLabel: '함수별 상세',
    command: "pytest tests -k 'preemption or recompute or swap' -q",
    status: 'todo',
  },
];

const kvUnits: VllmUnit[] = [
  {
    id: 'VLLM-KV-001',
    area: 'vllm/kv_cache',
    target: 'BlockPool.get_cached_block()',
    unit: 'prefix block hash 조회가 cache hit/miss를 명확히 나누고 ref_cnt가 남은 블록을 잘못 재사용하지 않는다.',
    evidence: 'vllm/v1/core/block_pool.py:183',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-block-pool-cache'),
    guideLabel: '함수별 상세',
    command: "pytest tests -k 'block_pool or kv_cache_manager' -q",
    status: 'done',
  },
  {
    id: 'VLLM-KV-002',
    area: 'vllm/kv_cache',
    target: 'BlockPool.free_blocks()',
    unit: '해제된 KVCacheBlock은 ref_cnt가 0일 때만 free queue로 돌아가고 prefix cache 후보 상태를 보존한다.',
    evidence: 'vllm/v1/core/block_pool.py:409',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-block-pool-free'),
    guideLabel: '함수별 상세',
    command: "pytest tests -k 'prefix_cache or automatic_prefix' -q",
    status: 'done',
  },
  {
    id: 'VLLM-KV-003',
    area: 'vllm/kv_cache',
    target: 'KVCacheManager.allocate_slots()',
    unit: 'computed/new_computed/external/new/lookahead 구간을 나눠 새 token과 spec decode용 block을 정확히 할당한다.',
    evidence: 'vllm/v1/core/kv_cache_manager.py:257',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-kv-allocate-slots'),
    guideLabel: '함수별 상세',
    command: "pytest tests -k 'evict or block_table or cache_reset' -q",
    status: 'todo',
  },
];

const servingUnits: VllmUnit[] = [
  {
    id: 'VLLM-API-001',
    area: 'vllm/entrypoints/openai',
    target: 'build_async_engine_client()',
    unit: 'OpenAI-compatible server가 AsyncLLM engine client를 생성하고 lifecycle 안에서 닫을 수 있다.',
    evidence: 'vllm/entrypoints/openai/api_server.py:77',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-api-engine-client'),
    guideLabel: '함수별 상세',
    command: "pytest tests/entrypoints/openai -k 'chat or completion or stream or error' -q",
    status: 'done',
  },
  {
    id: 'VLLM-API-002',
    area: 'vllm/entrypoints/openai',
    target: 'init_app_state()',
    unit: 'chat/completions, completions, embeddings 등 route handler가 같은 engine client와 model config를 공유한다.',
    evidence: 'vllm/entrypoints/openai/api_server.py:317',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-api-app-state'),
    guideLabel: '함수별 상세',
    command: "pytest tests/entrypoints/openai -k 'tool or structured or stop' -q",
    status: 'todo',
  },
  {
    id: 'VLLM-VLM-001',
    area: 'vllm/multimodal',
    target: 'init_render_app_state()',
    unit: 'render server 상태 초기화가 multimodal renderer와 OpenAI route state를 분리해 둔다.',
    evidence: 'vllm/entrypoints/openai/api_server.py:408',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-api-render-state'),
    guideLabel: '함수별 상세',
    command: "pytest tests/multimodal -k 'image or video or processor or renderer' -q",
    status: 'done',
  },
  {
    id: 'VLLM-VLM-002',
    area: 'vllm/multimodal',
    target: 'KVCacheManager.allocate_slots()',
    unit: 'multimodal encoder cache와 lookahead block이 scheduler token budget을 침범하지 않는지 같은 allocation 경계에서 본다.',
    evidence: 'vllm/v1/core/kv_cache_manager.py:327',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-kv-allocate-slots'),
    guideLabel: '함수별 상세',
    command: "pytest tests/multimodal tests/core -k 'budget or cache or encoder' -q",
    status: 'doing',
  },
];

const decodingUnits: VllmUnit[] = [
  {
    id: 'VLLM-DEC-001',
    area: 'vllm/spec_decode',
    target: 'RejectionSampler.forward()',
    unit: 'draft_probs와 target logits로 accepted/recovered/bonus token을 만들고 최종 token sequence contract를 유지한다.',
    evidence: 'vllm/v1/sample/rejection_sampler.py:60',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-rejection-sampler'),
    guideLabel: '함수별 상세',
    command: "pytest tests/spec_decode -k 'accept or reject or sampler' -q",
    status: 'done',
  },
  {
    id: 'VLLM-DEC-002',
    area: 'vllm/spec_decode',
    target: 'SpecDecodeBaseProposer / EagleProposer',
    unit: 'target hidden states에서 draft token을 제안할 때 hidden_size, batch size, num_speculative_tokens 제한을 지킨다.',
    evidence: 'vllm/v1/spec_decode/eagle.py:60, 400',
    guideHref: coreItemPath('ai-systems', 'vllm-fn-eagle-proposer'),
    guideLabel: '함수별 상세',
    command: "pytest tests/spec_decode tests/multimodal -k 'vlm or multimodal or fallback' -q",
    status: 'doing',
  },
];

const functionEntries = Array.from(
  new Map(
    [...runtimeUnits, ...schedulerUnits, ...kvUnits, ...servingUnits, ...decodingUnits].map((unit) => [
      unit.guideHref,
      unit,
    ]),
  ).values(),
);

const coverage: Coverage[] = [
  {
    group: 'Runtime loop와 request state',
    source: 'VLLM-RUN-001..003',
    units: runtimeUnits.length,
    command: "pytest tests/engine tests/worker tests/model_executor -k 'request or output or prefill or decode' -q",
    proof: 'request lifecycle, batch metadata, sampling 종료 조건을 runtime 최소 단위로 분리한다.',
  },
  {
    group: 'Scheduler와 batch budget',
    source: 'VLLM-SCH-001..003',
    units: schedulerUnits.length,
    command: "pytest tests/core tests/engine -k 'scheduler or budget or preemption or chunked_prefill' -q",
    proof: 'continuous batching, chunked prefill, preemption이 request 순서와 KV 참조를 깨지 않는지 본다.',
  },
  {
    group: 'PagedAttention과 KV cache',
    source: 'VLLM-KV-001..003',
    units: kvUnits.length,
    command: "pytest tests -k 'block_pool or kv_cache or prefix_cache or evict' -q",
    proof: 'block pool, prefix cache, eviction이 memory budget과 request isolation을 지키는지 본다.',
  },
  {
    group: 'OpenAI-compatible serving과 VLM input',
    source: 'VLLM-API-001..002, VLLM-VLM-001..002',
    units: servingUnits.length,
    command: "pytest tests/entrypoints/openai tests/multimodal -k 'chat or completion or stream or image or video or budget' -q",
    proof: 'API schema, streaming, error shape, multimodal preprocessing, encoder budget을 serving 단위로 묶는다.',
  },
  {
    group: 'Speculative decoding',
    source: 'VLLM-DEC-001..002',
    units: decodingUnits.length,
    command: "pytest tests/spec_decode -k 'draft or eagle or sampler or fallback' -q",
    proof: 'draft/verify/reject와 VLM fallback을 decoding 단위로 분리한다.',
  },
];

const nextExpansions = [
  '반영됨: vLLM runtime, serving, speculative decoding 단위별 command를 표에 고정했다.',
  '반영됨: 각 unit 상세 링크에서 request 입력, 실패 응답, cleanup 기준을 테스트 매트릭스로 확인한다.',
  '반영됨: LiteLLM/Open-R1은 /lab/core/ai-systems/ai-llm-ops-codebase 레지스트리로 전환했다.',
  '완료: 대기 중인 확장 없음. 추가 확장은 새 코드베이스가 생길 때 별도 항목으로 등록한다.',
];

function StatusBadge({ status }: { status: VllmUnit['status'] }) {
  const label = status === 'done' ? '작성됨' : status === 'doing' ? '확장 중' : '대기';
  return (
    <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function UnitTable({ units }: { units: VllmUnit[] }) {
  return (
    <div className="not-prose">
      <div className="hidden overflow-hidden rounded-md border xl:block">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">범위</th>
            <th className="px-3 py-2 font-medium">대상 함수</th>
            <th className="px-3 py-2 font-medium">검증 단위</th>
            <th className="px-3 py-2 font-medium">근거</th>
            <th className="px-3 py-2 font-medium">함수 문서</th>
            <th className="px-3 py-2 font-medium">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {units.map((unit) => (
            <tr key={unit.id} className="align-top transition-colors hover:bg-muted/35">
              <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-muted-foreground">{unit.id}</td>
              <td className="px-3 py-3 text-muted-foreground">{unit.area}</td>
              <td className="px-3 py-3">
                <Link
                  to={unit.guideHref}
                  className="block rounded-sm font-mono text-xs text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                >
                  {unit.target}
                </Link>
              </td>
              <td className="px-3 py-3 leading-relaxed">
                <Link
                  to={unit.guideHref}
                  className="block rounded-sm text-foreground/90 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                >
                  {unit.unit}
                </Link>
              </td>
              <td className="px-3 py-3 text-muted-foreground">{unit.evidence}</td>
              <td className="px-3 py-3">
                <Link to={unit.guideHref} className="text-xs font-medium text-foreground underline-offset-4 hover:underline">
                  {unit.guideLabel}
                </Link>
              </td>
              <td className="px-3 py-3"><StatusBadge status={unit.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="divide-y divide-border border-y border-border xl:hidden">
        {units.map((unit) => (
          <article key={unit.id} className="min-w-0 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold text-muted-foreground">{unit.id} · {unit.area}</span>
              <StatusBadge status={unit.status} />
            </div>
            <Link to={unit.guideHref} className="mt-2 block break-words font-mono text-xs font-semibold underline decoration-border underline-offset-4">{unit.target}</Link>
            <p className="mt-2 text-sm leading-relaxed">{unit.unit}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">근거 · {unit.evidence}</p>
            <code className="mt-3 block min-w-0 whitespace-pre-wrap break-all rounded-md bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">{unit.command}</code>
          </article>
        ))}
      </div>
    </div>
  );
}

const requestFlow = [
  ['01', 'API 입력', 'request schema와 multimodal preprocessing'],
  ['02', 'Scheduler', 'prefill·decode·preemption token budget'],
  ['03', 'KV·forward', 'block allocation과 model execution'],
  ['04', 'Sampling·출력', 'token 선택, stop과 streaming contract'],
];

function VllmRegistryFlowViz() {
  return (
    <div className="not-prose my-7 border-y border-border py-5" aria-label="vLLM request 검증 경계 순서">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div><p className="text-[11px] font-bold text-muted-foreground">REQUEST LIFECYCLE</p><h3 className="mt-1 text-base font-bold">장애가 난 step에서 소유 함수를 찾는다</h3></div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">레지스트리 행은 이 흐름의 한 경계를 가리키고, 상세 문서는 그 함수의 불변조건과 반례를 담당합니다.</p>
      </div>
      <ol className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
        {requestFlow.map(([number, title, detail]) => (
          <li key={number} className="min-w-0 bg-background p-4"><span className="font-mono text-xs font-bold text-muted-foreground">{number}</span><strong className="mt-2 block text-sm">{title}</strong><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{detail}</span></li>
        ))}
      </ol>
    </div>
  );
}

export default function VllmTestUnits() {
  return (
    <div className="space-y-10">
      <section id="overview">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Request가 멈춘 경계에서 검증 단위를 찾는다</h2>
        <QuestionLead
          question="vLLM 응답이 느리거나 틀렸을 때, model 전체 대신 어느 함수부터 확인해야 할까?"
          answer="입력이 API에서 scheduler로 들어갔는지, token budget과 KV block이 할당됐는지, model forward가 실행됐는지, sampler와 streaming이 출력을 보존했는지를 request lifecycle 순서로 나눈다. 이 페이지는 그 경계를 찾는 레지스트리이며 각 상세 링크가 실제 검증 설명을 맡는다."
        />
        <ConceptPrimer
          title="레지스트리에서 혼동하면 안 되는 네 책임"
          items={[
            { term: 'Request state', meaning: 'Waiting, running, preempted, finished로 이동하는 한 요청의 생명주기다.', why: 'Latency와 누락이 어느 transition에서 생겼는지 찾는다.' },
            { term: 'Token budget', meaning: '한 scheduler step에서 prefill과 decode에 허용한 새 token 수다.', why: 'Batch 크기와 model input shape가 어떻게 결정되는지 설명한다.' },
            { term: 'KV block', meaning: '이미 계산한 attention key/value를 request별 block으로 보존한 memory 단위다.', why: 'Prefix hit, eviction과 request isolation을 구분한다.' },
            { term: 'Serving contract', meaning: 'OpenAI-compatible schema, streaming event, stop과 error shape의 외부 약속이다.', why: 'Model 계산이 맞아도 API가 틀릴 수 있음을 분리한다.' },
          ]}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          이 페이지는 vLLM 블로그 글을 복사한 문서가 아니라, go-ethereum 검증 단위 페이지처럼
          함수/메서드 이름, 코드 위치, 검증 경계를 같이 둔 코어 레지스트리입니다. 각 단위는 geth 절차처럼 함수별 상세 문서로 바로 연결됩니다.
        </p>
        <VllmRegistryFlowViz />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {functionEntries.map((unit) => (
            <Link
              key={unit.guideHref}
              to={unit.guideHref}
              className="group rounded-lg border bg-card px-3 py-3 transition-colors hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs font-medium text-foreground">{unit.target}</div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">{unit.area}</div>
                </div>
                <span className="shrink-0 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  상세
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="coverage">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">필수 기능 범위</h2>
        <div className="space-y-3">
          {coverage.map((entry) => (
            <div key={entry.group} className="rounded-lg border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{entry.group}</h3>
                <span className="text-xs text-muted-foreground">{entry.source} · {entry.units} units</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.proof}</p>
              <code className="mt-3 block min-w-0 whitespace-pre-wrap break-all rounded-md bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                {entry.command}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section id="runtime">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Runtime, Scheduler, KV Cache</h2>
        <div className="space-y-5">
          <UnitTable units={runtimeUnits} />
          <UnitTable units={schedulerUnits} />
          <UnitTable units={kvUnits} />
        </div>
      </section>

      <section id="serving">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Serving API와 Multimodal Input</h2>
        <div className="space-y-5">
          <UnitTable units={servingUnits} />
          <UnitTable units={decodingUnits} />
        </div>
      </section>

      <section id="commands">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">확인 명령</h2>
        <div className="space-y-2">
          {[...runtimeUnits, ...schedulerUnits, ...kvUnits, ...servingUnits, ...decodingUnits].map((unit) => (
            <div key={unit.id} className="rounded-md border bg-card px-3 py-2">
              <div className="mb-1 text-xs font-medium text-muted-foreground">{unit.id}</div>
              <code className="block min-w-0 whitespace-pre-wrap break-all text-xs leading-relaxed text-muted-foreground">{unit.command}</code>
            </div>
          ))}
        </div>
      </section>

      <section id="ledger">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">확장 상태</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {nextExpansions.map((item) => (
            <div key={item} className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
        <CapabilityCheck
          title="레지스트리를 사용해 할 수 있어야 하는 일"
          items={[
            '느린 응답을 API·scheduler·KV allocation·forward·sampling 경계로 분해한다.',
            'Prefill과 decode가 같은 token budget 안에서 경쟁하는 지점을 찾는다.',
            'KV cache hit·eviction·preemption이 request state와 isolation을 깨지 않는지 검사한다.',
            '요약 행에서 상세 함수 문서와 좁은 pytest 명령으로 내려간다.',
          ]}
        />
        <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
          <Link to={articlePath('ai', 'llm-serving-ops')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">운영 맥락</span><strong className="mt-2 block text-sm">LLM Serving & Ops</strong></Link>
          <Link to={articlePath('ai', 'llm-architecture-kv-long-context')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">모델 기반</span><strong className="mt-2 block text-sm">KV cache와 long context</strong></Link>
          <Link to={articlePath('ai', 'vllm-vlm-serving')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">멀티모달 확장</span><strong className="mt-2 block text-sm">vLLM VLM serving</strong></Link>
        </div>
        <SourceNotes sources={[
          { label: 'vLLM repository', href: 'https://github.com/vllm-project/vllm', note: '함수 위치와 tests 상태를 다시 확인할 원본 코드베이스.' },
          { label: 'vLLM Architecture', href: 'https://docs.vllm.ai/en/latest/design/arch_overview/', note: 'Engine core, worker와 request 처리 책임을 설명하는 공식 설계 문서.' },
          { label: 'vLLM Automatic Prefix Caching', href: 'https://docs.vllm.ai/en/latest/design/prefix_caching/', note: 'KV block hash와 prefix reuse의 공식 설계 설명.' },
        ]} />
      </section>
    </div>
  );
}
