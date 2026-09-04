import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ERC4337Viz from "./viz/ERC4337Viz";

export default function ERC4337() {
  return (
    <section id="erc4337" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ERC-4337은 별도 UserOperation 경로를 기존 Ethereum transaction 위에 올립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ERC-4337은 consensus transaction type을 바꾸지 않습니다. 사용자는 <code>UserOperation</code>을 만들고, bundler가 이를 simulation한 뒤 여러 건을
          EntryPoint의 <code>handleOps</code> transaction으로 묶어 제출합니다. EntryPoint는 account와 선택적 paymaster validation을 실행하고 prefund를 확보한 뒤 call을 실행합니다.
          따라서 UserOperation은 on-chain transaction과 동일한 객체가 아니며, bundler가 제출한 outer transaction 안에서 처리됩니다.
        </p>
      </div>
      <ERC4337Viz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>UserOperation identity는 callData만으로 만들지 않습니다</h3>
        <p>
          같은 call이라도 sender·nonce·gas fields·paymaster data·chain ID·EntryPoint가 다르면 다른 authorization입니다. 실제 wire format은 EntryPoint version에 따라
          unpacked와 <code>PackedUserOperation</code> 표현이 달라지므로, SDK object 모양보다 target EntryPoint와 spec version을 receipt에 고정해야 합니다.
        </p>
        <h3>Bundler는 admission과 inclusion을 구분합니다</h3>
        <p>
          첫 simulation은 signature·prefund·validation rule을 확인해 mempool admission을 결정합니다. 이후 validation이 읽는
          state를 다른 transaction이 바꿀 수 있으므로 bundle을 만들기 직전에 다시 검증합니다. 첫 simulation 성공은 inclusion 보장이 아니고
          validation reject와 account execution revert도 서로 다른 outcome입니다. ERC-7562의 opcode·storage·reputation
          제한은 arbitrary validation이 대량 무효화를 일으키는 DoS surface를 줄이려는 규칙입니다.
        </p>
      </div>

      <ExplainedFormula
        question="Bundler가 한 UserOperation에서 먼저 확보해야 할 최대 gas 비용은 얼마일까요?"
        idea="Validation·execution·calldata 보상 예산을 같은 gas 단위로 더한 뒤 fee-per-gas 상한을 곱합니다. 실제 settlement는 사용량과 effective gas price에 따라 더 작아질 수 있습니다."
        formula={String.raw`C_{\max}=(G_{verify}+G_{call}+G_{pre})\,F_{\max}`}
        annotatedFormula={String.raw`C_{\max}=\underbrace{(G_{verify}+G_{call}+G_{pre})\,F_{\max}}_{\text{경계 후보 선택}}`}
        operations={[
          { expression: String.raw`(G_{verify}+G_{call}+G_{pre})\,F_{\max}`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Validation·execution·calldata 보상","예산을 같은 gas 단위로 더한 뒤 fee-per-gas","상한을 곱합니다."] },
        ]}
        terms={[
          { symbol: "G_{verify}", name: "Validation gas", description: "Account와 paymaster validation에 잡은 gas 상한입니다." },
          { symbol: "G_{call}", name: "Call gas", description: "Account main execution에 잡은 gas 상한입니다." },
          { symbol: "G_{pre}", name: "Pre-verification gas", description: "Calldata·bundle overhead 등 EntryPoint 밖 비용을 보상하는 gas입니다." },
          { symbol: "F_{max}", name: "Maximum fee", description: "사용자가 허용한 gas당 최대 fee입니다." },
        ]}
        assumptions={[
          "예시는 paymaster 전용 gas fields와 postOp 추가 예산을 생략한 단순 장부입니다.",
          "Gas 단위와 gwei를 곱한 뒤 ETH로 바꿀 때 1 gwei=10^-9 ETH를 사용합니다.",
          "충분한 prefund는 validation 성공·실행 성공·inclusion을 보장하지 않습니다.",
        ]}
        interpretation="50,000+80,000+20,000=150,000 gas이고 Fmax=20 gwei라면 Cmax=3,000,000 gwei=0.003 ETH입니다. 이 값은 worst-case reserve이며 실제 receipt의 gasUsed와 같다고 단정하지 않습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Paymaster는 무료 gas가 아니라 조건부 예산 owner입니다</h3>
        <p>
          Paymaster는 EntryPoint에 stake와 deposit을 두고 어떤 UserOperation을 sponsor할지 validation합니다. DApp allowlist·quota·validity window·price quote를 통과해도
          execution이 예상보다 비싸거나 <code>postOp</code>가 실패할 수 있으므로 stable sponsorship ID, 최대 비용, terminal settlement를 함께 기록해야 합니다.
          사용자가 ERC-20으로 비용을 내는 경우에도 on-chain gas payer와 사용자에게 청구하는 asset·환율·slippage는 서로 다른 장부입니다.
        </p>
        <p>
          제출 직후 RPC timeout이 났다면 같은 UserOperation을 곧바로 다시 보내지 않습니다. stable sponsorship ID와 UserOperation hash로
          <code>UserOperationEvent</code>를 조회하고, 아직 결과가 없으면 상태를 <code>pending</code> 또는 <code>unknown</code>으로 남깁니다. 그 뒤
          EntryPoint deposit 변화와 <code>postOp</code> 결과를 대조해 terminal settlement를 확정해야 이중 sponsor와 이중 청구를 피할 수 있습니다.
        </p>
      </div>

      <div id="paper-erc4337-spec" className="scroll-mt-24">
        <CitationBlock source="ERC-4337 · Account Abstraction Using Alt Mempool" href="https://eips.ethereum.org/EIPS/eip-4337" citeKey={1}>
          문제: consensus 변경 없이 contract account가 자체 validation과 gas payment를 제공해야 합니다. 기여: UserOperation·bundler·EntryPoint·paymaster와 simulation·bundling contract를 정의합니다. 전제: target EntryPoint version·chain ID·mempool profile을 고정합니다. 근거 범위: ERC-4337 protocol입니다. 비주장: 특정 wallet의 보안·고정 gas 비용·inclusion을 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-erc7562-validation" className="scroll-mt-24">
        <CitationBlock source="ERC-7562 · Account Abstraction Validation Scope Rules" href="https://eips.ethereum.org/EIPS/eip-7562" citeKey={2}>
          문제: mutable EVM validation이 UserOperation 대량 무효화와 mempool DoS를 만들 수 있습니다. 기여: validation phase의 opcode·storage·entity reputation·second validation 규칙을 정의합니다. 전제: canonical 또는 declared alternative mempool profile과 bundler 정책을 고정합니다. 근거 범위: off-chain admission safety입니다. 비주장: execution phase 전체를 sandbox하거나 malicious wallet code를 자동 교정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
