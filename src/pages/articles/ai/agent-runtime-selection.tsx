import Comparison from "./agent-frameworks/Comparison";
import {
  AgentRuntimeSelectionLocator,
  AgentRuntimeSelectionReturn,
} from "./shared/AgentRuntimePathLocator";

export default function AgentRuntimeSelectionArticle() {
  return (
    <article className="space-y-12">
      <div id="overview" className="scroll-mt-20">
        <AgentRuntimeSelectionLocator />
      </div>
      <Comparison />
      <AgentRuntimeSelectionReturn />
    </article>
  );
}
