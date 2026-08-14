import StepViz from "@/components/ui/step-viz";
import { FlowCard, FlowGrid, FormulaChip } from "./FieldVizPrimitives";

const STEPS = [
  { label: "일반 residue", body: "작은 예는 p=17, R=32, a=7, b=5입니다." },
  { label: "R-domain 진입", body: "ã=7R mod17=3, b̃=5R mod17=7입니다." },
  { label: "Wide product", body: "T=ãb̃=21을 계산하되 아직 normal residue가 아닙니다." },
  { label: "REDC", body: "p′=15, m=27이라 (21+27·17)/32=15입니다." },
  { label: "Decode", body: "REDC(15)=1이고 7·5 mod17=1과 같습니다." },
];

export default function MontgomeryStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <FlowGrid>
          <FlowCard active={step <= 1} eyebrow="ENTER" title="a,b → ã,b̃" detail={<><FormulaChip>7,5 → 3,7</FormulaChip><p className="mt-2">변환은 계산 경계에서 한 번 수행합니다.</p></>} />
          <FlowCard active={step === 2 || step === 3} eyebrow="COMPUTE" title="multiply + REDC" detail={<><FormulaChip>T=21 → 15</FormulaChip><p className="mt-2">15는 답 1의 R-domain 표현입니다.</p></>} />
          <FlowCard active={step === 4} eyebrow="EXIT" title="canonical result" detail={<><FormulaChip>15R⁻¹ mod17=1</FormulaChip><p className="mt-2">Serialization 직전에 normal residue로 돌아옵니다.</p></>} />
        </FlowGrid>
      )}
    </StepViz>
  );
}
