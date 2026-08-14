import StepViz from "@/components/ui/step-viz";
import { FlowCard, FlowGrid, FormulaChip } from "./FieldVizPrimitives";

const STEPS = [
  { label: "입력 bound", body: "Operand와 wide accumulator가 REDC가 요구하는 범위인지 확인합니다." },
  { label: "m 선택", body: "m=(Tp′) mod R가 하위 radix word를 취소합니다." },
  { label: "정확한 shift", body: "T+mp는 R의 배수이므로 /R에서 remainder가 없습니다." },
  { label: "범위 보정", body: "결과 bound에 따라 p를 조건부로 빼 canonical internal range로 돌립니다." },
];

export default function MontgomeryFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full space-y-3">
          <FlowGrid>
            <FlowCard active={step === 0} eyebrow="CAUSE" title="wide T와 사전 계산 p′" detail={<FormulaChip>gcd(p,R)=1</FormulaChip>} />
            <FlowCard active={step === 1 || step === 2} eyebrow="TRANSFORM" title="하위 bits를 0으로" detail={<FormulaChip>T+mp ≡ 0 (mod R)</FormulaChip>} />
            <FlowCard active={step === 3} eyebrow="RESULT" title="같은 mod-p 값" detail={<FormulaChip>T·R⁻¹ mod p</FormulaChip>} />
          </FlowGrid>
          <p className="text-center text-xs leading-5 text-muted-foreground">대수적 동치 → exact shift → bounded conditional subtraction</p>
        </div>
      )}
    </StepViz>
  );
}
