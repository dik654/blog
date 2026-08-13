import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Executor({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="executor" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Executor는 같은 mutable overlay 위에서 transaction 순서를 보존한다
      </h2>
      <ExplainedFormula
        question="Block 안의 i번째 transaction은 어떤 state를 입력으로 받을까요?"
        idea={
          <>
            이전 transaction까지의 결과 state를 다음 transaction이 그대로
            읽습니다. Active fork와 block environment도 매 step의 transition
            input입니다.
          </>
        }
        formula={"\\sigma_{i+1}=\\Upsilon_f(\\sigma_i,T_i,E_B)"}
        terms={[
          {
            symbol: "\\sigma_i",
            name: "Pre-transaction state",
            description: "i번째 transaction 직전 account·storage state입니다.",
          },
          {
            symbol: "T_i",
            name: "Transaction",
            description: "Block body의 i번째 signed transaction입니다.",
          },
          {
            symbol: "E_B",
            name: "Block environment",
            description:
              "Number·timestamp·coinbase·base fee·gas limit 등 block context입니다.",
          },
          {
            symbol: "f",
            name: "Active fork",
            description:
              "적용할 opcode·gas·system rule을 고르는 chain-spec 상태입니다.",
          },
          {
            symbol: "\\Upsilon_f",
            name: "Fork transition",
            description:
              "EVM execution과 validity rule을 포함한 deterministic 함수입니다.",
          },
        ]}
        assumptions={[
          "Parent state와 block bytes·transaction order·chain spec이 모두 같습니다.",
          "Node-local clock·randomness·remote API 같은 비결정 입력을 transition에서 읽지 않습니다.",
          "Invalid transaction은 임의로 건너뛰지 않고 block-level failure로 전파합니다.",
        ]}
        interpretation="Tx0가 A balance를 바꾸면 Tx1은 바뀐 σ1을 읽습니다. Tx를 병렬로 독립 pre-state에서 실행하거나 순서를 바꾸면 receipt·gas·post-state가 달라질 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pre·transaction·post execution을 분리합니다</h3>
        <p>
          Fork가 요구하는 pre-block system change를 먼저 적용하고 recovered
          sender, nonce, intrinsic gas와 balance를 검증한 뒤 transaction을 body
          순서대로 실행합니다. 마지막에는 withdrawals·request 등 활성 fork의
          post-block rule과 block reward 정책을 적용합니다.
        </p>
        <p>
          Batch executor는 여러 block의 bundle을 누적할 수 있지만 block별
          receipt, gas, request와 transition boundary는 잃지 않습니다. Block
          101이 실패하면 100의 committed state를 보존하고 101의 partial
          overlay를 publish하지 않습니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() =>
            onCodeRef("block-executor", codeRefs["block-executor"])
          }
        />
      </div>
    </section>
  );
}
