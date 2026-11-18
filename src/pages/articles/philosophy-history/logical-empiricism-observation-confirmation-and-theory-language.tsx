import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import CalibrationLedgerViz from "./logical-empiricism-observation-confirmation-and-theory-language/viz/CalibrationLedgerViz";
import PremiseBundleViz from "./logical-empiricism-observation-confirmation-and-theory-language/viz/PremiseBundleViz";
import { logicalEmpiricismData } from "./philosophy-history-modern-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...logicalEmpiricismData,
  figures: {
    "black-box": { 0: <PremiseBundleViz /> },
    case: { 0: <CalibrationLedgerViz /> },
  },
};

export default function LogicalEmpiricismObservationConfirmationAndTheoryLanguage() {
  return <PhilosophyHistoryArticle data={data} />;
}
