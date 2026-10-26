import Overview from "./multi-agent-implementation/Overview";
import Architecture from "./multi-agent-implementation/Architecture";
import LangGraph from "./multi-agent-implementation/LangGraph";
import CrewAI from "./multi-agent-implementation/CrewAI";
import Manufacturing from "./multi-agent-implementation/Manufacturing";
import {
  AgentDelegationImplementationLocator,
  AgentDelegationImplementationReturn,
} from "./shared/AgentDelegationPathLocator";

export default function MultiAgentImplementationArticle() {
  return (
    <div className="space-y-12">
      <AgentDelegationImplementationLocator />
      <Overview />
      <Architecture />
      <LangGraph />
      <CrewAI />
      <Manufacturing />
      <AgentDelegationImplementationReturn />
    </div>
  );
}
