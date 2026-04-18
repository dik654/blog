import { CitationBlock } from '../../../../components/ui/citation';
import M from '@/components/ui/math';

export default function BlockManagerSection() {
  return (
    <>
      <div className="not-prose space-y-2 mb-4">
        {[
          {
            step: '1',
            title: '새 요청 도착 — Prefill 블록 할당',
            color: '#0ea5e9',
            items: [
              { label: '블록 수 계산', value: <><M>{'\\lceil \\text{prompt\\_length} / \\text{block\\_size} \\rceil'}</M> 개 물리 블록 필요</> },
              { label: '할당', value: 'block_pool에서 빈 블록 가져와 할당' },
              { label: '매핑 기록', value: 'Block Table에 논리 → 물리 블록 매핑 저장' },
            ],
          },
          {
            step: '2',
            title: 'Decode 단계 — 동적 확장',
            color: '#10b981',
            items: [
              { label: '공간 확인', value: '현재 블록에 슬롯 남아 있으면 새 토큰 추가' },
              { label: '블록 추가', value: '블록 가득 차면 새 물리 블록 1개 할당' },
            ],
          },
          {
            step: '3',
            title: '요청 완료 — 블록 반환',
            color: '#6b7280',
            items: [
              { label: '해제', value: '모든 물리 블록을 Free List에 반환' },
              { label: 'Prefix Cache', value: '동일 프롬프트 재사용 위해 해시 기반 캐시 (APC)' },
            ],
          },
          {
            step: '!',
            title: '메모리 부족 — Preemption (선점)',
            color: '#f43f5e',
            items: [
              { label: 'Swapping', value: 'KV 블록을 CPU 메모리로 이동. GPU 확보 후 복귀' },
              { label: 'Recomputation', value: 'KV 캐시 삭제 후 나중에 재계산. 메모리 즉시 확보' },
            ],
          },
        ].map((phase) => (
          <div key={phase.step} className="rounded-lg border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: phase.color }}
              >
                {phase.step}
              </span>
              <span className="font-semibold text-sm text-foreground">{phase.title}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 ml-8">
              {phase.items.map((it) => (
                <div key={it.label} className="text-xs leading-relaxed">
                  <span className="font-mono font-semibold text-foreground">{it.label}</span>
                  <span className="text-muted-foreground ml-1.5">{it.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CitationBlock source="vllm/v1/core/kv_cache_manager.py" citeKey={5} type="code"
        href="https://github.com/vllm-project/vllm">
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 mb-2 text-sm">
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#0ea5e9' }} />
              <span className="font-mono font-bold text-xs">allocate_slots(request, num_tokens)</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-0.5">
              <p>필요한 블록 수 계산 → free_block_count와 비교</p>
              <p>부족 시 <span className="font-mono text-foreground">None</span> 반환 → preemption 트리거</p>
              <p>충분 시 <span className="font-mono text-foreground">block_pool.get_new_blocks()</span>로 할당</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
              <span className="font-mono font-bold text-xs">free(request)</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-0.5">
              <p><span className="font-mono text-foreground">block_pool.free()</span>로 블록 반환</p>
              <p>Prefix Caching 활성화 시 즉시 해제하지 않고 해시 기반 캐시</p>
              <p>동일 프롬프트 후속 요청에서 블록 재사용</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-foreground/70">
          V1 KVCacheManager — Prefix Caching(APC) 통합 관리.
          요청 완료 시 블록을 즉시 해제하지 않고 해시 기반 캐시하여
          동일 프롬프트 후속 요청에서 재사용
        </p>
      </CitationBlock>
    </>
  );
}
