import { CodeViewButton } from '@/components/code';
import { sharedCodeRefs } from '../vllm-serving/sharedCodeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PrefixCaching({ onCodeRef }: Props) {
  return (
    <section id="prefix-caching" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Prefix Caching (APC)</h2>
        <CodeViewButton
          onClick={() => onCodeRef('kv-cache-mgr', sharedCodeRefs['kv-cache-mgr'])}
          label="KVCacheManager"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Automatic Prefix Caching(APC)는 동일한 프롬프트 접두사를 가진 요청들이
          KV 캐시를 <strong>공유</strong>하는 기능입니다. 챗봇의 시스템 프롬프트나
          Few-shot 예시처럼 반복되는 접두사에서 큰 효과를 발휘합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록 해시 기반 매칭</h3>
        <p>
          각 블록은 해당 블록에 저장된 토큰 ID들의 해시(BlockHash)를 가집니다.
          <code>get_computed_blocks()</code>가 호출되면 요청의 <code>block_hashes</code>를
          BlockPool의 <code>cached_block_hash_to_block</code> 맵에서 검색합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">BlockHashToBlockMap 설계</h3>
        <p>
          GC 오버헤드를 줄이기 위한 핵심 자료구조입니다.<br />
          같은 해시에 블록이 하나면 <code>KVCacheBlock</code> 직접 저장,
          여러 개면 <code>dict[int, KVCacheBlock]</code>으로 승격합니다.<br />
          대부분 단일 블록이므로 dict 생성 비용을 아낍니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Eviction 정책</h3>
        <p>
          ref_cnt가 0인 캐시된 블록은 eviction 후보입니다.<br />
          새 블록이 필요하면 free 큐에서 가장 오래된 eviction 후보를 선택합니다.<br />
          이때 해시 맵에서도 제거하여 더 이상 캐시 히트가 발생하지 않게 합니다.
        </p>

        <p>
          <strong>설계 판단</strong>: vLLM은 블록 중복 제거(deduplication)를 하지 않습니다.<br />
          동일 내용의 블록이 여러 개 존재할 수 있습니다. 이유는 block table을 append-only로
          유지하여 스케줄링 중 block ID가 변하지 않게 보장하기 위함입니다 (block_pool.py 주석 NOTE #1).
        </p>
      </div>
    </section>
  );
}
