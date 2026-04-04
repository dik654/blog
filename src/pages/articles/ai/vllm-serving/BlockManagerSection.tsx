import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

export default function BlockManagerSection() {
  return (
    <>
      <CodePanel title="Block Manager 동작 흐름" code={`Block Manager 동작:

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
  → GPU 메모리가 확보되면 다시 처리 재개`} annotations={[
        { lines: [3, 6], color: 'sky', note: 'Prefill 블록 할당' },
        { lines: [8, 10], color: 'emerald', note: 'Decode 단계 동적 확장' },
        { lines: [15, 18], color: 'rose', note: 'GPU 메모리 부족 시 선점 처리' },
      ]} />

      <CitationBlock source="vllm/v1/core/kv_cache_manager.py" citeKey={5} type="code"
        href="https://github.com/vllm-project/vllm">
        <CodePanel title="KVCacheManager 핵심 메서드" code={`class KVCacheManager:
    """PagedAttention 블록 할당/해제 관리자"""

    def allocate_slots(self, request, num_tokens):
        new_blocks_needed = self._get_new_blocks_needed(
            request, num_tokens)
        if new_blocks_needed > self.free_block_count:
            return None  # preemption 필요
        blocks = self.block_pool.get_new_blocks(new_blocks_needed)
        request.block_table.extend(blocks)
        return blocks

    def free(self, request):
        self.block_pool.free(request.block_table)
        if self.enable_prefix_caching:
            self._cache_prefix_blocks(request)`} annotations={[
          { lines: [4, 11], color: 'sky', note: '블록 할당 — 부족 시 preemption' },
          { lines: [13, 16], color: 'emerald', note: '해제 — Prefix Caching 통합' },
        ]} />
        <p className="mt-2 text-xs text-foreground/70">
          V1 KVCacheManager — Prefix Caching(APC) 통합 관리.
          요청 완료 시 블록을 즉시 해제하지 않고 해시 기반 캐시하여
          동일 프롬프트 후속 요청에서 재사용
        </p>
      </CitationBlock>
    </>
  );
}
