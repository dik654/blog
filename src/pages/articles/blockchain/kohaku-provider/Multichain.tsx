import type { CodeRef } from '@/components/code/types';
import MultichainViz from './viz/MultichainViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Multichain({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="multichain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티체인 지원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>MultiChainProvider</code>는 <code>HashMap&lt;ChainId, KohakuProvider&gt;</code> 구조다.
          <br />
          각 체인마다 독립된 Helios + ORAM + Dandelion 인스턴스를 생성한다.
        </p>
        <p className="leading-7">
          Ethereum, Optimism, Base 등 각 체인의 쿼리 패턴이 격리된다.
          <br />
          한 체인의 활동으로 다른 체인의 사용자를 프로파일링할 수 없다.
        </p>
        <p className="leading-7">
          <code>add_chain(chain_id, rpc, checkpoint)</code>로 새 체인을 추가한다.
          <br />
          체인별 checkpoint는 부트스트랩 시 사용된다. 각 체인의 Sync Committee가 독립 검증된다.
        </p>
      </div>
      <div className="not-prose"><MultichainViz /></div>
    </section>
  );
}
