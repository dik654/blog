import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProofTrace({
  title,
  onCodeRef,
}: Props & { title: string }) {
  return (
    <section id="proof-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>

      <div
        id="account-proof"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>1. 응답 field를 expected account로 다시 묶습니다</h3>
        <p>
          현재 Helios source는 proof node에서 account를 꺼낸 뒤 RPC field와
          비교하는 방식이 아닙니다. RPC가 보낸 nonce·balance·storage hash·code
          hash로 <code>TrieAccount</code>를 만들고, 그것을 expected value로
          RLP-encode해 proof verifier에 넘깁니다. 따라서 balance 하나만 바꿔도
          expected leaf bytes가 달라져 검증에 실패합니다.
        </p>
        <p>
          Address <code>A</code>는 Keccak-256 뒤 64개의 nibble path가 됩니다.
          <code>verify_mpt_proof(R, A, account, accountProof)</code>가 성공하면 네
          field가 state root <code>R</code> 아래의 account 값으로 함께
          묶입니다. 이때 얻은 storage hash <code>S</code>가 다음 proof의
          유일한 root입니다.
        </p>
      </div>

      <div className="not-prose mt-5 flex flex-wrap gap-3">
        <CodeViewButton
          label="실제 account proof 함수 보기"
          onClick={() =>
            onCodeRef("hl-account-proof", codeRefs["hl-account-proof"])
          }
        />
        <CodeViewButton
          label="RPC가 block H를 고정하는 위치 보기"
          onClick={() => onCodeRef("hl-rpc-account", codeRefs["hl-rpc-account"])}
        />
      </div>

      <div
        id="storage-proof"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>2. Account가 확인한 root에서 slot proof를 검증합니다</h3>
        <p>
          Slot <code>5</code>는 global account trie에 직접 들어 있지 않습니다.
          Helios는 각 storage proof의 key와 value를 읽어
          <code>verify_mpt_proof(S, 5, 7, storageProof)</code>를 호출합니다.
          여기서 <code>S</code>는 같은 EIP-1186 응답의 storage hash이면서, 바로
          앞 account proof가 <code>R</code> 아래에 묶은 값입니다.
        </p>
        <p>
          그래서 H1의 account proof와 H2의 storage proof를 이어 붙일 수
          없습니다. H2에서 storage root가 우연히 같다면 내용상 같은 trie를
          가리키므로 재사용할 수 있지만, root가 다르면 H1에서 증명한
          <code>S1</code>로 H2의 proof를 검증할 수 없습니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="실제 storage proof 함수 보기"
          onClick={() =>
            onCodeRef("hl-storage-proof", codeRefs["hl-storage-proof"])
          }
        />
      </div>

      <div
        id="rlp-decode"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>3. Empty 값은 부재 proof로 바뀌고, 나머지는 포함 proof가 됩니다</h3>
        <p>
          Wrapper는 raw key를 Keccak-256한 nibble path로, typed value를 canonical
          RLP bytes로 바꿉니다. Empty account 또는 RLP <code>0x80</code>인 empty
          slot이면 expected value를 <code>None</code>으로 바꾸어 exclusion proof를
          검증합니다. 그 밖에는 <code>Some(encoded value)</code>를 요구합니다.
        </p>
        <p>
          따라서 “값이 없다”와 “proof node가 없다”는 다릅니다. Empty branch나
          다른 suffix까지 root에서 연결되는 proof는 정상 부재를 증명할 수
          있습니다. 반대로 배열이 중간에서 잘렸거나 node hash가 맞지 않으면
          부재가 아니라 invalid proof입니다. Canonical RLP·branch·extension·leaf
          해석은 Helios가 직접 다시 구현하지 않고 고정한 Alloy trie verifier에
          위임합니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="실제 MPT wrapper와 부재 처리 보기"
          onClick={() =>
            onCodeRef("hl-verify-proof", codeRefs["hl-verify-proof"])
          }
        />
      </div>
    </section>
  );
}
