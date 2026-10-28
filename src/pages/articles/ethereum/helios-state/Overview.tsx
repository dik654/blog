import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import StateProofTraceViz from "./viz/StateProofTraceViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        원격 RPC의 slot 값이 검증된 블록에 속하는지 어떻게 확인할까요?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Helios는 전체 Ethereum state를 보관하지 않습니다. 이 글에서는 이미
          검증된 execution block <code>H</code>에서 주소 <code>A</code>의 storage
          slot <code>5</code>를 읽습니다. 원격 RPC가 값 <code>7</code>을
          돌려주더라도, <code>H</code>의 state root부터 이어지는 두 proof가 모두
          맞아야 그 값을 사용합니다.
        </p>
      </div>

      <StateProofTraceViz />
      <ContentBoundary article="helios-state" />

      <div
        id="anchor-chain"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Checkpoint·block hash·state root는 서로 다른 역할입니다</h3>
        <p>
          Checkpoint는 consensus 검증을 시작한 신뢰 입력입니다. 그 결과로 선택한
          execution block hash <code>H</code>는 이번 조회의 snapshot을
          식별합니다. <code>H</code>의 header에 든 state root <code>R</code>은 그
          snapshot의 account trie 전체를 봉인합니다. 이 글은 부모 글에서
          <code>H</code>를 이미 선택했다고 보고 <code>R</code> 아래의 값만
          추적합니다.
        </p>
        <p>
          같은 주소라도 block이 달라지면 nonce·balance·storage root가 달라질 수
          있습니다. 따라서 “latest account”를 먼저 받고 나중에 별도의 latest
          proof를 붙이는 방식은 한 snapshot을 증명하지 못합니다. Helios의 현재
          RPC provider는 block을 먼저 구한 뒤 그 header hash를
          <code>eth_getProof</code>의 block id로 사용합니다.
        </p>
      </div>

      <div
        id="eip1186"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>EIP-1186 응답에는 주장과 검증 재료가 함께 옵니다</h3>
        <p>
          <code>eth_getProof(A, [5], H)</code>는 nonce·balance·code hash·storage
          hash와 <code>accountProof</code>, slot별 key·value·proof를 반환합니다.
          앞의 네 field와 slot 값은 RPC의 주장입니다. Proof node 배열은 그
          주장이 root에 연결되는지 확인할 재료입니다. HTTP 200이나 JSON decode
          성공만으로는 값이 검증되지 않습니다.
        </p>
        <p>
          여기서는 slot key <code>5</code>와 expected value <code>7</code>을
          사용합니다. 숫자는 설명용이지만 검증 경계는 실제 코드와 같습니다.
          Account proof는 <code>R</code>을, storage proof는 account가 증명한
          storage root <code>S</code>를 루트로 사용합니다.
        </p>
      </div>
    </section>
  );
}
