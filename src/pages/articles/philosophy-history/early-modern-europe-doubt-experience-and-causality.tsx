import PhilosophyHistoryArticle from "./PhilosophyHistoryArticle";
import { earlyModernEuropeData } from "./philosophy-history-data";
import SameRecordQuestionsViz from "./early-modern-europe-doubt-experience-and-causality/viz/SameRecordQuestionsViz";

const data = {
  ...earlyModernEuropeData,
  figures: {
    mechanism: { 0: <SameRecordQuestionsViz /> },
  },
};

export default function EarlyModernEuropeDoubtExperienceAndCausality() {
  return <PhilosophyHistoryArticle data={data} />;
}
