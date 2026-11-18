import AttractionWorthMapViz from "./meaning-in-life-attraction-worth-and-commitment/viz/AttractionWorthMapViz";
import CommitmentLoopViz from "./meaning-in-life-attraction-worth-and-commitment/viz/CommitmentLoopViz";
import PhilosophyTopicArticle, { type PhilosophyTopicArticleData } from "./PhilosophyTopicArticle";
import { meaningData } from "./topic-data";

const data: PhilosophyTopicArticleData = {
  ...meaningData,
  figures: {
    mechanism: { 0: <CommitmentLoopViz /> },
    comparison: { 0: <AttractionWorthMapViz /> },
  },
};

export default function MeaningInLifeAttractionWorthAndCommitmentArticle() {
  return <PhilosophyTopicArticle data={data} />;
}
