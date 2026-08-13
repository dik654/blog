import CostModel from "./agent-code-mode/CostModel";
import Decision from "./agent-code-mode/Decision";
import Execution from "./agent-code-mode/Execution";
import Overview from "./agent-code-mode/Overview";
import Security from "./agent-code-mode/Security";

export default function AgentCodeModeArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <CostModel />
      <Execution />
      <Security />
      <Decision />
    </div>
  );
}
