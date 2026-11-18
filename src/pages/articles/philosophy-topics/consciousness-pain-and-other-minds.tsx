import EvidencePathViz from "./consciousness-pain-and-other-minds/viz/EvidencePathViz";
import PhilosophyTopicArticle, { type PhilosophyTopicArticleData } from "./PhilosophyTopicArticle";
import { consciousnessData } from "./topic-data";

const data: PhilosophyTopicArticleData = {
  ...consciousnessData,
  figures: {
    mechanism: { 0: <EvidencePathViz /> },
  },
};

export default function ConsciousnessPainAndOtherMindsArticle() {
  return <PhilosophyTopicArticle data={data} />;
}
