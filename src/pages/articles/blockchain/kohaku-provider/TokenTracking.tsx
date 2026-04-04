import type { CodeRef } from '@/components/code/types';
import TokenTrackingViz from './viz/TokenTrackingViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function TokenTracking({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="token-tracking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토큰 잔액 추적 (ERC-20/721)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ERC-20 <code>balanceOf</code>는 Solidity 매핑이다.
          <br />
          스토리지 슬롯 = <code>keccak256(address || slot_number)</code>로 계산한다.
        </p>
        <p className="leading-7">
          Helios <code>get_proof</code>로 스토리지 Merkle 증명을 받아 로컬에서 검증한다.
          <br />
          풀 노드 없이도 특정 주소의 정확한 토큰 잔액을 확인할 수 있다.
        </p>
        <p className="leading-7">
          ERC-721(NFT)도 같은 패턴이다. <code>tokenId || OWNER_SLOT</code>으로 소유자 슬롯을 계산한다.
          <br />
          증명 기반이므로 RPC가 거짓 소유자를 반환할 수 없다.
        </p>
      </div>
      <div className="not-prose"><TokenTrackingViz /></div>
    </section>
  );
}
