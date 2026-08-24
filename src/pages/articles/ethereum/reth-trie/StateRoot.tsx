import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function StateRoot({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-root" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Overlay는 parent trie를 바꾸지 않고 candidate root를 계산한다
      </h2>
      <ExplainedFormula
        question="Ethereum account state 하나는 state root에 어떻게 들어갈까요?"
        idea={
          <>
            Address를 hash한 path에 account 네 필드를 RLP로 넣고, account가 가진
            storage trie root도 그 value 안에 중첩합니다. 전체 trie의 root
            commitment가 block header의 state root입니다.
          </>
        }
        formula={
          "r_{\\rm state}={\\rm TrieRoot}\\!\\left\\{ {\\rm keccak}(a)\\mapsto {\\rm RLP}(n,b,r_{\\rm storage},h_{\\rm code}) \\right\\}"
        }
        annotatedFormula={String.raw`r_{\rm state}=\underbrace{{\rm TrieRoot}\!\left\{ {\rm keccak}(a)\mapsto {\rm RLP}(n,b,r_{\rm storage},h_{\rm code}) \right\}}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`{\rm TrieRoot}\!\left\{ {\rm keccak}(a)\mapsto {\rm RLP}(n,b,r_{\rm storage},h_{\rm code}) \right\}`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Address를 hash한 path에 account 네 필드를","RLP로 넣고, account가 가진 storage trie","root도 그 value 안에 중첩합니다."] },
        ]}
        terms={[
          {
            symbol: "a",
            name: "Address",
            description: "20-byte account address입니다.",
          },
          {
            symbol: "n,b",
            name: "Nonce · balance",
            description: "Account의 transaction nonce와 wei balance입니다.",
          },
          {
            symbol: "r_{\\rm storage}",
            name: "Storage root",
            description: "해당 contract storage trie의 32-byte root입니다.",
          },
          {
            symbol: "h_{\\rm code}",
            name: "Code hash",
            description: "Contract bytecode의 Keccak-256 hash입니다.",
          },
          {
            symbol: "r_{\\rm state}",
            name: "State root",
            description:
              "모든 account를 commitment한 32-byte header field입니다.",
          },
        ]}
        assumptions={[
          "활성 fork의 canonical account encoding과 trie node encoding을 사용합니다.",
          "Parent state snapshot과 execution changes가 같은 block identity에 귀속됩니다.",
          "Keccak collision resistance를 전제로 하지만 root 일치는 canonical-chain status를 보장하지 않습니다.",
        ]}
        interpretation="A의 balance만 바뀌어도 account RLP와 A path의 ancestor root가 달라집니다. 다른 subtree hash는 재사용할 수 있지만 계산된 root가 header와 다르면 최적화 여부와 무관하게 block을 거절해야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Base snapshot과 hashed overlay를 결합합니다</h3>
        <p>
          Reader는 parent root에 고정된 database trie를 base로 읽고 execution
          bundle의 account/storage 변경을 overlay로 우선 적용합니다. Dirty
          prefix 밖의 child는 기존 hash를 재사용하지만, overlay가 delete한
          value를 base가 되살리거나 서로 다른 storage generation을 섞으면 안
          됩니다.
        </p>
        <h3>Root 비교가 storage write보다 먼저입니다</h3>
        <p>
          Candidate root와 header root가 일치해야 changeset·trie
          update·checkpoint를 publish할 수 있습니다. Mismatch 때는
          address/storage key, old/new value, visited prefix, node encoding과
          fork를 receipt에 남기며 잘못 계산한 root를 canonical marker에 연결하지
          않습니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() => onCodeRef("state-root", codeRefs["state-root"])}
        />
      </div>
    </section>
  );
}
