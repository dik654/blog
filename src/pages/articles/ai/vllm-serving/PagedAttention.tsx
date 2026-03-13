import { CitationBlock } from '../../../../components/ui/citation';
import PagedAttentionViz from './viz/PagedAttentionViz';

export default function PagedAttention() {
  return (
    <section id="paged-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PagedAttention & KV 캐시 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PagedAttention 핵심 개념</h3>
        <p>
          PagedAttention은 OS의 <strong>가상 메모리 페이징</strong>에서 영감을 받았습니다.
          KV 캐시를 연속된 큰 메모리 블록 대신 <strong>고정 크기 블록</strong>으로
          분할하여 관리합니다. 이를 통해 내부/외부 단편화를 거의 제거합니다.
        </p>

        <PagedAttentionViz />

        <CitationBlock source="PagedAttention 논문 §3 — Algorithm" citeKey={4} type="paper"
          href="https://arxiv.org/abs/2309.06180">
          <p className="italic text-muted-foreground">
            "We partition the KV cache of each sequence into KV blocks. Each block contains the key
            and value vectors for a fixed number of tokens... The blocks are not necessarily stored in
            contiguous space, allowing more flexible memory management as in OS virtual memory."
          </p>
          <p className="mt-2 text-xs">
            블록 크기 B는 보통 16 토큰입니다. 논리 블록 → Block Table → 물리 블록 매핑으로
            비연속 할당을 지원합니다. 이 설계 덕분에 외부 단편화가 완전히 제거됩니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Block Manager & 스케줄러</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Block Manager 동작:

1. 새 요청 도착:
   Prefill 단계에서 필요한 블록 수 계산
   → ceil(prompt_length / block_size) 개 물리 블록 할당
   → Block Table에 논리→물리 매핑 기록

2. Decode 단계:
   새 토큰 생성 시 현재 블록에 공간 있으면 추가
   블록 가득 차면 새 물리 블록 할당

3. 요청 완료:
   모든 물리 블록을 Free List에 반환

메모리 부족 시 Preemption (선점):
  방법 1: Swapping — KV 블록을 CPU 메모리로 이동
  방법 2: Recomputation — KV 캐시 삭제 후 나중에 재계산
  → GPU 메모리가 확보되면 다시 처리 재개`}</code>
        </pre>

        <CitationBlock source="vllm/v1/core/kv_cache_manager.py" citeKey={5} type="code"
          href="https://github.com/vllm-project/vllm">
          <pre className="text-xs overflow-x-auto"><code>{`class KVCacheManager:
    """PagedAttention 블록 할당/해제 관리자"""

    def allocate_slots(self, request, num_tokens):
        # 필요한 새 블록 수 계산
        new_blocks_needed = self._get_new_blocks_needed(
            request, num_tokens)
        if new_blocks_needed > self.free_block_count:
            return None  # preemption 필요
        # 물리 블록 할당 + block table 업데이트
        blocks = self.block_pool.alloc(new_blocks_needed)
        request.block_table.extend(blocks)
        return blocks

    def free(self, request):
        # 요청 완료 시 모든 블록 반환
        self.block_pool.free(request.block_table)
        # Prefix caching: 해시 기반으로 블록 캐시
        if self.enable_prefix_caching:
            self._cache_prefix_blocks(request)`}</code></pre>
          <p className="mt-2 text-xs text-muted-foreground">
            V1 KVCacheManager는 Prefix Caching(APC)을 통합 관리합니다.
            요청 완료 시 블록을 즉시 해제하는 대신, 해시 기반으로 캐시하여
            동일 프롬프트의 후속 요청에서 재사용합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Continuous Batching</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Static Batching vs Continuous Batching:

Static Batching (기존):
  배치 내 모든 요청이 완료될 때까지 대기
  Time →  [====Req1====]
          [====Req2==============]  ← 긴 응답
          [====Req3========]
          ↑ Req1 완료되어도 배치 끝까지 GPU 점유

Continuous Batching (vLLM):
  Iteration 단위로 요청을 동적으로 추가/제거
  Time →  [====Req1====][Req4===]
          [====Req2==============]
          [====Req3========][Req5]
          ↑ Req1 완료 즉시 Req4 투입 → GPU 활용률 극대화`}</code>
        </pre>

        <CitationBlock source="Yu et al., OSDI 2022 — Orca" citeKey={6} type="paper">
          <p className="italic text-muted-foreground">
            "Orca proposes iteration-level scheduling, where the serving system makes scheduling
            decisions at each generation iteration instead of at the request level. This enables
            continuous batching — requests can join and leave a running batch at any iteration."
          </p>
          <p className="mt-2 text-xs">
            Continuous Batching의 원천은 Orca 논문(OSDI 2022)입니다. vLLM은 이 개념을
            PagedAttention과 결합하여 메모리 효율과 배칭 효율을 동시에 달성했습니다.
            vLLM V1의 Chunked Prefill은 여기서 더 나아가 Prefill과 Decode를 인터리빙합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">KV 캐시 계층 구조 (V1)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Hierarchical KV Cache (V1):

GPU HBM (Hot)
  ↕ 자동 스왑
CPU DRAM (Warm)
  ↕ KV Connector
외부 저장소 (Cold) — Redis, LMCache 등

KV Cache Manager (V1):
  - 블록 할당/해제 + Prefix Caching 통합
  - GPU 메모리 부족 시 CPU로 자동 스왑
  - KV Connector로 외부 캐시 시스템 연동
  → 세션 간 KV 캐시 공유, 장기 캐싱 가능

KV Cache 양자화:
  FP16 → FP8 KV 캐시 (NVIDIA Hopper+)
  → KV 캐시 메모리 50% 절약
  → 품질 손실 최소 (perplexity ~0.01 증가)
  → --kv-cache-dtype fp8 으로 활성화`}</code>
        </pre>
      </div>
    </section>
  );
}
