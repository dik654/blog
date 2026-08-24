import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function JustificationFinalization({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="justification-finalization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Justification은 weight threshold이고 finalization은 checkpoint pattern이다</h2>
      <div className="not-prose mb-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("process-justification", codeRefs["process-justification"])} /><span className="text-xs text-muted-foreground">Prysm checkpoint transition seam</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Validator 수를 세는 대신 effective balance를 셉니다. 이전·현재 epoch의 timely target에 참여했고 slashed되지 않은 validator weight를 전체 active balance와 비교해 checkpoint를 justified합니다. 그 뒤 최근 justification pattern과 checkpoint epoch 거리 조건이 맞으면 더 오래된 checkpoint를 finalized로 옮깁니다.</p>
      </div>
      <ExplainedFormula
        question="Target vote가 checkpoint를 justify할 만큼 충분한지 어떻게 판정할까요?"
        idea={<>분수를 부동소수점으로 계산하지 않고 참여 weight의 세 배와 전체 active weight의 두 배를 정수로 비교합니다.</>}
        formula={String.raw`3A_{\mathrm{target}} \ge 2A_{\mathrm{active}}`}
        terms={[
          { symbol: "A_{\\mathrm{target}}", name: "target-attesting balance", description: "해당 epoch target에 timely하게 참여한 unslashed validator의 effective balance 합이며 단위는 Gwei입니다." },
          { symbol: "A_{\\mathrm{active}}", name: "total active balance", description: "그 epoch의 활성 validator effective balance 총합이며 같은 Gwei 단위를 씁니다." },
        ]}
        assumptions={["두 합은 같은 epoch·validator registry snapshot과 fork 규칙에서 계산합니다.", "Signature, committee membership, target root와 timeliness를 이미 검증한 participation만 셉니다."]}
        interpretation="Active balance가 96 Gwei인 작은 예에서 target 참여가 64 Gwei면 192≥192로 threshold를 만족하지만 63 Gwei면 189<192로 실패합니다. 이 threshold 하나만으로 즉시 finalization되는 것은 아닙니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Justification bits는 최근 역사를 압축한 state입니다</h3>
        <p>첫 두 epoch의 genesis stub 예외를 건너뛴 뒤 previous/current target balance를 계산하고, 기존 bitvector를 이동해 새 결과를 기록합니다. Finalization은 old previous/current justified checkpoint와 여러 bit pattern의 epoch 거리를 함께 검사합니다. 따라서 “두 epoch가 2/3이면 무조건 final”이라는 요약은 실패 recovery pattern을 설명하지 못합니다.</p>
        <h3>Finalized는 현재 head와 다른 시간축입니다</h3>
        <p>새 attestation으로 fork-choice head가 같은 slot 안에서도 바뀔 수 있지만 finalized checkpoint는 epoch-level supermajority pattern으로 움직입니다. API·cache·pruning에서 head·justified/safe·finalized identity를 명시하지 않으면 reorg 중 서로 다른 branch state를 섞게 됩니다.</p>
      </div>
    </section>
  );
}
