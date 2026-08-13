import NarrativeFlowViz from "@/components/viz/narrative-flow-viz";
import { PIPELINE_STEPS } from "./PipelineData";

export default function PipelineViz() {
  return <NarrativeFlowViz steps={PIPELINE_STEPS} />;
}
