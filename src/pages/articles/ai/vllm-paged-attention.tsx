import BlockPoolSection from './vllm-paged-attention/BlockPoolSection';
import KVCacheManagerSection from './vllm-paged-attention/KVCacheManagerSection';
import PrefixCaching from './vllm-paged-attention/PrefixCaching';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
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
import { blockPoolCodeRefs } from './vllm-serving/codeRefsBlockPool';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';
import ServingDepthGuide from './llm-serving-ops/ServingDepthGuide';
import { PagedKvLedgerViz } from './vllm-runtime/viz/VllmRuntimeViz';

const allRefs = { ...sharedCodeRefs, ...blockPoolCodeRefs };

export default function VLLMPagedAttentionArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="8,192-token prompt의 KV가 1 GiB라면, GPU 안에서 반드시 1 GiB짜리 연속 공간을 찾아야 할까?"
          answer={<>아니다. PagedAttention은 token 순서인 <strong>logical block</strong>과 실제 GPU 주소인 <strong>physical block</strong>을 분리한다. 요청은 작은 고정 크기 block을 필요할 때 받아 이어 붙이고, attention kernel은 block table로 올바른 K·V를 찾는다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Autoregressive decoder는 새 token을 만들 때 이전 token의 key와 value를 다시 사용한다. 이를 버리면 매 step마다 prompt 전체를 재계산해야 하므로 KV cache에 남긴다. 문제는 요청마다 길이가 다르고 생성 길이는 미리 정확히 모른다는 점이다. 최대 길이만큼 연속 공간을 먼저 잡으면 아직 쓰지 않은 영역이 낭비되고, 빈 공간 총합이 충분해도 큰 연속 구간이 없어 새 요청을 받지 못할 수 있다.</p>
          <p>PagedAttention의 핵심은 운영체제 이름을 외우는 것이 아니라 <strong>순서와 주소를 분리하는 간접 참조</strong>다. 요청의 logical block 0, 1, 2는 GPU의 physical block 413, 17, 900처럼 흩어질 수 있다. Block table이 이 대응을 보존하고, shared prefix는 같은 physical block을 여러 요청이 refcount로 함께 소유한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'KV cache', meaning: '각 layer가 과거 token의 key와 value를 저장한 실행 상태다.', why: '다음 token마다 과거 prompt를 다시 계산하지 않기 위해 필요하다.' },
          { term: 'GQA의 KV head', meaning: '여러 query head가 더 적은 수의 key/value head를 공유한다.', why: 'KV byte 계산에는 query head 수가 아니라 실제 KV head 수를 넣어야 한다.' },
          { term: 'Logical / physical block', meaning: '요청 안의 token 순서와 GPU pool의 실제 slot을 분리한 두 주소다.', why: '연속 공간을 예약하지 않고도 요청이 자라게 한다.' },
          { term: 'Block table', meaning: '각 logical block이 어느 physical block에 있는지 기록한 주소표다.', why: 'Attention kernel이 흩어진 K·V를 token 순서대로 읽게 한다.' },
        ]} />
        <PagedKvLedgerViz />
      </section>

      <section id="byte-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Block 개수보다 먼저 byte 단위를 맞춘다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{m_{\mathrm{tok}}}_{\text{토큰당 KV 바이트}}&=\underbrace{2}_{\text{K와 V}}\underbrace{L}_{\text{레이어}}\underbrace{H_{kv}}_{\text{KV 헤드}}\underbrace{d_h}_{\text{헤드 폭}}\underbrace{b}_{\text{값당 바이트}}\\
\underbrace{m_{\mathrm{block}}}_{\text{블록당 바이트}}&=\underbrace{B\,m_{\mathrm{tok}}}_{\text{블록 토큰 수의 KV}}\\
\underbrace{n_{\mathrm{pool}}}_{\text{정수 블록 수}}&\leq\underbrace{M_{\mathrm{pool}}/m_{\mathrm{block}}}_{\text{예약 전 이론 수용량}}
\end{aligned}`}</M>
        <FormulaNote
          meaning={'K와 V 두 tensor를 모든 layer와 KV head에 저장하므로 먼저 token당 byte를 계산한다. 그 값에 block size를 곱하면 물리 block 하나의 크기가 된다. Pool 계산은 다른 buffer와 allocator 예약을 빼기 전 이론 상한이다.'}
          symbols={[
            [String.raw`L=32`, 'Transformer layer 수'],
            [String.raw`H_{kv}=8`, 'GQA가 실제로 저장하는 KV head 수'],
            [String.raw`d_h=128`, 'KV head 하나의 차원'],
            [String.raw`b=2`, 'BF16 값 하나의 byte 수'],
            [String.raw`B=16`, '물리 block 하나가 담는 token 수'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>공유 fixture를 넣으면 token당 <code>2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KiB</code>다. 16-token block은 2 MiB이고 12 GiB pool은 예약 전 최대 6,144 block이다. 8,192-token prompt는 512 block, 정확히 1 GiB를 요구한다.</p>
          <p>내부 단편화는 요청의 마지막 block에서만 생긴다. 요청이 <code>T</code> token이면 필요한 block은 <code>ceil(T/B)</code>이고 마지막 tail 낭비는 block 하나보다 작다. 반면 실제 수용량은 model runner workspace, CUDA graph, allocator headroom과 다른 cache를 뺀 뒤 정해야 한다.</p>
        </div>
        <Misconception>Block을 쓴다고 KV 계산량이 사라지는 것은 아니다. PagedAttention은 주로 <strong>저장 주소, 할당, 공유와 낭비</strong>를 바꾼다. Block table lookup과 전용 kernel 비용도 있으므로 논문의 throughput 결과를 모든 GPU와 workload에 그대로 적용할 수 없다.</Misconception>
      </section>

      <BlockPoolSection onCodeRef={sidebar.open} />
      <KVCacheManagerSection onCodeRef={sidebar.open} />
      <PrefixCaching onCodeRef={sidebar.open} />

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 글에 넘길 산출물: 물리 KV 장부</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>여기서 만든 산출물은 요청별 <strong>남은 token, 이미 계산된 block, 새로 필요한 block, 공유 block의 refcount와 free pool headroom</strong>이다. 이 장부만으로는 누구를 다음 GPU step에 넣을지 결정할 수 없다. 그 판단은 <InternalLink slug="vllm-scheduler">vLLM Scheduler</InternalLink>가 token budget과 latency 우선순위를 함께 받아 수행한다.</p>
          <p data-kv-handoff-registration><InternalLink slug="llm-disaggregated-serving">분리형 prefill</InternalLink>에서 받은 KV도 raw byte만 도착했다고 사용할 수는 없다. Decode runtime은 먼저 자기 BlockPool에서 목적 physical block을 예약하고 request의 logical block table에 연결한 뒤, model·dtype·block size·KV layout과 transfer completion을 확인해야 한다. 그 검증이 끝난 block만 computed state로 공개하고 refcount·prefix-cache identity를 부여한다. 등록 전에 buffer를 재사용하거나 producer의 block id를 decode 주소처럼 쓰면 다른 요청의 KV를 읽을 수 있다.</p>
        </div>
        <CapabilityCheck items={[
          'Model shape와 dtype에서 KV bytes/token, bytes/block과 요청별 block 수를 계산할 수 있다.',
          'Logical order, physical address, refcount, prefix-cache identity와 free pool을 서로 다른 상태로 추적할 수 있다.',
          '외부에서 받은 KV를 decode BlockPool에 예약·전송·검증·공개하는 순서로 등록할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'PagedAttention paper', href: 'https://arxiv.org/abs/2309.06180', note: 'Logical/physical block, 동적 할당, block 공유와 논문 당시 실험 범위.' },
          { label: 'vLLM BlockPool API', href: 'https://docs.vllm.ai/en/stable/api/vllm/v1/core/block_pool/', note: '현재 V1 block pool, free queue, hash와 refcount 구현 경계.' },
          { label: 'vLLM KVCacheManager API', href: 'https://docs.vllm.ai/en/stable/api/vllm/v1/core/kv_cache_manager/', note: 'Computed block 조회와 slot 할당의 현재 공개 API.' },
          { label: 'Automatic Prefix Caching example', href: 'https://docs.vllm.ai/en/latest/examples/features/automatic_prefix_caching/', note: '반복 prefix 재사용의 현재 사용 예와 적용 범위.' },
          { label: 'vLLM · Disaggregated Prefilling', href: 'https://docs.vllm.ai/en/stable/features/disagg_prefill/', note: 'Scheduler connector가 전송을 계획하고 worker connector가 attention layer의 KV load를 실행하는 공식 runtime 경계.' },
        ]} />
      </section>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ServingDepthGuide guideKey="pagedAttention" />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={allRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
