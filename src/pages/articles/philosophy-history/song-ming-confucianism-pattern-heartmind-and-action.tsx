import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { songMingConfucianismData } from "./philosophy-history-expansion-data";
import SampleBagsViz from "./song-ming-confucianism-pattern-heartmind-and-action/viz/SampleBagsViz";

const data: PhilosophyHistoryArticleData = {
  ...songMingConfucianismData,
  figures: {
    case: { 0: <SampleBagsViz /> },
  },
};

export default function SongMingConfucianismPatternHeartmindAndAction() {
  return <PhilosophyHistoryArticle data={data} />;
}
