import MethodLoopViz from "./modern-methods-pragmatism-analysis-and-phenomenology/viz/MethodLoopViz";
import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { twentiethCenturyMethodsData } from "./philosophy-history-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...twentiethCenturyMethodsData,
  figures: {
    mechanism: { 0: <MethodLoopViz /> },
  },
};

export default function ModernMethodsPragmatismAnalysisAndPhenomenology() {
  return <PhilosophyHistoryArticle data={data} />;
}
