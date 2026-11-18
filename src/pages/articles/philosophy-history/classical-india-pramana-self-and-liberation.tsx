import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import FourRecordsSortViz from "./classical-india-pramana-self-and-liberation/viz/FourRecordsSortViz";
import IndependenceCheckViz from "./classical-india-pramana-self-and-liberation/viz/IndependenceCheckViz";
import TextTransmissionViz from "./classical-india-pramana-self-and-liberation/viz/TextTransmissionViz";
import { classicalIndiaData } from "./philosophy-history-data";

const data: PhilosophyHistoryArticleData = {
  ...classicalIndiaData,
  figures: {
    case: { 1: <FourRecordsSortViz /> },
    names: { 0: <TextTransmissionViz /> },
    mechanism: { 0: <IndependenceCheckViz /> },
  },
};

export default function ClassicalIndiaPramanaSelfAndLiberation() {
  return <PhilosophyHistoryArticle data={data} />;
}
