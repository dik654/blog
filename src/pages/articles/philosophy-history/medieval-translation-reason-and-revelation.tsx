import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import FirstCauseDisputeViz from "./medieval-translation-reason-and-revelation/viz/FirstCauseDisputeViz";
import TranslationWebViz from "./medieval-translation-reason-and-revelation/viz/TranslationWebViz";
import { medievalTranslationData } from "./philosophy-history-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...medievalTranslationData,
  figures: {
    picture: { 0: <TranslationWebViz /> },
    mechanism: { 0: <FirstCauseDisputeViz /> },
  },
};

export default function MedievalTranslationReasonAndRevelation() {
  return <PhilosophyHistoryArticle data={data} />;
}
