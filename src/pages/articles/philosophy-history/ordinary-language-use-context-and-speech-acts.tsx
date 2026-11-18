import FourLineTraceViz from "./ordinary-language-use-context-and-speech-acts/viz/FourLineTraceViz";
import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { ordinaryLanguageData } from "./philosophy-history-modern-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...ordinaryLanguageData,
  figures: {
    mechanism: { 0: <FourLineTraceViz /> },
  },
};

export default function OrdinaryLanguageUseContextAndSpeechActs() {
  return <PhilosophyHistoryArticle data={data} />;
}
