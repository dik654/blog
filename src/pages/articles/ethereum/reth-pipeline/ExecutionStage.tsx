import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ExecutionStage({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="execution-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ExecutionStage는 parent state에서 block을 순서대로 실행한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          검증된 header·body·sender와 parent state를 같은 block identity로 읽고,
          chain spec이 선택한 EVM 환경에서 transaction을 순서대로 실행합니다.
          Receipt·gas·log와 account/storage bundle을 함께 만들며 block 중간
          상태를 canonical DB에 먼저 공개하지 않습니다.
        </p>
        <p>
          이 stage는 execution output을 소유하지만 state-root 알고리즘을 다시
          정의하지 않습니다. 자세한 pre/post transition은{" "}
          <Link to="/blockchain/reth-block-execution">
            Reth block execution
          </Link>
          을 사용하며 MerkleStage가 같은 bundle로 header state root를
          검증합니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() =>
            onCodeRef("execution-stage", codeRefs["execution-stage"])
          }
        />
      </div>
    </section>
  );
}
