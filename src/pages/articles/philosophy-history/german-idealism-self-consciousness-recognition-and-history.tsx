import DeskRuleViz from "./german-idealism-self-consciousness-recognition-and-history/viz/DeskRuleViz";
import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { germanIdealismData } from "./philosophy-history-modern-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...germanIdealismData,
  figures: {
    case: { 0: <DeskRuleViz /> },
  },
};

export default function GermanIdealismSelfConsciousnessRecognitionAndHistory() {
  return <PhilosophyHistoryArticle data={data} />;
}
