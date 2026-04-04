import Overview from './agentic-patterns/Overview';
import ReAct from './agentic-patterns/ReAct';
import PlanExecute from './agentic-patterns/PlanExecute';
import MultiAgent from './agentic-patterns/MultiAgent';
import HooksSkills from './agentic-patterns/HooksSkills';

export default function AgenticPatternsArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ReAct />
      <PlanExecute />
      <MultiAgent />
      <HooksSkills />
    </div>
  );
}
