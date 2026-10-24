import Overview from "./xml-prompting/Overview";
import BasicTags from "./xml-prompting/BasicTags";
import AdvancedTags from "./xml-prompting/AdvancedTags";
import Parsing from "./xml-prompting/Parsing";
import BestPractices from "./xml-prompting/BestPractices";
import { XmlPromptPathLocator, XmlPromptPathMapReturn } from "./xml-prompting/XmlPromptPath";
import XmlPromptLifecycleViz from "./xml-prompting/viz/XmlPromptLifecycleViz";

export default function XmlPromptingArticle() {
  return (
    <div className="space-y-12">
      <XmlPromptPathLocator />
      <div className="not-prose">
        <XmlPromptLifecycleViz />
      </div>
      <Overview />
      <BasicTags />
      <AdvancedTags />
      <Parsing />
      <BestPractices />
      <XmlPromptPathMapReturn />
    </div>
  );
}
