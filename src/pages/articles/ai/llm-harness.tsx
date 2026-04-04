import Overview from './llm-harness/Overview';
import Composition from './llm-harness/Composition';
import Evaluation from './llm-harness/Evaluation';
import Iteration from './llm-harness/Iteration';
import Patterns from './llm-harness/Patterns';

export default function LlmHarnessArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Composition />
      <Evaluation />
      <Iteration />
      <Patterns />
    </div>
  );
}
