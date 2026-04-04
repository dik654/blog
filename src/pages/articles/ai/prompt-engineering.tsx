import Overview from './prompt-engineering/Overview';
import ChainOfThought from './prompt-engineering/ChainOfThought';
import StructuredOutput from './prompt-engineering/StructuredOutput';
import FewShot from './prompt-engineering/FewShot';
import AntiPatterns from './prompt-engineering/AntiPatterns';

export default function PromptEngineeringArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ChainOfThought />
      <StructuredOutput />
      <FewShot />
      <AntiPatterns />
    </div>
  );
}
