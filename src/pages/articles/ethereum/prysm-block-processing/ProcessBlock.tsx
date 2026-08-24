import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function ProcessBlock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="process-block" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Header와 RANDAO는 block을 parent·proposer·epoch randomness에 묶는다</h2>
      <div className="not-prose mb-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("on-block", codeRefs["on-block"])} /><span className="text-xs text-muted-foreground">선택한 Prysm snapshot의 block entry</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Header는 네 가지 identity를 먼저 확인합니다</h3>
        <p>Block slot은 이미 진행한 state slot과 같아야 하고 latest header보다 새로워야 합니다. Proposer index는 그 state에서 계산한 proposer와 같아야 하며 parent root는 latest block header의 root와 맞아야 합니다. 이 조건을 통과한 뒤에만 latest block header를 갱신하므로 잘못된 parent 위의 operation이 state를 오염시키지 않습니다.</p>
        <h3>RANDAO reveal은 현재 epoch mix에 한 contribution을 더합니다</h3>
        <p>Proposer는 현재 epoch에 대해 <code>DOMAIN_RANDAO</code>로 BLS 서명한 reveal을 냅니다. Prysm은 올바른 proposer public key와 domain에서 이를 검증한 뒤 hash를 기존 mix와 XOR합니다. XOR은 모든 기여를 결합하지만 마지막 proposer가 block을 내지 않는 선택으로 제한된 bias를 줄 가능성까지 제거하지는 않습니다.</p>
      </div>
      <ExplainedFormula
        question="검증된 RANDAO reveal 하나가 epoch mix를 어떻게 갱신할까요?"
        idea={<>이전 32-byte mix와 reveal의 hash를 bitwise XOR합니다. 어느 한쪽만으로 결과를 정할 수 없게 기여를 누적하지만, reveal을 제출하지 않는 선택까지 없애지는 않습니다.</>}
        formula={String.raw`R_e' = R_e \oplus H(\sigma_{e,p})`}
        annotatedFormula={String.raw`R_e' = \underbrace{R_e \oplus H(\sigma_{e,p})}_{\text{RANDAO reveal 계산}}`}
        operations={[
          { expression: String.raw`R_e \oplus H(\sigma_{e,p})`, annotation: ["RANDAO reveal이(가) 식의 결과에 기여하는 방식을","계산합니다.","이전 32-byte mix와 reveal의 hash를","bitwise XOR합니다."] },
        ]}
        terms={[
          { symbol: "R_e", name: "previous epoch mix", description: "현재 epoch e의 historical-vector 위치에 저장된 32-byte 값입니다." },
          { symbol: String.raw`\sigma_{e,p}`, name: "RANDAO reveal", description: "Proposer p가 epoch e와 RANDAO domain에 서명한 BLS signature입니다." },
          { symbol: "H", name: "hash", description: "Reveal bytes를 mix와 같은 32-byte 폭으로 바꿉니다." },
          { symbol: String.raw`\oplus`, name: "bitwise XOR", description: "같은 bit 위치를 배타적 논리합으로 결합합니다." },
        ]}
        assumptions={["Reveal signature, proposer identity, epoch domain을 먼저 검증합니다.", "Vector index와 hash 함수는 활성 fork/preset 규격을 따릅니다."]}
        interpretation="서로 다른 유효 reveal은 mix를 바꿉니다. 그러나 이 식만으로 unbiased public randomness나 proposer honesty가 증명되지는 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><h3>중간 결과는 stage receipt로 남깁니다</h3><p>Block root, fork, pre-state root, header check, proposer/signing root, old/new RANDAO mix와 handler index를 함께 남기면 어느 단계에서 divergence가 시작됐는지 찾을 수 있습니다. Handler 안에서 error가 나면 candidate state를 폐기하고 공유 state/cache에 부분 변경이 노출되지 않아야 합니다.</p></div>
    </section>
  );
}
