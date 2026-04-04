import Overview from './context-engineering/Overview';
import SystemPrompt from './context-engineering/SystemPrompt';
import RAG from './context-engineering/RAG';
import Memory from './context-engineering/Memory';
import Optimization from './context-engineering/Optimization';

export default function ContextEngineeringArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <SystemPrompt />
      <RAG />
      <Memory />
      <Optimization />
    </div>
  );
}
