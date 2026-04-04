import { CodeViewButton } from '@/components/code';
import { blockPoolCodeRefs } from '../vllm-serving/codeRefsBlockPool';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KVCacheManagerSection({ onCodeRef }: Props) {
  return (
    <section id="kv-cache-manager" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">KVCacheManager: 할당 전략</h2>
        <div className="flex gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('kv-coordinator', blockPoolCodeRefs['kv-coordinator'])}
            label="Coordinator"
          />
          <CodeViewButton
            onClick={() => onCodeRef('kv-mgr-allocate', blockPoolCodeRefs['kv-mgr-allocate'])}
            label="allocate_slots()"
          />
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">KVCacheCoordinator</h3>
        <p>
          KV 캐시 그룹(KVCacheGroup)은 어텐션 타입별로 나뉩니다.<br />
          FullAttention, SlidingWindowAttention 등이 각각 하나의 그룹입니다.<br />
          Coordinator는 단일 BlockPool 위에 그룹별 SingleTypeKVCacheManager를 배치하여
          블록 할당을 조율합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">allocate_slots() 5구간 레이아웃</h3>
        <p>
          allocate_slots()는 토큰을 5개 구간으로 나누어 처리합니다.<br />
          소스 코드의 ASCII 다이어그램(L289-321)이 이를 명확히 보여줍니다.
        </p>
        <ol>
          <li><strong>computed</strong> — 이미 계산된 블록. SlidingWindow 밖이면 해제</li>
          <li><strong>new_computed</strong> — 이번 스텝에서 캐시 히트한 블록. ref_cnt 증가</li>
          <li><strong>external</strong> — P/D 분리 시 KVConnector로 받은 블록</li>
          <li><strong>new</strong> — 실제 GPU에서 계산할 새 토큰용 블록</li>
          <li><strong>lookahead</strong> — Speculative Decoding용 추가 슬롯</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">GC 최적화</h3>
        <p>
          <code>empty_kv_cache_blocks</code> — 빈 KVCacheBlocks를 미리 생성해둡니다.<br />
          매번 새 객체를 만들면 파이썬 GC 오버헤드가 발생하므로,
          블록이 필요 없는 요청(완전 캐시 히트)에 이 프리빌트 객체를 재사용합니다.
        </p>
      </div>
    </section>
  );
}
