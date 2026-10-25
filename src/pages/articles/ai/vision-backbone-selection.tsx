import Overview from "./vision-backbone-selection/Overview";
import ObjectiveAxes from "./vision-backbone-selection/ObjectiveAxes";
import TaskMapping from "./vision-backbone-selection/TaskMapping";
import MeasureFirst from "./vision-backbone-selection/MeasureFirst";
import CostAndSwitch from "./vision-backbone-selection/CostAndSwitch";
import DecisionGate from "./vision-backbone-selection/DecisionGate";

/**
 * Vision Backbone 선택: 과제에서 배포까지
 *
 * 비전 5편 시리즈의 마지막 글. 앞의 네 글에서 세운 개념을 선택 기준으로 묶는다.
 */
export default function VisionBackboneSelectionArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <ObjectiveAxes />
      <TaskMapping />
      <MeasureFirst />
      <CostAndSwitch />
      <DecisionGate />
    </div>
  );
}
