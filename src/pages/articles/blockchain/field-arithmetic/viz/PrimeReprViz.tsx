import StepViz from "@/components/ui/step-viz";
import { FlowCard, FlowGrid, FormulaChip } from "./FieldVizPrimitives";

const STEPS = [
  { label: "Bytes 해석", body: "외부 byte order와 허용 길이를 profile로 고정합니다." },
  { label: "Canonical 검사", body: "0≤x<p만 받아 같은 field element의 중복 encoding을 막습니다." },
  { label: "Limb 분해", body: "x를 radix 2⁶⁴의 little-endian 네 자리로 나눕니다." },
  { label: "내부 domain", body: "연산 전용 Montgomery representation으로 변환하고 타입 안에 숨깁니다." },
];

export default function PrimeReprViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <FlowGrid>
          <FlowCard active={step === 0} eyebrow="INPUT" title="32-byte string" detail={<><FormulaChip>decode_le(bytes)</FormulaChip><p className="mt-2">Wire endian은 limb endian과 별도 계약입니다.</p></>} />
          <FlowCard active={step === 1} eyebrow="VALUE" title="canonical residue" detail={<><FormulaChip>0 ≤ x &lt; p</FormulaChip><p className="mt-2">x=p는 0으로 환원하지 않고 거부합니다.</p></>} />
          <FlowCard active={step >= 2} eyebrow="STORAGE" title="[l₀,l₁,l₂,l₃]" detail={<><FormulaChip>x=Σlᵢ2⁶⁴ⁱ</FormulaChip><p className="mt-2">내부 연산에서는 xR mod p를 저장할 수 있습니다.</p></>} />
        </FlowGrid>
      )}
    </StepViz>
  );
}
