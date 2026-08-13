import NarrativeFlowViz from "./narrative-flow-viz";
import type { NarrativeFlowStep } from "./narrative-flow";

interface Props {
  steps: readonly NarrativeFlowStep[];
  refKeys: readonly string[];
  refLabels: readonly string[];
  onOpenCode?: (key: string) => void;
}

/**
 * 구현 흐름과 코드 진입점을 함께 보여 주는 반응형 단계형 viz입니다.
 * 코드처럼 보이기 위한 의사 코드를 SVG에 복제하지 않고 실제 코드 뷰로 연결합니다.
 */
export default function NarrativeCodeViz({
  steps,
  refKeys,
  refLabels,
  onOpenCode,
}: Props) {
  return (
    <NarrativeFlowViz
      steps={steps}
      getCodeAction={
        onOpenCode
          ? (step) => ({
              label: refLabels[step],
              onClick: () => onOpenCode(refKeys[step]),
            })
          : undefined
      }
    />
  );
}
