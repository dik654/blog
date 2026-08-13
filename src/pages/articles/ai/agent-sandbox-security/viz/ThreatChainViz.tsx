import NarrativeFlowViz from "@/components/viz/narrative-flow-viz";
import { THREAT_CHAIN } from "@/content/agent-sandbox-security";

export default function ThreatChainViz() {
  return (
    <NarrativeFlowViz
      steps={THREAT_CHAIN.map((step) => ({
        label: `${step.label} — ${step.question}`,
      }))}
    />
  );
}
