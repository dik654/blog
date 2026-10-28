import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ExecutionTrace({ onCodeRef }: Props) {
  return (
    <section id="execution-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">ProofDB miss부터 로컬 결과까지</h2>

      <div
        id="proof-db"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>ProofDB는 동기 EVM과 비동기 proof 요청 사이를 잇습니다</h3>
        <p>
          Revm의 <code>Database</code> trait은 account·storage·block hash를 동기
          함수로 요구합니다. 반면 원격 provider에서 proof를 받아 검증하는 일은
          비동기입니다. Helios는 EVM 안에서 network 요청을 기다리지 않습니다.
          필요한 값이 없으면 <code>StateMissing</code>과
          <code>Basic(address)</code>, <code>Storage(address, slot)</code> 또는
          <code>BlockHash(number)</code>를 기록하고 그 실행 시도를 끝냅니다.
        </p>
        <p>
          EVM이 drop되어 mutable borrow가 끝난 뒤 <code>update_state()</code>가
          같은 block hash <code>H</code>에서 account나 slot을 가져옵니다. 이때
          사용하는 <code>get_account</code> 경로는 앞 글에서 본 account·storage·code
          proof를 검증합니다. 검증된 값만 ProofDB의 account map에 추가되고, 그
          다음에야 revm을 새로 만들어 같은 입력을 다시 실행합니다.
        </p>
      </div>

      <div className="not-prose mt-5 flex flex-wrap gap-3">
        <CodeViewButton
          label="ProofDB의 miss와 access 기록 보기"
          onClick={() => onCodeRef("hl-proofdb-state", codeRefs["hl-proofdb-state"])}
        />
        <CodeViewButton
          label="비동기 보충과 replay loop 보기"
          onClick={() => onCodeRef("hl-evm-transact", codeRefs["hl-evm-transact"])}
        />
      </div>

      <div
        id="prefetch"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Prefetch는 실행을 줄이는 hint이지 신뢰 근거가 아닙니다</h3>
        <p>
          Helios 0.11.1의 RPC provider는 먼저 원격
          <code>eth_createAccessList</code>로 예상 address와 storage key를 얻습니다.
          여기에 sender·receiver·block producer를 더하고, 각 항목을
          <code>get_account(..., H)</code>로 가져와 ProofDB를 미리 채웁니다. Access
          list가 정확하면 replay 횟수가 줄어듭니다.
        </p>
        <p>
          하지만 access list 자체는 원격 provider의 예상입니다. 빠진 key가 있으면
          실행 중 miss가 추가로 발견되고, 불필요한 key가 있으면 proof 요청만
          늘어납니다. 최종 state의 신뢰는 access list가 아니라 각
          <code>get_account</code> proof가 만듭니다. 그래서 잘못된 hint는 성능을
          해칠 수 있어도 잘못된 state를 통과시키는 권한을 갖지 않습니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="Access-list prefetch 구현 보기"
          onClick={() => onCodeRef("hl-execution-hint", codeRefs["hl-execution-hint"])}
        />
      </div>

      <div id="eth-call" className="mt-10 scroll-mt-24">
        <ExplainedFormula
          question="Proof-backed eth_call의 결과를 하나로 결정하는 입력은 무엇일까요?"
          idea={
            <>
              EVM은 transaction만 보는 함수가 아닙니다. Verified root에 묶인
              state view, block environment와 active fork를 모두 고정해야 같은
              output·gas·access set을 재현할 수 있습니다.
            </>
          }
          formula={"(o,g,A)={\\rm EVM}_{f}(T,E_H,D_R,O)"}
          annotatedFormula={String.raw`\underbrace{(o,g,A)}_{\text{output·gas·접근 key}}=\underbrace{{\rm EVM}_{f}}_{\text{fork f의 opcode·gas 규칙}}(\underbrace{T}_{\text{call}},\underbrace{E_H}_{\text{block H 환경}},\underbrace{D_R}_{\text{root R의 state}},\underbrace{O}_{\text{명시한 override}})`}
          operations={[
            {
              expression: String.raw`{\rm EVM}_{f}`,
              annotation: [
                "Header timestamp와 chain schedule로 fork f를 고릅니다.",
                "Opcode·gas 규칙이 바뀌면 같은 call도 다른 결과가 납니다.",
              ],
            },
            {
              expression: String.raw`(T,E_H,D_R,O)`,
              annotation: [
                "Call, block 환경, proof-backed state와 override를 고정합니다.",
                "Replay 사이에 한 항목이라도 바뀌면 같은 계산이 아닙니다.",
              ],
            },
            {
              expression: String.raw`(o,g,A)`,
              annotation: [
                "Output·사용 gas·실제 접근 key가 실행에서 나옵니다.",
                "빠진 key는 proof로 채운 뒤 같은 입력으로 다시 계산합니다.",
              ],
            },
          ]}
          terms={[
            { symbol: "T", name: "Call", description: "from·to·value·data·gas·fee field를 가진 simulation 입력입니다." },
            { symbol: "E_H", name: "Block environment", description: "H의 number·timestamp·beneficiary·base fee·randomness입니다." },
            { symbol: "D_R", name: "Proof-backed state", description: "H의 state root R에 연결된 account·code·storage view입니다." },
            { symbol: "O", name: "State override", description: "Caller가 명시적으로 덮은 simulation state이며 chain proof가 아닙니다." },
            { symbol: "f", name: "Active fork", description: "Header timestamp와 fork schedule로 선택한 opcode·gas 규칙입니다." },
            { symbol: "o,g,A", name: "Result", description: "Return 또는 revert bytes, 사용 gas와 실제 접근한 key 집합입니다." },
          ]}
          assumptions={[
            "Block hash H, call T, fork schedule과 state override가 실행과 모든 replay 동안 바뀌지 않습니다.",
            "ProofDB의 chain state는 H의 valid proof로 채우고 override는 별도의 caller input으로 표시합니다.",
            "Local simulation은 mempool admission·ordering·future inclusion과 구분합니다.",
          ]}
          interpretation="Output은 H와 실행 입력이 함께 있을 때만 재현할 수 있습니다. Latest를 replay 중 다시 해석하거나 override를 숨기면 같은 결과라고 비교할 수 없습니다."
        />
      </div>

      <div
        id="failure-boundary"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Miss는 보충할 상태이고, invalid proof는 종료할 오류입니다</h3>
        <p>
          <code>StateMissing</code>은 “이 key가 체인에 없다”는 뜻이 아닙니다. 현재
          ProofDB에 아직 witness가 없다는 제어 신호입니다. Helios는 access를
          보충하고 재실행합니다. 반면 provider 오류, account·storage·code proof
          불일치, block 부재는 같은 입력을 반복한다고 해결되지 않으므로 오류로
          끝납니다.
        </p>
        <p>
          실행이 끝나면 revm의 <code>Success</code>는 output bytes를 반환합니다.
          <code>Revert</code>는 revert data가 있는 오류가 되고, <code>Halt</code>도
          성공 output으로 바뀌지 않습니다. 이 구분 덕분에 “proof를 모두
          받았다”와 “contract call이 성공했다”도 서로 다른 상태로 남습니다.
        </p>
      </div>
    </section>
  );
}
