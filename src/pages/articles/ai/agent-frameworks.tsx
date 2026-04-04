import Overview from './agent-frameworks/Overview';
import LangChain from './agent-frameworks/LangChain';
import Comparison from './agent-frameworks/Comparison';

export default function AgentFrameworksArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <LangChain />
      <Comparison />
    </div>
  );
}
