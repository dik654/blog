import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import NativeAAViz from "./viz/NativeAAViz";

export default function NativeAA() {
  return (
    <section id="native-aa" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">EIP-7702 delegation과 native AA proposal은 같은 단계가 아닙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          2026-08-14 기준 EIP-7702는 <strong>Final</strong>인 type-4 transaction 규칙입니다. EOA가 authorization tuple에 서명하면 client는 해당 계정 code에
          <code>0xef0100 || delegate_address</code>라는 delegation indicator를 기록하고, 이후 실행은 delegate code를 EOA storage·balance context에서 사용합니다.
          반면 EIP-7701은 validation·execution phase를 protocol transaction으로 제공하려던 <strong>Withdrawn proposal</strong>입니다. 둘을 “도입된 native AA” 하나로 묶으면 현재 지원 상태를 잘못 전달합니다.
        </p>
      </div>
      <NativeAAViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>EIP-7702 authorization은 실행 call과 별도이며 persistent합니다</h3>
        <p>
          Tuple은 <code>[chain_id, address, nonce, y_parity, r, s]</code>를 담습니다. Client는 chain·nonce·signature·authority code 조건을 확인한 뒤 delegation을 기록하며,
          outer transaction execution이 revert하더라도 이미 처리된 delegation indicator는 자동으로 되돌아가지 않습니다. 따라서 wallet은 dApp이 임의 delegate authorization을 제안하게 해서는 안 되며,
          delegate code hash·upgrade authority·initialization·storage layout을 고위험 배포처럼 검토해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="EIP-7702 authorization이 다른 chain이나 다른 delegate로 재사용되지 않게 무엇을 서명할까요?"
        idea="Authorization의 용도 표식과 chain·delegate·nonce를 함께 RLP encode한 뒤 hash합니다. Chain ID 0은 여러 chain에서 유효하도록 의도한 예외이므로 더 강한 deployment 동일성 검사가 필요합니다."
        formula={String.raw`m=\operatorname{keccak256}(\mathtt{0x05}\,\|\,\operatorname{rlp}([c,a,n]))`}
        annotatedFormula={String.raw`m=\underbrace{\operatorname{keccak256}(\mathtt{0x05}\,\|\,\operatorname{rlp}([c,a,n]))}_{\text{Magic 계산}}`}
        operations={[
          { expression: String.raw`\operatorname{keccak256}(\mathtt{0x05}\,\|\,\operatorname{rlp}([c,a,n]))`, annotation: ["Magic이(가) 식의 결과에 기여하는 방식을 계산합니다.","Authorization의 용도 표식과","chain·delegate·nonce를 함께 RLP","encode한 뒤 hash합니다."] },
        ]}
        terms={[
          { symbol: "c", name: "Chain ID", description: "Authorization이 유효한 chain이며 0은 chain-independent 선택입니다." },
          { symbol: "a", name: "Delegate address", description: "EOA context에서 실행할 code pointer입니다." },
          { symbol: "n", name: "Authority nonce", description: "같은 authorization의 replay와 ordering을 제한합니다." },
          { symbol: String.raw`\mathtt{0x05}`, name: "Magic", description: "일반 transaction signature와 authorization domain을 분리합니다." },
        ]}
        assumptions={[
          "secp256k1 signature recovery와 low-s 규칙을 별도로 검증합니다.",
          "Delegate address의 code가 여러 chain에서 같다는 사실은 chain ID 0만으로 보장되지 않습니다.",
          "Authorization 유효성은 delegate contract의 안전한 권한·upgrade·storage 설계를 보증하지 않습니다.",
        ]}
        interpretation="같은 nonce라도 c나 a가 바뀌면 signed message가 달라집니다. 그러나 c=0을 선택하면 cross-chain replay가 의도된 만큼, code identity와 initialization을 chain마다 확인해야 합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>어떤 경로를 고를지는 기능 수가 아니라 배포 경계로 결정합니다</h3>
        <p>
          ERC-4337은 현재 chain에서 지원되는 EntryPoint·bundler·paymaster ecosystem이 필요하고, EIP-7702는 type-4 transaction과 안전한 delegate implementation이 필요합니다.
          Native AA는 각 chain의 protocol/RIP 구현 상태를 따로 확인해야 합니다. Migration 전에는 기존 EOA key가 남기는 authority, account address 보존, module storage 충돌,
          revoke/upgrade 경로와 기존 dApp의 <code>tx.origin</code>·code-size 가정을 test matrix로 고정합니다.
        </p>
      </div>

      <div id="paper-eip7702-delegation" className="scroll-mt-24">
        <CitationBlock source="EIP-7702 · Set Code for EOAs" href="https://eips.ethereum.org/EIPS/eip-7702" citeKey={3}>
          문제: 기존 EOA 주소를 유지하면서 batching·sponsorship·권한 축소를 가능하게 해야 합니다. 기여: type-4 transaction, authorization tuple과 persistent delegation indicator를 규정합니다. 전제: Final spec·활성 fork·delegate code를 고정합니다. 근거 범위: protocol delegation semantics입니다. 비주장: delegate contract의 보안·ERC-4337 호환성·완전한 key abstraction을 자동 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-eip7701-native-status" className="scroll-mt-24">
        <CitationBlock source="EIP-7701 · Native Account Abstraction (Withdrawn)" href="https://eips.ethereum.org/EIPS/eip-7701" citeKey={4}>
          문제: validation·execution·paymaster phase를 protocol transaction에 직접 넣는 설계를 탐색했습니다. 기여: role별 frame과 gas accounting proposal을 제시했습니다. 전제: 문서 상태가 Withdrawn임을 함께 표시합니다. 근거 범위: 설계 비교와 실패한 proposal의 아이디어입니다. 비주장: Ethereum L1에 배포되었거나 ERC-4337을 대체할 확정 roadmap이라고 말하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
