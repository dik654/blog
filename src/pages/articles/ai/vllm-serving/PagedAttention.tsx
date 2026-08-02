import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import { InternalLink, Misconception } from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { sharedCodeRefs } from './sharedCodeRefs';
import { VLLM_EXCERPT_SET, vllmExcerptUrl } from './sourceSnapshot';
import type { CodeRef } from '@/components/code/types';

const ledger = [
  {
    index: '01',
    title: '논리 순서',
    detail: 'request의 token 0, 1, 2…는 그대로 이어진다. 모델이 읽는 sequence 의미는 바뀌지 않는다.',
  },
  {
    index: '02',
    title: 'Block table',
    detail: '논리 block 번호를 실제 GPU KV block 번호에 매핑한다. 물리 주소가 연속일 필요가 없다.',
  },
  {
    index: '03',
    title: 'Free pool',
    detail: '필요해질 때 block을 가져오고 request가 끝나거나 cache가 퇴거될 때 반환한다.',
  },
  {
    index: '04',
    title: 'Scheduler 경계',
    detail: '이번 step에 필요한 slot을 확보하지 못하면 실행 계획을 줄이거나 request를 preempt해야 한다.',
  },
] as const;

export default function PagedAttention({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const kvSource = VLLM_EXCERPT_SET['vllm/v1/core/kv_cache_manager.py'];

  return (
    <section id="paged-attention" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">KV cache를 주소가 아니라 장부로 본다</h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Transformer decode는 새 token 하나를 만들 때마다 이전 token의 key·value를 다시 계산하지 않도록 KV cache에 보관한다. 문제는 request마다 prompt와 output 길이가 달라 cache 크기가 계속 변한다는 점이다. 최대 길이만큼 연속 공간을 미리 잡으면 예약 낭비가 생기고, 작은 빈 공간이 흩어지면 큰 연속 공간을 만들기 어렵다.
        </p>
        <p>
          PagedAttention은 sequence의 KV를 고정 token 수의 <strong>논리 block</strong>으로 나누고, block table이 이를 비연속 <strong>물리 block</strong>에 연결한다. OS paging에서 가져온 핵심은 “token 순서를 흩뜨리는 것”이 아니라 <strong>연속된 의미와 연속된 물리 주소를 분리하는 간접 계층</strong>이다.
        </p>

        <div className="not-prose my-6 divide-y divide-border border-y border-border">
          {ledger.map((item) => (
            <div key={item.index} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[3rem_9rem_minmax(0,1fr)]">
              <span className="font-mono text-sm font-black text-teal-700 dark:text-teal-300">{item.index}</span>
              <strong className="text-sm text-foreground">{item.title}</strong>
              <span className="text-sm leading-relaxed text-muted-foreground">{item.detail}</span>
            </div>
          ))}
        </div>

        <h3>먼저 fresh request의 최소 headroom을 어림한다</h3>
        <p>
          단순한 fresh request라면 새 token 수를 block size로 나눈 올림값이 첫 block 수 추정치다. 실제 runtime은 마지막 부분 block, prefix cache hit, cache group, speculative slot과 alignment를 함께 보므로 이 식은 admission을 생각하기 위한 첫 장부이지 구현 전체가 아니다.
        </p>
        <M display>{'\\underbrace{N_{\\text{block}}}_{\\text{필요한 새 KV 블록}}=\\left\\lceil\\frac{\\underbrace{N_{\\text{new token}}}_{\\text{새로 저장할 토큰 수}}}{\\underbrace{B}_{\\text{블록당 토큰 수}}}\\right\\rceil'}</M>
        <FormulaNote
          meaning="새로 저장할 token이 block 경계를 넘을 때만 물리 block이 하나 더 필요하다는 최소 추정이다. B는 backend와 model 제약에 따라 달라질 수 있으므로 실행 로그와 실제 배포 설정에서 적용값을 읽어야 한다."
          symbols={[
            ['N_{\\text{block}}', 'fresh request가 최소로 요구하는 새 KV block 수의 단순 추정'],
            ['N_{\\text{new token}}', 'prefix reuse 뒤에도 새로 계산하고 저장해야 할 token 수'],
            ['B', '한 KV block에 들어가는 token 수. 문서의 예시값이 아니라 실제 배포의 적용값을 넣는다.'],
          ]}
        />

        <Misconception>
          Prefix caching은 GPU memory를 새로 만들어 내지 않는다. 같은 prefix의 KV 계산과 block을 공유할 수 있게 하지만 cached block도 refcount와 eviction 정책 아래 memory를 점유한다. “cache hit가 높다”와 “free pool이 넉넉하다”는 별도 측정이다.
        </Misconception>

        <h3>메모리가 모자라면 현재 V1은 recompute로 되돌린다</h3>
        <p>
          vLLM의 현재 V1 guide는 GPU와 CPU 사이 KV cache swapping을 제거했고 preemption에 swapping이 필요하지 않다고 명시한다. 현재 기본 preemption mode는 <strong>RECOMPUTE</strong>다. 선택된 request의 KV state를 해제하고 나중에 prompt state를 다시 계산하므로 memory는 즉시 얻지만 end-to-end latency와 compute 비용이 늘어난다.
        </p>
        <p>
          따라서 preemption 로그가 많다면 “CPU swap을 빠르게”가 아니라 먼저 <code>gpu_memory_utilization</code>, <code>max_num_seqs</code>, <code>max_num_batched_tokens</code>, parallelism overhead와 workload shape를 함께 본다. free block이 고갈되는 원인을 숨긴 채 concurrency만 올리면 total throughput과 tail latency가 서로 반대 방향으로 갈 수 있다.
        </p>

        <div className="not-prose my-6 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef('kv-cache-mgr', sharedCodeRefs['kv-cache-mgr'])} label="KVCacheManager" />
          <CodeViewButton onClick={() => onCodeRef('scheduler', sharedCodeRefs['scheduler'])} label="Scheduler" />
        </div>

        <CitationBlock
          source={`고정 시점 KV 할당 코드 · ${kvSource.date} · ${kvSource.commit.slice(0, 12)}`}
          citeKey={4}
          type="code"
          href={vllmExcerptUrl('vllm/v1/core/kv_cache_manager.py')}
        >
          <p>
            로컬 발췌는 <code>allocate_slots</code>가 필요한 block을 계산하고 free pool과 비교하는 함수 경계를 확인하는 용도다. 이 파일은 v0.26.0 전체 source snapshot이 아니므로 current preemption 정책은 공식 V1 guide를 기준으로 판단한다.
          </p>
        </CitationBlock>

        <CitationBlock
          source="vLLM V1 User Guide · 현재 기능 경계"
          citeKey={5}
          type="code"
          href="https://docs.vllm.ai/en/v0.26.0/usage/v1_guide/"
        >
          <p>
            현재 V1 문서는 GPU↔CPU KV cache swapping 제거와 recompute 기반 preemption을 명시한다. Optimization 문서는 KV 공간이 부족할 때 preemption이 발생하며 잦은 preemption이 end-to-end latency를 악화시킨다고 설명한다.
          </p>
        </CitationBlock>

        <p>
          다음 <InternalLink slug="vllm-paged-attention">PagedAttention 심화 계산</InternalLink> 글에서는 실제 model shape로 KV bytes/token과 block 수를 계산하고, block table·free queue·refcount·prefix cache를 코드까지 추적한다. 그 결과인 free-pool headroom을 <InternalLink slug="vllm-scheduler">Scheduler 심화 계산</InternalLink>의 admission 장부로 넘긴다.
        </p>
      </div>
    </section>
  );
}
