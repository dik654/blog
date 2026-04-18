import Overview from './agent-devlog-patterns/Overview';
import Changelog from './agent-devlog-patterns/Changelog';
import ADR from './agent-devlog-patterns/ADR';
import Lessons from './agent-devlog-patterns/Lessons';
import ThreeLayers from './agent-devlog-patterns/ThreeLayers';

export default function AgentDevlogPatternsArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Changelog />
      <ADR />
      <Lessons />
      <ThreeLayers />
    </div>
  );
}
