import PhilosophyTopicArticle, { type PhilosophyTopicArticleData } from "./PhilosophyTopicArticle";
import PartsReplacementViz from "./identity-through-change/viz/PartsReplacementViz";
import PersistenceViewsViz from "./identity-through-change/viz/PersistenceViewsViz";
import { identityData } from "./topic-data";

const data: PhilosophyTopicArticleData = {
  ...identityData,
  figures: {
    case: { 0: <PartsReplacementViz /> },
    comparison: { 0: <PersistenceViewsViz /> },
  },
};

export default function IdentityThroughChangeArticle() {
  return <PhilosophyTopicArticle data={data} />;
}
