import PhilosophyHistoryArticle from "./PhilosophyHistoryArticle";
import { earlyModernIndiaData } from "./philosophy-history-expansion-data";
import MarkerMismatchViz from "./early-modern-india-new-nyaya-analysis-and-language/viz/MarkerMismatchViz";
import PlotNarrowingViz from "./early-modern-india-new-nyaya-analysis-and-language/viz/PlotNarrowingViz";

const data = {
  ...earlyModernIndiaData,
  figures: {
    case: { 0: <PlotNarrowingViz /> },
    mechanism: { 1: <MarkerMismatchViz /> },
  },
};

export default function EarlyModernIndiaNewNyayaAnalysisAndLanguage() {
  return <PhilosophyHistoryArticle data={data} />;
}
