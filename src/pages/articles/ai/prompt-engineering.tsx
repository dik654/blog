import Overview from "./prompt-engineering/Overview";
import AntiPatterns from "./prompt-engineering/AntiPatterns";

export default function PromptEngineeringArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <AntiPatterns />
    </div>
  );
}
