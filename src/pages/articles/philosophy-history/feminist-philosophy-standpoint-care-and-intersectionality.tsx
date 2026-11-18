import PromotionGapViz from "./feminist-philosophy-standpoint-care-and-intersectionality/viz/PromotionGapViz";
import SingleAxisViz from "./feminist-philosophy-standpoint-care-and-intersectionality/viz/SingleAxisViz";
import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { feministPhilosophyData } from "./philosophy-history-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...feministPhilosophyData,
  figures: {
    "black-box": { 1: <SingleAxisViz /> },
    case: { 0: <PromotionGapViz /> },
  },
};

export default function FeministPhilosophyStandpointCareAndIntersectionality() {
  return <PhilosophyHistoryArticle data={data} />;
}
