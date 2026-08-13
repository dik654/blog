import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function Merkleize({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="merkleize" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Merkleization은 값의 32-byte chunk와 type capacity를 root 하나에
        고정한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          SSZ는 basic value를 32-byte chunk에 pack하고 composite value는 child의{" "}
          <code>hash_tree_root</code>를 leaf로 사용합니다. Leaf 수가 2의
          거듭제곱이 아니면 type limit이 요구하는 depth까지 zero hash로 채운 뒤,
          왼쪽·오른쪽 순서를 보존해 SHA-256으로 부모를 계산합니다.
        </p>
      </div>

      <ExplainedFormula
        question="네 leaf 중 하나가 바뀌면 root까지 무엇을 다시 계산할까요?"
        idea={
          <>
            각 parent는 왼쪽과 오른쪽 child의 32-byte hash를 순서대로
            결합합니다. 한 leaf 변경은 그 leaf에서 root까지의 ancestor만
            바꿉니다.
          </>
        }
        formula={String.raw`\begin{aligned}h_i^{(k+1)}&=H\!\left(h_{2i}^{(k)}\|h_{2i+1}^{(k)}\right)\\d&=\lceil\log_2L\rceil\end{aligned}`}
        terms={[
          {
            symbol: "h_i^{(k)}",
            name: "level k node",
            description: "해당 subtree를 대표하는 32-byte hash입니다.",
          },
          {
            symbol: "\|",
            name: "Concatenation",
            description: "왼쪽 32 bytes 뒤에 오른쪽 32 bytes를 붙입니다.",
          },
          {
            symbol: "L",
            name: "Chunk limit",
            description:
              "현재 원소 수가 아니라 SSZ type이 허용한 최대 chunk 수입니다.",
          },
          {
            symbol: "d",
            name: "Tree depth",
            description: "Limit을 담을 완전 binary tree의 깊이입니다.",
          },
        ]}
        assumptions={[
          "SHA-256 collision resistance와 정확한 left/right ordering을 전제로 합니다.",
          "부족한 leaf는 depth별 zero hash로 채웁니다.",
          "List와 bitlist는 tree root 뒤에 실제 길이를 별도로 mix합니다.",
        ]}
        interpretation="L=4이면 depth는 2이고 한 leaf가 바뀔 때 leaf를 포함해 최대 3개의 값만 새로 계산할 수 있습니다. 다만 cached sibling이 정확한 schema·fork·generation에서 왔다는 조건이 필요합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pack과 merkleize는 같은 단계가 아닙니다</h3>
        <p>
          <code>uint64</code> 네 개는 각각 8 bytes이므로 한 chunk에 들어가지만,
          composite element는 자신의 root 하나가 parent collection의 leaf가
          됩니다. 원소 5개의 <code>Vector[uint64,5]</code>라면 40 bytes를 두
          chunk로 pack한 뒤 vector limit에 맞춰 Merkleize합니다. Element count를
          곧 leaf count로 세면 tree depth를 잘못 계산합니다.
        </p>
        <h3>List에는 실제 길이가 commitment의 일부입니다</h3>
        <p>
          Vector는 길이가 type에 고정돼 있지만 List는 최대 길이만 schema에
          있습니다. 그래서 list data root와 실제 원소 수를 32-byte little-endian
          chunk로 만든 뒤 한 번 더 hash하는 <code>mix_in_length</code>를
          적용합니다. 같은 padded chunk를 만드는 <code>[]</code>와 zero
          element가 든 list를 길이 없이 구분할 수 없다는 반례를 막습니다.
        </p>
        <p>
          Root가 같다는 사실은 같은 schema·fork에서 같은 typed value라는
          commitment로 사용하지만 원문 복원이나 protocol validity를 보장하지
          않습니다. Root 계산 결과에는 type, limit, fork, serialized bytes
          digest와 implementation version을 함께 묶어야 cache 오염을 추적할 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
