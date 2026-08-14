import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProofTrace({
  title,
  onCodeRef: _onCodeRef,
}: Props & { title: string }) {
  return (
    <section id="proof-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div
        id="account-proof"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Account proof: R에서 keccak(address) 경로를 검증합니다</h3>
        <p>
          20-byte 주소를 Keccak-256하면 32 bytes, 즉 64개 nibble의 secure key
          path가 됩니다. Proof node의 branch·extension·leaf encoding과 child
          reference를 root R부터 따라가고, 마지막 value가{" "}
          <code>RLP([nonce, balance, storageRoot, codeHash])</code>인지
          확인합니다. RPC가 별도로 반환한 네 field도 이 RLP value와 같아야
          하므로 balance만 바꿔 보낸 응답은 통과하지 못합니다.
        </p>
      </div>

      <div
        id="storage-proof"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>
          Storage proof: account에서 확인한 storageRoot를 두 번째 anchor로
          씁니다
        </h3>
        <p>
          Slot 5는 account state trie에 직접 들어 있지 않습니다. 먼저 account
          proof에서 storageRoot S를 얻고, <code>keccak(slot 5)</code> path와
          RLP-encoded value를 S에 대해 검증합니다. 따라서 R→account→S→slot의 두
          단계가 모두 성공해야 하며, 다른 block의 account proof와 현재 storage
          proof를 섞을 수 없습니다.
        </p>
      </div>

      <div
        id="rlp-decode"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>RLP decode는 field 수와 canonical integer까지 확인합니다</h3>
        <p>
          Account leaf는 네 field의 RLP list입니다. Nonce와 balance는 leading
          zero가 없는 canonical integer, 두 root는 32-byte 값이어야 합니다. Trie
          node도 RLP의 short/long form, hex-prefix의 leaf/extension·odd/even
          flag와 inline/hash child 경계를 지켜야 합니다. Hash chain이 맞는다는
          이유로 non-canonical bytes나 trailing data를 허용하면 client 간 root
          해석이 갈릴 수 있습니다.
        </p>
      </div>
    </section>
  );
}
