import { CodeViewButton } from '@/components/code';
import { blockPoolCodeRefs } from '../vllm-serving/codeRefsBlockPool';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlockPoolSection({ onCodeRef }: Props) {
  return (
    <section id="block-pool" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">BlockPool: 물리 블록 관리</h2>
        <div className="flex gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('block-pool', blockPoolCodeRefs['block-pool'])}
            label="BlockPool.__init__"
          />
          <CodeViewButton
            onClick={() => onCodeRef('block-pool-free', blockPoolCodeRefs['block-pool-free'])}
            label="free_blocks()"
          />
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BlockPool은 GPU 블록의 <strong>물리적 소유자</strong>입니다.
          <code>num_gpu_blocks</code>개의 KVCacheBlock 객체를 생성하고
          FreeKVCacheBlockQueue(이중 연결 리스트)로 free 목록을 관리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">할당과 해제</h3>
        <p>
          <strong>할당</strong>: <code>free_block_queue.popleft()</code> — O(1).
          Prefix Caching 활성화 시, 해시가 있는 블록을 꺼내면 캐시에서도 제거(eviction)합니다.
        </p>
        <p>
          <strong>해제</strong>: <code>free_blocks()</code>는 <code>ref_cnt</code>를 감소시킵니다.
          ref_cnt가 0이 된 블록만 free 큐에 반환합니다.<br />
          여러 요청이 같은 블록을 공유(Prefix Caching)할 수 있으므로 참조 카운팅이 필수입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">null_block 설계</h3>
        <p>
          block_id=0인 특수 블록입니다. 아직 계산되지 않은 위치의 placeholder로 사용됩니다.
          <code>is_null = True</code>로 표시되어 free_blocks()에서 해제 대상에서 제외됩니다.<br />
          이 패턴은 block table에서 "아직 할당 안 됨"을 별도 플래그 없이 표현합니다.
        </p>
      </div>
    </section>
  );
}
