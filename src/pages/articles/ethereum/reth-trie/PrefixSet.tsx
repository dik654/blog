import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function PrefixSet({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="prefix-set" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PrefixSet은 바뀐 key를 root까지 다시 계산할 경로로 압축한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실행 bundle에는 account A가 바뀌었다는 사실이 있지만, trie 계산기는
          A의 hashed key에서 어느 subtree가 dirty인지 알아야 합니다. Reth는
          변경된 account와 storage key를 정렬된 prefix 집합으로 바꾸고, walker가
          해당 prefix와 겹치는 subtree만 database·overlay에서 다시 펼치게
          합니다.
        </p>
      </div>
      <ExplainedFormula
        question="B-byte hash key는 trie에서 몇 개의 nibble 선택으로 바뀔까요?"
        idea={
          <>
            Nibble 하나는 4 bit이고 byte 하나는 8 bit이므로 byte마다 두 번의
            branch 선택이 생깁니다.
          </>
        }
        formula={"N_{\\rm nibble}=2B"}
        terms={[
          {
            symbol: "B",
            name: "Key bytes",
            description: "Hash key의 byte 길이입니다.",
          },
          {
            symbol: "N_{\\rm nibble}",
            name: "Path digits",
            description: "0…15 값을 갖는 trie path digit 수입니다.",
          },
        ]}
        assumptions={[
          "Hexary trie처럼 branch radix가 16입니다.",
          "Hex-prefix encoding의 terminator·odd/even flag byte는 logical path digit 수와 구분합니다.",
          "Path가 64개여도 extension node가 여러 digit을 한 node로 압축할 수 있습니다.",
        ]}
        interpretation="Keccak-256 key는 B=32이므로 64 nibbles입니다. 이것이 database node를 항상 64개 읽는다는 뜻은 아니며 shared prefix·extension·cache가 실제 작업량을 바꿉니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Account와 storage의 dirty 범위를 따로 둡니다</h3>
        <p>
          Balance·nonce·code가 바뀌면 account path가 dirty입니다. Contract
          storage slot이 바뀌면 먼저 그 account의 storage trie root를 다시
          계산하고, 바뀐 storage root를 담는 account leaf까지 dirty가
          전파됩니다. Account delete나 storage wipe는 한 key update가 아니라
          기존 descendant가 사라지는 경계이므로 별도 marker와 full-subtree
          처리가 필요합니다.
        </p>
        <h3>Prefix가 적다는 사실만으로 빠르다고 단정하지 않습니다</h3>
        <p>
          가까운 key 여러 개는 ancestor를 많이 공유하지만 흩어진 key는 root
          근처에서만 합쳐집니다. DB cache hit, node inline/hash 경계, storage
          wipe와 branch collapse가 I/O와 hash 수를 바꾸므로 changed key count와
          visited node·read bytes·hash count를 함께 측정합니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() => onCodeRef("prefix-set", codeRefs["prefix-set"])}
        />
      </div>
    </section>
  );
}
