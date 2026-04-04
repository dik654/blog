import { CodeViewButton } from '@/components/code';
import { blockPoolCodeRefs } from '../vllm-serving/codeRefsBlockPool';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">PagedAttention: KV 캐시 블록 관리</h2>
        <CodeViewButton
          onClick={() => onCodeRef('block-pool', blockPoolCodeRefs['block-pool'])}
          label="BlockPool 클래스"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PagedAttention의 핵심 아이디어 — KV 캐시를 <strong>고정 크기 블록</strong>으로 분할하고
          OS의 가상 메모리처럼 관리합니다. 기존 방식은 max_seq_len 크기의 연속 메모리를 예약했지만,
          PagedAttention은 필요할 때만 블록을 할당합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3계층 구조</h3>
        <p>vLLM V1의 KV 캐시 관리는 세 레이어로 나뉩니다.</p>
        <ul>
          <li>
            <strong>BlockPool</strong> — 물리 블록 할당/해제의 최하위 레이어.
            이중 연결 리스트(FreeKVCacheBlockQueue)로 O(1) 할당
          </li>
          <li>
            <strong>KVCacheCoordinator</strong> — 여러 KV 캐시 그룹(GQA, MQA, SlidingWindow) 간 조율.
            단일 BlockPool을 공유하되 그룹별 SingleTypeKVCacheManager를 관리
          </li>
          <li>
            <strong>KVCacheManager</strong> — 스케줄러에 노출되는 최상위 인터페이스.
            allocate_slots(), free(), get_computed_blocks() 제공
          </li>
        </ul>

        <p>
          이 아티클에서는 각 레이어의 구현을 코드 수준에서 추적하고,
          Prefix Caching이 블록 해시를 통해 어떻게 작동하는지 살펴봅니다.
        </p>
      </div>
    </section>
  );
}
