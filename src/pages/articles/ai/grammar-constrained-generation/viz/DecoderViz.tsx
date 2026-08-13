import NarrativeFlowViz from "@/components/viz/narrative-flow-viz";
import { STEPS } from "./DecoderData";

export default function DecoderViz() {
  return <NarrativeFlowViz steps={STEPS} />;
}
