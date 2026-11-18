import PhilosophyTopicArticle, { type PhilosophyTopicArticleData } from "./PhilosophyTopicArticle";
import FrankfurtBranchViz from "./free-will-control-and-responsibility/viz/FrankfurtBranchViz";
import ResponsibilityStagesViz from "./free-will-control-and-responsibility/viz/ResponsibilityStagesViz";
import { freedomData } from "./topic-data";

const data: PhilosophyTopicArticleData = {
  ...freedomData,
  figures: {
    mechanism: { 0: <ResponsibilityStagesViz /> },
    comparison: { 0: <FrankfurtBranchViz /> },
  },
};

export default function FreeWillControlAndResponsibilityArticle() {
  return <PhilosophyTopicArticle data={data} />;
}
