import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function FieldTrie({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="field-trie" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        FieldTrie는 바뀐 leaf에서 root까지의 path만 다시 계산한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          BeaconState root를 매번 모든 field와 collection 원소에서 다시 계산하면
          같은 validator registry를 반복해서 hash하게 됩니다. FieldTrie는
          field별 SSZ subtree layer와 dirty index를 보관하고, mutation이 닿은
          leaf의 ancestor만 갱신한 뒤 최상위 state container root에 반영합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Capacity L인 balanced subtree에서 leaf 하나가 바뀌면 hash를 몇 번 다시 계산할까요?"
        idea={
          <>
            Leaf chunk를 새로 만든 뒤 depth마다 parent 하나만 바뀝니다. 변경
            없는 sibling subtree는 같은 generation의 cached hash를 재사용합니다.
          </>
        }
        formula={String.raw`d=\lceil\log_2L\rceil,\qquad C\approx d+1`}
        annotatedFormula={String.raw`d=\underbrace{\lceil\log_2L\rceil,\qquad C\approx d+1}_{\text{로그 비용 변환}}`}
        operations={[
          { expression: String.raw`\lceil\log_2L\rceil,\qquad C\approx d+1`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Leaf chunk를 새로 만든 뒤 depth마다"] },
        ]}
        terms={[
          {
            symbol: "L",
            name: "Chunk capacity",
            description: "SSZ type limit을 32-byte chunk 수로 환산한 값입니다.",
          },
          {
            symbol: "d",
            name: "Subtree depth",
            description: "Leaf에서 field root까지의 Merkle level 수입니다.",
          },
          {
            symbol: "C",
            name: "Recomputed values",
            description: "새 leaf chunk 하나와 ancestor hash 수의 근사입니다.",
          },
        ]}
        assumptions={[
          "한 leaf만 바뀌고 sibling cache가 같은 schema·fork·generation에서 유효합니다.",
          "여러 dirty leaf의 ancestor가 겹치면 중복 parent는 한 번만 계산합니다.",
          "Top-level container root와 length mix, packing 비용은 별도입니다.",
        ]}
        interpretation="L=16이면 d=4이므로 leaf를 포함해 약 5개 값을 갱신합니다. Cache가 stale하거나 dirty index가 누락되면 이 절감은 잘못된 root를 빠르게 만드는 위험으로 바뀝니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Dirty field와 dirty index의 범위가 다릅니다</h3>
        <p>
          Scalar field 교체나 collection 전체 replacement는 field 전체를 dirty로
          표시할 수 있고, balances[5] 같은 point update는 해당 packed chunk
          index를 기록할 수 있습니다. <code>uint64</code>는 한 32-byte chunk에
          네 값이 들어가므로 balance index 5가 바꾸는 leaf는 element index 5가
          아니라 chunk index 1입니다. Element와 chunk 좌표를 섞으면 잘못된
          branch를 갱신합니다.
        </p>
        <h3>Cache key는 root만이 아닙니다</h3>
        <p>
          Fork schema, field limit, backing-data generation, current length,
          dirty indices와 cached layer depth를 함께 확인합니다. List가 append돼
          length만 바뀌어도 data subtree 일부가 같을 수 있지만{" "}
          <code>mix_in_length</code> 결과는 바뀝니다. Value bytes가 같아
          보인다는 이유로 다른 fork의 nested type cache를 재사용하지 않습니다.
        </p>
        <h3>Slow oracle로 incremental path를 검증합니다</h3>
        <p>
          Random mutation sequence마다 incremental root와 cache를 끈 full SSZ
          root를 비교합니다. Append, truncate, boundary chunk, COW branch
          divergence, fork upgrade, revert와 restart를 포함하고 mismatch가 나면
          state bytes·dirty receipt·cache generation을 보존합니다. Hash/s
          개선보다 root parity가 먼저입니다.
        </p>
      </div>
    </section>
  );
}
