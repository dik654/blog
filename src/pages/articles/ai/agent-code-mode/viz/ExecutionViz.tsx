import NarrativeFlowViz from "@/components/viz/narrative-flow-viz";
import { STEPS } from "./ExecutionData";

export default function ExecutionViz() {
  return <NarrativeFlowViz steps={STEPS} />;
}
