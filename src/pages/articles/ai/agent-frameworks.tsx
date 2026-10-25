import Overview from "./agent-frameworks/Overview";
import LangChain from "./agent-frameworks/LangChain";
import { AgentRuntimePathLocator, AgentRuntimePathReturn } from "./shared/AgentRuntimePathLocator";

export default function AgentFrameworksArticle() {
  return (
    <article className="space-y-12">
      <AgentRuntimePathLocator />
      <Overview />
      <LangChain />
      <AgentRuntimePathReturn />
    </article>
  );
}
