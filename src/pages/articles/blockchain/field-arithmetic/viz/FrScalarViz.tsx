import StepViz from "@/components/ui/step-viz";
import { FlowCard, FlowGrid, FormulaChip } from "./FieldVizPrimitives";

const STEPS = [
  { label: "Field ID", body: "같은 limb 폭보다 modulus와 semantic type을 먼저 봅니다." },
  { label: "Fp/Fq", body: "Curve 좌표와 extension tower의 base arithmetic입니다." },
  { label: "Fr", body: "Prime-order subgroup의 scalar arithmetic입니다." },
  { label: "교차 경계", body: "Explicit conversion 없이 Fp와 Fr를 섞지 않고 protocol encoding도 따로 둡니다." },
];

export default function FrScalarViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <FlowGrid>
          <FlowCard active={step === 1} eyebrow="BASE FIELD" title="Fp coordinate" detail={<><FormulaChip>y²=x³+3 mod p</FormulaChip><p className="mt-2">Point가 사는 좌표 공간입니다.</p></>} />
          <FlowCard active={step === 2} eyebrow="SCALAR FIELD" title="Fr coefficient" detail={<><FormulaChip>[k]P, k mod r</FormulaChip><p className="mt-2">Point addition의 반복 횟수입니다.</p></>} />
          <FlowCard active={step === 0 || step === 3} eyebrow="TYPE GATE" title="p ≠ r" detail={<><FormulaChip>decode_fp ≠ decode_fr</FormulaChip><p className="mt-2">크기와 limb 수가 같아도 자동 변환하지 않습니다.</p></>} />
        </FlowGrid>
      )}
    </StepViz>
  );
}
