import { Link } from "react-router-dom";
import type { CodeRef } from "@/components/code/types";

export default function MerkleStage({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="merkle-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        MerkleStage는 execution bundle을 header state root와 대조한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Execution checkpoint가 163이라도 Merkle checkpoint가 120이면 node는
          121…163의 post-state commitment를 아직 검증하지 못했습니다.
          MerkleStage는 execution changeset의 dirty prefixes를 사용해 각 block
          root를 계산하고 header field와 하나씩 비교합니다.
        </p>
        <p>
          Root mismatch에서 faster result를 채택하거나 checkpoint만 맞추지
          않습니다. 첫 divergence block, parent/computed/expected root와 storage
          generation을 남기고 execution을 그 이전 common point까지 unwind합니다.
          Trie node와 overlay 계산은{" "}
          <Link to="/blockchain/reth-trie">Reth Trie</Link>가 canonical
          owner입니다.
        </p>
      </div>
    </section>
  );
}
