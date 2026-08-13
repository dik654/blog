import NarrativeFlowViz from "@/components/viz/narrative-flow-viz";
import { STACK_STEPS } from "./StackData";

export default function StackViz() {
  return <NarrativeFlowViz steps={STACK_STEPS} />;
}
