import StepViz from "@/components/ui/step-viz";
import { FlowCard, FlowGrid, FormulaChip } from "./FieldVizPrimitives";

const STEPS = [
  { label: "Decode", body: "길이·endian·canonical range를 확인한 값만 생성합니다." },
  { label: "Add/Sub", body: "carry/borrow와 bounded correction으로 같은 domain을 유지합니다." },
  { label: "Mul/Inv", body: "Montgomery product와 zero-aware inverse가 typed outcome을 반환합니다." },
  { label: "Encode/Test", body: "normal residue bytes와 independent bigint oracle을 대조합니다." },
];

export default function OperatorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <FlowGrid>
          <FlowCard active={step === 0} eyebrow="CONSTRUCT" title="bytes → Fp" detail={<FormulaChip>Result&lt;Fp, DecodeError&gt;</FormulaChip>} />
          <FlowCard active={step === 1 || step === 2} eyebrow="OPERATE" title="Fp × Fp → Fp" detail={<FormulaChip>invariant preserved</FormulaChip>} />
          <FlowCard active={step === 3} eyebrow="OBSERVE" title="Fp → bytes + receipt" detail={<FormulaChip>round-trip ∧ parity</FormulaChip>} />
        </FlowGrid>
      )}
    </StepViz>
  );
}
