import ListeningPassesViz from "./aesthetic-taste-judgment-and-context/viz/ListeningPassesViz";
import VoteAndReasonViz from "./aesthetic-taste-judgment-and-context/viz/VoteAndReasonViz";
import PhilosophyTopicArticle, { type PhilosophyTopicArticleData } from "./PhilosophyTopicArticle";
import { aestheticsData } from "./topic-data";

const data: PhilosophyTopicArticleData = {
  ...aestheticsData,
  figures: {
    case: { 0: <VoteAndReasonViz /> },
    mechanism: { 0: <ListeningPassesViz /> },
  },
};

export default function AestheticTasteJudgmentAndContextArticle() {
  return <PhilosophyTopicArticle data={data} />;
}
