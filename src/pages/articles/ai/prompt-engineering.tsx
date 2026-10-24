import Overview from "./prompt-engineering/Overview";
import AntiPatterns from "./prompt-engineering/AntiPatterns";
import {
  PromptRequestPathLocator,
  PromptRequestPathMapReturn,
} from "./shared/PromptRequestPathLocator";

export default function PromptEngineeringArticle() {
  return (
    <div className="space-y-12">
      <PromptRequestPathLocator current="contract" />
      <Overview />
      <AntiPatterns />
      <PromptRequestPathMapReturn current="contract" />
    </div>
  );
}
