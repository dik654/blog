import Overview from './multi-agent-implementation/Overview';
import Architecture from './multi-agent-implementation/Architecture';
import LangGraph from './multi-agent-implementation/LangGraph';
import CrewAI from './multi-agent-implementation/CrewAI';
import Manufacturing from './multi-agent-implementation/Manufacturing';

export default function MultiAgentImplementationArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Architecture />
      <LangGraph />
      <CrewAI />
      <Manufacturing />
    </div>
  );
}
