import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import HeliosTrustFlowViz from "../helios-trust-flow-viz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        State proof는 원격 값을 검증된 block의 state root에 묶는다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          경량 클라이언트는 전체 Ethereum state database를 보관하지 않으므로
          RPC가 “이 주소의 잔액은 10 ETH”라고 답해도 그 숫자를 그대로 믿을 수
          없습니다. Helios는 먼저 light-client consensus로 execution block hash{" "}
          <code>H</code>를 확인하고, 그 block header의 state root <code>R</code>
          에 대해 account·storage Merkle Patricia trie(MPT) proof를 검증한
          뒤에만 값을 사용합니다.
        </p>
        <p>
          이 글에서는 verified execution block H의 state root가 R이고, 주소
          0xa의 storage slot 5를 읽는 사례를 사용합니다. 중요한 점은 trusted
          checkpoint, execution block hash, state root가 같은 값이 아니라는
          것입니다. Checkpoint는 consensus 출발점이고, H는 조회 snapshot의
          identity이며, R은 그 snapshot의 account state를 봉인한
          commitment입니다.
        </p>
      </div>

      <ContentBoundary article="helios-state" />
      <HeliosTrustFlowViz mode="state" />

      <div
        id="eip1186"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>EIP-1186은 값과 검증 재료를 한 응답에 담습니다</h3>
        <p>
          Helios는 <code>eth_getProof(address, storageKeys, H)</code>를 block
          hash H에 고정해 호출합니다. 응답에는
          nonce·balance·codeHash·storageHash, state root에서 account까지의{" "}
          <code>accountProof</code>, 요청한 각 slot의 <code>storageProof</code>
          가 들어옵니다. “latest”라는 움직이는 별칭을 proof 도중 다시 해석하지
          않고 먼저 구체적인 block hash로 고정해야 header와 proof가 같은
          snapshot을 설명합니다.
        </p>
      </div>

      <div id="paper-eip1186-state-proof" className="scroll-mt-24">
        <CitationBlock
          source="EIP-1186 — eth_getProof"
          href="https://eips.ethereum.org/EIPS/eip-1186"
          citeKey={1}
        >
          <p>
            <strong>문제:</strong> remote execution RPC의 account·storage 값을
            trusted state root에 대해 offline 검증할 재료가 필요합니다.{" "}
            <strong>기여:</strong> account fields, accountProof와 slot별
            storageProof schema를 정의합니다. <strong>전제:</strong> caller가
            신뢰하는 block/state root를 별도로 확보하고 canonical MPT·RLP를
            사용합니다. <strong>근거 범위:</strong> proof RPC envelope와
            존재·부재 proof입니다. <strong>과장하면 안 되는 결론:</strong> EIP
            상태가 Stagnant이고 execution-apis의 실제 wire schema와 차이가 있을
            수 있으므로 provider 호환성과 최신 method schema를 따로 확인해야
            합니다.
          </p>
        </CitationBlock>
      </div>

      <div id="paper-yellowpaper-state-trie" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Yellow Paper — pinned state-trie snapshot"
          href="https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex"
          citeKey={2}
        >
          <p>
            <strong>문제:</strong> Ethereum world state를 하나의 root로
            commitment해야 합니다. <strong>기여:</strong> hashed key, MPT와
            nonce·balance·storageRoot·codeHash account 구조를 정의합니다.{" "}
            <strong>전제:</strong> canonical Keccak·RLP·trie encoding을
            사용합니다. <strong>근거 범위:</strong> state commitment의 기초
            의미입니다. <strong>과장하면 안 되는 결론:</strong> Shanghai 이후
            fork 전체나 Helios cache·RPC 구현까지 이 문서가 규정하지 않습니다.
          </p>
        </CitationBlock>
      </div>

      <div id="paper-helios-proof-source" className="scroll-mt-24">
        <CitationBlock
          source="Helios 0.11.1 — execution proof verification"
          href="https://github.com/a16z/helios/blob/0.11.1/core/src/execution/proof.rs"
          citeKey={3}
          type="code"
        >
          <p>
            <strong>문제:</strong> EIP-1186 bytes를 local typed value로 안전하게
            바꿔야 합니다. <strong>기여:</strong> key hash·nibble 변환, RLP
            value, inclusion/exclusion과 account/storage/code 검증 seam을 보여
            줍니다. <strong>전제:</strong> Helios 0.11.1, Alloy trie/RLP
            dependency와 verified block header를 고정합니다.{" "}
            <strong>근거 범위:</strong> 선택한 release의 실제 구현입니다.{" "}
            <strong>과장하면 안 되는 결론:</strong> proof 성공은 그 block이 현재
            head·finalized라는 사실이나 RPC availability를 보장하지 않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
