import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BytesBloomViz from './viz/BytesBloomViz';

export default function BytesAndBloom({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="bytes-bloom" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bytes, Bloom Filter</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          FixedBytes는 고정 크기 데이터용이다.<br />
          calldata, 로그 데이터, 컨트랙트 바이트코드처럼 크기가 런타임에 결정되는 데이터는
          <code>Bytes</code>(bytes crate)를 사용한다.<br />
          Arc 기반 참조 카운팅으로 clone 시 데이터 복사 없이 포인터만 공유한다.
        </p>
        <p className="leading-7">
          Bloom 필터는 2048비트(256바이트) 고정 크기 비트맵이다.<br />
          각 로그 토픽을 Keccak256으로 해시한 뒤, 처음 6바이트를 2바이트씩 쌍으로 사용해
          3개의 비트 위치(mod 2048)를 결정하고 해당 비트를 1로 설정한다.
        </p>
        <p className="leading-7">
          <code>eth_getLogs</code> RPC 호출 시 블룸 필터로 O(1) 사전 필터링을 수행한다.<br />
          블룸 검사를 통과한 블록만 실제 로그를 확인하므로 검색 범위가 크게 줄어든다.<br />
          false positive(실제로는 없는데 있다고 판정)은 가능하지만,
          false negative(있는데 없다고 판정)은 불가능하다.
        </p>
      </div>

      <div className="not-prose">
        <BytesBloomViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
