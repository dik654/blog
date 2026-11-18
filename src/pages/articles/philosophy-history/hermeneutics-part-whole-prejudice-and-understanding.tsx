import ReadingTwiceViz from "./hermeneutics-part-whole-prejudice-and-understanding/viz/ReadingTwiceViz";
import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { hermeneuticsData } from "./philosophy-history-modern-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...hermeneuticsData,
  figures: {
    case: { 0: <ReadingTwiceViz /> },
  },
};

export default function HermeneuticsPartWholePrejudiceAndUnderstanding() {
  return <PhilosophyHistoryArticle data={data} />;
}
