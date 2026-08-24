import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ExecutionTrace({
  title,
  onCodeRef: _onCodeRef,
}: Props & { title: string }) {
  return (
    <section id="execution-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div
        id="proof-db"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>
          ProofDB는 synchronous Database trait과 async network 사이를 잇습니다
        </h3>
        <p>
          Helios 0.11.1은 먼저 block tag를 구체적인 hash H로 고정하고 execution
          hint로 예상 state를 prefetch합니다. Revm이 아직 없는 account·slot이나
          block hash를 읽으면 ProofDB는 <code>StateMissing</code>과 access
          identity를 남깁니다. Helios가 EVM borrow를 끝낸 뒤 async provider에서
          proof를 받아 검증·cache하고, 같은 H·transaction·environment로 EVM을
          다시 실행합니다.
        </p>
        <p>
          이 replay는 execution result를 추측하는 retry가 아니라 필요한
          witness를 채우는 adapter입니다. Provider error나 invalid proof는
          실패로 종료해야 하며, state override를 쓰면 override field는 chain
          proof가 아니라 caller가 의도적으로 바꾼 simulation input이라는 점도
          결과에 표시해야 합니다.
        </p>
      </div>

      <div id="eth-call" className="scroll-mt-24">
        <ExplainedFormula
          question="Proof-backed eth_call의 결과를 하나로 결정하는 입력은 무엇일까요?"
          idea={
            <>
              EVM은 transaction만 보는 함수가 아닙니다. Verified root에 묶인
              state view, block environment와 active fork를 모두 고정해야 같은
              output·gas·access set을 재현할 수 있습니다.
            </>
          }
          formula={"(o,g,A)={\\rm EVM}_{f}(T,E_H,D_R)"}
          annotatedFormula={String.raw`(o,g,A)=\underbrace{{\rm EVM}_{f}(T,E_H,D_R)}_{\text{Output · gas · accesses 계산}}`}
          operations={[
            { expression: String.raw`{\rm EVM}_{f}(T,E_H,D_R)`, annotation: ["Output · gas · accesses이(가) 식의 결과에","기여하는 방식을 계산합니다.","EVM은 transaction만 보는 함수가 아닙니다."] },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Call transaction",
              description:
                "From·to·value·data·gas와 fee field를 가진 simulation input입니다.",
            },
            {
              symbol: "E_H",
              name: "Block environment at H",
              description:
                "Number·timestamp·beneficiary·base fee·randomness·blob context입니다.",
            },
            {
              symbol: "D_R",
              name: "Proof-backed state view",
              description:
                "Block H의 state root R에 검증된 account·code·storage view입니다.",
            },
            {
              symbol: "f",
              name: "Active execution fork",
              description:
                "Timestamp와 chain schedule로 선택한 opcode·gas rule입니다.",
            },
            {
              symbol: "o,g,A",
              name: "Output · gas · accesses",
              description:
                "Return/revert bytes, 사용 gas와 실제 접근한 state key 집합입니다.",
            },
          ]}
          assumptions={[
            "H·R, transaction request, fork schedule과 state overrides가 실행 동안 바뀌지 않습니다.",
            "모든 state read가 R에 대한 valid proof 또는 명시한 override로 채워집니다.",
            "Local simulation은 mempool admission·ordering·future inclusion과 구분합니다.",
          ]}
          interpretation="같은 T라도 latest head가 바뀌거나 timestamp·base fee·storage가 달라지면 결과가 바뀔 수 있습니다. 따라서 output은 H와 input receipt를 함께 반환·cache해야 합니다."
        />
      </div>

      <div
        id="gas-estimation"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>
          Gas estimation은 현재 구현의 local run 결과이지 inclusion 보장이
          아닙니다
        </h3>
        <p>
          Helios 0.11.1의 Ethereum path는 transaction validation 일부를 끈 local
          execution을 수행하고 그 실행의 <code>gas_used</code>를 반환합니다.
          레거시 설명처럼 고정 10% margin을 더하지 않습니다. Estimate가 성공해도
          head state·base fee·nonce가 변하거나 contract가 남은 gas에 따라 다른
          경로를 타면 실제 submission 결과가 달라질 수 있으므로 block hash,
          fork, tx fields, overrides와 실행 status를 함께 기록합니다.
        </p>
      </div>
    </section>
  );
}
